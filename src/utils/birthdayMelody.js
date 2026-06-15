/**
 * birthdayMelody.js
 * Plays "Happy Birthday" melody using Web Audio API OscillatorNodes.
 * Synthesizes a beautiful bell/music box chime sound with overtones.
 */

// Happy Birthday note sequence: [frequency (Hz), duration (ms)]
const NOTES = [
  [261.6, 300], [261.6, 150], [293.7, 450],  // Hap-py Birth-
  [261.6, 450], [349.2, 450], [329.6, 900],  // -day to you
  [261.6, 300], [261.6, 150], [293.7, 450],  // Hap-py Birth-
  [261.6, 450], [392.0, 450], [349.2, 900],  // -day to you
  [261.6, 300], [261.6, 150], [523.3, 450],  // Hap-py Birth-
  [440.0, 450], [349.2, 300], [329.6, 300],  // -day dear [name]
  [293.7, 900], [466.2, 300], [466.2, 150],  // Hap-py Birth-
  [440.0, 450], [349.2, 450], [392.0, 450],  // -day to
  [349.2, 900]                                // you
];

let isPlaying = false;

export function playBirthdayMelody() {
  if (isPlaying) return;
  isPlaying = true;

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0.75, audioCtx.currentTime); // Louder volume (0.75)
  masterGain.connect(audioCtx.destination);

  let startTime = audioCtx.currentTime + 0.1;

  NOTES.forEach(([freq, duration]) => {
    // Primary Tone (Triangle Wave for warmth)
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, startTime);

    // High Overtone (Sine Wave, 1 octave higher for music box chime quality)
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, startTime);

    const noteDurationSecs = duration / 1000;
    const noteEnd = startTime + noteDurationSecs;

    // Volume envelopes: bell-like fast attack and sweet exponential decay
    gain1.gain.setValueAtTime(0, startTime);
    gain1.gain.linearRampToValueAtTime(0.6, startTime + 0.015);
    gain1.gain.exponentialRampToValueAtTime(0.001, noteEnd - 0.01);

    gain2.gain.setValueAtTime(0, startTime);
    gain2.gain.linearRampToValueAtTime(0.25, startTime + 0.01);
    gain2.gain.exponentialRampToValueAtTime(0.001, noteEnd - 0.01);

    osc1.connect(gain1);
    gain1.connect(masterGain);

    osc2.connect(gain2);
    gain2.connect(masterGain);

    osc1.start(startTime);
    osc1.stop(noteEnd);

    osc2.start(startTime);
    osc2.stop(noteEnd);

    startTime = noteEnd + 0.04; // Slightly larger gap for crisp chimes
  });

  // Calculate total duration to reset isPlaying flag
  const totalDuration = NOTES.reduce((sum, [, dur]) => sum + dur, 0) + NOTES.length * 40;
  setTimeout(() => {
    isPlaying = false;
    audioCtx.close();
  }, totalDuration + 1000);
}

export default playBirthdayMelody;
