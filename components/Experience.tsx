import React from "react";
import { Arizonia } from "next/font/google";
import ExperienceCard from "./ExperienceCard";
import { experience } from "@/data/experience";

const meine = Arizonia({
  subsets: ["latin"],
  weight: "400",
});

function Experience() {
  return (
    <div className="w-full flex flex-col items-center mt-4
border-b  border-[#8b1e3f]">
      <span className={`${meine.className} text-4xl mb-4`}>Experience </span>
      {experience.map((exp) => (
        <ExperienceCard key={exp.company} {...exp} />
      ))}
    </div>
  );
}

export default Experience;
