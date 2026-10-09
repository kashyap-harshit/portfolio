"use client";

import React, { useEffect, useState } from "react";

declare global {
  interface Window {
    katex?: {
      renderToString: (
        tex: string,
        options?: { displayMode?: boolean; throwOnError?: boolean }
      ) => string;
    };
  }
}

interface MathRendererProps {
  math: string;
  block?: boolean;
}

export default function MathRenderer({ math, block = false }: MathRendererProps) {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    function tryRender() {
      if (typeof window !== "undefined" && window.katex) {
        try {
          const rendered = window.katex.renderToString(math, {
            displayMode: block,
            throwOnError: false,
          });
          setHtml(rendered);
          return true;
        } catch {
          return false;
        }
      }
      return false;
    }

    if (!tryRender()) {
      // Check every 200ms for up to 3 seconds until KaTeX script is ready
      const interval = setInterval(() => {
        if (tryRender()) {
          clearInterval(interval);
        }
      }, 200);
      const timeout = setTimeout(() => clearInterval(interval), 3000);
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [math, block]);

  if (html) {
    if (block) {
      return (
        <div
          className="my-4 py-2 overflow-x-auto text-[#f0c987] flex justify-center text-lg"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }
    return (
      <span
        className="inline-block text-[#f0c987] px-0.5"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  // Fallback typography while KaTeX script initializes or in SSR
  if (block) {
    return (
      <div className="my-4 py-2 px-4 bg-[#8b1e3f]/10 border-l-2 border-[#8b1e3f] overflow-x-auto font-mono text-[#f0c987] text-center text-base">
        {math}
      </div>
    );
  }

  return (
    <span className="font-mono text-[#f0c987] bg-[#8b1e3f]/20 px-1 py-0.5 rounded text-sm mx-0.5">
      {math}
    </span>
  );
}

/**
 * Helper component that parses markdown-style text and replaces inline $...$
 * and display $$...$$ with MathRenderer components.
 */
export function RenderMathText({ text }: { text: string }) {
  if (!text) return null;

  // Split by $$ first (display math), then by $ (inline math)
  const displayParts = text.split(/(\$\$[\s\S]*?\$\$)/g);

  return (
    <>
      {displayParts.map((part, idx) => {
        if (part.startsWith("$$") && part.endsWith("$$")) {
          const math = part.slice(2, -2).trim();
          return <MathRenderer key={idx} math={math} block={true} />;
        }

        const inlineParts = part.split(/(\$[^\$\n]+?\$)/g);
        return (
          <React.Fragment key={idx}>
            {inlineParts.map((sub, sIdx) => {
              if (sub.startsWith("$") && sub.endsWith("$") && sub.length > 2) {
                const math = sub.slice(1, -1);
                return <MathRenderer key={sIdx} math={math} block={false} />;
              }
              return sub;
            })}
          </React.Fragment>
        );
      })}
    </>
  );
}
