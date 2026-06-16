import React from "react";
import Link from "next/link";
import Project from "./Project";
import { Arizonia } from "next/font/google";
import { FiArrowDown } from "react-icons/fi";
import { projects, GITHUB_PROFILE } from "@/data/projects";

const meine = Arizonia({
  subsets: ["latin"],
  weight: "400",
});

function Projects() {
  return (
    <div
      className={` h-screen w-full flex flex-col items-center`}
    >
      <span className={`${meine.className} text-4xl mb-4`}>Projects </span>
      {projects.map((project) => (
        <Project key={project.title} {...project} />
      ))}
      <Link
        href={GITHUB_PROFILE}
        target="_blank"
        className="group mt-2 flex flex-col items-center gap-1 text-[#89bd9e] transition-colors hover:text-[#f0c987]"
      >
        <span className="underline underline-offset-4">more projects</span>
        <FiArrowDown className="animate-bounce" />
      </Link>
    </div>
  );
}

export default Projects;
