'use client'

import { useState } from 'react'
import {
  Briefcase,
  FileCheck,
  Target,
  Sparkles,
  Bot,
  Download,
  CheckCircle2,
  AlertTriangle,
  Award,
  Calendar,
  Layers,
  ArrowRight,
  Send,
  Eye,
  Plus
} from 'lucide-react'

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
  const [atsAnalyzed, setAtsAnalyzed] = useState(true)

  // Mentor Chat state
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Hello Soumya! I am your AI Placement Mentor. HighRadius online assessment is scheduled in 10 days. Would you like a 10-day preparation sprint for Operating Systems & SQL?' }
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
          text: 'Great focus! For HighRadius, focus heavily on SQL Join queries, B-Trees index optimization, process scheduling numericals, and 2 medium LeetCode array questions daily.'
        }
      ])
    }, 600)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.08)] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-[#FF3B30]/10 text-[#FF3B30] border border-[#FF3B30]/30 text-[10px] font-bold uppercase tracking-wider">
              PLACEMENT & RESUME ENGINE
            </span>
            <span className="text-xs text-[#6B7280] font-mono">KIIT Training & Placement Cell 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight mt-1">
            Career Workspace
          </h1>
        </div>

        {/* Sub Tabs */}
        <div className="flex flex-wrap items-center bg-[#101010] border border-[rgba(255,255,255,0.08)] p-1 rounded-xl gap-1">
          <button
            onClick={() => setActiveTab('resume')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'resume' ? 'bg-[#FF3B30] text-white shadow-md' : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            <FileCheck size={14} /> Resume Builder
          </button>
          <button
            onClick={() => setActiveTab('ats')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'ats' ? 'bg-[#FF3B30] text-white shadow-md' : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            <Sparkles size={14} /> ATS Checker
          </button>
          <button
            onClick={() => setActiveTab('placement')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'placement' ? 'bg-[#FF3B30] text-white shadow-md' : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            <Target size={14} /> Placement Planner
          </button>
          <button
            onClick={() => setActiveTab('blueprint')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'blueprint' ? 'bg-[#FF3B30] text-white shadow-md' : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            <Award size={14} /> AI Blueprint
          </button>
          <button
            onClick={() => setActiveTab('mentor')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'mentor' ? 'bg-[#FF3B30] text-white shadow-md' : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            <Bot size={14} /> AI Mentor
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------
          TAB 1: RESUME BUILDER
      ---------------------------------------------------- */}
      {activeTab === 'resume' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Builder Form Pane */}
          <div className="lg:col-span-6 bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Resume Form Editor</h3>
              <div className="flex items-center bg-[#101010] p-0.5 rounded-lg border border-[rgba(255,255,255,0.08)] text-[10px] font-bold">
                <button
                  onClick={() => setBuilderMode('manual')}
                  className={`px-2.5 py-1 rounded ${builderMode === 'manual' ? 'bg-[#FF3B30] text-white' : 'text-[#9CA3AF]'}`}
                >
                  Manual Builder
                </button>
                <button
                  onClick={() => setBuilderMode('ai')}
                  className={`px-2.5 py-1 rounded ${builderMode === 'ai' ? 'bg-[#FF3B30] text-white' : 'text-[#9CA3AF]'}`}
                >
                  AI Builder
                </button>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-bold text-[#6B7280] uppercase block mb-1">Full Name</label>
                <input
                  type="text"
                  value={resumeName}
                  onChange={(e) => setResumeName(e.target.value)}
                  className="w-full bg-[#101010] border border-[rgba(255,255,255,0.08)] text-white p-2.5 rounded-lg outline-none font-medium focus:border-[#FF3B30]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#6B7280] uppercase block mb-1">Target Headline</label>
                <input
                  type="text"
                  value={resumeRole}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#101010] border border-[rgba(255,255,255,0.08)] text-white p-2.5 rounded-lg outline-none font-medium focus:border-[#FF3B30]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-[#6B7280] uppercase block mb-1">KIIT CGPA</label>
                  <input
                    type="text"
                    value={resumeCgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                    className="w-full bg-[#101010] border border-[rgba(255,255,255,0.08)] text-white p-2.5 rounded-lg outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#6B7280] uppercase block mb-1">Template Style</label>
                  <select
                    value={resumeTemplate}
                    onChange={(e) => setTemplate(e.target.value)}
                    className="w-full bg-[#101010] border border-[rgba(255,255,255,0.08)] text-white p-2.5 rounded-lg outline-none font-medium"
                  >
                    <option value="minimal">Minimal Single-Page (ATS)</option>
                    <option value="modern">Modern Executive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => alert('Downloading PDF Resume...')}
                className="bg-[#FF3B30] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg hover:bg-[#E03126] transition-all flex items-center gap-2"
              >
                <Download size={14} /> Export PDF
              </button>
            </div>
          </div>

          {/* Live Preview Pane */}
          <div className="lg:col-span-6 bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Eye size={16} className="text-[#FF3B30]" /> Live ATS Resume Preview
              </h3>
              <span className="text-[10px] font-mono text-[#6B7280]">Targeting 1-Page Layout</span>
            </div>

            {/* Resume Sheet Preview */}
            <div className="bg-white text-black p-6 rounded-lg font-sans text-[11px] leading-relaxed shadow-xl space-y-3 min-h-[420px]">
              <div className="border-b border-black/20 pb-2 text-center">
                <h2 className="text-base font-bold uppercase tracking-wide">{resumeName}</h2>
                <p className="text-[10px] text-gray-700 font-semibold">{resumeRole}</p>
                <p className="text-[9px] text-gray-600 font-mono mt-0.5">
                  soumya.samantray@kiit.ac.in | Roll: 22051892 | KIIT CGPA: {resumeCgpa}
                </p>
              </div>

              <div>
                <h4 className="text-[10px] font-bold uppercase border-b border-black/20 pb-0.5 mb-1">Education</h4>
                <p className="font-bold">Kalinga Institute of Industrial Technology (KIIT University)</p>
                <p className="text-[10px] text-gray-600">B.Tech in Computer Science & Engineering (2022 - 2026) · CGPA: {resumeCgpa}</p>
              </div>

              <div>
                <h4 className="text-[10px] font-bold uppercase border-b border-black/20 pb-0.5 mb-1">Key Projects</h4>
                <p className="font-bold">KIITAnumaan Platform (Full Stack SaaS)</p>
                <p className="text-[10px] text-gray-700">Built AI exam paper prediction & ATS resume engine using Next.js & TypeScript.</p>
              </div>

              <div>
                <h4 className="text-[10px] font-bold uppercase border-b border-black/20 pb-0.5 mb-1">Technical Skills</h4>
                <p className="text-[10px]">Languages: C++, JavaScript, TypeScript, Python, SQL</p>
                <p className="text-[10px]">Frameworks: React, Next.js, Node.js, Express, TailwindCSS</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 2: ATS CHECKER
      ---------------------------------------------------- */}
      {activeTab === 'ats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-xl p-5 space-y-3">
              <label className="text-xs font-bold text-white uppercase block">1. Paste Resume Content</label>
              <textarea
                rows={6}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="w-full bg-[#101010] border border-[rgba(255,255,255,0.08)] text-xs text-white p-3 rounded-lg outline-none font-mono focus:border-[#FF3B30]"
              />
            </div>

            <div className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-xl p-5 space-y-3">
              <label className="text-xs font-bold text-white uppercase block">2. Target Job Description</label>
              <textarea
                rows={6}
                value={targetJd}
                onChange={(e) => setTargetJd(e.target.value)}
                className="w-full bg-[#101010] border border-[rgba(255,255,255,0.08)] text-xs text-white p-3 rounded-lg outline-none font-mono focus:border-[#FF3B30]"
              />
            </div>
          </div>

          {/* Score & Audit Analysis */}
          {atsAnalyzed && (
            <div className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.08)] pb-4">
                <div>
                  <h3 className="text-xl font-black text-white uppercase">ATS Match Audit: 88 / 100</h3>
                  <p className="text-xs text-green-400 font-bold mt-0.5">High Compatibility for Recruiter Screening</p>
                </div>
                <button
                  onClick={() => alert('Auditing Resume ATS Score...')}
                  className="bg-[#FF3B30] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg"
                >
                  Re-Audit ATS Score
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-[#101010] p-4 rounded-lg border border-[rgba(255,255,255,0.06)] space-y-1">
                  <span className="text-[10px] text-[#6B7280] font-bold uppercase block">Missing Keywords</span>
                  <p className="text-white font-bold">Docker, Spring Boot, Microservices</p>
                  <p className="text-[10px] text-[#FF3B30] mt-1">Add these to pass 95%+ threshold</p>
                </div>
                <div className="bg-[#101010] p-4 rounded-lg border border-[rgba(255,255,255,0.06)] space-y-1">
                  <span className="text-[10px] text-[#6B7280] font-bold uppercase block">Formatting Compliance</span>
                  <p className="text-white font-bold">100% Plain Text Compliant</p>
                  <p className="text-[10px] text-green-400 mt-1">No tables or complex columns</p>
                </div>
                <div className="bg-[#101010] p-4 rounded-lg border border-[rgba(255,255,255,0.06)] space-y-1">
                  <span className="text-[10px] text-[#6B7280] font-bold uppercase block">Skill Gap Analysis</span>
                  <p className="text-white font-bold">System Design (LLD)</p>
                  <p className="text-[10px] text-yellow-400 mt-1">Add 1 project with DB scaling</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 3: PLACEMENT PLANNER
      ---------------------------------------------------- */}
      {activeTab === 'placement' && (
        <div className="space-y-6">
          <div className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-xl overflow-hidden">
            <div className="p-4 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Upcoming KIIT Placement Drives
              </h4>
              <span className="text-xs text-[#6B7280] font-mono">4 Companies Registered</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#101010] text-[#6B7280] font-bold uppercase tracking-wider border-b border-[rgba(255,255,255,0.08)]">
                    <th className="p-4">Company & Tier</th>
                    <th className="p-4">Package (CTC)</th>
                    <th className="p-4">Eligibility</th>
                    <th className="p-4">Deadline</th>
                    <th className="p-4">Recruitment Stages</th>
                    <th className="p-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(255,255,255,0.06)] font-medium">
                  {companyDrives.map((c) => (
                    <tr key={c.id} className="hover:bg-[#101010] transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-white text-sm">{c.company}</p>
                        <p className="text-[10px] text-[#6B7280] uppercase">{c.tier}</p>
                      </td>
                      <td className="p-4 font-black text-[#FF3B30]">{c.ctc}</td>
                      <td className="p-4 text-[#9CA3AF]">{c.eligibility}</td>
                      <td className="p-4 text-[#9CA3AF] font-mono">{c.deadline}</td>
                      <td className="p-4 text-xs text-[#9CA3AF]">{c.stages}</td>
                      <td className="p-4 text-right">
                        <span className="px-2.5 py-1 rounded bg-[#FF3B30]/10 text-[#FF3B30] border border-[#FF3B30]/30 text-[10px] font-bold uppercase">
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 4: AI PLACEMENT BLUEPRINT
      ---------------------------------------------------- */}
      {activeTab === 'blueprint' && (
        <div className="space-y-6">
          <div className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] pb-3">
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  Target Company Blueprint: HighRadius
                </h3>
                <p className="text-xs text-[#9CA3AF]">Customized DSA & Technical Prep Roadmap</p>
              </div>
              <button
                onClick={() => alert('Launching Mock Technical Interview Simulator...')}
                className="bg-[#FF3B30] text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg hover:bg-[#E03126]"
              >
                Launch Mock Interview
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#101010] p-4 rounded-lg border border-[rgba(255,255,255,0.06)] space-y-2">
                <span className="text-[10px] text-[#FF3B30] font-bold uppercase">Top Asked Technical Questions</span>
                <ul className="space-y-1 text-white font-medium list-disc list-inside">
                  <li>Find Subarray with Given Sum (HashMap / Sliding Window)</li>
                  <li>Explain B-Tree vs B+ Tree Indexing in SQL</li>
                  <li>Process Synchronization & Deadlock Banker's Algorithm</li>
                </ul>
              </div>

              <div className="bg-[#101010] p-4 rounded-lg border border-[rgba(255,255,255,0.06)] space-y-2">
                <span className="text-[10px] text-[#FF3B30] font-bold uppercase">10-Day Sprint Roadmap</span>
                <p className="text-white">Day 1-3: Array & String Hashing</p>
                <p className="text-white">Day 4-6: SQL Joins & Subqueries</p>
                <p className="text-white">Day 7-10: OS Numericals & Mock Interviews</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 5: AI CAREER MENTOR
      ---------------------------------------------------- */}
      {activeTab === 'mentor' && (
        <div className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-xl p-6 space-y-6 min-h-[480px] flex flex-col justify-between">
          <div className="border-b border-[rgba(255,255,255,0.08)] pb-3 flex items-center gap-2">
            <Bot size={20} className="text-[#FF3B30]" />
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Career Mentor Chat</h3>
              <p className="text-[10px] text-[#6B7280]">Trained on KIIT T&P Cell historical data & interviews</p>
            </div>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[300px] pr-2">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-md p-3.5 rounded-xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#FF3B30] text-white rounded-br-none'
                      : 'bg-[#101010] border border-[rgba(255,255,255,0.08)] text-[#9CA3AF] rounded-bl-none'
                  }`}
                >
                  <p className="text-white font-medium">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="flex items-center bg-[#101010] border border-[rgba(255,255,255,0.08)] rounded-xl p-1.5 focus-within:border-[#FF3B30]">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              placeholder="Ask for interview advice, daily study plan, or resume tips..."
              className="w-full bg-transparent px-3 py-2 text-xs text-white placeholder-[#6B7280] outline-none font-medium"
            />
            <button
              onClick={handleSendChat}
              className="bg-[#FF3B30] text-white p-2 rounded-lg hover:bg-[#E03126] transition-all"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
