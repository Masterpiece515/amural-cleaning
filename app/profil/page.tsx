"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/UserContext";
import Link from "next/link";

interface OrderRow {
  id: string;
  createdAt: string;
  service: string;
  address: string;
  date: string;
  status: string;
}

const STATUS_META: Record<string, { label: string; color: string; dot: string }> = {
  new:       { label: "Новая",      color: "text-yellow-400", dot: "bg-yellow-400" },
  accepted:  { label: "Принята",    color: "text-green-400",  dot: "bg-green-400"  },
  rejected:  { label: "Отклонена",  color: "text-red-400",    dot: "bg-red-400"    },
  completed: { label: "Завершена",  color: "text-blue-400",   dot: "bg-blue-400"   },
};

export default function ProfilPage() {
  const { user, loading, logout, openAuth } = useUser();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      openAuth("login");
      router.push("/");
    }
  }, [user, loading, openAuth, router]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => { setOrders(d.orders ?? []); setOrdersLoading(false); })
      .catch(() => setOrdersLoading(false));
  }, [user]);

  if (loading || !user) return null;

  return (
    <main className="pt-24 pb-20 min-h-screen bg-[#141413]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero */}
        <div className="flex items-center gap-5 mb-10">
          <div className="w-20 h-20 rounded-2xl bg-[#22720C] flex items-center justify-center text-3xl font-bold text-white flex-shrink-0">
            {user.name[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{user.name}</h1>
            <p className="text-gray-400 text-sm mt-0.5">{user.phone}</p>
            {user.email && <p className="text-gray-500 text-xs">{user.email}</p>}
          </div>
          <button
            onClick={() => { logout(); router.push("/"); }}
            className="ml-auto flex items-center gap-2 border border-[#313130] hover:border-red-500/50 text-gray-400 hover:text-red-400 text-sm px-4 py-2 rounded-full transition-colors"
          >
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Выйти
          </button>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Всего заявок", value: orders.length },
            { label: "Принято", value: orders.filter((o) => o.status === "accepted").length },
            { label: "Завершено", value: orders.filter((o) => o.status === "completed").length },
            { label: "В обработке", value: orders.filter((o) => o.status === "new").length },
          ].map((s) => (
            <div key={s.label} className="bg-[#1e1e1d] border border-[#313130] rounded-2xl p-5 text-center">
              <p className="text-3xl font-bold text-white">{s.value}</p>
              <p className="text-gray-400 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Orders */}
        <div>
          <h2 className="text-xl font-bold mb-4">Мои заявки</h2>

          {ordersLoading ? (
            <div className="flex justify-center py-10">
              <svg className="animate-spin w-8 h-8 text-[#22720C]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-[#1e1e1d] border border-[#313130] rounded-2xl p-10 text-center">
              <p className="text-gray-400 mb-4">У вас пока нет заявок</p>
              <Link href="/" className="bg-[#22720C] hover:bg-[#1a5a09] text-white font-semibold px-6 py-2.5 rounded-full transition-colors text-sm">
                Заказать уборку
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {orders.map((o) => {
                const meta = STATUS_META[o.status] ?? STATUS_META.new;
                return (
                  <div key={o.id} className="bg-[#1e1e1d] border border-[#313130] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${meta.dot}`} />
                        <span className={`text-xs font-semibold ${meta.color}`}>{meta.label}</span>
                      </div>
                      <p className="text-white font-semibold text-sm">{o.service || "Уборка"}</p>
                      {o.address && <p className="text-gray-400 text-xs mt-0.5">📍 {o.address}</p>}
                      {o.date && <p className="text-gray-500 text-xs mt-0.5">📅 {o.date}</p>}
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <p className="text-gray-500 text-xs">
                        {new Date(o.createdAt).toLocaleDateString("ru-RU")}
                      </p>
                      <a
                        href={`https://t.me/Amural_Cleaningbot?start=${o.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-[#229ED9]/20 hover:bg-[#229ED9]/30 text-[#229ED9] text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.932z" />
                        </svg>
                        TG
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
