export type ExperienceData = {
  company: string;
  role: string;
  location: string;
  period: string;
  highlights: string[];
  stack: string[];
  logo?: string;
};

export const experience: ExperienceData[] = [
  {
    company: "KnowledgeVerse AI",
    role: "Software Development Engineer Intern",
    location: "Bengaluru, India",
    period: "May 2025 – Aug 2025 | Dec 2025 – Present",
    logo: "/kv.png",
    highlights: [
      "15× latency reduction on file/folder listing APIs across a multi-tenant SaaS platform by architecting a Redis caching layer with TTL-based invalidation, replacing cold database queries on every request.",
      "Built and shipped the official Python SDK (kv-platform) — auto-generated from API specs, published to PyPI with strong typing and secure API-key auth for fast developer integration.",
      "Migrated the entire backend from sync to async (boto3 → aioboto3, sequential handlers → asyncio.gather()) across 18 files, eliminating event-loop blocking under concurrent load and cutting report-generation time via parallel S3 downloads.",
      "Zero payment incidents post-launch on an end-to-end Stripe integration — dynamic plan selection, Payment Intents, webhook handlers for real-time subscription state, and a responsive Stripe.js frontend.",
      "100% of auth flows secured (zero credential-leak incidents) via Google and Microsoft OAuth SSO using Authorization Code Flow with PKCE across Next.js and FastAPI, supporting multi-tenant authentication.",
      "Serverless upload pipeline for 100% of user files, built with AWS Lambda and S3 with webhook-driven asynchronous downstream processing — eliminating server-management overhead.",
      "Expanded ingestion to Google Drive and OneDrive/SharePoint with fine-grained permissions, encrypted uploads, and robust retry/rate-limit handling via the Drive API, Picker API, and Azure APIs.",
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
    period: "2023 – Present", // placeholder — adjust to your actual tenure
    highlights: [
      "Authored the “SynthQuest: Building a VST from Scratch” blog series, breaking down real-time audio DSP and the JUCE plugin pipeline from oscillators to a shippable VST.",
      "Conducted hands-on audio-programming workshops at local schools, teaching peers and students the fundamentals of sound synthesis and DSP.",
      "Led the technical execution of Clueminati, CookOff, and DevSoc — flagship hackathons and events with 1000+ combined participants.",
    ],
    stack: ["C++", "JUCE", "Audio DSP", "Next.js"],
  },
  {
    company: "GraVITas '25 — VIT's Tech Fest",
    role: "Tech Coordinator",
    location: "Vellore, India",
    period: "2025", // placeholder — adjust to your actual tenure
    highlights: [
      "Oversaw technical operations of GraVITas '25 — one of the largest student-run fests in India with 40,000+ participants and 200+ events — ensuring smooth website and platform performance.",
      "Led and mentored a team of developers building the portal and admin panel with role-based access for events, logistics, and R&R teams, improving productivity and workflow efficiency.",
    ],
    stack: ["Next.js", "TypeScript"],
  },
];
