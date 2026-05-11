import { createCompanyWithProfile } from '../packages/core/src/services/company-profile.service';
import { companyRepository } from '../packages/core/src/repositories/company.repository';
import sql from '../packages/core/src/db';

async function main() {
  console.log('🏢 Şirket Profili ve Vektör Zekası Oluşturuluyor...\n');

  // Veritabanı "users" tablosu boşsa yabancı anahtar (foreign key) hatası vermesin diye sahte bir kullanıcı açıyoruz
  const mockUserId = '00000000-0000-0000-0000-000000000000';
  await sql`
    INSERT INTO users (id, email, full_name) 
    VALUES (${mockUserId}, 'admin@aksaraytech.com', 'Sistem Yöneticisi') 
    ON CONFLICT DO NOTHING
  `;

  // Şirket profilimizi yaratıyoruz
  const company = await createCompanyWithProfile({
    userId: mockUserId,
    name: 'Aksaray Tech Bilişim ve AI Sistemleri',
    city: 'Aksaray',
    nearbyCities: ['Konya', 'Nevşehir', 'Niğde'],
    naceCodes: ['62.01.01', '62.02.01'],
    description: 'Yapay zeka, veri analizi ve derin öğrenme modelleri üzerine yazılım geliştirme. Kütüphane otomasyon sistemleri ve drone destekli görüntü işleme projeleri yapılmaktadır.',
    certificates: ['ISO 9001', 'ISO 27001'],
    budgetMin: 50000,
    budgetMax: 5000000,
  });

  console.log(`✅ Şirket başarıyla veritabanına mühürlendi! ID: ${company.id}`);
  console.log('🤖 Şirketin metin bilgileri Gemini ile vektöre çevrilip başarıyla profile eklendi!\n');

  console.log('🔍 Veritabanından okunan ham şirket bilgisi:');
  const dbCompany = await companyRepository.findById(company.id);
  console.log(dbCompany);

  process.exit(0);
}

main().catch(console.error);