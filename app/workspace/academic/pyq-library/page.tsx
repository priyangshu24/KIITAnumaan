'use client'

import { useState } from 'react'
import {
  Search,
  Download,
  Upload,
  Plus,
  Filter,
  Bookmark,
  FileText,
  Grid,
  List,
  CheckCircle2,
  Calendar,
  Eye,
  Star,
} from 'lucide-react'

const samplePYQs = [
  {
    id: '1',
    title: 'Operating Systems End-Sem 2024',
    subject: 'Operating Systems',
    code: 'CS-3004',
    year: '2024',
    semester: 'Semester 6',
    examType: 'End Sem',
    downloads: 1420,
    rating: 4.9,
    size: '3.4 MB',
    bookmarked: true,
  },
  {
    id: '2',
    title: 'Database Management Systems Mid-Sem 2023',
    subject: 'DBMS',
    code: 'CS-3002',
    year: '2023',
    semester: 'Semester 5',
    examType: 'Mid Sem',
    downloads: 980,
    rating: 4.8,
    size: '2.1 MB',
    bookmarked: false,
  },
  {
    id: '3',
    title: 'Computer Networks End-Sem 2023',
    subject: 'Computer Networks',
    code: 'CS-3006',
    year: '2023',
    semester: 'Semester 6',
    examType: 'End Sem',
    downloads: 1150,
    rating: 4.7,
    size: '4.2 MB',
    bookmarked: true,
  },
  {
    id: '4',
    title: 'Object Oriented Programming Mid-Sem 2024',
    subject: 'OOPs (Java)',
    code: 'CS-2004',
    year: '2024',
    semester: 'Semester 4',
    examType: 'Mid Sem',
    downloads: 850,
    rating: 4.6,
    size: '1.9 MB',
    bookmarked: false,
  },
]

export default function PYQLibraryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedYear, setSelectedYear] = useState('All')
  const [selectedSemester, setSelectedSemester] = useState('All')
  const [selectedExamType, setSelectedExamType] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [pyqList, setPyqList] = useState(samplePYQs)

  const toggleBookmark = (id: string) => {
    setPyqList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, bookmarked: !item.bookmarked } : item))
    )
  }

  const filteredPYQs = pyqList.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesYear = selectedYear === 'All' || item.year === selectedYear
    const matchesSem = selectedSemester === 'All' || item.semester === selectedSemester
    const matchesExam = selectedExamType === 'All' || item.examType === selectedExamType
    return matchesSearch && matchesYear && matchesSem && matchesExam
  })

  return (
    <div className="space-y-8 pb-12 w-full text-white">

        
        {/* Top Banner Header Card (With Perfectly Blended Red KIIT Wireframe Background Image) */}
        <div className="relative overflow-hidden w-full bg-[#0B0B0D] border border-white/[0.08] rounded-[24px] p-6 lg:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.45)] min-h-[160px] flex items-center">
          {/* Full Cover High-Res KIIT Red Wireframe Image */}
          <img
            src="/kiit-campus-dotted.jpg"
            alt="KIIT Campus Wireframe Background"
            className="absolute inset-0 w-full h-full object-cover object-[75%_center] opacity-90 pointer-events-none z-0 rounded-[24px]"
          />

          {/* Left-to-Right Seamless Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0D] via-[#0B0B0D]/75 to-transparent pointer-events-none z-10 rounded-[24px]" />

          <div className="relative z-20 space-y-1.5 max-w-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF453A] font-mono block drop-shadow">
              PYQ LIBRARY
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-white tracking-tight leading-none drop-shadow-md">
              Previous Year Question Library
            </h1>
            <p className="text-xs text-[#A0A0A0] font-normal mt-2 leading-relaxed drop-shadow">
              Browse, upload, and download authentic previous year examination papers across all semesters.
            </p>
          </div>
        </div>

        {/* ----------------------------------------------------
            FILTER & ACTION TOOLBAR (PIXEL-PERFECT REFERENCE MATCH)
        ---------------------------------------------------- */}
        <div className="bg-[#111214] border border-white/[0.06] rounded-[24px] p-3.5 lg:px-5 lg:py-3.5 shadow-lg flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* 5 Compact Filter Boxes Aligned Left */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Year Selector */}
            <div className="bg-[#16171B] border border-white/[0.08] rounded-xl px-3.5 py-1.5 min-w-[125px] sm:min-w-[135px] flex flex-col relative justify-center">
              <span className="text-[10px] text-[#8A8A8A] font-mono font-medium block leading-tight">Year</span>
              <div className="flex items-center justify-between gap-1.5 mt-0.5">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="bg-transparent text-xs text-white outline-none cursor-pointer font-bold appearance-none w-full pr-4"
                >
                  <option value="All" className="bg-[#111214] text-white">All Years</option>
                  <option value="2025" className="bg-[#111214] text-white">2025</option>
                  <option value="2024" className="bg-[#111214] text-white">2024</option>
                  <option value="2023" className="bg-[#111214] text-white">2023</option>
                </select>
                <svg className="w-3.5 h-3.5 text-[#8A8A8A] absolute right-3 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Semester Selector */}
            <div className="bg-[#16171B] border border-white/[0.08] rounded-xl px-3.5 py-1.5 min-w-[125px] sm:min-w-[145px] flex flex-col relative justify-center">
              <span className="text-[10px] text-[#8A8A8A] font-mono font-medium block leading-tight">Semester</span>
              <div className="flex items-center justify-between gap-1.5 mt-0.5">
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="bg-transparent text-xs text-white outline-none cursor-pointer font-bold appearance-none w-full pr-4"
                >
                  <option value="All" className="bg-[#111214] text-white">All Semesters</option>
                  <option value="Semester 4" className="bg-[#111214] text-white">Semester 4</option>
                  <option value="Semester 5" className="bg-[#111214] text-white">Semester 5</option>
                  <option value="Semester 6" className="bg-[#111214] text-white">Semester 6</option>
                </select>
                <svg className="w-3.5 h-3.5 text-[#8A8A8A] absolute right-3 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Branch Selector */}
            <div className="bg-[#16171B] border border-white/[0.08] rounded-xl px-3.5 py-1.5 min-w-[110px] sm:min-w-[125px] flex flex-col relative justify-center">
              <span className="text-[10px] text-[#8A8A8A] font-mono font-medium block leading-tight">Branch</span>
              <div className="flex items-center justify-between gap-1.5 mt-0.5">
                <select
                  defaultValue="CSE"
                  className="bg-transparent text-xs text-white outline-none cursor-pointer font-bold appearance-none w-full pr-4"
                >
                  <option value="CSE" className="bg-[#111214] text-white">CSE</option>
                  <option value="IT" className="bg-[#111214] text-white">IT</option>
                  <option value="CSSE" className="bg-[#111214] text-white">CSSE</option>
                  <option value="ECE" className="bg-[#111214] text-white">ECE</option>
                </select>
                <svg className="w-3.5 h-3.5 text-[#8A8A8A] absolute right-3 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Subject Selector */}
            <div className="bg-[#16171B] border border-white/[0.08] rounded-xl px-3.5 py-1.5 min-w-[125px] sm:min-w-[145px] flex flex-col relative justify-center">
              <span className="text-[10px] text-[#8A8A8A] font-mono font-medium block leading-tight">Subject</span>
              <div className="flex items-center justify-between gap-1.5 mt-0.5">
                <select
                  className="bg-transparent text-xs text-white outline-none cursor-pointer font-bold appearance-none w-full pr-4"
                >
                  <option value="All" className="bg-[#111214] text-white">All Subjects</option>
                  <option value="OS" className="bg-[#111214] text-white">Operating Systems</option>
                  <option value="DBMS" className="bg-[#111214] text-white">DBMS</option>
                </select>
                <svg className="w-3.5 h-3.5 text-[#8A8A8A] absolute right-3 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Exam Type Selector */}
            <div className="bg-[#16171B] border border-white/[0.08] rounded-xl px-3.5 py-1.5 min-w-[125px] sm:min-w-[145px] flex flex-col relative justify-center">
              <span className="text-[10px] text-[#8A8A8A] font-mono font-medium block leading-tight">Exam Type</span>
              <div className="flex items-center justify-between gap-1.5 mt-0.5">
                <select
                  value={selectedExamType}
                  onChange={(e) => setSelectedExamType(e.target.value)}
                  className="bg-transparent text-xs text-white outline-none cursor-pointer font-bold appearance-none w-full pr-4"
                >
                  <option value="All" className="bg-[#111214] text-white">All Exam Types</option>
                  <option value="Mid Sem" className="bg-[#111214] text-white">Mid semester</option>
                  <option value="End Sem" className="bg-[#111214] text-white">End semester</option>
                </select>
                <svg className="w-3.5 h-3.5 text-[#8A8A8A] absolute right-3 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Action Buttons (Upload Paper & Add Folder) Aligned Right */}
          <div className="flex items-center gap-3 shrink-0 justify-end pt-2 lg:pt-0">
            <button
              onClick={() => alert('Opening Upload Paper Modal...')}
              className="px-4 py-2.5 rounded-xl bg-[#1A1C20] border border-white/10 text-white hover:bg-white/10 transition-all text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Upload size={14} className="text-white" />
              <span>Upload Paper</span>
            </button>

            <button
              onClick={() => alert('Opening Add Folder Dialog...')}
              className="px-5 py-2.5 rounded-xl bg-[#E53935] hover:bg-[#D32F2F] text-white transition-all text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-[#E53935]/20"
            >
              <Plus size={16} />
              <span>Add Folder</span>
            </button>
          </div>
        </div>

        {/* ----------------------------------------------------
            PAPERS LIST SECTION (EXACT REFERENCE DESIGN)
        ---------------------------------------------------- */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold font-mono text-[#8A8A8A] uppercase tracking-wider">
              PAPERS (248)
            </span>
          </div>

          <div className="space-y-3">
            {[
              { title: 'CS2001 - End semester - Autumn 2025', meta: '3 hours • 60 marks • 31 questions • Verified' },
              { title: 'CS2001 - Mid semester - Autumn 2025', meta: '90 minutes • 30 marks • 14 questions • Verified' },
              { title: 'CS2001 - End semester - Autumn 2024', meta: '3 hours • 60 marks • 32 questions • Verified' },
            ].map((paper, idx) => (
              <div
                key={idx}
                className="bg-[#111214] border border-white/[0.04] rounded-[22px] p-4 lg:px-5 lg:py-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/15 transition-all group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-[#FF453A]/10 border border-[#FF453A]/20 flex items-center justify-center text-[#FF453A] shrink-0">
                    <FileText size={18} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm sm:text-base font-bold text-white leading-snug group-hover:text-[#FF453A] transition-colors truncate">
                      {paper.title}
                    </h4>
                    <p className="text-xs text-[#8A8A8A] font-mono mt-0.5">
                      {paper.meta}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => alert(`Opening preview for ${paper.title}...`)}
                    className="px-4 py-2 rounded-xl bg-[#1A1C20] border border-white/10 text-white text-xs font-medium hover:bg-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye size={14} className="text-[#8A8A8A]" />
                    <span>Preview</span>
                  </button>

                  <button
                    onClick={() => alert(`Downloading ${paper.title}...`)}
                    className="px-4 py-2 rounded-xl bg-[#D99B26] hover:bg-[#D99B26]/90 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#D99B26]/20"
                  >
                    <Download size={14} />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

    </div>
  )
}
