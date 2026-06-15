import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMicrophone, FaHeart, FaGift, FaStar } from 'react-icons/fa';
import { useMicrophone } from '../../hooks/useMicrophone';
import { playBirthdayMelody } from '../../utils/birthdayMelody';
import styles from './Cake.module.css';

const CONFETTI_COLORS = ['#FF6B8A', '#FFD700', '#E91E8C', '#9B59B6', '#FFD6E0', '#FFFFFF', '#FF8FAB', '#C77DFF'];
const TOTAL_CANDLES = 5;

export default function Cake({ onComplete }) {
  const [candlesBlown, setCandlesBlown] = useState(0);
  const [blowCount, setBlowCount] = useState(0);
  const [allBlown, setAllBlown] = useState(false);
  const [showWish, setShowWish] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const [blownCandles, setBlownCandles] = useState(new Set());
  const [smokeCandles, setSmokeCandles] = useState(new Set());
  const melodyPlayed = useRef(false);

  const blowCandle = useCallback(() => {
    setBlowCount((prev) => {
      if (prev >= 2) return prev;
      const nextCount = prev + 1;

      let extinguished = [];
      if (nextCount === 1) {
        // First blow extinguishes 3 candles
        extinguished = [0, 1, 2];
      } else if (nextCount === 2) {
        // Second blow extinguishes the remaining 2 candles
        extinguished = [3, 4];
      }

      setBlownCandles((set) => {
        const newSet = new Set(set);
        extinguished.forEach((idx) => newSet.add(idx));
        return newSet;
      });

      setSmokeCandles((set) => {
        const newSet = new Set(set);
        extinguished.forEach((idx) => newSet.add(idx));
        return newSet;
      });

      // Clear smoke after animation
      setTimeout(() => {
        setSmokeCandles((set) => {
          const newSet = new Set(set);
          extinguished.forEach((idx) => newSet.delete(idx));
          return newSet;
        });
      }, 1200);

      // Update candlesBlown to trigger completion
      setCandlesBlown(nextCount === 1 ? 3 : 5);

      return nextCount;
    });
  }, []);

  // Retrieve volume state from custom microphone hook
  const { micActive, volume, startListening } = useMicrophone(blowCandle, 75);

  // Start mic listening on mount
  useEffect(() => {
    startListening();
  }, [startListening]);

  // When all candles blown
  useEffect(() => {
    if (candlesBlown >= TOTAL_CANDLES && !allBlown) {
      setAllBlown(true);

      // Trigger confetti explosion
      const pieces = Array.from({ length: 200 }, (_, i) => {
        const angle = (Math.PI * 2 * Math.random());
        const velocity = 100 + Math.random() * 400;
        const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
        const size = 4 + Math.random() * 10;

        return {
          id: i,
          style: {
            '--cx': '50vw',
            '--cy': '40vh',
            '--ex': `${50 + Math.cos(angle) * (velocity / 5)}vw`,
            '--ey': `${40 + Math.sin(angle) * (velocity / 5) + Math.random() * 30}vh`,
            '--rot': `${Math.random() * 1080 - 540}deg`,
            '--anim-duration': `${1.2 + Math.random() * 1}s`,
            backgroundColor: color,
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          },
        };
      });
      setConfetti(pieces);

      // Play melody
      if (!melodyPlayed.current) {
        melodyPlayed.current = true;
        setTimeout(() => playBirthdayMelody(), 300);
      }

      // Show wish text
      setTimeout(() => setShowWish(true), 800);

      // Clear confetti
      setTimeout(() => setConfetti([]), 3500);
    }
  }, [candlesBlown, allBlown]);

  return (
    <section className={styles.cakeSection} id="cake-section">
      {/* Instruction visualizer wrapper */}
      <div className={styles.instructionWrapper}>
        <motion.p
          className={styles.instruction}
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {!allBlown ? (
            micActive ? (
              <span className={styles.instructionContent}>
                <FaMicrophone className={styles.micIcon} /> Blow into your mic or tap the cake to blow out the candles!
              </span>
            ) : (
              <span className={styles.instructionContent}>
                <FaMicrophone className={styles.micIconError} /> Tap the cake to blow out the candles!
              </span>
            )
          ) : null}
        </motion.p>

        {/* Real-time responsive visualizer feedback */}
        {!allBlown && micActive && (
          <div className={styles.visualizerContainer}>
            <div 
              className={styles.visualizerRing} 
              style={{ transform: `scale(${1 + volume / 90})`, opacity: 0.12 + volume / 100 }} 
            />
            <div 
              className={styles.visualizerRingOuter} 
              style={{ transform: `scale(${1 + volume / 45})`, opacity: 0.04 + volume / 180 }} 
            />
            <div className={styles.visualizerCenter}>
              <div className={styles.waveBar} style={{ height: `${10 + volume * 0.4}px` }} />
              <div className={styles.waveBar} style={{ height: `${16 + volume * 0.6}px` }} />
              <div className={styles.waveBar} style={{ height: `${10 + volume * 0.4}px` }} />
            </div>
          </div>
        )}
      </div>

      {/* Cake with detailed layer graphics */}
      <motion.div
        className={styles.cakeContainer}
        onClick={!allBlown ? blowCandle : undefined}
        style={{ cursor: !allBlown ? 'pointer' : 'default' }}
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', damping: 15, delay: 0.2 }}
        whileHover={!allBlown ? { scale: 1.02 } : {}}
      >
        {/* Candles */}
        <div className={styles.candleRow}>
          {Array.from({ length: TOTAL_CANDLES }, (_, i) => (
            <div key={i} className={styles.candle}>
              <div className={styles.candleStripes} />
              {!blownCandles.has(i) && <div className={styles.flame} />}
              {smokeCandles.has(i) && (
                <div className={styles.smoke}>
                  <div className={styles.smokePuff} />
                  <div className={styles.smokePuff} />
                  <div className={styles.smokePuff} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Detailed boutique SVG cake */}
        <svg viewBox="0 0 300 240" className={styles.cakeSvg} xmlns="http://www.w3.org/2000/svg">
          {/* Plate */}
          <ellipse cx="150" cy="225" rx="130" ry="12" fill="url(#plateGrad)" stroke="var(--rose)" strokeWidth="1" />
          <ellipse cx="150" cy="222" rx="120" ry="9" fill="url(#plateInnerGrad)" />

          {/* Bottom Tier (Base Y=220, X=45 to 255, height=65) */}
          <path d="M 45 220 L 45 160 C 45 152, 255 152, 255 160 L 255 220 C 255 225, 45 225, 45 220 Z" fill="url(#bottomGrad)" stroke="rgba(184, 29, 71, 0.2)" strokeWidth="1" />
          {/* Bottom frosting drips */}
          <path d="M 45 160 C 60 172, 75 175, 90 165 C 105 155, 120 180, 135 172 C 150 165, 165 160, 180 168 C 195 175, 210 178, 225 165 C 240 152, 250 170, 255 160 L 255 158 L 45 158 Z" fill="#FFF2F4" stroke="rgba(184, 29, 71, 0.12)" strokeWidth="0.8" />
          {/* Bottom Gold Trim */}
          <path d="M 45 218 C 150 226, 150 226, 255 218" stroke="var(--gold)" strokeWidth="2" fill="none" opacity="0.8" />
          {/* Decorative Flowers on Bottom Tier */}
          <circle cx="90" cy="195" r="5" fill="var(--rose)" />
          <circle cx="85" cy="195" r="4" fill="var(--pink-light)" />
          <circle cx="95" cy="195" r="4" fill="var(--pink-light)" />
          <circle cx="90" cy="190" r="4" fill="var(--pink-light)" />
          <circle cx="90" cy="200" r="4" fill="var(--pink-light)" />
          <circle cx="90" cy="195" r="2" fill="var(--gold)" />

          <circle cx="210" cy="195" r="5" fill="var(--rose)" />
          <circle cx="205" cy="195" r="4" fill="var(--pink-light)" />
          <circle cx="215" cy="195" r="4" fill="var(--pink-light)" />
          <circle cx="210" cy="190" r="4" fill="var(--pink-light)" />
          <circle cx="210" cy="200" r="4" fill="var(--pink-light)" />
          <circle cx="210" cy="195" r="2" fill="var(--gold)" />

          {/* Middle Tier (Base Y=158, X=75 to 225, height=55) */}
          <path d="M 75 158 L 75 110 C 75 102, 225 102, 225 110 L 225 158 C 225 162, 75 162, 75 158 Z" fill="url(#middleGrad)" stroke="rgba(184, 29, 71, 0.2)" strokeWidth="1" />
          {/* Middle drips */}
          <path d="M 75 110 C 85 120, 95 125, 105 117 C 115 110, 125 128, 135 122 C 145 118, 155 112, 165 118 C 175 125, 185 127, 195 118 C 205 110, 215 120, 225 110 L 225 108 L 75 108 Z" fill="#FFFFFF" stroke="rgba(184, 29, 71, 0.15)" strokeWidth="0.8" />
          {/* Middle Gold Trim */}
          <path d="M 75 156 C 150 162, 150 162, 225 156" stroke="var(--gold)" strokeWidth="2" fill="none" opacity="0.8" />
          {/* Decorative Flower on Middle Tier */}
          <circle cx="150" cy="140" r="5" fill="var(--rose)" />
          <circle cx="145" cy="140" r="4" fill="var(--pink-light)" />
          <circle cx="155" cy="140" r="4" fill="var(--pink-light)" />
          <circle cx="150" cy="135" r="4" fill="var(--pink-light)" />
          <circle cx="150" cy="145" r="4" fill="var(--pink-light)" />
          <circle cx="150" cy="140" r="2" fill="var(--gold)" />

          {/* Top Tier (Base Y=108, X=105 to 195, height=40) */}
          <path d="M 105 108 L 105 68 C 105 62, 195 62, 195 68 L 195 108 C 195 112, 105 112, 105 108 Z" fill="url(#topGrad)" stroke="rgba(184, 29, 71, 0.2)" strokeWidth="1" />
          {/* Top drips */}
          <path d="M 105 68 C 112 75, 122 78, 132 72 C 142 66, 152 80, 162 76 C 172 72, 182 68, 192 73 C 194 75, 195 72, 195 68 L 195 66 L 105 66 Z" fill="#FFF2F4" stroke="rgba(184, 29, 71, 0.12)" strokeWidth="0.8" />
          {/* Top Gold Trim */}
          <path d="M 105 106 C 150 110, 150 110, 195 106" stroke="var(--gold)" strokeWidth="1.5" fill="none" opacity="0.8" />
          {/* Decorative Flowers on Top Tier */}
          <circle cx="125" cy="92" r="4" fill="var(--rose)" />
          <circle cx="121" cy="92" r="3" fill="var(--pink-light)" />
          <circle cx="129" cy="92" r="3" fill="var(--pink-light)" />
          <circle cx="125" cy="88" r="3" fill="var(--pink-light)" />
          <circle cx="125" cy="96" r="3" fill="var(--pink-light)" />
          <circle cx="125" cy="92" r="1.5" fill="var(--gold)" />

          <circle cx="175" cy="92" r="4" fill="var(--rose)" />
          <circle cx="171" cy="92" r="3" fill="var(--pink-light)" />
          <circle cx="179" cy="92" r="3" fill="var(--pink-light)" />
          <circle cx="175" cy="88" r="3" fill="var(--pink-light)" />
          <circle cx="175" cy="96" r="3" fill="var(--pink-light)" />
          <circle cx="175" cy="92" r="1.5" fill="var(--gold)" />

          {/* Gradients */}
          <defs>
            <linearGradient id="plateGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFF2F4" />
              <stop offset="100%" stopColor="#F5DDE2" />
            </linearGradient>
            <linearGradient id="plateInnerGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E5B5C1" />
              <stop offset="100%" stopColor="#F5DDE2" />
            </linearGradient>
            <linearGradient id="bottomGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFA4B8" />
              <stop offset="100%" stopColor="#FF3E6C" />
            </linearGradient>
            <linearGradient id="middleGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFE0E6" />
              <stop offset="100%" stopColor="#FFA6B9" />
            </linearGradient>
            <linearGradient id="topGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#FFE3E9" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Wish text and proceed button */}
      <AnimatePresence>
        {showWish && (
          <motion.div
            className={styles.wishContainer}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
          >
            <p className={styles.wishText}>
              <FaStar className={styles.wishStar} /> Make a wish, Atiya! <FaStar className={styles.wishStar} />
            </p>

            <motion.button
              className={styles.nextSectionButton}
              onClick={onComplete}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              whileHover={{ scale: 1.05, boxShadow: '0 12px 35px rgba(233, 30, 140, 0.6)' }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Unwrap Your Message</span> <FaGift className={styles.giftBtnIcon} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confetti explosion */}
      {confetti.length > 0 && (
        <div className={styles.confettiOverlay}>
          {confetti.map((piece) => (
            <div key={piece.id} className={styles.confettiItem} style={piece.style} />
          ))}
        </div>
      )}
    </section>
  );
}
