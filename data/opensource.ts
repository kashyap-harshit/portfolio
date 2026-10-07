export type OpenSourcePRData = {
  project: string;
  repo: string;
  repoUrl: string;
  prNumber: number;
  prUrl: string;
  title: string;
  status: "merged" | "open" | "closed";
  mergedDate: string;
  diff: {
    additions: number;
    deletions: number;
  };
  organization: string;
  logo?: string;
  summary: string;
  highlights: string[];
  techStack: string[];
  issueUrl?: string;
  issueNumber?: number;
  isPrivate?: boolean;
  accessNote?: string;
  reviewedBy?: string;
};

export const openSourcePRs: OpenSourcePRData[] = [
  {
    project: "ac-timbral-models",
    repo: "MTG/ac-timbral-models-python-essentia",
    repoUrl: "https://github.com/MTG/ac-timbral-models-python-essentia",
    prNumber: 1,
    prUrl: "https://github.com/MTG/ac-timbral-models-python-essentia/pull/1",
    title: "Porting of the Sharpness Model",
    status: "merged",
    mergedDate: "Oct 2026",
    diff: {
      additions: 360,
      deletions: 78,
    },
    organization: "Music Technology Group (UPF)",
    logo: "/upf.png",
    isPrivate: true,
    accessNote:
      "Private MTG repository (UPF research) — access restricted to organization collaborators",
    reviewedBy: "@ffont (MTG Lead / Freesound Director)",
    summary:
      "Re-engineered the psychoacoustic sharpness model in native **Essentia**, reducing benchmark discrepancy from **24.21% to 0.36%** with a **1.41× speedup**.",
    highlights: [
      "Eliminated external dependencies (`scipy`, `soundfile`, `pyloudnorm`) by porting directly to native Essentia algorithms (`MonoLoader`, `LoudnessEBUR128`, `IIR`).",
      "Extracted reusable **ISO 532B (DIN 45631 / Zwicker)** specific loudness module with precomputed static Butterworth & Chebyshev filter coefficients across **28 third-octave bands**.",
      "Reduced average error across benchmark suite from **24.21% down to 0.36%** while running **1.41× faster** than the original Scipy implementation.",
      "Architected for zero-overhead translation into native **Essentia C++** with zero external DSP dependencies.",
    ],
    techStack: ["Python", "Audio DSP", "Essentia", "NumPy", "C++"],
  },
  {
    project: "Freesound",
    repo: "MTG/freesound",
    repoUrl: "https://github.com/MTG/freesound",
    prNumber: 2166,
    prUrl: "https://github.com/MTG/freesound/pull/2166",
    issueNumber: 1575,
    issueUrl: "https://github.com/MTG/freesound/issues/1575",
    title: "Fix 'Last Post' & Thread Counters on Spammer Cascade Deletion",
    status: "merged",
    mergedDate: "Jul 2026",
    diff: {
      additions: 70,
      deletions: 22,
    },
    organization: "Music Technology Group (UPF)",
    logo: "/upf.png",
    isPrivate: false,
    reviewedBy: "@ffont (Freesound Lead)",
    summary:
      "Resolved silent signal failures during spammer account cascade deletion and built a production management command to heal historical database corruption.",
    highlights: [
      "Fixed `post_delete` signal handler where cascade deletions raised silent `Profile.DoesNotExist` exceptions, halting thread and forum metadata repairs.",
      "Replaced profile decrements with queryset `.update()` no-ops and clamped counters with `Greatest(..., 0)` to guarantee out-of-sync safety.",
      "Authored unit and regression tests covering both direct user deletion and soft profile purge execution paths.",
      "Shipped `update_last_thread_forum_posts` **Django management command** to scan and repair historical corrupted forum rows in production.",
    ],
    techStack: ["Python", "Django", "PostgreSQL"],
  },
];
