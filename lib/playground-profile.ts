// ---------------------------------------------------------------------------
// Technical profile — a heuristic "AI" analysis of the user's practice.
//
// Reads solved-problem data (localStorage) and the problem catalogue, then
// derives per-topic / per-difficulty mastery, strengths, gaps, an overall
// readiness score and a short natural-language summary.
// ---------------------------------------------------------------------------

import { PROBLEMS, type Difficulty, type Topic } from '@/lib/playground-data'
import { readSolvedIds, readSolvedLog } from '@/lib/playground-stats'

export interface TopicMastery {
  topic: Topic
  total: number
  solved: number
  ratio: number
}

export interface DifficultyMastery {
  difficulty: Difficulty
  total: number
  solved: number
  ratio: number
}

export interface TechProfile {
  readiness: number // 0-100
  totalSolved: number
  totalProblems: number
  startedTopics: number
  totalTopics: number
  topics: TopicMastery[]
  strengths: TopicMastery[]
  focusAreas: TopicMastery[]
  difficulty: DifficultyMastery[]
  languages: { language: string; count: number }[]
  summary: string[]
  verdict: { headline: string; body: string }
}

const DIFFS: Difficulty[] = ['Easy', 'Medium', 'Hard']

function listPhrase(items: string[]): string {
  if (items.length === 0) return ''
  if (items.length === 1) return items[0]
  return `${items.slice(0, -1).join(', ')} & ${items[items.length - 1]}`
}

export function analyzeProfile(): TechProfile {
  const solvedIds = new Set(readSolvedIds())
  const log = readSolvedLog()

  // --- topic mastery -----------------------------------------------------
  const topicSet = new Set<Topic>()
  PROBLEMS.forEach((p) => p.topics.forEach((t) => { if (t !== 'All') topicSet.add(t) }))

  const topics: TopicMastery[] = [...topicSet]
    .map((topic) => {
      const inTopic = PROBLEMS.filter((p) => p.topics.includes(topic))
      const solved = inTopic.filter((p) => solvedIds.has(p.id)).length
      return { topic, total: inTopic.length, solved, ratio: inTopic.length ? solved / inTopic.length : 0 }
    })
    .sort((a, b) => b.solved - a.solved || b.total - a.total || a.topic.localeCompare(b.topic))

  // --- difficulty mastery ---------------------------------------------------
  const difficulty: DifficultyMastery[] = DIFFS.map((d) => {
    const inD = PROBLEMS.filter((p) => p.difficulty === d)
    const solved = inD.filter((p) => solvedIds.has(p.id)).length
    return { difficulty: d, total: inD.length, solved, ratio: inD.length ? solved / inD.length : 0 }
  })

  // --- language usage -----------------------------------------------------
  const langCount: Record<string, number> = {}
  log.forEach((e) => { langCount[e.language] = (langCount[e.language] ?? 0) + 1 })
  const languages = Object.entries(langCount)
    .map(([language, count]) => ({ language, count }))
    .sort((a, b) => b.count - a.count)

  const totalSolved = solvedIds.size
  const totalProblems = PROBLEMS.length
  const startedTopics = topics.filter((t) => t.solved > 0).length
  const totalTopics = topicSet.size

  const strengths = topics
    .filter((t) => t.solved >= 2 || (t.solved >= 1 && t.ratio >= 0.6))
    .slice(0, 4)

  const untouched = topics.filter((t) => t.solved === 0 && t.total > 0).sort((a, b) => b.total - a.total)
  const focusAreas = untouched.length
    ? untouched.slice(0, 4)
    : topics.filter((t) => t.ratio < 1).sort((a, b) => a.ratio - b.ratio).slice(0, 3)

  // --- readiness score -----------------------------------------------------
  const coverage = totalProblems ? totalSolved / totalProblems : 0
  const breadth = totalTopics ? startedTopics / totalTopics : 0
  const medComfort = difficulty.find((d) => d.difficulty === 'Medium')?.ratio ?? 0
  const hardComfort = difficulty.find((d) => d.difficulty === 'Hard')?.ratio ?? 0
  const readiness = Math.round(
    Math.min(100, coverage * 45 + breadth * 30 + medComfort * 15 + hardComfort * 10),
  )

  const weakestDiff = [...difficulty].filter((d) => d.total > 0).sort((a, b) => a.ratio - b.ratio)[0]

  // --- narrative summary -------------------------------------------------
  const summary: string[] = []
  if (totalSolved === 0) {
    summary.push("No solved problems yet. Clear a few and I'll map out where you're strong and where you're stuck.")
  } else {
    if (strengths.length) {
      const names = strengths.slice(0, 2).map((s) => s.topic)
      summary.push(
        `Strongest in ${listPhrase(names)} — ${strengths[0].solved} problem${strengths[0].solved > 1 ? 's' : ''} cleared there.`,
      )
    }
    if (focusAreas.length) {
      const names = focusAreas.slice(0, 2).map((s) => s.topic)
      const untried = focusAreas[0].solved === 0
      summary.push(
        `Biggest gap: ${listPhrase(names)}${untried ? ' — not attempted yet' : ''}. Prioritise ${focusAreas.length > 1 ? 'these' : 'this'} for placement prep.`,
      )
    }
    if (weakestDiff && weakestDiff.ratio < 0.5) {
      summary.push(`${weakestDiff.difficulty} problems are the weak spot (${weakestDiff.solved}/${weakestDiff.total} solved).`)
    }
    if (languages.length === 1) {
      summary.push(`All solutions so far are in ${languages[0].language} — try another language to broaden fundamentals.`)
    } else if (languages.length > 1) {
      summary.push(`Practising across ${languages.length} languages, mostly ${languages[0].language}.`)
    }
  }

  // --- one-line verdict -------------------------------------------------
  const topStrength = strengths[0]?.topic
  const topGap = focusAreas[0]?.topic
  let verdict: { headline: string; body: string }
  if (totalSolved === 0) {
    verdict = {
      headline: "Let's build your momentum!",
      body: "You haven't solved any problems yet — and that's totally okay. Start with a few hand-picked questions for your level and build your confidence.",
    }
  } else if (readiness < 35) {
    verdict = {
      headline: 'Early days — keep the streak alive.',
      body: `${totalSolved} problem${totalSolved > 1 ? 's' : ''} down. ${topGap ? `Next up: ${topGap}${focusAreas[0].solved === 0 ? " — you haven't touched it yet." : '.'}` : 'Branch into new topics next.'}`,
    }
  } else if (readiness < 65) {
    verdict = {
      headline: 'A solid foundation is forming.',
      body: `Strong on ${topStrength ?? 'the fundamentals'}. Close the gap on ${topGap ?? 'harder problems'} to level up your profile.`,
    }
  } else if (readiness < 85) {
    verdict = {
      headline: "You're interview-warm.",
      body: `Good breadth across ${startedTopics}/${totalTopics} topics. Push ${weakestDiff?.difficulty ?? 'Hard'} problems to finish strong.`,
    }
  } else {
    verdict = {
      headline: 'Placement-ready across the board.',
      body: `Consistent across topics and difficulty. Keep the streak and revisit ${topGap ?? 'weak spots'} to stay sharp.`,
    }
  }

  return {
    readiness,
    totalSolved,
    totalProblems,
    startedTopics,
    totalTopics,
    topics,
    strengths,
    focusAreas,
    difficulty,
    languages,
    summary,
    verdict,
  }
}
