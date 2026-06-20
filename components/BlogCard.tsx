"use client";
import React from "react";
import Noise from "./Noise";
import { Cinzel, Quicksand } from "next/font/google";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";
import TicTacToeFrame from "./TicTacToeFrame";
import { BlogData } from "@/data/blogs";

const jim = Cinzel({
  weight: "600",
  subsets: ["latin"],
});

const caveat = Quicksand({
  weight: "400",
  subsets: ["latin"],
});

function BlogCard({ title, excerpt, href, icon, series, count }: BlogData) {
  return (
    <div className="relative isolate w-[90%] mb-8">
      {/* For a series, stack a couple of blurred copies behind the card, each
          offset down + left, so it reads as a pile of posts. */}
      {series && (
        <>
          <div className="absolute inset-0 -z-10 translate-y-3 translate-x-3 blur-[2px] border-2 border-[#8b1e3f] bg-[#3c153b]/40" />
          <div className="absolute inset-0 -z-20 translate-y-6 translate-x-6 blur-[3px] border-2 border-[#8b1e3f] bg-[#3c153b]/30" />
        </>
      )}

      <Link href={href} target="_blank" className="block">
        <TicTacToeFrame />
        <div className="relative overflow-hidden isolate bg-[#1a0a18]">
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
                className={`${jim.className} bg-[#3c153b]/40 title  border-[#8b1e3f] text-xl px-2`}
              >
                {title}
              </span>
              <FiExternalLink className="inline-block ml-1 shrink-0 align-baseline" />
              {series && count && (
                <div className={`${caveat.className} px-2 py-1 text-xs text-[#f0c987]`}>
                  {count}-part series
                </div>
              )}
            </div>
            <p
              className={`${caveat.className} border-t-2 border-[#8b1e3f] p-1 text-sm`}
            >
              {excerpt}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default BlogCard;
