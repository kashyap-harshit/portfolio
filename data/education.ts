export type EducationData = {
  degree: string;
  institution: string;
  location: string;
  period: string;
  highlights: string[];
  projects?: { name: string; description: string }[];
  courses?: { name: string; description: string; syllabusUrl?: string }[];
  logo?: string;
};

export const education: EducationData[] = [
  {
    degree: "Master's in Sound & Music Computing (SMC)",
    institution: "Universitat Pompeu Fabra (UPF)",
    location: "Barcelona, Spain",
    period: "2026 – Present",
    logo: "/upf.png",
    highlights: [],
    courses: [
      {
        name: "Digital Signal Processing for Sound and Music",
        description:
          "Signal processing methodologies and technologies specific for audio and music applications, emphasizing **spectral processing techniques** for sound description and transformation.",
        syllabusUrl:
          "https://www.upf.edu/web/smc/digital-signal-processing-for-sound-and-music",
      },
      {
        name: "Machine Learning for Sound and Music",
        description:
          "Foundational machine learning concepts and current **deep learning architectures** applied to sound and music analysis and generation.",
        syllabusUrl:
          "https://www.upf.edu/web/smc/machine-learning-for-sound-and-music",
      },
      {
        name: "Music Perception and Cognition",
        description:
          "Empirical and computational foundations of **psychoacoustics, neural encoding of sound**, auditory stream organization, musical memory, and cognitive modeling.",
        syllabusUrl: "https://www.upf.edu/web/smc/academic-program",
      },
    ],
  },
  {
    degree: "Bachelor of Science in Computer Science",
    institution: "VIT Vellore",
    location: "Vellore, India",
    period: "2023 – 2026",
    logo: "/vit.png",
    highlights: [
    ],
    projects: [
      {
        name: "Open-Port Vulnerability Scanner (Machine Learning)",
        description:
          "Flags vulnerabilities on exposed, idle open ports, classifying risk with **XGBoost and Random Forest** models trained on port and service features.",
      },
      {
        name: "Deep Fingerprint (Capstone)",
        description:
          "Detects **malicious HTTPS connections** via a hybrid approach: a **rule-based engine** paired with a **neural network** trained on the full feature set that composes a **JA3 fingerprint**.",
      },
    ],
  },
];
