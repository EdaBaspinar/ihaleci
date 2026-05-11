import sql from '../packages/core/src/db';

async function main() {
  console.log('🛠️ Eski ve eksik tablolar temizleniyor...');
  // Sadece şirketler ve kullanıcılar tablosunu siliyoruz, İHALELER (tenders) GÜVENDE!
  await sql`DROP TABLE IF EXISTS companies CASCADE`;
  await sql`DROP TABLE IF EXISTS users CASCADE`;

  console.log('🏗️ Rehbere uygun yapay zeka odaklı tablolar inşa ediliyor...');
  
  await sql`
    CREATE TABLE users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT UNIQUE NOT NULL,
      full_name TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // Rehberdeki  yapıya ek olarak Gemini'nin 3072 boyutlu vektörünü [cite: 345] ekliyoruz
  await sql`
    CREATE TABLE companies (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      tax_no TEXT,
      city TEXT,
      nearby_cities TEXT[],
      nace_codes TEXT[],
      description TEXT,
      certificates TEXT[],
      budget_min BIGINT,
      budget_max BIGINT,
      profile_embedding vector(3072), 
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  console.log('✅ İşlem tamam! Veritabanı artık yepyeni profile hazır.');
  process.exit(0);
}

main().catch(console.error);