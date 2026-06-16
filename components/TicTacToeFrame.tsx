import { CSSProperties } from "react";

/**
 * How far each edge overshoots the corners (px). Each line gets its own amount
 * so the corners look hand-drawn rather than uniform. Exported so animation
 * code (e.g. the scrollspy highlight) can tween to/from these exact values.
 */
export const HASH_OVERSHOOT = { top: 7, bottom: 13, left: 6, right: 11 };

type Overshoot = { top: number; bottom: number; left: number; right: number };

type Props = {
  overshoot?: Overshoot;
  thickness?: number;
  color?: string;
  /**
   * When true, the overshoot pulses 0 → full → 0 forever (see the
   * `ttt-pulse-*` keyframes in globals.css) so the frame reads as a highlight.
   */
  pulse?: boolean;
};

/**
 * Tic-tac-toe (#) frame: four lines that span each side and shoot past the
 * corners. Drop it inside any `position: relative` element whose content you
 * want framed. NOTE: the parent must not clip overflow, or the overshoot is
 * cut off.
 */
export default function TicTacToeFrame({
  overshoot = HASH_OVERSHOOT,
  thickness = 2,
  color = "#8b1e3f",
  pulse = false,
}: Props) {
  const base: CSSProperties = {
    position: "absolute",
    backgroundColor: color,
    pointerEvents: "none",
  };
  const off = -thickness / 2; // center each line on its edge
  const t = thickness;

  if (!pulse) {
    // Static # frame: full-length edges with overshoot baked in. The scrollspy
    // highlight animates these via GSAP, so keep the ttt-line-- classes.
    return (
      <>
        <span
          className="ttt-line ttt-line--top"
          style={{ ...base, top: off, height: t, left: -overshoot.top, right: -overshoot.top }}
        />
        <span
          className="ttt-line ttt-line--bottom"
          style={{ ...base, bottom: off, height: t, left: -overshoot.bottom, right: -overshoot.bottom }}
        />
        <span
          className="ttt-line ttt-line--left"
          style={{ ...base, left: off, width: t, top: -overshoot.left, bottom: -overshoot.left }}
        />
        <span
          className="ttt-line ttt-line--right"
          style={{ ...base, right: off, width: t, top: -overshoot.right, bottom: -overshoot.right }}
        />
      </>
    );
  }

  // Pulse: a static flush rectangle (the "normal" edges) plus eight corner nubs
  // that grow out to the overshoot length and retract, oscillating between a
  // plain rectangle and the full tic-tac-toe #.
  return (
    <>
      {/* flush rectangle border (always present) */}
      <span style={{ ...base, top: off, height: t, left: 0, right: 0 }} />
      <span style={{ ...base, bottom: off, height: t, left: 0, right: 0 }} />
      <span style={{ ...base, left: off, width: t, top: 0, bottom: 0 }} />
      <span style={{ ...base, right: off, width: t, top: 0, bottom: 0 }} />

      {/* top edge nubs (grow horizontally out from each corner) */}
      <span className="ttt-nub-h" style={{ ...base, top: off, height: t, left: -overshoot.top, width: overshoot.top, transformOrigin: "right" }} />
      <span className="ttt-nub-h" style={{ ...base, top: off, height: t, right: -overshoot.top, width: overshoot.top, transformOrigin: "left" }} />
      {/* bottom edge nubs */}
      <span className="ttt-nub-h" style={{ ...base, bottom: off, height: t, left: -overshoot.bottom, width: overshoot.bottom, transformOrigin: "right" }} />
      <span className="ttt-nub-h" style={{ ...base, bottom: off, height: t, right: -overshoot.bottom, width: overshoot.bottom, transformOrigin: "left" }} />
      {/* left edge nubs (grow vertically out from each corner) */}
      <span className="ttt-nub-v" style={{ ...base, left: off, width: t, top: -overshoot.left, height: overshoot.left, transformOrigin: "bottom" }} />
      <span className="ttt-nub-v" style={{ ...base, left: off, width: t, bottom: -overshoot.left, height: overshoot.left, transformOrigin: "top" }} />
      {/* right edge nubs */}
      <span className="ttt-nub-v" style={{ ...base, right: off, width: t, top: -overshoot.right, height: overshoot.right, transformOrigin: "bottom" }} />
      <span className="ttt-nub-v" style={{ ...base, right: off, width: t, bottom: -overshoot.right, height: overshoot.right, transformOrigin: "top" }} />
    </>
  );
}
