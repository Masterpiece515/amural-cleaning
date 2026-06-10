"use client";

import { useState, useCallback } from "react";

export type OrderStatus = "new" | "accepted" | "rejected" | "completed";
type OrderSource = "order" | "contact";

interface Order {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  service: string;
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

const STATUS_META: Record<OrderStatus, { label: string; color: string; dot: string; bg: string }> = {
  new:       { label: "Новая",      color: "text-yellow-400", dot: "bg-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/30" },
  accepted:  { label: "Принята",    color: "text-green-400",  dot: "bg-green-400",  bg: "bg-green-400/10 border-green-400/30"  },
  rejected:  { label: "Отклонена",  color: "text-red-400",    dot: "bg-red-400",    bg: "bg-red-400/10 border-red-400/30"      },
  completed: { label: "Завершена",  color: "text-blue-400",   dot: "bg-blue-400",   bg: "bg-blue-400/10 border-blue-400/30"   },
};

type Tab = "all" | OrderStatus;

export default function AdminDashboard({ initialOrders, initialStats }: Props) {
  const [orders, setOrders]   = useState<Order[]>(initialOrders);
  const [stats, setStats]     = useState<Stats>(initialStats);
  const [tab, setTab]         = useState<Tab>("all");
  const [updating, setUpdating] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [tgOpen, setTgOpen]   = useState(false);
  const [polling, setPolling] = useState(false);
  const [pollMsg, setPollMsg] = useState("");

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

  const changeStatus = async (orderId: string, status: OrderStatus) => {
    setUpdating(orderId);
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: orderId, status }),
    });
    if (res.ok) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
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

  const visible = tab === "all" ? orders : orders.filter((o) => o.status === tab);

  return (
    <div className="fixed inset-0 z-[200] bg-[#0f0f0e] overflow-y-auto text-white">
      {/* ── Header ── */}
      <header className="sticky top-0 z-10 bg-[#141413] border-b border-[#2a2a29]">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm">
            <span className="text-white">Amural</span>
            <span className="text-[#22720C]">Admin</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => { setTgOpen((v) => !v); setPollMsg(""); }}
              className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg transition-colors ${tgOpen ? "bg-[#22720C]/20 text-[#22720C]" : "text-gray-400 hover:text-white hover:bg-[#2a2a29]"}`}
            >
              <IconTg />
              Telegram
            </button>
            <a
              href="/"
              className="text-xs text-gray-400 hover:text-white px-3 py-2 rounded-lg hover:bg-[#2a2a29] transition-colors"
            >
              Сайт
            </a>
            <button
              onClick={logout}
              className="text-xs text-gray-400 hover:text-red-400 px-3 py-2 rounded-lg hover:bg-[#2a2a29] transition-colors"
            >
              Выйти
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6">

        {/* ── Telegram panel ── */}
        {tgOpen && (
          <div className="bg-[#1a1a19] border border-[#313130] rounded-2xl p-5">
            <p className="text-sm font-semibold mb-4 text-white">Telegram — управление ботом</p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={pollTelegram}
                disabled={polling}
                className="flex items-center gap-2 bg-[#2a2a29] hover:bg-[#313130] disabled:opacity-50 text-sm px-4 py-2.5 rounded-xl transition-colors"
              >
                {polling ? <Spinner /> : <IconRefresh />}
                Проверить обновления
              </button>
              <button
                onClick={setWebhook}
                className="flex items-center gap-2 bg-[#2a2a29] hover:bg-[#313130] text-sm px-4 py-2.5 rounded-xl transition-colors"
              >
                <IconLink />
                Установить Webhook
              </button>
            </div>
            {pollMsg && (
              <p className="text-xs text-gray-400 mt-3 font-mono break-all">{pollMsg}</p>
            )}
            <div className="flex items-center gap-2 mt-3">
              <a
                href="https://t.me/Amural_Cleaningbot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#22720C] hover:text-green-400 transition-colors"
              >
                <IconTg />
                @Amural_Cleaningbot — открыть бота
              </a>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Локально: нажмите «Проверить обновления» чтобы обработать нажатия кнопок.
              При деплое: нажмите «Установить Webhook» один раз.
            </p>
          </div>
        )}

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
          {[
            { label: "Всего",        value: stats.total,     color: "text-white"       },
            { label: "Новые",        value: stats.new,       color: "text-yellow-400"  },
            { label: "Принятые",     value: stats.accepted,  color: "text-green-400"   },
            { label: "Завершённые",  value: stats.completed, color: "text-blue-400"    },
            { label: "Отклонённые",  value: stats.rejected,  color: "text-red-400"     },
            { label: "Сегодня",      value: stats.today,     color: "text-purple-400"  },
          ].map((s) => (
            <div key={s.label} className="bg-[#1a1a19] border border-[#2a2a29] rounded-2xl p-4 text-center">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-gray-500 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Tabs + refresh ── */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-1 bg-[#1a1a19] border border-[#2a2a29] p-1 rounded-xl">
            {([ ["all", "Все"], ["new", `Новые${stats.new ? ` (${stats.new})` : ""}`], ["accepted", "Принятые"], ["completed", "Завершённые"], ["rejected", "Отклонённые"] ] as [Tab, string][]).map(([v, label]) => (
              <button
                key={v}
                onClick={() => setTab(v)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === v ? "bg-[#22720C] text-white" : "text-gray-400 hover:text-white"}`}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={refresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <span className={refreshing ? "animate-spin inline-block" : "inline-block"}><IconRefresh /></span>
            Обновить
          </button>
        </div>

        {/* ── Orders ── */}
        {visible.length === 0 ? (
          <div className="text-center py-24 text-gray-600">
            <p className="text-4xl mb-3">📭</p>
            <p>Заявок нет</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {visible.map((order) => {
              const m = STATUS_META[order.status];
              const busy = updating === order.id;
              return (
                <div
                  key={order.id}
                  className="bg-[#1a1a19] border border-[#2a2a29] rounded-2xl p-5 hover:border-[#3d3d3c] transition-colors"
                >
                  {/* Row 1: status + type + time */}
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${m.dot}`} />
                      <span className={`text-xs font-bold tracking-wide ${m.color}`}>{m.label.toUpperCase()}</span>
                      <span className="text-gray-600 text-xs">
                        {order.source === "order" ? "· заявка на уборку" : "· обращение"}
                      </span>
                    </div>
                    <span className="text-gray-600 text-xs">
                      {new Date(order.createdAt).toLocaleString("ru-RU", {
                        day: "2-digit", month: "2-digit", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {/* Row 2: client info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-semibold">{order.name}</p>
                        {order.customerTelegramId && (
                          <span title="Клиент подключил Telegram-уведомления" className="inline-flex items-center gap-1 text-[10px] text-[#229ED9] bg-[#229ED9]/10 border border-[#229ED9]/30 px-1.5 py-0.5 rounded-full">
                            <IconTg /> TG
                          </span>
                        )}
                      </div>
                      <a
                        href={`tel:${order.phone}`}
                        className="text-[#22720C] hover:text-green-400 text-sm transition-colors"
                      >
                        {order.phone}
                      </a>
                    </div>
                    <div className="text-sm text-gray-400 flex flex-col gap-0.5">
                      {order.service && <span>🏷 {order.service}</span>}
                      {order.date    && <span>📅 {order.date}</span>}
                    </div>
                  </div>

                  {order.message && (
                    <p className="text-sm text-gray-400 bg-[#141413] rounded-xl px-4 py-2.5 mb-3">
                      {order.message}
                    </p>
                  )}

                  {/* Actions */}
                  {order.status === "new" && (
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => changeStatus(order.id, "accepted")}
                        disabled={busy}
                        className="flex items-center gap-1.5 bg-green-900/30 hover:bg-green-900/50 border border-green-800/40 text-green-400 text-sm px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
                      >
                        {busy ? <Spinner /> : "✅"} Принять
                      </button>
                      <button
                        onClick={() => changeStatus(order.id, "rejected")}
                        disabled={busy}
                        className="flex items-center gap-1.5 bg-red-900/30 hover:bg-red-900/50 border border-red-800/40 text-red-400 text-sm px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
                      >
                        {busy ? <Spinner /> : "❌"} Отклонить
                      </button>
                    </div>
                  )}
                  {order.status === "accepted" && (
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => changeStatus(order.id, "completed")}
                        disabled={busy}
                        className="flex items-center gap-1.5 bg-blue-900/30 hover:bg-blue-900/50 border border-blue-800/40 text-blue-400 text-sm px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
                      >
                        {busy ? <Spinner /> : "🏁"} Завершить уборку
                      </button>
                      <button
                        onClick={() => changeStatus(order.id, "rejected")}
                        disabled={busy}
                        className="flex items-center gap-1.5 bg-red-900/30 hover:bg-red-900/50 border border-red-800/40 text-red-400 text-sm px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
                      >
                        {busy ? <Spinner /> : "❌"} Отклонить
                      </button>
                    </div>
                  )}
                  {(order.status === "completed" || order.status === "rejected") && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => changeStatus(order.id, "new")}
                        disabled={busy}
                        className="text-xs text-gray-500 hover:text-gray-300 transition-colors disabled:opacity-50"
                      >
                        Вернуть в новые
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
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
