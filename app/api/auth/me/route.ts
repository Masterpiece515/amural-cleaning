import { NextRequest, NextResponse } from "next/server";
import { findUserById, toPublic } from "@/lib/users";
import { verifyUserToken, USER_COOKIE } from "@/lib/userAuth";
import { getOrders } from "@/lib/orders";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(USER_COOKIE)?.value;
  if (!token) return NextResponse.json({ user: null });

  const userId = verifyUserToken(token);
  if (!userId) return NextResponse.json({ user: null });

  const user = await findUserById(userId);
  if (!user) return NextResponse.json({ user: null });

  const allOrders = await getOrders();
  const userOrders = allOrders
    .filter((o) => o.phone.replace(/\D/g, "") === user.phone.replace(/\D/g, ""))
    .map(({ id, createdAt, service, date, status, address }) => ({ id, createdAt, service, date, status, address }));

  return NextResponse.json({ user: toPublic(user), orders: userOrders });
}
