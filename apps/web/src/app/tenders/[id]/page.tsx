'use client'
import { useState, use } from 'react'
import { Send, Bot, User, ChevronLeft, Paperclip, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function TenderChat({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const tenderId = decodeURIComponent(params.id);

  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: `Merhaba! TenderIQ Asistanı hazır. ${tenderId} numaralı ihaleye ait şartnameyi analiz ettim. Teknik detaylar veya riskler hakkında bana her şeyi sorabilirsin.` 
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false) // Bekleme durumu eklendi

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return
    
    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    const currentInput = input;
    setInput('')
    setIsLoading(true) // Yapay zeka düşünmeye başladı
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput, tenderId: tenderId })
      });

      const data = await response.json();
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.text 
      }])
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Üzgünüm, şu an bağlantı kuramıyorum. Lütfen API anahtarını ve internetini kontrol et!" 
      }])
    } finally {
      setIsLoading(false) // İşlem bitti
    }
  }

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
      {/* Header Kısmı Aynı Kalıyor */}
      <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center backdrop-blur-md">
        <div className="flex items-center space-x-4 text-white">
          <Link href="/tenders" className="p-2 hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-white">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h2 className="font-bold text-base tracking-tight">Şartname Analiz Asistanı</h2>
            <div className="flex items-center space-x-2 mt-0.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">ID: {tenderId} • ANALİZ AKTİF</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mesaj Alanı */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide bg-radial-[circle_at_center] from-slate-900 via-slate-950 to-slate-950">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] flex space-x-4 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-linear-to-br from-blue-600 to-blue-700 text-white' : 'bg-slate-800 border border-slate-700 text-blue-400'}`}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={`p-5 rounded-3xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-800/80 text-slate-200 rounded-tl-none border border-slate-700 backdrop-blur-sm'}`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        
        {/* Yükleniyor Göstergesi */}
        {isLoading && (
          <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
            <div className="flex space-x-4 max-w-[75%]">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-blue-400 flex items-center justify-center shadow-lg">
                <Loader2 size={20} className="animate-spin" />
              </div>
              <div className="p-5 rounded-3xl text-sm bg-slate-800/80 text-slate-400 rounded-tl-none border border-slate-700 italic">
                TenderIQ şartnameyi inceliyor...
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Alanı */}
      <div className="p-8 bg-slate-900/80 border-t border-slate-800 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto relative flex items-center">
          <button className="absolute left-4 text-slate-500 hover:text-blue-400 transition-colors"><Paperclip size={22} /></button>
          <input 
            type="text"
            value={input}
            disabled={isLoading}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={isLoading ? "Asistan cevap veriyor..." : "Şartname hakkında bir soru sorun..."}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-5 pl-14 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all text-white placeholder:text-slate-600 shadow-inner disabled:opacity-50"
          />
          <button 
            onClick={handleSendMessage} 
            disabled={isLoading}
            className="absolute right-3 p-3 bg-linear-to-r from-blue-600 to-cyan-500 text-white rounded-xl shadow-lg active:scale-95 disabled:opacity-50"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
      </div>
    </div>
  )
}