'use client'

import { useState } from 'react'
import { Building2, Save, Loader2, Briefcase, Hash, Coins, Target, TrendingUp, BarChart, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CompanySetup() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    taxNumber: '',
    industry: '',
    capital: '',
    annualRevenue: '',
    monthlyRevenue: '',
    employeeCount: '',
    skills: '' 
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/company/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Kayıt sırasında bir hata oluştu.')
      }

      router.push('/')
      router.refresh() 

    } catch (err: any) {
      setError(err.message || 'Bir sorun oluştu. Lütfen tekrar deneyin.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/20">
            <Building2 size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Kapsamlı Kurumsal Profil</h1>
          <p className="text-slate-400 mt-2">
            İhale analiz algoritmasının en doğru eşleşmeleri bulabilmesi için finansal ve sektörel yetkinliklerinizi girin.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 shadow-2xl space-y-6">
          
          <div className="space-y-6">
            <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Briefcase className="mr-2 text-blue-400" size={20}/> Temel Şirket Bilgileri
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Şirket Unvanı</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Örn: Apex Veri Teknolojileri A.Ş." className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center"><Hash size={16} className="mr-2 text-slate-400" /> Vergi Numarası</label>
                    <input type="text" name="taxNumber" required value={formData.taxNumber} onChange={handleChange} placeholder="10 Haneli Vergi No" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center"><Target size={16} className="mr-2 text-slate-400" /> Ana Sektör</label>
                    <select name="industry" required value={formData.industry} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-slate-300 focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all">
                      <option value="">Sektör Seçiniz...</option>
                      <option value="Bilişim & Yazılım">Bilişim & Yazılım</option>
                      <option value="İnşaat & Mimarlık">İnşaat & Mimarlık</option>
                      <option value="Sağlık & Medikal">Sağlık & Medikal</option>
                      <option value="Lojistik & Taşıma">Lojistik & Taşıma</option>
                      <option value="Danışmanlık">Danışmanlık</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Coins className="mr-2 text-amber-400" size={20}/> Finansal ve Operasyonel Kapasite
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Kayıtlı Sermaye (₺)</label>
                  <input type="number" name="capital" value={formData.capital} onChange={handleChange} placeholder="Örn: 5000000" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center"><Users size={16} className="mr-2 text-blue-400" /> Toplam Çalışan Sayısı</label>
                  <input type="number" name="employeeCount" value={formData.employeeCount} onChange={handleChange} placeholder="Örn: 32" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center"><BarChart size={16} className="mr-2 text-emerald-400" /> Ortalama Aylık Ciro (₺)</label>
                  <input type="number" name="monthlyRevenue" value={formData.monthlyRevenue} onChange={handleChange} placeholder="Örn: 150000" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center"><TrendingUp size={16} className="mr-2 text-emerald-400" /> Yıllık Ciro (₺)</label>
                  <input type="number" name="annualRevenue" value={formData.annualRevenue} onChange={handleChange} placeholder="Örn: 2000000" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all" />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
               <label className="block text-sm font-medium text-slate-300 mb-2">
                Teknik Yetkinlikler ve Anahtar Kelimeler
              </label>
              <input type="text" name="skills" required value={formData.skills} onChange={handleChange} placeholder="Örn: Yapay Zeka, Veri Analizi, Siber Güvenlik (Virgülle ayırın)" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all" />
            </div>

          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-400 text-sm text-center font-medium">{error}</p>
            </div>
          )}

          <div className="pt-4 border-t border-slate-800">
            <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 transform hover:scale-[1.02]">
              {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
              {isLoading ? 'Kaydediliyor...' : 'Profili Oluştur ve Analize Başla'}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}