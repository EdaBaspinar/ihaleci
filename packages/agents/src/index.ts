import { EkapScraper } from './scrapers/ekap';

async function main() {
  const ekap = new EkapScraper();
  
  try {
    await ekap.init();
    await ekap.scrape();
    console.log("✨ İlk görev başarıyla tamamlandı!");
  } catch (error) {
    console.error("❌ Bir hata oluştu:", error);
  }
}

main();