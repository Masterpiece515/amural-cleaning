import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN не задан в .env.local" }, { status: 500 });
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
  const data = await res.json();

  if (!data.ok) {
    return NextResponse.json({ error: "Ошибка Telegram API", details: data });
  }

  if (!data.result.length) {
    return NextResponse.json({
      instruction: "Сообщений нет. Откройте Telegram, найдите вашего бота и отправьте /start — затем обновите эту страницу.",
    });
  }

  const seen = new Set<number>();
  const chats = data.result
    .map((u: Record<string, unknown>) => {
      const msg = (u.message || (u.callback_query as Record<string, unknown>)?.message) as Record<string, unknown> | undefined;
      if (!msg) return null;
      const chat = msg.chat as Record<string, unknown>;
      const from = msg.from as Record<string, unknown>;
      return {
        chat_id: chat?.id,
        username: (chat?.username as string) || (from?.username as string),
        first_name: from?.first_name as string,
      };
    })
    .filter((c): c is { chat_id: number; username: string; first_name: string } => {
      if (!c?.chat_id || seen.has(c.chat_id)) return false;
      seen.add(c.chat_id);
      return true;
    });

  return NextResponse.json({
    instruction: `Добавьте в .env.local: TELEGRAM_CHAT_ID=${chats[0]?.chat_id ?? "???"}`,
    chats,
  });
}
