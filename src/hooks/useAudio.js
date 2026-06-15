/**
 * useAudio.js
 * Custom hook for audio playback with full control: play/pause, seek, volume, repeat, like.
 * Uses native HTML5 Audio element for song.mp3 playback.
 */
import { useState, useRef, useEffect, useCallback } from 'react';

export function useAudio(src) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(75);
  const [isLiked, setIsLiked] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  useEffect(() => {
    const audio = new Audio(src);
    audio.preload = 'metadata';
    audio.volume = 0.75;
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      if (!audio.loop) {
        setIsPlaying(false);
        audio.currentTime = 0;
        setCurrentTime(0);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
    };
  }, [src]);

  const togglePlay = useCallback(async () => {
    if (!audioRef.current) return;
    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.warn('Audio playback error:', err);
    }
  }, [isPlaying]);

  const seek = useCallback((time) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);

  const setVolume = useCallback((val) => {
    if (!audioRef.current) return;
    const v = Math.max(0, Math.min(100, val));
    audioRef.current.volume = v / 100;
    setVolumeState(v);
  }, []);

  const toggleRepeat = useCallback(() => {
    if (!audioRef.current) return;
    const newRepeat = !isRepeat;
    audioRef.current.loop = newRepeat;
    setIsRepeat(newRepeat);
  }, [isRepeat]);

  const toggleShuffle = useCallback(() => {
    setIsShuffle(prev => !prev);
  }, []);

  const toggleLike = useCallback(() => {
    setIsLiked(prev => !prev);
  }, []);

  const restart = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
  }, []);

  return {
    isPlaying,
    currentTime,
    duration,
    volume,
    isLiked,
    isRepeat,
    isShuffle,
    togglePlay,
    seek,
    setVolume,
    toggleLike,
    toggleRepeat,
    toggleShuffle,
    restart,
  };
}

export default useAudio;
