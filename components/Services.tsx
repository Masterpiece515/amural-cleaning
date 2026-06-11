"use client";

import { useContext } from "react";
import { ModalContext } from "./ModalContext";

const services = [
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#22720C" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5-5 9-9 5 5-9 9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 6l5-3 3 3-3 5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 20h3" />
      </svg>
    ),
    title: "Поддерживающая уборка",
    description: "Регулярная уборка по удобному графику — еженедельно или раз в две недели",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#22720C" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    title: "Генеральная уборка",
    description: "Глубокая очистка каждого угла — для идеального результата с нуля",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#22720C" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21l18-4" />
      </svg>
    ),
    title: "Уборка после ремонта",
    description: "Удалим строительную пыль, следы краски и остатки материалов",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#22720C" strokeWidth={1.5}>
        <rect x="2" y="5" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M2 12h20" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 8l2 2-2 2M17 8l-2 2 2 2" strokeWidth={1} />
      </svg>
    ),
    title: "Мойка окон и витрин",
    description: "Кристально чистые окна без разводов — снаружи и изнутри",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#22720C" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 10l9-7 9 7M5 21V10M19 21V10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 21v-6h6v6" />
      </svg>
    ),
    title: "Уборка офисов",
    description: "Чистота на рабочем месте — здоровье и продуктивность вашей команды",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#22720C" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 22V12h6v10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9h18" />
      </svg>
    ),
    title: "Уборка магазинов",
    description: "Торговые залы и служебные помещения — в идеальном порядке каждый день",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#22720C" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    title: "Мытьё полов и чистка плитки",
    description: "Межплиточные швы и покрытия — как новые после профессиональной обработки",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#22720C" strokeWidth={1.5}>
        <rect x="3" y="6" width="18" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18" />
        <circle cx="8" cy="8" r="1" fill="#22720C" />
        <circle cx="11" cy="8" r="1" fill="#22720C" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14a3 3 0 106 0 3 3 0 00-6 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 12v-2M18 16h2M14 16h-2M16 18v2" strokeWidth={1} />
      </svg>
    ),
    title: "Химчистка мебели",
    description: "Глубокая чистка диванов, кресел и ковров — выводим стойкие пятна и запахи",
  },
];

export default function Services() {
  const { open } = useContext(ModalContext);
  return (
    <section id="services" className="py-20 bg-[#141413]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-[#22720C] text-sm font-semibold uppercase tracking-widest">Что мы делаем</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3">
            Наши <span className="text-[#22720C]">услуги</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service) => (
            <div
              key={service.title}
              onClick={() => open(service.title)}
              className="bg-[#1e1e1d] border border-[#2a2a29] rounded-2xl p-5 flex flex-col gap-3 hover:border-[#22720C]/40 hover:bg-[#222221] transition-all duration-200 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#22720C]/10 flex items-center justify-center group-hover:bg-[#22720C]/20 transition-colors flex-shrink-0">
                {service.icon}
              </div>
              <h3 className="text-white font-semibold text-sm leading-snug">{service.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed flex-1">{service.description}</p>
              <span className="text-[#22720C] text-xs font-medium">Заказать →</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
