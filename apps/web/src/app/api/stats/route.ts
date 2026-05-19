import { NextResponse } from 'next/server';
import sql from '../../../../../../packages/core/src/db';

export async function GET() {
  try {
    // Veritabanındaki toplam ihale sayısını anlık olarak sayıyoruz
    const tendersResult = await sql`SELECT count(*) FROM tenders`;
    const totalTenders = parseInt(tendersResult[0].count);

    // Profil tablosunda şirket kaydı var mı diye bakıyoruz
    const companyResult = await sql`SELECT count(*) FROM company_profile`;
    const hasProfile = parseInt(companyResult[0].count) > 0;

    // Şirket profili doldurulmuşsa %85, boşsa %0 gibi dinamik bir eşleşme skoru üretiyoruz
    const matchScore = hasProfile ? 85 : 0;

    return NextResponse.json({
      success: true,
      totalTenders: totalTenders,
      matchScore: matchScore
    });

  } catch (error: any) {
    console.error("İstatistik Çekilirken Hata:", error);
    return NextResponse.json({ 
      success: false, 
      totalTenders: 0, 
      matchScore: 0 
    }, { status: 500 });
  }
}