'use client'

import {
  Mail,
  MapPin,
  Code2,
  Contact2,
  Globe,
  FileCheck,
  ArrowLeftRight,
  FileText,
  Award,
  Trophy,
  Flame,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react'
import Link from 'next/link'

const semesterHistory = [
  { sem: 'Sem 1', sgpa: 8.4 },
  { sem: 'Sem 2', sgpa: 8.65 },
  { sem: 'Sem 3', sgpa: 8.8 },
  { sem: 'Sem 4', sgpa: 8.95 },
  { sem: 'Sem 5', sgpa: 9.1 },
]

const skills = ['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'C++', 'SQL', 'Docker', 'System Design']

const achievements = [
  { title: "Dean's List", detail: 'Top 5% of CSE Batch 2025-26', icon: Award },
  { title: 'HackX Winner', detail: 'KIIT HackX 2025 — 1st Place', icon: Trophy },
  { title: '12-Day Streak', detail: 'Daily notes & revision streak', icon: Flame },
]

const quickActions = [
  { name: 'Resume Builder', href: '/workspace/career', icon: FileCheck },
  { name: 'Section Swap', href: '/workspace/section-swap', icon: ArrowLeftRight },
  { name: 'Notes Library', href: '/workspace/academic/notes-library', icon: FileText },
]

export default function StudentProfilePage() {
  const cgpa = 8.92
  const currentSgpa = 9.1
  const backlogs = 0
  const section = 'CSE-14'
  const placementReadiness = 82

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
            STUDENT PROFILE
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-white tracking-tight leading-none drop-shadow-md">
            Your KIIT Identity & Journey
          </h1>
          <p className="text-xs text-[#A0A0A0] font-normal mt-2 leading-relaxed drop-shadow">
            Academic record, skills, achievements and placement readiness — all in one identity card.
          </p>
        </div>
      </div>

      {/* ----------------------------------------------------
          MAIN GRID
      ---------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* LEFT: IDENTITY CARD */}
        <div className="lg:col-span-4 bg-[#111214] border border-white/[0.04] rounded-[24px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.18)] space-y-5">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-20 h-20 rounded-full bg-[#FF453A]/15 border-2 border-[#FF453A] flex items-center justify-center text-[#FF453A] font-black text-2xl shadow-[0_0_24px_rgba(255,69,58,0.35)]">
              SS
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Soumya Samantray</h2>
              <p className="text-xs text-[#FF453A] font-semibold mt-0.5">Roll: 22051892</p>
              <p className="text-[11px] text-[#8A8A8A] font-mono mt-0.5">B.Tech Computer Science & Engg</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active · Sem 6
              </span>
              <span className="px-3 py-1 bg-white/[0.04] text-[#8A8A8A] text-[10px] font-bold rounded-full border border-white/10 font-mono">
                {section}
              </span>
            </div>
          </div>

          <div className="h-[1px] bg-white/[0.04]" />

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2.5 text-[#9CA3AF]">
              <Mail size={13} className="text-[#FF453A] shrink-0" />
              <span className="font-mono">soumya.samantray@kiit.ac.in</span>
            </div>
            <div className="flex items-center gap-2.5 text-[#9CA3AF]">
              <MapPin size={13} className="text-[#FF453A] shrink-0" />
              <span>Campus 15, Patia, Bhubaneswar</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <a
              href="https://github.com/soumyasamantray"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 bg-[#0B0B0D] border border-white/10 hover:border-[#FF453A]/40 text-white text-[11px] font-semibold py-2 rounded-[10px] transition-all"
            >
              <Code2 size={13} /> GitHub
            </a>
            <a
              href="https://linkedin.com/in/soumyasamantray"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 bg-[#0B0B0D] border border-white/10 hover:border-[#FF453A]/40 text-white text-[11px] font-semibold py-2 rounded-[10px] transition-all"
            >
              <Contact2 size={13} /> LinkedIn
            </a>
            <a
              href="#"
              className="flex items-center justify-center gap-1.5 bg-[#0B0B0D] border border-white/10 hover:border-[#FF453A]/40 text-white text-[11px] font-semibold py-2 rounded-[10px] transition-all"
            >
              <Globe size={13} /> Portfolio
            </a>
          </div>

          {/* Placement Readiness Meter */}
          <div className="bg-[#0B0B0D] border border-white/[0.05] rounded-[16px] p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#71717A] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-[#FF453A]" /> Placement Readiness
              </span>
              <span className="text-xs font-bold text-white">{placementReadiness}%</span>
            </div>
            <div className="w-full bg-[#111214] h-2 rounded-full overflow-hidden border border-white/5">
              <div className="h-full rounded-full bg-gradient-to-r from-[#FF453A] to-amber-400" style={{ width: `${placementReadiness}%` }} />
            </div>
            <p className="text-[10px] text-[#6B7280]">Based on resume ATS score, CGPA & profile completeness</p>
          </div>
        </div>

        {/* RIGHT: DETAILS */}
        <div className="lg:col-span-8 space-y-6">

          {/* Academic Performance Summary */}
          <div className="bg-[#111214] border border-white/[0.04] rounded-[24px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.18)] space-y-4">
            <span className="text-[11px] font-mono text-[#71717A] uppercase tracking-wider">
              Academic Performance Summary
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="bg-[#0B0B0D] p-3.5 rounded-[14px] border border-white/[0.05]">
                <span className="text-[10px] text-[#6B7280] uppercase font-bold">Cumulative CGPA</span>
                <p className="text-2xl font-black text-white mt-1">{cgpa}</p>
              </div>
              <div className="bg-[#0B0B0D] p-3.5 rounded-[14px] border border-white/[0.05]">
                <span className="text-[10px] text-[#6B7280] uppercase font-bold">Sem 5 SGPA</span>
                <p className="text-2xl font-black text-white mt-1">{currentSgpa}</p>
              </div>
              <div className="bg-[#0B0B0D] p-3.5 rounded-[14px] border border-white/[0.05]">
                <span className="text-[10px] text-[#6B7280] uppercase font-bold">Backlogs</span>
                <p className="text-2xl font-black text-emerald-400 mt-1">{backlogs}</p>
              </div>
              <div className="bg-[#0B0B0D] p-3.5 rounded-[14px] border border-white/[0.05]">
                <span className="text-[10px] text-[#6B7280] uppercase font-bold">Section</span>
                <p className="text-2xl font-black text-[#FF453A] mt-1">{section}</p>
              </div>
            </div>
          </div>

          {/* Semester-wise SGPA Trend */}
          <div className="bg-[#111214] border border-white/[0.04] rounded-[24px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.18)] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#71717A] uppercase tracking-wider">
                Semester-wise SGPA Trend
              </span>
              <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                <TrendingUp size={12} /> Trending up
              </span>
            </div>
            <div className="space-y-2.5">
              {semesterHistory.map((s) => (
                <div key={s.sem} className="flex items-center gap-3">
                  <span className="text-[11px] text-[#8A8A8A] font-mono w-12 shrink-0">{s.sem}</span>
                  <div className="flex-1 bg-[#0B0B0D] h-2.5 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="h-full rounded-full bg-[#FF453A]"
                      style={{ width: `${(s.sgpa / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-white w-8 shrink-0 text-right">{s.sgpa}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="bg-[#111214] border border-white/[0.04] rounded-[24px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.18)] space-y-4">
            <span className="text-[11px] font-mono text-[#71717A] uppercase tracking-wider">Skills</span>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-[10px] bg-[#0B0B0D] border border-white/10 text-xs font-semibold text-white"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-[#111214] border border-white/[0.04] rounded-[24px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.18)] space-y-4">
            <span className="text-[11px] font-mono text-[#71717A] uppercase tracking-wider">Achievements</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {achievements.map((a) => {
                const AchIcon = a.icon
                return (
                  <div
                    key={a.title}
                    className="bg-[#0B0B0D] border border-white/[0.05] rounded-[14px] p-3.5 flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#FF453A]/10 border border-[#FF453A]/20 flex items-center justify-center text-[#FF453A] shrink-0">
                      <AchIcon size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{a.title}</p>
                      <p className="text-[10px] text-[#8A8A8A] mt-0.5 leading-relaxed">{a.detail}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-[24px] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.45)] space-y-4">
            <span className="text-[11px] font-mono text-[#71717A] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={12} className="text-[#FF453A]" /> Quick Actions
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {quickActions.map((action) => {
                const ActionIcon = action.icon
                return (
                  <Link
                    key={action.name}
                    href={action.href}
                    className="flex items-center justify-between bg-[#0B0B0D] border border-white/10 hover:border-[#FF453A]/40 px-4 py-3 rounded-[12px] transition-all group"
                  >
                    <span className="flex items-center gap-2 text-xs font-semibold text-white">
                      <ActionIcon size={14} className="text-[#FF453A]" /> {action.name}
                    </span>
                    <ExternalLink size={12} className="text-[#6B7280] group-hover:text-white transition-colors" />
                  </Link>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
