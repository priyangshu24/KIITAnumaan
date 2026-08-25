'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Users } from 'lucide-react'
import {
  sections,
  studentYear,
  facultyRatings,
  getRatingTier,
  getSectionAverageRating,
  getSectionTier,
  tierStyles,
  type Year,
} from '@/lib/section-data'

export default function SectionRatingsSheetPage() {
  const [selectedYear, setSelectedYear] = useState<Year>(studentYear)

  const yearSections = sections.filter((s) => s.year === selectedYear)
  const subjectNames = yearSections[0]?.subjects.map((sub) => sub.name) ?? []

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
          <Link
            href="/workspace/section-swap"
            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#FF453A] font-mono mb-1 hover:text-white transition-colors"
          >
            <ArrowLeft size={12} /> Back to Section Swap
          </Link>
          <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-white tracking-tight leading-none drop-shadow-md">
            Section Ratings Sheet
          </h1>
          <p className="text-xs text-[#A0A0A0] font-normal mt-2 leading-relaxed drop-shadow">
            Every CSE section, every subject, every faculty rating — colour-coded so you can spot the strongest section at a glance.
          </p>
        </div>
      </div>

      {/* ----------------------------------------------------
          TABLE CARD
      ---------------------------------------------------- */}
      <div className="bg-[#111214] border border-white/[0.04] rounded-[24px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.18)] space-y-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[11px] font-mono text-[#71717A] uppercase tracking-wider">
            CSE Faculty Rating Matrix
          </h2>
          <div className="flex items-center gap-2 shrink-0">
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

        {/* Excel-style scrollable table */}
        <div className="overflow-x-auto rounded-[16px] border border-white/[0.06]">
          <table className="w-full border-collapse text-xs min-w-[900px]">
            <thead>
              <tr className="bg-[#0B0B0D] text-[#71717A] font-mono uppercase tracking-wider text-[10px]">
                <th className="p-3 text-left border-b border-r border-white/[0.06] sticky left-0 bg-[#0B0B0D] z-10">Section</th>
                {subjectNames.map((name) => (
                  <th key={name} className="p-3 text-left border-b border-r border-white/[0.06] whitespace-nowrap">{name}</th>
                ))}
                <th className="p-3 text-center border-b border-white/[0.06]">Avg</th>
              </tr>
            </thead>
            <tbody>
              {yearSections.map((section) => {
                const avg = getSectionAverageRating(section)
                const tier = getSectionTier(section)
                const styles = tierStyles[tier]

                return (
                  <tr key={section.code} className={`${styles.rowBg} border-b ${styles.rowBorder} transition-colors`}>
                    <td className={`p-3 border-r border-white/[0.06] sticky left-0 z-10 font-bold text-white whitespace-nowrap ${styles.rowBg}`}>
                      {section.label}
                    </td>
                    {section.subjects.map((sub) => {
                      const theoryRating = facultyRatings[sub.theory] ?? 0
                      const theoryStyles = tierStyles[getRatingTier(theoryRating)]
                      const labRating = sub.lab ? facultyRatings[sub.lab] ?? 0 : null
                      const labStyles = labRating !== null ? tierStyles[getRatingTier(labRating)] : null

                      return (
                        <td key={sub.name} className="p-2.5 border-r border-white/[0.06] align-top">
                          <div className={`flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg border ${theoryStyles.bg} ${theoryStyles.border}`}>
                            <span className={`font-semibold truncate ${theoryStyles.text}`}>Th: {sub.theory}</span>
                            <span className={`font-mono font-bold shrink-0 ${theoryStyles.text}`}>{theoryRating.toFixed(1)}</span>
                          </div>
                          {sub.lab && labStyles && labRating !== null && (
                            <div className={`flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg border mt-1 ${labStyles.bg} ${labStyles.border}`}>
                              <span className={`font-semibold truncate ${labStyles.text}`}>Lab: {sub.lab}</span>
                              <span className={`font-mono font-bold shrink-0 ${labStyles.text}`}>{labRating.toFixed(1)}</span>
                            </div>
                          )}
                        </td>
                      )
                    })}
                    <td className="p-3 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full font-mono font-bold border ${styles.bg} ${styles.text} ${styles.border}`}>
                        {avg.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-white/[0.04] text-[11px] text-[#8A8A8A]">
          <span className="text-[10px] font-mono text-[#71717A] uppercase tracking-wider">Legend:</span>
          {(['blue', 'green', 'yellow', 'red'] as const).map((tier) => (
            <span key={tier} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${tierStyles[tier].bg} border ${tierStyles[tier].border}`} />
              <span className={tierStyles[tier].text}>{tierStyles[tier].label}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
