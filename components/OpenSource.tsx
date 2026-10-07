"use client";
import React from "react";
import Link from "next/link";
import OpenSourceCard from "./OpenSourceCard";
import { Arizonia } from "next/font/google";
import { FiArrowDown } from "react-icons/fi";
import { openSourcePRs } from "@/data/opensource";
import { GITHUB_PROFILE } from "@/data/projects";
import { useTechHover } from "./TechHoverContext";

const meine = Arizonia({
  subsets: ["latin"],
  weight: "400",
});

function OpenSource() {
  const { setAll } = useTechHover();

  return (
    <div className="mt-4 w-full flex flex-col items-center border-b border-[#8b1e3f] pb-4">
      <h2 className={`${meine.className} text-4xl mb-4`}>Open Source</h2>
      {openSourcePRs.map((pr) => (
        <OpenSourceCard key={`${pr.repo}-${pr.prNumber}`} {...pr} />
      ))}
      <Link
        href={`${GITHUB_PROFILE}?tab=repositories`}
        target="_blank"
        onMouseEnter={() => setAll(true)}
        onMouseLeave={() => setAll(false)}
        className="group mt-2 flex flex-col items-center gap-1"
      >
        <span className="underline underline-offset-4">
          More Contributions on GitHub
        </span>
        <FiArrowDown className="animate-bounce" />
      </Link>
    </div>
  );
}

export default OpenSource;
