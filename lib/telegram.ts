import { getOrders, updateOrder, getStats, Order } from "./orders";

function tok() { return process.env.TELEGRAM_BOT_TOKEN ?? ""; }
function chatId() { return process.env.TELEGRAM_CHAT_ID ?? ""; }

export function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* ── Admin inline keyboard ── */
export function orderKeyboard(orderId: string) {
  return {
    inline_keyboard: [[
      { text: "✅ Принять", callback_data: `accept:${orderId}` },
      { text: "❌ Отклонить", callback_data: `reject:${orderId}` },
    ]],
  };
}

/* ── Admin notification text ── */
export function formatOrderText(o: Order): string {
  const tgLine = o.customerTelegramId ? `🤖 <b>Клиент в TG:</b> привязан (id: <code>${o.customerTelegramId}</code>)` : "";
  return [
    o.source === "order" ? "🧹 <b>Новая заявка!</b>" : "📬 <b>Новое обращение</b>",
    "",
    `👤 <b>Имя:</b> ${escapeHtml(o.name)}`,
    `📞 <b>Телефон:</b> ${escapeHtml(o.phone)}`,
    o.service ? `🏷 <b>Услуга:</b> ${escapeHtml(o.service)}` : "",
    o.date ? `📅 <b>Дата:</b> ${escapeHtml(o.date)}` : "",
    o.message ? `💬 <b>Сообщение:</b> ${escapeHtml(o.message)}` : "",
    tgLine,
    "",
    `🆔 <code>${o.id}</code>`,
    `⏰ ${new Date(o.createdAt).toLocaleString("ru-RU", { timeZone: "Asia/Chita" })}`,
  ].filter(Boolean).join("\n");
}

/* ── Send admin notification ── */
export async function sendOrderNotification(o: Order): Promise<number | undefined> {
  const token = tok();
  const cid = chatId();
  if (!token || !cid) return;

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: cid,
      text: formatOrderText(o),
      parse_mode: "HTML",
      reply_markup: orderKeyboard(o.id),
    }),
  });
  if (!res.ok) return;
  const data = await res.json();
  return data.result?.message_id as number | undefined;
}

/* ── Edit admin message buttons ── */
export async function editMessageKeyboard(
  chatIdVal: string,
  messageId: number,
  markup: object
): Promise<void> {
  const token = tok();
  if (!token) return;
  await fetch(`https://api.telegram.org/bot${token}/editMessageReplyMarkup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatIdVal, message_id: messageId, reply_markup: markup }),
  });
}

/* ── Notify customer about status change ── */
export async function notifyCustomer(order: Order, status: "accepted" | "rejected" | "completed"): Promise<void> {
  const token = tok();
  if (!token || !order.customerTelegramId) return;

  const texts: Record<string, string> = {
    accepted: [
      "✅ <b>Ваша заявка принята!</b>",
      "",
      `🧹 Услуга: ${escapeHtml(order.service || "не указана")}`,
      order.date ? `📅 Дата: ${escapeHtml(order.date)}` : "",
      "",
      "Мы свяжемся с вами в ближайшее время для уточнения деталей.",
      "",
      "<b>Amural Cleaning</b> — г. Чита, +7 914 478-40-10",
    ].filter(Boolean).join("\n"),
    rejected: [
      "❌ <b>По вашей заявке уточняем детали</b>",
      "",
      "Наш менеджер свяжется с вами по телефону для уточнения.",
      "",
      "<b>Amural Cleaning</b> — г. Чита, +7 914 478-40-10",
    ].join("\n"),
    completed: [
      "🏁 <b>Уборка завершена!</b>",
      "",
      `🧹 Услуга: ${escapeHtml(order.service || "не указана")}`,
      "",
      "Благодарим за выбор Amural Cleaning! Будем рады видеть вас снова.",
      "",
      "⭐ Если всё понравилось — порекомендуйте нас друзьям!",
      "",
      "<b>Amural Cleaning</b> — г. Чита, +7 914 478-40-10",
    ].join("\n"),
  };
  const text = texts[status];

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: order.customerTelegramId,
      text,
      parse_mode: "HTML",
    }),
  });
}

async function apiSend(targetChatId: number | string, text: string, markup?: object): Promise<void> {
  const token = tok();
  if (!token) return;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: targetChatId,
      text,
      parse_mode: "HTML",
      ...(markup ? { reply_markup: markup } : {}),
    }),
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function processUpdate(update: Record<string, any>): Promise<void> {
  const token = tok();
  if (!token) return;

  /* ── Inline button presses (admin) ── */
  if (update.callback_query) {
    const cq = update.callback_query;
    await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ callback_query_id: cq.id }),
    });

    const data: string = cq.data ?? "";
    if (data === "done") return;

    if (data.startsWith("accept:") || data.startsWith("reject:")) {
      const colon = data.indexOf(":");
      const action = data.slice(0, colon);
      const orderId = data.slice(colon + 1);
      const status = action === "accept" ? "accepted" : "rejected";
      const emoji = status === "accepted" ? "✅" : "❌";
      const label = status === "accepted" ? "ПРИНЯТО" : "ОТКЛОНЕНО";

      const updated = await updateOrder(orderId, { status: status as "accepted" | "rejected" });

      /* Notify customer if linked */
      if (updated) {
        await notifyCustomer(updated, status as "accepted" | "rejected");
      }

      const msgChatId = cq.message?.chat?.id;
      const msgId = cq.message?.message_id;
      if (msgChatId && msgId) {
        await editMessageKeyboard(String(msgChatId), msgId, {
          inline_keyboard: [[{ text: `${emoji} ${label}`, callback_data: "done" }]],
        });
      }
    }
    return;
  }

  /* ── Bot commands ── */
  const msg = update.message;
  if (!msg?.text) return;
  const text: string = msg.text;
  const fromChatId: number = msg.chat.id;

  /* /start ORDER_ID — customer links their Telegram to an order */
  if (text.startsWith("/start")) {
    const parts = text.trim().split(/\s+/);
    const orderId = parts[1];

    if (orderId) {
      const orders = await getOrders();
      const order = orders.find((o) => o.id === orderId);

      if (order) {
        await updateOrder(orderId, { customerTelegramId: String(fromChatId) });
        const statusText =
          order.status === "new"
            ? "🟡 <b>В обработке</b> — ожидайте уведомления"
            : order.status === "accepted"
            ? "✅ <b>Принята</b>"
            : "❌ <b>Рассматривается</b>";

        await apiSend(fromChatId, [
          "🔔 <b>Уведомления подключены!</b>",
          "",
          `📋 Ваша заявка: ${statusText}`,
          order.service ? `🏷 ${escapeHtml(order.service)}` : "",
          order.date ? `📅 ${escapeHtml(order.date)}` : "",
          "",
          "Вы получите сообщение, когда мы обработаем вашу заявку.",
          "",
          "<b>Amural Cleaning</b> — г. Чита, +7 914 478-40-10",
        ].filter(Boolean).join("\n"));
        return;
      }
    }

    /* Generic /start (no order id) */
    await apiSend(fromChatId, [
      "👋 <b>Добро пожаловать в Amural Cleaning!</b>",
      "",
      "Здесь вы можете отслеживать статус вашей заявки.",
      "",
      "После оформления заявки на сайте нажмите кнопку <b>«Отслеживать в Telegram»</b> — и мы пришлём уведомление когда примем заявку.",
      "",
      "📞 +7 914 478-40-10",
      "🌐 Заказать: amural-cleaning.ru",
    ].join("\n"));
    return;
  }

  if (text === "/orders" || text === "/pending") {
    if (String(fromChatId) !== chatId()) {
      await apiSend(fromChatId, "⛔ Эта команда доступна только администратору.");
      return;
    }
    const pending = (await getOrders()).filter((o) => o.status === "new").slice(0, 5);
    if (!pending.length) {
      await apiSend(fromChatId, "📭 Нет новых заявок");
    } else {
      await apiSend(fromChatId, `📋 <b>Новые заявки (${pending.length}):</b>`);
      for (const o of pending) {
        await apiSend(fromChatId, formatOrderText(o), orderKeyboard(o.id));
      }
    }
    return;
  }

  if (text === "/stats") {
    if (String(fromChatId) !== chatId()) {
      await apiSend(fromChatId, "⛔ Эта команда доступна только администратору.");
      return;
    }
    const s = await getStats();
    await apiSend(fromChatId, [
      "📊 <b>Статистика Amural Cleaning</b>",
      "",
      `📝 Всего: <b>${s.total}</b>`,
      `🟡 Новые: <b>${s.new}</b>`,
      `✅ Принятые: <b>${s.accepted}</b>`,
      `❌ Отклонённые: <b>${s.rejected}</b>`,
      `📅 Сегодня: <b>${s.today}</b>`,
    ].join("\n"));
  }
}

