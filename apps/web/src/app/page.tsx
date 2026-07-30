import { BarChart3, Building2, FileText, TrendingUp, Zap } from 'lucide-react'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import sql from '../../../../packages/core/src/db'
import LogoutButton from '../components/LogoutButton'

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  let currentUser: any = null;
  try {
    const users = await sql`SELECT * FROM users WHERE email = ${session.user.email}`;
    currentUser = users[0];
  } catch (error) {
    console.error(error);
  }

  if (!currentUser?.company_id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
        <div className="text-center bg-slate-900 border border-slate-800 p-12 rounded-[2.5rem] shadow-2xl max-w-lg">
          <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-blue-500/20">
            <Building2 size={40} className="text-blue-500" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Şirket Profiliniz Eksik</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            TenderIQ algoritmasının ihaleleri analiz edip eşleştirme yapabilmesi için öncelikle kurumsal profilinizi tanımlamanız gerekmektedir.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/company/setup" className="inline-flex items-center justify-center w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02]">
              Kurumsal Profil Oluştur
            </Link>
            <LogoutButton />
          </div>
        </div>
      </div>
    );
  }

  let company: any = null;
  try {
    const companies = await sql`SELECT * FROM companies WHERE id = ${currentUser.company_id}`;
    company = companies[0] || null;
  } catch (error) {
    console.error(error);
  }

  let rawTenders: any[] = [];
  try {
    rawTenders = await sql`SELECT * FROM tenders ORDER BY created_at DESC LIMIT 20`;
  } catch (error) {
    console.error(error);
  }

  const tendersWithScores = rawTenders.map(tender => {
    let score = 35; 
    let matchReasons: string[] = []; 

    if (company) {
      const searchSpace = (tender.title + " " + tender.agency).toLowerCase();
      
      if (searchSpace.includes("yazılım") || searchSpace.includes("bilişim") || searchSpace.includes("sistem")) {
        score += 20;
        matchReasons.push("Sektörel Uyum");
      }

      if (company.skills && Array.isArray(company.skills)) {
        company.skills.forEach((skill: string) => {
          if (searchSpace.includes(skill.toLowerCase())) {
            score += 15;
            matchReasons.push(skill);
          }
        });
      }

      if (company.capital && Number(company.capital) > 5000000) {
        score += 10;
        matchReasons.push("Güçlü Finansal Kapasite");
      }
    }

    score = Math.min(score, 98);

    return {
      ...tender,
      matchScore: score,
      matchReasons: matchReasons.slice(0, 2)
    };
  });

  const sortedTenders = tendersWithScores.sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);
  const totalAnalyzed = rawTenders.length;
  const highMatchCount = sortedTenders.filter(t => t.matchScore > 75).length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-[2rem] border border-slate-700 shadow-2xl">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center">
            Hoş Geldiniz, <span className="text-blue-400 ml-2">{company ? company.name : 'Kullanıcı'}</span>
          </h1>
          <p className="text-slate-400 mt-2 flex items-center">
            <Zap size={16} className="text-amber-400 mr-2" /> 
            TenderIQ Algoritması profilinize uygun ihaleleri analiz ediyor.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
           <Link href="/company/setup" className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-medium rounded-xl transition-all shadow-lg">
            Profili Güncelle
          </Link>
          <LogoutButton />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex items-center space-x-4">
          <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-400"><FileText size={28} /></div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Taranan İhale</p>
            <h3 className="text-3xl font-bold text-white">{totalAnalyzed}</h3>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex items-center space-x-4">
          <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400"><TrendingUp size={28} /></div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Yüksek Eşleşme ({" >%75 "})</p>
            <h3 className="text-3xl font-bold text-white">{highMatchCount}</h3>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex items-center space-x-4">
          <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-400"><Building2 size={28} /></div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Sistemdeki Sermaye</p>
            <h3 className="text-xl font-bold text-white">
              {company && company.capital ? `₺${(Number(company.capital) / 1000000).toFixed(1)}M` : 'Eksik'}
            </h3>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <BarChart3 className="mr-3 text-blue-400" size={24}/> Sizin İçin En İyi Eşleşmeler
          </h2>
        </div>

        <div className="space-y-4">
          {sortedTenders.length > 0 ? sortedTenders.map((tender, i) => {
            const currentId = tender.tender_id || tender.ihale_kayit_no || tender.id || tender.ihale_no || 'Bilinmiyor';

            return (
            <div key={i} className="group p-6 bg-slate-950 border border-slate-800 rounded-2xl hover:border-slate-600 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="px-3 py-1 bg-slate-800 text-xs font-bold rounded-lg text-slate-300">
                    Ref: {String(currentId).substring(0, 8).toUpperCase()}
                  </span>
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-lg">
                    {tender.city || 'Genel'}
                  </span>
                  {tender.matchReasons.map((reason: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/20">
                      ✨ {reason}
                    </span>
                  ))}
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                  {tender.title}
                </h3>
                <p className="text-slate-400 text-sm mt-1">{tender.agency}</p>
              </div>
              
              <div className="flex items-center space-x-6 w-full md:w-auto justify-between md:justify-end">
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Eşleşme</p>
                  <div className={`text-2xl font-black ${tender.matchScore >= 80 ? 'text-emerald-400' : tender.matchScore >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                    %{tender.matchScore}
                  </div>
                </div>
                
                <Link href={`/tenders/${encodeURIComponent(currentId)}`} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all">
                  Analiz Et
                </Link>
              </div>
            </div>
          )}) : (
            <div className="text-center py-10 text-slate-500">
              Henüz sistemde ihale verisi bulunmuyor.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}