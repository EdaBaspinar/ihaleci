'use client'
import { useState } from 'react'
import { Building2, Briefcase, DollarSign, Users, Award, FileBadge, Save, Loader2, CheckCircle2 } from 'lucide-react'

export default function CompanyProfile() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    sector: '',
    capital: '',
    annual_turnover: '',
    total_employees: '',
    technical_employees: '',
    max_past_project_budget: '',
    skills: '', 
    certificates: '' 
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Virgülle girilen yetkinlikleri diziye (array) çeviriyoruz
    const payload = {
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      certificates: formData.certificates.split(',').map(s => s.trim()).filter(Boolean)
    }

    try {
      const response = await fetch('/api/company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        setIsSuccess(true)
        setTimeout(() => setIsSuccess(false), 4000)
        // İsteğe bağlı: Başarılı olunca formu temizleyebilirsin
      }
    } catch (error) {
      console.error('Kayıt hatası:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Kurumsal Kimlik ve Finansal Kapasite</h1>
        <p className="text-slate-400 mt-2">EKAP ihalelerindeki eşleşme skorunuzu artırmak için şirket profilinizi eksiksiz doldurun.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
        
        {/* Başarı Animasyonu */}
        {isSuccess && (
          <div className="absolute inset-0 bg-emerald-900/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-in fade-in duration-300">
            <CheckCircle2 size={80} className="text-emerald-400 mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold text-white">Profil Başarıyla Mühürlendi!</h2>
            <p className="text-emerald-200 mt-2">Veritabanı tablonuz oluşturuldu ve verileriniz kaydedildi.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sol Kolon - Temel Bilgiler */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-blue-400 flex items-center border-b border-slate-800 pb-3">
              <Building2 className="mr-2" size={20} /> Temel Bilgiler
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Şirket Adı</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Örn: Nova Bilişim A.Ş." className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Faaliyet Sektörü</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-3.5 text-slate-500" size={18} />
                <input required type="text" name="sector" value={formData.sector} onChange={handleChange} placeholder="Örn: Yazılım & Bilişim" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Yetkinlikler (Virgülle Ayırın)</label>
              <div className="relative">
                <FileBadge className="absolute left-4 top-3.5 text-slate-500" size={18} />
                <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="Yapay Zeka, Web Geliştirme, Veri Analizi" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Sertifikalar (Virgülle Ayırın)</label>
              <div className="relative">
                <Award className="absolute left-4 top-3.5 text-slate-500" size={18} />
                <input type="text" name="certificates" value={formData.certificates} onChange={handleChange} placeholder="ISO 9001, TSE Hizmet Yeterlilik" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Sağ Kolon - Finansal & Operasyonel */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-emerald-400 flex items-center border-b border-slate-800 pb-3">
              <DollarSign className="mr-2" size={20} /> Finansal & Operasyonel Kapasite
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Şirket Sermayesi (TL)</label>
                <input type="number" name="capital" value={formData.capital} onChange={handleChange} placeholder="5000000" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-emerald-500/50 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Yıllık Ciro (TL)</label>
                <input type="number" name="annual_turnover" value={formData.annual_turnover} onChange={handleChange} placeholder="12500000" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-emerald-500/50 focus:outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center"><Users size={16} className="mr-1"/> Toplam Personel</label>
                <input type="number" name="total_employees" value={formData.total_employees} onChange={handleChange} placeholder="45" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-emerald-500/50 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center"><Users size={16} className="mr-1"/> Teknik Personel</label>
                <input type="number" name="technical_employees" value={formData.technical_employees} onChange={handleChange} placeholder="20" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-emerald-500/50 focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">En Büyük İş Bitirme Tutarı (TL)</label>
              <div className="relative">
                <Award className="absolute left-4 top-3.5 text-slate-500" size={18} />
                <input type="number" name="max_past_project_budget" value={formData.max_past_project_budget} onChange={handleChange} placeholder="8500000" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white focus:ring-2 focus:ring-emerald-500/50 focus:outline-none" />
              </div>
              <p className="text-xs text-slate-500 mt-2">* EKAP ihalelerindeki benzer iş deneyimi puanınızı doğrudan etkiler.</p>
            </div>
          </div>
        </div>

        {/* Alt Kısım - Kaydet Butonu */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex justify-end">
          <button 
            type="submit" 
            disabled={isLoading}
            className="flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 size={22} className="animate-spin mr-2" /> : <Save size={22} className="mr-2" />}
            {isLoading ? 'Sisteme İşleniyor...' : 'Profili Mühürle ve Kaydet'}
          </button>
        </div>
      </form>
    </div>
  )
}