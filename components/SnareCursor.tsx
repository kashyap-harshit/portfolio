"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { getMuted } from "./muteStore";

/**
 * A little snare drum that replaces the mouse cursor site-wide. The drum head
 * is the hotspot (it sits exactly under the pointer). On click the head flashes
 * and the whole drum squashes like it's been struck, a ripple rings out from the
 * point of impact, and a snare sample fires.
 *
 * Coexists with the Tech Stack reticle (TargetCursor): while the pointer is
 * inside a `.reticle-zone` element this cursor hides and stays silent so the
 * reticle can take over.
 *
 * Disabled on touch devices. Honours `prefers-reduced-motion` (keeps the sound
 * + a subtle flash, drops the squash and ripple).
 */
const SNARE_SRC = "/snare.wav";

export default function SnareCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const drumRef = useRef<SVGGElement>(null);
  const sticksRef = useRef<SVGGElement>(null);
  const headRef = useRef<SVGEllipseElement>(null);
  const rippleLayerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const inReticleZoneRef = useRef(false);

  useEffect(() => {
    const isTouch =
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0) &&
      window.innerWidth <= 768;
    if (isTouch) return;

    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Hide the OS cursor everywhere, robustly (wins over cursor-pointer classes
    // and the reticle restoring body cursor on leave).
    const style = document.createElement("style");
    style.textContent =
      "html.snare-cursor-on, html.snare-cursor-on * { cursor: none !important; }";
    document.head.appendChild(style);
    document.documentElement.classList.add("snare-cursor-on");

    // Preload the sample; clone per hit so rapid clicks overlap cleanly.
    const base = new Audio(SNARE_SRC);
    base.preload = "auto";
    audioRef.current = base;

    gsap.set(root, { xPercent: -50, yPercent: -50, x: -100, y: -100 });
    root.style.opacity = "0";

    const move = (e: MouseEvent) => {
      root.style.opacity = inReticleZoneRef.current ? "0" : "1";
      gsap.to(root, { x: e.clientX, y: e.clientY, duration: 0.08, ease: "power3.out" });
    };

    const spawnRipple = () => {
      const layer = rippleLayerRef.current;
      if (!layer) return;
      const ring = document.createElement("div");
      ring.style.cssText =
        "position:absolute;left:0;top:0;width:26px;height:26px;margin:-13px 0 0 -13px;" +
        "border:2px solid #f0c987;border-radius:9999px;opacity:0.9;";
      layer.appendChild(ring);
      gsap.to(ring, {
        scale: 3.2,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => ring.remove(),
      });
    };

    const strike = (e: MouseEvent) => {
      if (inReticleZoneRef.current) return;
      // Controls opting out of the drum (e.g. the mute toggle) never strike —
      // otherwise the act of muting would itself play a snare.
      if ((e.target as Element)?.closest?.("[data-no-snare]")) return;

      // Sound (skip when globally muted)
      if (!getMuted()) {
        const a = base.cloneNode(true) as HTMLAudioElement;
        a.volume = 0.55;
        a.play().catch(() => {});
      }

      // Head flash
      if (headRef.current) {
        gsap.fromTo(
          headRef.current,
          { fill: "#ffffff" },
          { fill: "#efe7cf", duration: 0.28, ease: "power2.out" },
        );
      }

      if (reduceMotion) return;

      // Squash + rebound. svgOrigin pins the pivot to the bottom-centre of the
      // shell in SVG user space (robust across browsers, unlike transform-box).
      if (drumRef.current) {
        gsap.killTweensOf(drumRef.current);
        gsap
          .timeline()
          .to(drumRef.current, { scaleY: 0.72, scaleX: 1.12, svgOrigin: "24 30", duration: 0.06, ease: "power2.out" })
          .to(drumRef.current, { scaleY: 1, scaleX: 1, svgOrigin: "24 30", duration: 0.45, ease: "elastic.out(1, 0.4)" });
      }
      // Sticks dip down to tap the head, then rebound.
      if (sticksRef.current) {
        gsap.killTweensOf(sticksRef.current);
        gsap
          .timeline()
          .to(sticksRef.current, { y: 4, duration: 0.05, ease: "power2.in" })
          .to(sticksRef.current, { y: 0, duration: 0.4, ease: "elastic.out(1, 0.5)" });
      }
      spawnRipple();
    };

    // Reticle-zone coexistence: hide + mute while inside a `.reticle-zone`.
    const onOver = (e: MouseEvent) => {
      const inZone = !!(e.target as Element)?.closest?.(".reticle-zone");
      if (inZone !== inReticleZoneRef.current) {
        inReticleZoneRef.current = inZone;
        root.style.opacity = inZone ? "0" : "1";
      }
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mousedown", strike);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", strike);
      document.documentElement.classList.remove("snare-cursor-on");
      style.remove();
      gsap.killTweensOf(root);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="fixed top-0 left-0 w-0 h-0 pointer-events-none"
      style={{ zIndex: 10000, willChange: "transform" }}
      aria-hidden
    >
      <div ref={rippleLayerRef} className="absolute top-0 left-0" />
      <svg
        width={48}
        height={44}
        viewBox="0 0 48 44"
        style={{ transform: "translate(-24px, -20px)", overflow: "visible" }}
      >
        <g ref={drumRef}>
          {/* bottom rim (shadowed) */}
          <ellipse cx={24} cy={30} rx={20} ry={7} fill="#5e142b" />
          {/* shell */}
          <path d="M4 20 L4 30 A20 7 0 0 0 44 30 L44 20 Z" fill="#8b1e3f" />
          {/* tension rods */}
          {[8, 16, 24, 32, 40].map((x) => (
            <line key={x} x1={x} y1={19} x2={x} y2={31} stroke="#f0c987" strokeWidth={1.4} />
          ))}
          {/* drum head */}
          <ellipse
            ref={headRef}
            cx={24}
            cy={20}
            rx={20}
            ry={7}
            fill="#efe7cf"
            stroke="#f0c987"
            strokeWidth={2}
          />
        </g>
        {/* Crossed drumsticks resting on the head (separate group so they don't
            squash with the shell; they dip to tap the head on a hit). */}
        <g ref={sticksRef}>
          {/* left stick */}
          <line x1={7} y1={1} x2={22} y2={16} stroke="#d4a76a" strokeWidth={2.8} strokeLinecap="round" />
          <line x1={7} y1={1} x2={22} y2={16} stroke="#a97b45" strokeWidth={0.8} strokeLinecap="round" />
          <circle cx={22} cy={16} r={2} fill="#e6c893" />
          {/* right stick (drawn on top at the cross) */}
          <line x1={41} y1={1} x2={26} y2={16} stroke="#d4a76a" strokeWidth={2.8} strokeLinecap="round" />
          <line x1={41} y1={1} x2={26} y2={16} stroke="#a97b45" strokeWidth={0.8} strokeLinecap="round" />
          <circle cx={26} cy={16} r={2} fill="#e6c893" />
        </g>
      </svg>
    </div>
  );
}
