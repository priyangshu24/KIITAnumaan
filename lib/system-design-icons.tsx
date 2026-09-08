// ---------------------------------------------------------------------------
// System Design component icons — AWS Architecture Icons visual language:
// a rounded-square tile filled with the service's category colour and a
// white line-art glyph inside. Not the trademarked asset files; drawn to
// match the recognisable style (orange = compute, purple = networking,
// green = storage, blue = database, pink = app-integration).
// ---------------------------------------------------------------------------

interface IconProps {
  kind: string
  size?: number
  /** fallback tile colour when `kind` has no mapping */
  color?: string
}

// ---- tile colours -----------------------------------------------------

const ORANGE = '#ED7100'   // Compute
const PURPLE = '#8C4FFF'   // Networking & Content Delivery
const GREEN = '#7AA116'    // Storage
const BLUE = '#527FFF'     // Database
const PINK = '#E7157B'     // Application Integration
const RED = '#DD344C'      // Security
const SLATE = '#5A6B86'    // generic / client
const GREY = '#5B6572'     // observability

const TILE: Record<string, string> = {
  client: SLATE, mobile: SLATE,

  dns: PURPLE, cdn: PURPLE, lb: PURPLE, ratelimiter: PURPLE,
  gateway: PINK, waf: RED,

  service: '#8B5CF6', worker: '#8B5CF6', websocket: '#8B5CF6',
  scheduler: '#8B5CF6', cronjob: '#8B5CF6',
  container: '#2496ED', k8s: '#326CE5', grpc: '#00ADD8', graphql: '#E10098',

  ec2: ORANGE, lambda: ORANGE,
  s3: GREEN, blob: GREEN,
  rds: BLUE, dynamodb: BLUE, elasticache: '#C925D1',
  sqs: PINK, kinesis: PURPLE,

  sqldb: '#0E9F6E', nosqldb: '#0D9488', postgres: '#4169E1', mongodb: '#00684A',
  cache: '#F59E0B', redis: '#D82C20', search: '#00A0DC', vector: '#0E9F6E',
  replica: '#0E9F6E', coordination: '#419EDA',

  queue: PINK, kafka: '#231F20', stream: PURPLE, cdc: PINK,

  metrics: GREY, analytics: PURPLE,
}

const tileFor = (kind: string, fallback = SLATE) => TILE[kind] ?? fallback

/** slightly lighten a #rrggbb hex for the tile gradient */
function lighten(hex: string, amt = 0.16): string {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.min(255, ((n >> 16) & 255) + Math.round(255 * amt))
  const g = Math.min(255, ((n >> 8) & 255) + Math.round(255 * amt))
  const b = Math.min(255, (n & 255) + Math.round(255 * amt))
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`
}

// ---- white line glyphs (drawn on a 24×24 grid) ----------------------

const S = { stroke: '#fff', strokeWidth: 1.7, fill: 'none' as const, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

const GLYPHS: Record<string, React.ReactNode> = {
  client: (
    <>
      <rect x="2.5" y="4" width="19" height="12.5" rx="1.5" {...S} />
      <path d="M8.5 20.5h7M12 16.5v4" {...S} />
    </>
  ),
  mobile: (
    <>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.2" {...S} />
      <path d="M10.5 18.5h3" {...S} />
    </>
  ),
  dns: (
    <>
      <circle cx="12" cy="12" r="8.5" {...S} />
      <path d="M3.5 12h17M12 3.5c3.2 2.6 3.2 15.4 0 17M12 3.5c-3.2 2.6-3.2 15.4 0 17" {...S} strokeWidth={1.4} />
    </>
  ),
  cdn: (
    <>
      <circle cx="12" cy="12" r="8.5" {...S} />
      <path d="M3.5 12h17M12 3.5v17M6 6c3.6 2.4 8.4 2.4 12 0M6 18c3.6-2.4 8.4-2.4 12 0" {...S} strokeWidth={1.4} />
    </>
  ),
  lb: (
    <>
      <circle cx="12" cy="4.5" r="2.4" {...S} />
      <circle cx="4.5" cy="19" r="2.4" {...S} />
      <circle cx="12" cy="19" r="2.4" {...S} />
      <circle cx="19.5" cy="19" r="2.4" {...S} />
      <path d="M12 7v3M12 10l-7.2 6.6M12 10v6.6M12 10l7.2 6.6" {...S} strokeWidth={1.4} />
    </>
  ),
  gateway: (
    <>
      <path d="M3.5 20.5V8L12 3.5 20.5 8v12.5" {...S} />
      <path d="M3.5 20.5h17M9.5 20.5v-6.5h5v6.5" {...S} />
    </>
  ),
  waf: (
    <>
      <path d="M12 2.8l7.5 3v5.4c0 5.3-3.2 8.6-7.5 10.8-4.3-2.2-7.5-5.5-7.5-10.8V5.8l7.5-3z" {...S} />
      <path d="M8.5 12l2.4 2.4L15.5 10" {...S} />
    </>
  ),
  ratelimiter: (
    <>
      <path d="M4 14.5a8 8 0 1 1 16 0" {...S} />
      <path d="M12 14.5l4.2-4.4" {...S} strokeWidth={1.9} />
      <circle cx="12" cy="14.5" r="1.5" fill="#fff" />
    </>
  ),
  service: (
    <>
      <path d="M12 2.8l8.2 4.7v9L12 21.2l-8.2-4.7v-9L12 2.8z" {...S} />
      <circle cx="12" cy="12" r="3.2" {...S} />
    </>
  ),
  worker: (
    <>
      <circle cx="12" cy="12" r="3.3" {...S} />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" {...S} strokeWidth={1.5} />
    </>
  ),
  websocket: (
    <>
      <path d="M4 8h16M20 16H4" {...S} />
      <path d="M17 4.5l3.5 3.5-3.5 3.5M7 12.5l-3.5 3.5L7 19.5" {...S} />
    </>
  ),
  scheduler: (
    <>
      <circle cx="12" cy="12.5" r="8" {...S} />
      <path d="M12 7.5v5l3.6 2.1" {...S} />
    </>
  ),
  cronjob: (
    <>
      <path d="M20.5 12.5a8.5 8.5 0 1 1-2.4-6" {...S} />
      <path d="M20.5 4v4h-4M12 8v4.5l3.2 2" {...S} />
    </>
  ),
  container: (
    <>
      <path d="M2.5 10h19v6a2 2 0 0 1-2 2H4.5a2 2 0 0 1-2-2v-6z" {...S} />
      <path d="M6 10V7h3v3M11 10V6h3v4M16 10V8h3v2" {...S} strokeWidth={1.4} />
    </>
  ),
  k8s: (
    <>
      <path d="M12 2.5l8.4 4.1L21.7 16 15 21.5H9L2.3 16 3.6 6.6 12 2.5z" {...S} />
      <circle cx="12" cy="12" r="2.6" {...S} />
      <path d="M12 5.5v3.9M18.2 9.8l-3.4 2.1M18.7 16l-3.9-1M8 19.3l1.8-3.4M6 9.8l3.4 2.1" {...S} strokeWidth={1.3} />
    </>
  ),
  grpc: (
    <>
      <path d="M3.5 8.5h12l-3-3M3.5 8.5l3 3" {...S} />
      <path d="M20.5 15.5h-12l3 3M20.5 15.5l-3-3" {...S} />
    </>
  ),
  graphql: (
    <>
      <circle cx="12" cy="4" r="1.9" {...S} />
      <circle cx="4.5" cy="16.5" r="1.9" {...S} />
      <circle cx="19.5" cy="16.5" r="1.9" {...S} />
      <path d="M12 6L5 15.5M12 6l7 9.5M6 16.5h12" {...S} strokeWidth={1.5} />
    </>
  ),

  // EC2 — chip with connector pins + two offset instance outlines
  ec2: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="1.2" {...S} />
      <path d="M9.5 7V4.5M12 7V4.5M14.5 7V4.5M9.5 17v2.5M12 17v2.5M14.5 17v2.5M7 9.5H4.5M7 12H4.5M7 14.5H4.5M17 9.5h2.5M17 12h2.5M17 14.5h2.5" {...S} strokeWidth={1.5} />
      <path d="M17 5.5h2.5V8" {...S} strokeWidth={1.4} />
      <path d="M7 18.5H4.5V16" {...S} strokeWidth={1.4} />
    </>
  ),
  lambda: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2.5" {...S} strokeWidth={1.5} />
      <path d="M7.5 17.5l4.5-11 4.5 11M9.5 13h5" {...S} strokeWidth={1.9} />
    </>
  ),

  blob: (
    <>
      <path d="M5 7.5c0-1.7 3.1-2.7 7-2.7s7 1 7 2.7l-1.3 11.3c-.1 1.4-2.7 2.4-5.7 2.4s-5.6-1-5.7-2.4L5 7.5z" {...S} />
      <path d="M5.3 9.6c1.5 1 4 1.6 6.7 1.6s5.2-.6 6.7-1.6" {...S} strokeWidth={1.4} />
    </>
  ),

  rds: (
    <>
      <ellipse cx="12" cy="5.5" rx="7.5" ry="2.8" {...S} />
      <path d="M4.5 5.5v13c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8v-13M4.5 12c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8" {...S} />
    </>
  ),
  dynamodb: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="2.6" {...S} />
      <path d="M5 6v12c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6V6" {...S} />
      <path d="M13 9l-2.6 4.2h3L10.8 17.4" {...S} strokeWidth={1.6} />
    </>
  ),
  mongodb: (
    <>
      <path d="M12 2.5c3.2 4.3 4.3 7.5 4.3 10.5 0 4.3-2.1 7.5-4.3 8.5-2.2-1-4.3-4.2-4.3-8.5 0-3 1.1-6.2 4.3-10.5z" {...S} />
      <path d="M12 6v15.5" {...S} strokeWidth={1.4} />
    </>
  ),
  redis: (
    <>
      <path d="M3 8l9-4 9 4-9 4-9-4z" {...S} />
      <path d="M3 12l9 4 9-4M3 16l9 4 9-4" {...S} />
    </>
  ),
  elasticache: (
    <>
      <path d="M3 8l9-4 9 4-9 4-9-4z" {...S} />
      <path d="M3 12l9 4 9-4M3 16l9 4 9-4" {...S} />
    </>
  ),
  cache: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" {...S} />
      <path d="M13 7l-4 6h3l-1 4 4-6h-3l1-4z" {...S} strokeWidth={1.6} />
    </>
  ),
  sqldb: (
    <>
      <ellipse cx="12" cy="5.5" rx="7.5" ry="2.8" {...S} />
      <path d="M4.5 5.5v13c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8v-13M4.5 12c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8" {...S} />
    </>
  ),
  nosqldb: (
    <>
      <path d="M5 6l7-3 7 3-7 3-7-3z" {...S} />
      <path d="M5 12l7 3 7-3M5 18l7 3 7-3M5 6v12M19 6v12M12 9v12" {...S} strokeWidth={1.4} />
    </>
  ),
  postgres: (
    <>
      <ellipse cx="12" cy="5.5" rx="7.5" ry="2.8" {...S} />
      <path d="M4.5 5.5v13c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8v-13M4.5 12c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8" {...S} />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6" {...S} />
      <path d="M15 15l5 5" {...S} strokeWidth={2} />
    </>
  ),
  vector: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" {...S} strokeWidth={1.5} />
      <circle cx="8" cy="9" r="1.4" fill="#fff" />
      <circle cx="14.5" cy="7" r="1.4" fill="#fff" />
      <circle cx="11" cy="14" r="1.4" fill="#fff" />
      <circle cx="16.5" cy="15.5" r="1.4" fill="#fff" />
      <path d="M8 9l3 5 3.5-7M11 14l5.5 1.5" {...S} strokeWidth={1.2} />
    </>
  ),
  replica: (
    <>
      <ellipse cx="8.5" cy="6.5" rx="4.5" ry="2" {...S} />
      <path d="M4 6.5v6c0 1.1 2 2 4.5 2s4.5-.9 4.5-2v-6" {...S} />
      <ellipse cx="15.5" cy="12.5" rx="4.5" ry="2" {...S} />
      <path d="M11 12.5v6c0 1.1 2 2 4.5 2s4.5-.9 4.5-2v-6" {...S} />
    </>
  ),
  coordination: (
    <>
      <circle cx="12" cy="5" r="2.2" {...S} />
      <circle cx="5" cy="17" r="2.2" {...S} />
      <circle cx="19" cy="17" r="2.2" {...S} />
      <path d="M10.6 6.8L6.4 15.2M13.4 6.8L17.6 15.2M7.2 17h9.6" {...S} strokeWidth={1.5} />
    </>
  ),

  queue: (
    <>
      <rect x="3" y="7" width="6" height="10" rx="1" {...S} />
      <rect x="10" y="7" width="6" height="10" rx="1" {...S} />
      <path d="M17.5 12h4M20 9.5l2.5 2.5L20 14.5" {...S} />
    </>
  ),
  sqs: (
    <>
      <rect x="3" y="7" width="6" height="10" rx="1" {...S} />
      <rect x="10" y="7" width="6" height="10" rx="1" {...S} />
      <path d="M17.5 12h4M20 9.5l2.5 2.5L20 14.5" {...S} />
    </>
  ),
  kafka: (
    <>
      <circle cx="6" cy="12" r="2.6" {...S} />
      <circle cx="17.5" cy="6.5" r="2.6" {...S} />
      <circle cx="17.5" cy="17.5" r="2.6" {...S} />
      <path d="M8.4 10.7l6.7-3M8.4 13.3l6.7 3" {...S} strokeWidth={1.5} />
    </>
  ),
  kinesis: (
    <>
      <path d="M3 12c2-4.5 4-4.5 6 0s4 4.5 6 0 4-4.5 6 0" {...S} strokeWidth={1.9} />
      <path d="M3 17c2-3.2 4-3.2 6 0" {...S} strokeWidth={1.4} opacity={0.6} />
    </>
  ),
  stream: (
    <>
      <path d="M3 12c2-4.5 4-4.5 6 0s4 4.5 6 0 4-4.5 6 0" {...S} strokeWidth={1.9} />
      <path d="M3 17c2-3.2 4-3.2 6 0" {...S} strokeWidth={1.4} opacity={0.6} />
    </>
  ),
  cdc: (
    <>
      <ellipse cx="9" cy="6" rx="5.5" ry="2.4" {...S} />
      <path d="M3.5 6v9c0 1.3 2.5 2.4 5.5 2.4 1.2 0 2.3-.2 3.2-.5M3.5 11c0 1.3 2.5 2.4 5.5 2.4" {...S} />
      <path d="M14 18h6M17 15l3 3-3 3" {...S} />
    </>
  ),

  metrics: (
    <>
      <path d="M4 20V4M4 20h16" {...S} />
      <rect x="7" y="12" width="3" height="5.5" fill="#fff" />
      <rect x="12" y="8" width="3" height="9.5" fill="#fff" />
      <rect x="17" y="5" width="3" height="12.5" fill="#fff" />
    </>
  ),
  analytics: (
    <>
      <path d="M3 5h18l-7 8v6l-4 2v-8L3 5z" {...S} />
    </>
  ),
}

const fallbackGlyph = <circle cx="12" cy="12" r="4" fill="#fff" />

// ---- component ------------------------------------------------------

export function SdIcon({ kind, size = 20, color }: IconProps) {
  const base = tileFor(kind, color || SLATE)
  const glyph = GLYPHS[kind] ?? fallbackGlyph
  const gid = `sd-tile-${kind}`
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ flexShrink: 0 }} aria-hidden>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={lighten(base, 0.18)} />
          <stop offset="1" stopColor={base} />
        </linearGradient>
      </defs>
      <rect x="0.5" y="0.5" width="39" height="39" rx="8" fill={`url(#${gid})`} stroke="rgba(255,255,255,0.14)" />
      <g transform="translate(8 8)">{glyph}</g>
    </svg>
  )
}

export const tileColorFor = (kind: string, fallback = SLATE) => tileFor(kind, fallback)
export const HAS_ICON = (kind: string) => kind in GLYPHS
