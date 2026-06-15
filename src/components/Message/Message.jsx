import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaCamera, FaStar } from 'react-icons/fa';
import styles from './Message.module.css';

const BlossomSVG = () => (
  <svg viewBox="0 0 64 64" fill="currentColor" style={{ width: '100%', height: '100%', display: 'block' }}>
    <path d="M32 28C28 14 18 18 22 28C12 24 10 34 20 36C10 40 16 50 26 44C26 54 36 54 36 44C46 50 52 40 42 36C52 34 50 24 40 28C44 18 34 14 32 28Z" />
    <circle cx="32" cy="34" r="3" fill="#FFFFFF" opacity="0.95" />
  </svg>
);

const LeafSVG = () => (
  <svg viewBox="0 0 64 64" fill="currentColor" style={{ width: '100%', height: '100%', display: 'block' }}>
    <path d="M32 12C36 24 48 28 44 44C40 52 24 52 20 44C16 28 28 24 32 12Z" />
  </svg>
);

const FloralCorner = ({ style, rotate }) => (
  <svg
    viewBox="0 0 100 100"
    fill="currentColor"
    className={styles.floralCorner}
    style={{
      position: 'absolute',
      color: 'var(--rose)',
      opacity: 0.85,
      transform: `rotate(${rotate}deg)`,
      pointerEvents: 'none',
      zIndex: 10,
      ...style
    }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="20" cy="20" r="10" fill="var(--rose)" />
    <circle cx="10" cy="20" r="8" fill="var(--pink-light)" opacity="0.95" />
    <circle cx="30" cy="20" r="8" fill="var(--pink-light)" opacity="0.95" />
    <circle cx="20" cy="10" r="8" fill="var(--pink-light)" opacity="0.95" />
    <circle cx="20" cy="30" r="8" fill="var(--pink-light)" opacity="0.95" />
    <circle cx="20" cy="20" r="4" fill="var(--gold)" />

    <path d="M40 10 C 45 15, 48 25, 42 32 C 34 30, 30 20, 40 10 Z" fill="#C3E2C2" />
    <path d="M10 40 C 15 45, 25 48, 32 42 C 30 34, 20 30, 10 40 Z" fill="#C3E2C2" />

    <circle cx="45" cy="45" r="6" fill="var(--rose)" opacity="0.9" />
    <circle cx="39" cy="45" r="5" fill="#FFF0F2" opacity="0.9" />
    <circle cx="51" cy="45" r="5" fill="#FFF0F2" opacity="0.9" />
    <circle cx="45" cy="39" r="5" fill="#FFF0F2" opacity="0.9" />
    <circle cx="45" cy="51" r="5" fill="#FFF0F2" opacity="0.9" />
    <circle cx="45" cy="45" r="2.5" fill="var(--gold)" />

    <path d="M20 20 C 50 30, 70 50, 80 80" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
    <circle cx="80" cy="80" r="3" fill="var(--gold)" />
    <circle cx="70" cy="65" r="2" fill="var(--gold)" />
  </svg>
);

export default function Message({ onComplete }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [hearts, setHearts] = useState([]);

  const petals = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => {
      const type = Math.random() > 0.45 ? 'blossom' : 'leaf';
      const size = Math.random() * 8 + 10;
      const color = type === 'blossom'
        ? ['#FFC2D1', '#FFE5EC', '#FF8FAB', '#FFFFFF'][Math.floor(Math.random() * 4)]
        : ['#E2ECE9', '#D5E2DB', '#C6D8CE'][Math.floor(Math.random() * 3)];
      return {
        id: i,
        type,
        style: {
          left: `${Math.random() * 100}%`,
          width: `${size}px`,
          height: `${size}px`,
          color,
          '--petal-duration': `${8 + Math.random() * 8}s`,
          '--petal-delay': `${Math.random() * 10}s`,
          '--petal-sway': `${(Math.random() - 0.5) * 60}px`,
          opacity: 0.35 + Math.random() * 0.3,
        },
      };
    });
  }, []);

  const handleTap = useCallback((e) => {
    const rect = e?.currentTarget?.getBoundingClientRect();
    const sx = rect ? `${rect.left + rect.width / 2}px` : '50vw';
    const sy = rect ? `${rect.top + rect.height / 2}px` : '50vh';

    const heartPieces = Array.from({ length: 20 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 20;
      const velocity = 80 + Math.random() * 150;
      return {
        id: i,
        style: {
          '--hb-sx': sx,
          '--hb-sy': sy,
          '--hb-ex': `calc(${sx} + ${Math.cos(angle) * (velocity / 5)}px)`,
          '--hb-ey': `calc(${sy} + ${Math.sin(angle) * (velocity / 5)}px)`,
          '--hb-duration': `${0.8 + Math.random() * 0.5}s`,
        },
      };
    });

    setHearts(heartPieces);
    setIsFlipped(true);

    setTimeout(() => setHearts([]), 2000);
  }, []);

  return (
    <section className={styles.messageSection} id="message-section">
      <div className={styles.petalsContainer}>
        {petals.map((petal) => (
          <div key={petal.id} className={styles.petal} style={petal.style}>
            {petal.type === 'blossom' ? <BlossomSVG /> : <LeafSVG />}
          </div>
        ))}
      </div>

      <div className={styles.scene}>
        <motion.div
          className={styles.cardContainer}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0.0, 0.2, 1] }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* FRONT SIDE (Luxury Wax Sealed Envelope) */}
          <div className={`${styles.cardFront} ${isFlipped ? styles.flipped : ''}`}>
            <FloralCorner style={{ top: '-10px', left: '-10px' }} rotate={0} />
            <FloralCorner style={{ bottom: '-10px', right: '-10px' }} rotate={180} />

            <div className={styles.envelopeBorder} />
            <div className={styles.envelopeBadge}>
              <FaStar className={styles.envelopeStar} /> Special Surprise
            </div>

            <div className={styles.envelopeContent}>
              <h3 className={styles.envelopeHeading}>To Atiya</h3>
              <p className={styles.envelopeSub}>With love & best wishes</p>

              <motion.button
                className={styles.openButton}
                onClick={handleTap}
                whileHover={{ scale: 1.06, boxShadow: '0 8px 25px rgba(233, 59, 104, 0.3)' }}
                whileTap={{ scale: 0.95 }}
              >
                <FaHeart className={styles.openHeartIcon} />
                <span>Open With Love</span>
              </motion.button>
            </div>
          </div>

          {/* BACK SIDE (Personal Polaroid & Handwritten Letter) */}
          <div className={`${styles.cardBack} ${isFlipped ? styles.flipped : ''}`}>
            <FloralCorner style={{ top: '-10px', left: '-10px' }} rotate={0} />
            <FloralCorner style={{ bottom: '-10px', right: '-10px' }} rotate={180} />

            <div className={styles.cardBackContent}>
              <div className={styles.scrollableLetterContent}>
                <div className={styles.polaroidContainer}>
                  <img
                    src={`${import.meta.env.BASE_URL}assets/photos/messege.png`}
                    alt="Our special moment"
                    className={styles.photo}
                    loading="eager"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className={styles.photoPlaceholder} style={{ display: 'none' }}>
                    <FaCamera className={styles.placeholderCameraIcon} /><br />Add photo at public/assets/photos/messege.png
                  </div>
                  <p className={styles.polaroidCaption}>you and Me</p>
                </div>

                <h3 className={styles.messageHeading}>
                  Dear Atiya <FaHeart className={styles.headingHeartIcon} />
                </h3>

                <p className={styles.messageBody}>
                  Hey my sweet wife I LOVE YOU soo much. I know we are not official married but you are my wife.
                  Ye tera birthday wala din main kafi dino se intezar kr raha tha finally aa gaya Happy birthday
                  my deer wife tu hamesha sahi salamat rahe or main tere sath. Pata nahi hum achanak se mile or dhire
                  dhire ye hamara rishta itna gehra ho gaya or tu meri wife ban gayi mera sabse best moments wo hai
                  jisme main tere sath raha hum itne masti kiye or hamesha krte rahenge.
                  Or last thing I really LOVE YOU my darling. Thank you..
                </p>

                <p className={styles.signature}>
                  Always yours <FaStar className={styles.signatureStarIcon} />
                </p>
              </div>

              <motion.button
                className={styles.nextSectionButton}
                onClick={onComplete}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(233, 59, 104, 0.4)' }}
                whileTap={{ scale: 0.95 }}
              >
                <span>See Our Memories</span> <FaCamera className={styles.cameraBtnIcon} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {hearts.length > 0 && (
        <div className={styles.heartBurst}>
          {hearts.map((h) => (
            <span key={h.id} className={styles.heartParticle} style={h.style}>
              <FaHeart className={styles.heartParticleIcon} />
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
