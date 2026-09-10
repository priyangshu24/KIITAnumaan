'use client'

// ---------------------------------------------------------------------------
// TrackDrill — a flashcard-style Q&A trainer for the tracks that have no code
// to run (Behavioural, HR, CS Fundamentals, Aptitude). Reads every question in
// the track, shows one at a time, reveals the answer outline on demand and
// tracks "got it" per question in localStorage. Optional ?topic= / ?q= scope.
// ---------------------------------------------------------------------------

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  ArrowLeft, ArrowRight, Check, RotateCcw, Shuffle, Eye, ListChecks,
  Users, Briefcase, Cpu, Calculator, Sparkles, X, type LucideIcon,
} from 'lucide-react'
import { getTrack, type AimlLevel } from '@/lib/interview-tracks'
import { LEVEL_COLOR } from '@/lib/aiml-interview-data'

const ICONS: Record<string, LucideIcon> = {
  users: Users, briefcase: Briefcase, cpu: Cpu, calculator: Calculator, sparkles: Sparkles,
}

type Card = {
  id: string
  q: string
  level: AimlLevel
  outline: string[]
  followUp?: string
  source?: { label: string; url: string }
  subtopicId: string
  subtopicTitle: string
  icon: string
}

const LEVELS: (AimlLevel | 'All')[] = ['All', 'Fresher', 'SDE II', 'SDE III']

function readSet(key: string): Set<string> {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set()
  } catch {
    return new Set()
  }
}

export default function TrackDrill({ trackSlug }: { trackSlug: string }) {
  const track = getTrack(trackSlug)
  const params = useSearchParams()
  const topicParam = params.get('topic')
  const qParam = params.get('q')

  const cards = useMemo<Card[]>(() => {
    if (!track) return []
    return track.subtopics.flatMap((s) =>
      s.questions.map((q) => ({
        id: q.id,
        q: q.q,
        level: q.level,
        outline: q.outline,
        followUp: q.followUp,
        source: q.source ?? s.reading[0],
        subtopicId: s.id,
        subtopicTitle: s.title,
        icon: s.icon,
      })),
    )
  }, [track])

  const storageKey = `kiit:drill:${trackSlug}:known`
  const [known, setKnown] = useState<Set<string>>(new Set())
  const [level, setLevel] = useState<AimlLevel | 'All'>('All')
  const [topic, setTopic] = useState<string | null>(topicParam)
  const [shuffleSeed, setShuffleSeed] = useState(0) // 0 = not shuffled
  const [pos, setPos] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [listOpen, setListOpen] = useState(false)

  useEffect(() => {
    setKnown(readSet(storageKey))
  }, [storageKey])

  const persist = useCallback(
    (next: Set<string>) => {
      setKnown(next)
      try {
        window.localStorage.setItem(storageKey, JSON.stringify([...next]))
      } catch {
        /* private mode */
      }
    },
    [storageKey],
  )

  const pool = useMemo(
    () =>
      cards.filter(
        (c) => (!topic || c.subtopicId === topic) && (level === 'All' || c.level === level),
      ),
    [cards, topic, level],
  )

  const seq = useMemo(() => {
    const arr = pool.map((_, i) => i)
    if (shuffleSeed) {
      let a = shuffleSeed >>> 0
      const rnd = () => {
        a = (a + 0x6d2b79f5) | 0
        let x = Math.imul(a ^ (a >>> 15), 1 | a)
        x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x
        return ((x ^ (x >>> 14)) >>> 0) / 4294967296
      }
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(rnd() * (i + 1))
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
      }
    }
    return arr
  }, [pool, shuffleSeed])

  // Land on the ?q= question the first time the pool is ready.
  const [jumped, setJumped] = useState(false)
  useEffect(() => {
    if (jumped || !qParam || pool.length === 0) return
    const target = pool.findIndex((c) => c.id === qParam)
    if (target >= 0) {
      const at = seq.indexOf(target)
      if (at >= 0) setPos(at)
    }
    setJumped(true)
  }, [qParam, pool, seq, jumped])

  // Keep pos in range whenever the pool changes.
  useEffect(() => {
    setPos((p) => (seq.length === 0 ? 0 : Math.min(p, seq.length - 1)))
    setRevealed(false)
  }, [seq])

  const cur: Card | undefined = pool[seq[pos]]
  const total = pool.length
  const knownInPool = pool.filter((c) => known.has(c.id)).length
  const pct = total ? Math.round((knownInPool / total) * 100) : 0

  const go = useCallback(
    (delta: number) => {
      setPos((p) => {
        if (seq.length === 0) return 0
        return (p + delta + seq.length) % seq.length
      })
      setRevealed(false)
    },
    [seq.length],
  )

  const markKnown = useCallback(() => {
    if (!cur) return
    const next = new Set(known)
    next.add(cur.id)
    persist(next)
    go(1)
  }, [cur, known, persist, go])

  const markReview = useCallback(() => {
    if (!cur) return
    if (known.has(cur.id)) {
      const next = new Set(known)
      next.delete(cur.id)
      persist(next)
    }
    go(1)
  }, [cur, known, persist, go])

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        setRevealed((r) => !r)
      } else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === '2' && revealed) markKnown()
      else if (e.key === '1' && revealed) markReview()
      else if (e.key.toLowerCase() === 's') setShuffleSeed((s) => (s ? 0 : (Date.now() & 0xffffffff) || 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, markKnown, markReview, revealed])

  if (!track) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 bg-[#0A0A0D] text-white">
        <p className="text-sm text-[#9CA3AF]">That track could not be found.</p>
        <Link href="/workspace/playground/tracks" className="text-[12px] font-mono text-[#FF4D4D] hover:text-white">← All interview tracks</Link>
      </div>
    )
  }

  const { accent } = track
  const Icon = ICONS[track.icon] ?? Sparkles
  const CurIcon = cur ? ICONS[cur.icon] ?? Sparkles : Sparkles
  const scopedTopicTitle = topic ? track.subtopics.find((s) => s.id === topic)?.title : null

  return (
    <div className="drill-shell bg-[#0A0A0D] text-white -my-4">
      <style>{`
        @media (min-width: 1024px) {
          .drill-shell { height: calc(100dvh - 56px); display: flex; flex-direction: column; overflow: hidden; }
          .drill-body { flex: 1; min-height: 0; display: grid; grid-template-columns: minmax(0, 1fr) 340px; }
          .drill-scroll { overflow-y: auto; min-height: 0; }
        }
      `}</style>

      {/* header + progress */}
      <div className="shrink-0 border-b border-white/[0.06] px-5 sm:px-8 py-2.5">
        <div className="flex items-center gap-2 text-[11px] font-mono text-[#8A8A8A]">
          <Link href={`/workspace/playground/track/${track.slug}`} className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
            <ArrowLeft size={13} style={{ color: accent }} /> {track.short}
          </Link>
          <span className="text-[#3F3F46]">/</span>
          <span className="text-[#D1D5DB]">Drill</span>
          {scopedTopicTitle && (
            <>
              <span className="text-[#3F3F46]">/</span>
              <span className="text-[#D1D5DB] truncate">{scopedTopicTitle}</span>
              <button onClick={() => setTopic(null)} className="ml-1 inline-flex items-center gap-0.5 text-[#6B7280] hover:text-white">
                <X size={11} /> all topics
              </button>
            </>
          )}
          <span className="ml-auto tabular-nums">{knownInPool}/{total} learned · {pct}%</span>
        </div>
        <div className="mt-2 h-1 rounded-full bg-white/[0.06] overflow-hidden">
          <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${pct}%`, backgroundColor: accent }} />
        </div>
      </div>

      <div className="drill-body">
        {/* ---------- CARD ---------- */}
        <div className="drill-scroll scrollbar-thin px-5 sm:px-8 py-8">
          <div className="max-w-[720px] mx-auto">
            {!cur ? (
              <div className="rounded-2xl border border-white/[0.08] bg-[#0D0D10] p-10 text-center">
                <p className="text-[13px] text-[#9CA3AF]">No questions match this filter.</p>
                <button onClick={() => { setLevel('All'); setTopic(null) }} className="mt-3 text-[12px] font-mono" style={{ color: accent }}>
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/[0.08] bg-[#0D0D10] overflow-hidden">
                <div className="px-6 pt-5 pb-4 flex items-center gap-2 border-b border-white/[0.05]">
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ color: accent, backgroundColor: `${accent}1A`, border: `1px solid ${accent}33` }}>
                    <CurIcon size={14} />
                  </span>
                  <span className="text-[11px] font-mono text-[#8A8A8A] truncate">{cur.subtopicTitle}</span>
                  <span className="ml-auto text-[9px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0" style={{ color: LEVEL_COLOR[cur.level].text, backgroundColor: LEVEL_COLOR[cur.level].bg, border: `1px solid ${LEVEL_COLOR[cur.level].border}` }}>
                    {cur.level}
                  </span>
                  <span className="text-[10px] font-mono text-[#4B5563] tabular-nums shrink-0">{pos + 1}/{total}</span>
                </div>

                <div className="px-6 py-6">
                  <h1 className="text-[18px] sm:text-[20px] font-bold text-white leading-snug">{cur.q}</h1>

                  {!revealed ? (
                    <button
                      onClick={() => setRevealed(true)}
                      className="mt-6 w-full rounded-xl border border-dashed border-white/[0.14] py-4 text-[12px] font-mono text-[#8A8A8A] hover:text-white hover:border-white/[0.28] transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye size={13} /> Show answer <span className="text-[#4B5563]">· Space</span>
                    </button>
                  ) : (
                    <div className="mt-5 space-y-4">
                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280] mb-2">Answer outline</div>
                        <ol className="space-y-2">
                          {cur.outline.map((point, k) => (
                            <li key={k} className="flex gap-2.5 text-[13px] text-[#D1D5DB] leading-relaxed">
                              <span className="shrink-0 w-4 h-4 rounded bg-white/[0.06] text-[#8A8A8A] text-[9px] font-mono flex items-center justify-center mt-0.5">{k + 1}</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                      {cur.followUp && (
                        <p className="text-[12.5px] text-[#D1D5DB] leading-relaxed rounded-lg border border-[#FBBF24]/20 bg-[#FBBF24]/[0.05] px-3 py-2">
                          <span className="text-[#FBBF24] font-mono text-[10px] uppercase tracking-wider">Follow-up · </span>{cur.followUp}
                        </p>
                      )}
                      {cur.source && (
                        <a href={cur.source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#6B7280] hover:text-white transition-colors">
                          Reference: {cur.source.label}
                        </a>
                      )}
                    </div>
                  )}
                </div>

                <div className="px-6 py-4 border-t border-white/[0.05] flex items-center gap-2">
                  <button onClick={() => go(-1)} className="px-3 py-2 rounded-lg text-[12px] font-mono text-[#8A8A8A] hover:text-white hover:bg-white/[0.04] transition-colors">
                    ← Prev
                  </button>
                  <div className="ml-auto flex items-center gap-2">
                    {revealed ? (
                      <>
                        <button onClick={markReview} className="px-3 py-2 rounded-lg text-[12px] font-semibold text-[#FCA5A5] bg-[#FB7185]/10 border border-[#FB7185]/25 hover:bg-[#FB7185]/20 transition-colors flex items-center gap-1.5">
                          <RotateCcw size={12} /> Review <span className="text-[#6B7280] font-mono">1</span>
                        </button>
                        <button onClick={markKnown} className="px-3.5 py-2 rounded-lg text-[12px] font-semibold text-white transition-opacity hover:opacity-90 flex items-center gap-1.5" style={{ backgroundColor: accent }}>
                          <Check size={12} /> Got it <span className="opacity-60 font-mono">2</span>
                        </button>
                      </>
                    ) : (
                      <button onClick={() => go(1)} className="px-3.5 py-2 rounded-lg text-[12px] font-semibold text-white bg-white/[0.06] hover:bg-white/[0.1] transition-colors flex items-center gap-1.5">
                        Skip <ArrowRight size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            <p className="mt-4 text-center text-[10px] font-mono text-[#4B5563]">
              Space reveal · 1 review · 2 got it · ← → move · S shuffle
            </p>
          </div>
        </div>

        {/* ---------- SIDEBAR ---------- */}
        <aside className="hidden lg:flex drill-scroll scrollbar-thin flex-col border-l border-white/[0.07]">
          <div className="p-4 space-y-4">
            <div className="flex items-start gap-2.5">
              <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ color: accent, backgroundColor: `${accent}1A`, border: `1px solid ${accent}33` }}>
                <Icon size={15} />
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-white leading-tight">{track.title}</p>
                <p className="text-[10px] font-mono text-[#6B7280] mt-0.5">{cards.length} questions · {track.subtopics.length} topics</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className="px-2 py-1 rounded-md text-[10px] font-mono border transition-colors"
                  style={
                    level === l
                      ? { color: accent, backgroundColor: `${accent}1A`, borderColor: `${accent}45` }
                      : { color: '#8A8A8A', borderColor: 'rgba(255,255,255,0.08)' }
                  }
                >
                  {l}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShuffleSeed((s) => (s ? 0 : (Date.now() & 0xffffffff) || 1))}
                className="flex-1 px-2 py-1.5 rounded-lg text-[10px] font-mono border transition-colors flex items-center justify-center gap-1.5"
                style={shuffleSeed ? { color: accent, borderColor: `${accent}45`, backgroundColor: `${accent}12` } : { color: '#8A8A8A', borderColor: 'rgba(255,255,255,0.08)' }}
              >
                <Shuffle size={11} /> {shuffleSeed ? 'Shuffled' : 'Shuffle'}
              </button>
              <button
                onClick={() => { persist(new Set()); setPos(0); setRevealed(false) }}
                className="flex-1 px-2 py-1.5 rounded-lg text-[10px] font-mono border border-white/[0.08] text-[#8A8A8A] hover:text-white transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw size={11} /> Reset
              </button>
            </div>

            <button
              onClick={() => setListOpen((v) => !v)}
              className="w-full flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#6B7280] hover:text-white transition-colors"
            >
              <ListChecks size={11} /> {listOpen ? 'Hide' : 'Show'} all questions
            </button>

            {listOpen && (
              <div className="space-y-1 -mx-1">
                {seq.map((idx, i) => {
                  const c = pool[idx]
                  const isCur = i === pos
                  return (
                    <button
                      key={c.id}
                      onClick={() => { setPos(i); setRevealed(false) }}
                      className={`w-full text-left px-2 py-1.5 rounded-md text-[11px] leading-snug flex items-start gap-2 transition-colors ${isCur ? 'bg-white/[0.06] text-white' : 'text-[#8A8A8A] hover:bg-white/[0.03]'}`}
                    >
                      <span
                        className="mt-0.5 w-3.5 h-3.5 rounded-full shrink-0 flex items-center justify-center"
                        style={{ backgroundColor: known.has(c.id) ? accent : 'rgba(255,255,255,0.08)' }}
                      >
                        {known.has(c.id) && <Check size={9} className="text-white" />}
                      </span>
                      <span className="line-clamp-2">{c.q}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
