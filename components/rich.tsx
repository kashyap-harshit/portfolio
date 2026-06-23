import React from "react";

/**
 * Tiny inline-markup parser for content strings stored in /data.
 *   **bold**      → <b>
 *   *italic*      → <i>
 *   __underline__ → <u>
 * Non-nested only, which is all the content needs.
 */
export function rich(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const regex = /\*\*([^*]+)\*\*|__([^_]+)__|\*([^*]+)\*/g;
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;

  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[1] !== undefined) nodes.push(<b key={key++}>{m[1]}</b>);
    else if (m[2] !== undefined) nodes.push(<u key={key++}>{m[2]}</u>);
    else if (m[3] !== undefined) nodes.push(<i key={key++}>{m[3]}</i>);
    last = regex.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}
