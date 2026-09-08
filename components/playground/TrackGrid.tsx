'use client'

import Link from 'next/link'
import {
  ArrowRight, Sparkles, Binary, Network, Database, Users, Briefcase, Circle, Cpu, Calculator,
  type LucideIcon,
} from 'lucide-react'
import { TRACKS, trackStats, AIML_LEVELS } from '@/lib/interview-tracks'
import { LEVEL_COLOR } from '@/lib/aiml-interview-data'

const ICONS: Record<string, LucideIcon> = {
  sparkles: Sparkles, binary: Binary, network: Network,
  database: Database, users: Users, briefcase: Briefcase, cpu: Cpu, calculator: Calculator,
}
const iconFor = (k: string): LucideIcon => ICONS[k] ?? Circle

/**
 * `strip`  — horizontally scrollable row (used on the Directory page)
 * `grid`   — responsive card grid (used on the /tracks index)
 */
export default function TrackGrid({ variant = 'grid' }: { variant?: 'grid' | 'strip' }) {
  const wrapper =
    variant === 'strip'
      ? 'flex gap-3 overflow-x-auto scrollbar-thin pb-2 snap-x snap-mandatory'
      : 'grid sm:grid-cols-2 xl:grid-cols-3 gap-3'

  return (
    <div className={wrapper}>
      {TRACKS.map((t) => {
        const Icon = iconFor(t.icon)
        const s = trackStats(t)
        return (
          <Link
            key={t.slug}
            href={`/workspace/playground/track/${t.slug}`}
            className={`group relative overflow-hidden rounded-2xl border p-4 transition-all ${
              variant === 'strip' ? 'min-w-[300px] sm:min-w-[340px] shrink-0 snap-start' : ''
            }`}
            style={{
              borderColor: `${t.accent}33`,
              background: `linear-gradient(135deg, ${t.accent}14, transparent 70%)`,
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <span
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ color: t.accent, backgroundColor: `${t.accent}1F`, border: `1px solid ${t.accent}44` }}
              >
                <Icon size={18} />
              </span>
              {t.featured && (
                <span
                  className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0"
                  style={{ color: t.accent, backgroundColor: `${t.accent}1A`, border: `1px solid ${t.accent}44` }}
                >
                  Featured
                </span>
              )}
            </div>

            <h3 className="text-[14px] font-bold text-white mt-3">{t.title}</h3>
            <p className="text-[11px] text-[#8A8A8A] mt-1 leading-relaxed line-clamp-2">{t.tagline}</p>

            <div className="flex flex-wrap gap-1 mt-2.5">
              {t.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="text-[8px] font-mono text-[#8A8A8A] bg-white/[0.04] border border-white/[0.06] px-1.5 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06]">
              <div className="flex items-center gap-2.5 text-[9px] font-mono">
                <span className="text-[#D1D5DB]">{s.questions} Q</span>
                <span className="text-[#3F3F46]">·</span>
                <span className="text-[#6B7280]">{s.subtopics} topics</span>
                <span className="text-[#3F3F46]">·</span>
                {AIML_LEVELS.map((l) => (
                  <span key={l} style={{ color: LEVEL_COLOR[l].text }}>{s.byLevel[l]}</span>
                ))}
              </div>
              <ArrowRight
                size={14}
                className="group-hover:translate-x-0.5 transition-transform shrink-0"
                style={{ color: t.accent }}
              />
            </div>
          </Link>
        )
      })}
    </div>
  )
}
