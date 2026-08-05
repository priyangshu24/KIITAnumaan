'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FileCheck,
  Sparkles,
  Target,
  Award,
  Bot,
  Download,
  Eye,
  Send,
  Briefcase,
  TrendingUp,
  Building2,
  CheckCircle2,
  Clock,
  Zap,
} from 'lucide-react'

// Navigation tab types
type CareerTab = 'resume' | 'ats' | 'placement' | 'blueprint' | 'mentor'

const companyDrives = [
  {
    id: 'c-1',
    company: 'Microsoft',
    tier: 'Super Dream (>20 LPA)',
    ctc: '₹44.0 LPA',
    role: 'Software Development Engineer-1',
    deadline: '2026-08-15',
    eligibility: 'CGPA 8.5+ · CSE / IT / CSSE',
    stages: 'OA (Coding) -> Tech Round 1 -> Tech Round 2 -> HR',
    status: 'Applied',
  },
  {
    id: 'c-2',
    company: 'HighRadius',
    tier: 'Day-1 Recruiter',
    ctc: '₹8.0 LPA',
    role: 'Consulting Trainee / Software Engineer',
    deadline: '2026-08-10',
    eligibility: 'CGPA 7.0+ · All Tech Branches',
    stages: 'Aptitude Test -> Tech Round -> HR Round',
    status: 'OA Scheduled',
  },
  {
    id: 'c-3',
    company: 'Deloitte USI',
    tier: 'Dream (8-15 LPA)',
    ctc: '₹9.5 LPA',
    role: 'Analyst - Technology Consulting',
    deadline: '2026-08-20',
    eligibility: 'CGPA 7.5+ · No active backlogs',
    stages: 'Online Assessment -> Technical Interview -> HR',
    status: 'Registered',
  },
  {
    id: 'c-4',
    company: 'PwC India',
    tier: 'Dream (8-15 LPA)',
    ctc: '₹8.5 LPA',
    role: 'Cybersecurity & Tech Advisory',
    deadline: '2026-08-22',
    eligibility: 'CGPA 7.0+ · CSE / ECE',
    stages: 'Assessment -> Technical Round -> HR',
    status: 'Open',
  },
]

export default function CareerWorkspacePage() {
  const [activeTab, setActiveTab] = useState<CareerTab>('resume')
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)

  // Resume Builder state
  const [builderMode, setBuilderMode] = useState<'manual' | 'ai'>('manual')
  const [resumeName, setResumeName] = useState('Soumya Samantray')
  const [resumeRole, setRole] = useState('Full Stack Software Engineer')
  const [resumeCgpa, setCgpa] = useState('8.92')
  const [resumeTemplate, setTemplate] = useState('minimal')

  // ATS Checker state
  const [resumeText, setResumeText] = useState(
    'Soumya Samantray | Roll: 22051892 | KIIT CSE\nSkills: React, Next.js, TypeScript, Node.js, C++, Data Structures, OS, SQL.\nProjects: KIITAnumaan SaaS, Realtime Collaborative Canvas.\nExperience: Software Intern at Tech Corp.'
  )
  const [targetJd, setTargetJd] = useState(
    'Software Engineer at HighRadius. Requires React, TypeScript, Java, Spring Boot, Microservices, System Design, SQL, Docker.'
  )
  const [atsAnalyzed] = useState(true)

  // Mentor Chat state
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello Soumya! I am your AI Placement Mentor. HighRadius online assessment is scheduled in 10 days. Would you like a 10-day preparation sprint for Operating Systems & SQL?',
    },
  ])

  const handleSendChat = () => {
    if (!chatInput.trim()) return
    const newMsg = { sender: 'user', text: chatInput }
    setChatMessages((prev) => [...prev, newMsg])
    setChatInput('')
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Great focus! For HighRadius, focus heavily on SQL Join queries, B-Trees index optimization, process scheduling numericals, and 2 medium LeetCode array questions daily.',
        },
      ])
    }, 600)
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto text-white pb-12">
      {/* ----------------------------------------------------
          TOP NAVIGATION CARD (Animated Capsule Bar)
      ---------------------------------------------------- */}
      <div className="flex justify-center">
        <div
          onMouseLeave={() => setHoveredTab(null)}
          className="bg-[#111214] border border-white/[0.04] rounded-full p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.18)] inline-flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none max-w-full"
        >
          {[
            { id: 'resume', name: 'Resume Builder', icon: FileCheck },
            { id: 'ats', name: 'ATS Checker', icon: Sparkles },
            { id: 'placement', name: 'Placement Planner', icon: Target },
            { id: 'blueprint', name: 'AI Blueprint', icon: Award },
            { id: 'mentor', name: 'AI Mentor', icon: Bot },
          ].map((nav) => {
            const NavIcon = nav.icon
            const isActive = activeTab === nav.id
            const isHovered = hoveredTab === nav.id
            return (
              <button
                key={nav.id}
                onClick={() => setActiveTab(nav.id as CareerTab)}
                onMouseEnter={() => setHoveredTab(nav.id)}
                className={`relative px-5 py-2.5 rounded-full text-xs font-medium transition-colors duration-200 flex flex-col items-center justify-center whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-[#8A8A8A] hover:text-white'
                }`}
              >
                {/* Hover Spotlight Pill with Framer Motion Animation */}
                {isHovered && !isActive && (
                  <motion.div
                    layoutId="hoverCareerTabPill"
                    className="absolute inset-0 bg-white/[0.05] rounded-full z-0 pointer-events-none"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}

                {/* Active Pill Container with Framer Motion Layout Animation */}
                {isActive && (
                  <motion.div
                    layoutId="activeCareerTabPill"
                    className="absolute inset-0 bg-white/[0.08] border border-white/15 rounded-full shadow-inner z-0 pointer-events-none"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}

                <div className="relative z-10 flex items-center gap-2">
                  <NavIcon
                    size={15}
                    className={isActive ? 'text-[#FF4D4D]' : isHovered ? 'text-white' : 'text-[#8A8A8A]'}
                  />
                  <span>{nav.name}</span>
                </div>

                {/* Centered Red Dash with Framer Motion Layout Animation */}
                {isActive && (
                  <motion.span
                    layoutId="activeCareerTabRedDash"
                    className="relative z-10 w-3.5 h-[2.5px] bg-[#FF4D4D] rounded-full mt-1 shadow-sm block"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ----------------------------------------------------
          TAB 1: RESUME BUILDER
      ---------------------------------------------------- */}
      {activeTab === 'resume' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT COLUMN (70% -> lg:col-span-8) */}
          <div className="lg:col-span-8 bg-[#111214] border border-white/[0.04] rounded-[20px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.18)] flex flex-col justify-between space-y-5 hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[18px] font-semibold text-white tracking-tight">
                  Interactive Resume Form Editor
                </h2>
                <p className="text-xs text-[#8A8A8A] mt-0.5">
                  Build ATS-optimized resumes targeted for top tier tech recruiters
                </p>
              </div>

              <div className="flex items-center bg-[#0B0B0D] border border-white/[0.06] p-1 rounded-full text-xs">
                <button
                  onClick={() => setBuilderMode('manual')}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                    builderMode === 'manual'
                      ? 'bg-white/10 text-white font-semibold'
                      : 'text-[#8A8A8A] hover:text-white'
                  }`}
                >
                  Manual Editor
                </button>
                <button
                  onClick={() => setBuilderMode('ai')}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                    builderMode === 'ai'
                      ? 'bg-[#FF4D4D] text-white font-semibold'
                      : 'text-[#8A8A8A] hover:text-white'
                  }`}
                >
                  AI Copilot
                </button>
              </div>
            </div>

            <div className="bg-[#0B0B0D] border border-white/[0.05] rounded-[16px] p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-mono text-[#71717A] uppercase block mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={resumeName}
                    onChange={(e) => setResumeName(e.target.value)}
                    className="w-full bg-[#111214] border border-white/10 text-white text-xs p-3 rounded-[12px] outline-none font-medium focus:border-[#FF4D4D] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#71717A] uppercase block mb-1.5">
                    Target Role Headline
                  </label>
                  <input
                    type="text"
                    value={resumeRole}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-[#111214] border border-white/10 text-white text-xs p-3 rounded-[12px] outline-none font-medium focus:border-[#FF4D4D] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-mono text-[#71717A] uppercase block mb-1.5">
                    KIIT CGPA
                  </label>
                  <input
                    type="text"
                    value={resumeCgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                    className="w-full bg-[#111214] border border-white/10 text-white text-xs p-3 rounded-[12px] outline-none font-mono focus:border-[#FF4D4D] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-[#71717A] uppercase block mb-1.5">
                    Template Format
                  </label>
                  <select
                    value={resumeTemplate}
                    onChange={(e) => setTemplate(e.target.value)}
                    className="w-full bg-[#111214] border border-white/10 text-white text-xs p-3 rounded-[12px] outline-none font-medium focus:border-[#FF4D4D] transition-colors"
                  >
                    <option value="minimal">Minimal Single-Page (ATS Optimized)</option>
                    <option value="modern">Modern Executive Tier</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => alert('Downloading PDF Resume...')}
                className="bg-[#FF4D4D] hover:brightness-110 text-white text-xs font-bold uppercase tracking-wider rounded-[14px] h-[44px] px-6 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download size={15} /> Export Resume PDF
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN (30% -> lg:col-span-4) */}
          <div className="lg:col-span-4 bg-[#111214] border border-white/[0.04] rounded-[20px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.18)] flex flex-col justify-between space-y-5 hover:-translate-y-0.5 transition-all duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-[#FF4D4D]/10 text-[#FF4D4D] border border-[#FF4D4D]/20 text-[10px] uppercase font-bold tracking-wider inline-block">
                  Live Preview
                </span>
                <span className="text-[11px] font-mono text-[#8A8A8A] flex items-center gap-1">
                  <Eye size={12} className="text-[#FF4D4D]" /> Realtime ATS View
                </span>
              </div>

              {/* Resume Sheet Preview */}
              <div className="bg-white text-black p-5 rounded-[14px] font-sans text-[11px] leading-relaxed shadow-xl space-y-3 min-h-[360px]">
                <div className="border-b border-black/20 pb-2 text-center">
                  <h2 className="text-sm font-bold uppercase tracking-wide">{resumeName}</h2>
                  <p className="text-[10px] text-gray-700 font-semibold">{resumeRole}</p>
                  <p className="text-[9px] text-gray-600 font-mono mt-0.5">
                    soumya.samantray@kiit.ac.in | Roll: 22051892 | KIIT CGPA: {resumeCgpa}
                  </p>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold uppercase border-b border-black/20 pb-0.5 mb-1">
                    Education
                  </h4>
                  <p className="font-bold">Kalinga Institute of Industrial Technology (KIIT)</p>
                  <p className="text-[10px] text-gray-600">
                    B.Tech Computer Science (2022 - 2026) · CGPA: {resumeCgpa}
                  </p>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold uppercase border-b border-black/20 pb-0.5 mb-1">
                    Key Projects
                  </h4>
                  <p className="font-bold">KIITAnumaan Platform (Full Stack SaaS)</p>
                  <p className="text-[10px] text-gray-700">
                    Built AI exam paper prediction & ATS resume engine using Next.js & TypeScript.
                  </p>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold uppercase border-b border-black/20 pb-0.5 mb-1">
                    Technical Skills
                  </h4>
                  <p className="text-[10px]">Languages: C++, JavaScript, TypeScript, Python, SQL</p>
                  <p className="text-[10px]">Frameworks: React, Next.js, Node.js, Express, Tailwind</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 2: ATS CHECKER
      ---------------------------------------------------- */}
      {activeTab === 'ats' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT COLUMN (70% -> lg:col-span-8) */}
          <div className="lg:col-span-8 bg-[#111214] border border-white/[0.04] rounded-[20px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.18)] flex flex-col justify-between space-y-5 hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-semibold text-white tracking-tight">
                Resume & Job Description Analysis
              </h2>
              <div className="flex items-center gap-2 bg-[#0B0B0D] border border-white/[0.06] px-3 py-1 rounded-full text-xs text-[#8A8A8A] font-mono">
                <span className="w-2 h-2 rounded-full bg-[#FF4D4D] animate-ping" />
                <span>Parser Ready</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#0B0B0D] border border-white/[0.05] rounded-[16px] p-4 space-y-2">
                <label className="text-[11px] font-mono text-[#71717A] uppercase block">
                  Resume Content
                </label>
                <textarea
                  rows={8}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="w-full bg-[#111214] border border-white/10 text-xs text-white p-3 rounded-[12px] outline-none font-mono focus:border-[#FF4D4D] transition-colors"
                />
              </div>

              <div className="bg-[#0B0B0D] border border-white/[0.05] rounded-[16px] p-4 space-y-2">
                <label className="text-[11px] font-mono text-[#71717A] uppercase block">
                  Target Job Description
                </label>
                <textarea
                  rows={8}
                  value={targetJd}
                  onChange={(e) => setTargetJd(e.target.value)}
                  className="w-full bg-[#111214] border border-white/10 text-xs text-white p-3 rounded-[12px] outline-none font-mono focus:border-[#FF4D4D] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (30% -> lg:col-span-4) */}
          <div className="lg:col-span-4 bg-[#111214] border border-white/[0.04] rounded-[20px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.18)] flex flex-col justify-between space-y-5 hover:-translate-y-0.5 transition-all duration-200">
            <div className="space-y-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FF4D4D]/10 text-[#FF4D4D] border border-[#FF4D4D]/20 text-[10px] uppercase font-bold tracking-wider inline-block">
                  Audit Results
                </span>
                <h3 className="text-[28px] font-bold text-white tracking-tight mt-2 leading-none">
                  88 <span className="text-sm font-normal text-[#8A8A8A]">/ 100 Match</span>
                </h3>
                <p className="text-xs text-emerald-400 font-medium mt-1 flex items-center gap-1">
                  <CheckCircle2 size={13} /> High Compatibility for Recruiter Screening
                </p>
              </div>

              <div className="h-[1px] bg-white/[0.04]" />

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[11px] font-mono text-[#71717A] uppercase block">
                    Missing Keywords
                  </span>
                  <div className="bg-[#0B0B0D] border border-white/[0.04] rounded-[12px] p-3 mt-1 text-white font-mono text-[11px]">
                    <p className="text-white">Docker, Spring Boot, Microservices</p>
                    <p className="text-[#FF4D4D] text-[10px] mt-1">• Add these to pass 95%+ threshold</p>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-mono text-[#71717A] uppercase block">
                    Compliance & Skill Gaps
                  </span>
                  <div className="bg-[#0B0B0D] border border-white/[0.04] rounded-[12px] p-3 mt-1 space-y-1 text-white font-mono text-[11px]">
                    <p>• Format: 100% Plain Text Compliant</p>
                    <p>• Skill Gap: System Design (LLD)</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => alert('Auditing Resume ATS Score...')}
              className="w-full bg-[#FF4D4D] hover:brightness-110 text-white text-xs font-bold uppercase tracking-wider rounded-[14px] h-[44px] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <Sparkles size={15} /> Re-Audit ATS Score
            </button>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 3: PLACEMENT PLANNER
      ---------------------------------------------------- */}
      {activeTab === 'placement' && (
        <div className="bg-[#111214] border border-white/[0.04] rounded-[20px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.18)] space-y-5 hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[18px] font-semibold text-white tracking-tight">
                Upcoming KIIT Placement Drives (2026 Batch)
              </h2>
              <p className="text-xs text-[#8A8A8A] mt-0.5">
                Official drives scheduled via Training & Placement Cell
              </p>
            </div>
            <span className="text-xs text-[#8A8A8A] font-mono bg-[#0B0B0D] px-3 py-1 rounded-full border border-white/[0.06]">
              4 Companies Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0B0B0D] text-[#71717A] font-mono uppercase text-[11px] border-b border-white/[0.06]">
                  <th className="p-4 rounded-l-[12px]">Company & Tier</th>
                  <th className="p-4">Package (CTC)</th>
                  <th className="p-4">Eligibility Criteria</th>
                  <th className="p-4">Deadline</th>
                  <th className="p-4">Recruitment Stages</th>
                  <th className="p-4 text-right rounded-r-[12px]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {companyDrives.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-white text-sm tracking-tight">{c.company}</p>
                      <p className="text-[10px] text-[#8A8A8A] uppercase font-mono mt-0.5">{c.tier}</p>
                    </td>
                    <td className="p-4 font-bold text-[#FF4D4D] font-mono text-sm">{c.ctc}</td>
                    <td className="p-4 text-[#8A8A8A]">{c.eligibility}</td>
                    <td className="p-4 text-[#8A8A8A] font-mono">{c.deadline}</td>
                    <td className="p-4 text-[#8A8A8A]">{c.stages}</td>
                    <td className="p-4 text-right">
                      <span className="px-3 py-1 rounded-full bg-[#FF4D4D]/10 text-[#FF4D4D] border border-[#FF4D4D]/20 text-[10px] font-bold uppercase tracking-wider inline-block">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 4: AI PLACEMENT BLUEPRINT
      ---------------------------------------------------- */}
      {activeTab === 'blueprint' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT COLUMN (70% -> lg:col-span-8) */}
          <div className="lg:col-span-8 bg-[#111214] border border-white/[0.04] rounded-[20px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.18)] flex flex-col justify-between space-y-5 hover:-translate-y-0.5 transition-all duration-200">
            <div>
              <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FF4D4D]/10 text-[#FF4D4D] border border-[#FF4D4D]/20 text-[10px] uppercase font-bold tracking-wider inline-block">
                    Target Blueprint
                  </span>
                  <h2 className="text-[22px] font-bold text-white tracking-tight mt-1">
                    HighRadius Sprint Roadmap
                  </h2>
                </div>
                <button
                  onClick={() => alert('Launching Mock Technical Interview Simulator...')}
                  className="bg-[#FF4D4D] hover:brightness-110 text-white text-xs font-bold uppercase tracking-wider rounded-[14px] h-[40px] px-5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap size={14} /> Launch Mock Interview
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 text-xs">
                <div className="bg-[#0B0B0D] border border-white/[0.05] p-4 rounded-[16px] space-y-2">
                  <span className="text-[11px] font-mono text-[#FF4D4D] uppercase font-bold block">
                    Top Asked Technical Topics
                  </span>
                  <ul className="space-y-1.5 text-white font-mono text-[11px]">
                    <li>• Find Subarray with Given Sum (Sliding Window)</li>
                    <li>• Explain B-Tree vs B+ Tree Indexing in SQL</li>
                    <li>• Process Synchronization & Deadlock Banker's Algorithm</li>
                  </ul>
                </div>

                <div className="bg-[#0B0B0D] border border-white/[0.05] p-4 rounded-[16px] space-y-2">
                  <span className="text-[11px] font-mono text-[#FF4D4D] uppercase font-bold block">
                    10-Day Preparation Timeline
                  </span>
                  <div className="space-y-1 text-white font-mono text-[11px]">
                    <p>• Day 1-3: Array & String Hashing</p>
                    <p>• Day 4-6: SQL Joins & Subqueries</p>
                    <p>• Day 7-10: OS Numericals & Mock Interviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (30% -> lg:col-span-4) */}
          <div className="lg:col-span-4 bg-[#111214] border border-white/[0.04] rounded-[20px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.18)] flex flex-col justify-between space-y-5 hover:-translate-y-0.5 transition-all duration-200">
            <div className="space-y-4">
              <span className="text-[11px] font-mono text-[#71717A] uppercase block">
                Recommended Resources
              </span>
              <div className="bg-[#0B0B0D] border border-white/[0.04] rounded-[12px] p-3 space-y-2 text-white font-mono text-[11px]">
                <p className="text-white">• LeetCode HighRadius Tagged (15 Qs)</p>
                <p className="text-white">• Operating Systems Notes (Galvin Summary)</p>
                <p className="text-white">• Top 50 SQL Queries for Placements</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 5: AI CAREER MENTOR
      ---------------------------------------------------- */}
      {activeTab === 'mentor' && (
        <div className="bg-[#111214] border border-white/[0.04] rounded-[20px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.18)] min-h-[480px] flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FF4D4D]/10 border border-[#FF4D4D]/20 flex items-center justify-center text-[#FF4D4D]">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-white tracking-tight">
                  AI Career Placement Mentor
                </h3>
                <p className="text-xs text-[#8A8A8A]">
                  Trained on KIIT T&P Cell historical data & previous interview questions
                </p>
              </div>
            </div>
            <span className="text-xs text-[#8A8A8A] font-mono bg-[#0B0B0D] px-3 py-1 rounded-full border border-white/[0.06]">
              Online & Ready
            </span>
          </div>

          {/* Chat Stream */}
          <div className="space-y-3 overflow-y-auto max-h-[300px] pr-2">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-md p-3.5 rounded-[14px] text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#FF4D4D] text-white font-medium'
                      : 'bg-[#0B0B0D] border border-white/[0.06] text-[#8A8A8A]'
                  }`}
                >
                  <p className="text-white font-normal">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="flex items-center bg-[#0B0B0D] border border-white/[0.06] rounded-[16px] p-1.5 focus-within:border-[#FF4D4D] transition-colors">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              placeholder="Ask for interview advice, daily study plan, or resume tips..."
              className="w-full bg-transparent px-3 py-2 text-xs text-white placeholder-[#8A8A8A] outline-none font-medium"
            />
            <button
              onClick={handleSendChat}
              className="bg-[#FF4D4D] hover:brightness-110 text-white p-2 rounded-[12px] transition-all cursor-pointer"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          BOTTOM STATS ROW (Four Equal Cards)
      ---------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {[
          {
            number: '120+',
            label: 'Recruiter Drives',
            sub: 'Active for 2026 Batch',
            icon: Building2,
          },
          {
            number: '₹44.0 L',
            label: 'Highest Package',
            sub: 'Super Dream CTC Tier',
            icon: TrendingUp,
          },
          {
            number: '88%',
            label: 'Average ATS Score',
            sub: 'Across KIIT Candidates',
            icon: CheckCircle2,
          },
          {
            number: '10 Days',
            label: 'Sprint Duration',
            sub: 'HighRadius Prep Timeline',
            icon: Clock,
          },
        ].map((stat, idx) => {
          const StatIcon = stat.icon
          return (
            <div
              key={idx}
              className="bg-[#111214] border border-white/[0.04] rounded-[20px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.18)] flex flex-col justify-between h-[150px] hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold text-white tracking-tight">
                  {stat.label}
                </span>
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.05] flex items-center justify-center text-[#FF4D4D] group-hover:scale-105 transition-transform">
                  <StatIcon size={18} />
                </div>
              </div>

              <div>
                <span className="text-[38px] font-bold text-white font-mono tracking-tight leading-none block">
                  {stat.number}
                </span>
                <span className="text-xs text-[#8A8A8A] font-normal mt-1.5 block">
                  {stat.sub}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

