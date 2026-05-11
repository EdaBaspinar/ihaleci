import './globals.css'
import { LayoutDashboard, FileSearch, Building2, Bell, Settings, LogOut } from 'lucide-react'
import Link from 'next/link'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="bg-slate-950 text-slate-50 flex h-screen overflow-hidden font-sans">
        {/* Sidebar */}
        <aside className="w-72 border-r border-slate-800 flex flex-col bg-slate-900/80 backdrop-blur-xl">
          <div className="p-8">
            <div className="text-2xl font-black tracking-tighter bg-linear-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
              TenderIQ <span className="text-xs font-light text-slate-500">PRO</span>
            </div>
          </div>
          
          <nav className="flex-1 px-4 space-y-1">
            <Link href="/" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-800 transition-all text-slate-400 hover:text-white group">
              <LayoutDashboard size={20} className="group-hover:text-blue-400" />
              <span className="font-medium">Dashboard</span>
            </Link>
            <Link href="/tenders" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-800 transition-all text-slate-400 hover:text-white group">
              <FileSearch size={20} className="group-hover:text-blue-400" />
              <span className="font-medium">İhale Analizi</span>
            </Link>
            <Link href="/company" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-800 transition-all text-slate-400 hover:text-white group">
              <Building2 size={20} className="group-hover:text-blue-400" />
              <span className="font-medium">Kurumsal Profil</span>
            </Link>
          </nav>

          <div className="p-4 border-t border-slate-800 space-y-1">
            <button className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-800 text-slate-400 transition-all">
              <Settings size={18} />
              <span className="text-sm">Ayarlar</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-all">
              <LogOut size={18} />
              <span className="text-sm text-red-400">Çıkış Yap</span>
            </button>
          </div>
        </aside>

        {/* İçerik Alanı */}
        <main className="flex-1 overflow-y-auto bg-slate-950">
          <header className="h-20 border-b border-slate-800 flex justify-between items-center px-10 sticky top-0 bg-slate-950/50 backdrop-blur-md z-10">
            <h1 className="text-lg font-medium text-slate-300 italic">Yönetim Paneli</h1>
            <div className="flex items-center space-x-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">Sistem Yöneticisi</p>
                <p className="text-xs text-slate-500">Premium Plan</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-linear-to-br from-blue-600 to-cyan-500 flex items-center justify-center font-bold shadow-lg shadow-blue-500/20">
                SY
              </div>
            </div>
          </header>
          <div className="p-10 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}