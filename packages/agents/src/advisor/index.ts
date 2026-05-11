import { companyRepository } from '../../../core/src/repositories/company.repository';
import sql from '../../../core/src/db';
import { advisorRepository } from '../../../core/src/repositories/advisor.repository';
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function runAdvisor(companyId: string, tenderId: string) {
  console.log(`👔 Danışman Ajan Çalışıyor... Şirket: ${companyId} | İhale: ${tenderId}`);

  const company = await companyRepository.findById(companyId);
  const [tender] = await sql`SELECT * FROM tenders WHERE external_id = ${tenderId}`;

  if (!company || !tender) throw new Error('Şirket veya İhale bulunamadı!');

  const prompt = `
  Firma profili:
  Ad: ${company.name}
  Sertifikalar: ${(company.certificates ?? []).join(', ')}
  Faaliyet: ${company.description}

  İhale bilgisi:
  Başlık: ${tender.title}
  Kurum: ${tender.location}
  Detay: ${JSON.stringify(tender.raw_data)}

  Bu firma bu ihaleye girmek isterse, somut bir hazırlık planı üret. Cevap SADECE JSON olmalıdır:
  {
    "hazirlikSuresiGun": 5,
    "geciciTeminat": 10000,
    "belgelerVar": ["ISO 9001"],
    "belgelerEksik": ["Eksik Belge 1"],
    "riskler": ["Risk 1", "Risk 2"],
    "vurgu": ["Vurgulanacak Yön 1"],
    "tavsiye": "Genel özet tavsiye cümlesi",
    "disclaimer": "Bu bir AI önerisidir, kararı uzmanınızla doğrulayın."
  }
  `;

  // Flash modelimizi kullanıyoruz (Hem hızlı hem kotası geniş!)
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.5-flash',
    generationConfig: { responseMimeType: 'application/json', temperature: 0.2 }
  });

  const res = await model.generateContent(prompt);
  const text = res.response.text();
  const output = JSON.parse(text);

  await advisorRepository.upsert(companyId, tenderId, output);
  console.log('✅ Danışman raporu hazırlandı ve mühürlendi!');
  return output;
}