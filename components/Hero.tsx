"use client";

import Image from "next/image";
import { useContext } from "react";
import { ModalContext } from "./ModalContext";

export default function Hero() {
  const { open } = useContext(ModalContext);
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16 bg-[#141413]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-[#22720C]/5 blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-[#22720C]/5 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12 items-center py-12 lg:py-16">
          {/* Left content */}
          <div>
            <span className="inline-block text-[#22720C] text-sm font-semibold uppercase tracking-widest mb-4 bg-[#22720C]/10 px-4 py-1.5 rounded-full">
              Клининговая компания · г. Чита
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5">
              Профессиональная
              <br />
              <span className="text-[#22720C]">уборка</span> для дома
              <br />и бизнеса
            </h1>
            <p className="text-gray-400 text-base mb-8 max-w-md leading-relaxed">
              Чистота без усилий с вашей стороны. Используем профессиональные средства и современное оборудование.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-4 sm:gap-6 mb-8">
              {[
                { num: "5+", label: "лет опыта" },
                { num: "500+", label: "довольных клиентов" },
                { num: "100%", label: "гарантия качества" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-white font-bold text-xl">{s.num}</p>
                  <p className="text-gray-500 text-xs">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => open()}
                className="flex items-center gap-2 bg-[#22720C] hover:bg-[#1a5a09] text-white font-semibold px-6 py-3.5 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-[#22720C]/20"
              >
                <SparkleIcon />
                Заказать уборку
              </button>
              <a
                href="https://t.me/amuralcleaning"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border border-[#313130] hover:border-[#22720C] text-white font-semibold px-6 py-3.5 rounded-full transition-all duration-200 hover:bg-[#313130]"
              >
                <TelegramIcon />
                Написать в Telegram
              </a>
            </div>
          </div>

          {/* Right — photo */}
          <div className="hidden md:flex justify-center lg:justify-end items-center">
            <div className="relative w-full max-w-[380px] lg:max-w-[480px] aspect-[12/13] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=960&q=80"
                alt="Профессиональная уборка Amural Cleaning"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141413]/80 via-[#141413]/10 to-transparent" />
              {/* Badge */}
              <div className="absolute top-5 right-5 bg-[#22720C] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                г. Чита
              </div>
              {/* Bottom stats */}
              <div className="absolute bottom-5 left-5 right-5 grid grid-cols-3 gap-2">
                {[
                  { num: "5+", text: "лет опыта" },
                  { num: "500+", text: "клиентов" },
                  { num: "8", text: "услуг" },
                ].map((s) => (
                  <div key={s.text} className="bg-black/50 backdrop-blur-md rounded-xl p-3 text-center border border-white/10">
                    <p className="text-white font-bold text-base leading-none">{s.num}</p>
                    <p className="text-gray-300 text-[10px] mt-0.5">{s.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SparkleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z"/>
      <path d="M19.5 2L20.4 5.1L23.5 6L20.4 6.9L19.5 10L18.6 6.9L15.5 6L18.6 5.1L19.5 2Z" opacity="0.6"/>
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
