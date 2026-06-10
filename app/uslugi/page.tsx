"use client";

import { useContext } from "react";
import { ModalContext } from "@/components/ModalContext";
import Link from "next/link";

const services = [
  {
    slug: "podderzhivayushchaya",
    title: "Поддерживающая уборка",
    subtitle: "Регулярная чистота без усилий",
    description:
      "Регулярная поддерживающая уборка — лучший способ сохранять жильё или офис в идеальной чистоте каждый день. Мы приезжаем по удобному для вас графику: ежедневно, еженедельно или раз в две недели.",
    includes: [
      "Уборка пыли со всех поверхностей",
      "Мытьё полов во всех комнатах",
      "Чистка санузлов и сантехники",
      "Протирка зеркал и стеклянных поверхностей",
      "Вынос мусора",
      "Уборка кухни (плита, столешницы, раковина)",
    ],
    price: "от 1 500 ₽",
    icon: (
      <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#22720C" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M3 6h18M3 18h18" />
      </svg>
    ),
  },
  {
    slug: "generalnaya",
    title: "Генеральная уборка",
    subtitle: "Глубокая очистка каждого угла",
    description:
      "Генеральная уборка — комплексная услуга для максимально глубокой очистки помещения. Подходит перед переездом, после длительного отсутствия или просто когда нужен свежий старт.",
    includes: [
      "Все услуги поддерживающей уборки",
      "Мытьё окон изнутри",
      "Чистка мебели и мягких поверхностей",
      "Обработка труднодоступных мест",
      "Чистка плинтусов и карнизов",
      "Мытьё холодильника изнутри",
      "Дезинфекция санузлов",
    ],
    price: "от 4 000 ₽",
    icon: (
      <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#22720C" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    slug: "posle-remonta",
    title: "Уборка после ремонта",
    subtitle: "Устраним последствия строительства",
    description:
      "После ремонта остаётся пыль, строительный мусор и загрязнения, которые сложно убрать обычными средствами. Наша команда имеет опыт и оборудование для быстрого и качественного восстановления чистоты.",
    includes: [
      "Удаление строительной пыли со всех поверхностей",
      "Мытьё окон от следов штукатурки и краски",
      "Очистка напольных покрытий",
      "Удаление пятен краски и клея",
      "Чистка радиаторов и подоконников",
      "Вынос строительного мусора",
    ],
    price: "от 5 000 ₽",
    icon: (
      <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#22720C" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    slug: "mojka-okon",
    title: "Мойка окон и витрин",
    subtitle: "Идеально чисто без разводов",
    description:
      "Профессиональная мойка окон и витрин с использованием специального оборудования и профессиональной химии. Работаем на любой высоте, включая фасады и витрины торговых точек.",
    includes: [
      "Мытьё стёкол снаружи и изнутри",
      "Чистка рам, откосов и подоконников",
      "Обработка витрин и стеклянных перегородок",
      "Полировка без разводов",
      "Работа на высоте (по согласованию)",
    ],
    price: "от 800 ₽ за окно",
    icon: (
      <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#22720C" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
  },
  {
    slug: "ofisy",
    title: "Уборка офисов и коммерческих помещений",
    subtitle: "Чистота = продуктивность",
    description:
      "Чистый офис — это здоровая и продуктивная команда. Работаем в удобное для вас время: до начала рабочего дня, в обед или после его окончания, не мешая рабочему процессу.",
    includes: [
      "Уборка рабочих мест и переговорных",
      "Мытьё полов и ковровых покрытий",
      "Чистка оргтехники и мебели",
      "Уборка кухни и зон отдыха",
      "Санитарная обработка туалетов",
      "Вынос мусора и замена пакетов",
    ],
    price: "от 2 000 ₽",
    icon: (
      <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#22720C" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16M3 21h18M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    slug: "magaziny",
    title: "Уборка магазинов",
    subtitle: "Торговые залы в блеске",
    description:
      "Поддерживаем чистоту торговых залов, складских и служебных помещений. Работаем по индивидуальному графику — ежедневно или несколько раз в неделю, не мешая покупателям.",
    includes: [
      "Мытьё торгового оборудования и витрин",
      "Чистка полов и плинтусов",
      "Обработка входных зон",
      "Уборка складских помещений",
      "Чистка санузлов для персонала",
      "Вынос мусора",
    ],
    price: "от 2 500 ₽",
    icon: (
      <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#22720C" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    slug: "poly-plitka",
    title: "Мытьё полов и чистка плитки",
    subtitle: "Швы и покрытия как новые",
    description:
      "Профессиональная чистка напольных покрытий, плитки и межплиточных швов с применением специальной химии и оборудования. Выводим стойкие загрязнения, плесень и налёт.",
    includes: [
      "Мытьё всех видов напольных покрытий",
      "Чистка межплиточных швов",
      "Удаление известкового налёта",
      "Обработка противогрибковыми средствами",
      "Полировка плитки и ламината",
    ],
    price: "от 100 ₽/м²",
    icon: (
      <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#22720C" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
];

export default function UslugiPage() {
  const { open } = useContext(ModalContext);

  return (
    <main className="pt-24 pb-20 min-h-screen bg-[#141413]">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center">
          <span className="text-[#22720C] text-sm font-semibold uppercase tracking-widest">Наши услуги</span>
          <h1 className="text-4xl sm:text-5xl font-bold mt-3 mb-4">
            Профессиональный <span className="text-[#22720C]">клининг</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Полный спектр клининговых услуг для дома, офиса и бизнеса. Используем безопасные средства и современное оборудование.
          </p>
        </div>
      </div>

      {/* Services list */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
        {services.map((s, i) => (
          <div
            key={s.slug}
            className={`bg-[#313130] rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 ${
              i % 2 === 1 ? "lg:grid-flow-dense" : ""
            }`}
          >
            {/* Icon / visual */}
            <div
              className={`flex items-center justify-center bg-[#1e1e1d] p-12 ${
                i % 2 === 1 ? "lg:col-start-2" : ""
              }`}
            >
              <div className="w-32 h-32 rounded-3xl bg-[#22720C]/10 flex items-center justify-center">
                {s.icon}
              </div>
            </div>

            {/* Content */}
            <div className="p-8 lg:p-10 flex flex-col gap-5">
              <div>
                <p className="text-[#22720C] text-sm font-semibold mb-1">{s.subtitle}</p>
                <h2 className="text-2xl font-bold text-white">{s.title}</h2>
              </div>
              <p className="text-gray-400 leading-relaxed">{s.description}</p>

              <ul className="flex flex-col gap-2">
                {s.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-300">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22720C" strokeWidth={2.5} className="flex-shrink-0 mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between mt-2">
                <span className="text-white font-bold text-xl">{s.price}</span>
                <button
                  onClick={() => open(s.title)}
                  className="bg-[#22720C] hover:bg-[#1a5a09] text-white font-semibold px-6 py-2.5 rounded-full transition-all hover:scale-105"
                >
                  Заказать
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-[#313130] rounded-3xl p-8 sm:p-12 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold mb-3">Не нашли нужную услугу?</h3>
          <p className="text-gray-400 mb-6">Позвоните нам — подберём индивидуальное решение</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => open()}
              className="bg-[#22720C] hover:bg-[#1a5a09] text-white font-semibold px-8 py-3 rounded-full transition-all hover:scale-105"
            >
              Оставить заявку
            </button>
            <a
              href="tel:+79144784010"
              className="border border-[#313130] hover:border-[#22720C] bg-[#3d3d3c] text-white font-semibold px-8 py-3 rounded-full transition-colors"
            >
              +7 914 478-40-10
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
