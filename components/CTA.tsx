"use client";

import { useContext } from "react";
import { ModalContext } from "./ModalContext";

export default function CTA() {
  const { open } = useContext(ModalContext);
  return (
    <section className="py-20 bg-[#1a1a19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#313130] rounded-3xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              Готовы к <span className="text-[#22720C]">идеальной чистоте?</span>
            </h2>
            <p className="text-gray-400 text-base mb-6">
              Оставьте заявку — и мы позаботимся обо всём.
            </p>
            <button
              onClick={() => open()}
              className="flex items-center gap-2 bg-[#22720C] hover:bg-[#1a5a09] text-white font-semibold px-7 py-3 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z"/>
                <path d="M19.5 2L20.4 5.1L23.5 6L20.4 6.9L19.5 10L18.6 6.9L15.5 6L18.6 5.1L19.5 2Z" opacity="0.7"/>
              </svg>
              Заказать уборку
            </button>
          </div>

          {/* Right */}
          <div className="bg-[#3d3d3c] rounded-2xl p-6 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#22720C]/10 flex items-center justify-center">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#22720C" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <a href="tel:+79144784010" className="text-white font-semibold text-lg hover:text-[#22720C] transition-colors">
                +7 914 478-40-10
              </a>
            </div>
            <p className="text-gray-400 text-sm pl-13">
              Быстро ответим и подберем удобное время уборки.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
