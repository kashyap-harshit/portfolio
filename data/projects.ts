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
      "A **variational autoencoder (VAE)** trained on a corpus of kick-drum samples. It learns a compact **latent space** of percussive sounds and samples from it to synthesize brand-new kicks. By interpolating between points in that latent space you can morph smoothly between punchy, boomy, and clicky textures, and the decoder reconstructs full-length waveforms from a handful of latent dimensions. It turns sound design into exploring a learned distribution instead of tweaking oscillators by hand.",
    icon: "/kick-vae-1.png",
    techStack: ["Python", "PyTorch", "NumPy", "librosa", "matplotlib"],
    links: [
      { label: "GitHub", href: "https://github.com/kashyap-harshit/kick-generator" },
    ],
  },
  {
    title: "Oscillator VST",
    description:
      "An audio oscillator **VST plugin** built with the **JUCE framework**: a real-time synthesizer voice with selectable waveforms that runs inside any DAW. It handles MIDI input with proper voice management, exposes parameters through an automatable host interface, and renders sine, saw, square, and triangle waves with anti-aliasing to keep the high end clean. Shipped as a standard VST3, it's a hands-on study of DSP and the plugin audio pipeline from note-on to sample output.",
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
      "The **official event app** for CodeChefVIT's Clueminati 2025, a real-time, QR-driven treasure hunt with team check-ins, live scoring, and push notifications, shipped as an **installable PWA**. Players scan location QR codes to unlock clues, submit answers, and watch a live leaderboard update as teams race across the map, while organizers manage the event from an admin dashboard. Built on **Next.js with MongoDB and TanStack Query**, it stayed responsive under **hundreds of concurrent participants** on event day.",
    icon: "/clueminati.png",
    techStack: ["Next.js", "TypeScript", "MongoDB", "TanStack"],
    links: [
      {label: "clueminati.codechefvit.com", href: "https://clueminati.codechefvit.com"},
      { label: "GitHub", href: "https://github.com/CodeChefVIT/clueminati-2025" },
    ],
  },
  
  
];

export const GITHUB_PROFILE = "https://github.com/kashyap-harshit";
