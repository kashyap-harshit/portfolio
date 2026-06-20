import React from "react";
import { Arizonia } from "next/font/google";
import EducationCard from "./EducationCard";
import { education } from "@/data/education";

const meine = Arizonia({
  subsets: ["latin"],
  weight: "400",
});

function Education() {
  return (
    <div className="w-full flex flex-col items-center mt-4 border-b border-[#8b1e3f] pb-4">
      <span className={`${meine.className} text-4xl mb-4`}>Education </span>
      {education.map((edu) => (
        <EducationCard key={edu.institution} {...edu} />
      ))}
    </div>
  );
}

export default Education;
