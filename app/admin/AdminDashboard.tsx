"use client";

import { useState, useCallback, useEffect, useRef } from "react";

export type OrderStatus = "new" | "accepted" | "rejected" | "completed";
type OrderSource = "order" | "contact";

interface Order {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  service: string;
  address?: string;
  date: string;
  message: string;
  source: OrderSource;
  status: OrderStatus;
  customerTelegramId?: string;
}

interface Stats {
  total: number;
  new: number;
  accepted: number;
  rejected: number;
  completed: number;
  today: number;
}

interface Props {
  initialOrders: Order[];
  initialStats: Stats;
}

const STATUS_META = {
  new:       { label: "Новая",     color: "text-amber-400",   dot: "bg-amber-400",   bg: "bg-amber-400/10 border-amber-400/30"    },
  accepted:  { label: "Принята",   color: "text-emerald-400", dot: "bg-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/30" },
  rejected:  { label: "Отклонена", color: "text-red-400",     dot: "bg-red-400",     bg: "bg-red-400/10 border-red-400/30"        },
  completed: { label: "Завершена", color: "text-sky-400",     dot: "bg-sky-400",     bg: "bg-sky-400/10 border-sky-400/30"        },
} as const;

type Tab = "all" | OrderStatus;

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "только что";
  if (m < 60) return `${m} мин назад`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} ч назад`;
  const d = Math.floor(h / 24);
  if (d === 1) return "вчера";
  if (d < 7) return `${d} дн назад`;
  return new Date(iso).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" });
}

export default function AdminDashboard({ initialOrders, initialStats }: Props) {
  const [orders, setOrders]         = useState<Order[]>(initialOrders);
  const [stats, setStats]           = useState<Stats>(initialStats);
  const [tab, setTab]               = useState<Tab>("all");
  const [search, setSearch]         = useState("");
  const [updating, setUpdating]     = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [tgOpen, setTgOpen]         = useState(false);
  const [polling, setPolling]       = useState(false);
  const [pollMsg, setPollMsg]       = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [detail, setDetail]         = useState<Order | null>(null);
  const [copied, setCopied]         = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    const res = await fetch("/api/admin/orders");
    if (res.ok) {
      const d = await res.json();
      setOrders(d.orders);
      setStats(d.stats);
    }
    setRefreshing(false);
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      timerRef.current = setInterval(refresh, 30000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [autoRefresh, refresh]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setDetail(null); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const changeStatus = async (orderId: string, status: OrderStatus) => {
    setUpdating(orderId);
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: orderId, status }),
    });
    if (res.ok) {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
      setDetail((d) => d?.id === orderId ? { ...d, status } : d);
      setStats((prev) => {
        const old = orders.find((o) => o.id === orderId);
        if (!old) return prev;
        return {
          ...prev,
          [old.status]: Math.max(0, prev[old.status] - 1),
          [status]: prev[status] + 1,
        };
      });
    }
    setUpdating(null);
  };

  const copyPhone = async (phone: string, e: React.MouseEvent) => {
    e.preventDefault();
    await navigator.clipboard.writeText(phone);
    setCopied(phone);
    setTimeout(() => setCopied(null), 2000);
  };

  const pollTelegram = async () => {
    setPolling(true);
    setPollMsg("");
    const res = await fetch("/api/telegram/poll", { method: "POST" });
    if (res.ok) {
      const d = await res.json();
      setPollMsg(`Обработано обновлений: ${d.processed}`);
      await refresh();
    } else {
      setPollMsg("Ошибка при опросе Telegram");
    }
    setPolling(false);
  };

  const setWebhook = async () => {
    const res = await fetch("/api/telegram/set-webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: window.location.origin }),
    });
    const d = await res.json();
    setPollMsg(d.ok ? `Webhook установлен: ${d.webhookUrl}` : `Ошибка: ${d.description ?? "unknown"}`);
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  const filtered = orders.filter((o) => {
    if (tab !== "all" && o.status !== tab) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        o.name.toLowerCase().includes(q) ||
        o.phone.includes(q) ||
        o.service.toLowerCase().includes(q) ||
        (o.address?.toLowerCase().includes(q) ?? false)
      );
    }
    return true;
  });

  const tabCounts: Record<Tab, number> = {
    all: orders.length,
    new: stats.new,
    accepted: stats.accepted,
    completed: stats.completed,
    rejected: stats.rejected,
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#0f0f0e] overflow-y-auto text-white">

      {/* ── Header ── */}
      <header className="sticky top-0 z-10 bg-[#0f0f0e]/95 backdrop-blur border-b border-[#1a1a19]">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="font-bold text-sm flex items-center gap-1.5">
              <span>Amural</span>
              <span className="text-[#22720C]">Admin</span>
            </div>
            {stats.new > 0 && (
              <span className="bg-amber-400 text-black text-[11px] font-bold px-2 py-0.5 rounded-full">
                {stats.new} новых
              </span>
            )}
          </div>

          {/* Search (desktop) */}
          <div className="flex-1 max-w-xs hidden sm:block">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Поиск по имени, телефону, услуге..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#1a1a19] border border-[#242423] rounded-xl pl-8 pr-8 py-1.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#22720C]/50 transition-colors"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors text-xs">
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setAutoRefresh((v) => !v)}
              title={autoRefresh ? "Выключить авто-обновление" : "Авто-обновление каждые 30 секунд"}
              className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg transition-colors ${autoRefresh ? "text-[#22720C] bg-[#22720C]/10" : "text-gray-500 hover:text-white hover:bg-[#1a1a19]"}`}
            >
              <span className={autoRefresh ? "animate-pulse" : ""}>⬤</span>
              <span className="hidden sm:inline">Live</span>
            </button>
            <button
              onClick={() => { setTgOpen((v) => !v); setPollMsg(""); }}
              className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg transition-colors ${tgOpen ? "bg-[#22720C]/20 text-[#22720C]" : "text-gray-500 hover:text-white hover:bg-[#1a1a19]"}`}
            >
              <IconTg />
              <span className="hidden sm:inline">TG</span>
            </button>
            <a href="/" className="text-xs text-gray-500 hover:text-white px-3 py-2 rounded-lg hover:bg-[#1a1a19] transition-colors hidden sm:block">
              Сайт ↗
            </a>
            <button onClick={logout} className="text-xs text-gray-500 hover:text-red-400 px-3 py-2 rounded-lg hover:bg-[#1a1a19] transition-colors">
              Выйти
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col gap-5">

        {/* ── Telegram panel ── */}
        {tgOpen && (
          <div className="bg-[#1a1a19] border border-[#242423] rounded-2xl p-5">
            <p className="text-sm font-semibold mb-4">Telegram — управление ботом</p>
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={pollTelegram}
                disabled={polling}
                className="flex items-center gap-2 bg-[#242423] hover:bg-[#2a2a29] disabled:opacity-50 text-sm px-4 py-2.5 rounded-xl transition-colors"
              >
                {polling ? <Spinner /> : <IconRefresh />}
                Проверить обновления
              </button>
              <button
                onClick={setWebhook}
                className="flex items-center gap-2 bg-[#242423] hover:bg-[#2a2a29] text-sm px-4 py-2.5 rounded-xl transition-colors"
              >
                <IconLink />
                Установить Webhook
              </button>
              <a
                href="https://t.me/Amural_Cleaningbot"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#229ED9]/10 hover:bg-[#229ED9]/20 border border-[#229ED9]/20 text-[#229ED9] text-sm px-4 py-2.5 rounded-xl transition-colors"
              >
                <IconTg />
                @Amural_Cleaningbot
              </a>
            </div>
            {pollMsg && (
              <p className="text-xs text-gray-400 mt-3 font-mono break-all bg-[#141413] px-3 py-2 rounded-xl">{pollMsg}</p>
            )}
            <p className="text-xs text-gray-600 mt-3">
              Локально: нажмите «Проверить обновления». При деплое: установите Webhook один раз.
            </p>
          </div>
        )}

        {/* ── Stats ── */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {[
            { label: "Всего",       value: stats.total,     color: "text-white"       },
            { label: "Новые",       value: stats.new,       color: "text-amber-400"   },
            { label: "Принятые",    value: stats.accepted,  color: "text-emerald-400" },
            { label: "Завершённые", value: stats.completed, color: "text-sky-400"     },
            { label: "Отклонённые", value: stats.rejected,  color: "text-red-400"     },
            { label: "Сегодня",     value: stats.today,     color: "text-purple-400"  },
          ].map((s) => (
            <div key={s.label} className="bg-[#1a1a19] border border-[#1e1e1d] rounded-2xl p-3 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-gray-600 text-[10px] mt-0.5 uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Mobile search ── */}
        <div className="sm:hidden relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Поиск..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1a1a19] border border-[#242423] rounded-xl pl-8 pr-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#22720C]/50 transition-colors"
          />
        </div>

        {/* ── Tabs + refresh ── */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex gap-1 bg-[#1a1a19] border border-[#1e1e1d] p-1 rounded-xl overflow-x-auto">
            {([
              ["all",       "Все"],
              ["new",       "Новые"],
              ["accepted",  "Принятые"],
              ["completed", "Завершённые"],
              ["rejected",  "Отклонённые"],
            ] as [Tab, string][]).map(([v, label]) => (
              <button
                key={v}
                onClick={() => setTab(v)}
                className={`relative flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${tab === v ? "bg-[#22720C] text-white" : "text-gray-500 hover:text-white"}`}
              >
                {label}
                {tabCounts[v] > 0 && (
                  <span className={`ml-1 text-xs font-bold ${tab === v ? "text-green-200" : "text-gray-600"}`}>
                    {tabCounts[v]}
                  </span>
                )}
              </button>
            ))}
          </div>
          <button
            onClick={refresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors disabled:opacity-50 flex-shrink-0"
          >
            <span className={refreshing ? "animate-spin inline-block" : "inline-block"}><IconRefresh /></span>
            Обновить
          </button>
        </div>

        {/* ── Orders list ── */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-sm">{search ? "Ничего не найдено" : "Заявок нет"}</p>
            {search && (
              <button onClick={() => setSearch("")} className="mt-2 text-xs text-[#22720C] hover:text-green-400 transition-colors">
                Сбросить поиск
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {filtered.map((order) => {
              const m = STATUS_META[order.status];
              const busy = updating === order.id;
              return (
                <div
                  key={order.id}
                  className="bg-[#1a1a19] border border-[#1e1e1d] hover:border-[#2a2a29] rounded-2xl p-4 sm:p-5 transition-colors"
                >
                  {/* Row 1: status + time */}
                  <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold border px-2.5 py-1 rounded-full ${m.bg} ${m.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${m.dot}`} />
                        {m.label.toUpperCase()}
                      </span>
                      <span className="text-gray-600 text-xs">
                        {order.source === "order" ? "уборка" : "обращение"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className="text-gray-600 text-xs cursor-default"
                        title={new Date(order.createdAt).toLocaleString("ru-RU", {
                          day: "2-digit", month: "2-digit", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      >
                        {relativeTime(order.createdAt)}
                      </span>
                      <button
                        onClick={() => setDetail(order)}
                        className="text-xs text-gray-600 hover:text-[#22720C] transition-colors"
                      >
                        Подробнее →
                      </button>
                    </div>
                  </div>

                  {/* Row 2: client + service */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-white font-semibold">{order.name}</span>
                        {order.customerTelegramId && (
                          <span className="text-[#229ED9] text-[10px] bg-[#229ED9]/10 border border-[#229ED9]/20 px-1.5 py-0.5 rounded-full">TG</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 group">
                        <a
                          href={`tel:${order.phone}`}
                          className="text-[#22720C] hover:text-green-400 text-sm transition-colors hover:underline"
                        >
                          {order.phone}
                        </a>
                        <button
                          onClick={(e) => copyPhone(order.phone, e)}
                          className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-gray-300 transition-all text-[10px]"
                        >
                          {copied === order.phone ? "✓ скопировано" : "копировать"}
                        </button>
                      </div>
                    </div>
                    <div className="text-right flex flex-col gap-0.5">
                      {order.service && <span className="text-gray-300 text-xs">{order.service}</span>}
                      {order.date    && <span className="text-gray-500 text-xs">📅 {order.date}</span>}
                    </div>
                  </div>

                  {order.address && (
                    <p className="text-xs text-gray-500 mb-3 flex items-center gap-1.5">
                      <IconPin />
                      {order.address}
                    </p>
                  )}

                  {order.message && (
                    <p className="text-xs text-gray-500 bg-[#141413] rounded-xl px-3 py-2 mb-3 line-clamp-2">
                      {order.message}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 flex-wrap">
                    {order.status === "new" && (
                      <>
                        <ActionBtn onClick={() => changeStatus(order.id, "accepted")} busy={busy} color="green">✅ Принять</ActionBtn>
                        <ActionBtn onClick={() => changeStatus(order.id, "rejected")} busy={busy} color="red">❌ Отклонить</ActionBtn>
                      </>
                    )}
                    {order.status === "accepted" && (
                      <>
                        <ActionBtn onClick={() => changeStatus(order.id, "completed")} busy={busy} color="blue">🏁 Завершить</ActionBtn>
                        <ActionBtn onClick={() => changeStatus(order.id, "rejected")} busy={busy} color="red">❌ Отклонить</ActionBtn>
                      </>
                    )}
                    {(order.status === "completed" || order.status === "rejected") && (
                      <button
                        onClick={() => changeStatus(order.id, "new")}
                        disabled={busy}
                        className="text-xs text-gray-600 hover:text-gray-300 transition-colors disabled:opacity-50"
                      >
                        Вернуть в новые
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Detail modal ── */}
      {detail && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setDetail(null)}
        >
          <div className="bg-[#1a1a19] border border-[#2a2a29] rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#242423]">
              <div className="flex items-center gap-2.5">
                <span className={`w-2.5 h-2.5 rounded-full ${STATUS_META[detail.status].dot}`} />
                <span className={`font-bold ${STATUS_META[detail.status].color}`}>
                  {STATUS_META[detail.status].label}
                </span>
                <span className="text-gray-600 text-sm">
                  · {detail.source === "order" ? "заявка на уборку" : "обращение"}
                </span>
              </div>
              <button
                onClick={() => setDetail(null)}
                className="w-8 h-8 rounded-full bg-[#242423] hover:bg-[#2a2a29] text-gray-400 hover:text-white flex items-center justify-center transition-colors text-sm"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-5 flex flex-col gap-4">
              {/* Client block */}
              <div className="bg-[#141413] rounded-2xl p-4">
                <p className="text-gray-600 text-[10px] uppercase tracking-widest mb-2">Клиент</p>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white font-semibold text-lg">{detail.name}</p>
                  {detail.customerTelegramId && (
                    <span className="text-[#229ED9] text-[10px] bg-[#229ED9]/10 border border-[#229ED9]/20 px-2 py-0.5 rounded-full">TG привязан</span>
                  )}
                </div>
                <a href={`tel:${detail.phone}`} className="text-[#22720C] hover:text-green-400 transition-colors text-sm">
                  {detail.phone}
                </a>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {detail.service && (
                  <div className="bg-[#141413] rounded-xl p-3">
                    <p className="text-gray-600 text-[10px] uppercase tracking-widest mb-1">Услуга</p>
                    <p className="text-white text-sm">{detail.service}</p>
                  </div>
                )}
                {detail.date && (
                  <div className="bg-[#141413] rounded-xl p-3">
                    <p className="text-gray-600 text-[10px] uppercase tracking-widest mb-1">Дата уборки</p>
                    <p className="text-white text-sm">{detail.date}</p>
                  </div>
                )}
                {detail.address && (
                  <div className="bg-[#141413] rounded-xl p-3 col-span-2">
                    <p className="text-gray-600 text-[10px] uppercase tracking-widest mb-1">Адрес</p>
                    <p className="text-white text-sm">{detail.address}</p>
                  </div>
                )}
                <div className="bg-[#141413] rounded-xl p-3">
                  <p className="text-gray-600 text-[10px] uppercase tracking-widest mb-1">Создана</p>
                  <p className="text-white text-sm">
                    {new Date(detail.createdAt).toLocaleString("ru-RU", {
                      day: "2-digit", month: "2-digit", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="bg-[#141413] rounded-xl p-3">
                  <p className="text-gray-600 text-[10px] uppercase tracking-widest mb-1">Тип</p>
                  <p className="text-white text-sm">{detail.source === "order" ? "Заявка" : "Обращение"}</p>
                </div>
              </div>

              {detail.message && (
                <div className="bg-[#141413] rounded-2xl p-4">
                  <p className="text-gray-600 text-[10px] uppercase tracking-widest mb-2">Сообщение</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{detail.message}</p>
                </div>
              )}

              {/* Actions in modal */}
              <div className="flex gap-2 flex-wrap">
                {detail.status === "new" && (
                  <>
                    <ActionBtn onClick={() => changeStatus(detail.id, "accepted")} busy={updating === detail.id} color="green">✅ Принять</ActionBtn>
                    <ActionBtn onClick={() => changeStatus(detail.id, "rejected")} busy={updating === detail.id} color="red">❌ Отклонить</ActionBtn>
                  </>
                )}
                {detail.status === "accepted" && (
                  <>
                    <ActionBtn onClick={() => changeStatus(detail.id, "completed")} busy={updating === detail.id} color="blue">🏁 Завершить</ActionBtn>
                    <ActionBtn onClick={() => changeStatus(detail.id, "rejected")} busy={updating === detail.id} color="red">❌ Отклонить</ActionBtn>
                  </>
                )}
                {(detail.status === "completed" || detail.status === "rejected") && (
                  <button
                    onClick={() => changeStatus(detail.id, "new")}
                    disabled={updating === detail.id}
                    className="text-xs text-gray-600 hover:text-gray-300 transition-colors disabled:opacity-50"
                  >
                    Вернуть в новые
                  </button>
                )}
              </div>

              <p className="text-gray-700 text-[10px] font-mono">ID: {detail.id}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ActionBtn({
  onClick, busy, color, children,
}: {
  onClick: () => void;
  busy: boolean;
  color: "green" | "red" | "blue";
  children: React.ReactNode;
}) {
  const styles = {
    green: "bg-emerald-900/30 hover:bg-emerald-900/50 border-emerald-800/40 text-emerald-400",
    red:   "bg-red-900/30 hover:bg-red-900/50 border-red-800/40 text-red-400",
    blue:  "bg-sky-900/30 hover:bg-sky-900/50 border-sky-800/40 text-sky-400",
  };
  return (
    <button
      onClick={onClick}
      disabled={busy}
      className={`flex items-center gap-1.5 border text-sm px-4 py-2 rounded-xl transition-colors disabled:opacity-50 ${styles[color]}`}
    >
      {busy && <Spinner />}
      {children}
    </button>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin" width="14" height="14" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function IconRefresh() {
  return (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}

function IconTg() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.932z" />
    </svg>
  );
}

function IconLink() {
  return (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}

function IconPin() {
  return (
    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="flex-shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
