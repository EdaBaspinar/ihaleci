import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Eğer kullanıcı kayıt sayfasına gitmeye çalışıyorsa, güvenlik kontrolü yapma, izin ver!
  if (request.nextUrl.pathname.startsWith("/auth/register")) {
    return NextResponse.next();
  }

  // Diğer tüm koruma kuralların (eğer varsa) bunun altında çalışmaya devam etsin.
  return NextResponse.next();
}

// Güvenlik duvarının hangi sayfalarda aktif olacağını seçiyoruz
export const config = {
  // Kayıt sayfası hariç, korumak istediğin yerleri buraya yazabilirsin.
  // Şimdilik sistemin önünü açmak için sadece belirli yerleri izletelim:
  matcher: ["/tenders/:path*", "/company/:path*"], 
};