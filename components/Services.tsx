"use client";

const services = [
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#22720C" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M3 6h18M3 18h18" />
      </svg>
    ),
    title: "Поддерживающая уборка",
    description: "Регулярная уборка для поддержания чистоты и уюта в вашем доме или офисе",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#22720C" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    title: "Генеральная уборка",
    description: "Глубокая очистка всех поверхностей, труднодоступных мест и зон",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#22720C" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: "Уборка после ремонта",
    description: "Удалим строительную пыль, грязь и остатки материалов",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#22720C" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
    title: "Мойка окон и витрин",
    description: "Чистые окна без разводов для идеального вида",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#22720C" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16M3 21h18M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: "Уборка офисов и коммерческих помещений",
    description: "Чистота на рабочем месте — здоровье и продуктивность вашей команды",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#22720C" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Уборка магазинов",
    description: "Поддерживаем чистоту торговых залов и служебных помещений",
  },
];

import { useContext } from "react";
import { ModalContext } from "./ModalContext";

export default function Services() {
  const { open } = useContext(ModalContext);
  return (
    <section id="services" className="py-20 bg-[#141413]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
          Наши <span className="text-[#22720C]">услуги</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              onClick={() => open()}
              className="bg-[#313130] rounded-2xl p-6 flex flex-col gap-4 hover:bg-[#3d3d3c] hover:scale-[1.02] transition-all duration-200 cursor-pointer group"
            >
              <div className="w-14 h-14 rounded-xl bg-[#22720C]/10 flex items-center justify-center group-hover:bg-[#22720C]/20 transition-colors">
                {service.icon}
              </div>
              <h3 className="text-white font-semibold text-lg">{service.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
              <span className="text-[#22720C] text-sm font-medium mt-auto">Заказать →</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
