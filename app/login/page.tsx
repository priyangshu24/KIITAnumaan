'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Lock, User } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [roll, setRoll] = useState('22051892')
  const [password, setPassword] = useState('••••••••')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/workspace')
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center p-6 bg-subtle-grid noise-bg">
      <div className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-2xl max-w-md w-full p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#FF3B30] flex items-center justify-center font-black text-white text-sm">
              K
            </div>
            <span className="text-lg font-extrabold tracking-tight text-white">KIITAnumaan</span>
          </Link>
          <h1 className="text-xl font-bold text-white uppercase">Sign In To Workspace</h1>
          <p className="text-xs text-[#9CA3AF]">Enter your official KIIT Student credentials</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="text-[10px] font-bold text-[#6B7280] uppercase block mb-1">Roll Number / Webmail</label>
            <div className="flex items-center bg-[#101010] border border-[rgba(255,255,255,0.08)] rounded-xl px-3 py-2.5 focus-within:border-[#FF3B30]">
              <User size={16} className="text-[#6B7280] mr-2" />
              <input
                type="text"
                value={roll}
                onChange={(e) => setRoll(e.target.value)}
                placeholder="22051892"
                className="w-full bg-transparent text-white outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#6B7280] uppercase block mb-1">Password</label>
            <div className="flex items-center bg-[#101010] border border-[rgba(255,255,255,0.08)] rounded-xl px-3 py-2.5 focus-within:border-[#FF3B30]">
              <Lock size={16} className="text-[#6B7280] mr-2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-white outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#FF3B30] text-white text-xs font-bold uppercase tracking-wider py-3 rounded-xl hover:bg-[#E03126] transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,59,48,0.3)] mt-2"
          >
            Enter Workspace <ArrowRight size={16} />
          </button>
        </form>

        <div className="text-center text-[11px] text-[#6B7280]">
          <Link href="/workspace" className="text-[#FF3B30] hover:underline font-semibold">
            Skip Authentication → Direct Workspace Access
          </Link>
        </div>
      </div>
    </div>
  )
}
