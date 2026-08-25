'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeftRight,
  ChevronDown,
  KeyRound,
  ShieldCheck,
  Table2,
  Users,
} from 'lucide-react'
import { sections, studentYear, type Year } from '@/lib/section-data'

export default function SectionSwapPage() {
  const mySection = sections.find((s) => s.isYours)!
  const [selectedYear, setSelectedYear] = useState<Year>(studentYear)
  const [selectedCode, setSelectedCode] = useState('F')
  const [expandedCode, setExpandedCode] = useState<string | null>(null)
  const [theirOtp, setTheirOtp] = useState('')
  const [yourOtp] = useState('482916')

  const target = sections.find((s) => s.code === selectedCode)!
  const visibleSections = sections.filter((s) => s.year === selectedYear)

  const handleVerify = () => {
    if (theirOtp.trim().length !== 6) {
      alert('Enter the 6-digit OTP shared by your swap partner.')
      return
    }
    alert(`Section swap complete! You have been moved to ${target.label}.`)
    setTheirOtp('')
  }

  return (
    <div className="space-y-6 pb-12 w-full text-white">

      {/* ----------------------------------------------------
          TOP BANNER HEADER CARD
      ---------------------------------------------------- */}
      <div className="relative overflow-hidden w-full bg-[#0B0B0D] border border-white/[0.08] rounded-[24px] p-6 lg:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.45)] min-h-[160px] flex items-center">
        <img
          src="/kiit-campus-dotted.jpg"
          alt="KIIT Campus Wireframe Background"
          className="absolute inset-0 w-full h-full object-cover object-[75%_center] opacity-90 pointer-events-none z-0 rounded-[24px]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0D] via-[#0B0B0D]/75 to-transparent pointer-events-none z-10 rounded-[24px]" />

        <div className="relative z-20 space-y-1.5 max-w-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF453A] font-mono block drop-shadow">
            SECTION SWAP · CSE
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-white tracking-tight leading-none drop-shadow-md">
            Exchange Your Section
          </h1>
          <p className="text-xs text-[#A0A0A0] font-normal mt-2 leading-relaxed drop-shadow">
            Compare section ratings, see which faculty takes theory & lab for every CSE section, and complete a secure OTP-verified swap.
          </p>
        </div>
      </div>

      {/* ----------------------------------------------------
          TWO-COLUMN LAYOUT: SECTION RATINGS + OTP EXCHANGE
      ---------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* LEFT: SECTION RATINGS & STRENGTH */}
        <div className="lg:col-span-7 bg-[#111214] border border-white/[0.04] rounded-[24px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.18)] space-y-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[11px] font-mono text-[#71717A] uppercase tracking-wider">
              CSE Section Ratings & Strength
            </h2>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/workspace/section-swap/ratings"
                className="flex items-center gap-1.5 bg-white/[0.04] backdrop-blur-md border border-white/10 text-xs text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-white/[0.08] hover:border-white/20 transition-all"
              >
                <Table2 size={13} className="text-[#FF453A]" /> Ratings Sheet
              </Link>
              <Users size={15} className="text-[#8A8A8A]" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value as Year)}
                className="bg-white/[0.04] backdrop-blur-md border border-white/10 text-xs text-white px-3 py-1.5 rounded-lg outline-none cursor-pointer font-semibold hover:bg-white/[0.08] hover:border-white/20 transition-all focus:border-[#FF453A]/50"
              >
                <option value="1st Year" className="bg-[#111214] text-white">1st Year</option>
                <option value="2nd Year" className="bg-[#111214] text-white">2nd Year</option>
                <option value="3rd Year" className="bg-[#111214] text-white">3rd Year</option>
                <option value="4th Year" className="bg-[#111214] text-white">4th Year</option>
              </select>
            </div>
          </div>

          <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1 scrollbar-none">
            {visibleSections.map((s) => {
              const isSwappable = selectedYear === studentYear && !s.isYours && !s.full
              const isSelected = isSwappable && selectedCode === s.code
              const isExpanded = expandedCode === s.code

              return (
                <div
                  key={s.code}
                  onClick={() => {
                    if (isSwappable) setSelectedCode(s.code)
                  }}
                  className={`rounded-[16px] border transition-all ${
                    s.isYours
                      ? 'bg-amber-500/[0.08] border-amber-500/30'
                      : isSelected
                      ? 'bg-[#FF453A]/10 border-[#FF453A]/40'
                      : s.full
                      ? 'bg-white/[0.02] border-white/[0.04] opacity-60'
                      : `bg-white/[0.02] border-white/[0.04] hover:border-white/15 ${isSwappable ? 'cursor-pointer' : ''}`
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 p-4">
                    <div className="flex items-baseline gap-2 min-w-0">
                      <span className="text-sm font-bold text-white shrink-0">{s.label}</span>
                      <span className="text-xs text-[#8A8A8A] truncate">{s.meta}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-mono text-amber-400 font-bold">
                        faculty {s.rating}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setExpandedCode(isExpanded ? null : s.code)
                        }}
                        className="w-6 h-6 rounded-lg hover:bg-white/10 text-[#8A8A8A] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                        title="View theory & lab faculty"
                      >
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 space-y-1.5 border-t border-white/[0.06] mx-4">
                      {s.subjects.map((sub) => (
                        <div key={sub.name} className="flex items-center justify-between gap-2 text-[11px] pt-1.5">
                          <span className="text-white font-semibold truncate">{sub.name}</span>
                          <span className="text-[#8A8A8A] font-mono text-right shrink-0">
                            Th: {sub.theory}{sub.lab ? ` · Lab: ${sub.lab}` : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* RIGHT: EXCHANGE / OTP VERIFICATION */}
        <div className="lg:col-span-5 bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-[24px] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.45)] space-y-5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF453A] font-mono block">
            EXCHANGE · OTP VERIFICATION
          </span>

          {/* Identity Swap Chips */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 bg-[#0B0B0D] border border-white/10 rounded-xl px-4 py-2.5 text-center">
              <span className="text-sm font-bold text-white">You · {mySection.label}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#FF453A]/10 border border-[#FF453A]/30 flex items-center justify-center shrink-0">
              <ArrowLeftRight size={14} className="text-[#FF453A]" />
            </div>
            <div className="flex-1 bg-[#0B0B0D] border border-white/10 rounded-xl px-4 py-2.5 text-center">
              <span className="text-sm font-bold text-white">{target.peer} · {target.label}</span>
            </div>
          </div>

          {/* Their OTP Input */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono text-[#71717A] uppercase tracking-wider">Their OTP</span>
            <div className="relative">
              <KeyRound size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8A8A]" />
              <input
                type="text"
                maxLength={6}
                value={theirOtp}
                onChange={(e) => setTheirOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="6 digits"
                className="w-full bg-[#0B0B0D] border border-white/10 text-sm text-white pl-10 pr-4 py-3 rounded-xl outline-none font-mono tracking-widest placeholder:text-[#6B7280] placeholder:tracking-normal focus:border-[#FF453A]/50 transition-all"
              />
            </div>
          </div>

          {/* Your OTP Display */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono text-[#71717A] uppercase tracking-wider">Your OTP</span>
            <div className="flex items-center gap-1.5">
              {yourOtp.split('').map((digit, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-[#0B0B0D] border border-white/10 rounded-lg py-2.5 text-center text-base font-mono font-bold text-white"
                >
                  {digit}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleVerify}
            className="w-full bg-[#FF453A] hover:bg-[#FF453A]/90 text-white text-sm font-bold rounded-[14px] h-[48px] transition-all flex items-center justify-center gap-2 shadow-md shadow-[#FF453A]/20 cursor-pointer"
          >
            <ShieldCheck size={16} /> Verify & Complete Exchange
          </button>

          <p className="text-[11px] text-[#6B7280] font-mono text-center">
            Both students must enter the other&rsquo;s code.
          </p>
        </div>

      </div>
    </div>
  )
}
