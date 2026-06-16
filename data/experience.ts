export type ExperienceData = {
  company: string;
  role: string;
  location: string;
  period: string;
  highlights: string[];
  stack: string[];
};

export const experience: ExperienceData[] = [
  {
    company: "KnowledgeVerse AI",
    role: "Software Development Engineer Intern",
    location: "Bengaluru, India",
    period: "May 2025 – Aug 2025 | Dec 2025 – Present",
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
];
