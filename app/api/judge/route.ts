// ---------------------------------------------------------------------------
// POST /api/judge — real code execution for the FORCE editor.
//
// Proxies to Piston (https://github.com/engineer-man/piston), a free,
// sandboxed, open-source execution engine — no API key required against the
// public instance. Runtimes are resolved dynamically against Piston's own
// /runtimes list (cached for a few minutes) so we never hardcode a version
// string that later goes stale.
//
// Every run is logged to `submissions` (best-effort — a logging failure
// never breaks the response) so a signed-in user's history is queryable
// later, e.g. for a "my past submissions" panel.
// ---------------------------------------------------------------------------

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const PISTON_API_URL = process.env.PISTON_API_URL || 'https://emkc.org/api/v2/piston'

// Our editor's language id -> { Piston language id, source filename }.
// Piston resolves the exact version for us via /runtimes; we just need the
// right language key and, for Java, a filename matching the public class.
const LANGUAGE_MAP: Record<string, { piston: string; file: string }> = {
  python: { piston: 'python', file: 'main.py' },
  javascript: { piston: 'javascript', file: 'main.js' },
  typescript: { piston: 'typescript', file: 'main.ts' },
  java: { piston: 'java', file: 'Solution.java' },
  cpp: { piston: 'c++', file: 'main.cpp' },
  c: { piston: 'c', file: 'main.c' },
  csharp: { piston: 'csharp', file: 'main.cs' },
  go: { piston: 'go', file: 'main.go' },
  rust: { piston: 'rust', file: 'main.rs' },
  kotlin: { piston: 'kotlin', file: 'main.kt' },
  swift: { piston: 'swift', file: 'main.swift' },
  ruby: { piston: 'ruby', file: 'main.rb' },
  php: { piston: 'php', file: 'main.php' },
}

interface PistonRuntime {
  language: string
  version: string
  aliases: string[]
}

let runtimeCache: { at: number; runtimes: PistonRuntime[] } | null = null
const RUNTIME_CACHE_MS = 5 * 60 * 1000

async function getRuntimes(): Promise<PistonRuntime[]> {
  if (runtimeCache && Date.now() - runtimeCache.at < RUNTIME_CACHE_MS) return runtimeCache.runtimes
  const res = await fetch(`${PISTON_API_URL}/runtimes`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Piston /runtimes returned ${res.status}`)
  const runtimes = (await res.json()) as PistonRuntime[]
  runtimeCache = { at: Date.now(), runtimes }
  return runtimes
}

export async function POST(request: Request) {
  let body: { language?: string; source?: string; stdin?: string; problemId?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { language, source, stdin = '', problemId } = body
  if (!language || typeof source !== 'string' || !source.trim()) {
    return NextResponse.json({ error: 'language and source are required' }, { status: 400 })
  }

  const mapped = LANGUAGE_MAP[language]
  if (!mapped) {
    return NextResponse.json({ error: `Unsupported language: ${language}` }, { status: 400 })
  }

  let version: string
  try {
    const runtimes = await getRuntimes()
    const runtime = runtimes.find((r) => r.language === mapped.piston || r.aliases?.includes(mapped.piston))
    if (!runtime) return NextResponse.json({ error: `Piston has no runtime for "${language}" right now` }, { status: 502 })
    version = runtime.version
  } catch {
    return NextResponse.json({ error: 'Could not reach the code execution service. Try again in a moment.' }, { status: 502 })
  }

  const started = Date.now()
  let result: {
    run?: { stdout: string; stderr: string; code: number | null; signal: string | null; output: string }
    compile?: { stdout: string; stderr: string; code: number | null }
  }
  try {
    const res = await fetch(`${PISTON_API_URL}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: mapped.piston,
        version,
        files: [{ name: mapped.file, content: source }],
        stdin,
        compile_timeout: 10000,
        run_timeout: 5000,
        compile_memory_limit: -1,
        run_memory_limit: -1,
      }),
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      return NextResponse.json({ error: `Execution service error (${res.status}): ${text.slice(0, 300)}` }, { status: 502 })
    }
    result = await res.json()
  } catch {
    return NextResponse.json({ error: 'Could not reach the code execution service. Try again in a moment.' }, { status: 502 })
  }
  const timeMs = Date.now() - started

  const compileFailed = !!result.compile && result.compile.code !== 0
  const run = result.run
  const status = compileFailed ? 'error' : run && run.code === 0 ? 'success' : 'error'
  const stdout = run?.stdout ?? ''
  const stderr = compileFailed ? result.compile?.stderr || '' : run?.stderr ?? ''

  // Best-effort submission log — never let this fail the actual response.
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('submissions').insert({
      user_id: user?.id ?? null,
      problem_id: problemId ?? null,
      language,
      source_code: source,
      stdin,
      status,
      stdout,
      stderr,
      time_ms: timeMs,
      memory_kb: null,
    })
  } catch {
    /* logging is best-effort only */
  }

  return NextResponse.json({ status, stdout, stderr, timeMs, compileError: compileFailed ? result.compile?.stderr : undefined })
}
