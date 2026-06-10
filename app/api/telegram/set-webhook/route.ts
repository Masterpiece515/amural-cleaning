import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  if (!verifyToken(req.cookies.get(COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return NextResponse.json({ error: "Bot token not set" }, { status: 500 });

  const { url } = await req.json();
  const webhookUrl = `${url}/api/telegram/webhook`;

  const [webhookRes] = await Promise.all([
    fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: webhookUrl }),
    }),
    fetch(`https://api.telegram.org/bot${token}/setMyCommands`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        commands: [
          { command: "orders", description: "Новые заявки" },
          { command: "stats", description: "Статистика" },
        ],
      }),
    }),
  ]);

  const result = await webhookRes.json();
  return NextResponse.json({ ...result, webhookUrl });
}
