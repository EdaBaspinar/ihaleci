import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "../../../lib/db"; // Az önce oluşturduğumuz köprü dosyasını çağırıyoruz

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Gelen verileri kontrol ediyoruz
    if (!email || !password) {
      return NextResponse.json(
        { message: "E-posta ve şifre zorunludur." },
        { status: 400 }
      );
    }

    // 1. Şifreyi güvenlik için geri döndürülemez şekilde hashliyoruz
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 2. Veritabanına Kayıt İşlemi (SQL Sorgusu)
    const query = `
      INSERT INTO users (email, password_hash)
      VALUES ($1, $2)
      RETURNING id, email;
    `;
    const values = [email, hashedPassword];

    // Sorguyu çalıştırıyoruz
    const result = await pool.query(query, values);

    // Terminalde başarımızı görmek için profesyonel bir log
    console.log("Sisteme yeni kullanıcı eklendi. ID:", result.rows[0].id);

    return NextResponse.json(
      { message: "Hesabınız başarıyla oluşturuldu." },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Kayıt API Hatası:", error);
    
    // PostgreSQL'de '23505' hata kodu, bu e-postanın zaten veritabanında olduğu anlamına gelir (Unique constraint)
    if (error.code === '23505') {
      return NextResponse.json(
        { message: "Bu e-posta adresi ile zaten bir hesap oluşturulmuş." },
        { status: 409 } 
      );
    }

    return NextResponse.json(
      { message: "Sunucuda bir hata oluştu. Lütfen daha sonra tekrar deneyin." },
      { status: 500 }
    );
  }
}