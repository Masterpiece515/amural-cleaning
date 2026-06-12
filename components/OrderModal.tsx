"use client";

import { useState, useEffect, useContext } from "react";

const serviceOptions = [
  "Поддерживающая уборка",
  "Генеральная уборка",
  "Уборка после ремонта",
  "Мойка окон и витрин",
  "Химчистка мебели и ковров",
  "Уборка офисов и коммерческих помещений",
  "Уборка магазинов",
  "Мытьё полов и чистка плитки",
];

interface FormState {
  name: string;
  phone: string;
  service: string;
  address: string;
  date: string;
  message: string;
}

const initialForm: FormState = {
  name: "",
  phone: "",
  service: "",
  address: "",
  date: "",
  message: "",
};

import { ModalContext } from "./ModalContext";
import AddressInput from "./AddressInput";

export default function OrderModal() {
  const { isOpen, close: onClose, defaultService } = useContext(ModalContext);
  const [form, setForm] = useState<FormState>({ ...initialForm, service: defaultService });

  useEffect(() => {
    if (isOpen) setForm((f) => ({ ...f, service: defaultService || f.service }));
  }, [isOpen, defaultService]);
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormState>>({});

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Partial<FormState> = {};
    if (!form.name.trim()) newErrors.name = "Введите имя";
    if (!form.phone.trim()) newErrors.phone = "Введите телефон";
    else if (!/^\+?[\d\s\-()]{10,}$/.test(form.phone)) newErrors.phone = "Некорректный номер";
    if (!form.service) newErrors.service = "Выберите тип уборки";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "order", address: form.address }),
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

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setForm(initialForm);
      setSubmitted(false);
      setOrderId(null);
      setErrors({});
    }, 300);
  };

  const set = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-[#1e1e1d] border border-[#313130] rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="text-2xl font-bold text-white">Оставить заявку</h2>
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-[#313130] hover:bg-[#3d3d3c] text-gray-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {submitted ? (
          <div className="p-6 flex flex-col items-center text-center gap-4 py-10">
            <div className="w-20 h-20 rounded-full bg-[#22720C]/10 flex items-center justify-center">
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#22720C" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Заявка отправлена!</h3>
            <p className="text-gray-400 text-sm">
              Мы свяжемся с вами по номеру <span className="text-white">{form.phone}</span>
            </p>

            {/* Telegram tracking */}
            {orderId && (
              <div className="w-full bg-[#0f1f2e] border border-[#1e3a5f] rounded-2xl p-4 flex flex-col gap-3">
                <p className="text-sm text-blue-300 font-semibold">Отслеживайте статус в Telegram</p>
                <p className="text-xs text-gray-400">
                  Нажмите кнопку ниже — бот пришлёт уведомление как только мы примем вашу заявку
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
              onClick={handleClose}
              className="mt-1 text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
              Закрыть
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Имя"
                  value={form.name}
                  onChange={set("name")}
                  className={`w-full bg-[#2a2a29] border ${
                    errors.name ? "border-red-500" : "border-[#313130]"
                  } rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#22720C] transition-colors`}
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Телефон"
                  value={form.phone}
                  onChange={set("phone")}
                  className={`w-full bg-[#2a2a29] border ${
                    errors.phone ? "border-red-500" : "border-[#313130]"
                  } rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#22720C] transition-colors`}
                />
                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>

            {/* Address with autocomplete */}
            <AddressInput
              value={form.address}
              onChange={(v) => setForm((f) => ({ ...f, address: v }))}
              className="w-full bg-[#2a2a29] border border-[#313130] rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#22720C] transition-colors"
            />

            {/* Service & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <select
                  value={form.service}
                  onChange={set("service")}
                  className={`w-full bg-[#2a2a29] border ${
                    errors.service ? "border-red-500" : "border-[#313130]"
                  } rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#22720C] transition-colors appearance-none ${
                    form.service ? "text-white" : "text-gray-500"
                  }`}
                >
                  <option value="" disabled>Тип уборки</option>
                  {serviceOptions.map((s) => (
                    <option key={s} value={s} className="text-white bg-[#2a2a29]">
                      {s}
                    </option>
                  ))}
                </select>
                {errors.service && <p className="text-red-400 text-xs mt-1">{errors.service}</p>}
              </div>
              <div>
                <input
                  type="date"
                  value={form.date}
                  onChange={set("date")}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full bg-[#2a2a29] border border-[#313130] rounded-xl px-4 py-3 text-sm text-gray-400 focus:outline-none focus:border-[#22720C] transition-colors [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Message */}
            <textarea
              placeholder="Сообщение..."
              value={form.message}
              onChange={set("message")}
              rows={4}
              className="w-full bg-[#2a2a29] border border-[#313130] rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#22720C] transition-colors resize-none"
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#22720C] hover:bg-[#1a5a09] disabled:opacity-70 text-white font-semibold py-3.5 rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Отправляем...
                </>
              ) : (
                "Отправить"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
