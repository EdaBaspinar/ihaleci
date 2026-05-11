import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import sql from "../../../../../../packages/core/src/db";

export async function POST(req: Request) {
  const apiKey = process.env.GOOGLE_AI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "API Anahtarı eksik!" }, { status: 500 });
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const { message, tenderId } = await req.json();

    const [tender] = await sql`SELECT * FROM tenders WHERE external_id = ${tenderId}`;

    // 🚀 FATURA AKTİF OLDUĞU İÇİN ARTIK 2.0 SÜRÜMÜNÜ KULLANABİLİRİZ
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      Sen TenderIQ şirketinin profesyonel ihale analiz asistanısın. 
      Analiz edilecek ihale: ${tender?.title || 'Belirtilmemiş'}
      Konum: ${tender?.location || 'Belirtilmemiş'}
      Şartname: ${tender?.description || 'Detay yok.'}
      
      Kullanıcı Sorusu: ${message}
      
      Yanıtını profesyonel, net ve sadece yukarıdaki verilere dayanarak ver.
    `;

    const result = await model.generateContent(prompt);
    return NextResponse.json({ text: result.response.text() });

  } catch (error: any) {
    console.error("Gemini API Hatası:", error);
    // Hatayı ekranda net görebilmek için error.message'ı text içine yazdırıyoruz
    return NextResponse.json({ text: "Bir hata oluştu: " + error.message });
  }
}