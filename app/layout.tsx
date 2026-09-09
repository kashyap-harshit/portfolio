import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
} from "next/font/google";
import "./globals.css";
import SnareCursor from "@/components/SnareCursor";
import MuteToggle from "@/components/MuteToggle";
import TelegramTracker from "@/components/TelegramTracker";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://heem.codes'), // Replace with your actual domain
  title: "Harshit Kashyap Sarma | Audio Tech, Full Stack & AI/ML Portfolio",
  description: "Portfolio of Harshit Kashyap Sarma. Discover projects, experience, and blogs in Audio Technology, Full Stack Development, and AI/ML.",
  keywords: ["Harshit Kashyap Sarma", "Portfolio", "Audio Technology", "Full Stack", "AI", "ML", "Software Engineer"],
  authors: [{ name: "Harshit Kashyap Sarma" }],
  openGraph: {
    title: "Harshit Kashyap Sarma | Portfolio",
    description: "Audio Technology, Full Stack, and AI/ML Portfolio by Harshit Kashyap Sarma.",
    url: "/",
    siteName: "Harshit Kashyap Sarma Portfolio",
    images: [
      {
        url: "/pfp.png",
        width: 800,
        height: 600,
        alt: "Harshit Kashyap Sarma",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Harshit Kashyap Sarma | Audio Tech, Full Stack & AI/ML Portfolio",
    description: "Portfolio of Harshit Kashyap Sarma.",
    images: ["/pfp.png"],
  },
  icons: {
    icon: "/pfp.png",
  },
  alternates: {
    canonical: "/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Harshit Kashyap Sarma",
  url: "https://heem.codes", // Replace with your actual domain
  image: "https://heem.codes/pfp.png",
  jobTitle: "Software Engineer",
  description: "Audio Technology, Full Stack, and AI/ML Engineer",
  sameAs: [
    "https://github.com/harshitkashyap", // Update with actual links
    "https://linkedin.com/in/harshitkashyap"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <TelegramTracker />
        <SnareCursor />
        <MuteToggle />
        {children}
      </body>
    </html>
  );
}
