"use client";

import { useContext } from "react";
import { ModalContext } from "@/components/ModalContext";

const team = [
  {
    name: "Широнов Озодбек",
    role: "Основатель и руководитель",
    bio: "Более 10 лет в сфере клининга. Лично контролирует качество каждого заказа.",
  },
  {
    name: "Команда специалистов",
    role: "Клинеры",
    bio: "Обученные и проверенные сотрудники, каждый с опытом более 2 лет в профессиональной уборке.",
  },
];

const values = [
  {
    title: "Честность",
    text: "Прозрачные цены, никаких скрытых доплат. Вы всегда знаете, за что платите.",
    icon: "🤝",
  },
  {
    title: "Качество",
    text: "Используем только проверенную профессиональную химию и современное оборудование.",
    icon: "✨",
  },
  {
    title: "Пунктуальность",
    text: "Приезжаем строго в согласованное время и укладываемся в оговорённые сроки.",
    icon: "⏰",
  },
  {
    title: "Безопасность",
    text: "Все наши специалисты проходят проверку. Ваш дом и имущество в надёжных руках.",
    icon: "🔒",
  },
];

const milestones = [
  { year: "2014", text: "Основание компании Amural Cleaning в Чите" },
  { year: "2016", text: "Расширение команды до 5 специалистов" },
  { year: "2018", text: "Начало работы с коммерческими объектами и офисами" },
  { year: "2020", text: "100-й постоянный клиент" },
  { year: "2023", text: "300+ положительных отзывов" },
  { year: "2026", text: "Более 500 выполненных уборок" },
];

export default function ONasPage() {
  const { open } = useContext(ModalContext);

  return (
    <main className="pt-24 pb-20 min-h-screen bg-[#141413]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero */}
        <div className="text-center mb-16">
          <span className="text-[#22720C] text-sm font-semibold uppercase tracking-widest">О компании</span>
          <h1 className="text-4xl sm:text-5xl font-bold mt-3 mb-4">
            Amural <span className="text-[#22720C]">Cleaning</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Мы — команда профессионалов из Читы, которая уже более 10 лет делает дома и офисы чище, уютнее и здоровее.
          </p>
        </div>

        {/* Main about block */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-[#313130] rounded-3xl p-8 lg:p-10 flex flex-col gap-5">
            <h2 className="text-2xl font-bold">Наша миссия</h2>
            <p className="text-gray-300 leading-relaxed">
              Amural Cleaning — это не просто клининговая компания. Мы создаём пространство, в котором комфортно жить и работать.
              Каждый наш специалист понимает, что заходит в личное пространство клиента, и относится к этому с максимальным уважением.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Наш девиз — <span className="text-[#22720C] font-semibold">«Чистота — наш профессионализм»</span>. Мы несём ответственность за каждый заказ и готовы переделать любую работу, если клиент не доволен результатом.
            </p>
            <div className="grid grid-cols-3 gap-4 mt-2">
              {[["500+", "уборок"], ["10+", "лет опыта"], ["300+", "отзывов"]].map(([v, l]) => (
                <div key={l} className="bg-[#3d3d3c] rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-[#22720C]">{v}</div>
                  <div className="text-gray-400 text-xs mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Slogan visual */}
          <div className="bg-[#1e1e1d] rounded-3xl p-10 flex flex-col items-center justify-center text-center gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-1 bg-white/10 rotate-[30deg] origin-right translate-x-8 -translate-y-4" />
            <div className="absolute top-4 right-4 w-24 h-0.5 bg-[#22720C]/30 rotate-[30deg] origin-right" />
            <svg width="64" height="64" viewBox="0 0 32 32" fill="none">
              <path d="M8 24 L18 8 L22 10 L14 26 Z" stroke="#22720C" strokeWidth="2" fill="none"/>
              <path d="M8 24 C8 24 6 28 10 28 C14 28 14 24 14 26" stroke="#22720C" strokeWidth="2" fill="none"/>
              <circle cx="24" cy="12" r="2" stroke="#22720C" strokeWidth="1.5" fill="none"/>
              <path d="M21 16 L27 16" stroke="#22720C" strokeWidth="1.5" strokeDasharray="2 1"/>
            </svg>
            <div className="text-3xl font-bold leading-tight">
              Amural<br /><span className="text-[#22720C]">Cleaning</span>
            </div>
            <p className="text-gray-400 text-sm max-w-xs">Профессиональная уборка для дома и бизнеса в Чите</p>
            <p className="text-[#22720C] text-sm font-semibold tracking-widest uppercase mt-2">Чистота · Комфорт · Доверие</p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
            Наши <span className="text-[#22720C]">ценности</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v) => (
              <div key={v.title} className="bg-[#313130] rounded-2xl p-6 flex flex-col gap-3">
                <span className="text-3xl">{v.icon}</span>
                <h3 className="text-white font-semibold text-lg">{v.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
            История <span className="text-[#22720C]">компании</span>
          </h2>
          <div className="relative">
            {/* Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#313130]" />
            <div className="flex flex-col gap-6">
              {milestones.map((m) => (
                <div key={m.year} className="flex gap-6 items-start pl-2">
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-[#22720C] flex items-center justify-center z-10 relative">
                      <span className="text-white text-xs font-bold">{m.year.slice(2)}</span>
                    </div>
                  </div>
                  <div className="bg-[#313130] rounded-xl px-5 py-3 flex-1">
                    <span className="text-[#22720C] font-bold text-sm">{m.year}</span>
                    <p className="text-gray-300 text-sm mt-0.5">{m.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
            Наша <span className="text-[#22720C]">команда</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {team.map((t) => (
              <div key={t.name} className="bg-[#313130] rounded-2xl p-6 flex gap-5 items-start">
                <div className="w-14 h-14 rounded-full bg-[#22720C]/10 flex items-center justify-center flex-shrink-0">
                  <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#22720C" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold">{t.name}</h3>
                  <p className="text-[#22720C] text-sm mb-2">{t.role}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{t.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#313130] rounded-3xl p-8 sm:p-12 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold mb-3">
            Готовы убедиться в нашем <span className="text-[#22720C]">качестве?</span>
          </h3>
          <p className="text-gray-400 mb-6">Первая уборка — и вы станете нашим постоянным клиентом</p>
          <button
            onClick={() => open()}
            className="bg-[#22720C] hover:bg-[#1a5a09] text-white font-semibold px-8 py-3 rounded-full transition-all hover:scale-105"
          >
            Заказать уборку
          </button>
        </div>
      </div>
    </main>
  );
}
