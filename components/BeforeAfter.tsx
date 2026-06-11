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
          <div className="absolute inset-0 bg-[#222] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80"
              alt="До уборки"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "grayscale(60%) brightness(55%) sepia(20%)" }}
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute bottom-4 left-4 bg-black/70 text-white text-sm font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">
              До
            </div>
          </div>

          {/* After */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          >
            <div className="absolute inset-0 bg-[#2a2a2a] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80"
                alt="После уборки"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: "brightness(105%) saturate(115%)" }}
              />
              <div className="absolute inset-0 bg-[#22720C]/10" />
            </div>
            <div className="absolute bottom-4 right-4 bg-[#22720C]/90 text-white text-sm font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">
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

