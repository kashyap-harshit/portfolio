import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ShredQuest | ChucK Programming Guide by Harshit Kashyap Sarma",
  description: "Learn to build a groovebox in ChucK. A comprehensive guide and tutorial by Harshit Kashyap Sarma.",
  keywords: ["ChucK", "Music Programming", "Audio DSP", "ShredQuest", "Groovebox", "Tutorial", "Harshit Kashyap Sarma"],
  openGraph: {
    title: "ShredQuest | ChucK Programming Guide",
    description: "Learn to build a groovebox in ChucK.",
    url: "/chuck",
    siteName: "Harshit Kashyap Sarma Portfolio",
    type: "website",
  },
  alternates: {
    canonical: "/chuck",
  },
};

export default function ChuckLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
