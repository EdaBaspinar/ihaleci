import sql from '../db';

export class TenderRepository {
  // Verileri veritabanına kaydetme (veya zaten varsa es geçme) fonksiyonumuz
  async upsertTender(ihale: { kayitNo: string; ihaleAdi: string; ihaleTarihi: string; kurum: string }): Promise<void> {
    
    // raw_data kolonuna JSON olarak tüm ham veriyi yedekliyoruz
    const rawData = JSON.stringify(ihale);

    // ON CONFLICT DO NOTHING: Aynı ihaleyi iki kere kaydetmemek için muazzam bir SQL hayat kurtarıcısı!
    await sql`
      INSERT INTO tenders (external_id, title, location, raw_data, status)
      VALUES (${ihale.kayitNo}, ${ihale.ihaleAdi}, ${ihale.kurum}, ${rawData}::jsonb, 'active')
      ON CONFLICT (external_id) DO NOTHING
    `;
  }

  // Kaydedilen ihaleleri listeleme fonksiyonumuz
  async getAllTenders() {
    const rows = await sql`SELECT external_id, title, location FROM tenders`;
    return rows;
  }
}