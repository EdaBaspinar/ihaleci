import TelegramBot from 'node-telegram-bot-api';
import 'dotenv/config';

// polling: false yapıyoruz çünkü botumuz mesaj dinlemeyecek, sadece bildirim gönderecek
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: false });

export async function sendTelegram(chatId: string, text: string) {
  await bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
}