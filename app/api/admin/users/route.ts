import { NextRequest, NextResponse } from "next/server";
import { getUsers, deleteUser, toPublic } from "@/lib/users";
import { getOrders } from "@/lib/orders";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";

function auth(req: NextRequest) {
  return verifyToken(req.cookies.get(COOKIE_NAME)?.value);
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [users, orders] = await Promise.all([getUsers(), getOrders()]);

  // Count orders per phone (normalized)
  const ordersByPhone: Record<string, number> = {};
  for (const o of orders) {
    const key = o.phone.replace(/\D/g, "");
    ordersByPhone[key] = (ordersByPhone[key] ?? 0) + 1;
  }

  const result = users.map((u) => ({
    ...toPublic(u),
    orderCount: ordersByPhone[u.phone.replace(/\D/g, "")] ?? 0,
  }));

  return NextResponse.json({ users: result });
}

export async function DELETE(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const ok = await deleteUser(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}
