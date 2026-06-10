import { NextRequest, NextResponse } from "next/server";
import { saveOrder, updateOrder } from "@/lib/orders";
import { sendOrderNotification } from "@/lib/telegram";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, service, date, message, source } = body;

    const order = await saveOrder({
      name: name ?? "",
      phone: phone ?? "",
      service: service ?? "",
      date: date ?? "",
      message: message ?? "",
      source: source === "contact" ? "contact" : "order",
    });

    const messageId = await sendOrderNotification(order);
    if (messageId) {
      await updateOrder(order.id, {
        telegramMessageId: messageId,
        telegramChatId: process.env.TELEGRAM_CHAT_ID,
      });
    }

    return NextResponse.json({ ok: true, orderId: order.id });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
