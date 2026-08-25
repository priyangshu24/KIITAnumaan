'use client'

import { Fragment, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  companyDrives,
  drivePrepPlans,
  blueprintData,
  buildQuestionPlatformLinks,
  atsRoleTemplates,
  atsExperienceLevels,
  buildAtsJd,
  type QuestionFrequency,
  type AtsRoleTemplate,
} from '@/lib/career-data'
import {
  FileCheck,
  Sparkles,
  Target,
  Award,
  Bot,
  Send,
  TrendingUp,
  Building2,
  CheckCircle2,
  Clock,
  Zap,
  GripVertical,
  Upload,
  X,
  Maximize2,
  Wand2,
  ChevronDown,
  Plus,
  Trash2,
  ExternalLink,
  Code2,
  Database,
  MessageCircle,
  Search,
} from 'lucide-react'

// Navigation tab types
type CareerTab = 'resume' | 'ats' | 'placement' | 'blueprint' | 'mentor'

interface ResumeSection {
  id: string
  label: string
}

interface CompanyResumeCard {
  id: string
  company: string
  role: string
  roleId: string | null
  level: string
  suggestion: string
  atsBefore: number
  atsAfter: number
  logoUrl: string | null
  tailored: boolean
}

interface ResumeBullet {
  id: string
  title: string
  detail: string
}

const initialResumeSections: ResumeSection[] = [
  { id: 'header', label: 'Header & contact' },
  { id: 'education', label: 'Education' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
]

const initialCompanyCards: CompanyResumeCard[] = [
  {
    id: 'highradius',
    company: 'HighRadius',
    role: 'Software Engineer',
    roleId: 'software-engineer',
    level: 'Fresher (0-1 Yr)',
    suggestion: 'Leads with your KIITAnumaan systems project and Docker. Adds Spring Boot, CI/CD and unit-testing keywords.',
    atsBefore: 72,
    atsAfter: 88,
    logoUrl: null,
    tailored: false,
  },
  {
    id: 'microsoft',
    company: 'Microsoft',
    role: 'SDE-1',
    roleId: 'sde-1',
    level: 'Fresher (0-1 Yr)',
    suggestion: 'Reframes projects around DSA depth and System Design. Adds distributed systems and OOP design keywords.',
    atsBefore: 66,
    atsAfter: 84,
    logoUrl: null,
    tailored: false,
  },
  {
    id: 'deloitte',
    company: 'Deloitte USI',
    role: 'Analyst - Technology Consulting',
    roleId: 'analyst',
    level: 'Fresher (0-1 Yr)',
    suggestion: 'Reframes projects as business outcomes. Surfaces leadership, case-study framing and Excel/SQL keywords.',
    atsBefore: 61,
    atsAfter: 81,
    logoUrl: null,
    tailored: false,
  },
]

const initialProjectBullets: ResumeBullet[] = [
  {
    id: 'proj-1',
    title: 'Paper-forecast engine',
    detail: 'clustered 1.4k questions across 5 years, ranked by recurrence; cut revision time 40% for 300 beta users.',
  },
  {
    id: 'proj-2',
    title: 'Campus routing service',
    detail: 'graph shortest-path over 62 mapped nodes, 120ms p95 response.',
  },
]

const initialExperienceBullets: ResumeBullet[] = [
  {
    id: 'exp-1',
    title: 'Software Engineering Intern',
    detail: 'Tech Corp — built REST APIs and cut p95 latency by 30%.',
  },
]

const aiResumeSuggestions = [
  { id: 1, text: 'Add a quantifiable metric to your Campus routing service bullet — recruiters weight numbers 2x higher.' },
  { id: 2, text: '"Docker" and "CI/CD" are missing from your Skills line but required by 3 of your 4 target companies.' },
  { id: 3, text: 'Your Experience section is thin — add one more bullet with a measurable outcome.' },
  { id: 4, text: 'Swap "built REST APIs" for a stronger action verb like "shipped" or "architected".' },
]

const templateCategories = [
  'Software engineering',
  'Data science',
  'Product management',
  'Consulting',
  'Core engineering',
  'Research',
  'Internship',
  'Fresher',
]

// Section ordering per field, grounded in real ATS resume-writing conventions:
// SWE/Data Science put Skills + Projects up top (technical bar comes first);
// PM/Consulting lead with Experience (impact-driven pitch); Research and
// entry-level tracks (Core Eng/Internship/Fresher) lead with Education since
// there is little work history to anchor the resume around yet.
const templateSectionOrders: Record<string, { order: string[]; rationale: string }> = {
  'Software engineering': {
    order: ['header', 'skills', 'projects', 'experience', 'education'],
    rationale: 'Technical Skills and Projects lead — ATS parsers and recruiters scan for stack match first.',
  },
  'Data science': {
    order: ['header', 'skills', 'projects', 'experience', 'education'],
    rationale: 'Tools/languages and analysis projects lead, mirroring how data JDs list requirements.',
  },
  'Product management': {
    order: ['header', 'experience', 'projects', 'skills', 'education'],
    rationale: 'Experience leads with a quantified-impact pitch — PM resumes are evaluated on outcomes first.',
  },
  Consulting: {
    order: ['header', 'experience', 'education', 'projects', 'skills'],
    rationale: 'Experience and Education (pedigree) lead; case-style impact matters more than a skills list.',
  },
  'Core engineering': {
    order: ['header', 'education', 'skills', 'projects', 'experience'],
    rationale: 'Branch/CGPA leads for core-engineering hiring bars, followed by lab/design skills and projects.',
  },
  Research: {
    order: ['header', 'education', 'projects', 'experience', 'skills'],
    rationale: 'Education leads; Projects double as research work, the section recruiters weight most here.',
  },
  Internship: {
    order: ['header', 'education', 'skills', 'projects', 'experience'],
    rationale: 'Education-forward since work history is thin — Projects substitute for Experience.',
  },
  Fresher: {
    order: ['header', 'education', 'skills', 'projects', 'experience'],
    rationale: 'Education-forward with Projects doing the heavy lifting in place of a work history.',
  },
}

const LOGO_PALETTES = [
  'from-sky-500 to-blue-600',
  'from-emerald-500 to-teal-600',
  'from-violet-500 to-purple-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-sky-600',
]

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')

const getLogoPalette = (name: string) => {
  const hash = name.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  return LOGO_PALETTES[hash % LOGO_PALETTES.length]
}

const frequencyBadgeClass = (freq: QuestionFrequency) => {
  if (freq === 'Very High') return 'bg-red-500/10 text-red-400 border-red-500/30'
  if (freq === 'High') return 'bg-amber-500/10 text-amber-400 border-amber-500/30'
  return 'bg-white/5 text-[#8A8A8A] border-white/10'
}

// ---------------------------------------------------------------------------
// ATS CHECKER DATA
// ---------------------------------------------------------------------------
interface AtsBreakdown {
  overall: number
  keywordMatch: number
  evidenceQuality: number
  skillCoverage: number
  formatting: number
}

interface AtsCompanyOption {
  id: string
  company: string
}

const atsCompanyOptions: AtsCompanyOption[] = [
  { id: 'microsoft', company: 'Microsoft' },
  { id: 'amazon', company: 'Amazon' },
  { id: 'nvidia', company: 'NVIDIA' },
  { id: 'adobe', company: 'Adobe' },
  { id: 'salesforce', company: 'Salesforce' },
  { id: 'atlassian', company: 'Atlassian' },
  { id: 'deshaw', company: 'DE Shaw & Co' },
  { id: 'dell', company: 'Dell Technologies' },
  { id: 'infosys', company: 'Infosys' },
  { id: 'accenture', company: 'Accenture' },
  { id: 'cognizant', company: 'Cognizant' },
  { id: 'capgemini', company: 'Capgemini' },
  { id: 'genpact', company: 'Genpact India' },
  { id: 'darwinbox', company: 'DarwinBox' },
  { id: 'yugabyte', company: 'YugaByte' },
  { id: 'mckinsey', company: 'McKinsey & Company' },
  { id: 'nielseniq', company: 'NielsenIQ' },
  { id: 'highradius', company: 'HighRadius' },
  { id: 'deloitte', company: 'Deloitte USI' },
  { id: 'pwc', company: 'PwC India' },
]


// Resume-structure observations — independent of which company/role is selected,
// since they describe the document itself, not a JD match.
const atsFormattingIssues = [
  'Two-column header may split on parse',
  'Skills listed inside a table',
  'Dates written in three formats',
]

const atsHighestValueFix =
  'Three bullets state a task without an outcome. Restructure as verb → object → measured result using numbers already in your projects.'

const getAtsParseability = (formatting: number) => Math.min(100, formatting + 4)

const getAtsBarColor = (value: number) => {
  if (value >= 85) return 'bg-emerald-400'
  if (value >= 50) return 'bg-amber-400'
  return 'bg-white/20'
}

const atsBreakdowns: Record<string, AtsBreakdown> = {
  microsoft: {
    overall: 74,
    keywordMatch: 68,
    evidenceQuality: 70,
    skillCoverage: 92,
    formatting: 100,
  },
  highradius: {
    overall: 88,
    keywordMatch: 82,
    evidenceQuality: 90,
    skillCoverage: 95,
    formatting: 100,
  },
  deloitte: {
    overall: 81,
    keywordMatch: 76,
    evidenceQuality: 84,
    skillCoverage: 90,
    formatting: 95,
  },
  pwc: {
    overall: 79,
    keywordMatch: 72,
    evidenceQuality: 80,
    skillCoverage: 90,
    formatting: 95,
  },
  amazon: {
    overall: 79,
    keywordMatch: 74,
    evidenceQuality: 78,
    skillCoverage: 90,
    formatting: 100,
  },
  nvidia: {
    overall: 71,
    keywordMatch: 65,
    evidenceQuality: 68,
    skillCoverage: 88,
    formatting: 95,
  },
  adobe: {
    overall: 83,
    keywordMatch: 80,
    evidenceQuality: 82,
    skillCoverage: 90,
    formatting: 100,
  },
  salesforce: {
    overall: 76,
    keywordMatch: 70,
    evidenceQuality: 75,
    skillCoverage: 88,
    formatting: 95,
  },
  atlassian: {
    overall: 85,
    keywordMatch: 82,
    evidenceQuality: 86,
    skillCoverage: 90,
    formatting: 100,
  },
  deshaw: {
    overall: 68,
    keywordMatch: 60,
    evidenceQuality: 65,
    skillCoverage: 92,
    formatting: 95,
  },
  dell: {
    overall: 80,
    keywordMatch: 76,
    evidenceQuality: 80,
    skillCoverage: 88,
    formatting: 100,
  },
  infosys: {
    overall: 89,
    keywordMatch: 85,
    evidenceQuality: 88,
    skillCoverage: 92,
    formatting: 100,
  },
  accenture: {
    overall: 86,
    keywordMatch: 82,
    evidenceQuality: 85,
    skillCoverage: 90,
    formatting: 100,
  },
  cognizant: {
    overall: 87,
    keywordMatch: 84,
    evidenceQuality: 86,
    skillCoverage: 90,
    formatting: 100,
  },
  capgemini: {
    overall: 82,
    keywordMatch: 78,
    evidenceQuality: 80,
    skillCoverage: 88,
    formatting: 100,
  },
  genpact: {
    overall: 84,
    keywordMatch: 80,
    evidenceQuality: 83,
    skillCoverage: 88,
    formatting: 100,
  },
  darwinbox: {
    overall: 78,
    keywordMatch: 74,
    evidenceQuality: 77,
    skillCoverage: 86,
    formatting: 95,
  },
  yugabyte: {
    overall: 72,
    keywordMatch: 66,
    evidenceQuality: 70,
    skillCoverage: 88,
    formatting: 95,
  },
  mckinsey: {
    overall: 75,
    keywordMatch: 68,
    evidenceQuality: 74,
    skillCoverage: 92,
    formatting: 95,
  },
  nielseniq: {
    overall: 81,
    keywordMatch: 77,
    evidenceQuality: 80,
    skillCoverage: 88,
    formatting: 100,
  },
}

// ---------------------------------------------------------------------------
// AI MENTOR
// ---------------------------------------------------------------------------
const mentorQuickPrompts = [
  'What is the HighRadius interview process?',
  'Give me a 7-day DSA sheet for Microsoft',
  'Most asked HR questions',
  'How do I improve my ATS score?',
  'Tips for the Deloitte case study round',
]

const getMentorResponse = (input: string): string => {
  const q = input.toLowerCase()
  if (q.includes('highradius'))
    return 'HighRadius runs Aptitude Test → Tech Round → HR Round. Focus on SQL joins, REST API design, and OS process scheduling — their tech round leans product-engineering over pure DSA.'
  if (q.includes('microsoft'))
    return 'Microsoft SDE-1 has 2 coding rounds plus a bar-raiser. Prioritize medium-hard DSA (Trees, Graphs, DP) and explain your approach out loud before you code.'
  if (q.includes('deloitte'))
    return 'Deloitte USI is case-study heavy. Structure answers with MECE, lead with business impact, and keep a 2-minute "walk me through a project" story ready.'
  if (q.includes('pwc'))
    return "PwC's Cybersecurity track checks OWASP Top 10, risk assessment fundamentals, and one defensible Python scripting project. Raw DSA matters less here."
  if (q.includes('ats') || q.includes('resume'))
    return 'Head to the ATS Checker tab, pick your target company, and address the "Missing Keywords" list first — that alone usually moves your score up 10-15 points.'
  if (q.includes('hr') || q.includes('behavioral'))
    return 'Most-asked HR questions: "Tell me about yourself", "Why this company", "A time you handled conflict in a team project", and "Where do you see yourself in 5 years". Keep each answer under 90 seconds.'
  if (q.includes('dsa') || q.includes('sheet') || q.includes('leetcode'))
    return 'A focused 7-day sheet: Day 1-2 Arrays & Two Pointers, Day 3-4 Trees & Graphs (BFS/DFS), Day 5 Dynamic Programming, Day 6 SQL practice, Day 7 mock interview + revision.'
  if (q.includes('aptitude'))
    return 'For aptitude rounds, drill Quantitative + Logical Reasoning under strict time limits — speed matters more than raw difficulty. 20 timed questions a day for a week is usually enough.'
  return 'Good question! Based on your HighRadius OA in 10 days, I would prioritize SQL joins, B-Tree indexing, and 2 medium array problems daily. Ask me about a specific company, a DSA sheet, resume tips, or HR questions any time.'
}

export default function CareerWorkspacePage() {
  const [activeTab, setActiveTab] = useState<CareerTab>('resume')
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)

  // ---------------------------------------------------------------------
  // Resume Builder state
  // ---------------------------------------------------------------------
  const [resumeName] = useState('Soumya Samantray')
  const [resumeCgpa] = useState('8.92')
  const [resumeSections, setResumeSections] = useState<ResumeSection[]>(initialResumeSections)
  const [activeSection, setActiveSection] = useState('projects')
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [selectedTemplateCategory, setSelectedTemplateCategory] = useState('Software engineering')
  const [companyCards, setCompanyCards] = useState<CompanyResumeCard[]>(initialCompanyCards)
  const [resumeFilterCompanyId, setResumeFilterCompanyId] = useState('all')
  const [resumeFilterRoleId, setResumeFilterRoleId] = useState('all')
  const [resumeFilterLevel, setResumeFilterLevel] = useState('all')

  const resumeFilterCompanyName = resumeFilterCompanyId === 'all'
    ? null
    : atsCompanyOptions.find((c) => c.id === resumeFilterCompanyId)?.company ?? null
  const resumeFilterRoleName = resumeFilterRoleId === 'all'
    ? null
    : atsRoleTemplates.find((r) => r.id === resumeFilterRoleId)?.role ?? null

  const filteredCompanyCards = companyCards.filter(
    (card) =>
      (!resumeFilterCompanyName || card.company === resumeFilterCompanyName) &&
      (!resumeFilterRoleName || card.role === resumeFilterRoleName) &&
      (resumeFilterLevel === 'all' || card.level === resumeFilterLevel)
  )

  // When Company + Role are picked but nothing has been tailored for that
  // combination yet, generate a live on-the-fly preview instead of a blank grid.
  const resumeFilterRoleTemplate = resumeFilterRoleId === 'all'
    ? null
    : atsRoleTemplates.find((r) => r.id === resumeFilterRoleId) ?? null
  const resumeFilterPreviewCard: CompanyResumeCard | null =
    filteredCompanyCards.length === 0 && resumeFilterCompanyName && resumeFilterRoleTemplate
      ? (() => {
          const baseAts = atsBreakdowns[resumeFilterCompanyId]?.overall ?? 65
          return {
            id: `preview-${resumeFilterCompanyId}-${resumeFilterRoleTemplate.id}`,
            company: resumeFilterCompanyName,
            role: resumeFilterRoleTemplate.role,
            roleId: resumeFilterRoleTemplate.id,
            level: resumeFilterLevel === 'all' ? 'Fresher (0-1 Yr)' : resumeFilterLevel,
            suggestion: `Adds ${resumeFilterRoleTemplate.missingKeywords.join(', ')} to close the gap. Biggest opportunity: ${resumeFilterRoleTemplate.skillGap}.`,
            atsBefore: baseAts,
            atsAfter: Math.min(baseAts + 16, 97),
            logoUrl: null,
            tailored: false,
          }
        })()
      : null

  const [showAddCompany, setShowAddCompany] = useState(false)
  const [newCompanyName, setNewCompanyName] = useState('')
  const [newCompanyRole, setNewCompanyRole] = useState('')
  const [newCompanyJd, setNewCompanyJd] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const [educationLine, setEducationLine] = useState('B.Tech Computer Science (2022 - 2026) · CGPA: 8.92')
  const [skillsLine, setSkillsLine] = useState('Python · TypeScript · PostgreSQL · Docker · PyTorch')
  const [projectBullets, setProjectBullets] = useState<ResumeBullet[]>(initialProjectBullets)
  const [experienceBullets, setExperienceBullets] = useState<ResumeBullet[]>(initialExperienceBullets)

  const handleDragStart = (index: number) => setDragIndex(index)

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (dragIndex === null || dragIndex === index) return
    setResumeSections((prev) => {
      const updated = [...prev]
      const [moved] = updated.splice(dragIndex, 1)
      updated.splice(index, 0, moved)
      return updated
    })
    setDragIndex(index)
  }

  const handleDragEnd = () => setDragIndex(null)

  const handleSelectTemplate = (cat: string) => {
    setSelectedTemplateCategory(cat)
    const template = templateSectionOrders[cat]
    if (!template) return
    const labelById = new Map(initialResumeSections.map((s) => [s.id, s.label]))
    setResumeSections(template.order.map((id) => ({ id, label: labelById.get(id) ?? id })))
  }

  const handleLogoFile = (id: string, file: File | undefined) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setCompanyCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, logoUrl: reader.result as string } : c))
      )
    }
    reader.readAsDataURL(file)
  }

  const handleAddCompany = () => {
    if (!newCompanyName.trim() || !newCompanyRole.trim()) {
      alert('Enter a company name and role.')
      return
    }
    const baseAts = 60 + Math.floor(Math.random() * 15)
    const matchedRole = atsRoleTemplates.find(
      (r) => r.role.toLowerCase() === newCompanyRole.trim().toLowerCase()
    )
    const newCard: CompanyResumeCard = {
      id: `company-${Date.now()}`,
      company: newCompanyName.trim(),
      role: newCompanyRole.trim(),
      roleId: matchedRole?.id ?? null,
      level: 'Fresher (0-1 Yr)',
      suggestion: newCompanyJd.trim()
        ? 'Tailoring resume to emphasize keywords pulled from the pasted job description.'
        : 'Add a job description for sharper keyword tailoring.',
      atsBefore: baseAts,
      atsAfter: Math.min(baseAts + 16, 97),
      logoUrl: null,
      tailored: false,
    }
    setCompanyCards((prev) => [...prev, newCard])
    setNewCompanyName('')
    setNewCompanyRole('')
    setNewCompanyJd('')
    setShowAddCompany(false)
  }

  const handleExportPdf = () => alert('Exporting resume as PDF...')

  // Actually tailors the resume for a company card: merges that role's missing
  // keywords into the Skills line, marks the card done, and opens the editor
  // so the change is immediately visible instead of just showing an alert.
  const handleTailorCard = (card: CompanyResumeCard) => {
    const roleTemplate = card.roleId ? atsRoleTemplates.find((r) => r.id === card.roleId) : undefined

    if (roleTemplate) {
      setSkillsLine((prev) => {
        const existing = prev.split('·').map((s) => s.trim().toLowerCase())
        const toAdd = roleTemplate.missingKeywords.filter((kw) => !existing.includes(kw.toLowerCase()))
        return toAdd.length ? `${prev} · ${toAdd.join(' · ')}` : prev
      })
    }

    setCompanyCards((prev) =>
      prev.map((c) => (c.id === card.id ? { ...c, atsBefore: c.atsAfter, tailored: true } : c))
    )

    setIsFullscreen(true)
  }

  const handleTailorPreviewCard = () => {
    if (!resumeFilterPreviewCard) return
    setCompanyCards((prev) => [...prev, resumeFilterPreviewCard])
    handleTailorCard(resumeFilterPreviewCard)
  }

  const updateProjectBullet = (idx: number, field: 'title' | 'detail', value: string) => {
    setProjectBullets((prev) => prev.map((b, i) => (i === idx ? { ...b, [field]: value } : b)))
  }

  const updateExperienceBullet = (idx: number, field: 'title' | 'detail', value: string) => {
    setExperienceBullets((prev) => prev.map((b, i) => (i === idx ? { ...b, [field]: value } : b)))
  }

  const addProjectBullet = () => {
    setProjectBullets((prev) => [
      ...prev,
      { id: `proj-${Date.now()}`, title: 'New project', detail: 'Click here to describe the impact — add a metric.' },
    ])
  }

  const removeProjectBullet = (idx: number) => {
    setProjectBullets((prev) => prev.filter((_, i) => i !== idx))
  }

  const addExperienceBullet = () => {
    setExperienceBullets((prev) => [
      ...prev,
      { id: `exp-${Date.now()}`, title: 'New role', detail: 'Click here to describe the outcome — add a metric.' },
    ])
  }

  const removeExperienceBullet = (idx: number) => {
    setExperienceBullets((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleApplySuggestion = (id: number) => {
    if (id === 2) {
      setSkillsLine((prev) => (prev.includes('Docker') ? prev : `${prev} · Docker · CI/CD`))
      alert('Added Docker & CI/CD to your Skills line.')
      return
    }
    if (id === 4) {
      setExperienceBullets((prev) =>
        prev.map((exp, idx) =>
          idx === 0 ? { ...exp, detail: exp.detail.replace('built REST APIs', 'shipped REST APIs') } : exp
        )
      )
      alert('Updated the verb in your Experience bullet.')
      return
    }
    alert('Noted — edit the highlighted line directly to apply this.')
  }

  const renderCompactPreview = () => (
    <>
      <div>
        <h2 className="text-xl font-serif font-bold">{resumeName}</h2>
        <p className="text-[11px] text-gray-600 font-mono mt-0.5">
          B.Tech CSE · KIIT · soumya.samantray@kiit.ac.in · github.com/soumyasamantray
        </p>
      </div>

      {resumeSections
        .filter((sec) => sec.id !== 'header')
        .map((sec) => {
          if (sec.id === 'education') {
            return (
              <div key={sec.id}>
                <h4 className="text-[10px] font-bold uppercase border-b border-black/20 pb-0.5 mb-1">Education</h4>
                <p className="font-bold text-[11px]">Kalinga Institute of Industrial Technology (KIIT)</p>
                <p className="text-[10px] text-gray-600">{educationLine}</p>
              </div>
            )
          }
          if (sec.id === 'projects') {
            return (
              <div key={sec.id}>
                <h4 className="text-[10px] font-bold uppercase border-b border-black/20 pb-0.5 mb-1">Projects</h4>
                {projectBullets.map((p) => (
                  <p key={p.id} className="text-[10px] text-gray-700 mt-1 first:mt-0">
                    <span className="font-bold text-black">{p.title}</span> — {p.detail}
                  </p>
                ))}
              </div>
            )
          }
          if (sec.id === 'experience') {
            return (
              <div key={sec.id}>
                <h4 className="text-[10px] font-bold uppercase border-b border-black/20 pb-0.5 mb-1">Experience</h4>
                {experienceBullets.map((exp) => (
                  <p key={exp.id} className="text-[10px] text-gray-700 mt-1 first:mt-0">
                    <span className="font-bold text-black">{exp.title}</span> — {exp.detail}
                  </p>
                ))}
              </div>
            )
          }
          if (sec.id === 'skills') {
            return (
              <div key={sec.id}>
                <h4 className="text-[10px] font-bold uppercase border-b border-black/20 pb-0.5 mb-1">Skills</h4>
                <p className="text-[10px] text-gray-700">{skillsLine}</p>
              </div>
            )
          }
          return null
        })}
    </>
  )

  const EditableLine = ({
    value,
    onChange,
    className,
  }: {
    value: string
    onChange: (v: string) => void
    className?: string
  }) => (
    <p
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => onChange(e.currentTarget.textContent || '')}
      className={`${className || ''} outline-none focus:bg-amber-50 rounded-sm px-0.5 -mx-0.5 transition-colors cursor-text`}
    >
      {value}
    </p>
  )

  const renderEditablePreview = () => (
    <>
      <div>
        <h2 className="text-2xl font-serif font-bold">{resumeName}</h2>
        <p className="text-xs text-gray-600 font-mono mt-1">
          B.Tech CSE · KIIT · soumya.samantray@kiit.ac.in · github.com/soumyasamantray
        </p>
      </div>

      {resumeSections
        .filter((sec) => sec.id !== 'header')
        .map((sec) => {
          if (sec.id === 'education') {
            return (
              <div key={sec.id}>
                <h4 className="text-xs font-bold uppercase border-b border-black/20 pb-1 mb-1.5">Education</h4>
                <p className="font-bold text-sm">Kalinga Institute of Industrial Technology (KIIT)</p>
                <EditableLine value={educationLine} onChange={setEducationLine} className="text-xs text-gray-600" />
              </div>
            )
          }
          if (sec.id === 'projects') {
            return (
              <div key={sec.id} className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase border-b border-black/20 pb-1 mb-1.5">Projects</h4>
                {projectBullets.map((p, idx) => (
                  <div key={p.id} className="group/bullet relative pr-6">
                    <EditableLine
                      value={p.title}
                      onChange={(v) => updateProjectBullet(idx, 'title', v)}
                      className="text-xs font-bold text-black"
                    />
                    <EditableLine
                      value={p.detail}
                      onChange={(v) => updateProjectBullet(idx, 'detail', v)}
                      className="text-xs text-gray-700"
                    />
                    <button
                      onClick={() => removeProjectBullet(idx)}
                      title="Remove this bullet"
                      className="absolute top-0 right-0 w-5 h-5 rounded-md text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover/bullet:opacity-100 flex items-center justify-center transition-all cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addProjectBullet}
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 hover:text-black transition-colors cursor-pointer"
                >
                  <Plus size={12} /> Add project
                </button>
              </div>
            )
          }
          if (sec.id === 'experience') {
            return (
              <div key={sec.id} className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase border-b border-black/20 pb-1 mb-1.5">Experience</h4>
                {experienceBullets.map((exp, idx) => (
                  <div key={exp.id} className="group/bullet relative pr-6">
                    <EditableLine
                      value={exp.title}
                      onChange={(v) => updateExperienceBullet(idx, 'title', v)}
                      className="text-xs font-bold text-black"
                    />
                    <EditableLine
                      value={exp.detail}
                      onChange={(v) => updateExperienceBullet(idx, 'detail', v)}
                      className="text-xs text-gray-700"
                    />
                    <button
                      onClick={() => removeExperienceBullet(idx)}
                      title="Remove this bullet"
                      className="absolute top-0 right-0 w-5 h-5 rounded-md text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover/bullet:opacity-100 flex items-center justify-center transition-all cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addExperienceBullet}
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 hover:text-black transition-colors cursor-pointer"
                >
                  <Plus size={12} /> Add experience
                </button>
              </div>
            )
          }
          if (sec.id === 'skills') {
            return (
              <div key={sec.id}>
                <h4 className="text-xs font-bold uppercase border-b border-black/20 pb-1 mb-1.5">Skills</h4>
                <EditableLine value={skillsLine} onChange={setSkillsLine} className="text-xs text-gray-700" />
              </div>
            )
          }
          return null
        })}
    </>
  )

  // ---------------------------------------------------------------------
  // ATS Checker state
  // ---------------------------------------------------------------------
  const [resumeText, setResumeText] = useState(
    'Soumya Samantray | Roll: 22051892 | KIIT CSE\nSkills: React, Next.js, TypeScript, Node.js, C++, Data Structures, OS, SQL.\nProjects: KIITAnumaan SaaS, Realtime Collaborative Canvas.\nExperience: Software Intern at Tech Corp.'
  )
  const [resumeFileName, setResumeFileName] = useState<string | null>(null)
  const [isParsingResume, setIsParsingResume] = useState(false)

  const handleResumeFile = async (file: File | undefined) => {
    if (!file) return
    const name = file.name.toLowerCase()

    if (name.endsWith('.txt') || file.type === 'text/plain') {
      const text = await file.text()
      setResumeText(text)
      setResumeFileName(file.name)
      return
    }

    if (name.endsWith('.pdf') || file.type === 'application/pdf') {
      setIsParsingResume(true)
      try {
        const pdfjs = await import('pdfjs-dist')
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/build/pdf.worker.min.mjs',
          import.meta.url
        ).toString()
        const buffer = await file.arrayBuffer()
        const pdf = await pdfjs.getDocument({ data: buffer }).promise
        let fullText = ''
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const content = await page.getTextContent()
          const pageText = content.items.map((item) => ('str' in item ? item.str : '')).join(' ')
          fullText += pageText + '\n'
        }
        setResumeText(fullText.trim())
        setResumeFileName(file.name)
      } catch {
        alert('Could not extract text from this PDF. Try exporting it as plain text and pasting it instead.')
      } finally {
        setIsParsingResume(false)
      }
      return
    }

    alert('Unsupported file type — please upload a .txt or .pdf resume, or paste the text directly.')
  }

  const [selectedAtsCompanyId, setSelectedAtsCompanyId] = useState('highradius')
  const [selectedAtsRoleId, setSelectedAtsRoleId] = useState('software-engineer')
  const [selectedAtsExperience, setSelectedAtsExperience] = useState('Fresher (0-1 Yr)')
  const [targetJd, setTargetJd] = useState(
    buildAtsJd('HighRadius', atsRoleTemplates.find((r) => r.id === 'software-engineer')!)
  )
  const currentAtsBreakdown = atsBreakdowns[selectedAtsCompanyId]
  const currentAtsCompany = atsCompanyOptions.find((o) => o.id === selectedAtsCompanyId)!
  const currentAtsRole =
    atsRoleTemplates.find((r) => r.id === selectedAtsRoleId) ?? atsRoleTemplates[0]

  const handleSelectAtsCompany = (id: string) => {
    setSelectedAtsCompanyId(id)
    const company = atsCompanyOptions.find((o) => o.id === id)
    if (company) setTargetJd(buildAtsJd(company.company, currentAtsRole))
  }

  const handleSelectAtsRole = (id: string) => {
    setSelectedAtsRoleId(id)
    const role = atsRoleTemplates.find((r) => r.id === id)
    if (role) setTargetJd(buildAtsJd(currentAtsCompany.company, role))
  }

  // "Optimize resume" on the ATS Checker: merges this role's missing keywords
  // into the Skills line, then opens the same full-screen editor + Optimize
  // with AI sidebar used by the Resume Builder tab, so the change is visible
  // and the user can keep refining it right there.
  const handleOptimizeFromAts = () => {
    setSkillsLine((prev) => {
      const existing = prev.split('·').map((s) => s.trim().toLowerCase())
      const toAdd = currentAtsRole.missingKeywords.filter((kw) => !existing.includes(kw.toLowerCase()))
      return toAdd.length ? `${prev} · ${toAdd.join(' · ')}` : prev
    })
    setIsFullscreen(true)
  }

  // ---------------------------------------------------------------------
  // Placement Planner state
  // ---------------------------------------------------------------------
  const [expandedDriveId, setExpandedDriveId] = useState<string | null>(null)
  const handleToggleDrive = (id: string) => setExpandedDriveId((prev) => (prev === id ? null : id))
  const [placementFilterCompanyId, setPlacementFilterCompanyId] = useState('all')
  const [placementFilterRoleId, setPlacementFilterRoleId] = useState('all')
  const [placementFilterLevel, setPlacementFilterLevel] = useState('all')

  const filteredCompanyDrives = companyDrives.filter(
    (c) =>
      (placementFilterCompanyId === 'all' || c.id === placementFilterCompanyId) &&
      (placementFilterRoleId === 'all' || c.roleId === placementFilterRoleId) &&
      (placementFilterLevel === 'all' || c.level === placementFilterLevel)
  )

  // ---------------------------------------------------------------------
  // AI Blueprint state
  // ---------------------------------------------------------------------
  const [selectedBlueprintId, setSelectedBlueprintId] = useState('c-2')
  const blueprint = blueprintData[selectedBlueprintId]
  const plan = drivePrepPlans[selectedBlueprintId]

  // ---------------------------------------------------------------------
  // Mentor Chat state
  // ---------------------------------------------------------------------
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello Soumya! I am your AI Placement Mentor. HighRadius online assessment is scheduled in 10 days. Would you like a 10-day preparation sprint for Operating Systems & SQL?',
    },
  ])

  const handleSendChat = () => {
    if (!chatInput.trim()) return
    const query = chatInput
    setChatMessages((prev) => [...prev, { sender: 'user', text: query }])
    setChatInput('')
    setTimeout(() => {
      setChatMessages((prev) => [...prev, { sender: 'ai', text: getMentorResponse(query) }])
    }, 600)
  }

  const handleQuickPrompt = (prompt: string) => {
    setChatMessages((prev) => [...prev, { sender: 'user', text: prompt }])
    setTimeout(() => {
      setChatMessages((prev) => [...prev, { sender: 'ai', text: getMentorResponse(prompt) }])
    }, 500)
  }

  const [mentorDriveSearch, setMentorDriveSearch] = useState('')
  const filteredMentorDrives = companyDrives.filter((c) =>
    c.company.toLowerCase().includes(mentorDriveSearch.trim().toLowerCase())
  )

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto text-white pb-12">

      {/* ----------------------------------------------------
          TOP BANNER HEADER CARD
      ---------------------------------------------------- */}
      <div className="relative overflow-hidden w-full bg-[#0B0B0D] border border-white/[0.08] rounded-[24px] p-6 lg:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.45)] min-h-[160px] flex items-center">
        <img
          src="/kiit-campus-dotted.jpg"
          alt="KIIT Campus Wireframe Background"
          className="absolute inset-0 w-full h-full object-cover object-[75%_center] opacity-90 pointer-events-none z-0 rounded-[24px]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0D] via-[#0B0B0D]/75 to-transparent pointer-events-none z-10 rounded-[24px]" />

        <div className="relative z-20 space-y-1.5 max-w-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF4D4D] font-mono block drop-shadow">
            CAREER WORKSPACE
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-white tracking-tight leading-none drop-shadow-md">
            Resume Builder & Placement Toolkit
          </h1>
          <p className="text-xs text-[#A0A0A0] font-normal mt-2 leading-relaxed drop-shadow">
            Build ATS-optimized resumes, check your match score, plan placements, and prep with your AI mentor — all in one place.
          </p>
        </div>
      </div>

      {/* ----------------------------------------------------
          UNIFIED LIQUID GLASS TOOLBAR & NAVIGATION
      ---------------------------------------------------- */}
      <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-[24px] p-2 lg:px-4 lg:py-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.45)] flex items-center">
        <div
          onMouseLeave={() => setHoveredTab(null)}
          className="flex items-center gap-1.5 overflow-x-auto scrollbar-none"
        >
          {[
            { id: 'resume', name: 'Resume Builder', icon: FileCheck },
            { id: 'ats', name: 'ATS Checker', icon: Sparkles },
            { id: 'placement', name: 'Placement Planner', icon: Target },
            { id: 'blueprint', name: 'AI Blueprint', icon: Award },
            { id: 'mentor', name: 'AI Mentor', icon: Bot },
          ].map((nav) => {
            const NavIcon = nav.icon
            const isActive = activeTab === nav.id
            const isHovered = hoveredTab === nav.id
            return (
              <button
                key={nav.id}
                onClick={() => setActiveTab(nav.id as CareerTab)}
                onMouseEnter={() => setHoveredTab(nav.id)}
                className={`relative px-4 py-2 rounded-xl text-xs font-semibold transition-colors duration-200 flex flex-col items-center justify-center whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive ? 'text-white font-bold' : 'text-[#8A8A8A] hover:text-white'
                }`}
              >
                {isHovered && !isActive && (
                  <motion.div
                    layoutId="hoverCareerTabPill"
                    className="absolute inset-0 bg-white/[0.06] backdrop-blur-md rounded-xl z-0 pointer-events-none"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                {isActive && (
                  <motion.div
                    layoutId="activeCareerTabPill"
                    className="absolute inset-0 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-[0_4px_20px_rgba(255,77,77,0.15)] z-0 pointer-events-none"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <div className="relative z-10 flex items-center gap-2">
                  <NavIcon
                    size={15}
                    className={isActive ? 'text-[#FF4D4D]' : isHovered ? 'text-white' : 'text-[#8A8A8A]'}
                  />
                  <span>{nav.name}</span>
                </div>
                {isActive && (
                  <motion.span
                    layoutId="activeCareerTabRedDash"
                    className="relative z-10 w-3.5 h-[2.5px] bg-[#FF4D4D] rounded-full mt-1 shadow-[0_0_8px_#FF4D4D] block"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ----------------------------------------------------
          TAB 1: RESUME BUILDER
      ---------------------------------------------------- */}
      {activeTab === 'resume' && (
        <div className="space-y-6">

          {/* SECTIONS + LIVE PREVIEW */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* LEFT: SECTIONS · DRAG TO REORDER */}
            <div className="lg:col-span-5 bg-[#111214] border border-white/[0.04] rounded-[20px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.18)] space-y-4">
              <span className="text-[11px] font-mono text-[#71717A] uppercase tracking-wider">
                Sections · Drag to reorder
              </span>

              <div className="space-y-2">
                {resumeSections.map((sec, index) => (
                  <div
                    key={sec.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    onClick={() => setActiveSection(sec.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-[12px] border cursor-grab active:cursor-grabbing transition-all ${
                      activeSection === sec.id
                        ? 'bg-amber-500/[0.08] border-amber-500/25 text-white'
                        : 'bg-[#0B0B0D] border-white/[0.06] text-[#D4D4D8] hover:border-white/15'
                    } ${dragIndex === index ? 'opacity-50' : ''}`}
                  >
                    <GripVertical size={15} className="text-[#6B7280] shrink-0" />
                    <span className="text-sm font-medium">{sec.label}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => alert('Generating resume content from your profile, skills, projects & target role...')}
                className="w-full bg-amber-400 hover:bg-amber-300 text-[#1A1206] text-sm font-bold rounded-[14px] h-[46px] transition-all cursor-pointer"
              >
                Generate with AI
              </button>

              <p className="text-[10px] text-[#6B7280] font-mono uppercase tracking-wider text-center">
                Uses profile · skills · projects · target role
              </p>
            </div>

            {/* RIGHT: LIVE PREVIEW */}
            <div className="lg:col-span-7 bg-[#111214] border border-white/[0.04] rounded-[20px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.18)] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#71717A] uppercase tracking-wider">
                  Live Preview
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsFullscreen(true)}
                    className="flex items-center gap-1.5 bg-[#1C1D21] hover:bg-white/10 border border-white/10 text-white text-xs font-bold px-3.5 py-2 rounded-[10px] transition-all cursor-pointer"
                  >
                    <Maximize2 size={12} /> Full Screen
                  </button>
                  <button
                    onClick={handleExportPdf}
                    className="bg-[#1C1D21] hover:bg-white/10 border border-white/10 text-white text-xs font-bold px-4 py-2 rounded-[10px] transition-all cursor-pointer"
                  >
                    Export PDF
                  </button>
                </div>
              </div>

              {/* Resume Sheet Preview */}
              <div className="bg-white text-black p-6 rounded-[14px] shadow-xl space-y-4 min-h-[360px]">
                {renderCompactPreview()}
              </div>
            </div>
          </div>

          {/* ATS-FRIENDLY TEMPLATES */}
          <div className="bg-[#111214] border border-white/[0.04] rounded-[20px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.18)] space-y-4">
            <span className="text-[11px] font-mono text-[#71717A] uppercase tracking-wider">
              ATS-Friendly Templates
            </span>
            <div className="flex flex-wrap gap-2">
              {templateCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleSelectTemplate(cat)}
                  className={`px-4 py-2 rounded-[10px] text-xs font-semibold transition-all cursor-pointer ${
                    selectedTemplateCategory === cat
                      ? 'bg-amber-400 text-[#1A1206]'
                      : 'bg-[#0B0B0D] border border-white/10 text-[#9CA3AF] hover:text-white hover:border-white/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {templateSectionOrders[selectedTemplateCategory] && (
              <p className="text-[11px] text-[#6B7280] leading-relaxed">
                <span className="text-amber-400 font-semibold">
                  {templateSectionOrders[selectedTemplateCategory].order
                    .filter((id) => id !== 'header')
                    .map((id) => initialResumeSections.find((s) => s.id === id)?.label)
                    .join(' → ')}
                </span>
                {' — '}
                {templateSectionOrders[selectedTemplateCategory].rationale}
              </p>
            )}
          </div>

          {/* COMPANY-WISE OPTIMISATION */}
          <div className="bg-[#111214] border border-white/[0.04] rounded-[20px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.18)] space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider block">
                  Company-wise optimisation
                </span>
                <h2 className="text-xl font-serif text-white mt-1">One resume per company and role</h2>
              </div>
              <span className="text-[10px] text-[#6B7280] font-mono uppercase tracking-wider">
                Drop each company&rsquo;s logo onto its tile
              </span>
            </div>

            {/* Company / Role / Level filter */}
            <div className="flex flex-wrap gap-3">
              <select
                value={resumeFilterCompanyId}
                onChange={(e) => setResumeFilterCompanyId(e.target.value)}
                className="bg-[#0B0B0D] border border-white/10 text-xs text-white px-3.5 py-2.5 rounded-[10px] outline-none font-semibold cursor-pointer focus:border-amber-400/50 transition-colors"
              >
                <option value="all" className="bg-[#111214] text-white">All Companies</option>
                {atsCompanyOptions.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#111214] text-white">
                    {c.company}
                  </option>
                ))}
              </select>

              <select
                value={resumeFilterRoleId}
                onChange={(e) => setResumeFilterRoleId(e.target.value)}
                className="bg-[#0B0B0D] border border-white/10 text-xs text-white px-3.5 py-2.5 rounded-[10px] outline-none font-semibold cursor-pointer focus:border-amber-400/50 transition-colors"
              >
                <option value="all" className="bg-[#111214] text-white">All Roles</option>
                {atsRoleTemplates.map((r) => (
                  <option key={r.id} value={r.id} className="bg-[#111214] text-white">
                    {r.role}
                  </option>
                ))}
              </select>

              <select
                value={resumeFilterLevel}
                onChange={(e) => setResumeFilterLevel(e.target.value)}
                className="bg-[#0B0B0D] border border-white/10 text-xs text-white px-3.5 py-2.5 rounded-[10px] outline-none font-semibold cursor-pointer focus:border-amber-400/50 transition-colors"
              >
                <option value="all" className="bg-[#111214] text-white">All Levels</option>
                {atsExperienceLevels.map((lvl) => (
                  <option key={lvl} value={lvl} className="bg-[#111214] text-white">
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredCompanyCards.length === 0 && !resumeFilterPreviewCard && (
                <div className="sm:col-span-2 lg:col-span-3 flex items-center justify-center text-xs text-[#6B7280] py-8">
                  Pick a company and role above to preview a tailored resume.
                </div>
              )}

              {resumeFilterPreviewCard && (
                <div className="bg-amber-500/[0.04] border border-dashed border-amber-500/30 rounded-[16px] p-4 space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-12 h-12 rounded-[10px] bg-gradient-to-br ${getLogoPalette(resumeFilterPreviewCard.company)} flex items-center justify-center text-white text-xs font-black shrink-0`}
                      >
                        {getInitials(resumeFilterPreviewCard.company)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-white truncate">{resumeFilterPreviewCard.company}</h4>
                          <span className="text-[8px] font-bold uppercase tracking-wider text-amber-400 border border-amber-500/30 rounded-full px-1.5 py-0.5 shrink-0">
                            Preview
                          </span>
                        </div>
                        <p className="text-[10px] text-[#8A8A8A] uppercase font-mono truncate">
                          {resumeFilterPreviewCard.role} · {resumeFilterPreviewCard.level}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-[#9CA3AF] leading-relaxed">{resumeFilterPreviewCard.suggestion}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                    <span className="text-[11px] font-mono font-bold text-amber-400">
                      ATS {resumeFilterPreviewCard.atsBefore} → {resumeFilterPreviewCard.atsAfter}
                    </span>
                    <button
                      onClick={handleTailorPreviewCard}
                      className="bg-amber-400 text-[#1A1206] hover:bg-amber-300 text-xs font-bold px-3 py-1.5 rounded-[8px] transition-all cursor-pointer"
                    >
                      Tailor & Save
                    </button>
                  </div>
                </div>
              )}

              {filteredCompanyCards.map((card, idx) => (
                <div
                  key={card.id}
                  className="bg-[#0B0B0D] border border-white/[0.06] rounded-[16px] p-4 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <label
                        htmlFor={`logo-${card.id}`}
                        onDrop={(e) => {
                          e.preventDefault()
                          handleLogoFile(card.id, e.dataTransfer.files[0])
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        className="relative group/logo w-12 h-12 rounded-[10px] border border-white/10 flex items-center justify-center shrink-0 cursor-pointer overflow-hidden hover:border-white/30 transition-colors"
                      >
                        {card.logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={card.logoUrl} alt={`${card.company} logo`} className="w-full h-full object-cover" />
                        ) : (
                          <div
                            className={`w-full h-full bg-gradient-to-br ${getLogoPalette(card.company)} flex items-center justify-center text-white text-xs font-black`}
                          >
                            {getInitials(card.company)}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/logo:opacity-100 flex items-center justify-center transition-opacity">
                          <Upload size={12} className="text-white" />
                        </div>
                        <input
                          id={`logo-${card.id}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleLogoFile(card.id, e.target.files?.[0])}
                        />
                      </label>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">{card.company}</h4>
                        <p className="text-[10px] text-[#8A8A8A] uppercase font-mono truncate">
                          {card.role} · {card.level}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-[#9CA3AF] leading-relaxed">{card.suggestion}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                    {card.tailored ? (
                      <span className="text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Tailored — ATS {card.atsAfter}
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono font-bold text-amber-400">
                        ATS {card.atsBefore} → {card.atsAfter}
                      </span>
                    )}
                    <button
                      onClick={() => handleTailorCard(card)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-[8px] transition-all cursor-pointer ${
                        card.tailored
                          ? 'bg-[#1C1D21] text-[#9CA3AF] border border-white/10 hover:text-white hover:border-white/20'
                          : idx === 0
                          ? 'bg-amber-400 text-[#1A1206] hover:bg-amber-300'
                          : 'bg-[#1C1D21] text-white border border-white/10 hover:border-white/20'
                      }`}
                    >
                      {card.tailored ? 'View Resume' : 'Tailor'}
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Company Tile */}
              <div className="bg-[#0B0B0D] border border-dashed border-white/10 rounded-[16px] p-4 flex flex-col items-center justify-center text-center gap-2 min-h-[168px]">
                {!showAddCompany ? (
                  <button
                    onClick={() => setShowAddCompany(true)}
                    className="flex flex-col items-center gap-2 text-[#6B7280] hover:text-white transition-colors cursor-pointer"
                  >
                    <span className="text-2xl font-light leading-none">+</span>
                    <span className="text-xs font-bold">Add company</span>
                    <span className="text-[9px] font-mono uppercase tracking-wider">Name + Role + JD</span>
                  </button>
                ) : (
                  <div className="w-full space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#71717A] uppercase">New Company</span>
                      <button onClick={() => setShowAddCompany(false)} className="text-[#6B7280] hover:text-white cursor-pointer">
                        <X size={14} />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={newCompanyName}
                      onChange={(e) => setNewCompanyName(e.target.value)}
                      placeholder="Company name"
                      className="w-full bg-[#111214] border border-white/10 text-xs text-white p-2 rounded-[8px] outline-none focus:border-amber-400/50"
                    />
                    <input
                      type="text"
                      value={newCompanyRole}
                      onChange={(e) => setNewCompanyRole(e.target.value)}
                      placeholder="Role"
                      className="w-full bg-[#111214] border border-white/10 text-xs text-white p-2 rounded-[8px] outline-none focus:border-amber-400/50"
                    />
                    <textarea
                      rows={2}
                      value={newCompanyJd}
                      onChange={(e) => setNewCompanyJd(e.target.value)}
                      placeholder="Paste job description (optional)"
                      className="w-full bg-[#111214] border border-white/10 text-xs text-white p-2 rounded-[8px] outline-none focus:border-amber-400/50 resize-none"
                    />
                    <button
                      onClick={handleAddCompany}
                      className="w-full bg-amber-400 hover:bg-amber-300 text-[#1A1206] text-xs font-bold py-2 rounded-[8px] transition-all cursor-pointer"
                    >
                      Add & Tailor
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ----------------------------------------------------
          FULLSCREEN RESUME EDITOR OVERLAY
      ---------------------------------------------------- */}
      {isFullscreen && mounted && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2.5">
              <FileCheck size={16} className="text-amber-400" />
              <span className="text-sm font-bold text-white">Resume Editor</span>
              <span className="text-[10px] text-[#6B7280] font-mono ml-1 hidden sm:inline">
                Click any line to edit directly
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportPdf}
                className="bg-[#1C1D21] hover:bg-white/10 border border-white/10 text-white text-xs font-bold px-4 py-2 rounded-[10px] transition-all cursor-pointer"
              >
                Export PDF
              </button>
              <button
                onClick={() => setIsFullscreen(false)}
                className="w-9 h-9 rounded-[10px] bg-[#1C1D21] hover:bg-white/10 border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* LEFT: OPTIMIZE WITH AI */}
            <div className="w-[300px] shrink-0 border-r border-white/10 p-5 space-y-4 overflow-y-auto hidden md:block">
              <div className="flex items-center gap-2">
                <Wand2 size={14} className="text-amber-400" />
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Optimize with AI</span>
              </div>
              <div className="space-y-3">
                {aiResumeSuggestions.map((s) => (
                  <div key={s.id} className="bg-[#111214] border border-white/10 rounded-[12px] p-3.5 space-y-2">
                    <p className="text-xs text-[#D4D4D8] leading-relaxed">{s.text}</p>
                    <button
                      onClick={() => handleApplySuggestion(s.id)}
                      className="text-[10px] font-bold text-amber-400 hover:text-amber-300 cursor-pointer"
                    >
                      Apply suggestion →
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* MAIN: EDITABLE RESUME */}
            <div className="flex-1 overflow-y-auto p-8 flex justify-center">
              <div className="bg-white text-black p-10 rounded-[14px] shadow-2xl w-full max-w-[720px] h-fit space-y-5">
                {renderEditablePreview()}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ----------------------------------------------------
          TAB 2: ATS CHECKER
      ---------------------------------------------------- */}
      {activeTab === 'ats' && (
        <div className="space-y-5">

          {/* Header */}
          <div>
            <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider block">
              ATS Checker
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-white mt-1">
              Scored against one company, one role
            </h2>
          </div>

          {/* Company / Role fields + Optimize button */}
          <div className="flex flex-wrap items-stretch gap-3">
            <div className="bg-[#111214] border border-white/10 rounded-2xl px-4 py-2.5 min-w-[180px]">
              <span className="text-[10px] font-mono text-[#6B7280] uppercase tracking-wider block">Company</span>
              <select
                value={selectedAtsCompanyId}
                onChange={(e) => handleSelectAtsCompany(e.target.value)}
                className="appearance-none bg-transparent text-white text-[15px] font-bold outline-none cursor-pointer w-full mt-0.5"
              >
                {atsCompanyOptions.map((opt) => (
                  <option key={opt.id} value={opt.id} className="bg-[#111214] text-white">
                    {opt.company}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-[#111214] border border-white/10 rounded-2xl px-4 py-2.5 min-w-[160px]">
              <span className="text-[10px] font-mono text-[#6B7280] uppercase tracking-wider block">Role</span>
              <select
                value={selectedAtsRoleId}
                onChange={(e) => handleSelectAtsRole(e.target.value)}
                className="appearance-none bg-transparent text-white text-[15px] font-bold outline-none cursor-pointer w-full mt-0.5"
              >
                {atsRoleTemplates.map((r) => (
                  <option key={r.id} value={r.id} className="bg-[#111214] text-white">
                    {r.role}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-[#111214] border border-white/10 rounded-2xl px-4 py-2.5 min-w-[150px]">
              <span className="text-[10px] font-mono text-[#6B7280] uppercase tracking-wider block">Experience</span>
              <select
                value={selectedAtsExperience}
                onChange={(e) => setSelectedAtsExperience(e.target.value)}
                className="appearance-none bg-transparent text-white text-[15px] font-bold outline-none cursor-pointer w-full mt-0.5"
              >
                {atsExperienceLevels.map((lvl) => (
                  <option key={lvl} value={lvl} className="bg-[#111214] text-white">
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleOptimizeFromAts}
              className="flex items-center justify-center bg-amber-400 hover:bg-amber-300 text-[#1A1206] text-sm font-bold px-6 rounded-2xl shadow-[0_4px_16px_rgba(251,191,36,0.25)] transition-all cursor-pointer"
            >
              Optimize resume
            </button>
          </div>

          {/* Resume + JD inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onDrop={(e) => {
                e.preventDefault()
                handleResumeFile(e.dataTransfer.files[0])
              }}
              onDragOver={(e) => e.preventDefault()}
              className="bg-[#111214] border border-white/[0.06] rounded-2xl p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono text-[#71717A] uppercase block">
                  Resume Content
                </label>
                <label
                  htmlFor="resume-upload"
                  className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 hover:border-amber-500/50 text-amber-300 hover:text-amber-200 text-[10px] font-bold px-2.5 py-1.5 rounded-[8px] cursor-pointer transition-all"
                >
                  <Upload size={11} className="text-amber-400" />
                  {isParsingResume ? 'Parsing…' : 'Upload Resume'}
                  <input
                    id="resume-upload"
                    type="file"
                    accept=".txt,.pdf,text/plain,application/pdf"
                    className="hidden"
                    onChange={(e) => handleResumeFile(e.target.files?.[0])}
                  />
                </label>
              </div>
              {resumeFileName && (
                <p className="text-[10px] text-[#6B7280] font-mono">
                  Loaded from: {resumeFileName} · drop a new file to replace
                </p>
              )}
              <textarea
                rows={5}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="w-full bg-[#0B0B0D] border border-white/10 text-xs text-white p-3 rounded-[12px] outline-none font-mono focus:border-amber-400/50 transition-colors"
              />
            </div>

            <div className="bg-[#111214] border border-white/[0.06] rounded-2xl p-4 space-y-2">
              <label className="text-[11px] font-mono text-[#71717A] uppercase block">
                Target Job Description
              </label>
              <textarea
                rows={5}
                value={targetJd}
                onChange={(e) => setTargetJd(e.target.value)}
                className="w-full bg-[#0B0B0D] border border-white/10 text-xs text-white p-3 rounded-[12px] outline-none font-mono focus:border-amber-400/50 transition-colors"
              />
            </div>
          </div>

          {/* Score card + metric bars */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-1 bg-gradient-to-br from-[#1a1006] to-[#111214] border border-amber-500/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              <span className="text-6xl font-serif font-bold text-white leading-none">
                {currentAtsBreakdown.overall}
              </span>
              <span className="text-[10px] font-mono text-[#8A8A8A] uppercase tracking-wider mt-3">
                ATS Score
              </span>
            </div>

            <div className="lg:col-span-3 bg-[#111214] border border-white/[0.06] rounded-2xl p-5 space-y-4">
              {[
                { label: 'Parseability', value: getAtsParseability(currentAtsBreakdown.formatting) },
                { label: 'Keyword match', value: currentAtsBreakdown.keywordMatch },
                { label: 'Evidence quality', value: currentAtsBreakdown.evidenceQuality },
                { label: 'Formatting', value: currentAtsBreakdown.formatting },
                { label: 'Skill coverage', value: currentAtsBreakdown.skillCoverage },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-4">
                  <span className="text-sm text-white w-36 shrink-0">{row.label}</span>
                  <div className="flex-1 bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getAtsBarColor(row.value)}`}
                      style={{ width: `${row.value}%` }}
                    />
                  </div>
                  <span className="text-sm text-[#8A8A8A] font-mono w-8 text-right shrink-0">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Missing Keywords / Formatting Issues / Highest-value Fix */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-[#111214] border border-white/[0.06] rounded-2xl p-5 space-y-3">
              <span className="text-[11px] font-mono text-[#71717A] uppercase tracking-wider block">
                Missing Keywords
              </span>
              <div className="flex flex-wrap gap-2">
                {currentAtsRole.missingKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-medium"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-[#111214] border border-white/[0.06] rounded-2xl p-5 space-y-3">
              <span className="text-[11px] font-mono text-[#71717A] uppercase tracking-wider block">
                Formatting Issues
              </span>
              <ul className="space-y-1.5">
                {atsFormattingIssues.map((issue) => (
                  <li key={issue} className="text-sm text-[#D4D4D8]">{issue}</li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#1a1006] to-[#111214] border border-amber-500/25 rounded-2xl p-5 space-y-2">
              <span className="text-sm font-bold text-white block">Highest-value fix</span>
              <p className="text-sm text-[#D4D4D8] leading-relaxed">{atsHighestValueFix}</p>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 3: PLACEMENT PLANNER
      ---------------------------------------------------- */}
      {activeTab === 'placement' && (
        <div className="bg-[#111214] border border-white/[0.04] rounded-[20px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.18)] space-y-5 hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-[18px] font-semibold text-white tracking-tight">
                Upcoming KIIT Placement Drives (2026 Batch)
              </h2>
              <p className="text-xs text-[#8A8A8A] mt-0.5">
                Official drives scheduled via Training & Placement Cell — click a company for its prep plan
              </p>
            </div>
            <span className="text-xs text-[#8A8A8A] font-mono bg-[#0B0B0D] px-3 py-1 rounded-full border border-white/[0.06]">
              {filteredCompanyDrives.length} / {companyDrives.length} Companies
            </span>
          </div>

          {/* Company / Role / Level filter */}
          <div className="flex flex-wrap gap-3">
            <select
              value={placementFilterCompanyId}
              onChange={(e) => setPlacementFilterCompanyId(e.target.value)}
              className="bg-[#0B0B0D] border border-white/10 text-xs text-white px-3.5 py-2.5 rounded-[10px] outline-none font-semibold cursor-pointer focus:border-[#FF4D4D] transition-colors"
            >
              <option value="all" className="bg-[#111214] text-white">All Companies</option>
              {companyDrives.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#111214] text-white">
                  {c.company}
                </option>
              ))}
            </select>

            <select
              value={placementFilterRoleId}
              onChange={(e) => setPlacementFilterRoleId(e.target.value)}
              className="bg-[#0B0B0D] border border-white/10 text-xs text-white px-3.5 py-2.5 rounded-[10px] outline-none font-semibold cursor-pointer focus:border-[#FF4D4D] transition-colors"
            >
              <option value="all" className="bg-[#111214] text-white">All Roles</option>
              {atsRoleTemplates.map((r) => (
                <option key={r.id} value={r.id} className="bg-[#111214] text-white">
                  {r.role}
                </option>
              ))}
            </select>

            <select
              value={placementFilterLevel}
              onChange={(e) => setPlacementFilterLevel(e.target.value)}
              className="bg-[#0B0B0D] border border-white/10 text-xs text-white px-3.5 py-2.5 rounded-[10px] outline-none font-semibold cursor-pointer focus:border-[#FF4D4D] transition-colors"
            >
              <option value="all" className="bg-[#111214] text-white">All Levels</option>
              {atsExperienceLevels.map((lvl) => (
                <option key={lvl} value={lvl} className="bg-[#111214] text-white">
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0B0B0D] text-[#71717A] font-mono uppercase text-[11px] border-b border-white/[0.06]">
                  <th className="p-4 rounded-l-[12px]">Company & Tier</th>
                  <th className="p-4">Package (CTC)</th>
                  <th className="p-4">Eligibility Criteria</th>
                  <th className="p-4">Deadline</th>
                  <th className="p-4">Recruitment Stages</th>
                  <th className="p-4 text-right rounded-r-[12px]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredCompanyDrives.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-[#6B7280] text-xs">
                      No companies match this filter combination.
                    </td>
                  </tr>
                )}
                {filteredCompanyDrives.map((c) => {
                  const plan = drivePrepPlans[c.id]
                  const isExpanded = expandedDriveId === c.id
                  return (
                    <Fragment key={c.id}>
                      <tr
                        onClick={() => handleToggleDrive(c.id)}
                        className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <ChevronDown
                              size={14}
                              className={`text-[#6B7280] shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                            />
                            <div>
                              <p className="font-bold text-white text-sm tracking-tight">{c.company}</p>
                              <p className="text-[10px] text-[#8A8A8A] uppercase font-mono mt-0.5">{c.tier}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-bold text-[#FF4D4D] font-mono text-sm">{c.ctc}</td>
                        <td className="p-4 text-[#8A8A8A]">{c.eligibility}</td>
                        <td className="p-4 text-[#8A8A8A] font-mono">{c.deadline}</td>
                        <td className="p-4 text-[#8A8A8A]">{c.stages}</td>
                        <td className="p-4 text-right">
                          <span className="px-3 py-1 rounded-full bg-[#FF4D4D]/10 text-[#FF4D4D] border border-[#FF4D4D]/20 text-[10px] font-bold uppercase tracking-wider inline-block">
                            {c.status}
                          </span>
                        </td>
                      </tr>
                      {isExpanded && !plan && (
                        <tr className="bg-[#0B0B0D]">
                          <td colSpan={6} className="p-5">
                            <div className="flex items-center justify-between flex-wrap gap-3">
                              <p className="text-xs text-[#9CA3AF] leading-relaxed max-w-2xl">
                                A detailed round-by-round prep plan isn&rsquo;t published for {c.company} yet — check
                                the ATS Checker tab for its {atsRoleTemplates.find((r) => r.id === c.roleId)?.role ?? c.role} requirements
                                and missing keywords in the meantime.
                              </p>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setActiveTab('ats')
                                }}
                                className="flex items-center gap-1.5 bg-[#1C1D21] hover:bg-white/10 border border-white/10 text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-[10px] transition-all cursor-pointer shrink-0"
                              >
                                <Sparkles size={12} /> Open ATS Checker
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                      {isExpanded && plan && (
                        <tr className="bg-[#0B0B0D]">
                          <td colSpan={6} className="p-5">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between flex-wrap gap-3">
                                <div className="flex items-center gap-2">
                                  <Target size={14} className="text-[#FF4D4D]" />
                                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                                    Preparation Plan — {c.company}
                                  </span>
                                </div>
                                <Link
                                  href={`/workspace/career/mock-interview?company=${c.id}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex items-center gap-1.5 bg-[#FF4D4D] hover:brightness-110 text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-[10px] transition-all"
                                >
                                  <Zap size={12} /> Start Mock Interview
                                </Link>
                              </div>
                              <p className="text-xs text-[#9CA3AF] leading-relaxed max-w-3xl">{plan.approach}</p>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-[#111214] border border-white/[0.05] rounded-[14px] p-4 space-y-2">
                                  <span className="text-[11px] font-mono text-[#FF4D4D] uppercase font-bold block">
                                    Most-Asked Exam Topics
                                  </span>
                                  <ul className="space-y-1 text-white font-mono text-[11px]">
                                    {plan.examTopics.map((t, i) => (
                                      <li key={i}>• {t}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="bg-[#111214] border border-white/[0.05] rounded-[14px] p-4 space-y-2">
                                  <span className="text-[11px] font-mono text-[#FF4D4D] uppercase font-bold block">
                                    Most-Asked Interview Questions
                                  </span>
                                  <ul className="space-y-1.5">
                                    {plan.interviewQuestions.map((iq, i) => (
                                      <li key={i} className="flex items-start justify-between gap-2 text-[11px]">
                                        <span className="text-white font-mono">• {iq.question}</span>
                                        <span className={`shrink-0 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${frequencyBadgeClass(iq.frequency)}`}>
                                          {iq.frequency}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>

                              <div>
                                <span className="text-[11px] font-mono text-[#71717A] uppercase block mb-2">
                                  Practice Every Question — By Pattern
                                </span>
                                <div className="space-y-2">
                                  {plan.interviewQuestions.map((iq, i) => (
                                    <div
                                      key={i}
                                      className="bg-[#111214] border border-white/[0.05] rounded-[12px] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                                    >
                                      <div className="min-w-0">
                                        <p className="text-xs text-white font-semibold">{iq.question}</p>
                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                          <span className="text-[9px] font-mono text-[#8A8A8A] uppercase tracking-wider">
                                            {iq.pattern}
                                          </span>
                                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${frequencyBadgeClass(iq.frequency)}`}>
                                            {iq.frequency} repeat
                                          </span>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-1.5 shrink-0">
                                        {buildQuestionPlatformLinks(iq.question).map((p) => (
                                          <a
                                            key={p.name}
                                            href={p.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            title={`Look up "${iq.question}" on ${p.name}`}
                                            className="w-7 h-7 rounded-lg bg-[#0B0B0D] border border-white/10 hover:border-[#FF4D4D]/50 flex items-center justify-center transition-all"
                                          >
                                            <Code2 size={11} className="text-[#FF4D4D]" />
                                          </a>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <span className="text-[11px] font-mono text-[#71717A] uppercase block mb-2">
                                  Practice On (Company-wide)
                                </span>
                                <div className="flex flex-wrap gap-2">
                                  {plan.platforms.map((p) => (
                                    <a
                                      key={p.name}
                                      href={p.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="flex items-center gap-1.5 bg-[#111214] border border-white/10 hover:border-[#FF4D4D]/50 text-white text-xs font-semibold px-3 py-1.5 rounded-[8px] transition-all"
                                    >
                                      <Code2 size={12} className="text-[#FF4D4D]" /> {p.name}
                                      <ExternalLink size={10} className="text-[#6B7280]" />
                                    </a>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 4: AI PLACEMENT BLUEPRINT
      ---------------------------------------------------- */}
      {activeTab === 'blueprint' && (
        <div className="space-y-6">
          <div className="bg-[#111214] border border-white/[0.04] rounded-[20px] p-5 space-y-3">
            <span className="text-[11px] font-mono text-[#71717A] uppercase tracking-wider">
              Select a target company
            </span>
            <div className="flex flex-wrap gap-2">
              {companyDrives
                .filter((c) => blueprintData[c.id])
                .map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedBlueprintId(c.id)}
                    className={`px-4 py-2 rounded-[10px] text-xs font-semibold transition-all cursor-pointer ${
                      selectedBlueprintId === c.id
                        ? 'bg-[#FF4D4D] text-white'
                        : 'bg-[#0B0B0D] border border-white/10 text-[#9CA3AF] hover:text-white hover:border-white/20'
                    }`}
                  >
                    {c.company}
                  </button>
                ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-8 bg-[#111214] border border-white/[0.04] rounded-[20px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.18)] flex flex-col justify-between space-y-5 hover:-translate-y-0.5 transition-all duration-200">
              <div>
                <div className="flex items-center justify-between border-b border-white/[0.04] pb-4 flex-wrap gap-3">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FF4D4D]/10 text-[#FF4D4D] border border-[#FF4D4D]/20 text-[10px] uppercase font-bold tracking-wider inline-flex items-center gap-1.5">
                      <Database size={11} /> Based on 3 years of KIIT T&amp;P Cell data
                    </span>
                    <h2 className="text-[22px] font-bold text-white tracking-tight mt-1">{blueprint.title}</h2>
                  </div>
                  <Link
                    href={`/workspace/career/mock-interview?company=${selectedBlueprintId}`}
                    className="bg-[#FF4D4D] hover:brightness-110 text-white text-xs font-bold uppercase tracking-wider rounded-[14px] h-[40px] px-5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Zap size={14} /> Launch Mock Interview
                  </Link>
                </div>

                {/* Historical Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-xs">
                  <div className="bg-[#0B0B0D] border border-white/[0.05] p-3 rounded-[14px]">
                    <span className="text-[10px] text-[#6B7280] uppercase font-bold block">Selected Last Year</span>
                    <p className="text-lg font-bold text-white mt-0.5">{blueprint.historicalSelected} students</p>
                  </div>
                  <div className="bg-[#0B0B0D] border border-white/[0.05] p-3 rounded-[14px]">
                    <span className="text-[10px] text-[#6B7280] uppercase font-bold block">Avg CTC of Selects</span>
                    <p className="text-lg font-bold text-white mt-0.5">{blueprint.avgCtc}</p>
                  </div>
                  <div className="bg-[#0B0B0D] border border-white/[0.05] p-3 rounded-[14px]">
                    <span className="text-[10px] text-[#6B7280] uppercase font-bold block">Typical Reject Point</span>
                    <p className="text-lg font-bold text-[#FF4D4D] mt-0.5">{blueprint.typicalRejectRound}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 text-xs">
                  <div className="bg-[#0B0B0D] border border-white/[0.05] p-4 rounded-[16px] space-y-2">
                    <span className="text-[11px] font-mono text-[#FF4D4D] uppercase font-bold block">
                      Top Asked Technical Topics
                    </span>
                    <ul className="space-y-1.5 text-white font-mono text-[11px]">
                      {blueprint.topics.map((t, i) => (
                        <li key={i}>• {t}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[#0B0B0D] border border-white/[0.05] p-4 rounded-[16px] space-y-2">
                    <span className="text-[11px] font-mono text-[#FF4D4D] uppercase font-bold block">
                      Preparation Timeline
                    </span>
                    <div className="space-y-1 text-white font-mono text-[11px]">
                      {blueprint.timeline.map((t) => (
                        <p key={t.label}>
                          • {t.label}: {t.detail}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs">
                  <div className="bg-emerald-500/[0.04] border border-emerald-500/20 rounded-[16px] p-4 space-y-2">
                    <span className="text-emerald-400 font-mono uppercase font-bold text-[11px] block">Do</span>
                    <ul className="space-y-1 text-white font-mono text-[11px]">
                      {blueprint.dos.map((d, i) => (
                        <li key={i}>• {d}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-red-500/[0.04] border border-red-500/20 rounded-[16px] p-4 space-y-2">
                    <span className="text-red-400 font-mono uppercase font-bold text-[11px] block">Don&rsquo;t</span>
                    <ul className="space-y-1 text-white font-mono text-[11px]">
                      {blueprint.donts.map((d, i) => (
                        <li key={i}>• {d}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-4 bg-[#111214] border border-white/[0.04] rounded-[20px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.18)] flex flex-col space-y-5 hover:-translate-y-0.5 transition-all duration-200">
              <div className="space-y-4">
                <span className="text-[11px] font-mono text-[#71717A] uppercase block">
                  Recommended Resources
                </span>
                <div className="bg-[#0B0B0D] border border-white/[0.04] rounded-[12px] p-3 space-y-2 text-white font-mono text-[11px]">
                  {blueprint.resources.map((r, i) => (
                    <p key={i} className="text-white">• {r}</p>
                  ))}
                </div>
              </div>

              {plan && (
                <div className="space-y-3">
                  <span className="text-[11px] font-mono text-[#71717A] uppercase block">
                    Practice Platforms
                  </span>
                  <div className="space-y-2">
                    {plan.platforms.map((p) => (
                      <a
                        key={p.name}
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-2 bg-[#0B0B0D] border border-white/10 hover:border-[#FF4D4D]/50 text-white text-xs font-semibold px-3 py-2.5 rounded-[10px] transition-all"
                      >
                        <span className="flex items-center gap-1.5">
                          <Code2 size={13} className="text-[#FF4D4D]" /> {p.name}
                        </span>
                        <ExternalLink size={11} className="text-[#6B7280]" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex-1 min-h-0" />

              <div className="bg-white/[0.03] border border-white/[0.06] rounded-[14px] p-4 space-y-1.5">
                <span className="text-[11px] font-mono text-[#71717A] uppercase block">
                  Ready to rehearse?
                </span>
                <p className="text-xs text-[#9CA3AF] leading-relaxed">
                  Run through {blueprint.title.replace(' Sprint Roadmap', '').replace(' Roadmap', '')}&rsquo;s rounds live before the real thing.
                </p>
                <Link
                  href={`/workspace/career/mock-interview?company=${selectedBlueprintId}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF4D4D] hover:text-white transition-colors mt-1"
                >
                  <Zap size={12} /> Launch Mock Interview
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 5: AI CAREER MENTOR
      ---------------------------------------------------- */}
      {activeTab === 'mentor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: CHAT */}
          <div className="lg:col-span-8 bg-[#111214] border border-white/[0.04] rounded-[20px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.18)] h-[560px] flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FF4D4D]/10 border border-[#FF4D4D]/20 flex items-center justify-center text-[#FF4D4D]">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-white tracking-tight">
                    AI Career Placement Mentor
                  </h3>
                  <p className="text-xs text-[#8A8A8A]">
                    Trained on KIIT T&P Cell historical data & previous interview questions
                  </p>
                </div>
              </div>
              <span className="text-xs text-[#8A8A8A] font-mono bg-[#0B0B0D] px-3 py-1 rounded-full border border-white/[0.06]">
                Online & Ready
              </span>
            </div>

            {/* Chat Stream */}
            <div className="space-y-3 overflow-y-auto flex-1 min-h-0 pr-2">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-md p-3.5 rounded-[14px] text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#FF4D4D] text-white font-medium'
                        : 'bg-[#0B0B0D] border border-white/[0.06] text-[#8A8A8A]'
                    }`}
                  >
                    <p className="text-white font-normal">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input Bar */}
            <div className="flex items-center bg-[#0B0B0D] border border-white/[0.06] rounded-[16px] p-1.5 focus-within:border-[#FF4D4D] transition-colors">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                placeholder="Ask for interview advice, daily study plan, or resume tips..."
                className="w-full bg-transparent px-3 py-2 text-xs text-white placeholder-[#8A8A8A] outline-none font-medium"
              />
              <button
                onClick={handleSendChat}
                className="bg-[#FF4D4D] hover:brightness-110 text-white p-2 rounded-[12px] transition-all cursor-pointer"
              >
                <Send size={15} />
              </button>
            </div>
          </div>

          {/* RIGHT: QUICK PROMPTS + ACTIVE DRIVES */}
          <div className="lg:col-span-4 h-[560px] flex flex-col gap-5">
            <div className="shrink-0 bg-[#111214] border border-white/[0.04] rounded-[20px] p-5 space-y-3">
              <span className="text-[11px] font-mono text-[#71717A] uppercase tracking-wider">
                Quick Prompts
              </span>
              <div className="space-y-2">
                {mentorQuickPrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickPrompt(p)}
                    className="w-full text-left flex items-center gap-2 bg-[#0B0B0D] border border-white/10 hover:border-[#FF4D4D]/40 text-xs text-[#D4D4D8] hover:text-white px-3 py-2.5 rounded-[10px] transition-all cursor-pointer"
                  >
                    <MessageCircle size={12} className="text-[#FF4D4D] shrink-0" /> {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 min-h-0 flex flex-col bg-[#111214] border border-white/[0.04] rounded-[20px] p-5 space-y-3">
              <div className="flex items-center justify-between shrink-0">
                <span className="text-[11px] font-mono text-[#71717A] uppercase tracking-wider">
                  Active Drives
                </span>
                <span className="text-[10px] text-[#6B7280] font-mono">
                  {filteredMentorDrives.length} / {companyDrives.length}
                </span>
              </div>

              <div className="relative shrink-0">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                <input
                  type="text"
                  value={mentorDriveSearch}
                  onChange={(e) => setMentorDriveSearch(e.target.value)}
                  placeholder="Search companies..."
                  className="w-full bg-[#0B0B0D] border border-white/10 text-xs text-white pl-8 pr-3 py-2 rounded-[10px] outline-none font-medium placeholder:text-[#6B7280] focus:border-[#FF4D4D]/50 transition-colors"
                />
              </div>

              <div className="space-y-1.5 flex-1 min-h-0 overflow-y-auto pr-1 scrollbar-none">
                {filteredMentorDrives.length === 0 && (
                  <p className="text-xs text-[#6B7280] text-center py-4">
                    No companies match &ldquo;{mentorDriveSearch}&rdquo;
                  </p>
                )}
                {filteredMentorDrives.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleQuickPrompt(`Tell me about the ${c.company} interview process`)}
                    className="w-full flex items-center justify-between gap-2 bg-[#0B0B0D] border border-white/10 hover:border-[#FF4D4D]/40 px-3 py-2 rounded-[10px] transition-all cursor-pointer"
                  >
                    <div className="min-w-0 text-left">
                      <p className="text-xs text-white font-semibold truncate">{c.company}</p>
                      <p className="text-[9px] text-[#6B7280] font-mono uppercase truncate">{c.tier}</p>
                    </div>
                    <span className="text-[10px] text-[#6B7280] font-mono shrink-0">{c.deadline}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          BOTTOM STATS ROW (Four Equal Cards)
      ---------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {[
          {
            number: '120+',
            label: 'Recruiter Drives',
            sub: 'Active for 2026 Batch',
            icon: Building2,
          },
          {
            number: '₹44.0 L',
            label: 'Highest Package',
            sub: 'Super Dream CTC Tier',
            icon: TrendingUp,
          },
          {
            number: '88%',
            label: 'Average ATS Score',
            sub: 'Across KIIT Candidates',
            icon: CheckCircle2,
          },
          {
            number: '10 Days',
            label: 'Sprint Duration',
            sub: 'HighRadius Prep Timeline',
            icon: Clock,
          },
        ].map((stat, idx) => {
          const StatIcon = stat.icon
          return (
            <div
              key={idx}
              className="bg-[#111214] border border-white/[0.04] rounded-[20px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.18)] flex flex-col justify-between h-[150px] hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold text-white tracking-tight">
                  {stat.label}
                </span>
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.05] flex items-center justify-center text-[#FF4D4D] group-hover:scale-105 transition-transform">
                  <StatIcon size={18} />
                </div>
              </div>

              <div>
                <span className="text-[38px] font-bold text-white font-mono tracking-tight leading-none block">
                  {stat.number}
                </span>
                <span className="text-xs text-[#8A8A8A] font-normal mt-1.5 block">
                  {stat.sub}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
