import { randomUUID } from "crypto";
import { Redis } from "@upstash/redis";

export type OrderStatus = "new" | "accepted" | "rejected" | "completed";
export type OrderSource = "order" | "contact";

export interface Order {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  service: string;
  address: string;
  date: string;
  message: string;
  source: OrderSource;
  status: OrderStatus;
  telegramMessageId?: number;
  telegramChatId?: string;
  customerTelegramId?: string;
}

function getRedis() {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

const KEY = "amural:orders";

export async function getOrders(): Promise<Order[]> {
  const r = getRedis();
  const orders = await r.get<Order[]>(KEY);
  return orders ?? [];
}

export async function saveOrder(data: Omit<Order, "id" | "createdAt" | "status">): Promise<Order> {
  const orders = await getOrders();
  const order: Order = { ...data, id: randomUUID(), createdAt: new Date().toISOString(), status: "new" };
  await getRedis().set(KEY, [order, ...orders]);
  return order;
}

export async function updateOrder(
  id: string,
  updates: Partial<Pick<Order, "status" | "telegramMessageId" | "telegramChatId" | "customerTelegramId">>
): Promise<Order | null> {
  const orders = await getOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return null;
  Object.assign(orders[idx], updates);
  await getRedis().set(KEY, orders);
  return orders[idx];
}

export async function getStats() {
  const orders = await getOrders();
  const today = new Date().toISOString().split("T")[0];
  return {
    total: orders.length,
    new: orders.filter((o) => o.status === "new").length,
    accepted: orders.filter((o) => o.status === "accepted").length,
    rejected: orders.filter((o) => o.status === "rejected").length,
    completed: orders.filter((o) => o.status === "completed").length,
    today: orders.filter((o) => o.createdAt.startsWith(today)).length,
  };
}
