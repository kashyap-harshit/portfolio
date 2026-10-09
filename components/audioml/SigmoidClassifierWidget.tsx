"use client";

import React, { useState } from "react";
import TicTacToeFrame from "@/components/TicTacToeFrame";

export default function SigmoidClassifierWidget() {
  const [zValue, setZValue] = useState<number>(1.2);
  const [activeTab, setActiveTab] = useState<"curve" | "convexity">("curve");

  const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));
  const prob = sigmoid(zValue);

  // Compute curve points for sigmoid
  const width = 460;
  const height = 180;
  const padding = { top: 20, right: 30, bottom: 35, left: 55 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const zMin = -6;
  const zMax = 6;

  const curvePoints: string[] = [];
  for (let z = zMin; z <= zMax; z += 0.2) {
    const p = sigmoid(z);
    const x = padding.left + ((z - zMin) / (zMax - zMin)) * plotWidth;
    const y = padding.top + plotHeight - p * plotHeight;
    curvePoints.push(`${x},${y}`);
  }
  const curvePath = `M ${curvePoints.join(" L ")}`;

  // Position of user-selected z
  const userX = padding.left + ((zValue - zMin) / (zMax - zMin)) * plotWidth;
  const userY = padding.top + plotHeight - prob * plotHeight;

  return (
    <div className="relative isolate w-full my-8">
      <TicTacToeFrame />
      <div className="relative overflow-hidden isolate bg-[#8b1e3f]/10 border-2 border-[#8b1e3f] p-5 rounded-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#8b1e3f]/40 gap-3">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#f0c987] font-mono font-semibold">
              Interactive Classification Mechanics
            </div>
            <h4 className="text-xl text-[#f0c987] font-serif font-bold">
              Sigmoid Hypothesis & Convex Log-Loss
            </h4>
          </div>

          <div className="flex items-center bg-[#1a0a18] p-1 rounded border border-[#8b1e3f]/60 self-start sm:self-auto text-xs font-mono">
            <button
              onClick={() => setActiveTab("curve")}
              className={`px-3 py-1 rounded transition-colors ${
                activeTab === "curve"
                  ? "bg-[#8b1e3f] text-[#f0c987] font-bold"
                  : "text-[#89bd9e] hover:text-[#f0c987]"
              }`}
            >
              Sigmoid Hypothesis
            </button>
            <button
              onClick={() => setActiveTab("convexity")}
              className={`px-3 py-1 rounded transition-colors ${
                activeTab === "convexity"
                  ? "bg-[#8b1e3f] text-[#f0c987] font-bold"
                  : "text-[#89bd9e] hover:text-[#f0c987]"
              }`}
            >
              Log-Loss vs. MSE
            </button>
          </div>
        </div>

        {activeTab === "curve" ? (
          <div>
            <p className="text-sm text-[#89bd9e] mb-4 font-sans leading-relaxed">
              In audio classification (e.g. <strong className="text-[#f0c987]">Vocal vs. Instrumental</strong>), the hypothesis outputs a probability $h_\theta(x) = P(y=1 \mid x; \theta) \in [0, 1]$. When $z = \theta^T x \ge 0$, $h_\theta(x) \ge 0.5$, predicting the positive class.
            </p>

            {/* SVG Sigmoid Curve */}
            <div className="bg-[#100511] border border-[#8b1e3f]/50 rounded p-2 overflow-hidden flex justify-center">
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-h-[240px] select-none">
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

                {/* Decision boundary at z = 0 */}
                <line
                  x1={padding.left + plotWidth / 2}
                  y1={padding.top}
                  x2={padding.left + plotWidth / 2}
                  y2={padding.top + plotHeight}
                  stroke="#f0c987"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  opacity="0.5"
                />
                <text
                  x={padding.left + plotWidth / 2}
                  y={padding.top + plotHeight + 18}
                  fill="#f0c987"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  z = 0 (Threshold)
                </text>

                {/* 0.5 probability horizontal line */}
                <line
                  x1={padding.left}
                  y1={padding.top + plotHeight / 2}
                  x2={width - padding.right}
                  y2={padding.top + plotHeight / 2}
                  stroke="#8b1e3f"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  opacity="0.4"
                />
                <text
                  x={padding.left - 8}
                  y={padding.top + plotHeight / 2 + 3}
                  fill="#89bd9e"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="end"
                >
                  0.5
                </text>
                <text
                  x={padding.left - 8}
                  y={padding.top + 5}
                  fill="#89bd9e"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="end"
                >
                  1.0
                </text>
                <text
                  x={padding.left - 8}
                  y={padding.top + plotHeight}
                  fill="#89bd9e"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="end"
                >
                  0.0
                </text>

                {/* Curve */}
                <path d={curvePath} fill="none" stroke="#f0c987" strokeWidth="2.5" />

                {/* User point & crosshairs */}
                <line
                  x1={userX}
                  y1={userY}
                  x2={userX}
                  y2={padding.top + plotHeight}
                  stroke="#89bd9e"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                <line
                  x1={padding.left}
                  y1={userY}
                  x2={userX}
                  y2={userY}
                  stroke="#89bd9e"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                <circle cx={userX} cy={userY} r="5" fill="#27C93F" stroke="#1a0a18" strokeWidth="2" />

                {/* Text tag */}
                <text
                  x={userX + (zValue > 2 ? -70 : 10)}
                  y={userY - 8}
                  fill="#27C93F"
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  P = {prob.toFixed(3)}
                </text>
              </svg>
            </div>

            {/* Slider */}
            <div className="mt-4 pt-3 border-t border-[#8b1e3f]/30 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#89bd9e]">
                  Acoustic Score z = θᵀx: <strong className="text-[#f0c987]">{zValue.toFixed(2)}</strong>
                </span>
                <span className="text-[#89bd9e]">
                  Prediction:{" "}
                  <strong className={prob >= 0.5 ? "text-[#27C93F]" : "text-[#FFBD2E]"}>
                    {prob >= 0.5 ? "Class 1: Vocal Section" : "Class 0: Instrumental"}
                  </strong>
                </span>
              </div>
              <input
                type="range"
                min="-5"
                max="5"
                step="0.1"
                value={zValue}
                onChange={(e) => setZValue(parseFloat(e.target.value))}
                className="w-full accent-[#f0c987] cursor-pointer"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-xs font-mono">
            <p className="text-sm text-[#89bd9e] font-sans leading-relaxed">
              Why can&apos;t we simply use Mean Squared Error (MSE) with sigmoid? The comparison below explains the mathematical foundation:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-[#FF5F56]/10 border border-[#FF5F56]/40 rounded">
                <div className="font-bold text-[#FF5F56] text-sm mb-2 flex items-center gap-1.5">
                  <span>✕ Non-Convex MSE Surface</span>
                </div>
                <div className="text-[#89bd9e] space-y-2 font-sans text-xs leading-relaxed">
                  <p>
                    {"Plugging sigmoid into MSE: J(θ) = (1 / 2m) Σ (σ(θᵀx) - y)²."}
                  </p>
                  <p>
                    Because σ(z) is non-linear and saturates at both tails, the second derivative (Hessian) can become negative. The surface has <strong>multiple local minima</strong> and vast plateaus where gradients vanish (∇J ≈ 0).
                  </p>
                  <p className="text-[#FF5F56] font-mono">
                    Result: Gradient descent gets permanently trapped in bad sub-optimal minima!
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#27C93F]/10 border border-[#27C93F]/40 rounded">
                <div className="font-bold text-[#27C93F] text-sm mb-2 flex items-center gap-1.5">
                  <span>✓ Convex Log-Loss Surface</span>
                </div>
                <div className="text-[#89bd9e] space-y-2 font-sans text-xs leading-relaxed">
                  <p>
                    {"Log-Loss: J(θ) = -(1/m) Σ [y log(h) + (1-y) log(1-h)]."}
                  </p>
                  <p>
                    {"Derived via Maximum Likelihood Estimation. The Hessian matrix ∇²J(θ) = (1/m) Xᵀ S X (where S_ii = h_i(1-h_i) > 0) is strictly positive semi-definite everywhere."}
                  </p>
                  <p className="text-[#27C93F] font-mono">
                    Result: Guaranteed single global bowl — gradient descent always reaches the optimum!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
