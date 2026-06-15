"use client";

import { useState } from "react";
import { useUser } from "./UserContext";

export default function AuthModal() {
  const { authOpen, closeAuth, authTab, setUser, openAuth } = useUser();
  const [tab, setTab] = useState<"login" | "register">(authTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [login, setLogin] = useState({ login: "", password: "" });
  const [reg, setReg] = useState({ name: "", phone: "", email: "", password: "", confirm: "" });

  if (!authOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(login),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error ?? "Ошибка входа"); return; }
    setUser(data.user);
    closeAuth();
    setLogin({ login: "", password: "" });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (reg.password !== reg.confirm) { setError("Пароли не совпадают"); return; }
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: reg.name, phone: reg.phone, email: reg.email, password: reg.password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error ?? "Ошибка регистрации"); return; }
    setUser(data.user);
    closeAuth();
    setReg({ name: "", phone: "", email: "", password: "", confirm: "" });
  };

  const inputClass = "w-full bg-[#2a2a29] border border-[#313130] rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#22720C] transition-colors";

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && closeAuth()}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative bg-[#1e1e1d] border border-[#313130] rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-0">
          <div className="flex bg-[#2a2a29] rounded-xl p-1 gap-1">
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); }}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${tab === t ? "bg-[#22720C] text-white" : "text-gray-400 hover:text-white"}`}
              >
                {t === "login" ? "Войти" : "Регистрация"}
              </button>
            ))}
          </div>
          <button onClick={closeAuth} className="w-9 h-9 rounded-full bg-[#313130] hover:bg-[#3d3d3c] text-gray-400 hover:text-white flex items-center justify-center transition-colors">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {tab === "login" ? (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="text-center mb-2">
                <div className="w-14 h-14 rounded-2xl bg-[#22720C] flex items-center justify-center mx-auto mb-3">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                  </svg>
                </div>
                <p className="text-white font-bold text-lg">Добро пожаловать!</p>
                <p className="text-gray-400 text-sm">Войдите в личный кабинет</p>
              </div>
              <input className={inputClass} placeholder="Телефон или email" value={login.login} onChange={(e) => setLogin((p) => ({ ...p, login: e.target.value }))} />
              <input className={inputClass} type="password" placeholder="Пароль" value={login.password} onChange={(e) => setLogin((p) => ({ ...p, password: e.target.value }))} />
              {error && <p className="text-red-400 text-sm text-center">{error}</p>}
              <button type="submit" disabled={loading} className="w-full bg-[#22720C] hover:bg-[#1a5a09] disabled:opacity-60 text-white font-semibold py-3 rounded-full transition-all">
                {loading ? "Входим..." : "Войти"}
              </button>
              <p className="text-center text-gray-400 text-sm">
                Нет аккаунта?{" "}
                <button type="button" onClick={() => { setTab("register"); setError(""); }} className="text-[#22720C] hover:underline">
                  Зарегистрироваться
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="flex flex-col gap-3">
              <p className="text-white font-bold text-lg text-center mb-1">Создать аккаунт</p>
              <input className={inputClass} placeholder="Ваше имя *" value={reg.name} onChange={(e) => setReg((p) => ({ ...p, name: e.target.value }))} />
              <input className={inputClass} placeholder="Телефон *" type="tel" value={reg.phone} onChange={(e) => setReg((p) => ({ ...p, phone: e.target.value }))} />
              <input className={inputClass} placeholder="Email (необязательно)" type="email" value={reg.email} onChange={(e) => setReg((p) => ({ ...p, email: e.target.value }))} />
              <input className={inputClass} type="password" placeholder="Пароль (мин. 6 символов) *" value={reg.password} onChange={(e) => setReg((p) => ({ ...p, password: e.target.value }))} />
              <input className={inputClass} type="password" placeholder="Повторите пароль *" value={reg.confirm} onChange={(e) => setReg((p) => ({ ...p, confirm: e.target.value }))} />
              {error && <p className="text-red-400 text-sm text-center">{error}</p>}
              <button type="submit" disabled={loading} className="w-full bg-[#22720C] hover:bg-[#1a5a09] disabled:opacity-60 text-white font-semibold py-3 rounded-full transition-all mt-1">
                {loading ? "Создаём аккаунт..." : "Зарегистрироваться"}
              </button>
              <p className="text-center text-gray-400 text-sm">
                Уже есть аккаунт?{" "}
                <button type="button" onClick={() => { setTab("login"); setError(""); }} className="text-[#22720C] hover:underline">
                  Войти
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
