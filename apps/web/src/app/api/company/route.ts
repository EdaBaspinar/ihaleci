import { NextResponse } from 'next/server';
import sql from '../../../../../../packages/core/src/db'; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, location, sector, skills } = body;
    
    console.log("Veritabanına Yazılacak Şirket Verileri:", body);

    // 1. ADIM (Garantörlük): Tablo yoksa otomatik olarak oluşturuyoruz
    // Böylece sunum esnasında "tablo bulunamadı" hatası yaşama riskini sıfırlıyoruz.
    await sql`
      CREATE TABLE IF NOT EXISTS company_profile (
        id INT PRIMARY KEY,
        name TEXT,
        location TEXT,
        sector TEXT,
        skills JSONB
      )
    `;

    // 2. ADIM (UPSERT): Profil verilerini id=1 alanına kaydediyoruz. 
    // Daha önce kayıt varsa üzerine yazıyor (güncelliyor), yoksa yeni açıyor.
    await sql`
      INSERT INTO company_profile (id, name, location, sector, skills)
      VALUES (1, ${name}, ${location}, ${sector}, ${JSON.stringify(skills)})
      ON CONFLICT (id) 
      DO UPDATE SET 
        name = EXCLUDED.name,
        location = EXCLUDED.location,
        sector = EXCLUDED.sector,
        skills = EXCLUDED.skills
    `;
    
    return NextResponse.json({ 
      success: true, 
      message: "Kurumsal profil veritabanına başarıyla mühürlendi!" 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Veritabanı Kayıt Hatası:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Veritabanı kayıt hatası: " + error.message 
    }, { status: 500 });
  }
}