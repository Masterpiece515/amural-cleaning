import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";
import { processUpdate } from "@/lib/telegram";

export async function POST(req: NextRequest) {
  if (!verifyToken(req.cookies.get(COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return NextResponse.json({ error: "Bot token not set" }, { status: 500 });

  const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates?timeout=0`);
  const data = await res.json();
  if (!data.ok) return NextResponse.json({ error: "Telegram API error" }, { status: 500 });

  const updates: Record<string, unknown>[] = data.result ?? [];
  for (const u of updates) {
    await processUpdate(u);
  }

  if (updates.length > 0) {
    const lastId = (updates[updates.length - 1] as { update_id: number }).update_id;
    await fetch(`https://api.telegram.org/bot${token}/getUpdates?offset=${lastId + 1}&limit=1`);
  }

  return NextResponse.json({ processed: updates.length });
}
