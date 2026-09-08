import { notFound } from 'next/navigation'
import TrackHub from '@/components/playground/TrackHub'
import { TRACKS, getTrack } from '@/lib/interview-tracks'

export function generateStaticParams() {
  return TRACKS.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const track = getTrack(slug)
  if (!track) return { title: 'Interview Track' }
  return { title: track.title, description: track.description }
}

export default async function TrackPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const track = getTrack(slug)
  if (!track) notFound()
  return <TrackHub track={track} />
}
