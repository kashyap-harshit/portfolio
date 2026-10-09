"use client";

import React, { useState, useMemo } from "react";
import TicTacToeFrame from "@/components/TicTacToeFrame";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";

export default function LearningRateSimulator() {
  const [alpha, setAlpha] = useState<number>(0.03);
  const [maxIters, setMaxIters] = useState<number>(50);
  const epsilon = 0.001;

  // Simulate gradient descent cost curve J(theta) for given alpha
  const simulation = useMemo(() => {
    const iters: number[] = [];
    const costs: number[] = [];
    let theta = 10.0; // initial parameter value away from minimum at 0
    let prevCost = 0.5 * theta * theta;
    costs.push(prevCost);
    iters.push(0);

    let convergedAt: number | null = null;
    let divergedAt: number | null = null;

    for (let k = 1; k <= maxIters; k++) {
      // In univariate quadratic J(theta) = 1/2 * theta^2, gradient is theta
      const grad = theta;
      theta = theta - alpha * grad;
      const cost = 0.5 * theta * theta;

      if (!isFinite(cost) || cost > 500) {
        divergedAt = k;
        costs.push(500);
        iters.push(k);
        break;
      }

      costs.push(cost);
      iters.push(k);

      // Convergence check: |J(k) - J(k-1)| < epsilon
      if (Math.abs(prevCost - cost) < epsilon && convergedAt === null) {
        convergedAt = k;
      }

      prevCost = cost;
    }

    return { iters, costs, convergedAt, divergedAt };
  }, [alpha, maxIters]);

  // Determine behavior category
  let behavior: { label: string; color: string; desc: string; icon: any } = {
    label: "Optimal Convergence",
    color: "#27C93F",
    desc: "Rapid monotonic decrease in cost, converging within a small number of iterations.",
    icon: CheckCircle,
  };

  if (alpha < 0.01) {
    behavior = {
      label: "Slow Convergence (Crawling)",
      color: "#FFBD2E",
      desc: "Learning rate is too timid. Cost decreases monotonically but will take hundreds of iterations.",
      icon: Clock,
    };
  } else if (alpha >= 0.7) {
    behavior = {
      label: "Overshooting / Divergence",
      color: "#FF5F56",
      desc: "Learning rate is overly large. Updates overshoot the valley and explode toward infinity!",
      icon: AlertTriangle,
    };
  }

  // Generate SVG path for cost curve
  const width = 460;
  const height = 180;
  const padding = { top: 20, right: 30, bottom: 35, left: 55 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const maxCost = 50; // clamp visual upper bound
  const points = simulation.costs.map((c, i) => {
    const x = padding.left + (i / maxIters) * plotWidth;
    const clampedCost = Math.min(c, maxCost);
    const y = padding.top + plotHeight - (clampedCost / maxCost) * plotHeight;
    return `${x},${y}`;
  });

  const pathData = points.length > 0 ? `M ${points.join(" L ")}` : "";

  return (
    <div className="relative isolate w-full my-8">
      <TicTacToeFrame />
      <div className="relative overflow-hidden isolate bg-[#8b1e3f]/10 border-2 border-[#8b1e3f] p-5 rounded-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#8b1e3f]/40 gap-3">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#f0c987] font-mono font-semibold">
              Interactive Training Diagnostics
            </div>
            <h4 className="text-xl text-[#f0c987] font-serif font-bold">
              Learning Rate (α) & Convergence Test (ε)
            </h4>
          </div>

          {/* Quick preset buttons */}
          <div className="flex items-center gap-1.5 bg-[#1a0a18] p-1 rounded border border-[#8b1e3f]/60 self-start sm:self-auto text-xs font-mono">
            <button
              onClick={() => setAlpha(0.001)}
              className={`px-2 py-1 rounded transition-colors ${
                alpha === 0.001 ? "bg-[#8b1e3f] text-[#f0c987] font-bold" : "text-[#89bd9e] hover:text-[#f0c987]"
              }`}
            >
              Small (0.001)
            </button>
            <button
              onClick={() => setAlpha(0.03)}
              className={`px-2 py-1 rounded transition-colors ${
                alpha === 0.03 ? "bg-[#8b1e3f] text-[#f0c987] font-bold" : "text-[#89bd9e] hover:text-[#f0c987]"
              }`}
            >
              Optimal (0.03)
            </button>
            <button
              onClick={() => setAlpha(0.8)}
              className={`px-2 py-1 rounded transition-colors ${
                alpha === 0.8 ? "bg-[#8b1e3f] text-[#f0c987] font-bold" : "text-[#89bd9e] hover:text-[#f0c987]"
              }`}
            >
              Too Large (0.8)
            </button>
          </div>
        </div>

        {/* Current status banner */}
        <div
          className="mb-4 p-3 rounded flex items-start gap-2.5 border"
          style={{ backgroundColor: `${behavior.color}15`, borderColor: `${behavior.color}60` }}
        >
          <behavior.icon size={18} style={{ color: behavior.color }} className="shrink-0 mt-0.5" />
          <div className="text-xs font-mono">
            <div className="font-bold mb-0.5" style={{ color: behavior.color }}>
              {behavior.label} (α = {alpha.toFixed(3)})
            </div>
            <div className="text-[#89bd9e]">{behavior.desc}</div>
          </div>
        </div>

        {/* SVG Cost Curve Chart */}
        <div className="bg-[#100511] border border-[#8b1e3f]/50 rounded p-2 overflow-hidden flex justify-center">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-h-[260px] select-none">
            {/* Axes */}
            <line
              x1={padding.left}
              y1={padding.top + plotHeight}
              x2={width - padding.right}
              y2={padding.top + plotHeight}
              stroke="#8b1e3f"
              strokeWidth="1.5"
            />
            <line
              x1={padding.left}
              y1={padding.top}
              x2={padding.left}
              y2={padding.top + plotHeight}
              stroke="#8b1e3f"
              strokeWidth="1.5"
            />

            {/* Grid & Axis markings */}
            <text x={padding.left - 8} y={padding.top + 5} fill="#89bd9e" fontSize="10" fontFamily="monospace" textAnchor="end">
              50.0
            </text>
            <text x={padding.left - 8} y={padding.top + plotHeight / 2} fill="#89bd9e" fontSize="10" fontFamily="monospace" textAnchor="end">
              25.0
            </text>
            <text x={padding.left - 8} y={padding.top + plotHeight} fill="#89bd9e" fontSize="10" fontFamily="monospace" textAnchor="end">
              0.0
            </text>

            <text x={width - padding.right} y={padding.top + plotHeight + 20} fill="#89bd9e" fontSize="10" fontFamily="monospace" textAnchor="end">
              Iterations (50)
            </text>
            <text x={padding.left + 5} y={padding.top - 6} fill="#f0c987" fontSize="10" fontFamily="monospace">
              Cost J(θ)
            </text>

            {/* Threshold line epsilon */}
            <line
              x1={padding.left}
              y1={padding.top + plotHeight - 3}
              x2={width - padding.right}
              y2={padding.top + plotHeight - 3}
              stroke="#89bd9e"
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.6"
            />
            <text
              x={width - padding.right}
              y={padding.top + plotHeight - 6}
              fill="#89bd9e"
              fontSize="9"
              fontFamily="monospace"
              textAnchor="end"
              opacity="0.8"
            >
              ε = 10⁻³
            </text>

            {/* Cost Path Curve */}
            <path
              d={pathData}
              fill="none"
              stroke={behavior.color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Convergence marker */}
            {simulation.convergedAt !== null && (
              <g>
                <line
                  x1={padding.left + (simulation.convergedAt / maxIters) * plotWidth}
                  y1={padding.top}
                  x2={padding.left + (simulation.convergedAt / maxIters) * plotWidth}
                  y2={padding.top + plotHeight}
                  stroke="#27C93F"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                />
                <circle
                  cx={padding.left + (simulation.convergedAt / maxIters) * plotWidth}
                  cy={padding.top + plotHeight - 2}
                  r="4"
                  fill="#27C93F"
                />
                <text
                  x={padding.left + (simulation.convergedAt / maxIters) * plotWidth + 4}
                  y={padding.top + 20}
                  fill="#27C93F"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  Converged (iter {simulation.convergedAt})
                </text>
              </g>
            )}

            {/* Divergence warning in plot */}
            {simulation.divergedAt !== null && (
              <text
                x={width / 2}
                y={padding.top + 35}
                fill="#FF5F56"
                fontSize="12"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
              >
                ⚠ DIVERGENCE: J(θ) → ∞
              </text>
            )}
          </svg>
        </div>

        {/* Slider Controls */}
        <div className="mt-4 pt-3 border-t border-[#8b1e3f]/30 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-mono text-[#f0c987] flex items-center gap-2">
              <span>Learning Rate (α):</span>
              <span className="font-bold text-sm bg-[#1a0a18] px-2 py-0.5 rounded border border-[#8b1e3f]/50">
                {alpha.toFixed(3)}
              </span>
            </label>
            <div className="text-xs font-mono text-[#89bd9e]">
              Final Cost:{" "}
              <span className="text-[#f0c987] font-bold">
                {simulation.costs[simulation.costs.length - 1].toFixed(4)}
              </span>
            </div>
          </div>

          <input
            type="range"
            min="0.001"
            max="0.95"
            step="0.005"
            value={alpha}
            onChange={(e) => setAlpha(parseFloat(e.target.value))}
            className="w-full accent-[#f0c987] cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
