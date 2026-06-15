import { Redis } from "@upstash/redis";
import { randomUUID } from "crypto";

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export type PublicUser = Omit<User, "passwordHash">;

const KEY = "amural:users";

function getRedis() {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

export async function getUsers(): Promise<User[]> {
  return (await getRedis().get<User[]>(KEY)) ?? [];
}

export async function findUserByPhone(phone: string): Promise<User | null> {
  const users = await getUsers();
  return users.find((u) => u.phone.replace(/\D/g, "") === phone.replace(/\D/g, "")) ?? null;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const users = await getUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function findUserById(id: string): Promise<User | null> {
  const users = await getUsers();
  return users.find((u) => u.id === id) ?? null;
}

export async function createUser(data: Omit<User, "id" | "createdAt">): Promise<User> {
  const users = await getUsers();
  const user: User = { ...data, id: randomUUID(), createdAt: new Date().toISOString() };
  await getRedis().set(KEY, [user, ...users]);
  return user;
}

export function toPublic(u: User): PublicUser {
  const { passwordHash: _, ...pub } = u;
  return pub;
}
