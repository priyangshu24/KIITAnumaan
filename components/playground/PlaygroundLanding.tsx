'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building2,
  SlidersHorizontal,
  TrendingUp,
  Search,
  Bell,
  CheckCircle2,
  X,
  Play,
  Zap,
  Check,
} from 'lucide-react'
import { Problem, TOP_COMPANIES, PracticeSession, PracticeSessionConfig } from '@/lib/playground-data'

interface PlaygroundLandingProps {
  solvedCount: number
  activePracticeSession: PracticeSession | null
  onStartTopicPractice: () => void
  onStartCompanyInterviews: () => void
  onStartCustomPractice: (config?: PracticeSessionConfig) => void
  onContinuePractice: () => void
  problems: Problem[]
}

export default function PlaygroundLanding({
  solvedCount,
  activePracticeSession,
  onStartTopicPractice,
  onStartCompanyInterviews,
  onStartCustomPractice,
  onContinuePractice,
  problems,
}: PlaygroundLandingProps) {
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false)
  const [customTopic, setCustomTopic] = useState('All Topics')
  const [customDifficulty, setCustomDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All')
  const [customCount, setCustomCount] = useState<number>(10)
  const [customMode, setCustomMode] = useState<'practice' | 'interview'>('practice')

  const handleLaunchCustom = () => {
    setIsCustomModalOpen(false)
    onStartCustomPractice({
      companyId: 'general',
      companyName: 'General Practice',
      role: 'Software Engineer',
      experience: '0–2 Years',
      topic: customTopic,
      difficulty: customDifficulty,
      source: 'curated',
      questionCount: customCount,
      mode: customMode,
    })
  }

  const continueProblemTitle = activePracticeSession && !activePracticeSession.isComplete
    ? problems.find(p => p.id === activePracticeSession.questionIds[activePracticeSession.currentIndex])?.title || 'Current Problem'
    : null

  return (
    <div className="flex flex-col h-full w-full bg-[#0A0A0D] text-white overflow-y-auto scrollbar-thin">
      {/* 1. TOP GLOBAL NAVIGATION */}
      <header className="px-5 sm:px-8 py-3.5 border-b border-white/[0.06] bg-[#0D0D10]/80 backdrop-blur-md flex items-center justify-between shrink-0 sticky top-0 z-30">
        <div className="flex items-center gap-8">
          <Link href="/workspace/academic" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#FF4D4D]/15 border border-[#FF4D4D]/30 flex items-center justify-center text-[#FF4D4D] font-black text-sm shadow-[0_0_15px_rgba(255,77,77,0.2)] group-hover:scale-105 transition-transform">
              K
            </div>
            <span className="text-sm font-black tracking-wider text-white uppercase font-mono">
              KIIT ANUMAAN
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 text-xs font-medium">
            <Link
              href="/workspace/academic"
              className="px-3 py-1.5 rounded-lg text-[#8A8A8A] hover:text-white hover:bg-white/[0.04] transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/workspace/academic"
              className="px-3 py-1.5 rounded-lg text-[#8A8A8A] hover:text-white hover:bg-white/[0.04] transition-colors"
            >
              Career Workspace
            </Link>
            <div className="px-3 py-1.5 rounded-lg bg-white/[0.06] text-white font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D4D]" />
              <span>Playground</span>
            </div>
            <Link
              href="/workspace/academic"
              className="px-3 py-1.5 rounded-lg text-[#8A8A8A] hover:text-white hover:bg-white/[0.04] transition-colors"
            >
              Analytics
            </Link>
            <Link
              href="/workspace/academic"
              className="px-3 py-1.5 rounded-lg text-[#8A8A8A] hover:text-white hover:bg-white/[0.04] transition-colors"
            >
              Community
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search questions, topics..."
              className="pl-8 pr-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder:text-[#6B7280] outline-none focus:border-[#FF4D4D]/40 transition-colors w-44 focus:w-56"
            />
          </div>

          <button
            className="w-8 h-8 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] flex items-center justify-center text-[#8A8A8A] hover:text-white transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell size={14} />
          </button>

          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF4D4D]/20 to-purple-500/20 border border-white/[0.1] flex items-center justify-center text-xs font-bold text-white cursor-pointer">
            KA
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTAINER WITH PROFESSIONAL SPACING */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-5 sm:px-8 py-8 sm:py-12 space-y-8">
        {/* PAGE HEADER */}
        <div className="space-y-3">
          <Link
            href="/workspace/academic"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#8A8A8A] hover:text-white transition-colors group cursor-pointer"
          >
            <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform text-[#FF4D4D]" />
            <span>Career Workspace</span>
          </Link>

          <div className="space-y-1.5">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Playground
            </h1>
            <p className="text-sm text-[#9CA3AF] max-w-xl leading-relaxed">
              Practice coding, improve your problem-solving skills, and get placement ready.
            </p>
          </div>
        </div>

        {/* 3. OPTIONAL CONTINUE PRACTICE CARD */}
        {activePracticeSession && !activePracticeSession.isComplete && continueProblemTitle && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-[#FF4D4D]/[0.08] via-[#FF4D4D]/[0.03] to-white/[0.01] border border-[#FF4D4D]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FF4D4D]/20 text-[#FF4D4D] border border-[#FF4D4D]/40 flex items-center gap-1">
                  <Zap size={11} /> Continue Practice
                </span>
                <span className="text-xs font-mono text-[#9CA3AF]">
                  {activePracticeSession.companyName ? `${activePracticeSession.companyName} · ` : ''}
                  {activePracticeSession.role || 'Practice Session'}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white truncate max-w-lg">
                {continueProblemTitle}
              </h3>
              <p className="text-xs font-mono text-[#8A8A8A]">
                Question {activePracticeSession.currentIndex + 1} of {activePracticeSession.questionIds.length} · Progress {Math.round(((activePracticeSession.currentIndex) / activePracticeSession.questionIds.length) * 100)}%
              </p>
            </div>

            <button
              onClick={onContinuePractice}
              className="px-4 py-2 rounded-lg bg-[#FF4D4D] hover:bg-[#FF3333] text-white text-xs font-bold font-mono transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_20px_rgba(255,77,77,0.35)] shrink-0"
            >
              <span>Continue</span>
              <ArrowRight size={13} />
            </button>
          </motion.div>
        )}

        {/* 4. MAIN PRACTICE CARDS (3 PRIMARY OPTIONS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* CARD 1: PRACTICE BY TOPIC */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/[0.08] hover:border-[#FF4D4D]/40 transition-all duration-300 flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-[#FF4D4D]/10 border border-[#FF4D4D]/25 flex items-center justify-center text-[#FF4D4D] group-hover:scale-105 transition-transform">
                <BookOpen size={20} />
              </div>

              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white tracking-tight">Practice by Topic</h2>
                <p className="text-xs text-[#9CA3AF] leading-relaxed">
                  Solve coding questions topic-wise.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {['Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming'].map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded text-[10px] font-mono text-[#8A8A8A] bg-white/[0.03] border border-white/[0.05]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={onStartTopicPractice}
              className="w-full py-2.5 px-4 rounded-xl bg-[#FF4D4D] hover:bg-[#FF3333] text-white text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,77,77,0.3)] group-hover:shadow-[0_0_25px_rgba(255,77,77,0.45)]"
            >
              <span>Start Practicing</span>
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* CARD 2: COMPANY INTERVIEWS */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/[0.08] hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                <Building2 size={20} />
              </div>

              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white tracking-tight">Company Interviews</h2>
                <p className="text-xs text-[#9CA3AF] leading-relaxed">
                  Practice interview questions from companies.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {['Amazon', 'Microsoft', 'Google', 'Meta', 'Netflix', 'Uber'].map(comp => (
                  <span
                    key={comp}
                    className="px-2 py-0.5 rounded text-[10px] font-mono text-[#8A8A8A] bg-white/[0.03] border border-white/[0.05]"
                  >
                    {comp}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={onStartCompanyInterviews}
              className="w-full py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white hover:text-white border border-white/[0.08] hover:border-white/20 text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Explore Companies</span>
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform text-[#8A8A8A] group-hover:text-white" />
            </button>
          </div>

          {/* CARD 3: CUSTOM PRACTICE */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/[0.08] hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <SlidersHorizontal size={20} />
              </div>

              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white tracking-tight">Custom Practice</h2>
                <p className="text-xs text-[#9CA3AF] leading-relaxed">
                  Create your own coding practice session.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {['Topic', 'Difficulty', 'Question count', 'Timed modes'].map(feat => (
                  <span
                    key={feat}
                    className="px-2 py-0.5 rounded text-[10px] font-mono text-[#8A8A8A] bg-white/[0.03] border border-white/[0.05]"
                  >
                    {feat}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsCustomModalOpen(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white hover:text-white border border-white/[0.08] hover:border-white/20 text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Create Practice</span>
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform text-[#8A8A8A] group-hover:text-white" />
            </button>
          </div>
        </div>

        {/* 5. COMPACT PROGRESS SECTION */}
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <TrendingUp size={15} className="text-[#FF4D4D]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Your Progress
              </h3>
            </div>
            <div className="flex items-center gap-3 sm:gap-6 text-xs font-mono text-[#9CA3AF] flex-wrap">
              <span>Questions Solved: <strong className="text-white font-bold">{solvedCount > 0 ? solvedCount : 254}</strong></span>
              <span>•</span>
              <span>Accuracy: <strong className="text-[#10B981] font-bold">85%</strong></span>
              <span>•</span>
              <span>Current Streak: <strong className="text-amber-400 font-bold">12 days</strong></span>
            </div>
          </div>

          <Link
            href="/workspace/academic"
            className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 text-xs font-mono text-[#D1D5DB] hover:text-white transition-all cursor-pointer shrink-0 inline-flex items-center gap-1.5"
          >
            <span>View Progress</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        {/* 6. MOTIVATIONAL FOOTER */}
        <div className="text-center pt-6 pb-4">
          <p className="text-xs font-mono text-[#6B7280] italic">
            &ldquo;Practice today. Placements tomorrow.&rdquo;
          </p>
        </div>
      </main>

      {/* CUSTOM PRACTICE SESSION MODAL */}
      <AnimatePresence>
        {isCustomModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
            onClick={() => setIsCustomModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md bg-[#121217] border border-white/[0.12] rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.85)] p-6 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Create Custom Practice</h3>
                </div>
                <button
                  onClick={() => setIsCustomModalOpen(false)}
                  className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[#8A8A8A] hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] font-mono text-[#8A8A8A] uppercase mb-1">Topic</label>
                  <select
                    value={customTopic}
                    onChange={e => setCustomTopic(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] text-white rounded-lg px-2.5 py-1.5 outline-none focus:border-[#FF4D4D]/50 cursor-pointer"
                  >
                    <option value="All Topics" className="bg-[#121217] text-white">All Topics</option>
                    <option value="Arrays" className="bg-[#121217] text-white">Arrays</option>
                    <option value="Strings" className="bg-[#121217] text-white">Strings</option>
                    <option value="Linked Lists" className="bg-[#121217] text-white">Linked Lists</option>
                    <option value="Trees" className="bg-[#121217] text-white">Trees</option>
                    <option value="Graphs" className="bg-[#121217] text-white">Graphs</option>
                    <option value="Dynamic Programming" className="bg-[#121217] text-white">Dynamic Programming</option>
                    <option value="Sliding Window" className="bg-[#121217] text-white">Sliding Window</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-[#8A8A8A] uppercase mb-1">Difficulty</label>
                  <div className="grid grid-cols-4 gap-1">
                    {(['All', 'Easy', 'Medium', 'Hard'] as const).map(d => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setCustomDifficulty(d)}
                        className={`py-1.5 rounded text-[10px] font-mono font-bold transition-colors cursor-pointer border ${
                          customDifficulty === d
                            ? 'bg-[#FF4D4D] text-white border-[#FF4D4D]'
                            : 'bg-white/[0.04] text-[#8A8A8A] border-white/[0.06] hover:text-white'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-[#8A8A8A] uppercase mb-1">Question Count</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[5, 10, 20].map(cnt => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setCustomCount(cnt)}
                        className={`py-2 rounded-lg font-mono font-bold text-xs transition-colors cursor-pointer border ${
                          customCount === cnt
                            ? 'bg-[#FF4D4D]/15 text-[#FF4D4D] border-[#FF4D4D]'
                            : 'bg-white/[0.03] text-[#8A8A8A] border-white/[0.06] hover:text-white'
                        }`}
                      >
                        {cnt} Questions
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-[#8A8A8A] uppercase mb-1">Mode</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCustomMode('practice')}
                      className={`p-2.5 rounded-lg text-left transition-all border cursor-pointer ${
                        customMode === 'practice'
                          ? 'bg-[#FF4D4D]/10 border-[#FF4D4D] text-white'
                          : 'bg-white/[0.03] border-white/[0.06] text-[#8A8A8A] hover:text-white'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>🎯 Practice</span>
                        {customMode === 'practice' && <Check size={12} className="text-[#FF4D4D]" />}
                      </div>
                      <p className="text-[10px] text-[#9CA3AF] mt-0.5">Untimed, hints available.</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCustomMode('interview')}
                      className={`p-2.5 rounded-lg text-left transition-all border cursor-pointer ${
                        customMode === 'interview'
                          ? 'bg-[#FF4D4D]/10 border-[#FF4D4D] text-white'
                          : 'bg-white/[0.03] border-white/[0.06] text-[#8A8A8A] hover:text-white'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>⏱ Timed</span>
                        {customMode === 'interview' && <Check size={12} className="text-[#FF4D4D]" />}
                      </div>
                      <p className="text-[10px] text-[#9CA3AF] mt-0.5">45m simulation.</p>
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-[#8A8A8A] hover:text-white cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleLaunchCustom}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-[#FF4D4D] hover:bg-[#FF3333] text-white font-bold text-xs shadow-[0_0_20px_rgba(255,77,77,0.4)] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Play size={13} fill="currentColor" />
                  <span>Start Practice Session</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
