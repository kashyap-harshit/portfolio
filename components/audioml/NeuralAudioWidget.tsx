"use client";

import React, { useState } from "react";
import TicTacToeFrame from "@/components/TicTacToeFrame";
import { ArrowRight, ArrowLeft, RefreshCw } from "lucide-react";

export default function NeuralAudioWidget() {
  const [phase, setPhase] = useState<"idle" | "forward" | "backprop">("idle");
  const [step, setStep] = useState<number>(0);

  const inputNodes = [
    { label: "MFCC₁", full: "Timbral Envelope" },
    { label: "Centroid", full: "Spectral Brightness" },
    { label: "ZCR", full: "Percussiveness" },
    { label: "Stability", full: "Pitch / Dynamic Var" },
  ];

  const hiddenNodes = [
    { label: "h₁", full: "Harmonic Filter" },
    { label: "h₂", full: "Transient Detector" },
    { label: "h₃", full: "Sub-bass Energy" },
  ];

  const outputNodes = [
    { label: "ŷ", full: "Performance Rating / Class" },
  ];

  const handleForward = () => {
    setPhase("forward");
    setStep(1);
  };

  const handleBackprop = () => {
    setPhase("backprop");
    setStep(2);
  };

  const handleReset = () => {
    setPhase("idle");
    setStep(0);
  };

  return (
    <div className="relative isolate w-full my-8">
      <TicTacToeFrame />
      <div className="relative overflow-hidden isolate bg-[#8b1e3f]/10 border-2 border-[#8b1e3f] p-5 rounded-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#8b1e3f]/40 gap-3">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#f0c987] font-mono font-semibold">
              Deep Audio Architecture
            </div>
            <h4 className="text-xl text-[#f0c987] font-serif font-bold">
              Forward Propagation & Backpropagation Flow (δ)
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleForward}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono border transition-colors ${
                phase === "forward"
                  ? "bg-[#27C93F] text-[#1a0a18] font-bold border-[#27C93F]"
                  : "bg-[#8b1e3f]/30 text-[#f0c987] hover:bg-[#8b1e3f]/60 border-[#8b1e3f]"
              }`}
            >
              <ArrowRight size={13} />
              <span>Forward Pass (a)</span>
            </button>
            <button
              onClick={handleBackprop}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono border transition-colors ${
                phase === "backprop"
                  ? "bg-[#FF5F56] text-[#FFFFFF] font-bold border-[#FF5F56]"
                  : "bg-[#8b1e3f]/30 text-[#f0c987] hover:bg-[#8b1e3f]/60 border-[#8b1e3f]"
              }`}
            >
              <ArrowLeft size={13} />
              <span>Backprop (δ)</span>
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 bg-[#8b1e3f]/20 hover:bg-[#8b1e3f]/40 text-[#89bd9e] hover:text-[#f0c987] rounded border border-[#8b1e3f]/60 transition-colors"
              title="Reset"
            >
              <RefreshCw size={13} />
            </button>
          </div>
        </div>

        <p className="text-sm text-[#89bd9e] mb-4 font-sans leading-relaxed">
          {phase === "forward" ? (
            <span>
              <strong className="text-[#27C93F]">Forward Propagation:</strong>{" "}
              {"Acoustic inputs a⁽¹⁾ = x flow into hidden units through weights W⁽¹⁾. Each hidden unit computes activation a_j⁽²⁾ = g(z_j⁽²⁾) = g(W⁽¹⁾ a⁽¹⁾ + b⁽¹⁾), producing final prediction h_θ(x) = a⁽³⁾."}
            </span>
          ) : phase === "backprop" ? (
            <span>
              <strong className="text-[#FF5F56]">Backpropagation:</strong>{" "}
              {"Output error δ⁽³⁾ = a⁽³⁾ - y flows in reverse. Hidden error terms δ⁽²⁾ = ((W⁽²⁾)ᵀ δ⁽³⁾) ⊙ g'(z⁽²⁾) measure each node's responsibility, updating weights via ΔW = -η (∂E / ∂W)."}
            </span>
          ) : (
            <span>
              Multi-Layer Perceptron (ANN) for audio modeling. Click <strong>Forward Pass</strong> to watch activations calculate predictions, or <strong>Backprop</strong> to watch error signals propagate backwards to update weight matrices.
            </span>
          )}
        </p>

        {/* SVG Network Visualizer */}
        <div className="bg-[#100511] border border-[#8b1e3f]/50 rounded p-4 overflow-hidden flex justify-center">
          <svg viewBox="0 0 520 230" className="w-full h-auto max-h-[280px] select-none">
            {/* Connection Lines: Input to Hidden */}
            {inputNodes.map((inp, i) => {
              const iy = 35 + i * 50;
              return hiddenNodes.map((hid, h) => {
                const hy = 55 + h * 60;
                const isForward = phase === "forward";
                const isBack = phase === "backprop";
                const strokeColor = isBack ? "#FF5F56" : isForward ? "#27C93F" : "#8b1e3f";
                const opacity = isForward || isBack ? 0.75 : 0.25;

                return (
                  <line
                    key={`in-${i}-hid-${h}`}
                    x1="90"
                    y1={iy}
                    x2="260"
                    y2={hy}
                    stroke={strokeColor}
                    strokeWidth={isForward || isBack ? "1.5" : "1"}
                    strokeOpacity={opacity}
                  />
                );
              });
            })}

            {/* Connection Lines: Hidden to Output */}
            {hiddenNodes.map((hid, h) => {
              const hy = 55 + h * 60;
              return outputNodes.map((out, o) => {
                const oy = 115;
                const isForward = phase === "forward";
                const isBack = phase === "backprop";
                const strokeColor = isBack ? "#FF5F56" : isForward ? "#27C93F" : "#8b1e3f";
                const opacity = isForward || isBack ? 0.85 : 0.3;

                return (
                  <line
                    key={`hid-${h}-out-${o}`}
                    x1="260"
                    y1={hy}
                    x2="430"
                    y2={oy}
                    stroke={strokeColor}
                    strokeWidth={isForward || isBack ? "2" : "1"}
                    strokeOpacity={opacity}
                  />
                );
              });
            })}

            {/* Input Layer Column */}
            <text x="90" y="16" fill="#89bd9e" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              Layer 1: Input (x)
            </text>
            {inputNodes.map((inp, i) => {
              const iy = 35 + i * 50;
              return (
                <g key={`inp-${i}`}>
                  <circle cx="90" cy={iy} r="18" fill="#1a0a18" stroke="#f0c987" strokeWidth="2" />
                  <text x="90" y={iy + 4} fill="#f0c987" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                    {inp.label}
                  </text>
                  <text x="65" y={iy + 4} fill="#89bd9e" fontSize="8" fontFamily="sans-serif" textAnchor="end">
                    {inp.full}
                  </text>
                </g>
              );
            })}

            {/* Hidden Layer Column */}
            <text x="260" y="24" fill="#89bd9e" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              Layer 2: Hidden (a²)
            </text>
            {hiddenNodes.map((hid, h) => {
              const hy = 55 + h * 60;
              const isActive = phase === "forward" || phase === "backprop";
              return (
                <g key={`hid-${h}`}>
                  <circle
                    cx="260"
                    cy={hy}
                    r="20"
                    fill={phase === "forward" ? "#27C93F22" : phase === "backprop" ? "#FF5F5622" : "#1a0a18"}
                    stroke={phase === "forward" ? "#27C93F" : phase === "backprop" ? "#FF5F56" : "#89bd9e"}
                    strokeWidth="2"
                  />
                  <text
                    x="260"
                    y={hy + 4}
                    fill={phase === "forward" ? "#27C93F" : phase === "backprop" ? "#FF5F56" : "#89bd9e"}
                    fontSize="11"
                    fontFamily="monospace"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    {phase === "backprop" ? `δ₂^(${h+1})` : hid.label}
                  </text>
                </g>
              );
            })}

            {/* Output Layer Column */}
            <text x="430" y="70" fill="#89bd9e" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              Layer 3: Output (a³)
            </text>
            {outputNodes.map((out, o) => {
              const oy = 115;
              return (
                <g key={`out-${o}`}>
                  <circle
                    cx="430"
                    cy={oy}
                    r="22"
                    fill={phase === "forward" ? "#27C93F25" : phase === "backprop" ? "#FF5F5625" : "#1a0a18"}
                    stroke={phase === "forward" ? "#27C93F" : phase === "backprop" ? "#FF5F56" : "#f0c987"}
                    strokeWidth="2.5"
                  />
                  <text
                    x="430"
                    y={oy + 4}
                    fill={phase === "forward" ? "#27C93F" : phase === "backprop" ? "#FF5F56" : "#f0c987"}
                    fontSize="11"
                    fontFamily="monospace"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    {phase === "backprop" ? "δ³ (Error)" : "ŷ (a³)"}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Formulas & Inspection Footer */}
        <div className="mt-4 pt-3 border-t border-[#8b1e3f]/30 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-2.5 bg-[#1a0a18] border border-[#8b1e3f]/40 rounded">
            <span className="text-[#f0c987] font-bold block mb-1">
              Forward Activation Formula:
            </span>
            <div className="text-[#89bd9e]">
              {"z⁽ˡ⁾ = W⁽ˡ⁻¹⁾ a⁽ˡ⁻¹⁾ + b⁽ˡ⁻¹⁾"}<br />
              {"a⁽ˡ⁾ = g(z⁽ˡ⁾) = 1 / (1 + e⁻ᶻ) (or ReLU)"}
            </div>
          </div>

          <div className="p-2.5 bg-[#1a0a18] border border-[#8b1e3f]/40 rounded">
            <span className="text-[#FF5F56] font-bold block mb-1">
              Backprop Error Term (δ) Formula:
            </span>
            <div className="text-[#89bd9e]">
              {"δ⁽³⁾ = a⁽³⁾ - y"}<br />
              {"δ⁽²⁾ = ((W⁽²⁾)ᵀ δ⁽³⁾) ⊙ g'(z⁽²⁾)"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
