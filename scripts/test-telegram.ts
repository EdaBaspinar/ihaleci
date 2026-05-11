import { sendTelegram } from '../packages/agents/src/notifier/telegram';
import { matchRepository } from '../packages/core/src/repositories/match.repository';
import sql from '../packages/core/src/db';
import 'dotenv/config';

async function main() {
  const myChatId = process.env.MY_CHAT_ID;
  if (!myChatId) {
    console.error('❌ .env dosyasında MY_CHAT_ID bulunamadı!');
    process.exit(1);
  }

  console.log('📱 Telegram botu uyandırılıyor...');

  // Şirketimizi bulalım
  const companies = await sql`SELECT id, name FROM companies LIMIT 1`;
  if (companies.length === 0) process.exit(1);
  const company = companies[0];

  // Veritabanından şirketimize uygun en iyi 3 eşleşmeyi çekelim
  const matches = await matchRepository.listByCompany(company.id, 3);

  if (matches.length > 0) {
    // Mesaj metnimizi Markdown (kalın, eğik yazı vb.) formatında hazırlıyoruz
    const text = [
      `🔔 *${company.name}* — Bugünkü En Uygun İhaleleriniz\n`,
      ...matches.map((m: any) =>
        `⭐ *Skor: %${m.score}* — ${m.title}\n_${m.reason}_\n`
      ),
    ].join('\n');

    console.log('🚀 Telegram mesajı fırlatılıyor...');
    
    // Mesajı kendi ID'mize gönderiyoruz
    await sendTelegram(myChatId, text); 
    
    console.log('✅ BINGO! Telefonunu kontrol et, mesaj gelmiş olmalı!');
  } else {
    console.log('🤷‍♂️ Gönderilecek eşleşme bulunamadı.');
  }

  await sql.end();
  process.exit(0);
}

main().catch(console.error);