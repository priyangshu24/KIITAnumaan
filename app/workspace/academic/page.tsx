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
  TrendingUp,
  MoreVertical,
  ChevronDown,
  FileCode,
  Calendar,
  X,
  Target,
  Clock,
  Zap,
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

  // Uploaded paper cards
  const [uploadedPapers] = useState([
    { name: '2025 Midsem.pdf', status: 'Parsed', questions: '28 Questions', code: 'CS-3004' },
    { name: '2024 Endsem.pdf', status: 'Parsed', questions: '32 Questions', code: 'CS-3004' },
    { name: '2023 Endsem.docx', status: 'Parsed', questions: '30 Questions', code: 'CS-3004' },
    { name: '2023 Midsem.pdf', status: 'Parsed', questions: '25 Questions', code: 'CS-3004' },
  ])

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
    {
      id: '4',
      fileName: 'Computer Networks PYQ 2023.pdf',
      size: '4.2 MB',
      uploadedAt: 'Uploaded 3 days ago',
      icon: FileText,
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
          HERO: SMALL HEADER (Left Aligned Title + Right Button)
      ---------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
            Academic Workspace
          </h1>
          <p className="text-xs text-[#8A8A8A] font-normal mt-0.5">
            AI Powered Previous Year Paper Prediction
          </p>
        </div>

        <button
          onClick={handleGeneratePrediction}
          disabled={isGenerating}
          className="bg-[#FF453A] hover:bg-[#FF453A]/90 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50 shrink-0"
        >
          {isGenerating ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={14} /> Generate Prediction
            </>
          )}
        </button>
      </div>

      {/* ----------------------------------------------------
          FIRST ROW: 4 Uploaded Paper Cards (Identical Size)
      ---------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {uploadedPapers.map((paper, idx) => (
          <div
            key={idx}
            className="bg-[#111214] border border-white/[0.04] rounded-[20px] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.18)] flex flex-col justify-between h-[115px] hover:-translate-y-1 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1 min-w-0">
                <span className="text-xs font-bold text-white truncate block">
                  {paper.name}
                </span>
                <span className="text-[10px] text-[#8A8A8A] font-mono block">
                  {paper.code}
                </span>
              </div>
              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase tracking-wider shrink-0">
                {paper.status}
              </span>
            </div>

            <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-[#8A8A8A] font-mono">
              <span className="flex items-center gap-1">
                <FileText size={12} className="text-[#FF453A]" /> {paper.questions}
              </span>
              <span>Loaded</span>
            </div>
          </div>
        ))}
      </div>

      {/* ----------------------------------------------------
          SECOND ROW: Upload Section (~60%) + Stacked Cards (~40%)
      ---------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Upload Section (~60% width -> lg:col-span-7) */}
        <div className="lg:col-span-7 bg-[#111214] border border-white/[0.04] rounded-[20px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.18)] flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[16px] font-semibold text-white tracking-tight">
                Upload Papers
              </h3>
              <p className="text-xs text-[#8A8A8A] font-normal mt-0.5">
                Upload past semester exam papers to train the prediction model.
              </p>
            </div>
            <button
              onClick={handleAddPaperBox}
              className="bg-white/[0.06] border border-white/10 hover:bg-white/12 text-white text-[11px] font-semibold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <Plus size={13} /> Add Box
            </button>
          </div>

          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {paperBoxes.map((box) => (
              <div key={box.id} className="space-y-1">
                {box.isUploaded ? (
                  <div className="bg-[#0B0B0D] border border-white/[0.06] rounded-[16px] p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-[#FF453A]/10 border border-[#FF453A]/20 flex items-center justify-center text-[#FF453A] shrink-0">
                        <FileText size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{box.fileName}</p>
                        <p className="text-[10px] text-[#8A8A8A] font-mono mt-0.5">{box.size} • Ready</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 shrink-0">
                      Parsed
                    </span>
                  </div>
                ) : (
                  <div
                    onClick={() => handleUploadToBox(box.id)}
                    className="bg-[#0B0B0D] border-2 border-dashed border-white/10 hover:border-[#FF453A] rounded-[16px] p-5 text-center cursor-pointer transition-colors duration-200 flex flex-col items-center justify-center min-h-[120px] group space-y-2"
                  >
                    <div className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#8A8A8A] group-hover:text-[#FF453A] transition-colors">
                      <Upload size={18} />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-white">
                        + Upload Papers (Drag &amp; Drop)
                      </p>
                      <p className="text-[10px] text-[#8A8A8A] font-mono uppercase tracking-wider">
                        PDF • DOCX • IMAGE
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side Stacked Cards (~40% width -> lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Card 1: Recent Files Summary */}
          <div className="bg-[#111214] border border-white/[0.04] rounded-[20px] p-4.5 shadow-[0_8px_24px_rgba(0,0,0,0.18)] flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Recent Files
              </h4>
              <span className="text-[10px] font-mono text-[#8A8A8A]">3 Active</span>
            </div>
            <div className="space-y-2">
              {recentFiles.slice(0, 2).map((file) => (
                <div key={file.id} className="bg-[#0B0B0D] border border-white/[0.04] rounded-xl p-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText size={15} className="text-[#FF453A] shrink-0" />
                    <span className="text-xs font-semibold text-white truncate max-w-[170px]">{file.fileName}</span>
                  </div>
                  <span className="text-[10px] text-[#8A8A8A] font-mono">{file.size}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: AI Prediction Status */}
          <div className="bg-[#111214] border border-white/[0.04] rounded-[20px] p-4.5 shadow-[0_8px_24px_rgba(0,0,0,0.18)] flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                AI Prediction Status
              </h4>
              <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Model Synced
              </span>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div className="w-10 h-10 rounded-xl bg-[#FF453A]/10 border border-[#FF453A]/20 flex items-center justify-center text-[#FF453A] shrink-0">
                <Target size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-white">95% Prediction Confidence</p>
                <p className="text-[10px] text-[#8A8A8A] font-mono">147 Question Units Analyzed</p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ----------------------------------------------------
          THIRD ROW: Recent Files Larger Card (~65%) + Prediction Analytics (~35%)
      ---------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Recent Files Larger Card (~65% width -> lg:col-span-8) */}
        <div className="lg:col-span-8 bg-[#111214] border border-white/[0.04] rounded-[20px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.18)] flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[16px] font-semibold text-white tracking-tight">
                Recent Files
              </h3>
              <p className="text-xs text-[#8A8A8A] font-normal mt-0.5">
                Recently uploaded exam papers, notes, and question banks.
              </p>
            </div>
            <button
              onClick={handleAddPaperBox}
              className="text-[12px] text-[#FF453A] hover:underline font-semibold cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {recentFiles.map((file) => {
              const FileIcon = file.icon
              return (
                <div
                  key={file.id}
                  className="bg-[#0B0B0D] border border-white/[0.04] hover:border-white/15 hover:bg-white/[0.05] rounded-[14px] p-3 flex items-center justify-between transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8.5 h-8.5 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[#FF453A] shrink-0 group-hover:scale-105 transition-transform">
                      <FileIcon size={17} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate max-w-[240px] sm:max-w-[340px]">
                        {file.fileName}
                      </h4>
                      <p className="text-[11px] text-[#71717A] font-mono mt-0.5 truncate">
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

        {/* Prediction Analytics Graph Card (~35% width -> lg:col-span-4) */}
        <div className="lg:col-span-4 bg-[#111214] border border-white/[0.04] rounded-[20px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.18)] flex flex-col justify-between space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="text-[16px] font-semibold text-white tracking-tight">
              Prediction Analytics
            </h3>
            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-[#0B0B0D] border border-white/10 text-[11px] text-white px-2 py-1 rounded-md outline-none cursor-pointer appearance-none pr-5 font-medium"
              >
                <option value="This Week">This Week</option>
                <option value="Last Week">Last Week</option>
                <option value="This Month">This Month</option>
              </select>
              <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#8A8A8A] pointer-events-none" />
            </div>
          </div>

          <div className="relative h-[210px] w-full pt-1">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={predictionsData}
                  margin={{ top: 16, right: 6, left: -24, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="softRedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF453A" stopOpacity={0.2} />
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
                    strokeWidth={2.5}
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
          BOTTOM ROW: 3 Grid Cards (Upcoming Exam, Recent Prediction History, Quick Actions)
      ---------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Upcoming Exam */}
        <div className="bg-[#111214] border border-white/[0.04] rounded-[20px] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.18)] flex flex-col justify-between space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FF453A]/10 border border-[#FF453A]/20 flex items-center justify-center text-[#FF453A] shrink-0">
              <Calendar size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Upcoming Exam</h4>
              <p className="text-[10px] text-[#8A8A8A] font-mono">OS Midsem • In 4 Days</p>
            </div>
          </div>
          <p className="text-[11px] text-[#8A8A8A] leading-relaxed">
            3 High-Probability Topics Flagged (Memory Management, Page Replacement).
          </p>
          <Link
            href="/workspace/academic?tab=pyq"
            className="text-[11px] text-[#FF453A] hover:underline font-semibold flex items-center gap-1"
          >
            Review Topics →
          </Link>
        </div>

        {/* Card 2: Recent Prediction History */}
        <div className="bg-[#111214] border border-white/[0.04] rounded-[20px] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.18)] flex flex-col justify-between space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FF453A]/10 border border-[#FF453A]/20 flex items-center justify-center text-[#FF453A] shrink-0">
              <Clock size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Recent History</h4>
              <p className="text-[10px] text-[#8A8A8A] font-mono">3 Papers Generated</p>
            </div>
          </div>
          <p className="text-[11px] text-[#8A8A8A] leading-relaxed">
            Autumn 2025 DBMS Forecast PDF generated with 92% accuracy score.
          </p>
          <button
            onClick={() => alert('Opening Prediction History...')}
            className="text-[11px] text-[#FF453A] hover:underline font-semibold text-left"
          >
            View Full History →
          </button>
        </div>

        {/* Card 3: Quick Actions */}
        <div className="bg-[#111214] border border-white/[0.04] rounded-[20px] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.18)] flex flex-col justify-between space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FF453A]/10 border border-[#FF453A]/20 flex items-center justify-center text-[#FF453A] shrink-0">
              <Zap size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Quick Actions</h4>
              <p className="text-[10px] text-[#8A8A8A] font-mono">Workspace Shortcuts</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAddPaperBox}
              className="flex-1 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white text-[11px] font-semibold py-2 rounded-xl text-center transition-all"
            >
              + Upload PYQ
            </button>
            <button
              onClick={handleGeneratePrediction}
              className="flex-1 bg-[#FF453A] hover:bg-[#FF453A]/90 text-white text-[11px] font-semibold py-2 rounded-xl text-center transition-all"
            >
              Predict Now
            </button>
          </div>
        </div>

      </div>

    </div>
  )
}


