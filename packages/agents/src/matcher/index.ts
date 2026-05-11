import { companyRepository } from '../../../core/src/repositories/company.repository';
import { matchRepository } from '../../../core/src/repositories/match.repository';
import sql from '../../../core/src/db';
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

// Gemini modelini başlatıyoruz
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function runMatcher(companyId: string) {
  console.log(`🧠 Matcher Ajanı çalışıyor... Şirket ID: ${companyId}`);

  // 1. Şirket bilgilerini çek
  const company = await companyRepository.findById(companyId);
  if (!company) throw new Error('Şirket bulunamadı!');

  // 2. Veritabanındaki aktif ihaleleri çek
  const candidates = await sql`SELECT external_id, title, location, raw_data FROM tenders WHERE status = 'active'`;
  if (candidates.length === 0) {
    console.log('🤷‍♂️ Sistemde hiç ihale yok.');
    return { matches: 0 };
  }

  console.log(`🔎 ${candidates.length} adet ihale, yapay zeka süzgecinden geçiriliyor...`);

  // 3. Gemini'ye verilecek komutu (Prompt) hazırlıyoruz
  const prompt = `
  Sen üst düzey bir Kamu İhale Eşleştirme Uzmanısın.
  
  FİRMA PROFİLİ:
  - Ad: ${company.name}
  - Şehir: ${company.city}
  - Faaliyet: ${company.description}
  - Bütçe: ${company.budgetMin} - ${company.budgetMax} TL
  
  AŞAĞIDAKİ İHALELERİ BU FİRMA İÇİN 0-100 ARASI PUANLA.
  Cevabını SADECE aşağıdaki JSON formatında ver, başka hiçbir metin ekleme:
  {
    "results": [
      {
        "tenderId": "ihale_kayit_no",
        "score": 85,
        "reason": "1-2 cümlelik neden",
        "warnings": ["varsa uyarı 1", "varsa uyarı 2"]
      }
    ]
  }

  İHALE ADAYLARI:
  ${candidates.map((c: any) => `ID: ${c.external_id} | Başlık: ${c.title} | Kurum: ${c.location}`).join('\n')}
  `;

  // 4. Gemini'den JSON olarak sonuçları al
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.5-flash',
    generationConfig: { responseMimeType: 'application/json', temperature: 0.2 }
  });

  const response = await model.generateContent(prompt);
  const text = response.response.text();
  const rerankRes = JSON.parse(text);

  // 5. Sonuçları veritabanına mühürle
  for (const r of rerankRes.results) {
    await matchRepository.upsert({
      companyId,
      tenderId: r.tenderId,
      score: r.score,
      reason: r.reason,
      warnings: r.warnings || [],
    });
    console.log(`✅ Puanlandı: ${r.tenderId} -> Skor: ${r.score}`);
  }

  return { matches: rerankRes.results.length };
}