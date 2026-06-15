import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  FaChevronLeft, FaChevronRight, FaCamera, FaMusic,
  FaLaugh, FaSun, FaHeart, FaMap, FaStar,
  FaGlobe, FaBookOpen, FaHourglassHalf, FaHome, FaFilm
} from 'react-icons/fa';
import styles from './Memories.module.css';

const TOTAL_SLIDES = 12;
const SWIPE_THRESHOLD = 80;
const AUTOPLAY_INTERVAL = 4500;

// Emojis captions preserved exactly as you edited them
const CAPTIONS = [
  { text: "Our first video call. Jab tu bari sirmayi thii.", icon: FaLaugh, color: "#FFD700" },
  { text: "Ye second jisme na utna sirmayi thi tuu.", icon: FaSun, color: "#FFA500" },
  { text: "Or ye meri Dulhaniyaa.", icon: FaHeart, color: "#FF6B8A" },
  { text: "Main tere se jibardasti emoji wali pic liya thaa.", icon: FaMap, color: "#4CAF50" },
  { text: "Ye or videocall pr msti.", icon: FaStar, color: "#FFD700" },
  { text: "Ye mistt wala pic.", icon: FaGlobe, color: "#00BCD4" },
  { text: "Ye heart main hi binwaya tha.", icon: FaBookOpen, color: "#9C27B0" },
  { text: "Smile telease.............", icon: FaHeart, color: "#E91E8C" },
  { text: "Eid wali pitni", icon: FaHourglassHalf, color: "#FFEB3B" },
  { text: "Chatt ka jo tu send ki thii.", icon: FaHome, color: "#8B5CF6" },
  { text: "Ye or eid ka kitni pyari lag rahi hai.", icon: FaFilm, color: "#9CA3AF" },
  { text: "Misttt pitni jiii ummaahhhh...", icon: FaStar, color: "#F43F5E" }
];

const IMAGE_NAMES = [
  "M1.png",
  "M2.png",
  "M3.jpg",
  "M4.jpg",
  "M5.png",
  "M6.jpg",
  "M7.png",
  "M8.jpg",
  "M9.jpg",
  "M10.jpg",
  "M11.jpg",
  "M12.jpg"
];

export default function Memories({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [failedImages, setFailedImages] = useState(new Set());
  const autoplayRef = useRef(null);

  // Auto-play shuffles stack
  useEffect(() => {
    if (isPaused) return;

    autoplayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TOTAL_SLIDES);
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(autoplayRef.current);
  }, [isPaused]);

  const goTo = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % TOTAL_SLIDES);
  }, []);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + TOTAL_SLIDES) % TOTAL_SLIDES);
  }, []);

  return (
    <section className={styles.memoriesSection} id="memories-section">
      <motion.h2
        className={styles.sectionTitle}
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        Our Memories <FaCamera className={styles.cameraTitleIcon} />
      </motion.h2>

      <motion.div
        className={styles.carouselWrapper}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Stack Container */}
        <div className={styles.stackWrapper}>
          {Array.from({ length: TOTAL_SLIDES }, (_, i) => {
            // Relative position from active index
            const position = (i - currentIndex + TOTAL_SLIDES) % TOTAL_SLIDES;
            const isTop = position === 0;
            const isVisible = position < 3; // Render only top 3 cards for performance

            if (!isVisible) return null;

            return (
              <motion.div
                key={i}
                className={styles.slide}
                drag={isTop ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.65}
                onDragStart={() => setIsPaused(true)}
                onDragEnd={(e, info) => {
                  if (isTop) {
                    if (info.offset.x > SWIPE_THRESHOLD) {
                      goPrev();
                    } else if (info.offset.x < -SWIPE_THRESHOLD) {
                      goNext();
                    }
                  }
                  setTimeout(() => setIsPaused(false), 2000);
                }}
                animate={{
                  scale: 1 - position * 0.05,
                  y: position * 14,
                  zIndex: TOTAL_SLIDES - position,
                  opacity: 1,
                  rotate: isTop ? 0 : (i % 2 === 0 ? 3.5 : -3.5) * (position + 1),
                }}
                style={{
                  position: 'absolute',
                  pointerEvents: isTop ? 'auto' : 'none',
                }}
                whileDrag={{ scale: 1.03, rotate: (e, info) => info.offset.x / 12 }}
                transition={{ type: 'spring', stiffness: 350, damping: 22 }}
              >
                {!failedImages.has(i) ? (
                  <img
                    src={`${import.meta.env.BASE_URL}assets/photos/${IMAGE_NAMES[i]}`}
                    alt={`Memory ${i + 1}`}
                    className={styles.slideImage}
                    loading="lazy"
                    draggable={false}
                    onError={() => setFailedImages(prev => new Set([...prev, i]))}
                  />
                ) : (
                  <div className={styles.slidePlaceholder}>
                    <FaCamera className={styles.placeholderCamera} />
                    {IMAGE_NAMES[i]}
                  </div>
                )}

                {/* Polaroid handwritten bottom note area */}
                <div className={styles.polaroidCaptionArea}>
                  <p className={styles.polaroidCaptionText}>
                    {CAPTIONS[i].text}{' '}
                    {(() => {
                      const IconComponent = CAPTIONS[i].icon;
                      return <IconComponent style={{ color: CAPTIONS[i].color, display: 'inline-block', verticalAlign: 'middle', marginLeft: '4px' }} />;
                    })()}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Nav arrows positioned around the deck */}
        <button
          className={`${styles.navArrow} ${styles.prevArrow}`}
          onClick={goPrev}
          aria-label="Previous memory"
        >
          <FaChevronLeft />
        </button>
        <button
          className={`${styles.navArrow} ${styles.nextArrow}`}
          onClick={goNext}
          aria-label="Next memory"
        >
          <FaChevronRight />
        </button>
      </motion.div>

      {/* Dots indicator */}
      <div className={styles.dotsContainer}>
        {Array.from({ length: TOTAL_SLIDES }, (_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${currentIndex === i ? styles.active : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Go to memory ${i + 1}`}
          />
        ))}
      </div>

      <motion.button
        className={styles.nextSectionButton}
        onClick={onComplete}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span>Open Music Player</span> <FaMusic className={styles.musicBtnIcon} />
      </motion.button>
    </section>
  );
}
