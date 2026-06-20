export type EducationData = {
  degree: string;
  institution: string;
  location: string;
  period: string;
  highlights: string[];
  logo?: string;
};

export const education: EducationData[] = [
  {
    degree: "Master's in Sound & Music Computing (SMC)",
    institution: "Universitat Pompeu Fabra (UPF)",
    location: "Barcelona, Spain",
    period: "2026 – Present",
    highlights: [
      "Placeholder — add coursework / focus areas (e.g. DSP, music information retrieval, audio ML).",
      "Placeholder — add research, labs, or notable projects.",
    ],
  },
  {
    degree: "Bachelor of Science in Computer Science",
    institution: "VIT Vellore",
    location: "Vellore, India",
    period: "2023 – 2026",
    highlights: [
      "Placeholder — add GPA / honors.",
      "Placeholder — add relevant coursework or activities (e.g. CodeChefVIT).",
    ],
  },
];
