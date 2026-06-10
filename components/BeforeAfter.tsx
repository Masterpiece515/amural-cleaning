"use client";

import { useState, useRef, useCallback } from "react";

export default function BeforeAfter() {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  const onMouseDown = () => { isDragging.current = true; };
  const onMouseUp = () => { isDragging.current = false; };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    updatePosition(e.clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    updatePosition(e.touches[0].clientX);
  };

  return (
    <section className="py-20 bg-[#141413]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
          До / <span className="text-[#22720C]">После</span>
        </h2>
        <p className="text-gray-400 text-center mb-10">Потяните, чтобы увидеть разницу</p>

        <div
          ref={containerRef}
          className="relative w-full max-w-3xl mx-auto h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden cursor-col-resize select-none"
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onMouseMove={onMouseMove}
          onTouchMove={onTouchMove}
        >
          {/* Before */}
          <div className="absolute inset-0 bg-[#222]">
            <div className="w-full h-full flex items-center justify-center">
              <BeforeScene />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d]" />
            <div className="absolute bottom-4 left-4 bg-black/60 text-white text-sm font-semibold px-3 py-1 rounded-full">
              До
            </div>
          </div>

          {/* After */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          >
            <div className="absolute inset-0 bg-[#2a2a2a]">
              <div className="w-full h-full flex items-center justify-center">
                <AfterScene />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#1e2e1a] to-[#0d180a] opacity-60" />
            </div>
            <div className="absolute bottom-4 right-4 bg-[#22720C]/80 text-white text-sm font-semibold px-3 py-1 rounded-full">
              После
            </div>
          </div>

          {/* Slider line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white z-10 pointer-events-none"
            style={{ left: `${position}%` }}
          >
            {/* Handle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#141413" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l-4 3 4 3M16 9l4 3-4 3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BeforeScene() {
  return (
    <svg width="300" height="200" viewBox="0 0 300 200" fill="none" opacity="0.4">
      <rect x="20" y="20" width="260" height="160" rx="8" fill="#3d3d3c"/>
      <rect x="40" y="40" width="100" height="60" rx="4" fill="#555"/>
      <rect x="160" y="40" width="100" height="60" rx="4" fill="#555"/>
      <rect x="40" y="120" width="220" height="40" rx="4" fill="#444"/>
      {/* Mess indicators */}
      <circle cx="80" cy="90" r="8" fill="#666"/>
      <circle cx="130" cy="70" r="5" fill="#666"/>
      <path d="M160 100 L200 140" stroke="#555" strokeWidth="3"/>
    </svg>
  );
}

function AfterScene() {
  return (
    <svg width="300" height="200" viewBox="0 0 300 200" fill="none" opacity="0.5">
      <rect x="20" y="20" width="260" height="160" rx="8" fill="#2d4a28"/>
      <rect x="40" y="40" width="100" height="60" rx="4" fill="#3a5e35"/>
      <rect x="160" y="40" width="100" height="60" rx="4" fill="#3a5e35"/>
      <rect x="40" y="120" width="220" height="40" rx="4" fill="#335230"/>
      {/* Clean sparkles */}
      <path d="M80 65 L83 72 L90 75 L83 78 L80 85 L77 78 L70 75 L77 72 Z" fill="#22720C" opacity="0.8"/>
      <path d="M200 50 L202 55 L207 57 L202 59 L200 64 L198 59 L193 57 L198 55 Z" fill="#22720C" opacity="0.6"/>
    </svg>
  );
}
