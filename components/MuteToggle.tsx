"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { FiVolume2, FiVolumeX } from "react-icons/fi";
import TicTacToeFrame from "./TicTacToeFrame";
import Noise from "./Noise";
import { useMuted, setMuted, toggleMuted } from "./muteStore";

/**
 * Fixed mute/unmute control framed with the site's tic-tac-toe border.
 * Positioned in the top-left on the main '/' route and top-right on other routes.
 * Toggles the shared mute store, which silences the song player and the snare-cursor hits alike.
 */
export default function MuteToggle() {
  const muted = useMuted();
  const pathname = usePathname();

  // Restore the persisted preference after mount (kept out of the initial
  // render so SSR and first client render agree).
  useEffect(() => {
    try {
      if (localStorage.getItem("site-muted") === "1") setMuted(true);
    } catch {
      /* ignore */
    }
  }, []);

  const positionClass = pathname === "/" ? "top-4 left-4" : "top-4 right-4";

  return (
    <button
      type="button"
      data-no-snare
      onClick={() => toggleMuted()}
      aria-label={muted ? "Unmute" : "Mute"}
      aria-pressed={muted}
      className={`fixed ${positionClass} z-[9998] grid place-items-center h-10 w-10 text-[#f0c987] hover:text-[#89bd9e] transition-colors`}
    >
      {/* grain background, clipped to the button box (frame overshoot stays) */}
      <span className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-[#1a0a18]/50">
        <Noise fullScreen={false} patternAlpha={35} />
      </span>
      <TicTacToeFrame />
      {muted ? <FiVolumeX className="h-5 w-5" /> : <FiVolume2 className="h-5 w-5" />}
    </button>
  );
}
