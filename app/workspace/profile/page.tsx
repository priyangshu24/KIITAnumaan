'use client'

import { User, Award, BookOpen, ArrowLeftRight, CheckCircle2 } from 'lucide-react'

export default function StudentProfilePage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-[rgba(255,255,255,0.08)] pb-4">
        <h1 className="text-2xl font-extrabold text-white uppercase">Student Profile</h1>
        <p className="text-xs text-[#6B7280] font-mono">KIIT Academic Identity Card</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-xl p-6 space-y-4 text-center">
          <div className="w-20 h-20 rounded-full bg-[#FF3B30]/20 border-2 border-[#FF3B30] flex items-center justify-center text-[#FF3B30] font-black text-2xl mx-auto shadow-[0_0_20px_rgba(255,59,48,0.4)]">
            SS
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Soumya Samantray</h2>
            <p className="text-xs text-[#FF3B30] font-semibold">Roll: 22051892</p>
            <p className="text-[11px] text-[#6B7280] font-mono">B.Tech Computer Science & Engg</p>
          </div>
          <span className="inline-block px-3 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded-full border border-green-500/30">
            Active Student · Sem 6
          </span>
        </div>

        <div className="md:col-span-2 bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[rgba(255,255,255,0.08)] pb-2">
            Academic Performance Summary
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-[#101010] p-3 rounded-lg border border-[rgba(255,255,255,0.06)]">
              <span className="text-[10px] text-[#6B7280] uppercase font-bold">Cumulative CGPA</span>
              <p className="text-xl font-black text-white mt-1">8.92</p>
            </div>
            <div className="bg-[#101010] p-3 rounded-lg border border-[rgba(255,255,255,0.06)]">
              <span className="text-[10px] text-[#6B7280] uppercase font-bold">Sem 5 SGPA</span>
              <p className="text-xl font-black text-white mt-1">9.10</p>
            </div>
            <div className="bg-[#101010] p-3 rounded-lg border border-[rgba(255,255,255,0.06)]">
              <span className="text-[10px] text-[#6B7280] uppercase font-bold">Backlogs</span>
              <p className="text-xl font-black text-green-400 mt-1">0</p>
            </div>
            <div className="bg-[#101010] p-3 rounded-lg border border-[rgba(255,255,255,0.06)]">
              <span className="text-[10px] text-[#6B7280] uppercase font-bold">Section</span>
              <p className="text-xl font-black text-[#FF3B30] mt-1">CSE-14</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
