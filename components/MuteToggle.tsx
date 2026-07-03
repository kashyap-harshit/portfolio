"use client";
import { useEffect } from "react";
import { FiVolume2, FiVolumeX } from "react-icons/fi";
import TicTacToeFrame from "./TicTacToeFrame";
import { useMuted, setMuted, toggleMuted } from "./muteStore";

/**
 * Fixed mute/unmute control in the top-left corner, framed with the site's
 * tic-tac-toe border. Toggles the shared mute store, which silences the song
 * player and the snare-cursor hits alike.
 */
export default function MuteToggle() {
  const muted = useMuted();

  // Restore the persisted preference after mount (kept out of the initial
  // render so SSR and first client render agree).
  useEffect(() => {
    try {
      if (localStorage.getItem("site-muted") === "1") setMuted(true);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <button
      type="button"
      data-no-snare
      onClick={() => toggleMuted()}
      aria-label={muted ? "Unmute" : "Mute"}
      aria-pressed={muted}
      className="fixed top-4 left-4 z-[9998] grid place-items-center h-10 w-10 text-[#f0c987] hover:text-[#89bd9e] transition-colors"
    >
      <TicTacToeFrame />
      {muted ? <FiVolumeX className="h-5 w-5" /> : <FiVolume2 className="h-5 w-5" />}
    </button>
  );
}
