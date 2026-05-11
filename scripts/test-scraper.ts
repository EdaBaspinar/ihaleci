import { runEkapScraper } from '../packages/agents/src/scrapers/ekap';
import { TenderRepository } from '../packages/core/src/repositories/tender.repository';

async function main() {
  // 1. Ajanı çalıştır ve verileri kopar al
  const cekilenIhaleler = await runEkapScraper();

  if (!cekilenIhaleler || cekilenIhaleler.length === 0) {
    console.log('❌ Hiç ihale bulunamadı.');
    return;
  }

  console.log('\n💾 Veritabanı kaydı başlatılıyor...');
  const repo = new TenderRepository();

  // 2. Çekilen her bir ihaleyi veritabanına gönder
  for (const ihale of cekilenIhaleler) {
    await repo.upsertTender(ihale);
    console.log(`✅ Veritabanına Eklendi: ${ihale.kayitNo} - ${ihale.ihaleAdi}`);
  }

  // 3. Veritabanından kontrol edelim gerçekten girmiş mi?
  console.log('\n🔍 Veritabanındaki Güncel İhaleler Kontrol Ediliyor:');
  const dbIhaleler = await repo.getAllTenders();
  console.table(dbIhaleler);
  
  process.exit(0);
}

main().catch(console.error);