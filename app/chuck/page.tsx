"use client";
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import data from './shredquest.json';
import { Menu, X, CheckCircle2, Copy } from 'lucide-react';
import TicTacToeFrame from '@/components/TicTacToeFrame';
import { Cinzel, Quicksand, Arizonia } from "next/font/google";

const jim = Cinzel({ weight: "600", subsets: ["latin"] });
const caveat = Quicksand({ weight: "400", subsets: ["latin"] });
const meine = Arizonia({ weight: "400", subsets: ["latin"] });

function TextBlock({ content }: { content: string }) {
  return (
    <div className={`${caveat.className} [&_p]:mb-4 [&_p]:text-[#89bd9e] [&_h3]:text-2xl [&_h3]:text-[#f0c987] [&_h3]:mb-4 [&_h3]:mt-8 [&_h3]:font-['Cinzel'] [&_a]:text-[#f0c987] [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ul]:text-[#89bd9e] [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_ol]:text-[#89bd9e] [&_strong]:text-[#f0c987] [&_strong]:font-bold text-lg mb-6 leading-relaxed`}>
      <ReactMarkdown
        components={{
          code({node, inline, className, children, ...props}: any) {
            return (
              <code className={`${inline ? 'bg-[#8b1e3f]/30 text-[#f0c987] px-1.5 py-0.5 rounded text-sm border border-[#8b1e3f]' : 'font-mono'}`} {...props}>
                {children}
              </code>
            )
          },
          h3({children, ...props}: any) {
            return <h3 className={`${jim.className}`} {...props}>{children}</h3>
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function ChuckCodeBlock({ content, meta }: { content: string, meta: any }) {
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
          <div className="bg-[#8b1e3f]/30 px-4 py-2 flex justify-between items-center border-b-2 border-[#8b1e3f]">
            <span className={`${jim.className} text-[#f0c987] text-sm`}>{meta.file || "code.ck"}</span>
            <div className="flex items-center gap-4">
              {meta.verified && (
                <div className="flex items-center gap-1.5 text-[#89bd9e] text-xs">
                  <CheckCircle2 size={12} />
                  <span className={caveat.className}>Verified</span>
                </div>
              )}
              <button onClick={handleCopy} className="flex items-center gap-1.5 text-[#f0c987] hover:text-[#89bd9e] transition-colors text-xs" aria-label="Copy code">
                {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
                <span className={caveat.className}>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
          <pre className="p-4 overflow-x-auto text-[#89bd9e] text-sm font-mono whitespace-pre">
            {content}
          </pre>
        </div>
      </div>
    </div>
  );
}

function OutputBlock({ content }: { content: string }) {
  return (
    <div className="my-6 border-l-2 border-[#8b1e3f] pl-4 py-1 opacity-80 bg-[#8b1e3f]/5">
      <pre className="overflow-x-auto">
        <code className="text-[#f0c987] text-sm whitespace-pre font-mono">{content}</code>
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
            <button onClick={handleCopy} className="flex items-center gap-1.5 text-[#f0c987] hover:text-[#89bd9e] transition-colors text-xs" aria-label="Copy code">
              {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
              <span className={caveat.className}>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="p-4 overflow-x-auto flex gap-3">
            <span className="text-[#8b1e3f] select-none">$</span>
            <code className="text-[#f0c987] text-sm whitespace-pre font-mono">{content}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

function HearBlock({ content }: { content: string }) {
  return (
    <div className="relative isolate w-full mb-8 mt-4">
      <div className="absolute inset-0 -z-10 translate-y-3 translate-x-3 blur-[2px] border-2 border-[#8b1e3f] bg-[#8b1e3f]/20" />
      <div className="relative overflow-hidden isolate bg-[#8b1e3f]/10 border-2 border-[#f0c987]">
        <div className="relative z-10 p-5">
          <div className={`${meine.className} text-[#f0c987] text-3xl mb-2`}>What you should hear</div>
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
          <div className={`${jim.className} text-[#8b1e3f] text-lg mb-2`}>Note</div>
          <div className={`${caveat.className} text-[#89bd9e] text-lg leading-relaxed [&_strong]:text-[#f0c987]`}>
            <ReactMarkdown
              components={{
                code({node, inline, className, children, ...props}: any) {
                  return (
                    <code className={`${inline ? 'bg-[#8b1e3f]/30 text-[#f0c987] px-1.5 py-0.5 rounded text-sm border border-[#8b1e3f]' : ''}`} {...props}>
                      {children}
                    </code>
                  )
                }
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
          <div className={`${jim.className} text-[#f0c987] text-2xl mb-4`}>In this chapter:</div>
          <div className={`${caveat.className} text-[#89bd9e] text-lg [&_ul]:list-none [&_li]:flex [&_li]:gap-2`}>
            <ReactMarkdown
              components={{
                li: ({children}) => (
                  <li className="flex gap-2 mb-1.5">
                    <span className="text-[#8b1e3f] select-none">#</span>
                    <span>{children}</span>
                  </li>
                ),
                code({node, inline, className, children, ...props}: any) {
                  return (
                    <code className={`${inline ? 'bg-[#8b1e3f]/30 text-[#f0c987] px-1.5 py-0.5 rounded text-sm border border-[#8b1e3f]' : ''}`} {...props}>
                      {children}
                    </code>
                  )
                }
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

function RulerBlock({ content, meta }: { content: string, meta: any }) {
  const rows = content.trim().split('\n').map(line => line.split('|').map(s => s.trim()));
  
  return (
    <div className="relative isolate w-full mb-8 mt-8">
      <div className={`${jim.className} text-xs text-[#f0c987] uppercase tracking-widest mb-3 flex items-center gap-3`}>
        <div className="h-px bg-[#8b1e3f] grow"></div>
        {meta?.caption || 'TIMELINE'}
        <div className="h-px bg-[#8b1e3f] grow"></div>
      </div>
      
      <TicTacToeFrame />
      <div className="relative overflow-hidden isolate flex flex-col border-2 border-[#8b1e3f] bg-[#8b1e3f]/10">
        <div className="relative z-10">
          {rows.map((row, i) => {
            const time = row[0] || '';
            const label = row[1] || '';
            const hit = row[2] === 'hit';
            
            return (
              <div key={i} className={`flex items-stretch border-b-2 border-[#8b1e3f] last:border-0 ${hit ? 'bg-[#8b1e3f]/30' : ''}`}>
                <div className={`w-24 shrink-0 px-3 py-2.5 font-mono text-sm border-r-2 border-[#8b1e3f] flex items-center ${hit ? 'text-[#f0c987] font-bold' : 'text-[#89bd9e]'}`}>
                  {time}
                </div>
                <div className={`px-4 py-2.5 flex-grow flex items-center font-mono text-sm ${hit ? 'text-[#f0c987]' : 'text-[#89bd9e]'} relative`}>
                  {hit && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#f0c987]"></div>
                  )}
                  {label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function ChuckPage() {
  const [activeChapter, setActiveChapter] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const parts = {
    one: data.filter(c => c.yaml?.part === 'one'),
    two: data.filter(c => c.yaml?.part === 'two'),
    three: data.filter(c => c.yaml?.part === 'three')
  };

  const chapter = data[activeChapter];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">
      {/* Mobile nav toggle */}
      <div className="md:hidden sticky top-0 z-50 bg-[#1a0a18]/90 backdrop-blur border-b-2 border-[#8b1e3f] p-4 flex justify-between items-center">
        <span className={`${jim.className} font-bold text-xl text-[#f0c987]`}>ShredQuest</span>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-[#8b1e3f]/20 rounded-md border border-[#8b1e3f] text-[#f0c987]">
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed md:sticky top-[69px] md:top-0 h-[calc(100vh-69px)] md:h-screen shrink-0 w-full md:w-80 
        bg-[#1a0a18] border-r-2 border-[#8b1e3f] overflow-y-auto z-40 transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 relative z-10">
          <div className="hidden md:block mb-8">
            <h1 className={`${jim.className} font-bold text-3xl text-[#f0c987]`}>ShredQuest</h1>
            <p className={`${caveat.className} text-[#89bd9e] text-sm mt-1`}>Build a groovebox in ChucK</p>
          </div>

          <div className="space-y-8">
            {Object.entries(parts).map(([partKey, chapters]) => {
              if (!chapters.length) return null;
              return (
                <div key={partKey}>
                  <div className={`${jim.className} text-[#8b1e3f] text-xs uppercase tracking-widest mb-3 font-semibold`}>
                    Part {partKey}
                  </div>
                  <ul className="space-y-2">
                    {chapters.map((ch, idx) => {
                      const globalIdx = data.findIndex(c => c.title === ch.title);
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
                              ${isActive 
                                ? 'bg-[#8b1e3f]/30 text-[#f0c987] font-medium border border-[#8b1e3f]' 
                                : 'text-[#89bd9e] hover:bg-[#8b1e3f]/20'
                              }`}
                          >
                            <span className={isActive ? 'text-[#f0c987]/70' : 'text-[#8b1e3f]'}>
                              {ch.yaml?.eyebrow?.replace('Episode', '')}
                            </span>
                            {' '}
                            {ch.title.split(':')[1]?.trim() || ch.title}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-grow max-w-4xl px-6 py-12 md:py-20 md:pl-16 md:pr-8 relative">
        <article className="pb-24 relative z-10">
          {chapter.yaml?.eyebrow && (
            <div className={`${jim.className} text-[#8b1e3f] font-semibold text-sm mb-4 tracking-widest uppercase`}>
              {chapter.yaml.eyebrow}
            </div>
          )}
          
          <h1 className={`${jim.className} text-4xl md:text-5xl tracking-tight mb-12 text-[#f0c987] !leading-tight`}>
            {chapter.title.split(':')[1]?.trim() || chapter.title}
          </h1>

          <div className="space-y-4">
            {chapter.blocks.map((block: any, idx: number) => {
              switch(block.type) {
                case 'text':
                  return <TextBlock key={idx} content={block.content} />;
                case 'chuck':
                  return <ChuckCodeBlock key={idx} content={block.content} meta={block.meta} />;
                case 'output':
                  return <OutputBlock key={idx} content={block.content} />;
                case 'terminal':
                  return <TerminalBlock key={idx} content={block.content} />;
                case 'hear':
                  return <HearBlock key={idx} content={block.content} />;
                case 'note':
                  return <NoteBlock key={idx} content={block.content} />;
                case 'changed':
                  return <ChangedBlock key={idx} content={block.content} />;
                case 'ruler':
                  return <RulerBlock key={idx} content={block.content} meta={block.meta} />;
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
                <span className={`${jim.className} text-xs uppercase tracking-widest mb-1 text-[#8b1e3f] group-hover:text-[#f0c987]/70`}>Previous</span>
                <span className={`${caveat.className} font-medium text-xl`}>
                  {data[activeChapter - 1].title.split(':')[1]?.trim()}
                </span>
              </button>
            ) : <div></div>}

            {activeChapter < data.length - 1 && (
              <button 
                onClick={() => {
                  setActiveChapter(activeChapter + 1);
                  window.scrollTo({ top: 0 });
                }}
                className="text-[#89bd9e] hover:text-[#f0c987] flex flex-col items-end text-right transition-colors group"
              >
                <span className={`${jim.className} text-xs uppercase tracking-widest mb-1 text-[#8b1e3f] group-hover:text-[#f0c987]/70`}>Next Episode</span>
                <span className={`${caveat.className} font-medium text-xl`}>
                  {data[activeChapter + 1].title.split(':')[1]?.trim()}
                </span>
              </button>
            )}
          </div>
        </article>
      </main>
    </div>
  );
}
