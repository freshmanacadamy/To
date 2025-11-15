const TelegramBot = require('node-telegram-bot-api');

// Use webhooks for Vercel serverless environment
const bot = new TelegramBot(process.env.BOT_TOKEN, { 
  webHook: {
    port: process.env.PORT || 3000
  }
});

// Set webhook URL (you'll need to call this once)
const webhookUrl = `${process.env.VERCEL_URL}/api/bot`;

// Initialize bot
const initializeBot = async () => {
  try {
    await bot.setWebHook(webhookUrl);
    console.log('Webhook set successfully:', webhookUrl);
  } catch (error) {
    console.error('Error setting webhook:', error);
  }
};

// Bot commands and handlers
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const welcomeMessage = `
🤖 Welcome to My Test Bot!

Available commands:
/start - Show this welcome message
/help - Get help information
/echo [text] - Echo your text
/time - Show current time
/chatid - Show your chat ID

I'm running on Vercel serverless functions! 🚀
  `;
  
  bot.sendMessage(chatId, welcomeMessage);
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const helpMessage = `
🆘 Help Section

This is a simple test bot deployed on Vercel.

Features:
• Echo messages
• Show current time
• Simple interactions

Built with node-telegram-bot-api and deployed on Vercel serverless functions.
  `;
  
  bot.sendMessage(chatId, helpMessage);
});

bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const echoText = match[1];
  
  bot.sendMessage(chatId, `🔊 Echo: ${echoText}`);
});

bot.onText(/\/time/, (msg) => {
  const chatId = msg.chat.id;
  const currentTime = new Date().toLocaleString();
  
  bot.sendMessage(chatId, `🕐 Current time: ${currentTime}`);
});

bot.onText(/\/chatid/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, `💬 Your Chat ID: ${chatId}`);
});

// Handle any text message
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  
  // Ignore command messages (they're handled by onText)
  if (msg.text && msg.text.startsWith('/')) {
    return;
  }
  
  if (msg.text) {
    bot.sendMessage(chatId, `You said: "${msg.text}"\n\nTry /help to see available commands.`);
  }
});

// Vercel serverless function handler
module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const update = req.body;
      await bot.processUpdate(update);
      res.status(200).json({ status: 'ok' });
    } catch (error) {
      console.error('Error processing update:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'GET') {
    // For webhook verification and health checks
    res.status(200).json({ 
      status: 'Bot is running!',
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};

// Initialize webhook when the function loads
if (process.env.NODE_ENV !== 'test') {
  initializeBot();
}
