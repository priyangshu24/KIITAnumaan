'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Bookmark,
  CheckSquare,
  Square,
  TrendingUp,
  Target,
  Sparkles,
  Filter,
  CheckCircle2,
} from 'lucide-react'

const sampleTopics = [
  {
    id: 1,
    topic: 'Banker’s Algorithm & Deadlock Avoidance',
    subject: 'Operating Systems',
    branch: 'CSE',
    unit: 'Unit 3',
    priority: 'High',
    frequency: 'Appeared in 4 of last 5 semester exams',
    completed: true,
  },
  {
    id: 2,
    topic: 'Virtual Memory & Page Replacement Algorithms (LRU, FIFO, Optimal)',
    subject: 'Operating Systems',
    branch: 'CSE',
    unit: 'Unit 4',
    priority: 'High',
    frequency: 'Appeared in 5 of last 5 semester exams',
    completed: false,
  },
  {
    id: 3,
    topic: 'Process Synchronization & Semaphores (Producer-Consumer)',
    subject: 'Operating Systems',
    branch: 'IT',
    unit: 'Unit 2',
    priority: 'High',
    frequency: 'Appeared in 4 of last 5 semester exams',
    completed: false,
  },
  {
    id: 4,
    topic: 'CPU Scheduling Algorithms (SRTF, Round Robin, Multi-level Queue)',
    subject: 'Operating Systems',
    branch: 'CSE',
    unit: 'Unit 1',
    priority: 'Medium',
    frequency: 'Appeared in 3 of last 5 semester exams',
    completed: true,
  },
  {
    id: 5,
    topic: 'Disk Scheduling Algorithms (SCAN, C-SCAN, FCFS)',
    subject: 'Operating Systems',
    branch: 'IT',
    unit: 'Unit 5',
    priority: 'Low',
    frequency: 'Appeared in 2 of last 5 semester exams',
    completed: false,
  },
]

export default function ImportantTopicsPage() {
  const [selectedSubject, setSelectedSubject] = useState('Operating Systems')
  const [selectedYear, setSelectedYear] = useState('2025-2026')
  const [selectedSemester, setSelectedSemester] = useState('Semester 6')
  const [selectedBranch, setSelectedBranch] = useState('All')
  const [selectedExamType, setSelectedExamType] = useState('Endsem')
  const [selectedPriority, setSelectedPriority] = useState('All')
  const [topics, setTopics] = useState(sampleTopics)

  const toggleCheck = (id: number) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  const completedCount = topics.filter((t) => t.completed).length
  const progressPct = Math.round((completedCount / topics.length) * 100)

  const filteredTopics = topics.filter((t) => {
    const matchesPriority = selectedPriority === 'All' || t.priority === selectedPriority
    const matchesBranch = selectedBranch === 'All' || t.branch === selectedBranch
    return matchesPriority && matchesBranch
  })

  return (
    <div className="space-y-6 pb-12 w-full text-white">

      {/* Top Banner Header Card (With Full Cover Red KIIT Campus Wireframe Background Image) */}
      <div className="relative overflow-hidden w-full bg-[#0B0B0D] border border-white/[0.08] rounded-[24px] p-6 lg:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.45)] min-h-[160px] flex items-center">
        {/* Full Cover High-Res KIIT Red Wireframe Image */}
        <img
          src="/kiit-campus-dotted.jpg"
          alt="KIIT Campus Wireframe Background"
          className="absolute inset-0 w-full h-full object-cover object-[75%_center] opacity-90 pointer-events-none z-0 rounded-[24px]"
        />

        {/* Left-to-Right Seamless Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0D] via-[#0B0B0D]/75 to-transparent pointer-events-none z-10 rounded-[24px]" />

        <div className="relative z-20 space-y-1.5 max-w-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF453A] font-mono block drop-shadow">
            IMPORTANT TOPICS
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-white tracking-tight leading-none drop-shadow-md">
            High-Yield Exam Topics
          </h1>
          <p className="text-xs text-[#A0A0A0] font-normal mt-2 leading-relaxed drop-shadow">
            Prioritized chapter topics and high-probability concepts curated for semester success.
          </p>
        </div>
      </div>

        {/* ----------------------------------------------------
            UNIFIED LIQUID GLASS TOOLBAR & PROGRESS TRACKER
        ---------------------------------------------------- */}
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-[24px] p-3 lg:px-5 lg:py-3 shadow-[0_16px_40px_rgba(0,0,0,0.45)] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Subject */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#8A8A8A] font-mono">Subject:</span>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="bg-white/[0.04] backdrop-blur-md border border-white/10 text-xs text-white px-3.5 py-2 rounded-xl outline-none cursor-pointer font-bold hover:bg-white/[0.08] transition-all focus:border-[#FF453A]/50"
              >
                <option value="Operating Systems" className="bg-[#111214] text-white">Operating Systems (CS-3004)</option>
                <option value="DBMS" className="bg-[#111214] text-white">Database Management Systems (CS-3002)</option>
                <option value="Computer Networks" className="bg-[#111214] text-white">Computer Networks (CS-3006)</option>
              </select>
            </div>

            {/* Year */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#8A8A8A] font-mono">Year:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-white/[0.04] backdrop-blur-md border border-white/10 text-xs text-white px-3.5 py-2 rounded-xl outline-none cursor-pointer font-semibold hover:bg-white/[0.08] transition-all focus:border-[#FF453A]/50"
              >
                <option value="2025-2026" className="bg-[#111214] text-white">2025 - 2026</option>
                <option value="2024-2025" className="bg-[#111214] text-white">2024 - 2025</option>
                <option value="2023-2024" className="bg-[#111214] text-white">2023 - 2024</option>
              </select>
            </div>

            {/* Semester */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#8A8A8A] font-mono">Sem:</span>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="bg-white/[0.04] backdrop-blur-md border border-white/10 text-xs text-white px-3.5 py-2 rounded-xl outline-none cursor-pointer font-semibold hover:bg-white/[0.08] transition-all focus:border-[#FF453A]/50"
              >
                <option value="Semester 4" className="bg-[#111214] text-white">Semester 4</option>
                <option value="Semester 5" className="bg-[#111214] text-white">Semester 5</option>
                <option value="Semester 6" className="bg-[#111214] text-white">Semester 6</option>
                <option value="Semester 7" className="bg-[#111214] text-white">Semester 7</option>
              </select>
            </div>

            {/* Branch */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#8A8A8A] font-mono">Branch:</span>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="bg-white/[0.04] backdrop-blur-md border border-white/10 text-xs text-white px-3.5 py-2 rounded-xl outline-none cursor-pointer font-semibold hover:bg-white/[0.08] transition-all focus:border-[#FF453A]/50"
              >
                <option value="All" className="bg-[#111214] text-white">All Branches</option>
                <option value="CSE" className="bg-[#111214] text-white">CSE</option>
                <option value="IT" className="bg-[#111214] text-white">IT</option>
                <option value="ECE" className="bg-[#111214] text-white">ECE</option>
                <option value="EEE" className="bg-[#111214] text-white">EEE</option>
                <option value="ME" className="bg-[#111214] text-white">Mechanical</option>
                <option value="CE" className="bg-[#111214] text-white">Civil</option>
              </select>
            </div>

            {/* Exam Type (Midsem vs Endsem) */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#8A8A8A] font-mono">Exam:</span>
              <select
                value={selectedExamType}
                onChange={(e) => setSelectedExamType(e.target.value)}
                className="bg-white/[0.04] backdrop-blur-md border border-white/10 text-xs text-white px-3.5 py-2 rounded-xl outline-none cursor-pointer font-semibold hover:bg-white/[0.08] transition-all focus:border-[#FF453A]/50"
              >
                <option value="Midsem" className="bg-[#111214] text-white">Midsem</option>
                <option value="Endsem" className="bg-[#111214] text-white">Endsem</option>
                <option value="All" className="bg-[#111214] text-white">All Exams</option>
              </select>
            </div>

            {/* Priority */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#8A8A8A] font-mono">Priority:</span>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="bg-white/[0.04] backdrop-blur-md border border-white/10 text-xs text-white px-3.5 py-2 rounded-xl outline-none cursor-pointer font-semibold hover:bg-white/[0.08] transition-all focus:border-[#FF453A]/50"
              >
                <option value="All" className="bg-[#111214] text-white">All Priorities</option>
                <option value="High" className="bg-[#111214] text-white">High Priority</option>
                <option value="Medium" className="bg-[#111214] text-white">Medium Priority</option>
                <option value="Low" className="bg-[#111214] text-white">Low Priority</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Topics Checklist Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Topics List (8 Cols) */}
          <div className="lg:col-span-8 space-y-3">
            {filteredTopics.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`bg-[#111214] border rounded-[20px] p-5 shadow-sm flex items-start gap-4 cursor-pointer transition-all ${
                  item.completed ? 'border-emerald-500/30 bg-emerald-500/[0.02]' : 'border-white/[0.04] hover:border-white/15'
                }`}
              >
                <button className="mt-0.5 text-[#FF453A] cursor-pointer">
                  {item.completed ? (
                    <CheckSquare size={20} className="text-emerald-400" />
                  ) : (
                    <Square size={20} className="text-[#8A8A8A]" />
                  )}
                </button>

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        item.priority === 'High'
                          ? 'bg-[#FF453A]/10 text-[#FF453A] border border-[#FF453A]/20'
                          : item.priority === 'Medium'
                          ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}
                    >
                      {item.priority} Priority
                    </span>
                    <span className="text-[10px] font-mono text-[#8A8A8A] bg-white/[0.04] px-2 py-0.5 rounded-md">
                      {item.unit}
                    </span>
                    <span className="text-[10px] font-mono text-[#8A8A8A] bg-white/[0.04] px-2 py-0.5 rounded-md">
                      {item.branch}
                    </span>
                  </div>

                  <h4 className={`text-sm sm:text-base font-bold text-white ${item.completed ? 'line-through opacity-60' : ''}`}>
                    {item.topic}
                  </h4>

                  <p className="text-[11px] text-emerald-400 font-mono">
                    {item.frequency}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side (4 Cols): Marks Distribution, Curated Videos & External Resources */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Marks Distribution Card */}
            <div className="bg-[#111214] border border-white/[0.04] rounded-[22px] p-5 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Exam Marks Distribution
              </h4>
              <div className="space-y-3 font-mono text-xs">
                {[
                  { unit: 'Unit 3: Deadlocks', marks: '35% (35 Marks)', color: 'w-[85%] bg-[#FF453A]' },
                  { unit: 'Unit 4: Virtual Memory', marks: '25% (25 Marks)', color: 'w-[65%] bg-amber-500' },
                  { unit: 'Unit 2: Synchronization', marks: '20% (20 Marks)', color: 'w-[50%] bg-blue-500' },
                  { unit: 'Unit 1 & 5: CPU & Disk', marks: '20% (20 Marks)', color: 'w-[50%] bg-emerald-500' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-white font-medium">{item.unit}</span>
                      <span className="text-[#8A8A8A]">{item.marks}</span>
                    </div>
                    <div className="w-full bg-[#0B0B0D] h-2 rounded-full overflow-hidden border border-white/5">
                      <div className={`h-full rounded-full ${item.color}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Curated Lecture Videos Section (Liquid Glass linked to nested page) */}
            <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-[24px] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.45)] space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Curated Lecture Videos
                </h4>
                <Link
                  href="/workspace/academic/important-topics/lecture-videos"
                  className="text-[11px] text-[#FF453A] bg-[#FF453A]/10 px-3 py-1 rounded-full border border-[#FF453A]/20 font-mono font-bold hover:bg-[#FF453A] hover:text-white transition-all flex items-center gap-1"
                >
                  <span>View All</span>
                  <span>→</span>
                </Link>
              </div>

              <div className="space-y-3">
                {[
                  {
                    title: 'Banker’s Algorithm Masterclass (Gate Smashers)',
                    duration: '18 mins',
                    url: 'https://www.youtube.com/results?search_query=Bankers+Algorithm+Gate+Smashers',
                  },
                  {
                    title: 'LRU & Optimal Page Replacement Explained',
                    duration: '24 mins',
                    url: 'https://www.youtube.com/results?search_query=LRU+Optimal+Page+Replacement+Operating+System',
                  },
                  {
                    title: 'Semaphores & Producer Consumer Solution',
                    duration: '15 mins',
                    url: 'https://www.youtube.com/results?search_query=Semaphores+Producer+Consumer+Gate+Smashers',
                  },
                ].map((vid, idx) => (
                  <a
                    key={idx}
                    href={vid.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/[0.04] backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex items-center justify-between gap-3 group hover:bg-white/[0.08] hover:border-white/20 transition-all cursor-pointer block"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-white truncate group-hover:text-[#FF453A] transition-colors">
                        {vid.title}
                      </p>
                      <p className="text-[10px] text-[#8A8A8A] font-mono mt-0.5">
                        {vid.duration} • HD Lecture
                      </p>
                    </div>
                    <span className="text-[#FF453A] text-xs font-bold bg-[#FF453A]/10 border border-[#FF453A]/20 px-3 py-1.5 rounded-xl group-hover:bg-[#FF453A] group-hover:text-white transition-all shrink-0">
                      Watch
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* External Resources Section */}
            <div className="bg-[#111214] border border-white/[0.04] rounded-[22px] p-5 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                External Resources &amp; Notes
              </h4>
              <div className="space-y-2">
                {[
                  { name: 'NPTEL Operating Systems Slides', type: 'PDF' },
                  { name: 'GeeksforGeeks OS Revision Sheet', type: 'Web' },
                ].map((res, idx) => (
                  <div key={idx} className="bg-[#0B0B0D] p-3 rounded-xl border border-white/[0.04] flex items-center justify-between">
                    <span className="text-xs font-medium text-white truncate">{res.name}</span>
                    <span className="text-[10px] font-mono text-[#FF453A] bg-[#FF453A]/10 px-2 py-0.5 rounded-full border border-[#FF453A]/20">{res.type}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>


        </div>

      </div>
  )
}
