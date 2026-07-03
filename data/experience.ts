export type ExperienceData = {
  company: string;
  role: string;
  location: string;
  period: string;
  highlights: string[];
  stack: string[];
  logo?: string;
  website?: string;
};

export const experience: ExperienceData[] = [
  {
    company: "KnowledgeVerse AI",
    role: "Software Development Engineer Intern",
    location: "Bengaluru, India",
    period: "May 2025 – Aug 2025 | Dec 2025 – Present",
    logo: "/kv.png",
    website: "https://k-v.ai",
    highlights: [
      "**15× faster** file/folder listing across the multi-tenant platform via a Redis caching layer with TTL-based invalidation.",
      "Built and published the official **Python SDK** (kv-platform) to PyPI — auto-generated, strongly typed, with secure API-key auth.",
      "Migrated the backend from **sync to async** (boto3 → aioboto3) across 18 files, removing event-loop blocking and speeding up report generation.",
      "Shipped an end-to-end **Stripe integration** — dynamic plans, Payment Intents, subscription webhooks — with zero payment incidents.",
      "Secured all auth flows with Google & Microsoft **OAuth SSO** (Authorization Code Flow + PKCE) across Next.js and FastAPI.",
      "Built a **serverless upload pipeline** on AWS Lambda + S3, extended to Google Drive and OneDrive/SharePoint with encrypted uploads and retry handling.",
    ],
    stack: [
      "Python",
      "FastAPI",
      "Next.js",
      "Redis",
      "AWS Lambda",
      "S3",
      "Stripe",
      "OAuth / PKCE",
      "aioboto3",
      "asyncio",
      "PyPI",
    ],
  },
  {
    company: "CodeChefVIT",
    role: "Board Member & Research and Development Lead",
    location: "Vellore, India",
    period: "2025 – Present", // placeholder, adjust to your actual tenure
    highlights: [
      "Authored the *“SynthQuest: Building a VST from Scratch”* blog series on real-time audio DSP and the JUCE plugin pipeline.",
      "Ran hands-on **audio-programming workshops** at local schools, teaching the fundamentals of sound synthesis and DSP.",
      "Led the technical execution of **Clueminati, CookOff, and DevSoc** — flagship hackathons with **1000+ combined participants**.",
    ],
    stack: ["Next.js","TypeScript", "MongoDB",  "C++", "JUCE", "Audio DSP", ],
    logo: "cc.png",
    website: "https://www.codechefvit.com",
  },
  {
    company: "GraVITas '25, VIT's Tech Fest",
    role: "Tech Coordinator",
    location: "Vellore, India",
    period: "2025", // placeholder, adjust to your actual tenure
    highlights: [
      "Oversaw technical operations of GraVITas '25, one of India's largest student-run fests with **40,000+ participants** and **200+ events**.",
      "Led and mentored a **team of developers** building the portal and admin panel with role-based access for events, logistics, and R&R.",
    ],
    stack: ["Next.js", "TypeScript", "TanStack", "Axios"],
    logo: "/gravitas.png",
    website: "https://gravitas.vit.ac.in",
  },
];
