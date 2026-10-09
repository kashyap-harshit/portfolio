export type BlogData = {
  title: string;
  excerpt: string;
  href: string;
  icon: string;
  /** When true, the card renders a stacked "pile" behind it (a blog series). */
  series?: boolean;
  /** Number of posts in the series (shown as a badge). */
  count?: number;
};

export const blogs: BlogData[] = [
  {
    title: "AudioML: Machine Learning for Audio from Scratch",
    excerpt:
      "A hands-on **12-part blueprint** on machine learning for music and audio DSP: acoustic descriptors, feature scaling contours, gradient descent, the Normal Equation, convex log-loss, and backpropagation derived in NumPy and PyTorch.",
    href: "/audio-ml",
    icon: "/librosa.svg",
    series: true,
    count: 12,
  },
  {
    title: "ShredQuest: Build a Groovebox in ChucK",
    excerpt:
      "A **twelve-chapter interactive guide** to building a complete groovebox from scratch in ChucK: sample-accurate timing, oscillators, envelopes, multi-track polyphony, and step sequencing.",
    href: "/chuck",
    icon: "/synth-quest.png",
    series: true,
    count: 12,
  },
  {
    title: "Understanding Digital Audio: Sampling, Quantization & Beyond",
    excerpt:
      "Sound is continuous, but computers are discrete. To store and process audio we **sample** the waveform at fixed intervals and **quantize** each sample to a finite set of levels. That one idea is what sample rate, bit depth, and the noise floor all come down to.",
    href: "https://medium.com/@vitieeesps/understanding-digital-audio-sampling-quantization-and-beyond-fd69ad589fce",
    icon: "/sps.png",
  },
  {
    title: "Synth Quest",
    excerpt:
      "A **seven-part series** on building a synthesizer from the ground up: oscillators, envelopes, filters, and the DSP that ties them together, one post at a time.",
    href: "https://blogs.codechefvit.com/series/synth-quest",
    icon: "/synth-quest.png",
    series: true,
    count: 7,
  },
];
