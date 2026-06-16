"use client";

const steps = [
  {
    num: 1,
    title: "Заявка",
    description: "Вы оставляете заявку на сайте или по телефону",
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
  },
  {
    num: 2,
    title: "Консультация",
    description: "Мы уточняем детали и подбираем решение",
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    num: 3,
    title: "Выезд",
    description: "Специалист выезжает на объект",
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    ),
  },
  {
    num: 4,
    title: "Уборка",
    description: "Проводим качественную уборку",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3L13.6 8.6L19.5 10L13.6 11.4L12 17L10.4 11.4L4.5 10L10.4 8.6L12 3Z"/>
        <path d="M19 2L19.8 4.7L22.5 5.5L19.8 6.3L19 9L18.2 6.3L15.5 5.5L18.2 4.7L19 2Z" opacity="0.55"/>
      </svg>
    ),
  },
  {
    num: 5,
    title: "Проверка качества",
    description: "Вы принимаете работу и наслаждаетесь чистотой",
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

import { useContext } from "react";
import { ModalContext } from "./ModalContext";

export default function HowWeWork() {
  const { open } = useContext(ModalContext);
  return (
    <section id="how-it-works" className="py-20 bg-[#1a1a19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
          Как мы <span className="text-[#22720C]">работаем</span>
        </h2>

        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="relative flex flex-col items-center text-center w-full sm:w-[calc(50%-12px)] lg:w-[calc(20%-19.2px)]"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-1/2 w-full h-0.5 bg-[#313130] z-0" />
              )}

              {/* Circle */}
              <div className="relative z-10 w-20 h-20 rounded-full bg-[#313130] border-2 border-[#22720C]/30 flex flex-col items-center justify-center mb-4 group-hover:border-[#22720C]">
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#22720C] text-white text-xs font-bold flex items-center justify-center">
                  {step.num}
                </span>
                <span className="text-[#22720C]">{step.icon}</span>
              </div>

              <h3 className="text-white font-semibold text-base mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => open()}
            className="bg-[#22720C] hover:bg-[#1a5a09] text-white font-semibold px-8 py-3 rounded-full transition-all duration-200 hover:scale-105"
          >
            Начать прямо сейчас
          </button>
        </div>
      </div>
    </section>
  );
}
