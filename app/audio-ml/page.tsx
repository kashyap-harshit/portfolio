"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import data from "./audioml.json";
import { Menu, X, CheckCircle2, Copy, ArrowLeft } from "lucide-react";
import Link from "next/link";
import TicTacToeFrame from "@/components/TicTacToeFrame";
import { Cinzel, Quicksand, Arizonia } from "next/font/google";
import { RenderMathText } from "@/components/audioml/MathRenderer";
import ContourVisualizer from "@/components/audioml/ContourVisualizer";
import LearningRateSimulator from "@/components/audioml/LearningRateSimulator";
import SigmoidClassifierWidget from "@/components/audioml/SigmoidClassifierWidget";
import OneVsAllWidget from "@/components/audioml/OneVsAllWidget";
import NeuralAudioWidget from "@/components/audioml/NeuralAudioWidget";
import CodeHighlighter from "@/components/audioml/CodeHighlighter";
import { SiPython } from "react-icons/si";

const jim = Cinzel({ weight: "600", subsets: ["latin"] });
const caveat = Quicksand({ weight: "400", subsets: ["latin"] });
const meine = Arizonia({ weight: "400", subsets: ["latin"] });

function TextBlock({ content }: { content: string }) {
  return (
    <div
      className={`${caveat.className} [&_p]:mb-4 [&_p]:text-[#89bd9e] [&_h3]:text-2xl [&_h3]:text-[#f0c987] [&_h3]:mb-4 [&_h3]:mt-8 [&_h3]:font-['Cinzel'] [&_a]:text-[#f0c987] [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ul]:text-[#89bd9e] [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_ol]:text-[#89bd9e] [&_strong]:text-[#f0c987] [&_strong]:font-bold text-lg mb-6 leading-relaxed`}
    >
      <ReactMarkdown
        components={{
          code({ inline, children, ...props }: any) {
            const rawText = String(children);
            if (!inline && rawText.includes("\n")) {
              return (
                <div className="my-4 rounded border border-[#8b1e3f]/40 bg-[#100511] overflow-hidden">
                  <CodeHighlighter code={rawText.trim()} />
                </div>
              );
            }
            return (
              <code
                className={`${
                  inline
                    ? "bg-[#8b1e3f]/30 text-[#f0c987] px-1.5 py-0.5 rounded text-sm border border-[#8b1e3f]"
                    : "font-mono"
                }`}
                {...props}
              >
                {rawText}
              </code>
            );
          },
          p({ children }: any) {
            // Process paragraph text for inline math expressions
            if (typeof children === "string") {
              return <p><RenderMathText text={children} /></p>;
            }
            if (Array.isArray(children)) {
              return (
                <p>
                  {children.map((c, i) =>
                    typeof c === "string" ? <RenderMathText key={i} text={c} /> : c
                  )}
                </p>
              );
            }
            return <p>{children}</p>;
          },
          h3({ children, ...props }: any) {
            return (
              <h3 className={`${jim.className}`} {...props}>
                {children}
              </h3>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function PythonCodeBlock({ content, meta }: { content: string; meta?: any }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative isolate w-full mb-8 mt-4">
      <TicTacToeFrame />
      <div className="relative overflow-hidden isolate bg-[#100511] border border-[#8b1e3f]/60 rounded-sm">
        <div className="relative z-10">
          <div className="bg-[#8b1e3f]/30 px-4 py-2 flex justify-between items-center border-b-2 border-[#8b1e3f]">
            <div className="flex items-center gap-2">
              <SiPython className="text-[#f0c987] text-base" />
              <span className={`${jim.className} text-[#f0c987] text-sm font-semibold`}>
                {meta?.file || "audiosense.py"}
              </span>
            </div>
            <div className="flex items-center gap-4">
              {meta?.verified && (
                <div className="flex items-center gap-1.5 text-[#27C93F] text-xs">
                  <CheckCircle2 size={12} />
                  <span className={caveat.className}>Verified in NumPy</span>
                </div>
              )}
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-[#f0c987] hover:text-[#89bd9e] transition-colors text-xs"
                aria-label="Copy code"
              >
                {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
                <span className={caveat.className}>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>
          <CodeHighlighter code={content} />
        </div>
      </div>
    </div>
  );
}

function OutputBlock({ content }: { content: string }) {
  return (
    <div className="my-6 border-l-2 border-[#8b1e3f] pl-4 py-1 opacity-90 bg-[#8b1e3f]/5">
      <pre className="overflow-x-auto">
        <code className="text-[#f0c987] text-sm whitespace-pre font-mono leading-relaxed">
          {content}
        </code>
      </pre>
    </div>
  );
}

function TerminalBlock({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative isolate w-full mb-8 mt-4">
      <TicTacToeFrame />
      <div className="relative overflow-hidden isolate bg-[#8b1e3f]/10">
        <div className="relative z-10">
          <div className="px-4 py-2 flex justify-between items-center border-b-2 border-[#8b1e3f] bg-[#8b1e3f]/30">
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]"></div>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-[#f0c987] hover:text-[#89bd9e] transition-colors text-xs"
              aria-label="Copy code"
            >
              {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
              <span className={caveat.className}>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
          <pre className="p-4 overflow-x-auto flex gap-3">
            <span className="text-[#8b1e3f] select-none font-mono">$</span>
            <code className="text-[#f0c987] text-sm whitespace-pre font-mono">
              {content}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}

function ListenBlock({ content }: { content: string }) {
  return (
    <div className="relative isolate w-full mb-8 mt-4">
      <div className="absolute inset-0 -z-10 translate-y-3 translate-x-3 blur-[2px] border-2 border-[#8b1e3f] bg-[#8b1e3f]/20" />
      <div className="relative overflow-hidden isolate bg-[#8b1e3f]/10 border-2 border-[#f0c987]">
        <div className="relative z-10 p-5">
          <div className={`${meine.className} text-[#f0c987] text-3xl mb-2`}>
            What your ears hear vs. what the math sees
          </div>
          <div className={`${caveat.className} text-[#89bd9e] text-lg leading-relaxed`}>
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      </div>
      <TicTacToeFrame />
    </div>
  );
}

function NoteBlock({ content }: { content: string }) {
  return (
    <div className="relative isolate w-full mb-8 mt-4">
      <div className="relative overflow-hidden isolate bg-[#8b1e3f]/10 border-l-4 border-[#8b1e3f]">
        <div className="relative z-10 p-5">
          <div className={`${jim.className} text-[#8b1e3f] text-lg mb-2`}>
            Math &amp; Engineering Insight
          </div>
          <div className={`${caveat.className} text-[#89bd9e] text-lg leading-relaxed [&_strong]:text-[#f0c987]`}>
            <ReactMarkdown
              components={{
                code({ inline, children, ...props }: any) {
                  return (
                    <code
                      className={`${
                        inline
                          ? "bg-[#8b1e3f]/30 text-[#f0c987] px-1.5 py-0.5 rounded text-sm border border-[#8b1e3f]"
                          : ""
                      }`}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                p({ children }: any) {
                  if (typeof children === "string") {
                    return <p><RenderMathText text={children} /></p>;
                  }
                  return <p>{children}</p>;
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChangedBlock({ content }: { content: string }) {
  return (
    <div className="relative isolate w-full mb-8 mt-10">
      <TicTacToeFrame />
      <div className="relative overflow-hidden isolate bg-[#8b1e3f]/10 border-2 border-[#8b1e3f]">
        <div className="relative z-10 p-6">
          <div className={`${jim.className} text-[#f0c987] text-2xl mb-4`}>
            In this chapter:
          </div>
          <div className={`${caveat.className} text-[#89bd9e] text-lg [&_ul]:list-none [&_li]:flex [&_li]:gap-2`}>
            <ReactMarkdown
              components={{
                li: ({ children }) => (
                  <li className="flex gap-2 mb-1.5">
                    <span className="text-[#8b1e3f] select-none">#</span>
                    <span>{children}</span>
                  </li>
                ),
                code({ inline, children, ...props }: any) {
                  return (
                    <code
                      className={`${
                        inline
                          ? "bg-[#8b1e3f]/30 text-[#f0c987] px-1.5 py-0.5 rounded text-sm border border-[#8b1e3f]"
                          : ""
                      }`}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AudioMLPage() {
  const [activeChapter, setActiveChapter] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const parts = {
    one: {
      name: "Part 1: Preprocessing & Scaling",
      chapters: data.filter((c) => c.yaml?.part === "one"),
    },
    two: {
      name: "Part 2: Linear Regression & Gradient Descent",
      chapters: data.filter((c) => c.yaml?.part === "two"),
    },
    three: {
      name: "Part 3: Logistic Regression & Classification",
      chapters: data.filter((c) => c.yaml?.part === "three"),
    },
    four: {
      name: "Part 4: Neural Networks & Backpropagation",
      chapters: data.filter((c) => c.yaml?.part === "four"),
    },
  };

  const chapter = data[activeChapter];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">
      {/* Mobile nav toggle header */}
      <div className="md:hidden sticky top-0 z-50 bg-[#1a0a18]/90 backdrop-blur border-b-2 border-[#8b1e3f] p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-[#f0c987] hover:text-[#89bd9e] p-1">
            <ArrowLeft size={18} />
          </Link>
          <span className={`${jim.className} font-bold text-xl text-[#f0c987]`}>
            AudioML
          </span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 bg-[#8b1e3f]/20 rounded-md border border-[#8b1e3f] text-[#f0c987]"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`
          fixed md:sticky top-[69px] md:top-0 h-[calc(100vh-69px)] md:h-screen shrink-0 w-full md:w-84 
          bg-[#1a0a18] border-r-2 border-[#8b1e3f] overflow-y-auto z-40 transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="p-6 relative z-10">
          <div className="hidden md:block mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className={`${jim.className} font-bold text-3xl text-[#f0c987]`}>
                AudioSense
              </h1>
              <Link
                href="/"
                className="text-xs font-mono text-[#89bd9e] hover:text-[#f0c987] flex items-center gap-1 border border-[#8b1e3f]/40 px-2 py-1 rounded"
              >
                <ArrowLeft size={12} />
                Portfolio
              </Link>
            </div>
            <p className={`${caveat.className} text-[#89bd9e] text-sm mt-1`}>
              Build an AI Audio Evaluator &amp; Classifier in Python
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#8b1e3f]/30 border border-[#8b1e3f] rounded text-[11px] font-mono text-[#f0c987]">
              <span>File: audiosense.py</span>
            </div>
          </div>

          <div className="space-y-8">
            {Object.entries(parts).map(([partKey, partGroup]) => {
              if (!partGroup.chapters.length) return null;
              return (
                <div key={partKey}>
                  <div className={`${jim.className} text-[#8b1e3f] text-xs uppercase tracking-widest mb-3 font-semibold`}>
                    {partGroup.name}
                  </div>
                  <ul className="space-y-2">
                    {partGroup.chapters.map((ch) => {
                      const globalIdx = data.findIndex((c) => c.title === ch.title);
                      const isActive = activeChapter === globalIdx;
                      return (
                        <li key={globalIdx} className="relative">
                          {isActive && (
                            <div className="absolute -left-2 top-0 bottom-0 w-1 bg-[#f0c987]" />
                          )}
                          <button
                            onClick={() => {
                              setActiveChapter(globalIdx);
                              setIsSidebarOpen(false);
                              window.scrollTo({ top: 0 });
                            }}
                            className={`w-full text-left px-3 py-2 text-sm transition-colors ${caveat.className} text-lg
                              ${
                                isActive
                                  ? "bg-[#8b1e3f]/30 text-[#f0c987] font-medium border border-[#8b1e3f]"
                                  : "text-[#89bd9e] hover:bg-[#8b1e3f]/20"
                              }`}
                          >
                            <span className={isActive ? "text-[#f0c987]/70" : "text-[#8b1e3f]"}>
                              {ch.yaml?.eyebrow?.split("•")[0]?.trim() || `Ch ${globalIdx}`}
                            </span>{" "}
                            {ch.title.split(":")[1]?.trim() || ch.title}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-grow max-w-4xl px-6 py-12 md:py-20 md:pl-16 md:pr-8 relative">
        <article className="pb-24 relative z-10">
          <div className="mb-8 p-3.5 bg-[#1a0a18] border-2 border-[#8b1e3f] rounded">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 pb-2 border-b border-[#8b1e3f]/40">
              <span className={`${jim.className} text-xs uppercase tracking-widest text-[#f0c987] font-semibold flex items-center gap-1.5`}>
                <span className="w-2 h-2 rounded-full bg-[#27C93F] animate-pulse"></span>
                Building: audiosense.py
              </span>
              <span className={`${caveat.className} text-sm text-[#89bd9e]`}>
                Chapter {activeChapter + 1} of {data.length}
              </span>
            </div>

            {/* Pipeline Stage Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
              <div className={`p-1.5 rounded border transition-colors ${
                chapter.yaml?.part === 'one'
                  ? 'bg-[#8b1e3f]/40 border-[#f0c987] text-[#f0c987]'
                  : 'bg-[#8b1e3f]/10 border-[#8b1e3f]/30 text-[#89bd9e]/60'
              }`}>
                <div className="font-bold">1. Front-End</div>
                <div className="text-[10px] truncate">Features & Scaling</div>
              </div>
              <div className={`p-1.5 rounded border transition-colors ${
                chapter.yaml?.part === 'two'
                  ? 'bg-[#8b1e3f]/40 border-[#f0c987] text-[#f0c987]'
                  : 'bg-[#8b1e3f]/10 border-[#8b1e3f]/30 text-[#89bd9e]/60'
              }`}>
                <div className="font-bold">2. Evaluator</div>
                <div className="text-[10px] truncate">Regression & GD</div>
              </div>
              <div className={`p-1.5 rounded border transition-colors ${
                chapter.yaml?.part === 'three'
                  ? 'bg-[#8b1e3f]/40 border-[#f0c987] text-[#f0c987]'
                  : 'bg-[#8b1e3f]/10 border-[#8b1e3f]/30 text-[#89bd9e]/60'
              }`}>
                <div className="font-bold">3. Classifiers</div>
                <div className="text-[10px] truncate">Vocals & Instruments</div>
              </div>
              <div className={`p-1.5 rounded border transition-colors ${
                chapter.yaml?.part === 'four'
                  ? 'bg-[#8b1e3f]/40 border-[#f0c987] text-[#f0c987]'
                  : 'bg-[#8b1e3f]/10 border-[#8b1e3f]/30 text-[#89bd9e]/60'
              }`}>
                <div className="font-bold">4. Neural Brain</div>
                <div className="text-[10px] truncate">MLP & Backprop</div>
              </div>
            </div>
          </div>

          {chapter.yaml?.eyebrow && (
            <div className={`${jim.className} text-[#8b1e3f] font-semibold text-sm mb-3 tracking-widest uppercase`}>
              {chapter.yaml.eyebrow}
            </div>
          )}

          <h1 className={`${jim.className} text-4xl md:text-5xl tracking-tight mb-12 text-[#f0c987] !leading-tight`}>
            {chapter.title.split(":")[1]?.trim() || chapter.title}
          </h1>

          <div className="space-y-4">
            {chapter.blocks.map((block: any, idx: number) => {
              switch (block.type) {
                case "text":
                  return <TextBlock key={idx} content={block.content} />;
                case "python":
                  return <PythonCodeBlock key={idx} content={block.content} meta={block.meta} />;
                case "output":
                  return <OutputBlock key={idx} content={block.content} />;
                case "terminal":
                  return <TerminalBlock key={idx} content={block.content} />;
                case "listen":
                  return <ListenBlock key={idx} content={block.content} />;
                case "note":
                  return <NoteBlock key={idx} content={block.content} />;
                case "changed":
                  return <ChangedBlock key={idx} content={block.content} />;
                case "widget":
                  if (block.content === "contour") {
                    return <ContourVisualizer key={idx} />;
                  } else if (block.content === "learning-rate") {
                    return <LearningRateSimulator key={idx} />;
                  } else if (block.content === "sigmoid") {
                    return <SigmoidClassifierWidget key={idx} />;
                  } else if (block.content === "one-vs-all") {
                    return <OneVsAllWidget key={idx} />;
                  } else if (block.content === "neural-net") {
                    return <NeuralAudioWidget key={idx} />;
                  }
                  return null;
                default:
                  return (
                    <div key={idx} className="p-4 bg-red-100 text-red-800 rounded">
                      Unknown block type: {block.type}
                    </div>
                  );
              }
            })}
          </div>

          {/* Next / Prev navigation */}
          <div className="mt-20 pt-8 border-t-2 border-[#8b1e3f] flex justify-between items-center">
            {activeChapter > 0 ? (
              <button
                onClick={() => {
                  setActiveChapter(activeChapter - 1);
                  window.scrollTo({ top: 0 });
                }}
                className="text-[#89bd9e] hover:text-[#f0c987] flex flex-col items-start transition-colors group"
              >
                <span className={`${jim.className} text-xs uppercase tracking-widest mb-1 text-[#8b1e3f] group-hover:text-[#f0c987]/70`}>
                  Previous
                </span>
                <span className={`${caveat.className} font-medium text-xl`}>
                  {data[activeChapter - 1].title.split(":")[1]?.trim()}
                </span>
              </button>
            ) : (
              <div></div>
            )}

            {activeChapter < data.length - 1 && (
              <button
                onClick={() => {
                  setActiveChapter(activeChapter + 1);
                  window.scrollTo({ top: 0 });
                }}
                className="text-[#89bd9e] hover:text-[#f0c987] flex flex-col items-end text-right transition-colors group"
              >
                <span className={`${jim.className} text-xs uppercase tracking-widest mb-1 text-[#8b1e3f] group-hover:text-[#f0c987]/70`}>
                  Next Chapter
                </span>
                <span className={`${caveat.className} font-medium text-xl`}>
                  {data[activeChapter + 1].title.split(":")[1]?.trim()}
                </span>
              </button>
            )}
          </div>
        </article>
      </main>
    </div>
  );
}
