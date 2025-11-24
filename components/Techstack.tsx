"use client";
import React, { useRef } from "react";
import { IconType } from "react-icons";
import {
  SiC,
  SiCplusplus,
  SiPython,
  SiJavascript,
  SiTypescript,
  SiGo,
  SiNextdotjs,
  SiExpress,
  SiReactquery,
  SiDocker,
  SiPostman,
  SiMongodb,
  SiMysql,
  SiPostgresql,
  SiDigitalocean,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";

import TargetCursor from "./TargetCursor";
import Image from "next/image";


const Badge = ({
  label,
  Icon,
  bg,
  imgSrc,
}: {
  label: string;
  Icon?: IconType;
  bg: string;
  imgSrc?: string;
}) => {
  return (
    <div
      className="flex items-center gap-2 px-3 py-1 font-semibold text-sm shadow-md cursor-target"
      style={{ backgroundColor: bg }}
    >
      {Icon ? (
        <Icon size={18} />
      ) : (
        <Image
          src={imgSrc as string}
          alt={label}
          className="w-5 h-5"
          width={100}
          height={100}
        />
      )}
      <span>{label}</span>
    </div>
  );
};

const TechStack = () => {
  const stack = [
    { label: "C", Icon: SiC, bg: "#00599C" },
    { label: "C++", Icon: SiCplusplus, bg: "#00427E" },
    { label: "Python", Icon: SiPython, bg: "#3673A5" },
    { label: "Java", Icon: FaJava, bg: "#D68A00" },
    { label: "JavaScript", Icon: SiJavascript, bg: "#323330" },
    { label: "TypeScript", Icon: SiTypescript, bg: "#0277BD" },
    { label: "Go", Icon: SiGo, bg: "#00ADD8" },
    { label: "Next.js", Icon: SiNextdotjs, bg: "#000000" },
    { label: "Express.js", Icon: SiExpress, bg: "#303030" },
    { label: "Zustand", bg: "#111111", imgSrc: "/zustand-plain.svg" },
    { label: "TanStack", Icon: SiReactquery, bg: "#E63946" },
    { label: "Docker", Icon: SiDocker, bg: "#0096D6" },
    { label: "Postman", Icon: SiPostman, bg: "#F46A32" },
    { label: "MongoDB", Icon: SiMongodb, bg: "#11A861" },
    { label: "MySQL", Icon: SiMysql, bg: "#4A7DB9" },
    { label: "PostgreSQL", Icon: SiPostgresql, bg: "#336791" },
    // { label: "AWS", Icon: SiAmazonaws, bg: "#F29100" },
    { label: "DigitalOcean", Icon: SiDigitalocean, bg: "#006AFF" },
  ];

  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div>
      <div>
        <TargetCursor
          spinDuration={2}
          hideDefaultCursor={true}
          parallaxOn={true}
          containerRef={containerRef as React.RefObject<HTMLElement>}
        />
        <div
          ref={containerRef}
          className="w-full flex flex-wrap gap-3 p-4 rounded-xl"
        >
          {stack.map((item) => (
            <Badge
              key={item.label}
              label={item.label}
              Icon={item.Icon}
              bg={item.bg}
              imgSrc={item.imgSrc}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechStack;
