// api/bot.js
// Telegram bot webhook for Vercel (Node 22.x)

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Only POST allowed");
  }

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  if (!BOT_TOKEN) {
    return res.status(500).send("Missing TELEGRAM_BOT_TOKEN");
  }

  const update = req.body;

  // handle Telegram messages
  if (update.message) {
    const chatId = update.message.chat.id;
    const text = update.message.text || "";

    // basic commands
    if (text === "/start") {
      await sendMessage(BOT_TOKEN, chatId, "Bot is working on Vercel 🚀");
    } else {
      await sendMessage(BOT_TOKEN, chatId, `You said: ${text}`);
    }
  }

  return res.status(200).send("OK");
}

// helper function to send Telegram message
async function sendMessage(token, chatId, text) {
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text
    })
  });
}
