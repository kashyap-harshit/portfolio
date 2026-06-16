"use client";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Glow colour. */
  color?: string;
  /** Orbit duration, e.g. "3s". */
  speed?: string;
  className?: string;
  /**
   * Whether the glow is shown. The wrapper (and its padding) renders either
   * way, so toggling this never changes the element's footprint / layout.
   */
  active?: boolean;
};

/**
 * ReactBits-style star border: a glowing radial blob sweeps along the top and
 * bottom edges (in opposite directions) behind the content, reading as an
 * animated glowing border. Wrap any element to give it the effect.
 */
export default function StarBorder({
  children,
  color = "#f0c987",
  speed = "3s",
  className = "",
  active = true,
}: Props) {
  const glow = {
    background: `radial-gradient(circle, ${color} 0%, ${color} 30%, transparent 70%)`,
    animationDuration: speed,
  };

  return (
    <div className={`star-border ${active ? "star-border--active" : ""} ${className}`}>
      <div className="star-border__glow star-border__glow--bottom" style={glow} />
      <div className="star-border__glow star-border__glow--top" style={glow} />
      <div className="star-border__content">{children}</div>
    </div>
  );
}
