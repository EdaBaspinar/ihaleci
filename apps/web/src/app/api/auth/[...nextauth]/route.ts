import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import pool from "../../../../lib/db"; // Veritabanı köprümüz

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "E-posta ve Şifre",
      credentials: {
        email: { label: "E-posta", type: "email", placeholder: "ornek@posta.com" },
        password: { label: "Şifre", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("E-posta ve şifre gereklidir.");
        }

        try {
          // 1. Kullanıcıyı veritabanından e-posta adresine göre bul
          const query = "SELECT * FROM users WHERE email = $1";
          const result = await pool.query(query, [credentials.email]);
          const user = result.rows[0];

          if (!user) {
            throw new Error("Bu e-posta adresi ile kayıtlı bir hesap bulunamadı.");
          }

          // 2. Girilen şifre ile veritabanındaki şifrelenmiş (hash) şifreyi karşılaştır
          const isValidPassword = await bcrypt.compare(credentials.password, user.password_hash);

          if (!isValidPassword) {
            throw new Error("Hatalı şifre girdiniz.");
          }

          // 3. Şifre doğruysa kullanıcı bilgilerini sisteme (oturum) teslim et
          return { id: user.id, email: user.email, name: user.full_name || "Kullanıcı" };
          
        } catch (error: any) {
          console.error("Giriş İşlemi Hatası:", error);
          // Fırlatılan hatalar NextAuth tarafından yakalanıp formda gösterilir
          throw new Error(error.message || "Giriş yapılırken bir hata oluştu.");
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET || "cok-gizli-anahtar-123",
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: "jwt",
  }
});

export { handler as GET, handler as POST };