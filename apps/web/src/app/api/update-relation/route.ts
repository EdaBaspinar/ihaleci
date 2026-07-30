import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET() {
  try {
    // 1. Önce users tablosuna company_id sütununu ekliyoruz (eğer yoksa)
    // 2. Bu sütunu companies tablosundaki id ile ilişkilendiriyoruz (Foreign Key)
    const query = `
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id);
    `;
    
    await pool.query(query);

    return NextResponse.json({ 
      message: "İşlem başarılı! Kullanıcılar ve Şirketler tabloları birbirine bağlandı." 
    }, { status: 200 });
    
  } catch (error: any) {
    console.error("İlişki Güncelleme Hatası:", error);
    return NextResponse.json({ 
      message: "Bir hata oluştu", details: error.message 
    }, { status: 500 });
  }
}