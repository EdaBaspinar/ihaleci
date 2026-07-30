"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        alert("Kayıt işlemi başarılı. Veriler sunucuya iletildi.");
        // İlerleyen aşamalarda buraya başarılı kayıt sonrası giriş sayfasına yönlendirme eklenecek
      } else {
        alert("Kayıt işlemi sırasında bir sunucu hatası oluştu.");
      }
    } catch (error) {
      console.error("Sistem hatası:", error);
      alert("Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700/50 backdrop-blur-sm">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Hesap Oluştur</h1>
          <p className="mt-2 text-sm text-slate-400">İhale Analiz Asistanı'na hoş geldin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">E-posta Adresi</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white placeholder-slate-500"
              placeholder="ornek@posta.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white placeholder-slate-500"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500 transition-all transform hover:scale-[1.02]"
          >
            Kayıt Ol
          </button>
        </form>

        <div className="text-sm text-center text-slate-400 mt-6 pt-6 border-t border-slate-700/50">
          Zaten hesabın var mı?{" "}
          <Link href="/api/auth/signin" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
            Giriş Yap
          </Link>
        </div>
      </div>
    </div>
  );
}