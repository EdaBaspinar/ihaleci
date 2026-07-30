import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function GET() {
  try {
    // 1. Önce şirkete bağlı olan kullanıcıları siliyoruz
    await pool.query(`DELETE FROM users;`);
    
    // 2. Kullanıcılar silindiği için artık şirketleri sorunsuz silebiliriz
    await pool.query(`DELETE FROM companies;`);

    return NextResponse.json({ 
      success: true, 
      message: "Kullanıcılar ve şirketler tertemiz oldu! Video kaydına hazırsın aşko." 
    }, { status: 200 });

  } catch (error: any) {
    console.error("TEMİZLEME HATASI:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}