'use client'

// ---------------------------------------------------------------------------
// A dedicated documentation page for one interview subtopic.
// Two-column layout: docs + every Q&A on the left (this side scrolls with the
// page), a pinned animated "how it works" panel on the right that only grows
// its own scrollbar when its content is taller than the viewport.
// ---------------------------------------------------------------------------

import Link from 'next/link'
import {
  ArrowLeft, BookOpen, ExternalLink, FlaskConical, Sparkles,
  Cpu, SlidersHorizontal, ClipboardCheck, ShieldCheck, Database, Bot,
  Workflow, Boxes, Trophy, ScanLine, GitBranch, Network, Sigma,
  type LucideIcon,
} from 'lucide-react'
import { getTrack } from '@/lib/interview-tracks'
import { LEVEL_COLOR } from '@/lib/aiml-interview-data'
import { DRILL_CONCEPTS, type DrillConcept } from '@/lib/aiml-drill-concepts'
import { DRILL_CONSOLES } from '@/lib/aiml-drill-consoles'
import { practiceLinkFor } from '@/lib/topic-practice-link'
import LiveDiagram, { SCENE_FOR, SCENE_META, type Scene } from './LiveDiagram'

const ICONS: Record<string, LucideIcon> = {
  cpu: Cpu, sliders: SlidersHorizontal, clipboard: ClipboardCheck, shield: ShieldCheck,
  database: Database, bot: Bot, workflow: Workflow, boxes: Boxes, trophy: Trophy,
  scan: ScanLine, gitbranch: GitBranch, network: Network, sigma: Sigma,
}

function Panel({ scene, sceneInfo, concept, accent }: {
  scene: Scene
  sceneInfo: { title: string; caption: string }
  concept: DrillConcept | undefined
  accent: string
}) {
  return (
    <>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accent }} />
          <h2 className="text-[10px] font-mono uppercase tracking-wider text-[#8B5CF6]">Live — how it works</h2>
        </div>
        <p className="text-[13px] font-semibold text-white mb-2.5">{sceneInfo.title}</p>
        <LiveDiagram scene={scene} accent={accent} />
        <p className="mt-2.5 text-[12px] text-[#9CA3AF] leading-relaxed">{sceneInfo.caption}</p>
      </div>

      {concept?.diagram ? (
        <div>
          <h2 className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280] mb-2">Schematic — the pieces</h2>
          <div className="td-diagram rounded-2xl border border-white/[0.07] bg-[#0B0B0E] p-4">{concept.diagram}</div>
        </div>
      ) : (
        <p className="text-[11.5px] text-[#6B7280] leading-relaxed">
          The panel above is the animated representation for this topic. Full labelled schematics are available for AI/ML topics.
        </p>
      )}
    </>
  )
}

export default function TopicDoc({ trackSlug, topicId }: { trackSlug: string; topicId: string }) {
  const track = getTrack(trackSlug)
  const sub = track?.subtopics.find((s) => s.id === topicId)

  if (!track || !sub) {
    return (
      <div className="min-h-full bg-[#0A0A0D] text-white flex flex-col items-center justify-center gap-3 p-10">
        <p className="text-sm text-[#9CA3AF]">That topic could not be found.</p>
        <Link href="/workspace/playground/tracks" className="text-[12px] font-mono text-[#FF4D4D] hover:text-white">← All interview tracks</Link>
      </div>
    )
  }

  const Icon = ICONS[sub.icon] ?? Sparkles
  const concept = DRILL_CONCEPTS[topicId]
  const hasConsole = !!DRILL_CONSOLES[topicId]
  const { accent } = track
  const scene: Scene = SCENE_FOR[topicId] ?? 'pipeline'
  const sceneInfo = SCENE_META[scene]

  // Topic-level "practise this" destination — resolved per track/topic.
  const practiceHref = practiceLinkFor(track, topicId)
  const practiceLabel = hasConsole
    ? 'Open the AI/ML Lab'
    : track.practiceHref
      ? 'Open this track’s workspace'
      : track.slug === 'dsa'
        ? 'Practise in the FORCE editor'
        : 'Open the Q&A drill'

  return (
    <div className="topic-doc-shell bg-[#0A0A0D] text-white -my-4">
      <style>{`
        /* Below lg: everything flows and the page scrolls normally.
           lg and up: fixed-height app shell — header + right panel stay put,
           only the content column scrolls. The shell cancels <main>'s py-4 with
           -my-4, so only the 56px workspace navbar sits above it. */
        @media (min-width: 1024px) {
          .topic-doc-shell { height: calc(100dvh - 56px); display: flex; flex-direction: column; overflow: hidden; }
          .topic-doc-grid { flex: 1; min-height: 0; display: grid; grid-template-columns: minmax(0, 1fr) 520px; }
          .topic-doc-scroll { overflow-y: auto; min-height: 0; }
        }
        @media (min-width: 1280px) {
          .topic-doc-grid { grid-template-columns: minmax(0, 1fr) 600px; }
        }
        @media (min-width: 1600px) {
          .topic-doc-grid { grid-template-columns: minmax(0, 1fr) 680px; }
        }
        @media (prefers-reduced-motion: no-preference) {
          .td-diagram svg path[fill="none"] {
            stroke-dasharray: 6 6;
            animation: td-flow 1.6s linear infinite;
          }
        }
        @keyframes td-flow { to { stroke-dashoffset: -24; } }
      `}</style>

      <div className="shrink-0 border-b border-white/[0.06] px-5 sm:px-8 py-2.5 flex items-center gap-2 text-[11px] font-mono text-[#8A8A8A]">
        <Link href={`/workspace/playground/track/${track.slug}`} className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
          <ArrowLeft size={13} style={{ color: accent }} /> {track.short}
        </Link>
        <span className="text-[#3F3F46]">/</span>
        <span className="text-[#D1D5DB] truncate">{sub.title}</span>
      </div>

      <div className="topic-doc-grid">
        {/* ---------- LEFT : documentation + Q&A — the only column that scrolls ---------- */}
        <div className="topic-doc-scroll scrollbar-thin min-w-0 px-5 sm:px-8 py-8">
          <div className="max-w-[820px] space-y-8">
            <div className="flex items-start gap-4">
              <span
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                style={{ color: accent, backgroundColor: `${accent}1A`, border: `1px solid ${accent}33` }}
              >
                <Icon size={22} />
              </span>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{sub.title}</h1>
                <p className="text-[13px] text-[#9CA3AF] mt-1">{sub.tagline}</p>
                <p className="text-[11px] font-mono text-[#6B7280] mt-1.5">{track.title} · {sub.questions.length} interview questions</p>
              </div>
            </div>

            <section className="space-y-3">
              <h2 className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280]">Overview</h2>
              <p className="text-[14px] text-[#D1D5DB] leading-relaxed">{sub.definition}</p>
              {concept?.concept.map((p, i) => (
                <p key={i} className="text-[13.5px] text-[#B4B8BF] leading-relaxed">{p}</p>
              ))}
            </section>

            {/* Below lg the pinned panel is not shown — render it inline here instead */}
            <section className="lg:hidden space-y-6">
              <Panel scene={scene} sceneInfo={sceneInfo} concept={concept} accent={accent} />
            </section>

            <section
              className="rounded-2xl border p-4 flex flex-wrap items-center gap-3"
              style={{ borderColor: `${accent}33`, background: `linear-gradient(135deg, ${accent}14, transparent)` }}
            >
              <FlaskConical size={16} style={{ color: accent }} />
              <p className="text-[12.5px] text-[#D1D5DB] flex-1 min-w-[200px]">
                {hasConsole
                  ? 'Drill these questions interactively and run this topic in a real in-browser Python console.'
                  : track.practiceHref
                    ? `Jump straight into ${sub.title} practice in this track’s workspace.`
                    : track.slug === 'dsa'
                      ? `Jump straight into a hands-on ${sub.title} problem in the code editor.`
                      : `Drill every ${sub.title} question as flashcards — reveal the answer, self-rate, track what you know.`}
              </p>
              <Link
                href={practiceHref}
                className="px-3.5 py-2 rounded-xl text-white text-[12px] font-semibold transition-opacity hover:opacity-90 whitespace-nowrap"
                style={{ backgroundColor: accent }}
              >
                {practiceLabel} →
              </Link>
            </section>

            <section className="space-y-4">
              <h2 className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280]">Questions &amp; answers</h2>
              {sub.questions.map((q, i) => {
                const lc = LEVEL_COLOR[q.level]
                const src = q.source ?? sub.reading[0]
                return (
                  <article key={q.id} className="rounded-2xl border border-white/[0.07] bg-[#0D0D10] p-5">
                    <div className="flex items-start gap-2 flex-wrap">
                      <span className="text-[12px] font-mono text-[#4B5563] mt-0.5">{i + 1}.</span>
                      <h3 className="text-[15px] font-bold text-white flex-1 min-w-0">{q.q}</h3>
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0" style={{ color: lc.text, backgroundColor: lc.bg, border: `1px solid ${lc.border}` }}>
                        {q.level}
                      </span>
                    </div>
                    <ol className="mt-3 space-y-2">
                      {q.outline.map((point, k) => (
                        <li key={k} className="flex gap-2.5 text-[13px] text-[#D1D5DB] leading-relaxed">
                          <span className="shrink-0 w-4 h-4 rounded bg-white/[0.06] text-[#8A8A8A] text-[9px] font-mono flex items-center justify-center mt-0.5">{k + 1}</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ol>
                    {q.followUp && (
                      <p className="mt-3 text-[12.5px] text-[#D1D5DB] leading-relaxed rounded-lg border border-[#FBBF24]/20 bg-[#FBBF24]/[0.05] px-3 py-2">
                        <span className="text-[#FBBF24] font-mono text-[10px] uppercase tracking-wider">Follow-up · </span>{q.followUp}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-4 flex-wrap">
                      <Link
                        href={practiceLinkFor(track, topicId, q.id)}
                        className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold transition-colors"
                        style={{ color: accent }}
                      >
                        <FlaskConical size={10} /> Practise this in the playground →
                      </Link>
                      {src && (
                        <a href={src.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#6B7280] hover:text-white transition-colors">
                          Reference: {src.label} <ExternalLink size={9} />
                        </a>
                      )}
                    </div>
                  </article>
                )
              })}
            </section>

            <section className="space-y-2">
              <h2 className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5">
                <BookOpen size={11} /> Further reading
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {sub.reading.map((r) => (
                  <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#8A8A8A] hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.15] px-2.5 py-1.5 rounded-lg transition-colors">
                    {r.label} <ExternalLink size={9} />
                  </a>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* ---------- RIGHT : fixed animated panel. Never scrolls the page;
             gets its own scrollbar only if its content overflows. ---------- */}
        <aside className="hidden lg:block topic-doc-scroll scrollbar-thin min-w-0 border-l border-white/[0.07] p-6 space-y-6">
          <Panel scene={scene} sceneInfo={sceneInfo} concept={concept} accent={accent} />
        </aside>
      </div>
    </div>
  )
}
