import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaChevronLeft } from 'react-icons/fa';
import Landing from './components/Landing/Landing';
import Cake from './components/Cake/Cake';
import Message from './components/Message/Message';
import Memories from './components/Memories/Memories';
import MusicPlayer from './components/MusicPlayer/MusicPlayer';
import styles from './App.module.css';

export default function App() {
  const [activeSection, setActiveSection] = useState(0);

  const nextSection = () => {
    setActiveSection((prev) => prev + 1);
  };

  const prevSection = () => {
    setActiveSection((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className={styles.app}>
      <AnimatePresence>
        {activeSection > 0 && (
          <motion.button
            key="back-btn"
            className={styles.backButton}
            onClick={prevSection}
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Go to previous page"
          >
            <FaChevronLeft className={styles.backIcon} />
            <span>Back</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {activeSection === 0 && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className={styles.sectionWrapper}
          >
            <Landing onEnter={nextSection} />
          </motion.div>
        )}
        {activeSection === 1 && (
          <motion.div
            key="cake"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className={styles.sectionWrapper}
          >
            <Cake onComplete={nextSection} />
          </motion.div>
        )}
        {activeSection === 2 && (
          <motion.div
            key="message"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className={styles.sectionWrapper}
          >
            <Message onComplete={nextSection} />
          </motion.div>
        )}
        {activeSection === 3 && (
          <motion.div
            key="memories"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className={styles.sectionWrapper}
          >
            <Memories onComplete={nextSection} />
          </motion.div>
        )}
        {activeSection === 4 && (
          <motion.div
            key="music"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={styles.sectionWrapper}
          >
            <MusicPlayer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

