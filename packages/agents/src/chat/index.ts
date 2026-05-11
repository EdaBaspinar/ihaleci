import { documentChunkRepository } from '../../../core/src/repositories/document-chunk.repository';
import { embedText } from '../llm-adapters/gemini'; // Gemini vektör dönüştürücümüz
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function askTenderQuestion(tenderId: string, question: string) {
  console.log(`💬 Soru soruluyor: "${question}"`);

  // 1. Soruyu yapay zeka diline (vektöre) çevir
  const qEmb = await embedText(question);

  // 2. Veritabanındaki şartname PDF'inin içinden en benzer 5 paragrafı bul
  const chunks = await documentChunkRepository.findSimilar({
    queryEmbedding: qEmb,
    tenderId,
    limit: 5,
  });

  // 3. Bulunan paragrafları birleştir (Eğer PDF yoksa boş döner)
  const context = chunks.length > 0 
    ? chunks.map((c, i) => `[Kaynak ${i+1}, sayfa ~${c.page_number ?? '?'}]\n${c.content}`).join('\n\n')
    : "Sistemde bu ihale için taranmış bir PDF şartnamesi bulunmamaktadır.";

  // 4. Gemini'ye çok katı bir komut veriyoruz (Halüsinasyon engelleme)
  const prompt = `
  Aşağıda bir kamu ihale şartnamesinden kesitler var. Kullanıcının sorusunu SADECE bu kesitlere dayanarak cevapla.
  Bilgi yoksa "Şartnamede açıkça belirtilmemiş veya belge bulunamadı" de. Cevabında [Kaynak N] referanslarını kullan.
  
  KESİTLER:
  ${context}
  
  SORU: ${question}
  `;

  // Yine şimşek hızlı Flash modelimizi kullanıyoruz
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const result = await model.generateContent(prompt);
  const answer = result.response.text();

  return {
    answer,
    sources: chunks.map((c, i) => ({ index: i + 1, page: c.page_number, snippet: c.content.slice(0, 150) }))
  };
}