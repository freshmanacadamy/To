// api/bot.js
// Telegram Bot webhook handler for Vercel

const TG = "https://api.telegram.org";

function apiUrl(token, method) {
  return `${TG}/bot${token}/${method}`;
}

// SEND MESSAGE
async function sendMessage(token, chatId, text) {
  await fetch(apiUrl(token, "sendMessage"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text
    })
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Only POST allowed");

  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secret && req.query.secret !== secret) {
    return res.status(403).send("Forbidden");
  }

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  if (!BOT_TOKEN) return res.status(500).send("Missing bot token");

  const update = req.body;

  if (update.message) {
    const chatId = update.message.chat.id;
    const text = update.message.text || "";

    if (text === "/start") {
      await sendMessage(BOT_TOKEN, chatId, "Bot is online 🚀 Hosted on Vercel 🔥");
    } else {
      await sendMessage(BOT_TOKEN, chatId, `You said: ${text}`);
    }
  }

  return res.status(200).send("OK");
}
