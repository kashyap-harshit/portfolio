"use client";
import React from "react";
import Noise from "./Noise";
import { Cinzel, Quicksand } from "next/font/google";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";
import TicTacToeFrame from "./TicTacToeFrame";
import { ProjectData } from "@/data/projects";
import { useTechHover } from "./TechHoverContext";
import { rich } from "./rich";
const jim = Cinzel({
  weight: "600",
  subsets: ["latin"],
});

const caveat = Quicksand({
  weight: "400",
  subsets: ["latin"],
});

function Project({ title, description, icon, techStack, links }: ProjectData) {
  const { setHovered } = useTechHover();
  return (
    <div
      className="relative w-[90%] mb-8"
      onMouseEnter={() => setHovered(techStack)}
      onMouseLeave={() => setHovered([])}
    >
      <TicTacToeFrame />
      <div className="relative overflow-hidden isolate">
        <Noise
          fullScreen={false}
          patternSize={250}
          patternScaleX={1}
          patternScaleY={1}
          patternRefreshInterval={2}
          patternAlpha={35}
        />
        <div className="relative">
          <div>
            <img
              src={icon}
              alt={`${title} icon`}
              className="float-right relative -z-10 h-12 w-12 shrink-0 object-cover border-2 border-[#8b1e3f]"
            />
            <span
              className={`${jim.className} bg-[#3c153b]/40 title border-b-2 border-[#8b1e3f] border-r-2 text-xl px-2`}
            >
              {title}
            </span>{" "}
            <span className={`${caveat.className} px-2 text-sm`}>{rich(description)}</span>
          </div>
          <div
            className={`${caveat.className} border-t-2 border-[#8b1e3f] p-1 text-sm`}
          >
            <b>Tech Stack := </b>
            <i>{techStack.join(", ")}</i>
          </div>
          <div className=" h-10 border-t-2 border-[#8b1e3f] flex justify-around items-center text-sm">
            {links.map((link) => (
              <div key={link.href}>
                <Link
                  href={link.href}
                  target="_blank"
                  className="inline-flex items-center gap-1 underline"
                >
                  {link.label}
                  <FiExternalLink className="shrink-0" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Project;
