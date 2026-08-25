'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  ArrowLeft,
  Bot,
  Lightbulb,
  RotateCcw,
  Send,
  ShieldCheck,
  Star,
  Target,
  Trophy,
  Upload,
  FileText,
} from 'lucide-react'
import {
  companyDrives,
  drivePrepPlans,
  blueprintData,
  mockInterviewRounds,
  evaluateAnswer,
  getInterviewHint,
  atsRoleTemplates,
  atsExperienceLevels,
  type AnswerFeedback,
} from '@/lib/career-data'

// Only companies with a defined interview round set can be simulated.
const mockInterviewCompanies = companyDrives.filter((c) => mockInterviewRounds[c.id])

export default function MockInterviewPage() {
  return (
    <Suspense fallback={null}>
      <MockInterviewContent />
    </Suspense>
  )
}

function MockInterviewContent() {
  const searchParams = useSearchParams()
  const initialCompanyId =
    searchParams.get('company') && mockInterviewRounds[searchParams.get('company')!]
      ? searchParams.get('company')!
      : 'c-2'

  const [companyId, setCompanyId] = useState(initialCompanyId)
  const [selectedRoleId, setSelectedRoleId] = useState('software-engineer')
  const [selectedLevel, setSelectedLevel] = useState('Fresher (0-1 Yr)')
  const [resumeText, setResumeText] = useState('')
  const [resumeFileName, setResumeFileName] = useState<string | null>(null)
  const [isParsingResume, setIsParsingResume] = useState(false)

  const company = companyDrives.find((c) => c.id === companyId)!
  const rounds = mockInterviewRounds[companyId]
  const plan = drivePrepPlans[companyId]
  const blueprint = blueprintData[companyId]
  const selectedRole = atsRoleTemplates.find((r) => r.id === selectedRoleId) ?? atsRoleTemplates[0]

  const [activeRoundIndex, setActiveRoundIndex] = useState(0)
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [scores, setScores] = useState<number[]>([])
  const [isFinished, setIsFinished] = useState(false)

  const currentRound = rounds[activeRoundIndex]
  const currentQuestion = currentRound.questions[activeQuestionIndex]
  const isLastQuestionInRound = activeQuestionIndex === currentRound.questions.length - 1
  const isLastRound = activeRoundIndex === rounds.length - 1
  const totalQuestions = rounds.reduce((sum, r) => sum + r.questions.length, 0)
  const answeredSoFar = scores.length

  const resetProgress = () => {
    setActiveRoundIndex(0)
    setActiveQuestionIndex(0)
    setAnswer('')
    setFeedback(null)
    setShowHint(false)
    setScores([])
    setIsFinished(false)
  }

  const handleChangeCompany = (id: string) => {
    setCompanyId(id)
    resetProgress()
  }

  const handleResumeFile = async (file: File | undefined) => {
    if (!file) return
    const name = file.name.toLowerCase()

    if (name.endsWith('.txt') || file.type === 'text/plain') {
      const text = await file.text()
      setResumeText(text)
      setResumeFileName(file.name)
      return
    }

    if (name.endsWith('.pdf') || file.type === 'application/pdf') {
      setIsParsingResume(true)
      try {
        const pdfjs = await import('pdfjs-dist')
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/build/pdf.worker.min.mjs',
          import.meta.url
        ).toString()
        const buffer = await file.arrayBuffer()
        const pdf = await pdfjs.getDocument({ data: buffer }).promise
        let fullText = ''
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const content = await page.getTextContent()
          const pageText = content.items.map((item) => ('str' in item ? item.str : '')).join(' ')
          fullText += pageText + '\n'
        }
        setResumeText(fullText.trim())
        setResumeFileName(file.name)
      } catch {
        alert('Could not extract text from this PDF. Try exporting it as plain text and pasting it instead.')
      } finally {
        setIsParsingResume(false)
      }
      return
    }

    alert('Unsupported file type — please upload a .txt or .pdf resume, or paste the text directly.')
  }

  const jumpToRound = (index: number) => {
    setActiveRoundIndex(index)
    setActiveQuestionIndex(0)
    setAnswer('')
    setFeedback(null)
    setShowHint(false)
  }

  const handleSubmitAnswer = () => {
    const result = evaluateAnswer(answer)
    setFeedback(result)
    setScores((prev) => [...prev, result.score])
  }

  const handleNext = () => {
    if (!isLastQuestionInRound) {
      setActiveQuestionIndex((i) => i + 1)
    } else if (!isLastRound) {
      setActiveRoundIndex((i) => i + 1)
      setActiveQuestionIndex(0)
    } else {
      setIsFinished(true)
    }
    setAnswer('')
    setFeedback(null)
    setShowHint(false)
  }

  const handleRetry = () => resetProgress()

  const averageScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0

  return (
    <div className="space-y-6 pb-12 w-full text-white max-w-[1400px] mx-auto">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <Link
            href="/workspace/career"
            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#FF4D4D] font-mono mb-1.5 hover:text-white transition-colors"
          >
            <ArrowLeft size={12} /> Exit Simulator
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-none">
            Mock Interview — {company.company}
          </h1>
          <p className="text-xs text-[#8A8A8A] mt-2">
            {selectedRole.role} · {selectedLevel}
          </p>
        </div>
        <span className="text-xs text-[#8A8A8A] font-mono bg-[#111214] border border-white/[0.06] px-3 py-1.5 rounded-full shrink-0">
          {answeredSoFar} / {totalQuestions} answered
        </span>
      </div>

      {isFinished ? (
        /* -------------------- SUMMARY SCREEN -------------------- */
        <div className="bg-[#111214] border border-white/[0.04] rounded-[20px] p-8 shadow-[0_8px_24px_rgba(0,0,0,0.18)] text-center space-y-5 max-w-xl mx-auto">
          <div className="w-14 h-14 rounded-full bg-[#FF4D4D]/10 border border-[#FF4D4D]/20 flex items-center justify-center text-[#FF4D4D] mx-auto">
            <Trophy size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Interview Complete</h2>
            <p className="text-xs text-[#8A8A8A] mt-1">
              You answered {scores.length} questions across {rounds.length} rounds for {company.company}.
            </p>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                size={22}
                className={n <= Math.round(averageScore) ? 'text-amber-400 fill-amber-400' : 'text-[#2A2A2E]'}
              />
            ))}
          </div>
          <p className="text-3xl font-black text-white">{averageScore.toFixed(1)} / 5</p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRetry}
              className="flex items-center gap-1.5 bg-[#1C1D21] hover:bg-white/10 border border-white/10 text-white text-xs font-bold px-4 py-2.5 rounded-[10px] transition-all cursor-pointer"
            >
              <RotateCcw size={13} /> Retry Simulator
            </button>
            <Link
              href="/workspace/career"
              className="bg-[#FF4D4D] hover:brightness-110 text-white text-xs font-bold px-4 py-2.5 rounded-[10px] transition-all"
            >
              Back to Blueprint
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* MAIN INTERVIEW PANEL */}
          <div className="lg:col-span-8 space-y-4">
            {/* Round Tabs */}
            <div className="flex flex-wrap gap-2">
              {rounds.map((r, idx) => (
                <button
                  key={r.id}
                  onClick={() => jumpToRound(idx)}
                  className={`px-4 py-2 rounded-[10px] text-xs font-semibold transition-all cursor-pointer ${
                    idx === activeRoundIndex
                      ? 'bg-[#FF4D4D] text-white'
                      : 'bg-[#111214] border border-white/10 text-[#9CA3AF] hover:text-white hover:border-white/20'
                  }`}
                >
                  {r.name}
                </button>
              ))}
            </div>

            <div className="bg-[#111214] border border-white/[0.04] rounded-[20px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.18)] space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#71717A] uppercase tracking-wider">
                  {currentRound.name} · Question {activeQuestionIndex + 1} of {currentRound.questions.length}
                </span>
                <div className="flex items-center gap-1">
                  <Bot size={13} className="text-[#FF4D4D]" />
                  <span className="text-[10px] text-[#6B7280] font-mono">AI Interviewer</span>
                </div>
              </div>

              <div className="bg-[#0B0B0D] border border-white/[0.06] rounded-[16px] p-5">
                <p className="text-base font-semibold text-white leading-relaxed">{currentQuestion}</p>
              </div>

              <textarea
                rows={6}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer as if you were speaking it out loud..."
                disabled={!!feedback}
                className="w-full bg-[#0B0B0D] border border-white/10 text-sm text-white p-4 rounded-[14px] outline-none font-normal focus:border-[#FF4D4D] transition-colors disabled:opacity-60"
              />

              {showHint && (
                <div className="flex items-start gap-2 bg-amber-500/[0.06] border border-amber-500/20 rounded-[14px] p-3.5">
                  <Lightbulb size={14} className="text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-200 leading-relaxed">{getInterviewHint(currentQuestion)}</p>
                </div>
              )}

              {feedback && (
                <div className="flex items-start gap-2 bg-[#FF4D4D]/[0.06] border border-[#FF4D4D]/20 rounded-[14px] p-3.5">
                  <div className="flex items-center gap-1 shrink-0 mt-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        size={12}
                        className={n <= feedback.score ? 'text-amber-400 fill-amber-400' : 'text-[#2A2A2E]'}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-[#D4D4D8] leading-relaxed">{feedback.tip}</p>
                </div>
              )}

              <div className="flex items-center justify-between gap-3 flex-wrap">
                <button
                  onClick={() => setShowHint((v) => !v)}
                  className="flex items-center gap-1.5 bg-[#1C1D21] hover:bg-white/10 border border-white/10 text-white text-xs font-bold px-3.5 py-2.5 rounded-[10px] transition-all cursor-pointer"
                >
                  <Lightbulb size={13} /> {showHint ? 'Hide Hint' : 'Get a Hint'}
                </button>

                {!feedback ? (
                  <button
                    onClick={handleSubmitAnswer}
                    className="flex items-center gap-1.5 bg-[#FF4D4D] hover:brightness-110 text-white text-xs font-bold px-4 py-2.5 rounded-[10px] transition-all cursor-pointer"
                  >
                    <Send size={13} /> Submit Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-1.5 bg-[#FF4D4D] hover:brightness-110 text-white text-xs font-bold px-4 py-2.5 rounded-[10px] transition-all cursor-pointer"
                  >
                    {isLastQuestionInRound && isLastRound ? 'Finish Interview' : 'Next Question'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-4 space-y-5">

            {/* Interview Setup: Company / Role / Level filters */}
            <div className="bg-[#111214] border border-white/[0.04] rounded-[20px] p-5 space-y-3">
              <span className="text-[11px] font-mono text-[#71717A] uppercase tracking-wider block">
                Interview Setup
              </span>

              <div className="space-y-2.5">
                <div>
                  <label className="text-[10px] font-mono text-[#6B7280] uppercase tracking-wider block mb-1">
                    Company
                  </label>
                  <select
                    value={companyId}
                    onChange={(e) => handleChangeCompany(e.target.value)}
                    className="w-full bg-[#0B0B0D] border border-white/10 text-xs text-white px-3 py-2 rounded-[10px] outline-none font-semibold cursor-pointer focus:border-[#FF4D4D] transition-colors"
                  >
                    {mockInterviewCompanies.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#111214] text-white">
                        {c.company}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-[#6B7280] uppercase tracking-wider block mb-1">
                    Role
                  </label>
                  <select
                    value={selectedRoleId}
                    onChange={(e) => setSelectedRoleId(e.target.value)}
                    className="w-full bg-[#0B0B0D] border border-white/10 text-xs text-white px-3 py-2 rounded-[10px] outline-none font-semibold cursor-pointer focus:border-[#FF4D4D] transition-colors"
                  >
                    {atsRoleTemplates.map((r) => (
                      <option key={r.id} value={r.id} className="bg-[#111214] text-white">
                        {r.role}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-[#6B7280] uppercase tracking-wider block mb-1">
                    Level
                  </label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full bg-[#0B0B0D] border border-white/10 text-xs text-white px-3 py-2 rounded-[10px] outline-none font-semibold cursor-pointer focus:border-[#FF4D4D] transition-colors"
                  >
                    {atsExperienceLevels.map((lvl) => (
                      <option key={lvl} value={lvl} className="bg-[#111214] text-white">
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Your Resume — reference it while you answer */}
            <div
              onDrop={(e) => {
                e.preventDefault()
                handleResumeFile(e.dataTransfer.files[0])
              }}
              onDragOver={(e) => e.preventDefault()}
              className="bg-[#111214] border border-white/[0.04] rounded-[20px] p-5 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#71717A] uppercase tracking-wider flex items-center gap-1.5">
                  <FileText size={12} className="text-[#FF4D4D]" /> Your Resume
                </span>
                <label
                  htmlFor="mock-resume-upload"
                  className="flex items-center gap-1.5 bg-[#0B0B0D] border border-white/10 hover:border-[#FF4D4D]/50 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-[8px] cursor-pointer transition-all"
                >
                  <Upload size={11} className="text-[#FF4D4D]" />
                  {isParsingResume ? 'Parsing…' : 'Upload'}
                  <input
                    id="mock-resume-upload"
                    type="file"
                    accept=".txt,.pdf,text/plain,application/pdf"
                    className="hidden"
                    onChange={(e) => handleResumeFile(e.target.files?.[0])}
                  />
                </label>
              </div>
              {resumeFileName && (
                <p className="text-[10px] text-[#6B7280] font-mono">Loaded from: {resumeFileName}</p>
              )}
              <textarea
                rows={4}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume here to keep it handy while you answer..."
                className="w-full bg-[#0B0B0D] border border-white/10 text-xs text-white p-3 rounded-[12px] outline-none font-mono focus:border-[#FF4D4D] transition-colors"
              />
            </div>

            <div className="bg-[#111214] border border-white/[0.04] rounded-[20px] p-5 space-y-3">
              <span className="text-[11px] font-mono text-[#71717A] uppercase tracking-wider flex items-center gap-1.5">
                <Target size={12} className="text-[#FF4D4D]" /> How to Approach
              </span>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">{plan.approach}</p>
            </div>

            <div className="bg-emerald-500/[0.04] border border-emerald-500/20 rounded-[20px] p-5 space-y-2">
              <span className="text-emerald-400 font-mono uppercase font-bold text-[11px] block">Do</span>
              <ul className="space-y-1 text-white font-mono text-[11px]">
                {blueprint.dos.map((d, i) => (
                  <li key={i}>• {d}</li>
                ))}
              </ul>
            </div>

            <div className="bg-red-500/[0.04] border border-red-500/20 rounded-[20px] p-5 space-y-2">
              <span className="text-red-400 font-mono uppercase font-bold text-[11px] block">Don&rsquo;t</span>
              <ul className="space-y-1 text-white font-mono text-[11px]">
                {blueprint.donts.map((d, i) => (
                  <li key={i}>• {d}</li>
                ))}
              </ul>
            </div>

            <div className="bg-[#111214] border border-white/[0.04] rounded-[20px] p-5 space-y-2">
              <span className="text-[11px] font-mono text-[#71717A] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-[#FF4D4D]" /> Progress
              </span>
              <div className="space-y-1.5">
                {rounds.map((r, idx) => (
                  <div key={r.id} className="flex items-center justify-between text-[11px]">
                    <span className={idx === activeRoundIndex ? 'text-white font-semibold' : 'text-[#6B7280]'}>
                      {r.name}
                    </span>
                    <span className="text-[#6B7280] font-mono">
                      {idx < activeRoundIndex
                        ? `${r.questions.length}/${r.questions.length}`
                        : idx === activeRoundIndex
                        ? `${activeQuestionIndex}/${r.questions.length}`
                        : `0/${r.questions.length}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
