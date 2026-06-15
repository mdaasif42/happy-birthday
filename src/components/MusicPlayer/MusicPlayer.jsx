import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FaPlay, FaPause, FaStepBackward, FaStepForward,
  FaHeart, FaVolumeUp, FaVolumeMute, FaMusic
} from 'react-icons/fa';
import { useAudio } from '../../hooks/useAudio';
import styles from './MusicPlayer.module.css';

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function MusicPlayer() {
  const {
    isPlaying, currentTime, duration, volume,
    isLiked,
    togglePlay, seek, setVolume,
    toggleLike, restart,
  } = useAudio(`${import.meta.env.BASE_URL}assets/Jaan Ho Meri - The Realfreedom Tum Chand Ho Mera Tumse Meri Chandni - The Realfreedom (128k).mp3`);

  const [heartBurst, setHeartBurst] = useState([]);
  const [imageError, setImageError] = useState(false);
  const progressRef = useRef(null);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressClick = useCallback((e) => {
    if (!progressRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = clickX / rect.width;
    seek(ratio * duration);
  }, [duration, seek]);

  const handleLikeClick = useCallback(() => {
    toggleLike();

    // Create heart burst
    const hearts = Array.from({ length: 3 }, (_, i) => {
      const angle = ((Math.PI * 2) / 3) * i - Math.PI / 2;
      return {
        id: Date.now() + i,
        style: {
          '--fly-x': `${Math.cos(angle) * 30}px`,
          '--fly-y': `${Math.sin(angle) * 30}px`,
        },
      };
    });
    setHeartBurst(hearts);
    setTimeout(() => setHeartBurst([]), 1000);
  }, [toggleLike]);

  const [prevVolume, setPrevVolume] = useState(75);

  const toggleMute = useCallback(() => {
    if (volume > 0) {
      setPrevVolume(volume);
      setVolume(0);
    } else {
      setVolume(prevVolume);
    }
  }, [volume, prevVolume, setVolume]);

  return (
    <section className={styles.musicSection} id="music-section">
      {/* Background equalizer bars that animate ONLY when playing */}
      <div className={styles.eqBackground}>
        <div className={`${styles.eqBar} ${isPlaying ? styles.animate : ''}`} />
        <div className={`${styles.eqBar} ${isPlaying ? styles.animate : ''}`} />
        <div className={`${styles.eqBar} ${isPlaying ? styles.animate : ''}`} />
        <div className={`${styles.eqBar} ${isPlaying ? styles.animate : ''}`} />
        <div className={`${styles.eqBar} ${isPlaying ? styles.animate : ''}`} />
      </div>

      <motion.h2
        className={styles.sectionTitle}
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Special For You <FaMusic className={styles.titleMusicIcon} />
      </motion.h2>

      <motion.div
        className={styles.playerCard}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2, type: 'spring', stiffness: 80 }}
      >
        {/* Album Cover Art */}
        <div className={styles.albumArtContainer}>
          {!imageError ? (
            <img
              src={`${import.meta.env.BASE_URL}assets/photos/music.png`}
              alt="Album art"
              className={styles.albumArt}
              loading="eager"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className={styles.albumPlaceholder}>
              <FaMusic className={styles.placeholderMusicIcon} />
            </div>
          )}
        </div>

        {/* Song info */}
        <div className={styles.songInfo}>
          {/* 🎵 REPLACE: Song name */}
          <p className={styles.songTitle}>
            Jaan Ho Meri <FaMusic className={styles.songMusicIcon} />
          </p>
          {/* 🎵 REPLACE: Artist name or your name */}
          <p className={styles.songArtist}>
            Tum Chand Ho Mera • The Realfreedom <FaHeart className={styles.songHeartIcon} />
          </p>
        </div>

        {/* Progress bar */}
        <div className={styles.progressContainer}>
          <div
            className={styles.progressBar}
            ref={progressRef}
            onClick={handleProgressClick}
          >
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            >
              <div className={styles.progressThumb} />
            </div>
          </div>
          <div className={styles.timeRow}>
            <span className={styles.timeText}>{formatTime(currentTime)}</span>
            <span className={styles.timeText}>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls row */}
        <div className={styles.controls}>
          <button
            className={`${styles.heartBtn} ${isLiked ? styles.liked : ''}`}
            onClick={handleLikeClick}
            aria-label="Like"
          >
            <FaHeart />
            {/* Heart burst mini particles */}
            {heartBurst.length > 0 && (
              <div className={styles.heartBurstMini}>
                {heartBurst.map((h) => (
                  <span key={h.id} className={styles.heartMini} style={h.style}>
                    <FaHeart />
                  </span>
                ))}
              </div>
            )}
          </button>

          <button
            className={styles.controlBtnMed}
            onClick={restart}
            aria-label="Previous / restart"
          >
            <FaStepBackward />
          </button>

          <button
            className={`${styles.playPauseBtn} ${isPlaying ? styles.playing : ''}`}
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <FaPause /> : <FaPlay style={{ marginLeft: '3px' }} />}
          </button>

          <button
            className={styles.controlBtnMed}
            onClick={restart}
            aria-label="Next / restart"
          >
            <FaStepForward />
          </button>

          <button
            className={`${styles.volumeToggleBtn} ${volume === 0 ? styles.muted : ''}`}
            onClick={toggleMute}
            aria-label={volume === 0 ? 'Unmute' : 'Mute'}
          >
            {volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
        </div>
      </motion.div>
    </section>
  );
}

