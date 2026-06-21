"use client";
import { FiPlay, FiPause } from "react-icons/fi";

/**
 * Presentational audio controls (play/pause + seek bar). The actual <audio>
 * element and state live in the parent (About) so the in-card player and the
 * floating corner player can share one audio source.
 */
export default function SongPlayer({
  title,
  playing,
  progress,
  onToggle,
  onSeek,
}: {
  title: string;
  playing: boolean;
  progress: number; // 0..1
  onToggle: () => void;
  onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <button
        type="button"
        onClick={onToggle}
        aria-label={playing ? "Pause" : "Play"}
        className="shrink-0 grid place-items-center h-9 w-9 border-2 border-[#8b1e3f] text-[#f0c987] hover:bg-[#3c153b]/40 transition-colors"
      >
        {playing ? <FiPause /> : <FiPlay className="translate-x-[1px]" />}
      </button>
      <div className="flex flex-col min-w-0 w-40">
        <span className="text-xs text-[#89bd9e] truncate">{title}</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={progress}
          onChange={onSeek}
          aria-label="Seek"
          className="w-full accent-[#8b1e3f] cursor-pointer"
        />
      </div>
    </div>
  );
}
