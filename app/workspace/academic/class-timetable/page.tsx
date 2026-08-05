'use client'

import { useState } from 'react'
import {
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  Filter,
  Search,
  Hash,
  BookOpen,
  Sparkles,
} from 'lucide-react'

// Schedule Grid Data Types
interface SlotData {
  subject: string
  code: string
  faculty: string
  room: string
  type: 'LEC' | 'LAB' | 'TUT'
  isNow?: boolean
  color: string // accent border color
  stripeColor: string
}

// Full Grid Data Structure (Time Slots x Days)
const gridTimeSlots = [
  { label: '08:00 - 10:00', duration: '(2 HRS)' },
  { label: '10:00 - 12:00', duration: '(2 HRS)' },
  { label: '14:00 - 16:00', duration: '(2 HRS)' },
]

const daysList = ['MON', 'TUE', 'WED', 'THU', 'FRI']
const fullDayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

// Timetable matrix: [timeSlotIndex][dayIndex]
const timetableMatrix: (SlotData | null)[][] = [
  // 08:00 - 10:00
  [
    {
      subject: 'Algorithms',
      code: 'CS-3001',
      faculty: 'Dr. S. Mohanty',
      room: 'LT-3 · Block B',
      type: 'LEC',
      color: '#F59E0B',
      stripeColor: '#F59E0B',
    },
    null, // FREE
    {
      subject: 'Algorithms',
      code: 'CS-3001',
      faculty: 'Dr. S. Mohanty',
      room: 'LT-3 · Block B',
      type: 'LEC',
      color: '#F59E0B',
      stripeColor: '#F59E0B',
    },
    null, // FREE
    {
      subject: 'Networks',
      code: 'CS-3006',
      faculty: 'Prof. R. Panda',
      room: 'LT-7 · Block A',
      type: 'LEC',
      color: '#3B82F6',
      stripeColor: '#3B82F6',
    },
  ],
  // 10:00 - 12:00
  [
    {
      subject: 'Algorithms Lab',
      code: 'CS-3091',
      faculty: 'Dr. S. Mohanty',
      room: 'CL-2 · Block C',
      type: 'LAB',
      isNow: true,
      color: '#F59E0B',
      stripeColor: '#F59E0B',
    },
    {
      subject: 'Operating Systems',
      code: 'CS-3004',
      faculty: 'Prof. A. Nayak',
      room: 'LT-1 · Block A',
      type: 'LEC',
      color: '#10B981',
      stripeColor: '#10B981',
    },
    {
      subject: 'Machine Learning',
      code: 'CS-4001',
      faculty: 'Dr. P. Das',
      room: 'LT-5 · Block C',
      type: 'LEC',
      color: '#A855F7',
      stripeColor: '#A855F7',
    },
    {
      subject: 'Machine Learning',
      code: 'CS-4001',
      faculty: 'Dr. P. Das',
      room: 'LT-5 · Block C',
      type: 'LEC',
      color: '#A855F7',
      stripeColor: '#A855F7',
    },
    null, // FREE
  ],
  // 14:00 - 16:00
  [
    null, // FREE
    {
      subject: 'Networks Lab',
      code: 'CS-3096',
      faculty: 'Prof. R. Panda',
      room: 'CL-5 · Block C',
      type: 'LAB',
      color: '#3B82F6',
      stripeColor: '#3B82F6',
    },
    {
      subject: 'Operating Systems',
      code: 'CS-3004',
      faculty: 'Prof. A. Nayak',
      room: 'LT-1 · Block A',
      type: 'LEC',
      color: '#10B981',
      stripeColor: '#10B981',
    },
    null, // FREE
    {
      subject: 'Elective - HCI',
      code: 'CS-4082',
      faculty: 'Dr. M. Sahoo',
      room: 'LT-9 · Block D',
      type: 'LEC',
      color: '#EC4899',
      stripeColor: '#EC4899',
    },
  ],
]

export default function ClassTimetablePage() {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0) // 0 = Monday
  const [selectedSection, setSelectedSection] = useState('CSE-21')
  const [selectedBranch, setSelectedBranch] = useState('CSE')
  const [selectedSemester, setSelectedSemester] = useState('Semester 6')
  const [rollNumber, setRollNumber] = useState('21052341')

  return (
    <div className="space-y-6 pb-12 w-full text-white">

      {/* ----------------------------------------------------
          TOP BANNER HEADER WITH SECTION & ROLL NO CONTROLS
      ---------------------------------------------------- */}
      <div className="relative overflow-hidden w-full bg-[#0B0B0D] border border-white/10 rounded-[28px] p-6 lg:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.45)] min-h-[160px]">
        {/* Full Cover High-Res KIIT Red Wireframe Image */}
        <img
          src="/kiit-campus-dotted.jpg"
          alt="KIIT Campus Wireframe Background"
          className="absolute inset-0 w-full h-full object-cover object-[75%_center] opacity-90 pointer-events-none z-0 rounded-[28px]"
        />

        {/* Left-to-Right Seamless Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0D] via-[#0B0B0D]/80 to-transparent pointer-events-none z-10 rounded-[28px]" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-20">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-[#FF453A]/20 text-[#FF453A] border border-[#FF453A]/40 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 font-mono shadow-[0_0_15px_rgba(255,69,58,0.2)]">
                <Sparkles size={12} /> CLASS TIMETABLE
              </span>
              <span className="px-3 py-1 rounded-full bg-white/[0.04] text-white/70 border border-white/10 text-[10px] font-bold font-mono">
                {selectedSection} · {selectedBranch}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-white tracking-tight leading-none">
              Class Timetable
            </h1>
            <p className="text-xs text-[#8A8A8A] font-normal mt-2 leading-relaxed max-w-xl">
              Real-time weekly schedule, lecture rooms, faculty details, and section-wise slot allocations for KIIT University.
            </p>
          </div>

          {/* Liquid Glassmorphic Section & Roll No Controls Container */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 bg-white/[0.04] backdrop-blur-2xl p-2.5 sm:p-3 rounded-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
            {/* Roll No Input Box */}
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/15 hover:border-[#FF453A]/50 focus-within:border-[#FF453A] rounded-xl px-3.5 py-2 text-xs transition-all shadow-inner">
              <Hash size={15} className="text-[#FF453A] shrink-0 drop-shadow-[0_0_8px_rgba(255,69,58,0.5)]" />
              <span className="text-xs text-white/70 font-mono font-semibold hidden sm:inline shrink-0">Roll:</span>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="Enter Roll No"
                className="bg-transparent text-white font-mono font-bold text-xs sm:text-sm outline-none w-24 sm:w-28 tracking-wide placeholder:text-white/40"
              />
            </div>

            {/* Select Section Dropdown Box */}
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/15 hover:border-white/30 rounded-xl px-3.5 py-2 text-xs cursor-pointer shadow-inner">
              <span className="text-xs text-white/70 font-mono font-semibold shrink-0">Section:</span>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="bg-transparent text-white font-bold outline-none cursor-pointer text-xs sm:text-sm"
              >
                <option value="CSE-21" className="bg-[#111214] text-white">CSE-21</option>
                <option value="CSE-22" className="bg-[#111214] text-white">CSE-22</option>
                <option value="CSE-23" className="bg-[#111214] text-white">CSE-23</option>
                <option value="CSSE-01" className="bg-[#111214] text-white">CSSE-01</option>
                <option value="IT-02" className="bg-[#111214] text-white">IT-02</option>
                <option value="ECE-05" className="bg-[#111214] text-white">ECE-05</option>
              </select>
            </div>

            {/* Select Semester Dropdown Box */}
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/15 hover:border-white/30 rounded-xl px-3.5 py-2 text-xs cursor-pointer shadow-inner">
              <span className="text-xs text-white/70 font-mono font-semibold shrink-0">Sem:</span>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="bg-transparent text-white font-bold outline-none cursor-pointer text-xs sm:text-sm"
              >
                <option value="Semester 5" className="bg-[#111214] text-white">Sem 5</option>
                <option value="Semester 6" className="bg-[#111214] text-white">Sem 6</option>
                <option value="Semester 7" className="bg-[#111214] text-white">Sem 7</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------
          MAIN TIMETABLE CONTAINER (MATCHING MOCKUP DESIGN)
      ---------------------------------------------------- */}
      <div className="bg-[#0B0B0E] border border-white/10 rounded-[28px] p-5 sm:p-7 shadow-[0_16px_50px_rgba(0,0,0,0.5)] space-y-6">

        {/* TOP DAY SELECTOR BAR & CLASS TYPE LEGEND */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Day Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {fullDayNames.map((dayName, idx) => {
              const isSelected = selectedDayIndex === idx
              return (
                <button
                  key={dayName}
                  onClick={() => setSelectedDayIndex(idx)}
                  className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#FF453A] text-white font-bold shadow-[0_0_20px_rgba(255,69,58,0.4)] scale-[1.02]'
                      : 'bg-[#141418]/80 border border-white/10 text-[#8A8A8A] hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  {dayName}
                </button>
              )
            })}
          </div>

          {/* Top Right Type Legend */}
          <div className="flex items-center gap-5 text-xs font-medium text-[#8A8A8A] shrink-0 self-end sm:self-auto">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.6)]" /> Lecture
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#A855F7] shadow-[0_0_8px_rgba(168,85,247,0.6)]" /> Lab
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B] shadow-[0_0_8px_rgba(245,158,11,0.6)]" /> Tutorial
            </span>
          </div>
        </div>

        {/* TIMETABLE GRID TABLE */}
        <div className="overflow-x-auto">
          <div className="min-w-[900px] space-y-3">

            {/* DAY HEADER COLUMNS */}
            <div className="grid grid-cols-[140px_1fr_1fr_1fr_1fr_1fr] gap-3 text-center">
              {/* Empty Top-Left Corner */}
              <div />
              {daysList.map((day, idx) => (
                <div
                  key={day}
                  className={`py-2 rounded-2xl border text-xs font-mono font-bold uppercase tracking-wider transition-colors ${
                    selectedDayIndex === idx
                      ? 'bg-[#1A1012] border-[#FF453A]/40 text-[#FF453A]'
                      : 'bg-[#141418]/60 border-white/[0.06] text-[#8A8A8A]'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* TIME ROWS */}
            {gridTimeSlots.map((timeSlot, timeIdx) => (
              <div key={timeIdx} className="grid grid-cols-[140px_1fr_1fr_1fr_1fr_1fr] gap-3 items-stretch">
                
                {/* Time Label Column */}
                <div className="bg-[#141418]/80 border border-white/[0.06] rounded-2xl p-4 flex flex-col justify-center items-center text-center">
                  <span className="text-xs font-mono font-bold text-white tracking-tight">{timeSlot.label}</span>
                  <span className="text-[10px] font-mono text-[#71717A] mt-0.5">{timeSlot.duration}</span>
                </div>

                {/* 5 Day Cells for this Time Slot */}
                {daysList.map((_, dayIdx) => {
                  const card = timetableMatrix[timeIdx][dayIdx]
                  const isDayHighlighted = selectedDayIndex === dayIdx

                  if (!card) {
                    return (
                      <div
                        key={dayIdx}
                        className={`border rounded-2xl p-4 flex items-center justify-center transition-all ${
                          isDayHighlighted
                            ? 'bg-[#141418]/40 border-white/10'
                            : 'bg-[#111115]/30 border-white/[0.04]'
                        }`}
                      >
                        <span className="text-[11px] font-mono font-bold text-[#3F3F46] tracking-widest uppercase">
                          FREE
                        </span>
                      </div>
                    )
                  }

                  return (
                    <div
                      key={dayIdx}
                      style={{ borderColor: card.isNow ? '#F59E0B' : 'rgba(255,255,255,0.08)' }}
                      className={`relative border rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 group hover:border-white/30 ${
                        card.isNow
                          ? 'bg-[#1C1812] shadow-[0_0_25px_rgba(245,158,11,0.15)] border-[#F59E0B]'
                          : isDayHighlighted
                          ? 'bg-[#18181D] border-white/15'
                          : 'bg-[#141418] border-white/[0.08]'
                      }`}
                    >
                      {/* Left Accent Color Line */}
                      <div
                        style={{ backgroundColor: card.stripeColor }}
                        className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full"
                      />

                      {/* Card Header: Subject Name & Type Badge */}
                      <div className="flex items-start justify-between gap-1 pl-1">
                        <span className="text-xs font-bold text-white tracking-tight group-hover:text-[#FF453A] transition-colors leading-snug">
                          {card.subject}
                        </span>
                        <span
                          className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider shrink-0 ${
                            card.type === 'LAB'
                              ? 'bg-[#A855F7]/10 border-[#A855F7]/30 text-[#A855F7]'
                              : card.type === 'TUT'
                              ? 'bg-[#F59E0B]/10 border-[#F59E0B]/30 text-[#F59E0B]'
                              : 'bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]'
                          }`}
                        >
                          {card.type}
                        </span>
                      </div>

                      {/* Card Body: Faculty & Room */}
                      <div className="mt-3 space-y-1 pl-1">
                        <div className="text-[11px] text-[#A1A1AA] truncate font-medium">
                          {card.faculty}
                        </div>
                        <div className="text-[10px] text-[#71717A] font-mono truncate">
                          {card.room}
                        </div>
                      </div>

                      {/* Optional NOW Indicator Badge */}
                      {card.isNow && (
                        <div className="mt-2 pl-1 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-ping" />
                          <span className="text-[9px] font-bold font-mono uppercase tracking-wider text-[#F59E0B]">
                            NOW
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM SUBJECT LEGEND CAPSULE & SUMMARY STATS BAR */}
        <div className="pt-2 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-t border-white/[0.06]">
          
          {/* Subject Color Legend Pills */}
          <div className="flex flex-wrap items-center gap-3 bg-[#141418] border border-white/10 rounded-full px-5 py-2.5">
            <span className="flex items-center gap-2 text-[10px] font-mono font-bold text-[#A1A1AA] tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B]" /> ALGORITHMS
            </span>
            <span className="flex items-center gap-2 text-[10px] font-mono font-bold text-[#A1A1AA] tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#3B82F6]" /> NETWORKS
            </span>
            <span className="flex items-center gap-2 text-[10px] font-mono font-bold text-[#A1A1AA] tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" /> OPERATING SYSTEMS
            </span>
            <span className="flex items-center gap-2 text-[10px] font-mono font-bold text-[#A1A1AA] tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#A855F7]" /> MACHINE LEARNING
            </span>
            <span className="flex items-center gap-2 text-[10px] font-mono font-bold text-[#A1A1AA] tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#EC4899]" /> ELECTIVE
            </span>
          </div>

          {/* Right Summary Stats */}
          <div className="flex items-center gap-2 text-xs font-mono text-[#8A8A8A] self-end lg:self-auto">
            <Clock size={14} className="text-[#FF453A]" />
            <span className="font-bold text-white">11 CONTACT HOURS</span>
            <span>·</span>
            <span>2 LABS</span>
            <span>·</span>
            <span>4 FREE SLOTS</span>
          </div>

        </div>

      </div>

    </div>
  )
}


