import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getServerSession } from "next-auth";
import pool from "../../../lib/db";

export async function POST(req: Request) {
  try {
    const { message, tenderId } = await req.json();
    const session = await getServerSession();

    let companyContext = "Şirket profili bulunamadı.";
    let tenderContext = "İhale detayı bulunamadı.";

    try {
      if (session?.user?.email) {
        const userRes = await pool.query('SELECT company_id FROM users WHERE email = $1', [session.user.email]);
        if (userRes.rows.length > 0 && userRes.rows[0].company_id) {
          const compRes = await pool.query('SELECT * FROM companies WHERE id = $1', [userRes.rows[0].company_id]);
          if (compRes.rows.length > 0) {
            const c = compRes.rows[0];
            companyContext = `Şirket Unvanı: ${c.name}\nSektör: ${c.industry}\nKayıtlı Sermaye: ${c.capital} TL\nYıllık Ciro: ${c.annual_revenue} TL\nAylık Ciro: ${c.monthly_revenue} TL\nÇalışan Sayısı: ${c.employee_count}\nYetkinlikler: ${c.skills}`;
          }
        }
      }
    } catch (dbErr) {}

    try {
      if (tenderId) {
        let tenderData = null;
        
        try {
          const res1 = await pool.query('SELECT * FROM tenders WHERE id::text = $1 LIMIT 1', [tenderId]);
          if (res1.rows.length > 0) tenderData = res1.rows[0];
        } catch (e1) {}

        if (!tenderData) {
          try {
            const res2 = await pool.query('SELECT * FROM tenders WHERE ihale_kayit_no::text = $1 LIMIT 1', [tenderId]);
            if (res2.rows.length > 0) tenderData = res2.rows[0];
          } catch (e2) {}
        }

        if (!tenderData) {
          try {
            const res3 = await pool.query('SELECT * FROM tenders WHERE external_id::text = $1 LIMIT 1', [tenderId]);
            if (res3.rows.length > 0) tenderData = res3.rows[0];
          } catch (e3) {}
        }

        if (tenderData) {
          tenderContext = `İhale Başlığı: ${tenderData.title}\nKurum: ${tenderData.agency}\nLokasyon: ${tenderData.location}\nTarih: ${tenderData.tender_date}\nAçıklama/Detay: ${tenderData.description}`;
        }
      }
    } catch (dbErr) {}

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("API Anahtari eksik!");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `Sen TenderIQ sisteminde çalışan kıdemli bir ihale danışmanı ve risk analistisin.
    
Aşağıda kullanıcının şirket bilgileri ve analiz etmesi gereken ihalenin tüm detayları bulunmaktadır. Bu verilere dayanarak kullanıcının sorusunu profesyonel, analitik ve stratejik bir dille cevapla.

--- ŞİRKET PROFİLİ ---
${companyContext}

--- İHALE BİLGİLERİ ---
${tenderContext}

Kullanıcı Sorusu: ${message}`;

    const result = await model.generateContent(systemPrompt);
    const aiResponse = result.response.text();

    return NextResponse.json({ text: aiResponse }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ text: "Sistem şu an analiz yapıyor veya meşgul, lütfen birkaç saniye sonra tekrar deneyin." }, { status: 500 });
  }
}