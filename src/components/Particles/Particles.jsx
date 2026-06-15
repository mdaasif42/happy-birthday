import { useMemo } from 'react';
import { FaHeart } from 'react-icons/fa';
import styles from './Particles.module.css';

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

const SYMBOLS = ['blossom', 'leaf', 'heart'];
const BLOSSOM_COLORS = ['#FFC2D1', '#FFE5EC', '#FF8FAB', '#FFFFFF'];
const LEAF_COLORS = ['#E2ECE9', '#D5E2DB', '#C6D8CE'];
const HEART_COLORS = ['#FF5C8A', '#FF8FAB', '#FFE6EB'];

export default function Particles({ count = 80 }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      let color = '#FFF';
      if (symbol === 'blossom') {
        color = BLOSSOM_COLORS[Math.floor(Math.random() * BLOSSOM_COLORS.length)];
      } else if (symbol === 'leaf') {
        color = LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)];
      } else {
        color = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
      }
      
      const size = Math.random() * 10 + 10; // 10px to 20px
      const left = Math.random() * 100;
      const duration = Math.random() * 10 + 8; // 8s to 18s
      const delay = Math.random() * 12;
      const opacity = Math.random() * 0.4 + 0.25; // 0.25 to 0.65
      const sway = (Math.random() - 0.5) * 60;

      return {
        id: i,
        symbol,
        style: {
          left: `${left}%`,
          width: `${size}px`,
          height: `${size}px`,
          fontSize: `${size}px`,
          color,
          '--duration': `${duration}s`,
          '--delay': `${delay}s`,
          '--max-opacity': opacity,
          '--sway': `${sway}px`,
        },
      };
    });
  }, [count]);

  return (
    <div className={styles.particlesContainer}>
      {particles.map((p) => (
        <span key={p.id} className={styles.particle} style={p.style}>
          {p.symbol === 'blossom' && <BlossomSVG />}
          {p.symbol === 'leaf' && <LeafSVG />}
          {p.symbol === 'heart' && <FaHeart />}
        </span>
      ))}
    </div>
  );
}
