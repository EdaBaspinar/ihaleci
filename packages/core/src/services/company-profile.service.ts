import { companyRepository, type Company } from '../repositories/company.repository';
// Gemini embedding fonksiyonumuzu projemizin ajan klasöründen alıyoruz
import { embedText } from '../../../agents/src/llm-adapters/gemini'; 

export async function createCompanyWithProfile(input: Omit<Company, 'id'>): Promise<Company> {
  // 1. Şirketi normal metin olarak veritabanına kaydet
  const company = await companyRepository.create(input);

  // 2. Şirketin tüm özelliklerini yapay zeka için tek bir anlam bütünlüğüne (cümleye) çevir
  const profileText = [
    `Şirket: ${input.name}`,
    `Şehir: ${input.city ?? '-'}, çevre iller: ${(input.nearbyCities ?? []).join(', ')}`,
    `NACE kodları: ${(input.naceCodes ?? []).join(', ')}`,
    `Açıklama: ${input.description ?? ''}`,
    `Sertifikalar: ${(input.certificates ?? []).join(', ')}`,
    `Bütçe: ${input.budgetMin ?? 0} - ${input.budgetMax ?? 0} TL`,
  ].join('\n');

  // 3. Gemini'ye yollayıp bu şirketin "vektörel zeka haritasını" al
  const embedding = await embedText(profileText);
  
  // 4. Aldığımız vektörü şirketin veritabanındaki satırına mühürle
  await companyRepository.setEmbedding(company.id, embedding);

  return company;
}