import { runMatcher } from '../packages/agents/src/matcher/index';
import { matchRepository } from '../packages/core/src/repositories/match.repository';
import sql from '../packages/core/src/db';

async function main() {
  // Önce matches (eşleşmeler) tablomuzu güvene alalım (Eğer yoksa oluşturur)
  await sql`
    CREATE TABLE IF NOT EXISTS matches (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
      tender_id TEXT REFERENCES tenders(external_id) ON DELETE CASCADE,
      score INTEGER NOT NULL,
      reason TEXT,
      warnings TEXT[],
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(company_id, tender_id)
    )
  `;

  // Veritabanından o güzel şirketimizi (Aksaray Tech) bulalım
  const companies = await sql`SELECT id, name FROM companies LIMIT 1`;
  if (companies.length === 0) {
    console.log('❌ Önce şirket eklemelisin!');
    process.exit(1);
  }

  const myCompanyId = companies[0].id;
  console.log(`🏢 Hedef Şirket: ${companies[0].name} (ID: ${myCompanyId})\n`);

  // Ajanı serbest bırak! Gemini ihaleleri analiz etmeye başlasın!
  await runMatcher(myCompanyId);

  console.log('\n🏆 EN İYİ EŞLEŞMELER (Veritabanından Okunan)');
  const bestMatches = await matchRepository.listByCompany(myCompanyId);
  
  bestMatches.forEach(m => {
    console.log(`\nSkor: %${m.score} | ${m.title}`);
    console.log(`📍 Sebep: ${m.reason}`);
    if (m.warnings && m.warnings.length > 0) {
      console.log(`⚠️ Uyarılar: ${m.warnings.join(', ')}`);
    }
    console.log('--------------------------------------------------');
  });

  await sql.end(); // Kapatırken hata vermesin diye bağlantıyı kibarca sonlandırıyoruz
  process.exit(0);
}

main().catch(console.error);