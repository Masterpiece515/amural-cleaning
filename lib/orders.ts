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

const INDEX_KEY = "amural:orders:index";
const LEGACY_KEY = "amural:orders";
const orderKey = (id: string) => `amural:order:${id}`;

// One-time migration from legacy single-key to per-order keys + sorted set index
async function migrateIfNeeded(r: Redis): Promise<void> {
  const legacy = await r.get<Order[]>(LEGACY_KEY);
  if (!legacy || !Array.isArray(legacy) || legacy.length === 0) return;

  const pipeline = r.pipeline();
  for (const order of legacy) {
    const score = new Date(order.createdAt).getTime();
    pipeline.set(orderKey(order.id), order);
    pipeline.zadd(INDEX_KEY, { score, member: order.id });
  }
  pipeline.del(LEGACY_KEY);
  await pipeline.exec();
}

// Returns orders newest-first, up to `limit`
export async function getOrders(limit = 500): Promise<Order[]> {
  const r = getRedis();
  await migrateIfNeeded(r);

  // newest first (highest score = latest timestamp)
  const ids = await r.zrange<string[]>(INDEX_KEY, 0, limit - 1, { rev: true });
  if (!ids.length) return [];

  // Batch-fetch all orders in a single round-trip
  const pipeline = r.pipeline();
  ids.forEach((id) => pipeline.get<Order>(orderKey(id)));
  const results = await pipeline.exec<(Order | null)[]>();

  return results.filter((o): o is Order => Boolean(o));
}

export async function getOrderById(id: string): Promise<Order | null> {
  return getRedis().get<Order>(orderKey(id));
}

export async function saveOrder(
  data: Omit<Order, "id" | "createdAt" | "status">
): Promise<Order> {
  const r = getRedis();
  const order: Order = {
    ...data,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    status: "new",
  };

  // Store order and add to sorted index atomically
  const pipeline = r.pipeline();
  pipeline.set(orderKey(order.id), order);
  pipeline.zadd(INDEX_KEY, { score: Date.now(), member: order.id });
  await pipeline.exec();

  return order;
}

export async function updateOrder(
  id: string,
  updates: Partial<Pick<Order, "status" | "telegramMessageId" | "telegramChatId" | "customerTelegramId">>
): Promise<Order | null> {
  const current = await getOrderById(id);
  if (!current) return null;

  const updated: Order = { ...current, ...updates };
  await getRedis().set(orderKey(id), updated);
  return updated;
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
