"use client";

import { useContext } from "react";
import { ModalContext } from "./ModalContext";

export default function Hero() {
  const { open } = useContext(ModalContext);
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background geometric lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 right-0 w-1/3 h-full opacity-20"
          style={{
            background:
              "linear-gradient(135deg, transparent 40%, #313130 40%, #313130 45%, transparent 45%, transparent 55%, #313130 55%, #313130 60%, transparent 60%)",
          }}
        />
        <div className="absolute top-0 right-8 w-1 h-40 bg-white opacity-30 rotate-[30deg] origin-top" />
        <div className="absolute top-0 right-20 w-0.5 h-32 bg-[#22720C] opacity-50 rotate-[30deg] origin-top" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
          {/* Left content */}
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              Профессиональный
              <br />
              <span className="text-[#22720C]">клининг</span> для дома
              <br />и бизнеса
            </h1>
            <p className="text-[#22720C] text-lg font-medium mb-4">
              Чистота&nbsp;&nbsp;◆&nbsp;&nbsp;Комфорт&nbsp;&nbsp;◆&nbsp;&nbsp;Доверие
            </p>
            <p className="text-gray-400 text-base mb-8 max-w-md leading-relaxed">
              Мы бережно заботимся о вашем пространстве, используем безопасные средства
              и современное оборудование.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => open()}
                className="flex items-center gap-2 bg-[#22720C] hover:bg-[#1a5a09] text-white font-semibold px-6 py-3 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <BroomIcon />
                Заказать уборку
              </button>
              <a
                href="https://t.me/amuralcleaning"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border border-[#313130] hover:border-[#22720C] text-white font-semibold px-6 py-3 rounded-full transition-all duration-200 hover:bg-[#313130]"
              >
                <TelegramIcon />
                Telegram
              </a>
            </div>
          </div>

          {/* Right — mop image placeholder */}
          <div className="hidden lg:flex justify-end items-center">
            <div className="relative w-80 h-80">
              <div className="absolute inset-0 rounded-2xl overflow-hidden bg-[#313130]">
                <div className="w-full h-full flex items-center justify-center opacity-30">
                  <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                    <rect x="90" y="10" width="8" height="140" rx="4" fill="#22720C"/>
                    <ellipse cx="80" cy="155" rx="30" ry="20" fill="#22720C" opacity="0.6"/>
                    <path d="M60 165 Q80 185 100 165" stroke="#22720C" strokeWidth="3" fill="none"/>
                    <circle cx="115" cy="148" r="6" fill="white" opacity="0.8"/>
                    <circle cx="125" cy="158" r="3" fill="white" opacity="0.5"/>
                  </svg>
                </div>
              </div>
              {/* Decorative lines */}
              <div className="absolute -top-4 -right-4 w-32 h-1 bg-white/20 rotate-[30deg]" />
              <div className="absolute -top-8 -right-2 w-24 h-0.5 bg-[#22720C]/40 rotate-[30deg]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BroomIcon() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.932z" />
    </svg>
  );
}
