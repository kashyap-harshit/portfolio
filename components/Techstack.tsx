"use client";
import React, { useRef } from "react";
import { IconType } from "react-icons";
import {
  SiC,
  SiCplusplus,
  SiPython,
  SiPytorch,
  SiNumpy,
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
  SiFastapi,
  SiRedis,
  SiAwslambda,
  SiAmazons3,
  SiStripe,
  SiOpenid,
  SiPypi,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";

import TargetCursor from "./TargetCursor";
import Image from "next/image";
import StarBorder from "./StarBorder";
import { useTechHover, normalizeTech } from "./TechHoverContext";


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
        <Icon size={12} />
      ) : imgSrc ? (
        <Image
          src={imgSrc as string}
          alt={label}
          className="w-5 h-5"
          width={100}
          height={100}
        />
      ) : null}
      <span>{label}</span>
    </div>
  );
};

const TechStack = () => {
  const stack = [
    { label: "C", Icon: SiC, bg: "#00599C" },
    { label: "C++", Icon: SiCplusplus, bg: "#00427E" },
    { label: "Python", Icon: SiPython, bg: "#3673A5" },
    { label: "PyTorch", Icon: SiPytorch, bg: "#EE4C2C" },
    { label: "NumPy", Icon: SiNumpy, bg: "#013243" },
    { label: "librosa", bg: "#5A189A", imgSrc: "/librosa.svg" },
    // { label: "matplotlib", bg: "#11557C", imgSrc: "/matplotlib.svg" },
    // { label: "Java", Icon: FaJava, bg: "#D68A00" },
    { label: "JavaScript", Icon: SiJavascript, bg: "#323330" },
    { label: "TypeScript", Icon: SiTypescript, bg: "#0277BD" },
    // { label: "Go", Icon: SiGo, bg: "#00ADD8" },
    { label: "Next.js", Icon: SiNextdotjs, bg: "#000000" },
    { label: "Express.js", Icon: SiExpress, bg: "#303030" },
    { label: "FastAPI", Icon: SiFastapi, bg: "#009688" },
    { label: "Zustand", bg: "#111111", imgSrc: "/zustand-plain.svg" },
    { label: "TanStack", Icon: SiReactquery, bg: "#E63946" },
    { label: "Docker", Icon: SiDocker, bg: "#0096D6" },
    // { label: "Postman", Icon: SiPostman, bg: "#F46A32" },
    { label: "MongoDB", Icon: SiMongodb, bg: "#11A861" },
    { label: "MySQL", Icon: SiMysql, bg: "#4A7DB9" },
    { label: "PostgreSQL", Icon: SiPostgresql, bg: "#336791" },
    { label: "Redis", Icon: SiRedis, bg: "#D82C20" },
    { label: "AWS Lambda", Icon: SiAwslambda, bg: "#D86613" },
    { label: "S3", Icon: SiAmazons3, bg: "#569A31" },
    { label: "Stripe", Icon: SiStripe, bg: "#635BFF" },
    { label: "OAuth / PKCE", Icon: SiOpenid, bg: "#3B5998" },
    // { label: "PyPI", Icon: SiPypi, bg: "#3775A9" },
    // { label: "DigitalOcean", Icon: SiDigitalocean, bg: "#006AFF" },
  ];

  const containerRef = useRef<HTMLDivElement | null>(null);
  const { hovered, all } = useTechHover();

  return (
    <div className="">
      <div>
        <TargetCursor
          spinDuration={2}
          hideDefaultCursor={true}
          parallaxOn={true}
          containerRef={containerRef as React.RefObject<HTMLElement>}
        />
        <div
          ref={containerRef}
          className="w-full flex flex-wrap gap-2 p-2 justify-center rounded-xl"
        >
          {stack.map((item) => {
            const active = all || hovered.has(normalizeTech(item.label));
            const badge = (
              <Badge
                label={item.label}
                Icon={item.Icon}
                bg={item.bg}
                imgSrc={item.imgSrc}
              />
            );
            return (
              <StarBorder
                key={item.label}
                active={active}
                color="#f0c987"
                speed="2.5s"
              >
                {badge}
              </StarBorder>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TechStack;
