import { askTenderQuestion } from '../packages/agents/src/chat/index';
import sql from '../packages/core/src/db';
import { embedText } from '../packages/agents/src/llm-adapters/gemini'; // Şartnameyi vektöre çevirmek için

async function main() {
  console.log('🛠️ Veritabanı Şartname (RAG) masası için hazırlanıyor...');

  // Eski veya eksik tabloyu silip yenisini (Vektör destekli) kuruyoruz
  await sql`DROP TABLE IF EXISTS document_chunks CASCADE`;

  await sql`
    CREATE TABLE document_chunks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tender_id TEXT REFERENCES tenders(external_id) ON DELETE CASCADE,
      chunk_index INT NOT NULL,
      content TEXT NOT NULL,
      page_number INT,
      embedding vector(3072), -- Gemini embedding boyutu
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // Hedef ihalemiz yine Üniversite Kamerası
  const targetTenderId = '2026/67890'; 

  console.log('📄 İhale şartnamesinden örnek bir sayfa (Mock) okunup yapay zeka vektörüne çevriliyor...');
  const mockText = "Madde 14.2: Bu ihale kapsamında alt yüklenici veya taşeron çalıştırılmasına kesinlikle izin verilmemektedir. Tüm kurulum, montaj ve entegrasyon işlemleri yüklenici firmanın kendi bünyesindeki kadrolu personelleri tarafından yapılmalıdır.";
  
  const mockEmbedding = await embedText(mockText);
  const vec = '[' + mockEmbedding.join(',') + ']';

  // Bu örnek paragrafı veritabanına 14. Sayfa olarak kaydediyoruz
  await sql`
    INSERT INTO document_chunks (tender_id, chunk_index, content, page_number, embedding)
    VALUES (${targetTenderId}, 1, ${mockText}, 14, ${vec}::vector)
  `;

  console.log('🤖 RAG Chat (Şartname Asistanı) başlatılıyor...\n');

  const userQuestion = 'Bu ihalede alt yüklenici çalıştırabilir miyim?';
  const response = await askTenderQuestion(targetTenderId, userQuestion);

  console.log('\n🤖 YAPAY ZEKA CEVABI:');
  console.log('--------------------------------------------------');
  console.log(response.answer);
  console.log('--------------------------------------------------');
  
  if (response.sources.length > 0) {
    console.log('\n📚 KULLANILAN KAYNAKLAR:');
    response.sources.forEach(s => console.log(`[${s.index}] Sayfa ${s.page}: ${s.snippet}...`));
  }

  await sql.end();
  process.exit(0);
}

main().catch(console.error);