/**
 * Native Web Audio API 8-bit retro sound synthesizer.
 * No external libraries needed.
 */

let audioCtx: AudioContext | null = null;
let isSfxMuted = false;
let isBgmPlaying = false;
let bgmTimer: NodeJS.Timeout | null = null;
let bgmStep = 0;

export function initAudio(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  } catch {
    // Ignore audio context initialization error
  }
  return audioCtx;
}

export function setSoundMuted(muted: boolean) {
  isSfxMuted = muted;
}

export function getSoundMuted(): boolean {
  return isSfxMuted;
}

/** Play a retro 8-bit piece drop sound (pitch drops as it falls) */
export function playDropSound(row: number) {
  if (isSfxMuted) return;
  try {
    const ctx = initAudio();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';

    // Pitch varies with the row it lands on (deeper when lower)
    const baseFreq = Math.max(120, 420 - row * 35);
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.45, now + 0.14);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  } catch {
    // Ignore audio context errors
  }
}

/** Play 8-bit victory fanfare */
export function playWinSound() {
  if (isSfxMuted) return;
  try {
    const ctx = initAudio();
    if (!ctx) return;

    const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99, 1046.5]; // C4, E4, G4, C5, E5, G5, C6
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      const noteStart = now + idx * 0.09;
      osc.frequency.setValueAtTime(freq, noteStart);

      gain.gain.setValueAtTime(0.18, noteStart);
      gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteStart);
      osc.stop(noteStart + 0.18);
    });
  } catch {
    // Ignore
  }
}

/** Play 8-bit draw sound */
export function playDrawSound() {
  if (isSfxMuted) return;
  try {
    const ctx = initAudio();
    if (!ctx) return;

    const notes = [320, 280, 240, 190];
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      const noteStart = now + idx * 0.11;
      osc.frequency.setValueAtTime(freq, noteStart);

      gain.gain.setValueAtTime(0.15, noteStart);
      gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.11);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteStart);
      osc.stop(noteStart + 0.13);
    });
  } catch {
    // Ignore
  }
}

/** Play simple button click / UI sound */
export function playClickSound() {
  if (isSfxMuted) return;
  try {
    const ctx = initAudio();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  } catch {
    // Ignore
  }
}

/** Play a chiptune melody cue when unmuting / toggling music */
export function playChimeSound() {
  if (isSfxMuted) return;
  try {
    const ctx = initAudio();
    if (!ctx) return;

    const chords = [392.0, 523.25, 659.25, 783.99]; // G4, C5, E5, G5
    const now = ctx.currentTime;

    chords.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      const noteStart = now + idx * 0.07;
      osc.frequency.setValueAtTime(freq, noteStart);

      gain.gain.setValueAtTime(0.16, noteStart);
      gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteStart);
      osc.stop(noteStart + 0.15);
    });
  } catch {
    // Ignore
  }
}

// 8-bit Background Retro Chiptune Loop
const BGM_NOTES = [
  261.63, 0, 329.63, 0, 392.0, 0, 523.25, 392.0,
  329.63, 0, 261.63, 0, 293.66, 0, 349.23, 0,
  392.0, 0, 440.0, 0, 392.0, 0, 329.63, 0,
  293.66, 0, 246.94, 0, 261.63, 0, 0, 0
];

export function toggleBgm(): boolean {
  if (isBgmPlaying) {
    stopBgm();
    return false;
  } else {
    startBgm();
    return true;
  }
}

export function startBgm() {
  if (isBgmPlaying) return;
  const ctx = initAudio();
  if (!ctx) return;

  isBgmPlaying = true;
  bgmStep = 0;

  const playStep = () => {
    if (!isBgmPlaying) return;
    try {
      const currentCtx = initAudio();
      if (currentCtx) {
        const freq = BGM_NOTES[bgmStep % BGM_NOTES.length];
        if (freq > 0) {
          const osc = currentCtx.createOscillator();
          const gain = currentCtx.createGain();
          const now = currentCtx.currentTime;

          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.035, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

          osc.connect(gain);
          gain.connect(currentCtx.destination);

          osc.start(now);
          osc.stop(now + 0.13);
        }
      }
    } catch {
      // Ignore
    }

    bgmStep++;
    bgmTimer = setTimeout(playStep, 150);
  };

  playStep();
}

export function stopBgm() {
  isBgmPlaying = false;
  if (bgmTimer) {
    clearTimeout(bgmTimer);
    bgmTimer = null;
  }
}

export function getIsBgmPlaying(): boolean {
  return isBgmPlaying;
}

