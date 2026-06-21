import { NextRequest, NextResponse } from "next/server";
import { saveOrder, updateOrder } from "@/lib/orders";
import { sendOrderNotification } from "@/lib/telegram";
import { findUserById } from "@/lib/users";
import { verifyUserToken, USER_COOKIE } from "@/lib/userAuth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, service, address, date, message, source } = body;

    // Auto-attach telegramId if user is logged in and has TG linked
    let customerTelegramId: string | undefined;
    const userToken = request.cookies.get(USER_COOKIE)?.value;
    if (userToken) {
      const userId = verifyUserToken(userToken);
      if (userId) {
        const user = await findUserById(userId);
        if (user?.telegramId) customerTelegramId = user.telegramId;
      }
    }

    const order = await saveOrder({
      name: name ?? "",
      phone: phone ?? "",
      service: service ?? "",
      address: address ?? "",
      date: date ?? "",
      message: message ?? "",
      source: source === "contact" ? "contact" : "order",
      customerTelegramId,
    });

    const messageId = await sendOrderNotification(order);
    if (messageId) {
      await updateOrder(order.id, {
        telegramMessageId: messageId,
        telegramChatId: process.env.TELEGRAM_CHAT_ID,
      });
    }

    return NextResponse.json({ ok: true, orderId: order.id, telegramLinked: !!customerTelegramId });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
