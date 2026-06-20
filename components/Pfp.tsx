"use client";
import { useState } from "react";
import Image from "next/image";

/**
 * The profile gif is large (~31MB), so showing it directly leaves an empty box
 * while it downloads. Instead we render a static first-frame poster
 * (pfp-poster.png) immediately and fade the animated gif in once it has fully
 * loaded. Both layers share the same box via `className`.
 */
export default function Pfp({ className = "" }: { className?: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {/* First frame, shown until the gif finishes downloading. */}
      <Image
        src="/pfp-poster.png"
        alt="Harshit Kashyap Sarma"
        width={160}
        height={160}
        priority
        className={`${className} transition-opacity duration-500 ${
          loaded ? "opacity-0" : "opacity-100"
        }`}
      />
      {/* The animated gif, fades in over the poster once loaded. */}
      <Image
        src="/pfp.gif"
        alt=""
        aria-hidden
        width={160}
        height={160}
        unoptimized
        onLoad={() => setLoaded(true)}
        className={`${className} absolute inset-0 transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
}
