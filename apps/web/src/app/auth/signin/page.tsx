'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Building2, LogIn, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    // Güvenlik duvarına (NextAuth) e-posta ve şifreyi gönderiyoruz
    const result = await signIn('credentials', { 
        email,
        password,
        callbackUrl: '/', // Başarılı olursa Dashboard'a (ana sayfaya) yönlendir
        redirect: false   // Hata alırsak kırmızı çökme ekranına gitmemesi için false yapıyoruz
    })
    
    if (result?.error) {
        setError('Girdiğiniz e-posta adresi veya şifre hatalı.')
        setIsLoading(false)
    } else if (result?.url) {
        // Giriş başarılıysa kullanıcıyı sisteme alıyoruz
        window.location.href = result.url
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/20">
            <Building2 size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">TenderIQ Pro</h1>
          <p className="text-slate-400 mt-2">Sisteme giriş yapın</p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">E-posta Adresi</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@posta.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Şifre</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-400 text-sm text-center font-medium">{error}</p>
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 transform hover:scale-[1.02]"
          >
            {isLoading ? <Loader2 className="animate-spin mr-2" /> : <LogIn className="mr-2" />}
            {isLoading ? 'Doğrulanıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-400 border-t border-slate-800 pt-6">
          Hesabınız yok mu?{' '}
          <Link href="/auth/register" className="text-blue-500 hover:text-blue-400 font-semibold transition-colors">
            Kayıt Ol
          </Link>
        </div>
      </div>
    </div>
  )
}