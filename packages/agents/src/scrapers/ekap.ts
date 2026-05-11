import puppeteer from 'puppeteer';
import path from 'node:path';

export async function runEkapScraper() {
  console.log('🤖 EKAP Ajanı (Mock Modu) veri avına çıkıyor...');

  const browser = await puppeteer.launch({ 
    headless: false, // Ne yaptığını canlı canlı izleyelim
    defaultViewport: null,
    args: ['--start-maximized'] 
  });
  
  const page = await browser.newPage();

  try {
    const filePath = path.join(process.cwd(), 'packages', 'agents', 'mock-ekap.html');
    const fileUrl = `file://${filePath}`;

    console.log('📂 Yerel test dosyasına (Mock EKAP) gidiliyor...');
    await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });
    console.log('✅ Mock sayfa anında yüklendi! Veriler toplanıyor...\n');

    // İŞTE BÜYÜNÜN KOPTUĞU YER: Sayfanın içine JavaScript enjekte edip verileri çekiyoruz!
    const ihaleler = await page.evaluate(() => {
      // 1. Tablonun içindeki tüm veri satırlarını bul
      const rows = Array.from(document.querySelectorAll('#ihaleTable tbody tr'));
      
      // 2. Her bir satırı dön ve içindeki hücreleri (td) al
      return rows.map(row => {
        const columns = row.querySelectorAll('td');
        return {
          kayitNo: columns[0]?.innerText.trim() || '',
          ihaleAdi: columns[1]?.innerText.trim() || '',
          ihaleTarihi: columns[2]?.innerText.trim() || '',
          kurum: columns[3]?.innerText.trim() || ''
        };
      });
    });

    console.log('🎉 BINGO! Ajan verileri başarıyla söküp aldı:');
    
    // Verileri terminalde çok şık bir tablo olarak göstermek için harika bir taktik:
    console.table(ihaleler);

    return ihaleler; // İleride bu veriyi alıp veritabanına atacağız

  } catch (error: any) {
    console.error('❌ Ajan dosyayı okurken bir sorun yaşadı:', error.message);
  } finally {
    console.log('\n🛑 Görev tamamlandı, ajan uykuya dalıyor...');
    await browser.close();
  }
}