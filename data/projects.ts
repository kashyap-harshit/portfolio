export type ProjectLink = {
  label: string;
  href: string;
};

export type ProjectData = {
  title: string;
  description: string;
  icon: string;
  techStack: string[];
  links: ProjectLink[];
};

export const projects: ProjectData[] = [
  {
    title: "Kick Generator",
    description:
      "A **variational autoencoder (VAE)** trained on kick-drum samples. It learns a compact **latent space** of percussive sounds and samples from it to synthesize brand-new kicks, morphing smoothly between punchy, boomy, and clicky textures.",
    icon: "/kick-vae-1.png",
    techStack: ["Python", "PyTorch", "NumPy", "librosa", "matplotlib"],
    links: [
      { label: "GitHub", href: "https://github.com/kashyap-harshit/kick-generator" },
    ],
  },
  {
    title: "Oscillator VST",
    description:
      "An audio oscillator **VST plugin** built with the **JUCE framework**: a real-time synthesizer voice that runs inside any DAW. It handles MIDI input and renders anti-aliased sine, saw, square, and triangle waves, shipped as a standard VST3.",
    icon: "/vst-osc.png",
    techStack: ["C++", "JUCE"],
    links: [
      { label: "GitHub", href: "https://github.com/kashyap-harshit/oscillator-vst" },
      { label: "Blog", href: "https://blogs.codechefvit.com/series/synth-quest" },
    ],
  },
  {
    title: "Clueminati 2025",
    description:
      "The **official event app** for CodeChefVIT's Clueminati 2025, a real-time, QR-driven treasure hunt shipped as an **installable PWA**. Players scan QR codes to unlock clues and watch a live leaderboard update. Built on **Next.js with MongoDB and TanStack Query**, it stayed responsive under **hundreds of concurrent participants**.",
    icon: "/clueminati.png",
    techStack: ["Next.js", "TypeScript", "MongoDB", "TanStack"],
    links: [
      {label: "clueminati.codechefvit.com", href: "https://clueminati.codechefvit.com"},
      { label: "GitHub", href: "https://github.com/CodeChefVIT/clueminati-2025" },
    ],
  },
  
  
];

export const GITHUB_PROFILE = "https://github.com/kashyap-harshit";
