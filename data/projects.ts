export type ProjectLink = {
  label: string;
  href: string;
};

export type ProjectData = {
  title: string;
  description: string;
  techStack: string[];
  links: ProjectLink[];
};

export const projects: ProjectData[] = [
  {
    title: "Clueminati 2025",
    description:
      "The official event app for CodeChefVIT's Clueminati 2025 — a real-time, QR-driven treasure hunt with team check-ins, live scoring, and push notifications, shipped as an installable PWA.",
    techStack: ["Next.js", "TypeScript", "MongoDB", "TanStack"],
    links: [
      { label: "GitHub", href: "https://github.com/CodeChefVIT/clueminati-2025" },
    ],
  },
  {
    title: "Kick Generator",
    description:
      "A variational autoencoder (VAE) trained on a corpus of kick-drum samples. It learns a latent space of percussive sounds and samples from it to synthesize brand-new kicks.",
    techStack: ["Python"],
    links: [
      { label: "GitHub", href: "https://github.com/kashyap-harshit/kick-generator" },
    ],
  },
  {
    title: "Oscillator VST",
    description:
      "An audio oscillator VST plugin built with the JUCE framework — a real-time synthesizer voice with selectable waveforms, usable inside any DAW.",
    techStack: ["C++", "JUCE"],
    links: [
      { label: "GitHub", href: "https://github.com/kashyap-harshit/oscillator-vst" },
    ],
  },
];

export const GITHUB_PROFILE = "https://github.com/kashyap-harshit";
