"use client";

import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModalContext } from "./ModalContext";
import { useUser } from "./UserContext";

const navLinks = [
  { label: "Услуги", href: "/uslugi" },
  { label: "О нас", href: "/o-nas" },
  { label: "Цены", href: "/tseny" },
  { label: "Отзывы", href: "/#reviews" },
  { label: "Контакты", href: "/kontakty" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { open } = useContext(ModalContext);
  const { user, logout, openAuth } = useUser();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#1e1e1d]/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="10" fill="#22720C"/>
              <path d="M18 8 C18 8 12 15.5 12 19.5 a6 6 0 0012 0 C24 15.5 18 8 18 8z" fill="white"/>
              <path d="M22.5 14.5 L24.5 12.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.75"/>
              <path d="M25 17.5 L27 17.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
              <circle cx="24" cy="12" r="1" fill="white" opacity="0.6"/>
            </svg>
            <div>
              <span className="text-white font-bold text-base leading-tight block">Amural</span>
              <span className="text-[#22720C] font-bold text-base leading-tight block">Cleaning</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href ? "text-[#22720C]" : "text-gray-300 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Phone + auth */}
          <div className="hidden lg:flex items-center gap-3">
            <a href="tel:+79144784010" className="flex items-center gap-2 bg-[#22720C] hover:bg-[#1a5a09] text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors">
              <PhoneIcon />
              +7 914 478-40-10
            </a>
            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenuOpen((v) => !v)} className="flex items-center gap-2 bg-[#313130] hover:bg-[#3d3d3c] text-white text-sm font-semibold px-3 py-2 rounded-full transition-colors">
                  <div className="w-6 h-6 rounded-full bg-[#22720C] flex items-center justify-center text-xs font-bold">
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">{user.name}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-[#1e1e1d] border border-[#313130] rounded-2xl shadow-xl overflow-hidden min-w-[160px] z-50">
                    <Link href="/profil" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-[#313130] transition-colors">
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                      Мой профиль
                    </Link>
                    <button onClick={() => { logout(); setUserMenuOpen(false); }} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-[#313130] transition-colors">
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                      Выйти
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => openAuth("login")} className="flex items-center gap-1.5 border border-[#313130] hover:border-[#22720C] text-gray-300 hover:text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                Войти
              </button>
            )}
          </div>

          {/* Tablet/mobile: quick call + burger */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href="tel:+79144784010"
              aria-label="Позвонить"
              className="w-10 h-10 rounded-full bg-[#22720C] hover:bg-[#1a5a09] text-white flex items-center justify-center transition-colors flex-shrink-0"
            >
              <PhoneIcon />
            </a>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white p-2"
              aria-label="Меню"
            >
              {menuOpen ? (
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile/tablet menu */}
        {menuOpen && (
          <div className="lg:hidden bg-[#1e1e1d] rounded-xl mt-1 mb-2 p-4 flex flex-col gap-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={`text-sm font-medium py-2 border-b border-[#313130] transition-colors ${
                    pathname === link.href ? "text-[#22720C]" : "text-gray-300"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            {user ? (
              <Link
                href="/profil"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 bg-[#313130] text-white text-sm font-semibold px-4 py-3 rounded-full mt-2"
              >
                <div className="w-5 h-5 rounded-full bg-[#22720C] flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                  {user.name[0].toUpperCase()}
                </div>
                Мой профиль
              </Link>
            ) : (
              <button
                onClick={() => { closeMenu(); openAuth("login"); }}
                className="flex items-center justify-center gap-2 border border-[#313130] text-white text-sm font-semibold px-4 py-3 rounded-full mt-2"
              >
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                Войти
              </button>
            )}
            <a
              href="tel:+79144784010"
              className="flex items-center justify-center gap-2 bg-[#22720C] text-white text-sm font-semibold px-4 py-3 rounded-full"
            >
              <PhoneIcon />
              +7 914 478-40-10
            </a>
            <button
              onClick={() => { closeMenu(); open(); }}
              className="flex items-center justify-center bg-[#3d3d3c] text-white text-sm font-semibold px-4 py-3 rounded-full"
            >
              Заказать уборку
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}
