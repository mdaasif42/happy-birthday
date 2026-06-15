import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaStar, FaGift } from 'react-icons/fa';
import Particles from '../Particles/Particles';
import styles from './Landing.module.css';

const CONFETTI_COLORS = ['#E93B68', '#B38F24', '#FFE6EB', '#8E44AD', '#FFFFFF'];

const FloralCorner = ({ style, rotate }) => (
  <svg
    viewBox="0 0 100 100"
    fill="currentColor"
    style={{
      position: 'absolute',
      width: '160px',
      height: '160px',
      color: 'var(--rose)',
      opacity: 0.85,
      transform: `rotate(${rotate}deg)`,
      pointerEvents: 'none',
      zIndex: 10,
      ...style
    }}
    className={rotate === 0 ? styles.floralTop : styles.floralBottom}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Central Flower */}
    <circle cx="20" cy="20" r="10" fill="var(--rose)" />
    <circle cx="10" cy="20" r="8" fill="var(--pink-light)" opacity="0.95" />
    <circle cx="30" cy="20" r="8" fill="var(--pink-light)" opacity="0.95" />
    <circle cx="20" cy="10" r="8" fill="var(--pink-light)" opacity="0.95" />
    <circle cx="20" cy="30" r="8" fill="var(--pink-light)" opacity="0.95" />
    <circle cx="20" cy="20" r="4" fill="var(--gold)" />

    {/* Leaves */}
    <path d="M40 10 C 45 15, 48 25, 42 32 C 34 30, 30 20, 40 10 Z" fill="#C3E2C2" />
    <path d="M10 40 C 15 45, 25 48, 32 42 C 30 34, 20 30, 10 40 Z" fill="#C3E2C2" />

    {/* Small Side Flower */}
    <circle cx="45" cy="45" r="6" fill="var(--rose)" opacity="0.9" />
    <circle cx="39" cy="45" r="5" fill="#FFF0F2" opacity="0.9" />
    <circle cx="51" cy="45" r="5" fill="#FFF0F2" opacity="0.9" />
    <circle cx="45" cy="39" r="5" fill="#FFF0F2" opacity="0.9" />
    <circle cx="45" cy="51" r="5" fill="#FFF0F2" opacity="0.9" />
    <circle cx="45" cy="45" r="2.5" fill="var(--gold)" />

    {/* Curving stems */}
    <path d="M20 20 C 50 30, 70 50, 80 80" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
    <circle cx="80" cy="80" r="3" fill="var(--gold)" />
    <circle cx="70" cy="65" r="2" fill="var(--gold)" />
  </svg>
);

export default function Landing({ onEnter }) {
  const [confetti, setConfetti] = useState([]);

  const handleEnter = useCallback(() => {
    const pieces = Array.from({ length: 45 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 45 + (Math.random() - 0.5) * 0.3;
      const velocity = 150 + Math.random() * 300;
      const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];

      return {
        id: i,
        color,
        style: {
          '--start-x': '50vw',
          '--start-y': '50vh',
          '--end-x': `${50 + (Math.cos(angle) * velocity) / 4}vw`,
          '--end-y': `${50 + (Math.sin(angle) * velocity) / 4}vh`,
          '--rotation': `${Math.random() * 720 - 360}deg`,
          '--fall-duration': `${0.8 + Math.random() * 0.8}s`,
          '--fall-delay': `${Math.random() * 0.1}s`,
          backgroundColor: color,
          width: `${6 + Math.random() * 8}px`,
          height: `${6 + Math.random() * 8}px`,
          borderRadius: Math.random() > 0.5 ? '50%' : '2px',
        },
      };
    });

    setConfetti(pieces);

    setTimeout(() => {
      if (onEnter) onEnter();
    }, 1000);

    setTimeout(() => setConfetti([]), 2200);
  }, [onEnter]);

  const headingText = "Happy Birthday";
  const nameText = "Atiya";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: (customDelay = 0.2) => ({
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: customDelay,
      }
    })
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.8, rotate: -5 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotate: 0,
      transition: { type: 'spring', damping: 12, stiffness: 120 }
    }
  };

  return (
    <section className={styles.landing} id="landing-section">
      <Particles count={70} />
      <div className={styles.bgMesh} />

      {/* Screen-Framed Corner Flowers */}
      <FloralCorner style={{ top: '-15px', left: '-15px' }} rotate={0} />
      <FloralCorner style={{ bottom: '-15px', right: '-15px' }} rotate={180} />

      <div className={styles.content}>
        <motion.div
          className={styles.badge}
          initial={{ opacity: 0, scale: 0.6, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 120, delay: 0.2 }}
        >
          <div className={styles.badgeGlow} />
          <FaStar className={styles.badgeIcon} /> 16th June <FaStar className={styles.badgeIcon} />
        </motion.div>

        <motion.h1
          className={styles.heading}
          variants={containerVariants}
          custom={0.4}
          initial="hidden"
          animate="visible"
        >
          {headingText.split('').map((char, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>

        <motion.h2
          className={styles.subheading}
          variants={containerVariants}
          custom={1.1}
          initial="hidden"
          animate="visible"
        >
          {nameText.split('').map((char, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              style={{ display: 'inline-block' }}
            >
              {char}
            </motion.span>
          ))}
          <motion.span
            variants={letterVariants}
            style={{ display: 'inline-block', marginLeft: '12px' }}
          >
            <FaHeart className={styles.heartIcon} />
          </motion.span>
        </motion.h2>

        <motion.p
          className={styles.quote}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.7 }}
        >
          Hey my sweet wife I know it's not official birthday but it is your birthday.
          Wish a happy birthday to you and I LOVE YOU soo much.
          Ye tera special day tha or main kuch special krna chahta tha so this is from my side Thank You for coming in my life.
          <FaHeart className={styles.roseIcon} />
        </motion.p>

        <motion.button
          className={styles.enterButton}
          onClick={handleEnter}
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', damping: 15, delay: 2.1 }}
          whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(233, 59, 104, 0.4)' }}
          whileTap={{ scale: 0.95 }}
        >
          <span>Enter</span> <FaGift className={styles.btnIcon} />
        </motion.button>
      </div>

      {confetti.length > 0 && (
        <div className={styles.confettiBurst}>
          {confetti.map((piece) => (
            <div key={piece.id} className={styles.confettiPiece} style={piece.style} />
          ))}
        </div>
      )}
    </section>
  );
}
