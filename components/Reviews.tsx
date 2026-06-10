"use client";

import { useState } from "react";

const reviews = [
  {
    name: "Анна П.",
    text: "Заказываю уборку регулярно. Всегда чисто, быстро и без нареканий. Очень довольна!",
    type: "Квартира, Чита",
    rating: 5,
  },
  {
    name: "Игорь С.",
    text: "Отличная команда! Убрали офис после ремонта — всё блестит. Рекомендую!",
    type: "Офис, Чита",
    rating: 5,
  },
  {
    name: "Мария К.",
    text: "Профессионалы своего дела. Приехали вовремя, всё сделали идеально.",
    type: "Дом, Чита",
    rating: 5,
  },
  {
    name: "Сергей Н.",
    text: "Заказывали генеральную уборку после переезда. Всё чисто и аккуратно, цена справедливая.",
    type: "Квартира, Чита",
    rating: 5,
  },
  {
    name: "Елена В.",
    text: "Очень довольна результатом! Особенно понравилась мойка окон — без единого развода.",
    type: "Дом, Чита",
    rating: 5,
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="18" height="18" viewBox="0 0 20 20" fill="#22720C">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Reviews() {
  const [current, setCurrent] = useState(0);
  const visible = 3;

  const prev = () => setCurrent((c) => (c - 1 + reviews.length) % reviews.length);
  const next = () => setCurrent((c) => (c + 1) % reviews.length);

  const visibleReviews = Array.from({ length: visible }, (_, i) => reviews[(current + i) % reviews.length]);

  return (
    <section id="reviews" className="py-20 bg-[#141413]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
          Отзывы наших <span className="text-[#22720C]">клиентов</span>
        </h2>

        <div className="relative">
          {/* Prev button */}
          <button
            onClick={prev}
            className="absolute -left-4 sm:-left-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#313130] hover:bg-[#22720C] text-white flex items-center justify-center transition-colors"
            aria-label="Назад"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-hidden">
            {visibleReviews.map((review, i) => (
              <div
                key={`${current}-${i}`}
                className="bg-[#313130] rounded-2xl p-6 flex flex-col gap-4 animate-fade-in"
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">{review.name}</span>
                  <StarRating count={review.rating} />
                </div>
                <p className="text-gray-400 text-sm leading-relaxed flex-1">{review.text}</p>
                <span className="text-gray-500 text-xs">{review.type}</span>
              </div>
            ))}
          </div>

          {/* Next button */}
          <button
            onClick={next}
            className="absolute -right-4 sm:-right-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#313130] hover:bg-[#22720C] text-white flex items-center justify-center transition-colors"
            aria-label="Вперед"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === current ? "bg-[#22720C] w-6" : "bg-[#313130]"
              }`}
              aria-label={`Отзыв ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
