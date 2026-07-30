'use client'

import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/auth/signin' })}
      className="flex items-center px-6 py-3 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 text-red-500 font-medium rounded-xl transition-all shadow-lg"
    >
      <LogOut size={18} className="mr-2" />
      Çıkış Yap
    </button>
  )
}