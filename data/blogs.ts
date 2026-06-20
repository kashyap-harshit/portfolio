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
    title: "Understanding Digital Audio: Sampling, Quantization & Beyond",
    excerpt:
      "Sound is continuous, but computers are discrete. To store and process audio we sample the waveform at fixed intervals and quantize each sample to a finite set of levels — the single idea that underpins sample rate, bit depth, and the noise floor…",
    href: "https://medium.com/@vitieeesps/understanding-digital-audio-sampling-quantization-and-beyond-fd69ad589fce",
    icon: "/sps.png",
  },
  {
    title: "Synth Quest",
    excerpt:
      "A seven-part journey building a synthesizer from the ground up — oscillators, envelopes, filters, and the DSP that ties them together, one post at a time…",
    href: "https://blogs.codechefvit.com/series/synth-quest",
    icon: "/synth-quest.png",
    series: true,
    count: 7,
  },
];
