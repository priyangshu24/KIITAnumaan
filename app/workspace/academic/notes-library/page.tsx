'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BookOpen,
  Download,
  Upload,
  Bookmark,
  Star,
  Eye,
  Heart,
  FileText,
  Sparkles,
} from 'lucide-react'

const sampleNotes = [
  {
    id: '1',
    title: 'Operating Systems Complete Lecture Notes (Modules 1-5)',
    subject: 'Operating Systems',
    category: 'Lecture Notes',
    year: '2025',
    author: 'Prof. S. Mohanty',
    semester: 'Semester 6',
    branch: 'CSE',
    downloads: 1850,
    rating: 4.9,
    size: '12.4 MB',
    bookmarked: true,
    favorited: true,
  },
  {
    id: '2',
    title: 'DBMS SQL & Normalization Quick Revision Handwritten Notes',
    subject: 'DBMS',
    category: 'Handwritten Summaries',
    year: '2024',
    author: 'Aman Kumar (Topper CSE-04)',
    semester: 'Semester 5',
    branch: 'CSE',
    downloads: 1420,
    rating: 4.8,
    size: '8.1 MB',
    bookmarked: false,
    favorited: false,
  },
  {
    id: '3',
    title: 'Computer Networks Protocol Layer Diagrams & Formulas',
    subject: 'Computer Networks',
    category: 'Formula Sheets',
    year: '2025',
    author: 'Dr. K. R. Das',
    semester: 'Semester 6',
    branch: 'IT',
    downloads: 1290,
    rating: 4.7,
    size: '5.6 MB',
    bookmarked: true,
    favorited: true,
  },
]

export default function NotesLibraryPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Notes')
  const [selectedSemester, setSelectedSemester] = useState('All')
  const [selectedBranch, setSelectedBranch] = useState('All')
  const [selectedSubject, setSelectedSubject] = useState('All')
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)
  const [notesList, setNotesList] = useState(sampleNotes)

  const toggleBookmark = (id: string) => {
    setNotesList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, bookmarked: !item.bookmarked } : item))
    )
  }

  const toggleFavorite = (id: string) => {
    setNotesList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, favorited: !item.favorited } : item))
    )
  }

  const categories = ['All Notes', 'Lecture Notes', 'Handwritten Summaries', 'Formula Sheets']

  const filteredNotes = notesList.filter((item) => {
    const matchesCat = selectedCategory === 'All Notes' || item.category === selectedCategory
    const matchesSem = selectedSemester === 'All' || item.semester === selectedSemester
    const matchesBranch = selectedBranch === 'All' || item.branch === selectedBranch
    const matchesSub = selectedSubject === 'All' || item.subject === selectedSubject
    return matchesCat && matchesSem && matchesBranch && matchesSub
  })

  return (
    <div className="space-y-6 pb-12 w-full text-white">

      {/* Top Banner Header Card (With Full Cover Red KIIT Campus Wireframe Background Image) */}
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
            NOTES LIBRARY
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-white tracking-tight leading-none drop-shadow-md">
            Academic Notes & Resources
          </h1>
          <p className="text-xs text-[#A0A0A0] font-normal mt-2 leading-relaxed drop-shadow">
            Access verified lecture notes, handwritten summaries, and formula sheets across all engineering subjects.
          </p>
        </div>
      </div>

      {/* ----------------------------------------------------
          UNIFIED LIQUID GLASS TOOLBAR & NAVIGATION
      ---------------------------------------------------- */}
      <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-[24px] p-2 lg:px-4 lg:py-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.45)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Category Tabs */}
        <div
          onMouseLeave={() => setHoveredTab(null)}
          className="flex items-center gap-1.5 overflow-x-auto scrollbar-none"
        >
          {categories.map((cat) => {
            const isActive = selectedCategory === cat
            const isHovered = hoveredTab === cat
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                onMouseEnter={() => setHoveredTab(cat)}
                className={`relative px-4 py-2 rounded-xl text-xs font-semibold transition-colors duration-200 flex flex-col items-center justify-center whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? 'text-white font-bold'
                    : 'text-[#8A8A8A] hover:text-white'
                }`}
              >
                {/* Hover Spotlight Pill with Framer Motion Animation */}
                {isHovered && !isActive && (
                  <motion.div
                    layoutId="hoverNotesTabPill"
                    className="absolute inset-0 bg-white/[0.06] backdrop-blur-md rounded-xl z-0 pointer-events-none"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}

                {/* Active Pill Container with Framer Motion Layout Animation */}
                {isActive && (
                  <motion.div
                    layoutId="activeNotesTabPill"
                    className="absolute inset-0 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-[0_4px_20px_rgba(255,69,58,0.15)] z-0 pointer-events-none"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}

                <div className="relative z-10 flex items-center gap-2">
                  <span>{cat}</span>
                </div>

                {/* Centered Red Dash with Framer Motion Layout Animation */}
                {isActive && (
                  <motion.span
                    layoutId="activeNotesTabRedDash"
                    className="relative z-10 w-3.5 h-[2.5px] bg-[#FF453A] rounded-full mt-1 shadow-[0_0_8px_#FF453A] block"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Right Filter Dropdowns (Semester & Subject) */}
        <div className="flex items-center gap-3 overflow-x-auto shrink-0 border-t md:border-t-0 border-white/[0.06] pt-2 md:pt-0">
          <div className="hidden md:block h-5 w-[1px] bg-white/10" />

          {/* Semester Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8A8A8A] font-mono">Semester:</span>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="bg-white/[0.04] backdrop-blur-md border border-white/10 text-xs text-white px-3.5 py-2 rounded-xl outline-none cursor-pointer font-semibold hover:bg-white/[0.08] hover:border-white/20 transition-all focus:border-[#FF453A]/50"
            >
              <option value="All" className="bg-[#111214] text-white">All Semesters</option>
              <option value="Semester 4" className="bg-[#111214] text-white">Semester 4</option>
              <option value="Semester 5" className="bg-[#111214] text-white">Semester 5</option>
              <option value="Semester 6" className="bg-[#111214] text-white">Semester 6</option>
              <option value="Semester 7" className="bg-[#111214] text-white">Semester 7</option>
            </select>
          </div>

          {/* Branch Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8A8A8A] font-mono">Branch:</span>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-white/[0.04] backdrop-blur-md border border-white/10 text-xs text-white px-3.5 py-2 rounded-xl outline-none cursor-pointer font-semibold hover:bg-white/[0.08] hover:border-white/20 transition-all focus:border-[#FF453A]/50"
            >
              <option value="All" className="bg-[#111214] text-white">All Branches</option>
              <option value="CSE" className="bg-[#111214] text-white">CSE</option>
              <option value="IT" className="bg-[#111214] text-white">IT</option>
              <option value="ECE" className="bg-[#111214] text-white">ECE</option>
              <option value="EEE" className="bg-[#111214] text-white">EEE</option>
              <option value="ME" className="bg-[#111214] text-white">Mechanical</option>
              <option value="CE" className="bg-[#111214] text-white">Civil</option>
            </select>
          </div>

          {/* Subject Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8A8A8A] font-mono">Subject:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-white/[0.04] backdrop-blur-md border border-white/10 text-xs text-white px-3.5 py-2 rounded-xl outline-none cursor-pointer font-semibold hover:bg-white/[0.08] hover:border-white/20 transition-all focus:border-[#FF453A]/50"
            >
              <option value="All" className="bg-[#111214] text-white">All Subjects</option>
              <option value="Operating Systems" className="bg-[#111214] text-white">Operating Systems</option>
              <option value="DBMS" className="bg-[#111214] text-white">DBMS</option>
              <option value="Computer Networks" className="bg-[#111214] text-white">Computer Networks</option>
            </select>
          </div>
        </div>
      </div>

      {/* Note Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className="bg-[#111214] border border-white/[0.04] rounded-[24px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.18)] flex flex-col justify-between space-y-5 hover:border-white/15 transition-all group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF453A]/10 border border-[#FF453A]/20 flex items-center justify-center text-[#FF453A] shrink-0">
                <BookOpen size={20} />
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => toggleFavorite(note.id)}
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${
                    note.favorited ? 'text-[#FF453A] bg-[#FF453A]/10' : 'text-[#8A8A8A] hover:text-white hover:bg-white/5'
                  }`}
                  title="Favorite"
                >
                  <Heart size={16} fill={note.favorited ? 'currentColor' : 'none'} />
                </button>

                <button
                  onClick={() => toggleBookmark(note.id)}
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${
                    note.bookmarked ? 'text-[#FF453A] bg-[#FF453A]/10' : 'text-[#8A8A8A] hover:text-white hover:bg-white/5'
                  }`}
                  title="Bookmark"
                >
                  <Bookmark size={16} fill={note.bookmarked ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono text-[#FF453A] uppercase tracking-wider font-bold block">
                {note.subject} • {note.semester} • {note.branch}
              </span>
              <h4 className="text-base font-bold text-white leading-snug mt-1 group-hover:text-[#FF453A] transition-colors">
                {note.title}
              </h4>
              <p className="text-xs text-[#8A8A8A] font-mono mt-1">
                Author: <strong className="text-white">{note.author}</strong> • {note.size}
              </p>
            </div>

            <div className="pt-4 border-t border-white/[0.04] flex items-center justify-between gap-2">
              <span className="text-xs text-[#8A8A8A] flex items-center gap-1 font-mono">
                <Star size={13} className="text-yellow-400 fill-yellow-400" /> {note.rating} ({note.downloads} downloads)
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Opening preview for ${note.title}...`)}
                  className="bg-[#141518] hover:bg-white/10 text-white text-xs font-semibold px-3 py-2 rounded-xl border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye size={14} className="text-[#8A8A8A]" /> Preview
                </button>

                <button
                  onClick={() => alert(`Downloading ${note.title}...`)}
                  className="bg-[#FF453A] hover:bg-[#FF453A]/90 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#FF453A]/20"
                >
                  <Download size={14} /> Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

