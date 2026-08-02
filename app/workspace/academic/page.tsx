'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  Sparkles,
  BookOpen,
  FileText,
  Upload,
  Plus,
  Bot,
  TrendingUp,
  MoreVertical,
  ChevronDown,
  FileCode,
  Calendar,
  X,
  Target,
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

// Tab types
type ModuleTab = 'predictor' | 'pyq' | 'notes' | 'resources' | 'timetable' | 'career' | 'predicted-papers'

function TabParamsHandler({ onTabChange }: { onTabChange: (tab: ModuleTab) => void }) {
  const searchParams = useSearchParams()
  const tabParam = (searchParams?.get('tab') as ModuleTab) || 'predictor'

  useEffect(() => {
    if (tabParam) {
      onTabChange(tabParam)
    }
  }, [tabParam, onTabChange])

  return null
}

const predictionsData = [
  { day: 'Mon', predictions: 32, label: 'Mon, 29 Jul' },
  { day: 'Tue', predictions: 45, label: 'Tue, 30 Jul' },
  { day: 'Wed', predictions: 58, label: 'Wed, 31 Jul' },
  { day: 'Thu', predictions: 74, label: 'Thu, 1 Aug' },
  { day: 'Fri', predictions: 62, label: 'Fri, 2 Aug' },
  { day: 'Sat', predictions: 80, label: 'Sat, 3 Aug' },
  { day: 'Sun', predictions: 95, label: 'Sun, 4 Aug' },
]

const CustomChartTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-[#0B0B0D] border border-[#FF453A]/40 rounded-xl px-2.5 py-1.5 shadow-2xl z-50 pointer-events-none">
        <p className="text-[12px] font-bold text-white">{data.predictions} Predictions</p>
        <p className="text-[10px] text-[#8A8A8A] font-mono mt-0.5">{data.label}</p>
      </div>
    )
  }
  return null
}

export default function AcademicWorkspacePage() {
  const [, setActiveTab] = useState<ModuleTab>('predictor')
  const [isMounted, setIsMounted] = useState(false)
  const [timeRange, setTimeRange] = useState('This Week')
  const [paperCount, setPaperCount] = useState(18)

  // Dynamic Paper Box Sections State
  const [paperBoxes, setPaperBoxes] = useState([
    {
      id: '1',
      title: 'Paper Box 1 (Operating Systems)',
      fileName: 'Operating_Systems_Midsem_2023.pdf',
      size: '2.4 MB',
      isUploaded: true,
    },
  ])

  const [recentFiles, setRecentFiles] = useState([
    {
      id: '1',
      fileName: 'Operating Systems Midsem.pdf',
      size: '2.4 MB',
      uploadedAt: 'Uploaded 2h ago',
      icon: FileText,
    },
    {
      id: '2',
      fileName: 'DBMS Endsem 2023.pdf',
      size: '3.1 MB',
      uploadedAt: 'Uploaded 1 day ago',
      icon: FileText,
    },
    {
      id: '3',
      fileName: 'OS Midsem 2024.docx',
      size: '1.8 MB',
      uploadedAt: 'Uploaded 2 days ago',
      icon: FileCode,
    },
  ])

  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleAddPaperBox = () => {
    const newNum = paperBoxes.length + 1
    const newBox = {
      id: String(Date.now()),
      title: `Paper Box ${newNum} (New Exam Paper)`,
      fileName: '',
      size: '',
      isUploaded: false,
    }
    setPaperBoxes((prev) => [...prev, newBox])
    setPaperCount((prev) => prev + 1)
  }

  const handleRemovePaperBox = (id: string) => {
    if (paperBoxes.length <= 1) return
    setPaperBoxes((prev) => prev.filter((b) => b.id !== id))
  }

  const handleUploadToBox = (id: string) => {
    setPaperBoxes((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              fileName: `KIIT_Exam_Paper_${b.title.split(' ')[2] || 'New'}.pdf`,
              size: '2.1 MB',
              isUploaded: true,
            }
          : b
      )
    )

    // Add to recent files
    const targetBox = paperBoxes.find((b) => b.id === id)
    if (targetBox) {
      setRecentFiles((prev) => [
        {
          id: String(Date.now()),
          fileName: `KIIT_Exam_Paper_${targetBox.title.split(' ')[2] || 'New'}.pdf`,
          size: '2.1 MB',
          uploadedAt: 'Uploaded just now',
          icon: FileText,
        },
        ...prev,
      ])
    }
  }

  const handleGeneratePrediction = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
    }, 1200)
  }

  return (
    <div className="space-y-6 pb-8 max-w-[1600px] mx-auto text-white">
      {/* URL Tab Parameter Reader in Suspense */}
      <Suspense fallback={null}>
        <TabParamsHandler onTabChange={setActiveTab} />
      </Suspense>

      {/* ----------------------------------------------------
          1. WELCOME HERO SECTION (Compact Sizing)
      ---------------------------------------------------- */}
      <div className="bg-[#111214] border border-white/[0.04] rounded-[20px] p-5 lg:px-6 lg:py-5 shadow-[0_8px_24px_rgba(0,0,0,0.18)] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-white tracking-tight leading-tight">
            Welcome back, Soumya!
          </h1>
          <p className="text-xs font-normal text-[#8A8A8A] mt-1 leading-relaxed">
            Continue your academic journey. Everything you need in one workspace.
          </p>
        </div>

        {/* Right Compact Progress Card with 70% Circular Progress Ring */}
        <div className="bg-[#0B0B0D] border border-white/[0.05] rounded-[16px] p-3 px-4 shrink-0 flex items-center gap-3.5 shadow-sm min-w-[220px]">
          {/* Circular Progress Ring (70%) */}
          <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
            <svg className="w-10 h-10 transform -rotate-90">
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="currentColor"
                strokeWidth="3"
                className="text-white/10"
                fill="transparent"
              />
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="#FF453A"
                strokeWidth="3"
                strokeDasharray={100}
                strokeDashoffset={100 * (1 - 0.70)}
                strokeLinecap="round"
                className="transition-all duration-500 ease-out"
                fill="transparent"
              />
            </svg>
            <span className="absolute text-[10px] font-bold text-white">70%</span>
          </div>

          <div>
            <span className="text-[12px] font-normal text-[#8A8A8A] block">Today&apos;s Progress</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs font-bold text-white">7 Tasks</span>
              <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                AI Ready
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------
          1. STATS CARDS (Matching User Reference Image 1:1)
      ---------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            title: 'Papers Uploaded',
            value: paperCount,
            pct: '12%',
            period: 'from last week',
            icon: FileText,
          },
          {
            title: 'Subjects Covered',
            value: '5',
            pct: '8%',
            period: 'from last week',
            icon: BookOpen,
          },
          {
            title: 'AI Predictions',
            value: '3',
            pct: '20%',
            period: 'from last week',
            icon: TrendingUp,
          },
          {
            title: 'Model Accuracy',
            value: '95%',
            pct: '5%',
            period: 'from last week',
            icon: Target,
          },
        ].map((stat, idx) => {
          const StatIcon = stat.icon
          return (
            <div
              key={idx}
              className="bg-[#111214] border border-white/[0.04] rounded-[20px] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.18)] flex flex-col justify-between h-[135px] hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
            >
              {/* Top Row: Red Icon Container + Large Number & Title */}
              <div className="flex items-center gap-3.5">
                <div className="w-[44px] h-[44px] rounded-[14px] bg-[#FF453A]/10 border border-[#FF453A]/20 flex items-center justify-center text-[#FF453A] shrink-0">
                  <StatIcon size={20} />
                </div>
                <div>
                  <span className="text-[26px] font-bold text-white font-mono tracking-tight leading-none block">
                    {stat.value}
                  </span>
                  <span className="text-[13px] text-[#8A8A8A] font-normal mt-1 block">
                    {stat.title}
                  </span>
                </div>
              </div>

              {/* Bottom Row: Growth Indicator */}
              <div className="flex items-center gap-1.5 text-[12px] pt-1">
                <span className="text-[#FF453A] font-bold">↑ {stat.pct}</span>
                <span className="text-[#8A8A8A] font-normal">{stat.period}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* ----------------------------------------------------
          BOTTOM SECTION (3-Column Responsive Layout)
      ---------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* 2. LEFT PANEL: Upload Past Papers (Dynamic Paper Box Sections) */}
        <div className="lg:col-span-5 bg-[#111214] border border-white/[0.04] rounded-[20px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.18)] flex flex-col justify-between space-y-5 hover:-translate-y-1 transition-all duration-200">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[18px] font-semibold text-white tracking-tight">
                  Upload Past Papers
                </h3>
                <p className="text-[14px] text-[#8A8A8A] font-normal mt-1 leading-relaxed">
                  Train AI model with previous 3–5 semester exam papers.
                </p>
              </div>
              <button
                onClick={handleAddPaperBox}
                className="bg-white/[0.06] border border-white/10 hover:bg-white/12 text-white text-[12px] font-semibold px-3 py-1.5 rounded-xl transition-all hover:brightness-110 flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
              >
                <Plus size={14} /> + Add Paper Box
              </button>
            </div>

            {/* Dynamic List of Paper Box Sections */}
            <div className="space-y-3.5 max-h-[260px] overflow-y-auto pr-1">
              {paperBoxes.map((box) => (
                <div key={box.id} className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-250">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-bold text-[#8A8A8A] uppercase tracking-wider">
                      {box.title}
                    </span>
                    {paperBoxes.length > 1 && (
                      <button
                        onClick={() => handleRemovePaperBox(box.id)}
                        className="text-[11px] text-[#FF453A] hover:underline font-semibold cursor-pointer flex items-center gap-0.5"
                      >
                        <X size={12} /> Remove Section
                      </button>
                    )}
                  </div>

                  {box.isUploaded ? (
                    <div className="bg-[#0B0B0D] border border-white/[0.06] rounded-[16px] p-3 flex items-center justify-between transition-all">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-[#FF453A]/10 border border-[#FF453A]/20 flex items-center justify-center text-[#FF453A] shrink-0">
                          <FileText size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{box.fileName}</p>
                          <p className="text-[11px] text-[#8A8A8A] font-mono mt-0.5">{box.size} • Ready for AI model</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 shrink-0">
                        Loaded
                      </span>
                    </div>
                  ) : (
                    <div
                      onClick={() => handleUploadToBox(box.id)}
                      className="bg-[#0B0B0D] border-2 border-dashed border-white/10 hover:border-[#FF453A] rounded-[16px] p-4 text-center cursor-pointer transition-colors duration-200 space-y-2 flex flex-col items-center justify-center min-h-[110px] group"
                    >
                      <div className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#8A8A8A] group-hover:text-[#FF453A] transition-colors">
                        <Upload size={16} />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-semibold text-white">
                          Drag &amp; drop file for {box.title.split(' ')[0]} {box.title.split(' ')[1]}
                        </p>
                        <p className="text-[10px] text-[#8A8A8A] font-normal">
                          PDF, DOCX or Images
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Secondary-Width Action Button (approx 65% width) */}
          <div className="pt-1 flex justify-center">
            <button
              onClick={handleGeneratePrediction}
              disabled={isGenerating}
              className="w-[70%] sm:w-[65%] h-[38px] bg-[#FF453A]/90 hover:bg-[#FF453A] text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50 hover:brightness-110"
            >
              {isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles size={14} /> Generate AI Prediction
                </>
              )}
            </button>
          </div>
        </div>

        {/* 4. CENTER PANEL: Recent Files (30% -> lg:col-span-4) */}
        <div className="lg:col-span-4 bg-[#111214] border border-white/[0.04] rounded-[20px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.18)] flex flex-col justify-between space-y-4 hover:-translate-y-1 transition-all duration-200">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-semibold text-white tracking-tight">
                Recent Files
              </h3>
              <button
                onClick={handleAddPaperBox}
                className="text-[12px] text-[#FF453A] hover:underline font-semibold cursor-pointer"
              >
                View All
              </button>
            </div>

            {/* Three Compact Interactive File Cards */}
            <div className="space-y-3">
              {recentFiles.slice(0, 3).map((file) => {
                const FileIcon = file.icon
                return (
                  <div
                    key={file.id}
                    className="bg-[#0B0B0D] border border-white/[0.04] hover:border-white/15 hover:bg-white/[0.05] rounded-[14px] p-3 flex items-center justify-between transition-all duration-200 cursor-pointer animate-in fade-in slide-in-from-bottom-2 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8.5 h-8.5 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[#FF453A] shrink-0 group-hover:scale-105 transition-transform">
                        <FileIcon size={17} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate max-w-[145px] sm:max-w-[175px]">
                          {file.fileName}
                        </h4>
                        <p className="text-[12px] text-[#71717A] font-mono mt-0.5 truncate">
                          {file.size} • {file.uploadedAt}
                        </p>
                      </div>
                    </div>

                    <button
                      className="p-1.5 text-[#8A8A8A] hover:text-white rounded-lg hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
                      title="File Options"
                    >
                      <MoreVertical size={15} />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="pt-1 border-t border-white/[0.04] flex items-center justify-between text-[12px] text-[#71717A] font-mono">
            <span>3 Active Models</span>
            <span className="text-emerald-400 font-bold">100% Synced</span>
          </div>
        </div>

        {/* 3. RIGHT PANEL: AI Predictions Chart (32% -> lg:col-span-3) */}
        <div className="lg:col-span-3 bg-[#111214] border border-white/[0.04] rounded-[20px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.18)] flex flex-col justify-between space-y-3 hover:-translate-y-1 transition-all duration-200 relative overflow-hidden">
          
          <div className="flex items-center justify-between">
            <h3 className="text-[18px] font-semibold text-white tracking-tight">
              AI Predictions
            </h3>
            
            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-[#0B0B0D] border border-white/10 text-[12px] text-white px-2.5 py-1 rounded-md outline-none cursor-pointer appearance-none pr-5 font-medium"
              >
                <option value="This Week">This Week</option>
                <option value="Last Week">Last Week</option>
                <option value="This Month">This Month</option>
              </select>
              <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#8A8A8A] pointer-events-none" />
            </div>
          </div>

          {/* Smooth Line Chart with Thicker 3px Line & Softer Red Gradient — Height 210px */}
          <div className="relative h-[210px] w-full pt-1">
            
            {/* Floating Tooltip above Thursday */}
            <div className="absolute top-0 left-[54%] -translate-x-1/2 bg-[#0B0B0D] border border-[#FF453A]/40 rounded-xl px-2.5 py-1 shadow-xl z-20 pointer-events-none flex flex-col items-center">
              <span className="text-[11px] font-bold text-white">74 Predictions</span>
              <span className="text-[9px] text-[#8A8A8A] font-mono">Thu, 1 Aug</span>
            </div>

            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={predictionsData}
                  margin={{ top: 16, right: 6, left: -24, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="softRedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF453A" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#FF453A" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="day"
                    stroke="#71717A"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#71717A"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 100]}
                  />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="predictions"
                    stroke="#FF453A"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#softRedGradient)"
                    isAnimationActive={true}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

        </div>

      </div>

      {/* ----------------------------------------------------
          9. NEW WIDGET (Balancing Empty Space: Upcoming Exam Alert Card)
      ---------------------------------------------------- */}
      <div className="bg-[#111214] border border-white/[0.04] rounded-[20px] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.18)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:-translate-y-0.5">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#FF453A]/10 border border-[#FF453A]/20 flex items-center justify-center text-[#FF453A] shrink-0">
            <Calendar size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-[14px] font-bold text-white">
                Upcoming Exam: Operating Systems Midsem
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF453A]/10 text-[#FF453A] border border-[#FF453A]/20 font-mono">
                In 4 Days (8 Aug)
              </span>
            </div>
            <p className="text-[12px] text-[#8A8A8A] font-normal mt-0.5">
              3 High-Probability Topics Flagged (Memory Management, Page Replacement, Semaphores)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/workspace/academic?tab=pyq"
            className="bg-white/[0.06] hover:bg-white/10 border border-white/10 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5"
          >
            <Sparkles size={14} className="text-[#FF453A]" /> Review Topics
          </Link>
        </div>
      </div>

    </div>
  )
}
