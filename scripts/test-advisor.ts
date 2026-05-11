import { runAdvisor } from '../packages/agents/src/advisor/index';
import sql from '../packages/core/src/db';

async function main() {
  // Danışman raporları tablomuzu kuralım (Yoksa oluşturur)
  await sql`
    CREATE TABLE IF NOT EXISTS advisor_outputs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
      tender_id TEXT REFERENCES tenders(external_id) ON DELETE CASCADE,
      output JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(company_id, tender_id)
    )
  `;

  // Aksaray Tech firmasını bulalım
  const companies = await sql`SELECT id FROM companies LIMIT 1`;
  if (companies.length === 0) process.exit(1);
  const myCompanyId = companies[0].id;

  // Az önceki en iyi eşleşmeyi (Üniversite Kamerası) hedef alalım
  const targetTenderId = '2026/67890'; 

  console.log('📄 Danışman, ihaleyi şirketimiz için analiz ediyor...\n');
  const report = await runAdvisor(myCompanyId, targetTenderId);

  console.log('\n📊 DANIŞMAN RAPORU:');
  console.log(`⏱️ Tahmini Hazırlık: ${report.hazirlikSuresiGun} gün`);
  console.log(`✅ Eldeki Belgeler: ${report.belgelerVar.join(', ') || 'Yok'}`);
  console.log(`❌ Eksik Belgeler: ${report.belgelerEksik.join(', ') || 'Yok'}`);
  console.log(`⚠️ Riskler:\n - ${report.riskler.join('\n - ')}`);
  console.log(`💡 Tavsiye: ${report.tavsiye}`);

  await sql.end();
  process.exit(0);
}

main().catch(console.error);