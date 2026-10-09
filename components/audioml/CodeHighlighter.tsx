"use client";

import React, { useMemo } from "react";

type TokenType =
  | "keyword"
  | "function-def"
  | "class-name"
  | "builtin"
  | "string"
  | "comment"
  | "number"
  | "decorator"
  | "symbol"
  | "identifier"
  | "whitespace"
  | "other";

interface Token {
  type: TokenType;
  value: string;
}

const KEYWORDS = new Set([
  "def",
  "class",
  "import",
  "from",
  "as",
  "return",
  "if",
  "elif",
  "else",
  "for",
  "while",
  "in",
  "try",
  "except",
  "finally",
  "with",
  "raise",
  "pass",
  "break",
  "continue",
  "lambda",
  "yield",
  "global",
  "nonlocal",
  "assert",
  "del",
  "not",
  "and",
  "or",
  "is",
]);

const BUILTINS = new Set([
  "self",
  "cls",
  "True",
  "False",
  "None",
  "len",
  "range",
  "print",
  "float",
  "int",
  "str",
  "bool",
  "list",
  "dict",
  "tuple",
  "set",
  "sum",
  "min",
  "max",
  "abs",
  "round",
  "enumerate",
  "zip",
  "super",
  "isinstance",
  "type",
  "np",
  "librosa",
  "torch",
  "nn",
  "optim",
  "scipy",
  "Sequential",
  "Linear",
  "ReLU",
  "Dropout",
  "CrossEntropyLoss",
  "Adam",
  "SGD",
  "LBFGS",
  "Tensor",
  "Module",
]);

function tokenizeLinePart(part: string): Token[] {
  const tokenRegex =
    /(#[^\n]*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(@[a-zA-Z_]\w*)|(\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b)|(\b[a-zA-Z_]\w*\b)|(->|:=|==|!=|<=|>=|\+=|-=|\*=|\/=|[-+*\/%@=<>!&|^~]+|[(),:\[\]{}])|(\s+)|([^\s\w]+)/g;

  const tokens: Token[] = [];
  let match: RegExpExecArray | null;
  let lastDef = false;
  let lastClass = false;

  while ((match = tokenRegex.exec(part)) !== null) {
    const [, comment, singleStr, decorator, number, word, symbol, whitespace, other] = match;

    if (whitespace) {
      tokens.push({ type: "whitespace", value: whitespace });
    } else if (comment) {
      tokens.push({ type: "comment", value: comment });
    } else if (singleStr) {
      tokens.push({ type: "string", value: singleStr });
    } else if (decorator) {
      tokens.push({ type: "decorator", value: decorator });
    } else if (number) {
      tokens.push({ type: "number", value: number });
    } else if (word) {
      if (KEYWORDS.has(word)) {
        tokens.push({ type: "keyword", value: word });
        if (word === "def") lastDef = true;
        if (word === "class") lastClass = true;
      } else if (lastDef) {
        tokens.push({ type: "function-def", value: word });
        lastDef = false;
      } else if (lastClass) {
        tokens.push({ type: "class-name", value: word });
        lastClass = false;
      } else if (BUILTINS.has(word)) {
        tokens.push({ type: "builtin", value: word });
      } else {
        tokens.push({ type: "identifier", value: word });
      }
    } else if (symbol) {
      tokens.push({ type: "symbol", value: symbol });
    } else {
      tokens.push({ type: "other", value: other || match[0] });
    }
  }

  return tokens;
}

function tokenizePythonCode(code: string): Token[][] {
  const lines = code.split("\n");
  const result: Token[][] = [];
  let inTripleQuote: string | null = null;

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    const lineTokens: Token[] = [];

    // If currently inside a multi-line docstring
    if (inTripleQuote) {
      const endIdx = line.indexOf(inTripleQuote);
      if (endIdx !== -1) {
        const strContent = line.slice(0, endIdx + 3);
        lineTokens.push({ type: "string", value: strContent });
        inTripleQuote = null;
        const rest = line.slice(endIdx + 3);
        lineTokens.push(...tokenizeLinePart(rest));
      } else {
        lineTokens.push({ type: "string", value: line });
      }
      result.push(lineTokens);
      continue;
    }

    // Process line and detect triple quote strings
    let curLine = line;
    let idx = 0;
    while (idx < curLine.length) {
      const dQuoteIdx = curLine.indexOf('"""', idx);
      const sQuoteIdx = curLine.indexOf("'''", idx);
      let matchIdx = -1;
      let quoteType: string | null = null;

      if (dQuoteIdx !== -1 && (sQuoteIdx === -1 || dQuoteIdx < sQuoteIdx)) {
        matchIdx = dQuoteIdx;
        quoteType = '"""';
      } else if (sQuoteIdx !== -1) {
        matchIdx = sQuoteIdx;
        quoteType = "'''";
      }

      if (matchIdx !== -1 && quoteType) {
        const before = curLine.slice(idx, matchIdx);
        if (before) lineTokens.push(...tokenizeLinePart(before));

        const afterOpen = curLine.slice(matchIdx + 3);
        const closeIdx = afterOpen.indexOf(quoteType);
        if (closeIdx !== -1) {
          const str = curLine.slice(matchIdx, matchIdx + 3 + closeIdx + 3);
          lineTokens.push({ type: "string", value: str });
          idx = matchIdx + 3 + closeIdx + 3;
        } else {
          const str = curLine.slice(matchIdx);
          lineTokens.push({ type: "string", value: str });
          inTripleQuote = quoteType;
          break;
        }
      } else {
        const remaining = curLine.slice(idx);
        if (remaining) lineTokens.push(...tokenizeLinePart(remaining));
        break;
      }
    }

    result.push(lineTokens);
  }

  return result;
}

function TokenSpan({ token }: { token: Token }) {
  switch (token.type) {
    case "keyword":
      // Vibrant ruby / coral for python keywords
      return <span className="text-[#ff7b72] font-semibold">{token.value}</span>;
    case "function-def":
      // Radiant amber/gold for defined function names
      return <span className="text-[#f0c987] font-bold">{token.value}</span>;
    case "class-name":
      // Warm yellow for class names
      return <span className="text-[#ffd580] font-bold underline decoration-[#8b1e3f]/50">{token.value}</span>;
    case "builtin":
      // Cyan / sky blue for builtins (self, np, librosa, float, etc.)
      return <span className="text-[#79c0ff]">{token.value}</span>;
    case "string":
      // Minty sage green for strings & docstrings
      return <span className="text-[#89bd9e]">{token.value}</span>;
    case "comment":
      // Muted purple-grey italic for comments
      return <span className="text-[#998b9e] italic">{token.value}</span>;
    case "number":
      // Coral orange for numbers
      return <span className="text-[#ff9b5e] font-mono">{token.value}</span>;
    case "decorator":
      // Lavender for decorators
      return <span className="text-[#d2a8ff]">{token.value}</span>;
    case "symbol":
      // Gold-tinted operators
      return <span className="text-[#f0c987]/80">{token.value}</span>;
    case "identifier":
      // Clean silver-white for variable identifiers
      return <span className="text-[#e6edf3]">{token.value}</span>;
    case "whitespace":
      return <span>{token.value}</span>;
    case "other":
    default:
      return <span className="text-[#c9d1d9]">{token.value}</span>;
  }
}

interface CodeHighlighterProps {
  code: string;
}

export default function CodeHighlighter({ code }: CodeHighlighterProps) {
  const lines = useMemo(() => tokenizePythonCode(code), [code]);

  return (
    <div className="font-mono text-sm leading-relaxed overflow-x-auto p-4 select-text">
      <table className="border-collapse w-full">
        <tbody>
          {lines.map((lineTokens, lineIdx) => {
            const lineNum = lineIdx + 1;
            return (
              <tr key={lineIdx} className="hover:bg-[#8b1e3f]/10 transition-colors">
                {/* Line number gutter */}
                <td className="w-10 select-none text-right pr-4 text-[#8b1e3f]/60 text-xs font-mono align-top py-0.5">
                  {lineNum}
                </td>
                {/* Code line */}
                <td className="whitespace-pre pl-2 py-0.5 text-[#e6edf3] font-mono">
                  {lineTokens.length > 0 ? (
                    lineTokens.map((tok, tIdx) => <TokenSpan key={tIdx} token={tok} />)
                  ) : (
                    <span>&nbsp;</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
