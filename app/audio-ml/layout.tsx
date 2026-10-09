import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AudioML | Machine Learning for Audio from Scratch by Harshit Kashyap Sarma",
  description:
    "A hands-on, step-by-step Machine Learning for Audio & Music Technology guide in Python. Learn acoustic feature extraction, gradient descent, feature scaling, logistic regression, and neural network backpropagation from scratch.",
  keywords: [
    "Machine Learning for Audio",
    "Audio DSP",
    "Music Technology",
    "Gradient Descent",
    "Librosa",
    "PyTorch",
    "NumPy",
    "Acoustic Descriptors",
    "Backpropagation",
    "Harshit Kashyap Sarma",
  ],
  openGraph: {
    title: "AudioML | Machine Learning for Audio from Scratch",
    description:
      "A hands-on Machine Learning for Audio & Music Technology tutorial in Python from first principles.",
    url: "/audio-ml",
    siteName: "Harshit Kashyap Sarma Portfolio",
    type: "website",
  },
  alternates: {
    canonical: "/audio-ml",
  },
};

export default function AudioMLLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* KaTeX Stylesheet & Script for mathematical typesetting */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css"
        crossOrigin="anonymous"
      />
      <script
        defer
        src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"
        crossOrigin="anonymous"
      />
      {children}
    </>
  );
}
