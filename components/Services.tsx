"use client";

import { useContext } from "react";
import { ModalContext } from "./ModalContext";

const services = [
  {
    title: "Поддерживающая уборка",
    description: "Регулярная уборка по удобному графику",
    photo: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5-5 9-9 5 5-9 9zM13 6l5-3 3 3-2 5" />
      </svg>
    ),
  },
  {
    title: "Генеральная уборка",
    description: "Глубокая очистка каждого угла помещения",
    photo: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=600&q=80",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  {
    title: "Уборка после ремонта",
    description: "Строительная пыль и остатки материалов",
    photo: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2M5 21H3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6M9 11h6M9 15h4" />
      </svg>
    ),
  },
  {
    title: "Мойка окон и витрин",
    description: "Кристальная чистота без разводов",
    photo: "https://images.unsplash.com/photo-1527352774566-e4916e36c645?auto=format&fit=crop&w=600&q=80",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
        <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M12 3v18" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7l2 2M7 17l2-2M17 7l-2 2M17 17l-2-2" strokeWidth={1.5} />
      </svg>
    ),
  },
  {
    title: "Химчистка мебели и ковров",
    description: "Диваны, кресла, матрасы, ковры — без пятен",
    photo: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h14a2 2 0 012 2v1H3V9zM3 10v7a2 2 0 002 2h14a2 2 0 002-2v-7" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M1 19h22M6 10v9M18 10v9" />
      </svg>
    ),
  },
  {
    title: "Уборка офисов",
    description: "Рабочие места, переговорные, санузлы",
    photo: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 10l9-7 9 7M5 21V10M19 21V10M9 21v-4a2 2 0 014 0v4" />
      </svg>
    ),
  },
  {
    title: "Уборка магазинов",
    description: "Торговые залы и служебные помещения",
    photo: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=600&q=80",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 22V12h6v10" />
      </svg>
    ),
  },
  {
    title: "Мытьё полов и плитки",
    description: "Швы, покрытия, известковый налёт",
    photo: "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=600&q=80",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
      </svg>
    ),
  },
];

export default function Services() {
  const { open } = useContext(ModalContext);

  return (
    <section id="services" className="py-20 bg-[#0f0f0e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-[#22720C] text-sm font-semibold uppercase tracking-widest">Что мы делаем</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3">
            Наши <span className="text-[#22720C]">услуги</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((s) => (
            <div
              key={s.title}
              onClick={() => open(s.title)}
              className="relative rounded-2xl overflow-hidden cursor-pointer group h-56"
            >
              {/* Photo */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.photo}
                alt={s.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 group-hover:from-black/80 transition-all duration-300" />

              {/* Content */}
              <div className="absolute inset-0 p-4 flex flex-col justify-between">
                <div className="w-9 h-9 rounded-xl bg-[#22720C] flex items-center justify-center shadow-lg">
                  {s.icon}
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm leading-snug mb-1">{s.title}</h3>
                  <p className="text-gray-300 text-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-1">{s.description}</p>
                  <span className="text-[#22720C] text-xs font-semibold">Заказать →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
