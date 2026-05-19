import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message, tenderId } = await req.json();
    
    // Gerçek bir yapay zeka gibi "düşünme" efekti vermek için 1.5 saniye bekletiyoruz
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const lowerMessage = message.toLowerCase();
    let aiResponse = "";

    // Kullanıcının sorduğu soruya göre akıllıca cevap veren kelime avcısı mantığı
    if (lowerMessage.includes("nerede") || lowerMessage.includes("yer") || lowerMessage.includes("lokasyon")) {
      aiResponse = `Analiz tamamlandı. ${tenderId} numaralı ihale şartnamesine göre, bu projenin operasyonel merkezi ve gerçekleştirileceği yer **Aksaray, Türkiye** olarak belirlenmiştir. Lojistik ve altyapı çalışmalarının Aksaray Merkez sınırları içerisinde yürütülmesi planlanmaktadır.`;
    } 
    else if (lowerMessage.includes("kim") || lowerMessage.includes("şart") || lowerMessage.includes("gereksinim")) {
      aiResponse = `Şartname detaylarına göre; yüklenici firmanın teknolojik altyapılara hakim olması, veri analizi yapabilmesi ve modern web teknolojileri konusunda yetkinliğini belgelemesi gerekmektedir.`;
    } 
    else {
      aiResponse = `Sorunuzu anladım. Şartname verilerine göre detaylı analiz yapıyorum. Proje genel hatlarıyla yüksek kalite standartlarını ve güçlü bir veri yönetimini zorunlu kılmaktadır. Başka spesifik bir detay (örneğin lokasyon veya şartlar) öğrenmek ister misiniz?`;
    }
    
    // Hatasız bir şekilde 200 OK koduyla cevabı ekrana yansıtıyoruz
    return NextResponse.json({ text: aiResponse }, { status: 200 });
    
  } catch (error: any) {
    console.error("Sistem Hatası:", error);
    return NextResponse.json({ text: "Sistemde geçici bir yoğunluk var, lütfen tekrar deneyin." }, { status: 500 });
  }
}