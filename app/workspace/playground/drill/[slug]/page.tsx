import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import TrackDrill from '@/components/playground/TrackDrill'
import { TRACKS, getTrack } from '@/lib/interview-tracks'

// The Q&A Drill trainer serves the tracks that have no code to run.
const DRILL_SLUGS = TRACKS.filter((t) => !t.practiceHref && t.slug !== 'dsa').map((t) => t.slug)

export function generateStaticParams() {
  return DRILL_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const track = getTrack(slug)
  return track ? { title: `${track.short} · Drill`, description: `Flashcard drill for ${track.title}` } : { title: 'Drill' }
}

export default async function DrillPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!DRILL_SLUGS.includes(slug)) notFound()
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <TrackDrill trackSlug={slug} />
    </Suspense>
  )
}
