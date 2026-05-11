import sql from '../db';

export interface AdvisorOutput {
  hazirlikSuresiGun: number;
  geciciTeminat?: number;
  belgelerVar: string[];
  belgelerEksik: string[];
  riskler: string[];
  vurgu: string[];      // Teklifte vurgulanacak güçlü yönler
  tavsiye: string;      // Genel özet
  disclaimer: string;
}

export const advisorRepository = {
  // Danışman raporunu veritabanına mühürler
  async upsert(companyId: string, tenderId: string, output: AdvisorOutput) {
    await sql`
      INSERT INTO advisor_outputs (company_id, tender_id, output)
      VALUES (${companyId}, ${tenderId}, ${sql.json(output as any)})
      ON CONFLICT (company_id, tender_id) DO UPDATE
        SET output = EXCLUDED.output, created_at = NOW()
    `;
  },

  // Şirket ve ihale ID'sine göre raporu bulur
  async findCached(companyId: string, tenderId: string): Promise<AdvisorOutput | null> {
    const [row] = await sql<any[]>`
      SELECT output FROM advisor_outputs
      WHERE company_id = ${companyId} AND tender_id = ${tenderId}
        AND created_at > NOW() - INTERVAL '24 hours'
    `;
    return row?.output ?? null;
  },
};