import { notFound } from 'next/navigation'
import TopicDoc from '@/components/playground/TopicDoc'
import { TRACKS, getTrack } from '@/lib/interview-tracks'

export function generateStaticParams() {
  return TRACKS.flatMap((t) => t.subtopics.map((s) => ({ slug: t.slug, topicId: s.id })))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; topicId: string }> }) {
  const { slug, topicId } = await params
  const track = getTrack(slug)
  const sub = track?.subtopics.find((s) => s.id === topicId)
  if (!track || !sub) return { title: 'Topic' }
  return {
    title: `${sub.title} — ${track.short}`,
    description: sub.tagline,
  }
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string; topicId: string }> }) {
  const { slug, topicId } = await params
  const track = getTrack(slug)
  const sub = track?.subtopics.find((s) => s.id === topicId)
  if (!track || !sub) notFound()
  return <TopicDoc trackSlug={slug} topicId={topicId} />
}
