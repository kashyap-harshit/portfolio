"use client";
import React from "react";
import Noise from "./Noise";
import { Cinzel, Quicksand } from "next/font/google";
import TicTacToeFrame from "./TicTacToeFrame";
import { EducationData } from "@/data/education";
import { rich } from "./rich";

const jim = Cinzel({
  weight: "600",
  subsets: ["latin"],
});

const caveat = Quicksand({
  weight: "400",
  subsets: ["latin"],
});

function EducationCard({
  degree,
  institution,
  location,
  period,
  highlights,
  projects,
  logo,
}: EducationData) {
  return (
    <div className="relative w-[90%] mb-8">
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
            {logo && (
              <img
                src={logo}
                alt={`${institution} logo`}
                className="float-right relative -z-10 h-12 w-12 shrink-0 object-cover border-2 border-[#8b1e3f]"
              />
            )}
            <span
              className={`${jim.className} bg-[#3c153b]/40 title border-b-2 border-[#8b1e3f] border-r-2 text-xl px-2`}
            >
              {institution}
            </span>{" "}
            <span className={`${caveat.className} px-2`}>{degree}</span>
            <div></div>
            <span className={`${caveat.className} px-2 text-xs text-[#f0c987]`}>
              {location} · {period}
            </span>
          </div>

          <ul
            className={`${caveat.className} border-t-2 border-[#8b1e3f] p-2 text-sm flex flex-col gap-1.5`}
          >
            {highlights.map((h, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-[#8b1e3f] select-none">#</span>
                <span>{rich(h)}</span>
              </li>
            ))}
          </ul>

          {projects && projects.length > 0 && (
            <div
              className={`${caveat.className} border-t-2 border-[#8b1e3f] p-2 text-sm flex flex-col gap-1.5`}
            >
              <b className="text-[#f0c987]">Top Course Projects</b>
              {projects.map((p, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-[#8b1e3f] select-none">›</span>
                  <span>
                    <b>{p.name}</b>: {rich(p.description)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EducationCard;
