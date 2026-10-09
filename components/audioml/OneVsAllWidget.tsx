"use client";

import React, { useState } from "react";
import TicTacToeFrame from "@/components/TicTacToeFrame";

type Instrument = {
  name: string;
  color: string;
  x: number; // Attack Clarity (0 to 100)
  y: number; // Spectral Centroid / Brightness (0 to 100)
  samples: { x: number; y: number }[];
};

export default function OneVsAllWidget() {
  const [selectedClass, setSelectedClass] = useState<number | "all">("all");
  const [testPoint, setTestPoint] = useState<{ x: number; y: number }>({ x: 45, y: 75 });

  const categories: Instrument[] = [
    {
      name: "Brass",
      color: "#f0c987", // gold
      x: 75,
      y: 80,
      samples: [
        { x: 70, y: 85 }, { x: 78, y: 82 }, { x: 82, y: 75 }, { x: 74, y: 76 }
      ],
    },
    {
      name: "Strings",
      color: "#89bd9e", // sage
      x: 30,
      y: 40,
      samples: [
        { x: 25, y: 45 }, { x: 32, y: 38 }, { x: 35, y: 42 }, { x: 28, y: 35 }
      ],
    },
    {
      name: "Percussion",
      color: "#FF5F56", // red
      x: 85,
      y: 25,
      samples: [
        { x: 80, y: 28 }, { x: 88, y: 22 }, { x: 92, y: 30 }, { x: 83, y: 20 }
      ],
    },
    {
      name: "Woodwinds",
      color: "#4A90E2", // blue
      x: 35,
      y: 80,
      samples: [
        { x: 32, y: 85 }, { x: 38, y: 78 }, { x: 42, y: 82 }, { x: 30, y: 75 }
      ],
    },
  ];

  // Simple distance-based probability simulation for each class
  const probabilities = categories.map((cat) => {
    const dist = Math.hypot(testPoint.x - cat.x, testPoint.y - cat.y);
    const rawScore = Math.max(0, 1 - dist / 60);
    return Math.pow(rawScore, 2);
  });
  const sumProb = probabilities.reduce((a, b) => a + b, 0) || 1;
  const normalizedProb = probabilities.map((p) => p / sumProb);

  const bestIdx = normalizedProb.indexOf(Math.max(...normalizedProb));
  const winner = categories[bestIdx];

  const width = 460;
  const height = 240;
  const padding = 35;

  return (
    <div className="relative isolate w-full my-8">
      <TicTacToeFrame />
      <div className="relative overflow-hidden isolate bg-[#8b1e3f]/10 border-2 border-[#8b1e3f] p-5 rounded-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#8b1e3f]/40 gap-3">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#f0c987] font-mono font-semibold">
              Multiclass Architecture
            </div>
            <h4 className="text-xl text-[#f0c987] font-serif font-bold">
              One-vs-All (One-vs-Rest) Audio Classification
            </h4>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-[#1a0a18] p-1 rounded border border-[#8b1e3f]/60 text-xs font-mono">
            <button
              onClick={() => setSelectedClass("all")}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedClass === "all"
                  ? "bg-[#8b1e3f] text-[#f0c987] font-bold"
                  : "text-[#89bd9e] hover:text-[#f0c987]"
              }`}
            >
              All (ArgMax)
            </button>
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setSelectedClass(i)}
                className={`px-2 py-1 rounded transition-colors ${
                  selectedClass === i
                    ? "bg-[#8b1e3f] text-[#f0c987] font-bold"
                    : "text-[#89bd9e] hover:text-[#f0c987]"
                }`}
              >
                {cat.name} vs. Rest
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-[#89bd9e] mb-4 font-sans leading-relaxed">
          For K = 4 instrument categories, we train 4 independent binary logistic classifiers. Click anywhere on the 2D acoustic map (Attack Clarity vs. Spectral Centroid) to test classification via {"ŷ = argmax_k h_θ^(k)(x)"}.
        </p>

        {/* Interactive 2D Feature Map */}
        <div className="bg-[#100511] border border-[#8b1e3f]/50 rounded p-2 overflow-hidden flex justify-center">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto max-h-[280px] cursor-crosshair select-none"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = ((e.clientX - rect.left) / rect.width) * width;
              const clickY = ((e.clientY - rect.top) / rect.height) * height;
              const featX = Math.max(0, Math.min(100, ((clickX - padding) / (width - padding * 2)) * 100));
              const featY = Math.max(0, Math.min(100, (1 - (clickY - padding) / (height - padding * 2)) * 100));
              setTestPoint({ x: featX, y: featY });
            }}
          >
            {/* Grid & Axes */}
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#8b1e3f" strokeWidth="1.5" />
            <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#8b1e3f" strokeWidth="1.5" />

            <text x={width - padding} y={height - 12} fill="#89bd9e" fontSize="10" fontFamily="monospace" textAnchor="end">
              Attack Clarity (x₁) →
            </text>
            <text x={padding + 5} y={padding - 10} fill="#89bd9e" fontSize="10" fontFamily="monospace">
              Spectral Centroid (x₂) ↑
            </text>

            {/* Clusters & Samples */}
            {categories.map((cat, i) => {
              const cx = padding + (cat.x / 100) * (width - padding * 2);
              const cy = padding + (1 - cat.y / 100) * (height - padding * 2);
              const isTarget = selectedClass === "all" || selectedClass === i;

              return (
                <g key={i} opacity={isTarget ? 1 : 0.25}>
                  {/* Boundary circle for One-vs-Rest */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r="40"
                    fill={cat.color}
                    fillOpacity="0.12"
                    stroke={cat.color}
                    strokeWidth={selectedClass === i ? "2" : "1"}
                    strokeDasharray={selectedClass === i ? "none" : "2 2"}
                  />
                  {cat.samples.map((s, sIdx) => {
                    const sx = padding + (s.x / 100) * (width - padding * 2);
                    const sy = padding + (1 - s.y / 100) * (height - padding * 2);
                    return <circle key={sIdx} cx={sx} cy={sy} r="3" fill={cat.color} />;
                  })}
                  <text
                    x={cx}
                    y={cy - 45}
                    fill={cat.color}
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {cat.name}
                  </text>
                </g>
              );
            })}

            {/* Test Point */}
            {(() => {
              const tx = padding + (testPoint.x / 100) * (width - padding * 2);
              const ty = padding + (1 - testPoint.y / 100) * (height - padding * 2);
              return (
                <g>
                  <circle cx={tx} cy={ty} r="8" fill="none" stroke="#FFFFFF" strokeWidth="2" className="animate-ping opacity-60" />
                  <circle cx={tx} cy={ty} r="6" fill="#FFFFFF" stroke="#1a0a18" strokeWidth="1.5" />
                  <text x={tx + 10} y={ty + 4} fill="#FFFFFF" fontSize="11" fontFamily="monospace" fontWeight="bold">
                    Test Audio x
                  </text>
                </g>
              );
            })()}
          </svg>
        </div>

        {/* Real-time Probabilities & Prediction Banner */}
        <div className="mt-4 pt-3 border-t border-[#8b1e3f]/30">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
            {categories.map((cat, i) => (
              <div
                key={i}
                className={`p-2 rounded border text-xs font-mono transition-colors ${
                  i === bestIdx
                    ? "bg-[#8b1e3f]/40 border-[#f0c987]"
                    : "bg-[#1a0a18] border-[#8b1e3f]/30"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span style={{ color: cat.color }}>{cat.name}</span>
                  {i === bestIdx && <span className="text-[#f0c987] text-[10px]">argmax</span>}
                </div>
                <div className="text-sm font-bold text-white">
                  {(normalizedProb[i] * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs font-mono bg-[#1a0a18] p-2.5 rounded border border-[#8b1e3f]/40">
            <span className="text-[#89bd9e]">
              Selected Test Sound: [Clarity: {testPoint.x.toFixed(0)}, Centroid: {testPoint.y.toFixed(0)}]
            </span>
            <span className="text-[#f0c987] font-bold">
              Predicted Category:{" "}
              <span style={{ color: winner.color }}>{winner.name}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
