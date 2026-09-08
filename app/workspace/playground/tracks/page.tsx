import TrackGrid from '@/components/playground/TrackGrid'
import { ALL_TRACKS_STATS } from '@/lib/interview-tracks'

export const metadata = {
  title: 'Interview Tracks',
  description: 'AI/ML, DSA, System Design, SQL, Behavioural and HR/Manager interview preparation tracks.',
}

export default function TracksIndexPage() {
  return (
    <div className="max-w-[1600px] mx-auto pb-12 space-y-5">
      <div className="relative overflow-hidden w-full bg-[#0B0B0D] border border-white/[0.08] rounded-[24px] p-6 lg:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.45)]">
        <img
          src="/kiit-campus-dotted.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-[75%_center] opacity-85 pointer-events-none z-0 rounded-[24px]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0D] via-[#0B0B0D]/80 to-transparent pointer-events-none z-10 rounded-[24px]" />
        <div className="relative z-20 max-w-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF453A] font-mono drop-shadow">
            Interview Preparation
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-[38px] font-bold text-white tracking-tight leading-none mt-2 drop-shadow-md">
            Interview Tracks
          </h1>
          <p className="text-xs sm:text-sm text-[#A0A0A0] mt-3 leading-relaxed drop-shadow">
            {ALL_TRACKS_STATS.questions} graded questions across {ALL_TRACKS_STATS.tracks} tracks and{' '}
            {ALL_TRACKS_STATS.subtopics} subtopics — every question carries an answer outline, a level
            label and a linked primary source. Freshers through SDE III.
          </p>
        </div>
      </div>

      <TrackGrid variant="grid" />
    </div>
  )
}
