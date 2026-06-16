"use client";

import { useState, useContext } from "react";
import { ModalContext } from "@/components/ModalContext";

const plans = [
  {
    name: "Поддерживающая",
    freq: "уборка",
    price: "от 1 500",
    unit: "₽ / визит",
    color: "border-[#313130]",
    popular: false,
    includes: [
      "Уборка пыли со всех поверхностей",
      "Мытьё полов",
      "Чистка санузлов",
      "Протирка зеркал",
      "Вынос мусора",
      "Уборка кухни",
    ],
    note: "Скидка 10% при подписке на месяц",
  },
  {
    name: "Генеральная",
    freq: "уборка",
    price: "от 4 000",
    unit: "₽ / уборка",
    color: "border-[#22720C]",
    popular: true,
    includes: [
      "Всё из поддерживающей",
      "Мытьё окон изнутри",
      "Чистка мягкой мебели",
      "Труднодоступные места",
      "Мытьё холодильника",
      "Дезинфекция санузлов",
      "Чистка плинтусов и карнизов",
    ],
    note: "Рекомендуется 1 раз в квартал",
  },
  {
    name: "После ремонта",
    freq: "",
    price: "от 5 000",
    unit: "₽ / объект",
    color: "border-[#313130]",
    popular: false,
    includes: [
      "Удаление строительной пыли",
      "Мытьё окон от краски",
      "Очистка напольных покрытий",
      "Удаление пятен краски",
      "Вынос строительного мусора",
      "Финальная полировка",
    ],
    note: "Цена зависит от площади и состояния",
  },
];

const extras = [
  { name: "Мойка окон", price: "от 800 ₽ / окно" },
  { name: "Уборка балкона / лоджии", price: "от 800 ₽" },
  { name: "Химчистка дивана", price: "от 2 500 ₽" },
  { name: "Химчистка кресла", price: "от 1 500 ₽" },
  { name: "Химчистка матраса", price: "от 2 000 ₽" },
  { name: "Химчистка ковра (м²)", price: "от 200 ₽/м²" },
  { name: "Уборка офиса (до 50 м²)", price: "от 2 000 ₽" },
  { name: "Уборка магазина", price: "от 2 500 ₽" },
  { name: "Мытьё полов и плитки (м²)", price: "от 100 ₽/м²" },
];

export default function TsenyPage() {
  const { open } = useContext(ModalContext);
  const [rooms, setRooms] = useState(1);

  const basePrice = 1500 + (rooms - 1) * 600;

  return (
    <main className="pt-24 pb-20 min-h-screen bg-[#141413]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero */}
        <div className="text-center mb-16">
          <span className="text-[#22720C] text-sm font-semibold uppercase tracking-widest">Стоимость услуг</span>
          <h1 className="text-4xl sm:text-5xl font-bold mt-3 mb-4">
            Честные <span className="text-[#22720C]">цены</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            Прозрачное ценообразование — никаких скрытых доплат. Итоговая стоимость согласовывается до начала работ.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-[#313130] rounded-3xl p-8 flex flex-col gap-5 border-2 ${plan.color} relative ${
                plan.popular ? "shadow-[0_0_40px_rgba(34,114,12,0.15)]" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#22720C] text-white text-xs font-bold px-4 py-1 rounded-full">
                  Популярный выбор
                </div>
              )}
              <div>
                <h3 className="text-white font-bold text-xl">{plan.name}</h3>
                {plan.freq && <p className="text-gray-400 text-sm">{plan.freq}</p>}
              </div>
              <div>
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                <span className="text-gray-400 text-sm ml-1">{plan.unit}</span>
              </div>
              <ul className="flex flex-col gap-2 flex-1">
                {plan.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-300">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22720C" strokeWidth={2.5} className="flex-shrink-0 mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              {plan.note && (
                <p className="text-[#22720C] text-xs border border-[#22720C]/30 rounded-lg px-3 py-2 bg-[#22720C]/5">
                  {plan.note}
                </p>
              )}
              <button
                onClick={() => open(plan.name + " " + plan.freq)}
                className={`w-full py-3 rounded-full font-semibold transition-all hover:scale-105 ${
                  plan.popular
                    ? "bg-[#22720C] hover:bg-[#1a5a09] text-white"
                    : "bg-[#3d3d3c] hover:bg-[#4a4a49] text-white"
                }`}
              >
                Заказать
              </button>
            </div>
          ))}
        </div>

        {/* Calculator */}
        <div className="bg-[#313130] rounded-3xl p-8 sm:p-10 mb-16">
          <h2 className="text-2xl font-bold mb-2">Калькулятор стоимости</h2>
          <p className="text-gray-400 text-sm mb-8">Укажите количество комнат для быстрой оценки поддерживающей уборки</p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
            <div className="flex-1">
              <label className="text-gray-300 text-sm mb-3 block">
                Количество комнат: <span className="text-white font-bold">{rooms}</span>
              </label>
              <input
                type="range"
                min={1}
                max={10}
                value={rooms}
                onChange={(e) => setRooms(Number(e.target.value))}
                className="w-full appearance-none cursor-pointer"
                style={{
                  height: "10px",
                  borderRadius: "9999px",
                  background: `linear-gradient(to right, #22720C 0%, #22720C ${((rooms - 1) / 9) * 100}%, #4a4a49 ${((rooms - 1) / 9) * 100}%, #4a4a49 100%)`,
                }}
              />
              <div className="flex justify-between text-gray-500 text-xs mt-1">
                <span>1</span><span>5</span><span>10</span>
              </div>
            </div>
            <div className="bg-[#1e1e1d] rounded-2xl p-6 text-center min-w-[180px]">
              <p className="text-gray-400 text-sm mb-1">Примерная стоимость</p>
              <p className="text-3xl font-bold text-white">~{basePrice.toLocaleString("ru")} ₽</p>
              <p className="text-gray-500 text-xs mt-1">за 1 визит</p>
            </div>
          </div>
          <button
            onClick={() => open("Поддерживающая уборка")}
            className="mt-6 bg-[#22720C] hover:bg-[#1a5a09] text-white font-semibold px-8 py-3 rounded-full transition-all hover:scale-105"
          >
            Уточнить стоимость
          </button>
        </div>

        {/* Extra services */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">
            Дополнительные <span className="text-[#22720C]">услуги</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {extras.map((ex) => (
              <div
                key={ex.name}
                className="bg-[#313130] rounded-2xl px-6 py-4 flex justify-between items-center w-full sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-10.667px)]"
              >
                <span className="text-gray-300 text-sm">{ex.name}</span>
                <span className="text-[#22720C] font-semibold text-sm whitespace-nowrap ml-4">{ex.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Note + CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#1e1e1d] border border-[#313130] rounded-2xl p-6 flex gap-4">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#22720C" strokeWidth={2} className="flex-shrink-0 mt-0.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-white font-semibold mb-1">Как формируется цена?</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Итоговая стоимость зависит от площади, степени загрязнения и выбранных услуг. Мы всегда согласовываем цену до начала работ — никаких сюрпризов.
              </p>
            </div>
          </div>
          <div className="bg-[#313130] rounded-2xl p-6 flex flex-col justify-between gap-4">
            <div>
              <p className="text-white font-semibold mb-1">Скидки и акции</p>
              <p className="text-gray-400 text-sm">Постоянным клиентам — скидка 10%. При заказе от 3 уборок в месяц — специальные условия.</p>
            </div>
            <button
              onClick={() => open()}
              className="bg-[#22720C] hover:bg-[#1a5a09] text-white font-semibold px-6 py-3 rounded-full transition-all hover:scale-105 text-center"
            >
              Получить расчёт
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
