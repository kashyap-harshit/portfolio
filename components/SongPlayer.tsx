"use client";
import { useEffect, useRef } from "react";
import { FiPlay, FiPause } from "react-icons/fi";
import { getTimeDomainData } from "@/lib/audioVisualizer";

/**
 * Presentational audio controls with an interactive real-time oscilloscope waveform.
 * Renders time-domain audio oscillations when playing and a subtle resting wave when paused.
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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    const bufferLength = 128;
    const dataArray = new Uint8Array(bufferLength);

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth || 180;
    const height = canvas.clientHeight || 24;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    let idlePhase = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle dark backdrop grid line
      ctx.beginPath();
      ctx.strokeStyle = "rgba(139, 30, 63, 0.25)";
      ctx.lineWidth = 1;
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      if (playing) {
        getTimeDomainData(dataArray);

        // Draw live oscilloscope waveform
        ctx.beginPath();
        ctx.strokeStyle = "#89bd9e";
        ctx.lineWidth = 1.6;
        ctx.shadowColor = "#89bd9e";
        ctx.shadowBlur = 4;

        const sliceWidth = width / (bufferLength - 1);
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0; // 0..2 centered at 1.0
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }

        ctx.stroke();
        ctx.shadowBlur = 0; // reset
      } else {
        // Smooth gentle resting wave when paused
        idlePhase += 0.03;
        ctx.beginPath();
        ctx.strokeStyle = "rgba(137, 189, 158, 0.4)";
        ctx.lineWidth = 1.2;

        for (let x = 0; x <= width; x += 2) {
          const progressFactor = x / width;
          const y =
            height / 2 +
            Math.sin(progressFactor * Math.PI * 4 + idlePhase) * 2.5 * Math.sin(progressFactor * Math.PI);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [playing]);

  return (
    <div className="flex items-center gap-3 min-w-0">
      <button
        type="button"
        onClick={onToggle}
        aria-label={playing ? "Pause" : "Play"}
        className="shrink-0 grid place-items-center h-10 w-10 border-2 border-[#8b1e3f] text-[#f0c987] hover:bg-[#3c153b]/40 transition-colors"
      >
        {playing ? <FiPause size={18} /> : <FiPlay size={18} className="translate-x-[1px]" />}
      </button>

      <div className="flex flex-col min-w-0 w-44">
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="text-xs text-[#89bd9e] truncate font-medium">{title}</span>
          {playing && (
            <span className="flex items-center gap-0.5 shrink-0" title="Audio Active">
              <span className="w-1 h-2.5 bg-[#f0c987] animate-pulse rounded-full" />
              <span className="w-1 h-3.5 bg-[#89bd9e] animate-pulse [animation-delay:150ms] rounded-full" />
              <span className="w-1 h-2 bg-[#f0c987] animate-pulse [animation-delay:300ms] rounded-full" />
            </span>
          )}
        </div>

        {/* Real-time Oscilloscope Canvas */}
        <div className="relative w-full h-[22px] bg-[#1a0a18]/70 border border-[#8b1e3f]/40 overflow-hidden mb-[6px]">
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>

        {/* Seek track */}
        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={progress}
          onChange={onSeek}
          aria-label="Seek"
          className="w-full accent-[#f0c987] cursor-pointer h-1.5 bg-[#8b1e3f]/30"
        />
      </div>
    </div>
  );
}
