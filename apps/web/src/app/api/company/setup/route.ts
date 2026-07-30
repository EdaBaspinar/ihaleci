import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import pool from "../../../../lib/db"; 

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Lütfen önce giriş yapın." }, { status: 401 });
    }

    const body = await request.json();
    const { name, taxNumber, industry, capital, annualRevenue, monthlyRevenue, skills } = body;

    if (!name || !taxNumber) {
      return NextResponse.json({ message: "Şirket adı ve vergi numarası zorunludur." }, { status: 400 });
    }

    // KURŞUN GEÇİRMEZ TABLO GÜNCELLEMESİ (Tüm eksik sütunları otomatik açıyoruz)
    await pool.query(`ALTER TABLE companies ADD COLUMN IF NOT EXISTS tax_number TEXT;`);
    await pool.query(`ALTER TABLE companies ADD COLUMN IF NOT EXISTS industry TEXT;`);
    await pool.query(`ALTER TABLE companies ADD COLUMN IF NOT EXISTS capital TEXT;`);
    await pool.query(`ALTER TABLE companies ADD COLUMN IF NOT EXISTS annual_revenue TEXT;`);
    await pool.query(`ALTER TABLE companies ADD COLUMN IF NOT EXISTS monthly_revenue TEXT;`);
    await pool.query(`ALTER TABLE companies ADD COLUMN IF NOT EXISTS skills JSONB;`);

    const skillsArray = skills ? skills.split(',').map((s: string) => s.trim()) : [];

    // Veritabanına tüm verileri ekleyen komut
    const insertCompanyQuery = `
      INSERT INTO companies (name, tax_number, industry, capital, annual_revenue, monthly_revenue, skills)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id;
    `;
    const companyResult = await pool.query(insertCompanyQuery, [
      name, 
      taxNumber, 
      industry, 
      capital,
      annualRevenue,
      monthlyRevenue,
      JSON.stringify(skillsArray) 
    ]);
    const newCompanyId = companyResult.rows[0].id;

    // Kullanıcı ile eşleştirme
    const updateUserQuery = `
      UPDATE users SET company_id = $1 WHERE email = $2;
    `;
    await pool.query(updateUserQuery, [newCompanyId, session.user.email]);

    return NextResponse.json({ message: "Şirket profili başarıyla oluşturuldu." }, { status: 201 });
    
  } catch (error: any) {
    console.error("Şirket kayıt API Hatası:", error);
    
    if (error.code === '23505') {
      return NextResponse.json({ message: "Bu vergi numarası ile zaten bir şirket kayıtlı." }, { status: 409 });
    }

    return NextResponse.json({ message: "Sunucu hatası oluştu." }, { status: 500 });
  }
}