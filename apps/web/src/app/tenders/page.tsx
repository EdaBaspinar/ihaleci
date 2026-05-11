import sql from '../../../../../packages/core/src/db'
import { FileText, MapPin, Award, Bot, ChevronRight } from 'lucide-react'
import Link from 'next/link'

async function getTenders() {
  try {
    return await sql`
      SELECT t.*, m.score, m.reason 
      FROM tenders t
      LEFT JOIN matches m ON t.external_id = m.tender_id
      ORDER BY m.score DESC NULLS LAST
    `
  } catch (error) {
    console.error("Veritabanı bağlantı hatası:", error);
    return [];
  }
}

export default async function TendersPage() {
  const tenders = await getTenders()

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">İhale Analiz Paneli</h2>
          <p className="text-slate-500 mt-2 text-sm">Yapay zeka tarafından kurum yetkinliklerinizle eşleştirilen güncel ihaleler.</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-mono font-bold text-blue-500">{tenders.length}</span>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Toplam Fırsat</p>
        </div>
      </div>

      <div className="grid gap-6">
        {tenders.length > 0 ? (
          tenders.map((tender: any) => (
            <div key={tender.external_id} className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-blue-500/30 transition-all group relative overflow-hidden">
              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 text-xs text-blue-400 font-mono bg-blue-500/5 px-3 py-1 rounded-full border border-blue-500/10">
                      <FileText size={12} />
                      <span>{tender.external_id}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors leading-snug max-w-2xl">{tender.title}</h3>
                    <div className="flex items-center mt-2 text-sm text-slate-500">
                      <MapPin size={14} className="mr-1" />
                      <span>{tender.location}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`text-4xl font-black tracking-tighter ${Number(tender.score) > 50 ? 'text-emerald-500' : 'text-amber-500'}`}>%{tender.score || '0'}</div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mt-1">Match Score</p>
                </div>
              </div>

              {tender.reason && (
                <div className="mt-6 p-5 rounded-2xl bg-slate-950/50 border border-slate-800/50 flex items-start space-x-4">
                  <Award size={20} className="text-amber-500 shrink-0" />
                  <p className="text-sm text-slate-300 italic leading-relaxed">"{tender.reason}"</p>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end">
                <Link 
                  href={`/tenders/${encodeURIComponent(tender.external_id)}`}
                  className="flex items-center space-x-2 px-6 py-3 bg-slate-800 hover:bg-blue-600 text-white rounded-xl transition-all font-bold text-sm group/btn"
                >
                  <Bot size={18} className="text-blue-400 group-hover/btn:text-white" />
                  <span>Şartname Asistanına Sor</span>
                  <ChevronRight size={16} className="opacity-50 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="p-20 text-center border-2 border-dashed border-slate-800 rounded-3xl">
            <p className="text-slate-500 font-medium">Sistemde analiz edilmiş ihale verisi bulunmuyor.</p>
          </div>
        )}
      </div>
    </div>
  )
}