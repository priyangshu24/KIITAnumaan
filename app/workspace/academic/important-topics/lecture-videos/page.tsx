'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Video, ArrowLeft, Search, Filter, ExternalLink, Clock, GraduationCap } from 'lucide-react'
import Link from 'next/link'

interface LectureVideo {
  id: string
  title: string
  channel: string
  duration: string
  subject: string
  branch: string
  semester: string
  year: string
  topic: string
  youtubeUrl: string
  views: string
}

const sampleVideos: LectureVideo[] = [
  {
    id: '1',
    title: "Banker's Algorithm Masterclass & Problem Solving",
    channel: 'Gate Smashers',
    duration: '18:45',
    subject: 'Operating Systems',
    branch: 'CSE / IT',
    semester: 'Semester 6',
    year: '2025',
    topic: 'Deadlocks',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Bankers+Algorithm+Gate+Smashers',
    views: '240K views',
  },
  {
    id: '2',
    title: 'LRU & Optimal Page Replacement Numerical Examples',
    channel: 'Neso Academy',
    duration: '24:10',
    subject: 'Operating Systems',
    branch: 'CSE / IT',
    semester: 'Semester 6',
    year: '2025',
    topic: 'Virtual Memory',
    youtubeUrl: 'https://www.youtube.com/results?search_query=LRU+Optimal+Page+Replacement+Operating+System',
    views: '180K views',
  },
  {
    id: '3',
    title: 'Semaphores & Producer Consumer Problem Explained',
    channel: 'Knowledge Gate',
    duration: '15:30',
    subject: 'Operating Systems',
    branch: 'CSE / IT',
    semester: 'Semester 6',
    year: '2025',
    topic: 'Synchronization',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Semaphores+Producer+Consumer+Gate+Smashers',
    views: '310K views',
  },
  {
    id: '4',
    title: 'SQL BCNF & 3NF Normalization Step-by-Step',
    channel: 'Gate Smashers',
    duration: '21:15',
    subject: 'DBMS',
    branch: 'CSE / IT / CSSE',
    semester: 'Semester 5',
    year: '2024',
    topic: 'Normalization',
    youtubeUrl: 'https://www.youtube.com/results?search_query=SQL+Normalization+3NF+BCNF+Gate+Smashers',
    views: '420K views',
  },
  {
    id: '5',
    title: 'TCP/IP Model vs OSI Model 7 Layers Deep Dive',
    channel: 'Neso Academy',
    duration: '28:50',
    subject: 'Computer Networks',
    branch: 'CSE / ECE / IT',
    semester: 'Semester 6',
    year: '2025',
    topic: 'Protocol Layers',
    youtubeUrl: 'https://www.youtube.com/results?search_query=OSI+TCP+IP+Model+Neso+Academy',
    views: '510K views',
  },
  {
    id: '6',
    title: 'CPU Scheduling Algorithms (FCFS, SJF, Round Robin)',
    channel: 'Gate Smashers',
    duration: '32:00',
    subject: 'Operating Systems',
    branch: 'CSE / IT',
    semester: 'Semester 6',
    year: '2025',
    topic: 'CPU Scheduling',
    youtubeUrl: 'https://www.youtube.com/results?search_query=CPU+Scheduling+Algorithms+Gate+Smashers',
    views: '650K views',
  },
]

export default function LectureVideosPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('All')
  const [selectedBranch, setSelectedBranch] = useState('All')
  const [selectedYear, setSelectedYear] = useState('All')
  const [selectedTopic, setSelectedTopic] = useState('All')

  const subjects = ['All', 'Operating Systems', 'DBMS', 'Computer Networks']
  const branches = ['All', 'CSE / IT', 'CSE / IT / CSSE', 'CSE / ECE / IT']
  const years = ['All', '2025', '2024', '2023']
  const topics = ['All', 'Deadlocks', 'Virtual Memory', 'Synchronization', 'Normalization', 'Protocol Layers', 'CPU Scheduling']

  const filteredVideos = sampleVideos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.subject.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSubject = selectedSubject === 'All' || video.subject === selectedSubject
    const matchesBranch = selectedBranch === 'All' || video.branch.includes(selectedBranch)
    const matchesYear = selectedYear === 'All' || video.year === selectedYear
    const matchesTopic = selectedTopic === 'All' || video.topic === selectedTopic

    return matchesSearch && matchesSubject && matchesBranch && matchesYear && matchesTopic
  })

  return (
    <div className="space-y-6 pb-12 w-full text-white">

      {/* ----------------------------------------------------
          LIQUID GLASS FILTER TOOLBAR WITH TOP BACK LINK
      ---------------------------------------------------- */}
      <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-[24px] p-4 lg:p-5 shadow-[0_16px_40px_rgba(0,0,0,0.45)] space-y-4">
        
        {/* Top Header Row with Back Link & Integrated Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Link
            href="/workspace/academic/important-topics"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] backdrop-blur-md border border-white/10 text-xs font-semibold text-[#8A8A8A] hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer shrink-0 w-fit"
          >
            <ArrowLeft size={16} />
            <span>Back to Important Topics</span>
          </Link>

          {/* Integrated Search Input on the Right */}
          <div className="relative w-full sm:w-72 md:w-96">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8A8A]" />
            <input
              type="text"
              placeholder="Search topics or videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              className="w-full bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder-[#8A8A8A] outline-none focus:border-[#FF453A]/50 transition-all font-semibold"
            />
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-none flex-wrap pt-1 border-t border-white/[0.06]">
          <div className="flex items-center gap-1.5 text-xs text-[#8A8A8A] font-mono shrink-0">
            <Filter size={14} />
            <span>Filter By:</span>
          </div>

          {/* Subject Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#8A8A8A] font-mono">Subject:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-white/[0.04] backdrop-blur-md border border-white/10 text-xs text-white px-3.5 py-2 rounded-xl outline-none cursor-pointer font-semibold hover:bg-white/[0.08] transition-all focus:border-[#FF453A]/50"
            >
              {subjects.map((sub) => (
                <option key={sub} value={sub} className="bg-[#111214] text-white">
                  {sub === 'All' ? 'All Subjects' : sub}
                </option>
              ))}
            </select>
          </div>

          {/* Branch Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#8A8A8A] font-mono">Branch:</span>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-white/[0.04] backdrop-blur-md border border-white/10 text-xs text-white px-3.5 py-2 rounded-xl outline-none cursor-pointer font-semibold hover:bg-white/[0.08] transition-all focus:border-[#FF453A]/50"
            >
              {branches.map((b) => (
                <option key={b} value={b} className="bg-[#111214] text-white">
                  {b === 'All' ? 'All Branches' : b}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#8A8A8A] font-mono">Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-white/[0.04] backdrop-blur-md border border-white/10 text-xs text-white px-3.5 py-2 rounded-xl outline-none cursor-pointer font-semibold hover:bg-white/[0.08] transition-all focus:border-[#FF453A]/50"
            >
              {years.map((y) => (
                <option key={y} value={y} className="bg-[#111214] text-white">
                  {y === 'All' ? 'All Years' : y}
                </option>
              ))}
            </select>
          </div>

          {/* Topic Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#8A8A8A] font-mono">Topic:</span>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="bg-white/[0.04] backdrop-blur-md border border-white/10 text-xs text-white px-3.5 py-2 rounded-xl outline-none cursor-pointer font-semibold hover:bg-white/[0.08] transition-all focus:border-[#FF453A]/50"
            >
              {topics.map((t) => (
                <option key={t} value={t} className="bg-[#111214] text-white">
                  {t === 'All' ? 'All Topics' : t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------
          RECTANGLE LIQUID GLASS LECTURE VIDEO CARDS GRID
      ---------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-[24px] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.45)] flex flex-col justify-between group hover:border-white/20 transition-all duration-300 space-y-4"
          >
            {/* Header Badges */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[10px] font-bold font-mono px-2.5 py-1 rounded-full bg-[#FF453A]/10 text-[#FF453A] border border-[#FF453A]/20 uppercase">
                {video.subject}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[#8A8A8A]">
                  {video.topic}
                </span>
                <span className="text-[10px] font-mono font-bold bg-white/[0.05] border border-white/10 px-2 py-1 rounded-md text-white flex items-center gap-1">
                  <Clock size={12} />
                  <span>{video.duration}</span>
                </span>
              </div>
            </div>

            {/* Video Title & Details */}
            <div className="space-y-2 flex-1">
              <h3 className="text-base font-bold text-white leading-snug group-hover:text-[#FF453A] transition-colors">
                {video.title}
              </h3>
              <div className="flex items-center justify-between text-xs text-[#8A8A8A] font-mono pt-1">
                <span>{video.channel}</span>
                <span>{video.views}</span>
              </div>
            </div>

            {/* Rectangle Button Redirection */}
            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-[11px] text-[#8A8A8A] font-mono">
                <GraduationCap size={14} className="text-[#FF453A]" />
                <span>{video.branch}</span>
              </div>

              <a
                href={video.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#FF453A] text-white hover:bg-red-600 transition-all text-xs font-bold font-mono flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(255,69,58,0.3)] cursor-pointer"
              >
                <Play size={14} className="fill-current" />
                <span>Watch on YouTube</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-[24px] p-12 text-center space-y-3">
          <p className="text-base font-bold text-white">No lecture videos found matching your search filters.</p>
          <p className="text-xs text-[#8A8A8A]">Try selecting 'All' for Subject, Branch, Year, or Topic.</p>
        </div>
      )}

    </div>
  )
}
