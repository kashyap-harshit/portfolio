import React from "react";
import { Arizonia } from "next/font/google";
import BlogCard from "./BlogCard";
import { blogs } from "@/data/blogs";

const meine = Arizonia({
  subsets: ["latin"],
  weight: "400",
});

function Blogs() {
  return (
    <div className="w-full flex flex-col items-center mt-4  border-[#8b1e3f] pb-4">
      <span className={`${meine.className} text-4xl mb-4`}>Blogs </span>
      {blogs.map((blog) => (
        <BlogCard key={blog.href} {...blog} />
      ))}
    </div>
  );
}

export default Blogs;
