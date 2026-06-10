"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Неверный пароль");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#0f0f0e] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-white font-bold text-2xl">Amural</span>
            <span className="text-[#22720C] font-bold text-2xl">Admin</span>
          </div>
          <p className="text-gray-500 text-sm">Панель управления заявками</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#1a1a19] border border-[#313130] rounded-2xl p-8 flex flex-col gap-4"
        >
          <h1 className="text-lg font-semibold text-center text-white">Вход</h1>

          <div>
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              className="w-full bg-[#242423] border border-[#313130] rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#22720C] transition-colors"
            />
            {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#22720C] hover:bg-[#1a5a09] disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading && (
              <svg className="animate-spin" width="16" height="16" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            Войти
          </button>
        </form>

        <p className="text-center mt-4">
          <a href="/" className="text-gray-500 hover:text-gray-400 text-xs transition-colors">
            ← Вернуться на сайт
          </a>
        </p>
      </div>
    </div>
  );
}
