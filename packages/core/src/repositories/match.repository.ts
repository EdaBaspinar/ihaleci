import sql from '../db';

export interface Match {
  companyId: string;
  tenderId: string; // İhalenin external_id'si (Örn: 2026/12345)
  score: number;
  reason: string;
  warnings: string[];
}

export const matchRepository = {
  // Eşleşmeyi kaydeder veya zaten varsa günceller (ON CONFLICT hayat kurtarır!)
  async upsert(m: Match): Promise<void> {
    await sql`
      INSERT INTO matches (company_id, tender_id, score, reason, warnings)
      VALUES (${m.companyId}, ${m.tenderId}, ${m.score}, ${m.reason}, ${m.warnings})
      ON CONFLICT (company_id, tender_id) DO UPDATE
        SET score = EXCLUDED.score, reason = EXCLUDED.reason, warnings = EXCLUDED.warnings
    `;
  },

  // Şirkete ait eşleşmeleri en yüksek puandan düşüğe doğru sıralar
  async listByCompany(companyId: string, limit = 20) {
    return sql`
      SELECT m.*, t.title, t.location, t.raw_data
      FROM matches m
      JOIN tenders t ON t.external_id = m.tender_id
      WHERE m.company_id = ${companyId}
      ORDER BY m.score DESC
      LIMIT ${limit}
    `;
  }
};