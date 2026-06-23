"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Aurora from "@/components/Aurora";
import Image from "next/image";
import Noise from "@/components/Noise";
import Pfp from "@/components/Pfp";

import {
  Special_Gothic_Condensed_One,
  Carrois_Gothic,
  Caveat,
  Meie_Script,
  Ballet,
  Arizonia,
  Quicksand,
  Jim_Nightshade,
  Almendra,
  Cinzel,
} from "next/font/google";
import TechStack from "@/components/Techstack";
import RandomFact from "@/components/RandomFact";
import About from "@/components/About";
import Education from "@/components/Education";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Blogs from "@/components/Blogs";
import TicTacToeFrame, { HASH_OVERSHOOT } from "@/components/TicTacToeFrame";
import { TechHoverProvider } from "@/components/TechHoverContext";

const spco = Special_Gothic_Condensed_One({
  weight: "400",
  subsets: ["latin"],
});
const carrois = Carrois_Gothic({
  subsets: ["latin"],
  weight: "400",
});

const jim = Cinzel({
  weight: "600",
  subsets: ["latin"],
});

const caveat = Quicksand({
  weight: "400",
  subsets: ["latin"],
});

const meine = Arizonia({
  subsets: ["latin"],
  weight: "400",
});

const sections = [
  { id: "about", label: "ABOUT" },
  { id: "first", label: "PROJECTS" },
  { id: "second", label: "EXPERIENCE" },
  { id: "third", label: "EDUCATION" },
  { id: "fourth", label: "BLOGS" },
];

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState(sections[0].id);

  // Fit-to-height: on desktop the hero panel is a fixed screen, so if its
  // content is taller than the available space (short viewport / 100% zoom) we
  // scale it down to fit instead of overflowing or showing a scrollbar.
  const heroRegionRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const [heroScale, setHeroScale] = useState(1);

  useEffect(() => {
    const region = heroRegionRef.current;
    const content = heroContentRef.current;
    if (!region || !content) return;
    const fit = () => {
      // Only scale on desktop; mobile lays the page out in normal flow.
      if (!window.matchMedia("(min-width: 768px)").matches) {
        setHeroScale(1);
        return;
      }
      const available = region.clientHeight;
      const natural = content.offsetHeight; // layout height, ignores the transform
      setHeroScale(natural > 0 ? Math.min(1, available / natural) : 1);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(region);
    ro.observe(content);
    window.addEventListener("resize", fit);
    document.fonts?.ready.then(fit);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, []);

  // --- Scrollspy highlight (TV-shutter style moving rectangle) ---
  const navRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const activeIdRef = useRef(activeId);
  const didInit = useRef(false);
  activeIdRef.current = activeId;

  // Geometry of a button relative to the nav container (its offsetParent).
  const measure = (idx: number) => {
    const btn = btnRefs.current[idx];
    if (!btn) return null;
    return {
      left: btn.offsetLeft,
      top: btn.offsetTop,
      width: btn.offsetWidth,
      height: btn.offsetHeight,
    };
  };

  // Snap the highlight to a button instantly (no animation).
  const snapToActive = () => {
    const hl = highlightRef.current;
    const t = measure(sections.findIndex((s) => s.id === activeIdRef.current));
    if (!hl || !t) return;
    tlRef.current?.kill();
    gsap.set(hl, {
      left: t.left,
      top: t.top,
      width: t.width,
      height: t.height,
    });
  };

  // Keep the highlight aligned through font loads / window resizes.
  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(snapToActive);
    };
    document.fonts?.ready.then(snapToActive);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Animate the highlight whenever the active section changes.
  useEffect(() => {
    const hl = highlightRef.current;
    const t = measure(sections.findIndex((s) => s.id === activeId));
    if (!hl || !t) return;

    // First paint: just place it, no animation.
    if (!didInit.current) {
      didInit.current = true;
      gsap.set(hl, {
        left: t.left,
        top: t.top,
        width: t.width,
        height: t.height,
      });
      return;
    }

    tlRef.current?.kill();

    // The four edges and how far each overshoots the corners when open.
    const topL = hl.querySelector(".ttt-line--top") as HTMLElement;
    const bottomL = hl.querySelector(".ttt-line--bottom") as HTMLElement;
    const leftL = hl.querySelector(".ttt-line--left") as HTMLElement;
    const rightL = hl.querySelector(".ttt-line--right") as HTMLElement;

    const curTop = (gsap.getProperty(hl, "top") as number) || 0;
    const curHeight = (gsap.getProperty(hl, "height") as number) || t.height;
    const curCenter = curTop + curHeight / 2;

    const collapseH = curHeight * 0.55; // shutter "closed" at the source
    const targetCollapseH = t.height * 0.55; // ...and at the destination
    const targetCenter = t.top + t.height / 2;

    const tl = gsap.timeline();
    // 1. Close toward center in place AND retract edges flush to the corners.
    tl.to(hl, {
      height: collapseH,
      top: curCenter - collapseH / 2,
      duration: 0.1,
      ease: "power2.inOut",
    });
    tl.to(
      topL,
      {
        left: -HASH_OVERSHOOT.top / 2,
        right: -HASH_OVERSHOOT.top / 2,
        duration: 0.1,
        ease: "power2.inOut",
      },
      "<",
    );
    tl.to(
      bottomL,
      {
        left: -HASH_OVERSHOOT.bottom / 2,
        right: -HASH_OVERSHOOT.bottom / 2,
        duration: 0.1,
        ease: "power2.inOut",
      },
      "<",
    );
    tl.to(
      leftL,
      {
        top: -HASH_OVERSHOOT.left / 2,
        bottom: -HASH_OVERSHOOT.left / 2,
        duration: 0.1,
        ease: "power2.inOut",
      },
      "<",
    );
    tl.to(
      rightL,
      {
        top: -HASH_OVERSHOOT.right / 2,
        bottom: -HASH_OVERSHOOT.right / 2,
        duration: 0.1,
        ease: "power2.inOut",
      },
      "<",
    );
    // 2. Brief hold, then glide + resize behind the next button (edges stay flush).
    tl.to(
      hl,
      {
        left: t.left,
        width: t.width,
        height: targetCollapseH,
        top: targetCenter - targetCollapseH / 2,
        duration: 0.26,
        ease: "power2.inOut",
      },
      "+=0.04",
    );
    // 3. Brief hold, then open to full height AND let the edges shoot past the corners.
    tl.to(
      hl,
      {
        height: t.height,
        top: t.top,
        duration: 0.1,
        ease: "power2.inOut",
      },
      "+=0.04",
    );
    tl.to(
      topL,
      {
        left: -HASH_OVERSHOOT.top,
        right: -HASH_OVERSHOOT.top,
        duration: 0.1,
        ease: "power2.inOut",
      },
      "<",
    );
    tl.to(
      bottomL,
      {
        left: -HASH_OVERSHOOT.bottom,
        right: -HASH_OVERSHOOT.bottom,
        duration: 0.1,
        ease: "power2.inOut",
      },
      "<",
    );
    tl.to(
      leftL,
      {
        top: -HASH_OVERSHOOT.left,
        bottom: -HASH_OVERSHOOT.left,
        duration: 0.1,
        ease: "power2.inOut",
      },
      "<",
    );
    tl.to(
      rightL,
      {
        top: -HASH_OVERSHOOT.right,
        bottom: -HASH_OVERSHOOT.right,
        duration: 0.1,
        ease: "power2.inOut",
      },
      "<",
    );
    tlRef.current = tl;
  }, [activeId]);

  useEffect(() => {
    const container = scrollContainerRef.current;

    const handleScroll = () => {
      // Section positions are viewport-relative, so the same midline check works
      // whether the desktop inner column scrolls or the whole window scrolls on
      // mobile.
      const midline = window.innerHeight / 2;

      let current = sections[0].id;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= midline) current = s.id;
      }

      // Pin to the edges: when the scroll area touches the top, highlight the
      // first section; when it touches the bottom, highlight the last.
      const scrollTop = container ? container.scrollTop : window.scrollY;
      const viewport = container ? container.clientHeight : window.innerHeight;
      const full = container
        ? container.scrollHeight
        : document.documentElement.scrollHeight;
      if (scrollTop <= 8) {
        current = sections[0].id;
      } else if (scrollTop + viewport >= full - 8) {
        current = sections[sections.length - 1].id;
      }

      setActiveId(current);
    };

    handleScroll();
    // Desktop: the right column is its own scroller. Mobile: the page scrolls.
    container?.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container?.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="overflow-x-hidden">
      <Aurora
        colorStops={["#3c153b", "#8b1e3f", "#8b1e3f"]}
        blend={0.5}
        amplitude={1.0}
        speed={0.5}
      />
      <TechHoverProvider>
        <div className="w-full min-h-screen flex flex-col md:grid md:grid-cols-2 md:h-screen">
          <div className="relative md:overflow-hidden border-b md:border-b-0 md:border-r border-[#8b1e3f]">
            <Noise
              fullScreen={false}
              patternSize={250}
              patternScaleX={1}
              patternScaleY={1}
              patternRefreshInterval={2}
              patternAlpha={15}
            />
            <div className="min-h-screen md:h-screen flex flex-col justify-between">
              <div
                ref={heroRegionRef}
                className="flex items-center justify-center w-full md:h-[95vh] md:min-h-0 overflow-hidden py-12 md:py-0"
              >
                <div
                  ref={heroContentRef}
                  style={{
                    transform: `scale(${heroScale})`,
                    transformOrigin: "center center",
                  }}
                  className="flex flex-col items-center w-full"
                >
                <div className="w-6/7">
                  <div className=" text-center ">
                    <div className="w-full flex flex-col items-center">
                      <div
                        className="relative mb-2 z-0 mt-4 md:mt-12 flex items-stretch"
                        style={{
                          background:
                            "url(/pfp-poster-blur.png) center / cover no-repeat",
                        }}
                      >
                        {/* Slatted side bars: equal-width segments, transparent at
                          the edges (touching the pic and the outside) so the blurred
                          poster shows through. true = bar, false = gap. */}
                        <div className="relative z-10 flex items-stretch">
                          {[false, true, false, true, false].map((bar, i) => (
                            <div
                              key={i}
                              className={`w-1.5 ${bar ? "bg-[#8b1e3f] shadow-lg shadow-black/50" : "bg-transparent"}`}
                            />
                          ))}
                        </div>
                        <div className="relative z-10 w-40 h-60 shrink-0 border-x-2 border-[#8b1e3f]">
                          <Pfp className="w-40 h-60 object-cover" />
                        </div>
                        <div className="relative z-10 flex items-stretch">
                          {[false, true, false, true, false].map((bar, i) => (
                            <div
                              key={i}
                              className={`w-1.5 ${bar ? "bg-[#8b1e3f] shadow-lg shadow-black/50" : "bg-transparent"}`}
                            />
                          ))}
                        </div>
                        <div className="absolute inset-0 z-20 pointer-events-none">
                          <TicTacToeFrame />
                        </div>
                      </div>
                      <div className="relative z-10">
                        {/* Base name */}
                        <p
                          className={`text-4xl sm:text-5xl md:text-6xl text-[#89bd9e] ${meine.className}`}
                        >
                          Harshit Kashyap Sarma
                        </p>
                        {/* Recolored copy, clipped to just the centered band that
                          sits over the pfp (pfp is 160px wide → 80px each side
                          of center). Change text-[...] to recolor only this part. */}

                      </div>
                      <div className="relative z-10">
                        {/* Base underline (original SVG colors) */}
                        <Image
                          src={"/stroke3.svg"}
                          className="w-lg h-8 z-10"
                          alt={""}
                          width={100}
                          height={100}
                        ></Image>

                      </div>
                      <p
                        className={`text-base sm:text-lg md:text-xl text-center text-[#89bd9e] mt-4 ${jim.className} font-bold`}
                      >
                        {" "}
                        Audio Technology / Full Stack / AI-ML
                      </p>
                    </div>
                    <div className={`${spco.className} `}>
                      <TechStack />
                    </div>
                  </div>
                </div>
                <div
                  ref={navRef}
                  className="scrollspy relative mt-4 flex flex-col items-center gap-2 text-center text-base"
                >
                  <div
                    ref={highlightRef}
                    className="nav-highlight hidden md:block"
                    aria-hidden
                  >
                    <TicTacToeFrame />
                  </div>
                  {sections.map((s, i) => (
                    <div
                      key={s.id}
                      ref={(el) => {
                        btnRefs.current[i] = el;
                      }}
                      onClick={() => scrollTo(s.id)}
                      className={`${jim.className} relative z-1 cursor-pointer px-5 py-1.5 transition-colors duration-300 ${
                        activeId === s.id ? "text-[#f0c987]" : "text-[#89bd9e]"
                      }`}
                    >
                      {s.label}
                    </div>
                  ))}
                </div>
                </div>
              </div>
              <div
                className={`${caveat.className} hidden md:block text-xs text-center w-full text-[#f0c987]`}
              >
                <b>random fact := </b>{" "}
                <i>
                  {" "}
                  ```
                  <RandomFact />
                  ```
                </i>
              </div>
            </div>
          </div>

          <div className="md:overflow-auto" ref={scrollContainerRef}>
            <div id="about">
              <About />
            </div>
            <div id="first">
              <Projects />
            </div>
            <div id="second">
              <Experience />
            </div>
            <div id="third">
              <Education />
            </div>
            <div id="fourth">
              <Blogs />
            </div>
          </div>
        </div>
      </TechHoverProvider>
    </div>
  );
}
