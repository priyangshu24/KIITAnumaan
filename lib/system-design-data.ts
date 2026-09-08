// ---------------------------------------------------------------------------
// System Design Playground — prompts, requirement checklists and the component
// palette used by the architecture canvas.
// ---------------------------------------------------------------------------

export type SdDifficulty = 'Easy' | 'Medium' | 'Hard'

export type SdGroup = 'Client' | 'Edge' | 'Compute' | 'AWS' | 'Data' | 'Async' | 'Observability'

/** Palette component kinds. `expects` on a prompt references these ids. */
export interface SdComponentKind {
  id: string
  label: string
  color: string
  group: SdGroup
  /** icon glyph key in system-design-icons; defaults to `id` */
  icon?: string
}

export const SD_COMPONENTS: SdComponentKind[] = [
  // Client
  { id: 'client', label: 'Web Client', color: '#94A3B8', group: 'Client' },
  { id: 'mobile', label: 'Mobile App', color: '#94A3B8', group: 'Client' },

  // Edge
  { id: 'dns', label: 'DNS (Route 53)', color: '#8C4FFF', group: 'Edge' },
  { id: 'cdn', label: 'CDN (CloudFront)', color: '#8C4FFF', group: 'Edge' },
  { id: 'lb', label: 'Load Balancer (ELB)', color: '#8C4FFF', group: 'Edge' },
  { id: 'gateway', label: 'API Gateway', color: '#FF4F8B', group: 'Edge' },
  { id: 'waf', label: 'WAF / Firewall', color: '#DD344C', group: 'Edge' },
  { id: 'ratelimiter', label: 'Rate Limiter', color: '#6366F1', group: 'Edge' },

  // Compute
  { id: 'service', label: 'App Service', color: '#8B5CF6', group: 'Compute' },
  { id: 'worker', label: 'Worker Pool', color: '#A855F7', group: 'Compute' },
  { id: 'websocket', label: 'WebSocket Gateway', color: '#8B5CF6', group: 'Compute' },
  { id: 'scheduler', label: 'Scheduler', color: '#A855F7', group: 'Compute' },
  { id: 'cronjob', label: 'Cron Job', color: '#A855F7', group: 'Compute' },
  { id: 'container', label: 'Container', color: '#2496ED', group: 'Compute' },
  { id: 'k8s', label: 'Kubernetes', color: '#326CE5', group: 'Compute' },
  { id: 'grpc', label: 'gRPC Service', color: '#00ADD8', group: 'Compute' },
  { id: 'graphql', label: 'GraphQL API', color: '#E10098', group: 'Compute' },

  // AWS primitives
  { id: 'ec2', label: 'EC2 Instance', color: '#FF9900', group: 'AWS' },
  { id: 'lambda', label: 'AWS Lambda', color: '#FF9900', group: 'AWS' },
  { id: 's3', label: 'S3 Bucket', color: '#569A31', group: 'AWS', icon: 'blob' },
  { id: 'rds', label: 'RDS (SQL)', color: '#527FFF', group: 'AWS', icon: 'sqldb' },
  { id: 'dynamodb', label: 'DynamoDB', color: '#527FFF', group: 'AWS' },
  { id: 'sqs', label: 'SQS Queue', color: '#FF4F8B', group: 'AWS', icon: 'queue' },
  { id: 'kinesis', label: 'Kinesis Stream', color: '#FF4F8B', group: 'AWS', icon: 'stream' },
  { id: 'elasticache', label: 'ElastiCache', color: '#C925D1', group: 'AWS', icon: 'redis' },

  // Data
  { id: 'sqldb', label: 'SQL Database', color: '#10B981', group: 'Data' },
  { id: 'nosqldb', label: 'NoSQL Store', color: '#14B8A6', group: 'Data' },
  { id: 'postgres', label: 'PostgreSQL', color: '#4169E1', group: 'Data', icon: 'sqldb' },
  { id: 'mongodb', label: 'MongoDB', color: '#47A248', group: 'Data' },
  { id: 'cache', label: 'Cache', color: '#F59E0B', group: 'Data' },
  { id: 'redis', label: 'Redis', color: '#DC382D', group: 'Data' },
  { id: 'blob', label: 'Object Storage', color: '#22C55E', group: 'Data' },
  { id: 'search', label: 'Search (Elasticsearch)', color: '#F9A825', group: 'Data' },
  { id: 'vector', label: 'Vector DB', color: '#10B981', group: 'Data' },
  { id: 'replica', label: 'Read Replica', color: '#10B981', group: 'Data' },
  { id: 'coordination', label: 'Coordination (etcd)', color: '#419EDA', group: 'Data' },

  // Async
  { id: 'queue', label: 'Message Queue', color: '#EC4899', group: 'Async' },
  { id: 'kafka', label: 'Kafka', color: '#EC4899', group: 'Async' },
  { id: 'stream', label: 'Event Stream', color: '#F43F5E', group: 'Async' },
  { id: 'cdc', label: 'CDC / Outbox', color: '#EC4899', group: 'Async' },

  // Observability
  { id: 'metrics', label: 'Metrics / Logs', color: '#64748B', group: 'Observability' },
  { id: 'analytics', label: 'Analytics / DW', color: '#64748B', group: 'Observability' },
]

export const SD_GROUP_ORDER: SdGroup[] = ['Client', 'Edge', 'Compute', 'AWS', 'Data', 'Async', 'Observability']

export const SD_COMPONENT_MAP: Record<string, SdComponentKind> = Object.fromEntries(
  SD_COMPONENTS.map((c) => [c.id, c]),
)

export type SdCategory =
  | 'Web-Scale Services'
  | 'Real-Time Systems'
  | 'Media & Content'
  | 'Data & Storage'
  | 'Infrastructure & Platform'

export const SD_CATEGORY_ORDER: SdCategory[] = [
  'Web-Scale Services',
  'Real-Time Systems',
  'Media & Content',
  'Data & Storage',
  'Infrastructure & Platform',
]

export interface SdPrompt {
  id: string
  title: string
  category: SdCategory
  difficulty: SdDifficulty
  tags: string[]
  brief: string
  functional: string[]
  nonFunctional: string[]
  estimation: string[]
  /** Component kind ids a strong answer normally includes. Drives coverage. */
  expects: string[]
  talkingPoints: string[]
}

export const SD_PROMPTS: SdPrompt[] = [
  {
    id: 'sd-url-shortener',
    category: 'Web-Scale Services',
    title: 'Design a URL Shortener',
    difficulty: 'Easy',
    tags: ['Read-heavy', 'Caching', 'ID generation'],
    brief:
      'Design a service like bit.ly: users submit a long URL and receive a short alias; visiting the alias redirects them. Start from requirements and end with the read path at scale.',
    functional: [
      'Create a short link from a long URL',
      'Redirect a short alias to the original URL',
      'Optional custom alias and expiry',
      'Basic click analytics',
    ],
    nonFunctional: [
      'Read:write ratio around 100:1 — optimise the redirect path',
      'Redirect p99 under 100 ms',
      'Aliases must never collide',
      'High availability; a stale read is acceptable',
    ],
    estimation: [
      '100M new links/day → ~1.2k writes/sec, ~120k reads/sec at 100:1',
      'Storage: 100M × ~500 B ≈ 50 GB/day before replication',
      'Base62 with 7 characters gives 62^7 ≈ 3.5 trillion aliases',
    ],
    expects: ['client', 'lb', 'service', 'cache', 'sqldb', 'cdn'],
    talkingPoints: [
      'Counter or Snowflake ID encoded in base62 avoids the collision handling that hashing needs.',
      '301 is cacheable and fastest but kills per-click analytics; 302 keeps them.',
      'Cache the alias→URL mapping aggressively — it is immutable once created.',
      'Custom aliases need a uniqueness check; expiry needs a TTL sweep or lazy deletion.',
    ],
  },
  {
    id: 'sd-news-feed',
    category: 'Web-Scale Services',
    title: 'Design a Social News Feed',
    difficulty: 'Medium',
    tags: ['Fan-out', 'Ranking', 'Pagination'],
    brief:
      'Design the feed for a social network: users follow others and see a ranked, paginated timeline of their posts.',
    functional: [
      'Publish a post',
      'Fetch a ranked, paginated feed',
      'Follow and unfollow users',
    ],
    nonFunctional: [
      'Feed load p99 under 200 ms',
      'Eventual consistency is fine — a post may take seconds to appear',
      'Must handle celebrity accounts with millions of followers',
    ],
    estimation: [
      '100M DAU, ~2 posts/day → ~2.3k writes/sec average, ~7k at peak',
      'Feed reads dominate: ~10 opens/user/day → ~12k reads/sec',
      'Fan-out on write for a 10M-follower account is 10M inserts — the reason hybrid exists',
    ],
    expects: ['client', 'lb', 'gateway', 'service', 'cache', 'nosqldb', 'queue', 'worker'],
    talkingPoints: [
      'Fan-out on write pre-computes inboxes: fast reads, catastrophic for celebrities.',
      'Fan-out on read merges at query time: cheap writes, slower reads.',
      'Hybrid — write-fanout for normal accounts, read-merge for celebrities — is the expected answer.',
      'Cursor pagination, never OFFSET: the feed shifts under the user.',
    ],
  },
  {
    id: 'sd-chat',
    category: 'Real-Time Systems',
    title: 'Design a Chat System',
    difficulty: 'Hard',
    tags: ['Real-time', 'WebSocket', 'Ordering'],
    brief:
      'Design a WhatsApp-style messaging system: 1:1 and group chat, delivery and read receipts, presence, and offline delivery.',
    functional: [
      '1:1 and group messaging',
      'Delivery and read receipts',
      'Online/offline presence',
      'Message history and offline sync',
    ],
    nonFunctional: [
      'Message delivery p99 under 500 ms',
      'Per-conversation ordering must be preserved',
      'No message loss once acknowledged',
      'Millions of concurrent connections',
    ],
    estimation: [
      '50M DAU, 40 messages/user/day → ~23k messages/sec average',
      'Concurrent connections ≈ 10M → ~10k connections per gateway node at 1k each',
      'Storage: 20B messages/year × 200 B ≈ 4 TB/year before replication',
    ],
    expects: ['client', 'lb', 'websocket', 'service', 'queue', 'nosqldb', 'cache', 'blob'],
    talkingPoints: [
      'Persistent WebSocket gateways plus a session registry mapping user → connection node.',
      'Partition the message store by conversation id; order with a per-conversation sequence number.',
      'Offline users need a durable per-user queue drained on reconnect.',
      'Presence via heartbeat with a short TTL — do not try to make it strongly consistent.',
      'End-to-end encryption removes server-side search and moderation; call the trade-off out.',
    ],
  },
  {
    id: 'sd-rate-limiter',
    category: 'Data & Storage',
    title: 'Design a Distributed Rate Limiter',
    difficulty: 'Medium',
    tags: ['Token bucket', 'Redis', 'Hot keys'],
    brief:
      'Design rate limiting for a public API gateway serving many tenants, enforced consistently across a fleet of gateway nodes.',
    functional: [
      'Per-API-key and per-endpoint limits',
      'Return 429 with Retry-After and limit headers',
      'Support burst allowance',
    ],
    nonFunctional: [
      'Adds under 5 ms to request latency',
      'Consistent across all gateway nodes',
      'Must survive the limiter store being unavailable',
    ],
    estimation: [
      '500k req/sec across the fleet → the shared store is the bottleneck',
      'A two-tier design absorbs >90% locally, so the shared store sees ~50k ops/sec',
    ],
    expects: ['client', 'lb', 'gateway', 'ratelimiter', 'cache', 'metrics'],
    talkingPoints: [
      'Token bucket allows bursts; sliding-window counter smooths them. Pick from product need.',
      'Atomicity matters — a Redis Lua script for check-and-decrement, not GET then SET.',
      'Two-tier: a local in-process limiter plus the shared store to enforce the global cap.',
      'Decide the failure mode explicitly: fail-open (availability) or fail-closed (protection).',
      'Hot keys need sharding or per-key local caching.',
    ],
  },
  {
    id: 'sd-video',
    category: 'Media & Content',
    title: 'Design a Video Streaming Platform',
    difficulty: 'Hard',
    tags: ['CDN', 'Transcoding', 'Adaptive bitrate'],
    brief:
      'Design a YouTube-style platform: upload, transcode, store and stream video with adaptive bitrate to a global audience.',
    functional: [
      'Upload a video',
      'Transcode to multiple resolutions and bitrates',
      'Adaptive-bitrate playback',
      'Search and recommendations',
    ],
    nonFunctional: [
      'Start-of-playback under 2 s globally',
      'Upload processing may take minutes — async is fine',
      'Storage is enormous and mostly cold',
    ],
    estimation: [
      '500 hours uploaded/minute; 1 hour of source ≈ 1 GB → ~500 GB/minute ingest',
      'Each source fans out to ~5 renditions → ~5× storage',
      'Egress dominates cost — CDN offload ratio is the key metric',
    ],
    expects: ['client', 'cdn', 'lb', 'gateway', 'service', 'blob', 'queue', 'worker', 'nosqldb', 'search'],
    talkingPoints: [
      'Upload goes directly to object storage via a pre-signed URL — never through the app tier.',
      'Transcoding is a queue-driven worker fleet fanning out per rendition; it must be idempotent.',
      'Segment into HLS/DASH chunks and serve from a CDN; the origin should see almost no traffic.',
      'Metadata in a database, the bytes in object storage — never the bytes in the DB.',
    ],
  },
  {
    id: 'sd-notification',
    category: 'Real-Time Systems',
    title: 'Design a Notification Service',
    difficulty: 'Medium',
    tags: ['Fan-out', 'Multi-channel', 'Idempotency'],
    brief:
      'Design a service that delivers notifications across push, email and SMS, with templating, user preferences and retries.',
    functional: [
      'Send to one user or a large segment',
      'Multiple channels: push, email, SMS, in-app',
      'Per-user preferences and quiet hours',
      'Templating and localisation',
    ],
    nonFunctional: [
      'At-least-once delivery with de-duplication',
      'Respect third-party provider rate limits',
      'Bulk campaigns must not starve transactional sends',
    ],
    estimation: [
      '10M notifications/day → ~120/sec average, with campaign spikes to 50k/sec',
      'Provider limits often cap you well below your own throughput — buffering is mandatory',
    ],
    expects: ['client', 'gateway', 'service', 'queue', 'worker', 'nosqldb', 'cache', 'metrics'],
    talkingPoints: [
      'Separate priority lanes so a marketing blast cannot delay a password reset.',
      'Idempotency key per logical notification prevents duplicate sends on retry.',
      'Per-provider workers with their own rate limits, backoff and a dead-letter queue.',
      'Preference and quiet-hours checks happen at send time, not enqueue time.',
    ],
  },
  {
    id: 'sd-ride-hailing',
    category: 'Real-Time Systems',
    title: 'Design a Ride-Hailing Service',
    difficulty: 'Hard',
    tags: ['Geospatial', 'Matching', 'Real-time'],
    brief:
      'Design Uber-style matching: riders request trips, nearby drivers are found and matched, and both track the trip live.',
    functional: [
      'Drivers publish location continuously',
      'Rider requests a ride and is matched to a nearby driver',
      'Live trip tracking and fare calculation',
    ],
    nonFunctional: [
      'Matching within a few seconds',
      'Location updates every 4–5 s from every active driver',
      'Regional isolation — an outage in one city must not spread',
    ],
    estimation: [
      '1M active drivers × 1 update / 4 s → ~250k writes/sec of location data',
      'Location is high-write, low-durability — a good fit for an in-memory geospatial index',
    ],
    expects: ['client', 'lb', 'gateway', 'service', 'cache', 'nosqldb', 'stream', 'worker', 'metrics'],
    talkingPoints: [
      'Index driver locations with geohash or S2 cells so "nearby" is a prefix/cell lookup, not a scan.',
      'Keep the hot location index in memory (Redis geo) and stream to durable storage asynchronously.',
      'Matching must avoid double-assigning a driver — an atomic claim or a per-driver lock.',
      'Shard by city or region; it bounds blast radius and keeps the geo index small.',
    ],
  },
  {
    id: 'sd-scheduler',
    category: 'Infrastructure & Platform',
    title: 'Design a Distributed Job Scheduler',
    difficulty: 'Hard',
    tags: ['Leader election', 'Exactly-once', 'Backpressure'],
    brief:
      'Design a scheduler that runs cron-style and one-off jobs reliably across a fleet, with retries and no duplicate execution.',
    functional: [
      'Schedule recurring (cron) and one-off jobs',
      'Retry with backoff on failure',
      'Cancel and reschedule',
      'Visibility into job history',
    ],
    nonFunctional: [
      'Fire within a few seconds of the scheduled time',
      'A job must not run twice concurrently',
      'Survive scheduler node failure',
    ],
    estimation: [
      '10M scheduled jobs, ~5k firing/sec at peak minute boundaries',
      'Cron jobs cluster at :00 — the thundering-herd problem is the real design challenge',
    ],
    expects: ['gateway', 'scheduler', 'sqldb', 'queue', 'worker', 'cache', 'metrics'],
    talkingPoints: [
      'Durable job store plus leader election (or shard ownership) so one node dispatches a given shard.',
      'A time-wheel or sorted-set index on next-run time makes "what is due now" cheap.',
      'At-least-once dispatch with idempotent job bodies and a visibility timeout on claim.',
      'Jitter scheduled times to spread the :00 spike; add per-tenant concurrency caps.',
    ],
  },

  // ---- Web-Scale Services ----
  {
    id: 'sd-typeahead',
    title: 'Design Search Autocomplete',
    category: 'Web-Scale Services',
    difficulty: 'Medium',
    tags: ['Trie', 'Prefix', 'Low latency'],
    brief: 'Design typeahead suggestions: as a user types a prefix, return the top-k most likely completions in a few milliseconds.',
    functional: ['Return top-k completions for a prefix', 'Rank by popularity / recency', 'Update the corpus as new queries arrive'],
    nonFunctional: ['Suggestion latency p99 under 50 ms', 'Eventually consistent — a new trend can lag minutes', 'Handle every keystroke from millions of users'],
    estimation: ['~5B searches/day, ~4 keystrokes each → ~250k prefix lookups/sec', 'Trie of the top few million prefixes fits in memory per shard'],
    expects: ['client', 'cdn', 'lb', 'gateway', 'service', 'cache', 'search', 'stream'],
    talkingPoints: [
      'Precompute the top-k per prefix node offline; serve from an in-memory trie, not a live query.',
      'Shard the trie by first 1–2 characters; replicate hot shards.',
      'A streaming pipeline aggregates query counts and rebuilds / patches the trie periodically.',
      'Debounce on the client and cache prefixes at the edge — most keystrokes are repeats.',
    ],
  },
  {
    id: 'sd-ecommerce',
    title: 'Design an E-commerce Product Catalog',
    category: 'Web-Scale Services',
    difficulty: 'Medium',
    tags: ['Search', 'Inventory', 'Read-heavy'],
    brief: 'Design the browse-and-search path for a large catalog: product pages, faceted search, and accurate stock display.',
    functional: ['Product detail pages', 'Faceted / full-text search', 'Show stock availability', 'Category and recommendation listings'],
    nonFunctional: ['Page and search p99 under 300 ms', 'Stock can be slightly stale on the listing, accurate at checkout', 'Handle Black-Friday spikes'],
    estimation: ['100M products, 50k searches/sec at peak', 'Read:write ratio ~1000:1 — everything is cached or indexed'],
    expects: ['client', 'cdn', 'lb', 'gateway', 'service', 'cache', 'search', 'sqldb', 'nosqldb'],
    talkingPoints: [
      'Catalog data in a document store; a search index (Elasticsearch) powers faceted queries.',
      'Product pages are heavily cached with event-based invalidation on price / description changes.',
      'Stock is a separate high-write service; the listing reads a cached approximate count, checkout does a real reservation.',
      'A CDC stream keeps the search index and cache in sync with the source of truth.',
    ],
  },
  {
    id: 'sd-pastebin',
    title: 'Design Pastebin',
    category: 'Web-Scale Services',
    difficulty: 'Easy',
    tags: ['Blob', 'TTL', 'Read-heavy'],
    brief: 'Design a service where users paste text, get a short URL, and anyone with the URL can read it — with optional expiry.',
    functional: ['Create a paste, return a short URL', 'Read a paste by id', 'Optional expiry and visibility'],
    nonFunctional: ['Read p99 under 150 ms', 'Durable once created', 'Read-heavy, write-light'],
    estimation: ['1M pastes/day, avg 10 KB → 10 GB/day', 'Reads ~50x writes'],
    expects: ['client', 'lb', 'service', 'cache', 'blob', 'sqldb'],
    talkingPoints: [
      'Metadata (id, owner, expiry) in a database; the paste body in object storage.',
      'Short id via base62 of a counter; the body key is the id.',
      'Cache hot pastes; a lazy TTL sweep or object-storage lifecycle rule handles expiry.',
    ],
  },

  // ---- Real-Time Systems ----
  {
    id: 'sd-collab-editor',
    title: 'Design a Collaborative Document Editor',
    category: 'Real-Time Systems',
    difficulty: 'Hard',
    tags: ['OT / CRDT', 'WebSocket', 'Conflict resolution'],
    brief: 'Design Google-Docs-style editing: many users edit one document concurrently and see each other’s changes in real time.',
    functional: ['Real-time concurrent editing', 'Presence and cursors', 'Version history and offline edits'],
    nonFunctional: ['Edit propagation under 200 ms', 'Convergence — everyone ends at the same document', 'No lost edits under concurrency'],
    estimation: ['Docs with up to ~50 concurrent editors; millions of docs', 'Each keystroke is an op — batching and compaction matter'],
    expects: ['client', 'lb', 'websocket', 'service', 'cache', 'nosqldb', 'queue', 'blob'],
    talkingPoints: [
      'Operational Transformation or CRDTs to merge concurrent edits deterministically.',
      'A per-document server (or actor) serialises ops and broadcasts to connected clients.',
      'Persist the op log; snapshot periodically so a new joiner does not replay everything.',
      'Presence via the same WebSocket channel with a short heartbeat TTL.',
    ],
  },
  {
    id: 'sd-live-comments',
    title: 'Design Live Comments / Reactions',
    category: 'Real-Time Systems',
    difficulty: 'Medium',
    tags: ['Fan-out', 'Pub/Sub', 'Backpressure'],
    brief: 'Design the live comment and reaction stream under a video or livestream watched by millions simultaneously.',
    functional: ['Post a comment / reaction', 'Stream new comments to all viewers', 'Rate-limit and moderate'],
    nonFunctional: ['Delivery under 1 s', 'Gracefully drop / sample under extreme load', 'A hot stream must not affect others'],
    estimation: ['1M concurrent viewers, 10k comments/sec on a hot stream', 'Fan-out is 10k × 1M — sampling and aggregation are mandatory'],
    expects: ['client', 'lb', 'websocket', 'service', 'stream', 'cache', 'nosqldb', 'ratelimiter'],
    talkingPoints: [
      'Pub/sub per stream; edge WebSocket nodes subscribe once and fan out to their local connections.',
      'Under load, sample the comment feed and show aggregate reaction counts rather than every event.',
      'Write path is rate-limited per user; moderation runs async and can retract.',
      'Sharding by stream id bounds blast radius.',
    ],
  },

  // ---- Media & Content ----
  {
    id: 'sd-file-storage',
    title: 'Design a File Storage / Sync Service',
    category: 'Media & Content',
    difficulty: 'Hard',
    tags: ['Chunking', 'Dedup', 'Sync'],
    brief: 'Design Dropbox-style storage: upload large files, sync across devices, share, and de-duplicate identical content.',
    functional: ['Upload / download files', 'Sync changes across a user’s devices', 'Sharing and permissions', 'Version history'],
    nonFunctional: ['Resumable uploads for large files', 'Sync latency seconds, not minutes', 'Storage-efficient via dedup'],
    estimation: ['500M users, avg 50 GB each → ~25 EB before dedup', 'Block-level dedup typically saves 30–50%'],
    expects: ['client', 'mobile', 'lb', 'gateway', 'service', 'blob', 'nosqldb', 'queue', 'cdc'],
    talkingPoints: [
      'Split files into content-hashed blocks; store each block once (dedup) in object storage.',
      'A metadata service tracks the block list per file version and per-device sync cursor.',
      'Clients diff locally and upload only changed blocks; downloads are resumable by block.',
      'A notification / long-poll channel tells other devices a change landed.',
    ],
  },
  {
    id: 'sd-cdn',
    title: 'Design a Content Delivery Network',
    category: 'Media & Content',
    difficulty: 'Hard',
    tags: ['Edge caching', 'Anycast', 'Invalidation'],
    brief: 'Design a CDN: serve static and streaming content from edge locations close to users, with cache invalidation.',
    functional: ['Cache and serve origin content from the edge', 'Purge / invalidate by URL or tag', 'Route users to the nearest healthy edge'],
    nonFunctional: ['Edge hit ratio above 90%', 'Purge propagation under 30 s globally', 'Survive an entire edge region failing'],
    estimation: ['Trillions of requests/day; petabytes of egress', 'Every 1% of hit-ratio improvement is a large origin-cost saving'],
    expects: ['client', 'dns', 'cdn', 'lb', 'service', 'blob', 'metrics'],
    talkingPoints: [
      'Anycast + GeoDNS route users to the nearest PoP; health checks steer around failures.',
      'Tiered cache: edge → regional shield → origin, so origin sees almost nothing.',
      'Invalidation via a fast pub/sub fan-out of purge events to every edge.',
      'Cache key discipline (strip tracking params, vary correctly) is what makes or breaks hit ratio.',
    ],
  },

  // ---- Data & Storage ----
  {
    id: 'sd-kv-store',
    title: 'Design a Distributed Key-Value Store',
    category: 'Data & Storage',
    difficulty: 'Hard',
    tags: ['Consistent hashing', 'Replication', 'Quorum'],
    brief: 'Design a horizontally scalable KV store (Dynamo-style): partitioned, replicated, and tunably consistent.',
    functional: ['get(key) / put(key, value)', 'Configurable replication factor', 'Add / remove nodes without downtime'],
    nonFunctional: ['Single-digit-ms reads and writes', 'Tunable consistency (quorum N/R/W)', 'No single point of failure'],
    estimation: ['Trillions of keys, millions of ops/sec', 'Node failure is constant at scale — design for it as normal'],
    expects: ['client', 'gateway', 'service', 'coordination', 'nosqldb', 'replica', 'metrics'],
    talkingPoints: [
      'Consistent hashing with virtual nodes so adding a node only remaps ~1/N of keys.',
      'Replicate to the next N nodes on the ring; reads/writes use quorum R + W > N for strong-ish consistency.',
      'Anti-entropy (Merkle trees) and hinted handoff repair divergence after failures.',
      'Vector clocks or last-write-wins for conflict resolution — state the trade-off.',
    ],
  },
  {
    id: 'sd-metrics',
    title: 'Design a Metrics & Monitoring System',
    category: 'Data & Storage',
    difficulty: 'Hard',
    tags: ['Time-series', 'Downsampling', 'Alerting'],
    brief: 'Design a metrics platform: ingest millions of time-series points per second, store efficiently, query for dashboards, and alert.',
    functional: ['Ingest counter / gauge / histogram metrics', 'Range queries and aggregations for dashboards', 'Rule-based alerting'],
    nonFunctional: ['Ingest sustained at millions of points/sec', 'Recent data queryable within seconds', 'Old data downsampled, not deleted'],
    estimation: ['10M active series, 1 point / 10 s → ~1M writes/sec', 'Raw retention days, rolled-up retention years'],
    expects: ['client', 'gateway', 'service', 'queue', 'worker', 'nosqldb', 'cache', 'metrics'],
    talkingPoints: [
      'A purpose-built time-series store: columnar, timestamp-ordered, heavy compression (delta-of-delta, XOR).',
      'Ingest through a buffer/queue so a query spike never backs up writes.',
      'Downsample on a rollup pipeline: 10s → 1m → 1h; queries pick the coarsest resolution that satisfies the range.',
      'Alerting evaluates rules on a sliding window; dedupe and group notifications.',
    ],
  },

  // ---- Infrastructure & Platform ----
  {
    id: 'sd-message-queue',
    title: 'Design a Distributed Message Queue',
    category: 'Infrastructure & Platform',
    difficulty: 'Hard',
    tags: ['Partitioning', 'Offsets', 'Durability'],
    brief: 'Design a Kafka-style log: durable, partitioned, ordered-per-partition, with consumer groups and replay.',
    functional: ['Produce to a topic', 'Consume with consumer groups', 'Replay from an offset', 'Configurable retention'],
    nonFunctional: ['Millions of messages/sec per cluster', 'Ordering guaranteed per partition', 'No data loss once acked (with replication)'],
    estimation: ['A topic at 1M msg/sec × 1 KB = 1 GB/sec; partition count sets parallelism', 'Sequential disk writes are the whole trick — it is faster than random RAM'],
    expects: ['service', 'coordination', 'stream', 'blob', 'replica', 'metrics'],
    talkingPoints: [
      'An append-only commit log per partition; consumers track their own offset.',
      'Replicate each partition to a leader + followers; a write is acked after the ISR has it.',
      'Consumer groups partition the topic across members; rebalancing on membership change.',
      'Retention by time or size; tiered storage offloads cold segments to object storage.',
    ],
  },
  {
    id: 'sd-feature-flags',
    title: 'Design a Feature Flag Service',
    category: 'Infrastructure & Platform',
    difficulty: 'Medium',
    tags: ['Config push', 'Targeting', 'Low latency'],
    brief: 'Design a service that lets teams toggle features and run percentage rollouts / targeting without a deploy.',
    functional: ['Define flags with targeting rules', 'Evaluate a flag for a given user context', 'Instant kill-switch'],
    nonFunctional: ['Flag evaluation is local and sub-millisecond', 'Rule changes propagate in seconds', 'A flag-service outage must fail safe (last-known config)'],
    estimation: ['Thousands of flags, evaluated on nearly every request across the fleet', 'Config is tiny; the challenge is fan-out and freshness'],
    expects: ['client', 'gateway', 'service', 'cache', 'stream', 'sqldb', 'cdn'],
    talkingPoints: [
      'SDKs pull the full ruleset and evaluate locally — no network call per flag check.',
      'A streaming / SSE channel (or short poll) pushes ruleset updates to every SDK.',
      'Rules are authored in a console, versioned, and stored in a database; the edge serves a compiled bundle.',
      'SDK caches the last-known ruleset on disk so a control-plane outage is invisible.',
    ],
  },
]

export const SD_DIFFICULTY_COLOR: Record<SdDifficulty, { text: string; bg: string; border: string }> = {
  Easy: { text: '#10B981', bg: 'rgba(16,185,129,0.10)', border: 'rgba(16,185,129,0.30)' },
  Medium: { text: '#F59E0B', bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.30)' },
  Hard: { text: '#EF4444', bg: 'rgba(239,68,68,0.10)', border: 'rgba(239,68,68,0.30)' },
}
