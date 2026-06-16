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
      className={` mt-4 w-full flex flex-col items-center border-b  border-[#8b1e3f] pb-4`}
    >
      <span className={`${meine.className} text-4xl mb-4`}>Projects </span>
      {projects.map((project) => (
        <Project key={project.title} {...project} />
      ))}
      <Link
        href={GITHUB_PROFILE}
        target="_blank"
        className="group mt-2 flex flex-col items-center gap-1  "
      >
        <span className="underline underline-offset-4">More Projects</span>
        <FiArrowDown className="animate-bounce" />
      </Link>
    </div>
  );
}

export default Projects;
