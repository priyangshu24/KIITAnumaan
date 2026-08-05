'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Sparkles,
  Download,
  Upload,
  Plus,
  CheckCircle2,
  Copy,
  Filter,
  FileText,
  Trash2,
  BookOpen,
  Library,
  X,
  ArrowRight,
} from 'lucide-react'


const samplePredictedQuestions = [
  {
    id: 1,
    question: 'Explain the working of Banker’s Algorithm for deadlock avoidance with a suitable example matrix.',
    topic: 'Deadlock Avoidance & Detection',
    unit: 'Unit 3',
    difficulty: 'Hard',
    confidence: 96,
    marks: 10,
    previousAppeared: 'Appeared in 2023 & 2021 Endsem',
    subject: 'Operating Systems',
  },
  {
    id: 2,
    question: 'Differentiate between Paging and Segmentation with respect to memory management overhead and virtual addressing.',
    topic: 'Memory Management',
    unit: 'Unit 4',
    difficulty: 'Medium',
    confidence: 91,
    marks: 8,
    previousAppeared: 'Appeared in 2024 Midsem',
    subject: 'Operating Systems',
  },
  {
    id: 3,
    question: 'Write a C program using semaphores to solve the Bounded-Buffer Producer-Consumer Problem.',
    topic: 'Process Synchronization',
    unit: 'Unit 2',
    difficulty: 'Hard',
    confidence: 88,
    marks: 10,
    previousAppeared: 'Appeared in 2022 Endsem',
    subject: 'Operating Systems',
  },
  {
    id: 4,
    question: 'Compare Preemptive Shortest Remaining Time First (SRTF) and Non-preemptive SJF CPU Scheduling.',
    topic: 'CPU Scheduling',
    unit: 'Unit 1',
    difficulty: 'Easy',
    confidence: 82,
    marks: 5,
    previousAppeared: 'Appeared in 2023 Midsem',
    subject: 'Operating Systems',
  },
]

export default function AcademicPredictedQuestionsPage() {
  const [selectedBranch, setSelectedBranch] = useState('CSE')
  const [selectedSubject, setSelectedSubject] = useState('Computer Networks')
  const [selectedUnit, setSelectedUnit] = useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isPlatformModalOpen, setIsPlatformModalOpen] = useState(false)
  const [isChoiceModalOpen, setIsChoiceModalOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [importBranch, setImportBranch] = useState('CSE')
  const [importYear, setImportYear] = useState('2025')
  const [importSem, setImportSem] = useState('Semester 6')
  const [importSession, setImportSession] = useState('Autumn Sem')
  const [importExamType, setImportExamType] = useState('End Sem')

  // Engineering Branches List
  const branchesList = [
    { code: 'CSE', label: 'Computer Science (CSE)' },
    { code: 'IT', label: 'Information Tech (IT)' },
    { code: 'CSSE', label: 'Software Eng (CSSE)' },
    { code: 'ECE', label: 'Electronics & Comm (ECE)' },
    { code: 'Civil', label: 'Civil Engineering' },
    { code: 'Mechanical', label: 'Mechanical Engineering' },
    { code: 'Electrical', label: 'Electrical Engineering' },
    { code: 'Electronics', label: 'Electronics & Telecom' },
    { code: 'Aerospace', label: 'Aerospace Engineering' },
  ]

  // Branch-to-Subjects mapping
  const branchSubjectsMap: Record<string, string[]> = {
    CSE: ['Computer Networks', 'Operating Systems', 'DBMS', 'System Design', 'Algorithms & Data Structures', 'Theory of Computation'],
    IT: ['Computer Networks', 'DBMS', 'Web Technologies', 'Cloud Computing', 'Information Security'],
    CSSE: ['System Design', 'Software Engineering', 'Computer Networks', 'DBMS', 'Object Oriented Architecture'],
    ECE: ['Signals & Systems', 'Digital Electronics', 'VLSI Design', 'Analog Circuits', 'Electromagnetics'],
    Civil: ['Structural Analysis', 'Fluid Mechanics', 'Geotechnical Eng', 'Transportation Eng', 'Concrete Tech'],
    Mechanical: ['Thermodynamics', 'Fluid Mechanics', 'Heat Transfer', 'Theory of Machines', 'Kinematics'],
    Electrical: ['Electrical Circuits', 'Power Systems', 'Control Systems', 'Electrical Machines', 'Power Electronics'],
    Electronics: ['Signals & Systems', 'Microprocessors', 'Digital Electronics', 'Communication Systems'],
    Aerospace: ['Aerodynamics', 'Flight Dynamics', 'Aircraft Propulsion', 'Aerospace Structures', 'Avionics'],
  }

  const availableSubjects = branchSubjectsMap[selectedBranch] || branchSubjectsMap['CSE']

  const [papers, setPapers] = useState([
    { name: 'Computer_Networks_Midsem_2023.pdf', subject: 'Computer Networks', size: '2.4 MB', status: 'Parsed', statusType: 'parsed', count: '32 Question Units' },
    { name: 'Computer_Networks_Endsem_2024.docx', subject: 'Computer Networks', size: '1.8 MB', status: 'OCR', statusType: 'ocr', count: '28 Question Units' },
    { name: 'Computer_Networks_2023.scan', subject: 'Computer Networks', size: '3.1 MB', status: 'Processing', statusType: 'processing', count: '25 Question Units' },
    { name: 'Operating_Systems_Midsem_2023.pdf', subject: 'Operating Systems', size: '2.4 MB', status: 'Parsed', statusType: 'parsed', count: '32 Question Units' },
    { name: 'DBMS_Endsem_2024.docx', subject: 'DBMS', size: '1.8 MB', status: 'OCR', statusType: 'ocr', count: '28 Question Units' },
  ])

  const [hasGenerated, setHasGenerated] = useState(false)

  const handleRemovePaper = (indexToRemove: number) => {
    setPapers((prev) => prev.filter((_, idx) => idx !== indexToRemove))
  }

  const handleCopyQuestion = (id: number, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1800)
  }

  const handleFileUpload = (files: FileList | File[]) => {
    if (!files || files.length === 0) return
    const fileArray = Array.from(files)
    const newPaperEntries = fileArray.map((f) => ({
      name: f.name,
      subject: selectedSubject,
      size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
      status: 'Parsed',
      statusType: 'parsed',
      count: `${Math.floor(Math.random() * 15) + 20} Question Units`,
    }))
    setPapers((prev) => [...prev, ...newPaperEntries])
    setIsUploadModalOpen(false)
    setIsChoiceModalOpen(false)
  }

  const handleImportFromPlatformPYQ = () => {
    const newPaper = {
      name: `${selectedSubject.replace(/\s+/g, '_')}_${importExamType.replace(/\s+/g, '')}_${importSession.replace(/\s+/g, '')}_${importYear}.pdf`,
      subject: selectedSubject,
      size: '2.8 MB',
      status: 'Parsed',
      statusType: 'parsed',
      count: '34 Question Units',
    }
    setPapers((prev) => [...prev, newPaper])
    setIsPlatformModalOpen(false)
    setIsChoiceModalOpen(false)
  }

  const handleAddDefaultPaper = () => {
    const newPaper = {
      name: `${selectedSubject.replace(/\s+/g, '_')}_Paper_${papers.filter(p => p.subject === selectedSubject).length + 1}.pdf`,
      subject: selectedSubject,
      size: '2.1 MB',
      status: 'Parsed',
      statusType: 'parsed',
      count: '30 Question Units',
    }
    setPapers((prev) => [...prev, newPaper])
  }

  const handleGenerateAI = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setHasGenerated(true)
    }, 1200)
  }

  // Filter reference papers strictly by active subject
  const currentSubjectPapers = papers.filter((p) => p.subject === selectedSubject)

  const filteredQuestions = samplePredictedQuestions.filter((q) => {
    const matchesSubject = q.subject === selectedSubject || selectedSubject === 'All'
    const matchesUnit = selectedUnit === 'All' || q.unit === selectedUnit
    const matchesDiff = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty
    return matchesSubject && matchesUnit && matchesDiff
  })

  return (
    <div className="space-y-6 pb-12 w-full text-white pt-1">
      
      {/* Top Banner Header Card (With Full Cover Red KIIT Campus Wireframe Background Image) */}
      <div className="relative overflow-hidden w-full bg-[#0B0B0D] border border-white/[0.08] rounded-[24px] p-6 lg:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.45)] min-h-[160px] flex items-center">
        <img
          src="/kiit-campus-dotted.jpg"
          alt="KIIT Campus Wireframe Background"
          className="absolute inset-0 w-full h-full object-cover object-[75%_center] opacity-90 pointer-events-none z-0 rounded-[24px]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0D] via-[#0B0B0D]/75 to-transparent pointer-events-none z-10 rounded-[24px]" />

        <div className="relative z-20 space-y-1.5 max-w-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF453A] font-mono block drop-shadow">
            PREDICTED QUESTIONS
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-white tracking-tight leading-none drop-shadow-md">
            AI Predicted Examination Questions
          </h1>
          <p className="text-xs text-[#A0A0A0] font-normal mt-2 leading-relaxed drop-shadow">
            Machine-learning predicted question patterns derived from historic KIIT university question papers.
          </p>
        </div>
      </div>

      {/* ----------------------------------------------------
          1. UPLOAD PAPERS CARD (Primary Focal Section with Liquid Glassmorphism)
      ---------------------------------------------------- */}
      <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-[24px] p-6 lg:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.45)] space-y-6">
        
        {/* Header Row with Liquid Glass Capsule Selectors for Branch & Active Subject */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Upload Papers
              </h1>
              
              {/* Branch Selector Capsule */}
              <div className="inline-flex items-center gap-2 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-full px-3.5 py-1 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                <span className="text-[#8A8A8A] font-mono text-[11px]">Branch:</span>
                <select
                  value={selectedBranch}
                  onChange={(e) => {
                    const newBranch = e.target.value
                    setSelectedBranch(newBranch)
                    const newSub = branchSubjectsMap[newBranch]?.[0] || 'Computer Networks'
                    setSelectedSubject(newSub)
                  }}
                  className="bg-transparent text-white font-bold outline-none cursor-pointer text-xs pr-1"
                >
                  {branchesList.map((b) => (
                    <option key={b.code} value={b.code} className="bg-[#111214] text-white">
                      {b.code} - {b.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Liquid Glass Capsule Subject Lock Selector */}
              <div className="inline-flex items-center gap-2 bg-white/[0.04] backdrop-blur-xl border border-[#FF453A]/30 rounded-full px-4 py-1.5 shadow-[0_0_20px_rgba(255,69,58,0.12)]">
                <span className="text-[#8A8A8A] font-mono text-xs">Active Subject:</span>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="bg-transparent text-white font-bold outline-none cursor-pointer text-xs pr-2"
                >
                  {availableSubjects.map((sub) => (
                    <option key={sub} value={sub} className="bg-[#111214] text-white">
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <p className="text-xs text-[#8A8A8A] font-normal mt-2 leading-relaxed">
              Branch <strong className="text-white">{selectedBranch}</strong> • Upload papers strictly for <strong className="text-white">{selectedSubject}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              onClick={() => setIsChoiceModalOpen(true)}
              className="bg-[#FF453A] hover:bg-[#FF453A]/90 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-[#FF453A]/20"
            >
              <Upload size={14} /> Import Paper Box
            </button>

            <button
              onClick={() => setIsPlatformModalOpen(true)}
              className="bg-white/[0.04] backdrop-blur-md hover:bg-white/10 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/10 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Library size={14} className="text-[#FF453A]" /> Question Library
            </button>
          </div>
        </div>

        {/* Uploaded Reference Papers 3-Column Responsive Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#8A8A8A] uppercase tracking-wider font-mono">
              Uploaded Reference Papers ({currentSubjectPapers.length}) • <span className="text-[#FF453A]">{selectedSubject} Only</span>
            </h4>
          </div>

          {/* 3-Column Responsive Grid matching reference image */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full overflow-visible">
            {currentSubjectPapers.map((paper, idx) => {
              const statusColorClass =
                paper.statusType === 'ocr'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : paper.statusType === 'processing'
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'

              const originalIndex = papers.findIndex((p) => p.name === paper.name)

              return (
                <div
                  key={idx}
                  className="w-full h-[150px] bg-[#0B0B0D] border border-white/[0.06] hover:border-white/20 rounded-[20px] p-4 flex flex-col justify-between transition-all duration-200 shadow-sm relative group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-9 h-9 rounded-xl bg-[#FF453A]/10 border border-[#FF453A]/20 flex items-center justify-center text-[#FF453A] shrink-0">
                      <FileText size={18} />
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemovePaper(originalIndex !== -1 ? originalIndex : idx)
                      }}
                      className="p-1.5 text-[#8A8A8A] hover:text-[#FF453A] hover:bg-[#FF453A]/15 rounded-lg transition-all cursor-pointer"
                      title="Remove paper"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-white truncate" title={paper.name}>
                      {paper.name}
                    </h5>
                    <p className="text-[11px] text-[#8A8A8A] font-mono mt-0.5">
                      {paper.size} • {paper.count}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between">
                    <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${statusColorClass}`}>
                      {paper.status}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono font-medium">Ready</span>
                  </div>
                </div>
              )
            })}

            {/* Add Paper Card (Always occupies next slot in 3-column grid) */}
            <div
              onClick={() => setIsUploadModalOpen(true)}
              className="w-full h-[150px] bg-[#0B0B0D] border-2 border-dashed border-white/10 hover:border-[#FF453A] rounded-[20px] p-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 text-center group space-y-2"
            >
              <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#8A8A8A] group-hover:text-[#FF453A] group-hover:border-[#FF453A]/30 transition-all">
                <Plus size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-white group-hover:text-[#FF453A] transition-colors">
                  Add Paper
                </p>
                <p className="text-[10px] text-[#8A8A8A] font-mono mt-0.5 uppercase tracking-wider">
                  PDF • DOCX • IMAGE
                </p>
              </div>
            </div>
          </div>
        </div>



        {/* Generate AI Prediction Button */}
        <div className="pt-2 flex justify-center">
          <button
            onClick={handleGenerateAI}
            disabled={isGenerating}
            className="w-full sm:w-[70%] bg-[#FF453A] hover:bg-[#FF453A]/90 text-white text-sm font-bold py-3.5 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#FF453A]/25 hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Analyzing &amp; Generating Predictions...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Generate AI Prediction</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------
          2. PREDICTED QUESTIONS RESULTS
      ---------------------------------------------------- */}
      {hasGenerated && (
        <div className="space-y-4 w-full animate-in fade-in duration-500">
          <div className="bg-[#111214] border border-white/[0.04] rounded-[20px] p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                AI Predicted Questions ({filteredQuestions.length})
              </h3>
              <p className="text-[11px] text-[#8A8A8A] font-mono mt-0.5">
                High-confidence questions parsed from {papers.length} reference papers
              </p>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <div className="flex items-center gap-1 text-xs text-[#8A8A8A]">
                <Filter size={13} /> Filter:
              </div>
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="bg-[#0B0B0D] border border-white/10 text-xs text-white px-3 py-2 rounded-xl outline-none cursor-pointer"
              >
                <option value="All">All Units</option>
                <option value="Unit 1">Unit 1</option>
                <option value="Unit 2">Unit 2</option>
                <option value="Unit 3">Unit 3</option>
                <option value="Unit 4">Unit 4</option>
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-[#0B0B0D] border border-white/10 text-xs text-white px-3 py-2 rounded-xl outline-none cursor-pointer"
              >
                <option value="All">All Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 max-h-[680px] overflow-y-auto pr-1">
            {filteredQuestions.map((q) => (
              <div
                key={q.id}
                className="bg-[#111214] border border-white/[0.04] rounded-[22px] p-5 lg:p-6 shadow-[0_8px_24px_rgba(0,0,0,0.18)] space-y-4 hover:border-white/15 transition-all"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FF453A]/10 text-[#FF453A] border border-[#FF453A]/20">
                      {q.confidence}% Confidence
                    </span>
                    <span className="text-[10px] font-mono text-[#8A8A8A] bg-white/[0.04] px-2 py-0.5 rounded-md">
                      {q.unit}
                    </span>
                    <span className="text-[10px] font-mono text-[#8A8A8A] bg-white/[0.04] px-2 py-0.5 rounded-md">
                      {q.difficulty}
                    </span>
                    <span className="text-[10px] font-mono text-[#8A8A8A] bg-white/[0.04] px-2 py-0.5 rounded-md">
                      {q.marks} Marks
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopyQuestion(q.id, q.question)}
                    className="p-1.5 text-[#8A8A8A] hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                    title="Copy Question"
                  >
                    {copiedId === q.id ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>

                <h4 className="text-sm sm:text-base font-bold text-white leading-relaxed">
                  {q.question}
                </h4>

                <div className="pt-3 border-t border-white/[0.04] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#8A8A8A] gap-2 font-mono">
                  <span>Topic: <strong className="text-white">{q.topic}</strong></span>
                  <span className="text-emerald-400 font-medium">{q.previousAppeared}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          DRAG & DROP FILE IMPORT MODAL (WITH TOP-RIGHT X CANCEL BUTTON)
      ---------------------------------------------------- */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#111214] border border-white/10 rounded-[28px] p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-6">
            
            {/* Top Header & Close (X) Button */}
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Import Reference Paper
                </h3>
                <p className="text-xs text-[#8A8A8A] font-mono mt-0.5">
                  Locked to Subject: <span className="text-[#FF453A] font-bold">{selectedSubject}</span>
                </p>
              </div>

              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#8A8A8A] hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                title="Cancel / Close"
              >
                ✕
              </button>
            </div>

            {/* Drag and Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault()
                setIsDragging(false)
                if (e.dataTransfer.files) {
                  handleFileUpload(e.dataTransfer.files)
                }
              }}
              className={`border-2 border-dashed rounded-[20px] p-8 text-center transition-all duration-200 flex flex-col items-center justify-center space-y-3 cursor-pointer ${
                isDragging
                  ? 'border-[#FF453A] bg-[#FF453A]/10 scale-[0.99]'
                  : 'border-white/15 bg-[#0B0B0D] hover:border-white/30'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-[#FF453A]/10 border border-[#FF453A]/20 flex items-center justify-center text-[#FF453A]">
                <Upload size={22} />
              </div>

              <div>
                <p className="text-xs sm:text-sm font-bold text-white">
                  Drag and drop your examination paper here
                </p>
                <p className="text-[11px] text-[#8A8A8A] font-mono mt-1">
                  or paste document / browse local files
                </p>
              </div>

              <label className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1A1C20] border border-white/10 text-white hover:bg-white/10 text-xs font-semibold cursor-pointer transition-all">
                <span>Browse Files</span>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.docx,.doc,.jpg,.png"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) {
                      handleFileUpload(e.target.files)
                    }
                  }}
                />
              </label>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] text-[#8A8A8A] font-mono">
                Supported: PDF, DOCX, PNG, JPG (Max 25MB)
              </span>

              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/10 text-xs font-semibold text-[#8A8A8A] hover:text-white transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          IMPORT CHOICE SELECTION MODAL (DRAG & DROP vs PLATFORM QUESTION LIBRARY)
      ---------------------------------------------------- */}
      {isChoiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#111214] border border-white/10 rounded-[28px] p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-6">
            
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Add Reference Paper Box
                </h3>
                <p className="text-xs text-[#8A8A8A] font-mono mt-0.5">
                  Subject Locked: <span className="text-[#FF453A] font-bold">{selectedSubject}</span>
                </p>
              </div>

              <button
                onClick={() => setIsChoiceModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#8A8A8A] hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {/* Option 1: Drag & Drop from Device */}
              <div
                onClick={() => {
                  setIsChoiceModalOpen(false)
                  setIsUploadModalOpen(true)
                }}
                className="p-4 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-[#FF453A] transition-all cursor-pointer flex items-center gap-4 group"
              >
                <div className="w-11 h-11 rounded-2xl bg-[#FF453A]/10 border border-[#FF453A]/20 flex items-center justify-center text-[#FF453A] shrink-0 group-hover:scale-105 transition-transform">
                  <Upload size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-[#FF453A] transition-colors">
                    Upload or Drag & Drop File
                  </h4>
                  <p className="text-xs text-[#8A8A8A] mt-0.5">
                    Paste or drag PDF, DOCX, or scan images directly from your device.
                  </p>
                </div>
              </div>

              {/* Option 2: Import from Platform Question Library */}
              <div
                onClick={() => {
                  setIsChoiceModalOpen(false)
                  setIsPlatformModalOpen(true)
                }}
                className="p-4 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-[#FF453A] transition-all cursor-pointer flex items-center gap-4 group"
              >
                <div className="w-11 h-11 rounded-2xl bg-[#FF453A]/10 border border-[#FF453A]/20 flex items-center justify-center text-[#FF453A] shrink-0 group-hover:scale-105 transition-transform">
                  <Library size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-[#FF453A] transition-colors">
                    Import from Platform PYQ Library
                  </h4>
                  <p className="text-xs text-[#8A8A8A] mt-0.5">
                    Select year and semester papers directly from university library.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-white/[0.06]">
              <button
                onClick={() => setIsChoiceModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/10 text-xs font-semibold text-[#8A8A8A] hover:text-white transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          PLATFORM QUESTION LIBRARY IMPORT MODAL (PRE-LOCKED TO ACTIVE SUBJECT)
      ---------------------------------------------------- */}
      {isPlatformModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#111214] border border-white/10 rounded-[28px] p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Library size={18} className="text-[#FF453A]" /> Select PYQ Library Paper
                </h3>
                <p className="text-xs text-[#8A8A8A] font-mono mt-0.5">
                  Locked to Subject: <span className="text-[#FF453A] font-bold">{selectedSubject}</span>
                </p>
              </div>

              <button
                onClick={() => setIsPlatformModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#8A8A8A] hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                title="Cancel"
              >
                ✕
              </button>
            </div>

            {/* Selection Controls: Subject (Disabled/Locked) + Year + Semester */}
            <div className="space-y-4">
              {/* Branch & Subject Lock Container */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Branch Selector */}
                <div className="bg-[#16171B] border border-white/10 rounded-2xl p-3.5 space-y-1">
                  <span className="text-[10px] text-[#8A8A8A] font-mono font-medium block">Branch</span>
                  <select
                    value={importBranch}
                    onChange={(e) => setImportBranch(e.target.value)}
                    className="bg-transparent text-xs text-white font-bold outline-none cursor-pointer w-full"
                  >
                    {branchesList.map((b) => (
                      <option key={b.code} value={b.code} className="bg-[#111214] text-white">
                        {b.code} ({b.label})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject Lock Field with Crisp Visible Colors */}
                <div className="bg-[#16171B] border border-[#FF453A]/30 rounded-2xl p-3.5 space-y-1 shadow-[0_0_20px_rgba(255,69,58,0.1)]">
                  <span className="text-[10px] text-[#A0A0A0] font-mono font-medium block">
                    Subject (Pre-Selected)
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white tracking-wide truncate" title={selectedSubject}>{selectedSubject}</span>
                    <span className="text-[9px] font-mono font-bold text-[#FF453A] bg-[#FF453A]/10 border border-[#FF453A]/20 px-2 py-0.5 rounded-full uppercase">
                      Locked
                    </span>
                  </div>
                </div>
              </div>

              {/* 4 Filter Selectors Grid: Year, Semester, Session (Autumn/Spring), Exam (Mid/End) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Year */}
                <div className="bg-[#16171B] border border-white/10 rounded-2xl p-3 space-y-1">
                  <span className="text-[10px] text-[#8A8A8A] font-mono font-medium block">Year</span>
                  <select
                    value={importYear}
                    onChange={(e) => setImportYear(e.target.value)}
                    className="bg-transparent text-xs text-white font-bold outline-none cursor-pointer w-full"
                  >
                    <option value="2025" className="bg-[#111214] text-white">2025</option>
                    <option value="2024" className="bg-[#111214] text-white">2024</option>
                    <option value="2023" className="bg-[#111214] text-white">2023</option>
                    <option value="2022" className="bg-[#111214] text-white">2022</option>
                  </select>
                </div>

                {/* Semester */}
                <div className="bg-[#16171B] border border-white/10 rounded-2xl p-3 space-y-1">
                  <span className="text-[10px] text-[#8A8A8A] font-mono font-medium block">Semester</span>
                  <select
                    value={importSem}
                    onChange={(e) => setImportSem(e.target.value)}
                    className="bg-transparent text-xs text-white font-bold outline-none cursor-pointer w-full"
                  >
                    <option value="Semester 4" className="bg-[#111214] text-white">Semester 4</option>
                    <option value="Semester 5" className="bg-[#111214] text-white">Semester 5</option>
                    <option value="Semester 6" className="bg-[#111214] text-white">Semester 6</option>
                    <option value="Semester 7" className="bg-[#111214] text-white">Semester 7</option>
                  </select>
                </div>

                {/* Session: Autumn / Spring */}
                <div className="bg-[#16171B] border border-white/10 rounded-2xl p-3 space-y-1">
                  <span className="text-[10px] text-[#8A8A8A] font-mono font-medium block">Session</span>
                  <select
                    value={importSession}
                    onChange={(e) => setImportSession(e.target.value)}
                    className="bg-transparent text-xs text-white font-bold outline-none cursor-pointer w-full"
                  >
                    <option value="Autumn Sem" className="bg-[#111214] text-white">Autumn Sem</option>
                    <option value="Spring Sem" className="bg-[#111214] text-white">Spring Sem</option>
                  </select>
                </div>

                {/* Exam: Mid Sem / End Sem */}
                <div className="bg-[#16171B] border border-white/10 rounded-2xl p-3 space-y-1">
                  <span className="text-[10px] text-[#8A8A8A] font-mono font-medium block">Exam</span>
                  <select
                    value={importExamType}
                    onChange={(e) => setImportExamType(e.target.value)}
                    className="bg-transparent text-xs text-white font-bold outline-none cursor-pointer w-full"
                  >
                    <option value="End Sem" className="bg-[#111214] text-white">End Sem</option>
                    <option value="Mid Sem" className="bg-[#111214] text-white">Mid Sem</option>
                  </select>
                </div>
              </div>

              {/* Redirection Link to Full PYQ Library Page */}
              <div className="pt-2 flex items-center justify-between text-xs text-[#8A8A8A]">
                <span>Want to view all available papers?</span>
                <Link
                  href="/workspace/academic/pyq-library"
                  className="text-[#FF453A] font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Go to Full PYQ Library</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
              <button
                onClick={() => setIsPlatformModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/10 text-xs font-semibold text-[#8A8A8A] hover:text-white transition-all cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleImportFromPlatformPYQ}
                className="px-5 py-2.5 rounded-xl bg-[#FF453A] hover:bg-[#FF453A]/90 text-white text-xs font-bold transition-all shadow-md shadow-[#FF453A]/20 cursor-pointer flex items-center gap-2"
              >
                <Plus size={14} /> Import Selected Paper
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
