'use client'
import { useState } from 'react'
import { Building2, MapPin, Briefcase, Tags, Save, CheckCircle2, Loader2 } from 'lucide-react'

export default function CompanyProfilePage() {
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // Yüklenme animasyonu için state
  
  // Form verilerini tutan state'ler
  const [companyName, setCompanyName] = useState("TechNova Bilişim A.Ş.")
  const [location, setLocation] = useState("İstanbul, Türkiye")
  const [sector, setSector] = useState("Yazılım & Bilişim")
  const [skills, setSkills] = useState(['Veri Analizi', 'Yapay Zeka', 'Web Geliştirme', 'Makine Öğrenmesi', 'Bulut Bilişim'])
  const [newSkill, setNewSkill] = useState("")

  // Yetkinlik Ekleme Fonksiyonu
  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newSkill.trim() !== '') {
      if (!skills.includes(newSkill.trim())) {
        setSkills([...skills, newSkill.trim()])
      }
      setNewSkill("")
    }
  }

  // Yetkinlik Silme Fonksiyonu
  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove))
  }

  // Gerçek Veritabanı Kayıt Fonksiyonu
  const handleSave = async () => {
    setIsLoading(true);
    
    // Backend'e gönderilecek paket
    const profileData = {
      name: companyName,
      location: location,
      sector: sector,
      skills: skills
    };

    try {
      // Yazdığımız API'ye POST isteği atıyoruz
      const response = await fetch('/api/company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      } else {
        alert("Kayıt sırasında bir hata oluştu!");
      }
    } catch (error) {
      console.error("Kayıt Hatası:", error);
      alert("Sunucuya bağlanılamadı!");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      {/* Başlık Alanı */}
      <div className="border-b border-slate-800 pb-6">
        <h2 className="text-3xl font-bold tracking-tight text-white">Kurumsal Profil</h2>
        <p className="text-slate-500 mt-2 text-sm">
          TenderIQ yapay zekasının ihaleleri firmanızla eşleştirmesi için yetkinliklerinizi belirleyin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sol Taraf: Form */}
        <div className="md:col-span-2 space-y-6">
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center mb-6">
              <Building2 className="text-blue-500 mr-3" size={24} />
              Firma Bilgileri
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Firma Adı</label>
                <input 
                  type="text" 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="flex items-center text-sm font-medium text-slate-400 mb-2">
                    <MapPin size={16} className="mr-1" /> Merkez Konum
                  </label>
                  <input 
                    type="text" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-slate-400 mb-2">
                    <Briefcase size={16} className="mr-1" /> Sektör
                  </label>
                  <select 
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all appearance-none"
                  >
                    <option>Yazılım & Bilişim</option>
                    <option>Savunma Sanayi</option>
                    <option>İnşaat & Mimarlık</option>
                    <option>Sağlık & Medikal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-slate-400 mb-2">
                  <Tags size={16} className="mr-1" /> Teknik Yetkinlikler (Enter'a basarak ekleyin)
                </label>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-sm flex items-center">
                        {skill}
                        <button onClick={() => handleRemoveSkill(skill)} className="ml-2 hover:text-white transition-colors">×</button>
                      </span>
                    ))}
                  </div>
                  <input 
                    type="text" 
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={handleAddSkill}
                    placeholder="Yeni yetkinlik ekle ve Enter'a bas..."
                    className="w-full bg-transparent text-sm text-white focus:outline-none placeholder:text-slate-600"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 flex justify-end">
              <button 
                onClick={handleSave}
                disabled={isLoading}
                className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${
                  isSaved 
                    ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                    : isLoading
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      : 'bg-linear-to-r from-blue-600 to-cyan-500 text-white hover:shadow-blue-500/20 active:scale-95'
                }`}
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : isSaved ? <CheckCircle2 size={18} /> : <Save size={18} />}
                <span>{isLoading ? 'Kaydediliyor...' : isSaved ? 'Kaydedildi' : 'Profili Kaydet'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sağ Taraf: AI Bilgi Kartı */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-linear-to-b from-slate-800 to-slate-900 border border-slate-700 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full blur-xl"></div>
            <h4 className="text-white font-bold mb-3 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
              TenderIQ Analiz Motoru
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Bu ekranda girdiğiniz yetkinlikler, <span className="text-blue-400 font-medium">Yapay Zeka</span> modeli tarafından şartnamelerle karşılaştırılarak "Match Score" hesaplamasında kullanılır.
            </p>
            <div className="mt-6 p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
              <p className="text-xs text-slate-500 font-mono">
                SİSTEM DURUMU:
                <br/><span className="text-emerald-400 mt-1 block">✔ Veritabanı Bağlantısı Aktif</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}