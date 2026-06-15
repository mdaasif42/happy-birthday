/**
 * useMicrophone.js
 * Custom hook that uses Web Audio API to detect microphone blow/breath.
 * Monitors volume levels and triggers a callback when threshold is exceeded.
 */
import { useState, useRef, useCallback, useEffect } from 'react';

export function useMicrophone(onBlow, threshold = 45) {
  const [micActive, setMicActive] = useState(false);
  const [isBlowing, setIsBlowing] = useState(false);
  const [volume, setVolume] = useState(0);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const lockRef = useRef(false);

  const detectBlow = useCallback(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate average volume
    const average = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
    
    // Smooth the volume display for the UI visualizer
    setVolume((prev) => {
      const target = Math.min(100, Math.round((average / 120) * 100));
      return prev + (target - prev) * 0.3; // Linear interpolation for smoothness
    });

    if (average > threshold && !lockRef.current) {
      lockRef.current = true;
      setIsBlowing(true);

      if (onBlow) onBlow();

      // Lock for 1.8s to prevent multiple triggers per blow and let animations finish
      setTimeout(() => {
        lockRef.current = false;
        setIsBlowing(false);
      }, 1800);
    }

    rafRef.current = requestAnimationFrame(detectBlow);
  }, [onBlow, threshold]);

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      setMicActive(true);
      rafRef.current = requestAnimationFrame(detectBlow);
    } catch (err) {
      console.warn('Microphone access denied:', err);
      setMicActive(false);
    }
  }, [detectBlow]);

  const stopListening = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setMicActive(false);
    setIsBlowing(false);
    setVolume(0);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopListening();
  }, [stopListening]);

  return { micActive, isBlowing, volume, startListening, stopListening };
}

export default useMicrophone;
