'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import {
  Sparkles, TrendingUp, Target, Layers, Bot, Flame, Zap, Lock,
  BarChart3, ChevronLeft, ChevronRight, Code2, Eye, ChevronDown,
  Hash, Type, Link2, GitBranch, Share2, Boxes, Coins, Search,
  ArrowLeftRight, RectangleHorizontal, Repeat, Binary, Sigma,
  Triangle, Brackets, BarChart2, PenTool, Network, Grid3x3, Database,
  Circle, type LucideIcon,
} from 'lucide-react'
import { analyzeProfile, type TechProfile } from '@/lib/playground-profile'
import { computeStats, readSolvedIds } from '@/lib/playground-stats'
import { PROBLEMS, type Difficulty, type Topic } from '@/lib/playground-data'

const ACCENT = '#FF4D4D'
const SOLVE_HREF = '/workspace/playground/solve'

const EMPTY: TechProfile = {
  readiness: 0, totalSolved: 0, totalProblems: 0, startedTopics: 0, totalTopics: 0,
  topics: [], strengths: [], focusAreas: [], difficulty: [], languages: [],
  summary: [], verdict: { headline: 'Analyzing your practice…', body: '' },
}

const TOPIC_ICON: Record<string, LucideIcon> = {
  Arrays: Grid3x3, Strings: Type, Hashing: Hash, 'Hash Table': Hash,
  'Linked Lists': Link2, 'Linked List': Link2, 'Stacks & Queues': Layers, Stack: Layers,
  Trees: GitBranch, Graphs: Share2, 'Dynamic Programming': Boxes, Greedy: Coins,
  'Binary Search': Search, 'Two Pointers': ArrowLeftRight, 'Sliding Window': RectangleHorizontal,
  'Recursion & Backtracking': Repeat, Backtracking: Repeat, 'Bit Manipulation': Binary,
  Math: Sigma, 'Heap / Priority Queue': Triangle, Heap: Triangle, Intervals: Brackets,
  'Monotonic Stack': BarChart2, Design: PenTool, Tries: Network, 'Advanced Data Structures': Boxes,
  SQL: Database, Others: Circle,
}
const iconFor = (t: string): LucideIcon => TOPIC_ICON[t] ?? Circle

const DIFF_COLOR: Record<Difficulty, string> = { Easy: '#10B981', Medium: '#F59E0B', Hard: '#EF4444' }

/** bar colour by mastery */
function toneFor(ratio: number, solved: number): string {
  if (solved === 0) return '#3F3F46'
  if (ratio >= 0.6) return '#10B981'
  if (ratio > 0) return '#F59E0B'
  return '#3F3F46'
}

function Card({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-2xl border border-white/[0.06] bg-[#0D0D10] p-4 ${className}`}>{children}</div>
  )
}

function CompletionRing({ solved, total }: { solved: number; total: number }) {
  const pct = total ? Math.round((solved / total) * 100) : 0
  const r = 34
  const circ = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[88px] h-[88px]">
        <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90">
          <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="7" />
          <circle
            cx="44" cy="44" r={r} fill="none" stroke={ACCENT} strokeWidth="7" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={circ - (pct / 100) * circ}
            className="transition-[stroke-dashoffset] duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-white leading-none">{solved}</span>
          <span className="text-[10px] font-mono text-[#6B7280]">/{total}</span>
        </div>
      </div>
      <span className="mt-2 text-[10px] font-mono uppercase tracking-wider text-[#8A8A8A]">Problems Solved</span>
      <span className="mt-0.5 text-[11px] font-mono text-[#FF4D4D]">{pct}% Completion</span>
    </div>
  )
}

function MiniStat({ n, label, icon }: { n: React.ReactNode; label: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-lg font-bold text-white leading-none">{n}</span>
      </div>
      <div className="mt-1.5 text-[10px] font-mono text-[#6B7280]">{label}</div>
    </div>
  )
}

function MasteryBar({ ratio, solved }: { ratio: number; solved: number }) {
  return (
    <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
      <div
        className="h-full rounded-full transition-[width] duration-500"
        style={{ width: `${Math.max(ratio * 100, solved > 0 ? 8 : 0)}%`, backgroundColor: toneFor(ratio, solved) }}
      />
    </div>
  )
}

export default function TechnicalProfile() {
  const [mounted, setMounted] = useState(false)
  const [p, setP] = useState<TechProfile>(EMPTY)
  const [streaks, setStreaks] = useState({ current: 0, longest: 0, xp: 0 })
  const [solvedSet, setSolvedSet] = useState<Set<string>>(new Set())

  const [diffTab, setDiffTab] = useState<'All' | Difficulty>('All')
  const [showAllFocus, setShowAllFocus] = useState(false)
  const [recoIdx, setRecoIdx] = useState(0)
  const [previewOpen, setPreviewOpen] = useState(false)

  useEffect(() => {
    const s = computeStats()
    setP(analyzeProfile())
    setStreaks({ current: s.currentStreak, longest: s.longestStreak, xp: s.totalXp })
    setSolvedSet(new Set(readSolvedIds()))
    setMounted(true)
  }, [])

  // per-topic × per-difficulty breakdown (for the Topic Mastery filter)
  const topicRows = useMemo(() => {
    return p.topics
      .map((t) => {
        const inTopic = PROBLEMS.filter((pr) => pr.topics.includes(t.topic as Topic))
        const scoped = diffTab === 'All' ? inTopic : inTopic.filter((pr) => pr.difficulty === diffTab)
        const total = scoped.length
        const solved = scoped.filter((pr) => solvedSet.has(pr.id)).length
        return { topic: t.topic, total, solved, ratio: total ? solved / total : 0 }
      })
      .filter((r) => r.total > 0)
  }, [p.topics, diffTab, solvedSet])

  const focusList = showAllFocus
    ? p.topics.filter((t) => t.ratio < 1)
    : p.focusAreas

  // AI recommendations: weakest topics + a not-yet-solved problem in each
  const recommendations = useMemo(() => {
    const weak = (p.focusAreas.length ? p.focusAreas : p.topics.filter((t) => t.ratio < 1)).slice(0, 5)
    return weak
      .map((t) => {
        const inTopic = PROBLEMS.filter((pr) => pr.topics.includes(t.topic as Topic))
        const problem = inTopic.find((pr) => !solvedSet.has(pr.id)) ?? inTopic[0]
        return problem ? { topic: t, problem } : null
      })
      .filter((x): x is { topic: (typeof p.focusAreas)[number]; problem: (typeof PROBLEMS)[number] } => !!x)
  }, [p.focusAreas, p.topics, solvedSet])

  const reco = recommendations[Math.min(recoIdx, Math.max(0, recommendations.length - 1))]

  return (
    <section className="mt-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles size={15} className="text-[#FF4D4D]" /> Technical Profile
          </h2>
          <p className="text-xs text-[#8A8A8A] mt-0.5">Your AI-powered coding performance overview.</p>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#FF4D4D] bg-[#FF4D4D]/[0.08] border border-[#FF4D4D]/25 px-2.5 py-1 rounded-full shrink-0">
          <Sparkles size={11} /> AI Analysis
        </span>
      </div>

      {/* Row 1 — ring / verdict / statistics */}
      <div className="grid gap-3 lg:grid-cols-[minmax(190px,0.8fr)_1.9fr_minmax(230px,0.95fr)]">
        <Card className="flex items-center justify-center">
          <CompletionRing solved={p.totalSolved} total={p.totalProblems || PROBLEMS.length} />
        </Card>

        <Card className="flex gap-4 items-center">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#FF4D4D]">
              <Bot size={12} /> AI Assistant Verdict
            </div>
            <h3 className="text-base font-bold text-white mt-2">{p.verdict.headline}</h3>
            {p.verdict.body && (
              <p className="text-[12.5px] text-[#9CA3AF] leading-relaxed mt-1.5">{p.verdict.body}</p>
            )}
          </div>
          <div className="relative shrink-0 w-[84px] h-[84px] rounded-2xl bg-gradient-to-br from-[#FF4D4D]/20 to-[#FF4D4D]/[0.03] border border-[#FF4D4D]/20 flex items-center justify-center">
            <Bot size={38} className="text-[#FF4D4D]" />
            <Sparkles size={12} className="text-[#FF4D4D] absolute -top-1 -right-1 animate-pulse" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#8A8A8A] mb-3">
            <BarChart3 size={11} /> Statistics
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <MiniStat n={p.totalProblems || PROBLEMS.length} label="Total Problems" />
            <MiniStat n={p.startedTopics} label="Topics Touched" />
            <MiniStat n={streaks.xp} label="Total XP" icon={<Zap size={13} className="text-[#FF4D4D]" />} />
            <MiniStat n={streaks.current} label="Day Streak" icon={<Flame size={13} className="text-[#F59E0B]" />} />
          </div>
        </Card>
      </div>

      {/* Row 2 — strengths / focus areas */}
      <div className="grid gap-3 lg:grid-cols-[1fr_1.9fr]">
        <Card>
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#10B981] mb-3">
            <TrendingUp size={11} /> Strengths
          </div>
          {mounted && p.strengths.length === 0 ? (
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-12 h-12 rounded-full border border-white/[0.08] bg-white/[0.02] flex items-center justify-center mb-3">
                <Lock size={16} className="text-[#6B7280]" />
              </div>
              <p className="text-[11px] text-[#8A8A8A] max-w-[220px]">
                Solve 2+ problems in any topic to unlock your strengths.
              </p>
            </div>
          ) : (
            <ul className="space-y-2.5">
              {p.strengths.map((t) => {
                const Icon = iconFor(t.topic)
                return (
                  <li key={t.topic}>
                    <div className="flex items-center justify-between text-[12px] mb-1">
                      <span className="flex items-center gap-2 text-[#D1D5DB]">
                        <Icon size={13} className="text-[#10B981]" /> {t.topic}
                      </span>
                      <span className="font-mono text-[10px] text-[#10B981]">{t.solved} solved</span>
                    </div>
                    <MasteryBar ratio={t.ratio} solved={t.solved} />
                  </li>
                )
              })}
            </ul>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#F59E0B]">
              <Target size={11} /> Focus Areas
            </div>
            <button
              onClick={() => setShowAllFocus((v) => !v)}
              className="text-[10px] font-mono text-[#8A8A8A] hover:text-white border border-white/[0.08] hover:border-white/20 rounded-lg px-2 py-1 transition-colors cursor-pointer flex items-center gap-1"
            >
              {showAllFocus ? 'Show Less' : 'View All Topics'}
              <ChevronDown size={11} className={showAllFocus ? 'rotate-180 transition-transform' : 'transition-transform'} />
            </button>
          </div>
          {mounted && focusList.length === 0 ? (
            <p className="text-[11px] text-[#6B7280]">No obvious gaps — nice work.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
              {focusList.map((t) => {
                const Icon = iconFor(t.topic)
                return (
                  <div key={t.topic}>
                    <div className="flex items-center justify-between text-[12px] mb-1">
                      <span className="flex items-center gap-2 text-[#D1D5DB] truncate">
                        <Icon size={13} className="text-[#F59E0B] shrink-0" /> {t.topic}
                      </span>
                      <span className="font-mono text-[10px] text-[#6B7280] shrink-0">{t.solved}/{t.total}</span>
                    </div>
                    <MasteryBar ratio={t.ratio} solved={t.solved} />
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Row 3 — AI recommendations / topic mastery */}
      <div className="grid gap-3 lg:grid-cols-[1fr_1.4fr]">
        <Card>
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#FF4D4D] mb-1">
            <Sparkles size={11} /> AI Recommended for You
          </div>
          <p className="text-[11px] text-[#8A8A8A] mb-3">Weak topics based on your performance — start practising to improve.</p>

          {!reco ? (
            <p className="text-[11px] text-[#6B7280] py-6 text-center">Nothing to recommend — you&apos;re on top of it.</p>
          ) : (
            <div className="rounded-xl border border-white/[0.06] bg-[#111214] p-3">
              <div className="flex flex-col gap-3">
                <div>
                  <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/25 px-1.5 py-0.5 rounded">
                    Weak Topic
                  </span>
                  <h4 className="text-sm font-bold text-white mt-2">{reco.topic.topic}</h4>
                  <p className="text-[11px] text-[#8A8A8A] mt-0.5">
                    {reco.topic.solved === 0
                      ? "You haven't solved any problems in this topic."
                      : "You haven't solved enough problems in this topic."}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1"><MasteryBar ratio={reco.topic.ratio} solved={reco.topic.solved} /></div>
                    <span className="font-mono text-[10px] text-[#6B7280] shrink-0">{reco.topic.solved} / {reco.topic.total} solved</span>
                  </div>
                </div>

                <div className="border-t border-white/[0.06] pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280]">Recommended Question</span>
                    <span
                      className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded"
                      style={{
                        color: DIFF_COLOR[reco.problem.difficulty],
                        backgroundColor: `${DIFF_COLOR[reco.problem.difficulty]}14`,
                        border: `1px solid ${DIFF_COLOR[reco.problem.difficulty]}33`,
                      }}
                    >
                      {reco.problem.difficulty}
                    </span>
                  </div>
                  <h5 className="text-[13px] font-bold text-white mt-1.5">{reco.problem.title}</h5>
                  <p className={`text-[11px] text-[#9CA3AF] leading-relaxed mt-1 ${previewOpen ? '' : 'line-clamp-2'}`}>
                    {reco.problem.description}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <Link
                      href={`${SOLVE_HREF}?problem=${reco.problem.id}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF4D4D] hover:bg-[#E03A3A] text-white text-[11px] font-semibold transition-colors"
                    >
                      Practice This Question <Code2 size={12} />
                    </Link>
                    <button
                      onClick={() => setPreviewOpen((v) => !v)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.1] hover:border-white/25 text-[#8A8A8A] hover:text-white text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      <Eye size={12} /> {previewOpen ? 'Hide' : 'Preview'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {recommendations.length > 1 && (
            <div className="flex items-center justify-between mt-3">
              <button
                onClick={() => { setRecoIdx((i) => Math.max(0, i - 1)); setPreviewOpen(false) }}
                disabled={recoIdx === 0}
                className="w-7 h-7 rounded-lg border border-white/[0.08] flex items-center justify-center text-[#8A8A8A] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>
              <div className="flex items-center gap-1.5">
                {recommendations.map((_, i) => (
                  <span key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === recoIdx ? 'bg-[#FF4D4D]' : 'bg-white/15'}`} />
                ))}
              </div>
              <button
                onClick={() => { setRecoIdx((i) => Math.min(recommendations.length - 1, i + 1)); setPreviewOpen(false) }}
                disabled={recoIdx >= recommendations.length - 1}
                className="w-7 h-7 rounded-lg border border-white/[0.08] flex items-center justify-center text-[#8A8A8A] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-start justify-between mb-3 gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#8A8A8A]">
                <Layers size={11} /> Topic Mastery
              </div>
              <p className="text-[11px] text-[#6B7280] mt-0.5">Your progress across all major topics.</p>
            </div>
            <div className="flex gap-1 shrink-0">
              {(['All', 'Easy', 'Medium', 'Hard'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDiffTab(d)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono transition-colors cursor-pointer ${
                    diffTab === d
                      ? 'bg-[#FF4D4D]/15 text-[#FF4D4D] border border-[#FF4D4D]/30'
                      : 'bg-white/[0.03] text-[#8A8A8A] hover:text-white border border-transparent'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5 max-h-[280px] overflow-y-auto scrollbar-thin pr-1">
            {topicRows.map((t) => {
              const Icon = iconFor(t.topic)
              return (
                <div key={t.topic}>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="flex items-center gap-2 text-[#D1D5DB] truncate">
                      <Icon size={13} className="text-[#8A8A8A] shrink-0" /> {t.topic}
                    </span>
                    <span className="font-mono text-[10px] text-[#6B7280] shrink-0">{t.solved}/{t.total}</span>
                  </div>
                  <MasteryBar ratio={t.ratio} solved={t.solved} />
                </div>
              )
            })}
          </div>
          <Link
            href={SOLVE_HREF}
            className="mt-3 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-white/[0.08] hover:border-white/20 text-[11px] font-mono text-[#8A8A8A] hover:text-white transition-colors"
          >
            Explore All Topics <ChevronRight size={12} />
          </Link>
        </Card>
      </div>

      {/* Footer — difficulty progress + tip */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A8A8A]">Difficulty Progress</span>
          {p.difficulty.map((d) => (
            <span
              key={d.difficulty}
              className="text-[10px] font-mono px-2 py-1 rounded-lg border"
              style={{
                color: DIFF_COLOR[d.difficulty],
                borderColor: `${DIFF_COLOR[d.difficulty]}33`,
                backgroundColor: `${DIFF_COLOR[d.difficulty]}12`,
              }}
            >
              {d.difficulty} {d.solved}/{d.total}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-[#8A8A8A] bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-1.5">
          <Sparkles size={11} className="text-[#FF4D4D]" />
          Tip: solve problems consistently to build your streak and improve faster.
        </div>
      </div>
    </section>
  )
}
