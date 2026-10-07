"use client";
import React from "react";
import Noise from "./Noise";
import { Cinzel, Quicksand } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { FiExternalLink, FiGitMerge, FiLock } from "react-icons/fi";
import TicTacToeFrame from "./TicTacToeFrame";
import { OpenSourcePRData } from "@/data/opensource";
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

function OpenSourceCard({
  project,
  repo,
  repoUrl,
  prNumber,
  prUrl,
  title,
  status,
  mergedDate,
  diff,
  organization,
  logo,
  summary,
  highlights,
  techStack,
  issueUrl,
  issueNumber,
  isPrivate,
  accessNote,
  reviewedBy,
}: OpenSourcePRData) {
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
            {logo && (
              <Image
                src={logo}
                alt={`${organization} logo`}
                width={48}
                height={48}
                className="float-right relative -z-10 h-12 w-12 shrink-0 object-cover border-2 border-[#8b1e3f]"
              />
            )}
            <span
              className={`${jim.className} bg-[#3c153b]/40 title border-[#8b1e3f] md:border-b-2 md:border-r-2 text-xl px-2`}
            >
              {project || repo}
              <Link
                href={repoUrl}
                target="_blank"
                aria-label={`${repo} repository`}
                className="ml-1.5 inline-flex align-baseline text-[#f0c987] hover:text-[#89bd9e] transition-colors"
              >
                <FiExternalLink className="inline h-3.5 w-3.5" />
              </Link>
            </span>{" "}
            <span
              className={`${caveat.className} px-2 inline-flex flex-wrap items-center gap-1.5 align-middle text-xs`}
            >
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-semibold bg-[#8250df]/20 text-[#a371f7] border border-[#8250df]/40 font-mono">
                <FiGitMerge className="h-3 w-3 shrink-0" />
                {status.toUpperCase()} #{prNumber}
              </span>
              {isPrivate ? (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-semibold bg-[#f0c987]/15 text-[#f0c987] border border-[#f0c987]/40 font-mono">
                  <FiLock className="h-2.5 w-2.5 shrink-0" />
                  PRIVATE
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-semibold bg-[#89bd9e]/15 text-[#89bd9e] border border-[#89bd9e]/40 font-mono">
                  PUBLIC
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-[11px] font-mono px-1.5 py-0.5 rounded bg-black/40 border border-[#8b1e3f]/50">
                <span className="text-emerald-400">+{diff.additions}</span>
                <span className="text-rose-400">-{diff.deletions}</span>
              </span>
            </span>
            <div></div>
            <div className="px-2 pt-1.5 pb-2">
              <span
                className={`${jim.className} text-base sm:text-lg text-[#f0c987] font-semibold`}
              >
                #{prNumber} · {title}
              </span>
              <div className="flex flex-wrap items-center gap-x-2 text-xs text-[#89bd9e]/90 font-mono mt-0.5">
                {reviewedBy && (
                  <span>
                    ✓ Reviewed &amp; approved by{" "}
                    <span className="text-[#f0c987]">{reviewedBy}</span>
                  </span>
                )}
                <span className="text-[#f0c987]/60">·</span>
                <span className="text-[#f0c987]/80">{mergedDate}</span>
              </div>
              <p
                className={`${caveat.className} mt-1.5 text-sm leading-relaxed text-gray-200`}
              >
                {rich(summary)}
              </p>
            </div>
          </div>

          <ul
            className={`${caveat.className} border-t-2 border-[#8b1e3f] p-2 text-sm flex flex-col gap-1.5`}
          >
            {highlights.map((h, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-[#8b1e3f] select-none font-bold">#</span>
                <span>{rich(h)}</span>
              </li>
            ))}
          </ul>

          <div
            className={`${caveat.className} border-t-2 border-[#8b1e3f] p-1.5 text-sm`}
          >
            <b>Stack := </b>
            <i>{techStack.join(", ")}</i>
          </div>

          {accessNote && (
            <div className="border-t-2 border-[#8b1e3f] bg-[#3c153b]/20 px-3 py-1.5 text-xs text-[#f0c987]/80 font-mono flex items-center gap-1.5">
              <FiLock className="h-3 w-3 shrink-0 text-[#f0c987]" />
              <span>{accessNote}</span>
            </div>
          )}

          <div className="h-10 border-t-2 border-[#8b1e3f] flex justify-around items-center text-sm px-2">
            <Link
              href={prUrl}
              target="_blank"
              className="inline-flex items-center gap-1.5 text-[#f0c987] hover:text-[#89bd9e] underline underline-offset-4 transition-colors text-xs sm:text-sm"
            >
              {isPrivate && <FiLock className="shrink-0 text-xs" />}
              <span>
                View PR #{prNumber} {isPrivate ? "(Private)" : ""}
              </span>
              <FiExternalLink className="shrink-0" />
            </Link>

            {issueUrl && issueNumber && (
              <Link
                href={issueUrl}
                target="_blank"
                className="inline-flex items-center gap-1 text-[#89bd9e] hover:text-[#f0c987] underline underline-offset-4 transition-colors text-xs sm:text-sm"
              >
                <span>Closes #{issueNumber}</span>
                <FiExternalLink className="shrink-0" />
              </Link>
            )}

            <Link
              href={repoUrl}
              target="_blank"
              className="inline-flex items-center gap-1 text-[#89bd9e] hover:text-[#f0c987] underline underline-offset-4 transition-colors text-xs sm:text-sm"
            >
              {isPrivate && <FiLock className="shrink-0 text-xs" />}
              <span>{isPrivate ? "Private Repo" : "Repository"}</span>
              <FiExternalLink className="shrink-0" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OpenSourceCard;
