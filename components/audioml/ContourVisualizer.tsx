"use client";

import React, { useState, useEffect } from "react";
import TicTacToeFrame from "@/components/TicTacToeFrame";
import { Play, RotateCcw, FastForward, CheckCircle2 } from "lucide-react";

export default function ContourVisualizer() {
  const [mode, setMode] = useState<"unscaled" | "normalized">("unscaled");
  const [step, setStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Trajectory points for unscaled (oscillating zig-zag across elongated valley)
  const unscaledTrajectory = [
    { x: 40, y: 190, cost: 84.5 },
    { x: 120, y: 70, cost: 68.2 },
    { x: 140, y: 175, cost: 57.8 },
    { x: 190, y: 85, cost: 49.1 },
    { x: 215, y: 160, cost: 41.3 },
    { x: 250, y: 98, cost: 34.6 },
    { x: 275, y: 148, cost: 28.9 },
    { x: 300, y: 110, cost: 24.1 },
    { x: 320, y: 142, cost: 19.8 },
    { x: 340, y: 118, cost: 16.2 },
    { x: 358, y: 138, cost: 13.1 },
    { x: 375, y: 124, cost: 10.4 },
    { x: 390, y: 135, cost: 8.2 },
    { x: 400, y: 127, cost: 6.5 },
  ];

  // Trajectory points for normalized (direct straight-line descent toward center minimum)
  const normalizedTrajectory = [
    { x: 60, y: 200, cost: 84.5 },
    { x: 140, y: 175, cost: 42.1 },
    { x: 210, y: 155, cost: 18.7 },
    { x: 270, y: 140, cost: 7.4 },
    { x: 320, y: 132, cost: 2.3 },
    { x: 360, y: 128, cost: 0.6 },
    { x: 388, y: 126, cost: 0.1 },
    { x: 400, y: 125, cost: 0.02 },
  ];

  const currentTrajectory = mode === "unscaled" ? unscaledTrajectory : normalizedTrajectory;
  const maxSteps = currentTrajectory.length - 1;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setStep((prev) => {
          if (prev >= maxSteps) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 350);
    }
    return () => clearInterval(timer);
  }, [isPlaying, maxSteps]);

  const handleModeChange = (newMode: "unscaled" | "normalized") => {
    setMode(newMode);
    setStep(0);
    setIsPlaying(false);
  };

  const handleReset = () => {
    setStep(0);
    setIsPlaying(false);
  };

  const handleStep = () => {
    if (step < maxSteps) {
      setStep((prev) => prev + 1);
    }
  };

  const visiblePoints = currentTrajectory.slice(0, step + 1);
  const currentCost = currentTrajectory[step].cost;

  return (
    <div className="relative isolate w-full my-8">
      <TicTacToeFrame />
      <div className="relative overflow-hidden isolate bg-[#8b1e3f]/10 border-2 border-[#8b1e3f] p-5 rounded-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#8b1e3f]/40 gap-3">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#f0c987] font-mono font-semibold">
              Interactive Loss Surface Explorer
            </div>
            <h4 className="text-xl text-[#f0c987] font-serif font-bold">
              Feature Scaling & Gradient Descent Contours
            </h4>
          </div>
          
          {/* Mode switch pills */}
          <div className="flex items-center bg-[#1a0a18] p-1 rounded border border-[#8b1e3f]/60 self-start sm:self-auto">
            <button
              onClick={() => handleModeChange("unscaled")}
              className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                mode === "unscaled"
                  ? "bg-[#8b1e3f] text-[#f0c987] font-bold"
                  : "text-[#89bd9e] hover:text-[#f0c987]"
              }`}
            >
              Unscaled (Tempo vs. Loudness)
            </button>
            <button
              onClick={() => handleModeChange("normalized")}
              className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                mode === "normalized"
                  ? "bg-[#8b1e3f] text-[#f0c987] font-bold"
                  : "text-[#89bd9e] hover:text-[#f0c987]"
              }`}
            >
              Normalized (Mean Scaled)
            </button>
          </div>
        </div>

        {/* Description text */}
        <p className="text-sm text-[#89bd9e] mb-4 font-sans leading-relaxed">
          {mode === "unscaled" ? (
            <span>
              <strong className="text-[#f0c987]">Unscaled features</strong> (e.g. Tempo 60–180 BPM vs. Loudness 0.001–0.8) stretch the cost landscape into elongated, eccentric ellipses. The gradient vector points almost perpendicular to the path to the global minimum, causing extreme zig-zag oscillations and slow progress.
            </span>
          ) : (
            <span>
              <strong className="text-[#f0c987]">Normalized features</strong> {"((x_i - μ_i) / s_i)"} produce spherical/circular contours. The gradient vector {"-∇J(θ)"} points almost directly toward the global minimum, converging in a fraction of the iterations!
            </span>
          )}
        </p>

        {/* SVG Canvas */}
        <div className="relative bg-[#100511] border border-[#8b1e3f]/50 rounded p-2 overflow-hidden flex justify-center">
          <svg
            viewBox="0 0 500 250"
            className="w-full h-auto max-h-[300px] select-none"
          >
            <defs>
              <linearGradient id="unscaledGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b1e3f" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#1a0a18" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line x1="30" y1="220" x2="470" y2="220" stroke="#8b1e3f" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
            <line x1="50" y1="20" x2="50" y2="230" stroke="#8b1e3f" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
            
            {/* Axis labels */}
            <text x="460" y="240" fill="#89bd9e" fontSize="11" fontFamily="monospace" textAnchor="end">
              {mode === "unscaled" ? "θ₁ (Tempo scale: 120)" : "θ₁ (Normalized: 0)"}
            </text>
            <text x="35" y="30" fill="#89bd9e" fontSize="11" fontFamily="monospace">
              {mode === "unscaled" ? "θ₂ (Loudness: 0.05)" : "θ₂ (Normalized: 0)"}
            </text>

            {/* Contours */}
            {mode === "unscaled" ? (
              // Elongated ellipses for unscaled
              <g opacity="0.85">
                <ellipse cx="400" cy="125" rx="350" ry="85" fill="none" stroke="#8b1e3f" strokeWidth="1.2" opacity="0.25" />
                <ellipse cx="400" cy="125" rx="270" ry="65" fill="none" stroke="#8b1e3f" strokeWidth="1.2" opacity="0.4" />
                <ellipse cx="400" cy="125" rx="190" ry="46" fill="none" stroke="#8b1e3f" strokeWidth="1.5" opacity="0.6" />
                <ellipse cx="400" cy="125" rx="115" ry="28" fill="none" stroke="#f0c987" strokeWidth="1.5" opacity="0.75" />
                <ellipse cx="400" cy="125" rx="45" ry="11" fill="none" stroke="#f0c987" strokeWidth="2" opacity="0.9" />
              </g>
            ) : (
              // Concentric circles for normalized
              <g opacity="0.85">
                <circle cx="400" cy="125" r="160" fill="none" stroke="#8b1e3f" strokeWidth="1.2" opacity="0.3" />
                <circle cx="400" cy="125" r="120" fill="none" stroke="#8b1e3f" strokeWidth="1.2" opacity="0.45" />
                <circle cx="400" cy="125" r="80" fill="none" stroke="#8b1e3f" strokeWidth="1.5" opacity="0.6" />
                <circle cx="400" cy="125" r="45" fill="none" stroke="#f0c987" strokeWidth="1.5" opacity="0.8" />
                <circle cx="400" cy="125" r="18" fill="none" stroke="#f0c987" strokeWidth="2" opacity="0.95" />
              </g>
            )}

            {/* Global Minimum Target */}
            <circle cx="400" cy="125" r="4" fill="#f0c987" />
            <circle cx="400" cy="125" r="8" fill="none" stroke="#f0c987" strokeWidth="1" strokeDasharray="2 2" className="animate-spin" />
            <text x="415" y="129" fill="#f0c987" fontSize="11" fontFamily="monospace" fontWeight="bold">
              Min (θ*)
            </text>

            {/* Gradient Descent Path */}
            {visiblePoints.map((pt, idx) => {
              if (idx === 0) return null;
              const prev = visiblePoints[idx - 1];
              return (
                <g key={idx}>
                  <line
                    x1={prev.x}
                    y1={prev.y}
                    x2={pt.x}
                    y2={pt.y}
                    stroke={mode === "unscaled" ? "#FF5F56" : "#27C93F"}
                    strokeWidth="2"
                    strokeDasharray={idx === step ? "none" : "none"}
                  />
                  <circle cx={pt.x} cy={pt.y} r="3" fill="#f0c987" />
                </g>
              );
            })}

            {/* Starting point */}
            <circle cx={currentTrajectory[0].x} cy={currentTrajectory[0].y} r="4.5" fill="#FFBD2E" />
            <text x={currentTrajectory[0].x - 15} y={currentTrajectory[0].y + 16} fill="#FFBD2E" fontSize="10" fontFamily="monospace">
              Start (θ₀)
            </text>

            {/* Current point highlight */}
            <circle
              cx={currentTrajectory[step].x}
              cy={currentTrajectory[step].y}
              r="6"
              fill="none"
              stroke="#f0c987"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Dashboard / Controls */}
        <div className="mt-4 pt-3 border-t border-[#8b1e3f]/30 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-[#89bd9e]/70">Step: </span>
              <span className="text-[#f0c987] font-bold">{step}</span>
              <span className="text-[#89bd9e]/50"> / {maxSteps}</span>
            </div>
            <div>
              <span className="text-[#89bd9e]/70">Cost J(θ): </span>
              <span className="text-[#f0c987] font-bold">{currentCost.toFixed(2)}</span>
            </div>
            {step === maxSteps && (
              <div className="flex items-center gap-1 text-[#89bd9e] text-xs">
                <CheckCircle2 size={13} />
                <span>{mode === "normalized" ? "Converged rapidly!" : "Still oscillating!"}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#8b1e3f]/40 hover:bg-[#8b1e3f] text-[#f0c987] rounded border border-[#8b1e3f] text-xs font-mono transition-colors"
            >
              <Play size={12} className={isPlaying ? "rotate-90" : ""} />
              <span>{isPlaying ? "Pause" : "Auto-Run"}</span>
            </button>
            <button
              onClick={handleStep}
              disabled={step >= maxSteps}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#8b1e3f]/20 hover:bg-[#8b1e3f]/40 disabled:opacity-40 text-[#89bd9e] hover:text-[#f0c987] rounded border border-[#8b1e3f]/60 text-xs font-mono transition-colors"
            >
              <FastForward size={12} />
              <span>Step</span>
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 bg-[#8b1e3f]/20 hover:bg-[#8b1e3f]/40 text-[#89bd9e] hover:text-[#f0c987] rounded border border-[#8b1e3f]/60 transition-colors"
              title="Reset"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
