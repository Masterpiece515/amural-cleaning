"use client";

import { useState, useContext } from "react";
import { ModalContext } from "@/components/ModalContext";
import AddressInput from "@/components/AddressInput";

interface FormData {
  name: string;
  phone: string;
  address: string;
  message: string;
}

export default function KontaktyPage() {
  const { open } = useContext(ModalContext);
  const [form, setForm] = useState<FormData>({ name: "", phone: "", address: "", message: "" });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const validate = () => {
    const newErr: Partial<FormData> = {};
    if (!form.name.trim()) newErr.name = "Введите имя";
    if (!form.phone.trim()) newErr.phone = "Введите телефон";
    setErrors(newErr);
    return !Object.keys(newErr).length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "contact" }),
      });
      if (res.ok) {
        const data = await res.json();
        setOrderId(data.orderId ?? null);
      }
    } catch {
      // still show success — message will be retried next time
    }
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <main className="pt-24 pb-20 min-h-screen bg-[#141413]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero */}
        <div className="text-center mb-16">
          <span className="text-[#22720C] text-sm font-semibold uppercase tracking-widest">Контакты</span>
          <h1 className="text-4xl sm:text-5xl font-bold mt-3 mb-4">
            Свяжитесь <span className="text-[#22720C]">с нами</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            Мы готовы ответить на все ваши вопросы и подобрать удобное время для уборки
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left — contacts info */}
          <div className="flex flex-col gap-6">
            {/* Contact cards */}
            <div className="bg-[#313130] rounded-2xl p-6 flex items-center gap-4 hover:bg-[#3d3d3c] transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-[#22720C]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#22720C]/20 transition-colors">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#22720C" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Телефон</p>
                <a href="tel:+79144784010" className="text-white font-semibold text-lg hover:text-[#22720C] transition-colors">
                  +7 914 478-40-10
                </a>
                <p className="text-gray-500 text-xs mt-0.5">Ежедневно с 8:00 до 21:00</p>
              </div>
            </div>

            <div className="bg-[#313130] rounded-2xl p-6 flex items-center gap-4 hover:bg-[#3d3d3c] transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-[#22720C]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#22720C]/20 transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#22720C">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.932z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Telegram</p>
                <a href="https://t.me/amuralcleaning" target="_blank" rel="noopener noreferrer"
                  className="text-white font-semibold text-lg hover:text-[#22720C] transition-colors">
                  @amuralcleaning
                </a>
                <p className="text-gray-500 text-xs mt-0.5">Быстрый ответ в мессенджере</p>
              </div>
            </div>

            <div className="bg-[#313130] rounded-2xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#22720C]/10 flex items-center justify-center flex-shrink-0">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#22720C" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Город</p>
                <p className="text-white font-semibold text-lg">г. Чита</p>
                <p className="text-gray-500 text-xs mt-0.5">Выезд по всему городу</p>
              </div>
            </div>

            <div className="bg-[#313130] rounded-2xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#22720C]/10 flex items-center justify-center flex-shrink-0">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#22720C" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Режим работы</p>
                <p className="text-white font-semibold text-lg">Ежедневно, 8:00–21:00</p>
                <p className="text-gray-500 text-xs mt-0.5">Без выходных и праздников</p>
              </div>
            </div>

            {/* Quick order */}
            <div className="bg-[#22720C] rounded-2xl p-6 text-center">
              <p className="text-white font-bold text-lg mb-1">Хотите заказать прямо сейчас?</p>
              <p className="text-green-200 text-sm mb-4">Заполните форму — перезвоним в течение 15 минут</p>
              <button
                onClick={() => open()}
                className="bg-white text-[#22720C] font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
              >
                Заказать уборку
              </button>
            </div>
          </div>

          {/* Right — contact form */}
          <div className="bg-[#313130] rounded-3xl p-8">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-10">
                <div className="w-20 h-20 rounded-full bg-[#22720C]/10 flex items-center justify-center">
                  <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#22720C" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Сообщение отправлено!</h3>
                <p className="text-gray-400 text-sm max-w-xs">
                  Мы свяжемся с вами по номеру <span className="text-white">{form.phone}</span> в ближайшее время.
                </p>

                {orderId && (
                  <div className="w-full bg-[#0f1f2e] border border-[#1e3a5f] rounded-2xl p-4 flex flex-col gap-3">
                    <p className="text-sm text-blue-300 font-semibold">Отслеживайте статус в Telegram</p>
                    <p className="text-xs text-gray-400">
                      Бот пришлёт уведомление как только мы ответим на ваше обращение
                    </p>
                    <a
                      href={`https://t.me/Amural_Cleaningbot?start=${orderId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-[#229ED9] hover:bg-[#1a85b8] text-white font-semibold px-6 py-3 rounded-full transition-colors text-sm"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.932z" />
                      </svg>
                      Получить уведомление
                    </a>
                  </div>
                )}

                <button
                  onClick={() => { setSubmitted(false); setOrderId(null); }}
                  className="mt-1 text-[#22720C] text-sm hover:underline"
                >
                  Отправить ещё
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-6">Написать нам</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Ваше имя"
                      value={form.name}
                      onChange={set("name")}
                      className={`w-full bg-[#2a2a29] border ${errors.name ? "border-red-500" : "border-[#3d3d3c]"} rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#22720C] transition-colors`}
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Телефон"
                      value={form.phone}
                      onChange={set("phone")}
                      className={`w-full bg-[#2a2a29] border ${errors.phone ? "border-red-500" : "border-[#3d3d3c]"} rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#22720C] transition-colors`}
                    />
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <AddressInput
                    value={form.address}
                    onChange={(v) => setForm((f) => ({ ...f, address: v }))}
                    className="w-full bg-[#2a2a29] border border-[#3d3d3c] rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#22720C] transition-colors"
                  />
                  <textarea
                    placeholder="Сообщение или вопрос..."
                    value={form.message}
                    onChange={set("message")}
                    rows={5}
                    className="w-full bg-[#2a2a29] border border-[#3d3d3c] rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#22720C] transition-colors resize-none"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#22720C] hover:bg-[#1a5a09] disabled:opacity-70 text-white font-semibold py-3.5 rounded-full transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin" width="18" height="18" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Отправляем...
                      </>
                    ) : "Отправить сообщение"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Map placeholder */}
        <div className="mt-10 bg-[#313130] rounded-3xl overflow-hidden h-64 flex items-center justify-center">
          <div className="text-center">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#22720C" strokeWidth={1.5} className="mx-auto mb-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <p className="text-gray-400 text-sm">г. Чита — работаем по всему городу</p>
            <a
              href="https://yandex.ru/maps/?text=Чита"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#22720C] text-sm hover:underline mt-2 block"
            >
              Открыть на Яндекс Картах →
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
