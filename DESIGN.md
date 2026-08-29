# Design Document — Harshit Kashyap Sarma's Portfolio

> **Last updated:** 2026-08-29
>
> This document describes the architecture, data flow, component design, and
> conventions used throughout this codebase. It is intended for AI coding agents
> and human contributors to quickly understand how the project fits together and
> where to make changes safely.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack Summary](#2-tech-stack-summary)
3. [Directory Structure](#3-directory-structure)
4. [Architecture & Layout](#4-architecture--layout)
5. [Data Layer](#5-data-layer)
6. [Component Catalog](#6-component-catalog)
7. [Visual Effects Pipeline](#7-visual-effects-pipeline)
8. [Audio Engine & Mute System](#8-audio-engine--mute-system)
9. [Cursor System](#9-cursor-system)
10. [Cross-Component Interactions](#10-cross-component-interactions)
11. [Visitor Analytics (Telegram Tracker)](#11-visitor-analytics-telegram-tracker)
12. [Styling & Theming](#12-styling--theming)
13. [Performance Optimizations](#13-performance-optimizations)
14. [Environment & Configuration](#14-environment--configuration)
15. [Conventions & Patterns](#15-conventions--patterns)

---

## 1. Project Overview

A single-page portfolio website for **Harshit Kashyap Sarma** — an audio-tech
and full-stack engineer. The site showcases projects, work experience, education,
and blog posts, wrapped in a highly interactive, audio-visual presentation layer
with custom cursors, WebGL backgrounds, film grain, and sound effects.

**Key characteristics:**
- Single-page app (SPA feel) — all content lives on `/`, scrollable right panel
- Heavy use of **GSAP** for DOM animations and timeline sequencing
- **WebGL** backgrounds via OGL (Aurora) and Three.js (ShapeBlur)
- Custom **dual cursor system** (snare drum + target reticle)
- Built-in **audio player** with global mute and first-visit prompt
- Real-time **Telegram notifications** for visitor tracking
- Fully responsive — desktop is a split-screen; mobile is a single column

---

## 2. Tech Stack Summary

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS v4, OKLCH color system, CSS keyframes |
| Animations | GSAP 3.13 |
| WebGL | OGL 1.0 (Aurora), Three.js 0.181 (ShapeBlur) |
| Icons | `react-icons` (Si, Fa, Fi families), `lucide-react` |
| Fonts | Google Fonts (Geist, Arizonia, Cinzel, Quicksand, etc.) |
| State | `useSyncExternalStore` (muteStore), React Context (TechHover) |
| Package Manager | pnpm |
| Deployment | Vercel (inferred from geo headers, `.env.example`) |

---

## 3. Directory Structure

```
portfolio/
├── app/
│   ├── api/
│   │   └── telegram-notify/
│   │       └── route.ts          # POST — visitor/event notifications to Telegram
│   ├── globals.css               # Tailwind config, custom keyframes, theme vars
│   ├── layout.tsx                # Root layout (server component) — injects global overlays
│   └── page.tsx                  # Main page (client component) — hero + scrollable sections
│
├── components/
│   ├── About.tsx                 # Bio, audio player, links, first-visit modal
│   ├── Aurora.tsx                # Full-screen WebGL aurora gradient (OGL)
│   ├── BlogCard.tsx              # Individual blog post card (supports series stacking)
│   ├── Blogs.tsx                 # Blog section — maps data/blogs.ts → BlogCard
│   ├── Education.tsx             # Education section — maps data/education.ts → EducationCard
│   ├── EducationCard.tsx         # Individual education entry card
│   ├── Events.tsx                # Placeholder (unused)
│   ├── Experience.tsx            # Experience section — maps data/experience.ts → ExperienceCard
│   ├── ExperienceCard.tsx        # Individual experience entry card (tech hover integration)
│   ├── MuteToggle.tsx            # Fixed top-left mute/unmute button
│   ├── Noise.tsx                 # Canvas-based procedural film grain overlay
│   ├── Pfp.tsx                   # Profile picture with progressive gif loading
│   ├── Project.tsx               # Individual project card (tech hover integration)
│   ├── Projects.tsx              # Projects section — maps data/projects.ts → Project
│   ├── RandomFact.tsx            # Fetches a random trivia fact from external API
│   ├── ShapeBlur.tsx             # Mouse-reactive SDF shader canvas (Three.js) — currently unused
│   ├── SnareCursor.tsx           # Custom snare drum cursor (desktop) / tap effect (mobile)
│   ├── SongPlayer.tsx            # Presentational play/pause + seek bar controls
│   ├── StarBorder.tsx            # Animated glowing border wrapper (ReactBits style)
│   ├── TargetCursor.tsx          # Crosshair reticle cursor for the tech stack zone
│   ├── TechHoverContext.tsx      # React Context for cross-component tech badge highlighting
│   ├── Techstack.tsx             # Grid of tech badges with target cursor + star borders
│   ├── TelegramTracker.tsx       # Headless component — fires page view on mount
│   ├── TicTacToeFrame.tsx        # Tic-tac-toe (#) decorative border frame
│   ├── muteStore.ts              # Global mute state (window.__muteStore, useSyncExternalStore)
│   └── rich.tsx                  # Inline markdown parser (**bold**, *italic*, __underline__)
│
├── data/
│   ├── blogs.ts                  # BlogData[] — blog posts and series
│   ├── education.ts              # EducationData[] — degrees and course projects
│   ├── experience.ts             # ExperienceData[] — work experience entries
│   └── projects.ts               # ProjectData[] — featured projects + GITHUB_PROFILE constant
│
├── lib/
│   ├── telegramTracker.ts        # Client-side helpers: trackPageView(), trackCustomEvent()
│   └── utils.ts                  # cn() — clsx + tailwind-merge
│
└── public/                       # Static assets (images, audio, resume, SVGs)
```

---

## 4. Architecture & Layout

### Rendering Strategy

```
layout.tsx (Server Component)
  ├── TelegramTracker   ← headless, fires page view
  ├── SnareCursor       ← global custom cursor
  ├── MuteToggle        ← fixed top-left control
  └── page.tsx (Client Component)
        ├── Aurora          ← fixed WebGL background (z: -50)
        └── TechHoverProvider (Context)
              └── 2-column grid (desktop) / single column (mobile)
                    ├── Left: Hero Panel (fixed on desktop)
                    │     ├── Pfp (profile picture)
                    │     ├── Name + title
                    │     ├── TechStack (with TargetCursor)
                    │     ├── Scrollspy nav (GSAP animated highlight)
                    │     └── RandomFact (desktop footer)
                    │
                    └── Right: Scrollable Content
                          ├── #about    → About
                          ├── #first    → Projects
                          ├── #second   → Experience
                          ├── #third    → Education
                          └── #fourth   → Blogs
```

### Desktop vs Mobile

| Aspect | Desktop (≥768px) | Mobile (<768px) |
|---|---|---|
| Layout | 50/50 `grid-cols-2`, `h-screen` | Single column, normal flow |
| Hero panel | Fixed, `overflow-hidden`, scale-to-fit | In-flow, full-width |
| Scrollspy nav | Vertical column + animated `#` highlight | Horizontal wrapping, underlined links |
| Scrolling | Right column only (`overflow-auto`) | Whole page scrolls |
| SnareCursor | Follows mouse globally | Tap-spawned snare at touch point |
| TargetCursor | Spinning reticle in tech stack zone | Hidden (returns `null`) |
| Aurora | Animated at full frame rate | Single static frame |
| Noise grain | 0.7s flicker animation | 1.6s slower animation |

### Hero Scale-to-Fit

On desktop, if the hero content is taller than the viewport (e.g. short screens
at 100% zoom), the entire hero panel CSS-scales down via
`transform: scale(heroScale)` to fit without overflow. This is driven by a
`ResizeObserver` on both the region and content containers.

---

## 5. Data Layer

All portfolio content lives in `data/*.ts` as typed arrays. **No CMS, no database,
no build-time fetching.** To update content, edit the TypeScript files directly.

### Schemas

#### `BlogData` (`data/blogs.ts`)
```typescript
{
  title: string;
  excerpt: string;      // Supports **bold**, *italic* via rich()
  href: string;
  icon: string;         // Path to /public image
  series?: boolean;     // Renders stacked "pile" effect
  count?: number;       // "N-part series" badge
}
```

#### `EducationData` (`data/education.ts`)
```typescript
{
  degree: string;
  institution: string;
  location: string;
  period: string;
  highlights: string[];
  projects?: { name: string; description: string }[];
  logo?: string;
}
```

#### `ExperienceData` (`data/experience.ts`)
```typescript
{
  company: string;
  role: string;
  location: string;
  period: string;
  highlights: string[];  // Supports **bold** via rich()
  stack: string[];       // Drives TechHoverContext highlighting
  logo?: string;
  website?: string;
}
```

#### `ProjectData` (`data/projects.ts`)
```typescript
{
  title: string;
  description: string;  // Supports **bold** via rich()
  icon: string;
  techStack: string[];  // Drives TechHoverContext highlighting
  links: { label: string; href: string }[];
}
```

### Content Rendering

Markdown-like inline formatting in `highlights`, `description`, and `excerpt`
fields is parsed at render time by the `rich()` function (`components/rich.tsx`):

| Syntax | Output |
|---|---|
| `**text**` | `<b>text</b>` |
| `*text*` | `<i>text</i>` |
| `__text__` | `<u>text</u>` |

---

## 6. Component Catalog

### Section Components (right panel)

| Component | Data Source | Card Component | Renders |
|---|---|---|---|
| `About` | Hardcoded | — | Bio, song player, social links |
| `Projects` | `data/projects.ts` | `Project` | Project cards + "More Projects" link |
| `Experience` | `data/experience.ts` | `ExperienceCard` | Work entries with tech stacks |
| `Education` | `data/education.ts` | `EducationCard` | Degree entries with course projects |
| `Blogs` | `data/blogs.ts` | `BlogCard` | Blog/series cards |

### Card Component Pattern

Every card follows the same visual structure:

```
<div className="relative w-[90%]">       ← outer wrapper
  <TicTacToeFrame />                     ← # border decoration
  <div className="relative overflow-hidden isolate">
    <Noise fullScreen={false} ... />     ← film grain texture
    <div className="relative">           ← actual content
      {/* header, body, footer */}
    </div>
  </div>
</div>
```

### Overlay Components (layout-level)

| Component | Position | Purpose |
|---|---|---|
| `Aurora` | `fixed`, `z: -50` | Full-screen WebGL gradient background |
| `SnareCursor` | `fixed`, `z: 10000` | Custom drum cursor / mobile tap effect |
| `MuteToggle` | `fixed top-4 left-4`, `z: 9998` | Global sound mute control |
| `TelegramTracker` | — (renders `null`) | Fires `trackPageView()` on mount |

### Utility Components

| Component | Role |
|---|---|
| `TicTacToeFrame` | Decorative `#` border; static or pulsing; exported `HASH_OVERSHOOT` for GSAP |
| `Noise` | Canvas film grain; drawn once, animated by CSS `transform` jumps |
| `StarBorder` | Animated glowing border wrapper; `active` prop toggles visibility |
| `SongPlayer` | Presentational audio controls (play/pause, seek); state owned by parent |
| `Pfp` | Progressive image: static poster → animated gif fade-in |
| `RandomFact` | Fetches random trivia from `uselessfacts.jsph.pl` API |
| `rich()` | Inline markdown → React nodes parser |

---

## 7. Visual Effects Pipeline

The visual stack renders bottom to top:

```
z: -50   Aurora.tsx       WebGL animated aurora gradient (OGL, simplex noise)
z: auto  Noise.tsx        Canvas grain (per-card or full-screen), CSS animated
z: auto  TicTacToeFrame   Absolute-positioned border lines with corner overshoot
z: auto  StarBorder       Animated radial gradient glow on tech badges
z: 9998  MuteToggle       Fixed mute button
z: 9999  TargetCursor     Reticle crosshair (tech stack zone only)
z: 10000 SnareCursor      Drum cursor (hides inside reticle zone)
```

### Aurora (OGL WebGL)

- Custom GLSL fragment shader with **simplex noise** driving a scrolling aurora
- Three configurable color stops blended along a ramp
- **Mobile/reduced-motion:** Renders a single static frame; no animation loop
- **Mobile:** Antialiasing disabled, DPR forced to 1, throttled to 30fps
- Cleanup: WebGL context properly lost on unmount

### Noise (Canvas 2D)

- Generates a 1024×1024 pixel buffer **once** with random grayscale noise
- All "animation" is CSS `transform: translate(...)` with `steps(1)` — pure
  compositor work, zero JavaScript per frame
- Mobile: animation slowed from 0.7s to 1.6s cycle
- Reduced motion: animation disabled

### TicTacToeFrame

- Four `<span>` elements positioned on each edge of the parent
- Corner overshoot creates the distinctive `#` shape
- `pulse` mode: eight extra nubs grow/retract via CSS keyframes
- The scrollspy highlight in `page.tsx` animates the frame's edges via GSAP,
  using the exported `HASH_OVERSHOOT` constants

### StarBorder

- Two radial gradient blobs sweep along top and bottom edges in opposite
  directions (CSS `animation: star-movement-*`)
- `active` prop controls `opacity` transition — layout stays stable

---

## 8. Audio Engine & Mute System

### Architecture

```
muteStore.ts (window.__muteStore)
  ├── getMuted()         ← synchronous read (for event handlers)
  ├── useMuted()         ← React hook (useSyncExternalStore)
  ├── setMuted(bool)     ← write + persist to localStorage("site-muted")
  └── toggleMuted()      ← convenience toggle

Consumers:
  ├── MuteToggle.tsx     ← toggles state, restores from localStorage on mount
  ├── SnareCursor.tsx    ← checks getMuted() before playing snare.wav
  └── About.tsx          ← keeps <audio>.muted in sync with useMuted()
```

### Why `window.__muteStore`?

The store is attached to `window` (not a module-level variable) so that even if
the module is evaluated multiple times across HMR or code-splitting bundles,
every consumer sees the same singleton object. This prevents the mute toggle and
cursor from drifting out of sync.

### Audio Sources

| Source | File | Triggered by |
|---|---|---|
| Snare hit | `/snare.wav` | Click/tap anywhere (SnareCursor) |
| Background song | `/something.mp3` | Play button in About section |

### First-Visit Sound Prompt

- On the very first visit (`localStorage: "sound-warning-seen"` not set), a modal
  appears offering to play background music
- Auto-dismisses after 5 seconds with a visible countdown
- Accepting triggers `audioRef.play()` (a user gesture, satisfying autoplay policy)

### Floating Song Player

- When the in-card `SongPlayer` scrolls above the viewport **and** audio is
  playing, a floating mini-player appears at `top-4 left-20`
- After pause, it lingers for 5 seconds, then fades away
- Both the in-card and floating players share the same `<audio>` element

---

## 9. Cursor System

### Dual Cursor Architecture

Two custom cursors coexist. The native OS cursor is hidden globally via an
injected `<style>` tag (`.snare-cursor-on` class on `<html>`).

#### SnareCursor (global)

- **Desktop:** An SVG snare drum that follows the mouse via GSAP. On click:
  1. Head flashes white → original color
  2. Drum shell squashes + elastic rebounds (GSAP timeline)
  3. Sticks dip down and rebound
  4. Expanding ripple ring
  5. Cloned `<Audio>` plays snare sample (overlapping rapid hits)
- **Mobile:** No cursor to follow. Each tap spawns a temporary drum at the touch
  point with a pop-in animation; it lingers ~1s, then fades out.
- Hides itself when inside a `.reticle-zone` element (checked via `mouseover`)
- Elements with `data-no-snare` attribute are exempt from strikes

#### TargetCursor (scoped to `.reticle-zone`)

- Spinning crosshair with four bracket corners and a center dot
- When hovering over a `.cursor-target` element, corners snap to the element's
  bounding box via GSAP ticker interpolation with parallax
- Spin pauses during hover, resumes after leave with continuity
- Returns `null` on mobile (no-op)
- Scoped to the tech stack `containerRef` — only appears inside that area

### Coexistence Protocol

```
Mouse enters .reticle-zone
  → SnareCursor.opacity = 0, strike handler returns early
  → TargetCursor shows, spinning reticle appears
  → Body cursor restored to none via injected stylesheet

Mouse leaves .reticle-zone
  → SnareCursor.opacity = 1
  → TargetCursor hides
```

---

## 10. Cross-Component Interactions

### Tech Badge Highlighting (TechHoverContext)

```
TechHoverProvider (wraps entire page)
  │
  ├── Project / ExperienceCard
  │     onMouseEnter → setHovered(techStack)  // e.g. ["Python", "PyTorch"]
  │     onMouseLeave → setHovered([])
  │
  ├── Projects "More Projects" link
  │     onMouseEnter → setAll(true)           // all badges glow
  │     onMouseLeave → setAll(false)
  │
  └── TechStack
        Reads { hovered, all } from context
        For each badge: active = all || hovered.has(normalizeTech(label))
        Wraps badge in <StarBorder active={active}> → glow toggles
```

`normalizeTech()` strips casing and non-alphanumeric characters so that
`"Next.js"` in the data matches `"nextjs"` in the badge list.

### Scrollspy Navigation

```
page.tsx scroll handler
  ├── Listens on: right column scroll (desktop) + window scroll (mobile)
  ├── For each section, checks getBoundingClientRect().top vs viewport midline
  ├── Edge cases: top → first section, bottom → last section
  └── Sets activeId → triggers GSAP highlight animation

GSAP highlight animation (TV-shutter style):
  1. Close: collapse height toward center, retract TicTacToeFrame edges flush
  2. Hold briefly
  3. Glide: move + resize to target button position (edges still flush)
  4. Hold briefly
  5. Open: expand to full height, shoot edges past corners to overshoot values
```

---

## 11. Visitor Analytics (Telegram Tracker)

### Flow

```
Client (browser)
  │
  ├── Mount: TelegramTracker → trackPageView()
  │     └── POST /api/telegram-notify { event: "page_view", path, referrer, ... }
  │         (debounced per session via sessionStorage)
  │
  └── Interactions: trackCustomEvent(title, details)
        └── POST /api/telegram-notify { event: "custom_action", title, details, ... }
            (debounced per event key, 3s cooldown)

Server (route.ts)
  ├── Parse User-Agent → OS, browser, device type, bot detection
  ├── Extract geo from Vercel/Cloudflare headers → country flag emoji
  ├── Format HTML message
  └── POST to Telegram Bot API → sendMessage to configured chat
```

### Tracked Events

| Event | Trigger | Details |
|---|---|---|
| `page_view` | Page mount (once per session) | Path, referrer, screen, language, location |
| `Song Played` | Play button click | Song title |
| `LinkedIn Clicked` | Link click | URL |
| `GitHub Clicked` | Link click | URL |
| `Resume Clicked` | Link click | URL |

### Environment Variables

```
TELEGRAM_BOT_TOKEN=<from @BotFather>
TELEGRAM_CHAT_ID=<your chat ID>
```

If not set, the route returns `200` silently — no errors.

---

## 12. Styling & Theming

### Color Palette

| Token | Color | Usage |
|---|---|---|
| `#89bd9e` (`--one`) | Sage Green | Primary text, headings, status |
| `#f0c987` (`--two`) | Warm Gold/Amber | Accents, active states, highlights |
| `#8b1e3f` | Wine Red/Burgundy | Borders, TicTacToeFrame, drum shell |
| `#3c153b` | Deep Purple | Aurora stop, card overlays |
| `#1a0a18` | Near Black | Modal/button backgrounds |

### Dark Mode

The site is **always in dark mode** — `<body>` has `className="dark"` applied in
`layout.tsx`. The OKLCH color system in `globals.css` defines both `:root` (light)
and `.dark` (dark) tokens, but only dark is used.

### Typography Stack

| Variable | Font | Usage |
|---|---|---|
| Arizonia | Script/cursive | Section headings ("About Me", "Projects", etc.) |
| Cinzel | Serif display | Titles, nav labels, card headers |
| Quicksand | Rounded sans | Body text, descriptions, metadata |
| Special_Gothic_Condensed_One | Gothic | Tech stack container |
| Geist / Geist Mono | System sans / mono | Base font (via CSS variables) |

### CSS Animations (defined in `globals.css`)

| Keyframe | Used by | Technique |
|---|---|---|
| `noise-shift` | `.noise-anim` (Noise canvas) | `steps(1)` translate jumps |
| `ttt-nub-h` / `ttt-nub-v` | TicTacToeFrame pulse mode | `scaleX`/`scaleY` oscillation |
| `star-movement-*` | StarBorder glow blobs | `translate` alternating sweep |

---

## 13. Performance Optimizations

| Area | Optimization |
|---|---|
| **Aurora** | Static frame on mobile/reduced-motion; 30fps throttle on mobile; DPR 1; no antialiasing on mobile |
| **Noise** | Bitmap generated once; all animation is CSS compositor (`transform`, `will-change`) — 0 JS per frame |
| **Pfp** | Static poster rendered with `priority`; 31MB gif loaded lazily with fade-in on `onLoad` |
| **Snare audio** | Each hit clones the `<Audio>` node — rapid clicks overlap without blocking |
| **muteStore** | `useSyncExternalStore` avoids re-renders in unrelated components |
| **TechHoverContext** | `normalizeTech` pre-computes once; `Set<string>` for O(1) lookups |
| **Telegram tracker** | `sessionStorage` debounce for page views; 3s in-memory cooldown for events |
| **Scrollspy** | `{ passive: true }` listeners; `ResizeObserver` for layout changes |

---

## 14. Environment & Configuration

### Required Files

| File | Purpose |
|---|---|
| `.env.local` | `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` |
| `package.json` | Dependencies, scripts (`dev`, `build`, `start`, `lint`) |
| `tsconfig.json` | TypeScript config; path alias `@/*` → `./*` |
| `components.json` | shadcn/ui config (New York style, lucide icons, ReactBits registry) |
| `postcss.config.mjs` | Tailwind CSS postcss plugin |
| `eslint.config.mjs` | Flat config with Next.js core-web-vitals + TypeScript |

### Scripts

```bash
pnpm dev     # Start dev server
pnpm build   # Production build
pnpm start   # Serve production build
pnpm lint    # Run ESLint
```

---

## 15. Conventions & Patterns

### Component Conventions

- **`"use client"`** directive on all interactive components; section wrappers
  (`Education`, `Experience`, `Blogs`) that only map data may omit it
- **Google Font instances** are created at module scope (outside components) to
  avoid re-initialization
- **`data-no-snare`** attribute on elements that should not trigger the snare
  cursor strike (e.g. MuteToggle button)
- **`.reticle-zone`** class on containers where the TargetCursor should activate
  and SnareCursor should hide
- **`.cursor-target`** class on elements the TargetCursor should snap to

### File Organization

- **`data/`** — Pure data (typed arrays + type exports). No React, no side effects.
- **`lib/`** — Framework-agnostic utilities and helpers.
- **`components/`** — React components + the mute store + rich() parser.
- **`app/`** — Next.js App Router pages and API routes only.

### State Management

- **No external state library** (no Redux, Zustand, Jotai, etc.)
- Global audio mute: `muteStore.ts` using vanilla `useSyncExternalStore` + `window`
- Cross-component highlighting: React Context (`TechHoverContext`)
- All other state: local `useState` / `useRef` within components

### Naming

- Section-level components are **singular nouns** (`Experience`, `Education`, `Blogs`)
- Card components are suffixed with **`Card`** (`ExperienceCard`, `EducationCard`, `BlogCard`)
- Exception: `Project.tsx` (card) vs `Projects.tsx` (section)
- Data files use **lowercase plural** names matching their section

### Adding New Content

1. **New project:** Add entry to `data/projects.ts` → `ProjectData[]`
2. **New experience:** Add entry to `data/experience.ts` → `ExperienceData[]`
3. **New education:** Add entry to `data/education.ts` → `EducationData[]`
4. **New blog:** Add entry to `data/blogs.ts` → `BlogData[]`
5. **New tech badge:** Add entry to the `stack` array in `components/Techstack.tsx`
6. **New static asset:** Drop into `/public/`, reference with leading `/`

### Key Exported Constants

| Constant | File | Usage |
|---|---|---|
| `HASH_OVERSHOOT` | `TicTacToeFrame.tsx` | GSAP scrollspy animation targets |
| `GITHUB_PROFILE` | `data/projects.ts` | "More Projects" link + About links |
