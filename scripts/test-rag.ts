import { DocumentRepository } from '../packages/core/src/repositories/document.repository';
import { chunkText } from '../packages/agents/src/doc-reader/chunker';
import { embedTexts, embedText } from '../packages/agents/src/llm-adapters/gemini';

async function main() {
  console.log('RAG (Vektör Arama) Testi Başlıyor... 🚀\n');
  const repo = new DocumentRepository();
  const testIhaleId = 'test-ihale-001';

  // 1. Önceki testleri temizleyelim (çakışma olmasın)
  console.log('1. Veritabanı temizleniyor...');
  await repo.deleteChunksByTenderId(testIhaleId);

  // 2. Uzun ve karmaşık bir metni parçalayalım
  console.log('2. Örnek metin parçalara bölünüyor...');
  const ornekMetin = `Aksaray Üniversitesi Yönetim Bilişim Sistemleri (YBS) bölümü, öğrencilerin yapay zeka alanında pratik yapabilmesi için yeni bir laboratuvar kuracaktır. Bu laboratuvarda drone ve kuş sınıflandırma projelerinde kullanılmak üzere yüksek kapasiteli derin öğrenme sunucuları yer alacaktır. 
  
  Bunun yanı sıra kampüs kütüphanesinin içerisine öğrencilerin sosyalleşebileceği ve Mavi Okyanus Stratejisi kapsamında geliştirilen yeni nesil bir kafe açılacaktır. Bu kafe, öğrencilere 24 saat hizmet verecektir.`;

  // Metni bilerek çok küçük parçalara (yaklaşık 15 kelime) bölüyoruz ki yapay zeka aradığımızı spesifik olarak bulsun
  const chunks = chunkText(ornekMetin, { maxWordsPerChunk: 15, overlap: 5 });
  console.log(`   -> Metin ${chunks.length} parçaya bölündü.`);

  // 3. Parçaları Gemini'ye gönderip vektörlerini alalım ve veritabanına kaydedelim
  console.log('\n3. Parçalar Gemini ile yapay zeka diline (vektörlere) çevrilip veritabanına kaydediliyor...');
  const metinler = chunks.map(c => c.content);
  const vektörler = await embedTexts(metinler);

  for (let i = 0; i < chunks.length; i++) {
    await repo.insertChunk({
      tenderId: testIhaleId,
      chunkIndex: chunks[i].index,
      content: chunks[i].content,
      embedding: vektörler[i],
    });
  }
  console.log('   -> Veritabanı kaydı başarılı!');

  // 4. VEKTÖR ARAMASI: Yapay zekaya bir soru soralım ve veritabanından en alakalı cevabı getirmesini isteyelim
  console.log('\n4. Veritabanında akıllı arama yapılıyor...');
  
  const soru = "Kütüphaneye açılacak olan yerin strateji konsepti nedir?";
  console.log(`   Soru: "${soru}"`);

  // Soruyu da vektöre çevirip veritabanındaki parçalarla eşleştiriyoruz
  const soruVektoru = await embedText(soru);
  const sonuclar = await repo.searchSimilarChunks({
    queryEmbedding: soruVektoru,
    limit: 2, // En benzeyen 2 sonucu getir
  });

  console.log('\n--- YAPAY ZEKA TARAFINDAN BULUNAN EN ALAKALI SONUÇLAR ---');
  sonuclar.forEach((sonuc, index) => {
    console.log(`\nSonuç ${index + 1} (Benzerlik Oranı: %${(sonuc.similarity * 100).toFixed(1)}):`);
    console.log(`"${sonuc.content}"`);
  });

  // İşlem bitince terminali serbest bırak
  process.exit(0);
}

main().catch(console.error);