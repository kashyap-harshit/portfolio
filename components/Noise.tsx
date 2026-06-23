"use client"
import React, { useRef, useEffect } from 'react';

interface NoiseProps {
  patternSize?: number;
  patternScaleX?: number;
  patternScaleY?: number;
  patternRefreshInterval?: number;
  patternAlpha?: number;
  fullScreen?: boolean;
}

const Noise: React.FC<NoiseProps> = ({
  patternSize = 250,
  patternScaleX = 1,
  patternScaleY = 1,
  patternRefreshInterval = 2,
  patternAlpha = 15,
  fullScreen = true
}) => {
  const grainRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = grainRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const canvasSize = 1024;

    const drawGrain = () => {
      const imageData = ctx.createImageData(canvasSize, canvasSize);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = patternAlpha;
      }

      ctx.putImageData(imageData, 0, 0);
    };

    // Generate the grain ONCE. Movement is done purely with a CSS transform
    // (see the .noise-anim keyframes), so there's no per-frame pixel work — the
    // animated "noise" look costs ~no CPU.
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    drawGrain();
  }, [patternSize, patternScaleX, patternScaleY, patternRefreshInterval, patternAlpha, fullScreen]);

  // The canvas is oversized (110%) and offset by -5% so the ±4% transform jumps
  // never expose an empty edge.
  const sizeStyle: React.CSSProperties = fullScreen
    ? { top: '-5vh', left: '-5vw', width: '110vw', height: '110vh' }
    : { top: '-5%', left: '-5%', width: '110%', height: '110%' };

  return (
    <canvas
      className="noise-anim pointer-events-none absolute"
      ref={grainRef}
      style={{ imageRendering: 'pixelated', ...sizeStyle }}
    />
  );
};

export default Noise;
