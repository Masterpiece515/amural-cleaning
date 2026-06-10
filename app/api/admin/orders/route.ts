import { NextRequest, NextResponse } from "next/server";
import { getOrders, updateOrder, getStats } from "@/lib/orders";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";
import { editMessageKeyboard, notifyCustomer } from "@/lib/telegram";

function auth(req: NextRequest) {
  return verifyToken(req.cookies.get(COOKIE_NAME)?.value);
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [orders, stats] = await Promise.all([getOrders(), getStats()]);
  return NextResponse.json({ orders, stats });
}

export async function PATCH(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, status } = await req.json();
  const updated = await updateOrder(id, { status });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (updated.telegramMessageId && updated.telegramChatId) {
    const emoji = status === "accepted" ? "✅" : "❌";
    const label = status === "accepted" ? "ПРИНЯТО" : "ОТКЛОНЕНО";
    await editMessageKeyboard(updated.telegramChatId, updated.telegramMessageId, {
      inline_keyboard: [[{ text: `${emoji} ${label}`, callback_data: "done" }]],
    });
  }

  if (status === "accepted" || status === "rejected") {
    await notifyCustomer(updated, status);
  }

  return NextResponse.json({ ok: true, order: updated });
}
