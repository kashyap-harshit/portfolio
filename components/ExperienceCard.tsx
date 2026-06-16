"use client";
import React from "react";
import Noise from "./Noise";
import { Cinzel, Quicksand } from "next/font/google";
import TicTacToeFrame from "./TicTacToeFrame";
import { ExperienceData } from "@/data/experience";
import { useTechHover } from "./TechHoverContext";

const jim = Cinzel({
  weight: "600",
  subsets: ["latin"],
});

const caveat = Quicksand({
  weight: "400",
  subsets: ["latin"],
});

function ExperienceCard({
  company,
  role,
  location,
  period,
  highlights,
  stack,
}: ExperienceData) {
  const { setHovered } = useTechHover();
  return (
    <div
      className="relative w-[90%] mb-8"
      onMouseEnter={() => setHovered(stack)}
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
            <span
              className={`${jim.className} bg-[#3c153b]/40 title border-b-2 border-[#8b1e3f] border-r-2 text-xl px-2`}
            >
              {company}
            </span>{" "}
            <span className={`${caveat.className} px-2`}>
              {role} · {location}
            </span>
            <div></div>
            <span
              className={`${caveat.className} px-2  text-xs text-[#f0c987]`}
            >
              {period}
            </span>
          </div>

          <ul
            className={`${caveat.className} border-t-2 border-[#8b1e3f] p-2 text-sm flex flex-col gap-1.5`}
          >
            {highlights.map((h, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-[#8b1e3f] select-none">#</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
          <div
            className={`${caveat.className} border-t-2 border-[#8b1e3f] p-1 text-sm`}
          >
            <b>Stack := </b>
            <i>{stack.join(", ")}</i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExperienceCard;
