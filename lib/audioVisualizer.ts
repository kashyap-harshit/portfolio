/**
 * Web Audio API bridge connecting the HTML <audio> element to real-time analysis.
 * Powers the oscilloscope waveform in SongPlayer and the audio-reactive WebGL Aurora.
 */

let audioCtx: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let sourceNode: MediaElementAudioSourceNode | null = null;
let connectedElement: HTMLAudioElement | null = null;

export function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioCtxClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtxClass) {
      audioCtx = new AudioCtxClass();
    }
  }
  return audioCtx;
}

export function resumeAudioContext() {
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
}

export function initAudioSource(audioEl: HTMLAudioElement | null): AnalyserNode | null {
  if (typeof window === "undefined" || !audioEl) return null;
  if (connectedElement === audioEl && analyser) {
    return analyser;
  }

  try {
    const ctx = getAudioContext();
    if (!ctx) return null;

    if (!sourceNode) {
      sourceNode = ctx.createMediaElementSource(audioEl);
      analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      sourceNode.connect(analyser);
      analyser.connect(ctx.destination);
      connectedElement = audioEl;
    }
    return analyser;
  } catch (err) {
    console.debug("[AudioVisualizer] Connection notice:", err);
    return analyser;
  }
}

export function getTimeDomainData(outputArray: Uint8Array): void {
  if (analyser) {
    analyser.getByteTimeDomainData(outputArray as unknown as Uint8Array<ArrayBuffer>);
  } else {
    outputArray.fill(128); // 128 is center/flatline
  }
}

export function getAudioBands(): {
  bass: number;
  mid: number;
  treble: number;
  overall: number;
} {
  if (!analyser || (audioCtx && audioCtx.state === "suspended") || !connectedElement || connectedElement.paused) {
    return { bass: 0, mid: 0, treble: 0, overall: 0 };
  }

  const buffer = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(buffer as unknown as Uint8Array<ArrayBuffer>);

  // 128 frequency bins across ~22kHz (approx 172Hz per bin)
  // Bass: bins 0..5 (~0-860Hz)
  let bassSum = 0;
  for (let i = 0; i < 6; i++) bassSum += buffer[i];
  const bass = bassSum / (6 * 255);

  // Mids: bins 6..28 (~860-4800Hz)
  let midSum = 0;
  for (let i = 6; i < 28; i++) midSum += buffer[i];
  const mid = midSum / (22 * 255);

  // Treble: bins 29..127 (~4800-22000Hz)
  let trebleSum = 0;
  for (let i = 28; i < buffer.length; i++) trebleSum += buffer[i];
  const treble = trebleSum / ((buffer.length - 28) * 255);

  const overall = bass * 0.5 + mid * 0.35 + treble * 0.15;
  return { bass, mid, treble, overall };
}
