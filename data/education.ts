export type EducationData = {
  degree: string;
  institution: string;
  location: string;
  period: string;
  highlights: string[];
  projects?: { name: string; description: string }[];
  logo?: string;
};

export const education: EducationData[] = [
  {
    degree: "Master's in Sound & Music Computing (SMC)",
    institution: "Universitat Pompeu Fabra (UPF)",
    location: "Barcelona, Spain",
    period: "2026 – Present",
    logo: "/upf.png",
    highlights: [
      "To Be Started"
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
          "Flags vulnerabilities on exposed, idle open ports — classifying risk with XGBoost and Random Forest models trained on port/service features.",
      },
      {
        name: "Deep Fingerprint (Capstone)",
        description:
          "Detects malicious HTTPS connections via a hybrid approach: a rule-based engine paired with a neural network trained on the full feature set that composes a JA3 fingerprint.",
      },
    ],
  },
];
