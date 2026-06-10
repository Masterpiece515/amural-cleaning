"use client";

const serviceLinks = [
  "Поддерживающая уборка",
  "Генеральная уборка",
  "Уборка после ремонта",
  "Мойка окон и витрин",
  "Уборка офисов",
  "Уборка магазинов",
];

const companyLinks = [
  { label: "О нас", href: "#why-us" },
  { label: "Как мы работаем", href: "#how-it-works" },
  { label: "Отзывы", href: "#reviews" },
  { label: "Контакты", href: "#contacts" },
];

import { useContext } from "react";
import { ModalContext } from "./ModalContext";

export default function Footer() {
  const { open } = useContext(ModalContext);
  const handleNav = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer id="contacts" className="bg-[#141413] border-t border-[#313130]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M8 24 L18 8 L22 10 L14 26 Z" stroke="#22720C" strokeWidth="2" fill="none"/>
                <path d="M8 24 C8 24 6 28 10 28 C14 28 14 24 14 26" stroke="#22720C" strokeWidth="2" fill="none"/>
                <circle cx="24" cy="12" r="2" stroke="#22720C" strokeWidth="1.5" fill="none"/>
                <path d="M21 16 L27 16" stroke="#22720C" strokeWidth="1.5" strokeDasharray="2 1"/>
              </svg>
              <div>
                <span className="text-white font-bold text-base block leading-tight">Amural</span>
                <span className="text-[#22720C] font-bold text-base block leading-tight">Cleaning</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Профессиональная уборка для дома и бизнеса.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Услуги</h4>
            <ul className="flex flex-col gap-2">
              {serviceLinks.map((s) => (
                <li key={s}>
                  <button
                    onClick={() => open()}
                    className="text-gray-400 hover:text-[#22720C] text-sm transition-colors cursor-pointer text-left"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Компания</h4>
            <ul className="flex flex-col gap-2">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleNav(link.href)}
                    className="text-gray-400 hover:text-[#22720C] text-sm transition-colors cursor-pointer text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="text-white font-semibold mb-4">Контакты</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href="tel:+79144784010"
                  className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2"
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#22720C" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +7 914 478-40-10
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/amuralcleaning"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#22720C">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.932z" />
                  </svg>
                  @amuralcleaning
                </a>
              </li>
              <li className="text-gray-400 text-sm flex items-center gap-2">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#22720C" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                г. Чита
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#313130] text-center text-gray-500 text-sm">
          © 2026 Amural Cleaning. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
