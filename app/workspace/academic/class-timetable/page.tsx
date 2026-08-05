'use client'

import { useState } from 'react'
import {
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  Filter,
} from 'lucide-react'

const sampleTimetable = [
  {
    day: 'Monday',
    slots: [
      { time: '09:00 AM - 10:00 AM', subject: 'Operating Systems', code: 'CS-3004', room: 'C-LH-302', faculty: 'Dr. S. Mohanty', type: 'Lecture' },
      { time: '10:00 AM - 11:00 AM', subject: 'Database Management Systems', code: 'CS-3002', room: 'C-LH-302', faculty: 'Prof. A. K. Das', type: 'Lecture' },
      { time: '02:00 PM - 04:00 PM', subject: 'OS Lab (Batch B1)', code: 'CS-3094', room: 'Lab 7 (Campus 15)', faculty: 'Prof. S. Mohanty', type: 'Lab' },
    ],
  },
  {
    day: 'Tuesday',
    slots: [
      { time: '10:00 AM - 11:00 AM', subject: 'Computer Networks', code: 'CS-3006', room: 'C-LH-201', faculty: 'Dr. K. R. Das', type: 'Lecture' },
      { time: '11:00 AM - 12:00 PM', subject: 'Object Oriented Programming', code: 'CS-2004', room: 'C-LH-201', faculty: 'Prof. M. Ray', type: 'Lecture' },
      { time: '01:00 PM - 02:00 PM', subject: 'CN Tutorial', code: 'CS-3096', room: 'C-LH-201', faculty: 'Dr. K. R. Das', type: 'Tutorial' },
    ],
  },
  {
    day: 'Wednesday',
    slots: [
      { time: '09:00 AM - 10:00 AM', subject: 'Operating Systems', code: 'CS-3004', room: 'C-LH-302', faculty: 'Dr. S. Mohanty', type: 'Lecture' },
      { time: '02:00 PM - 04:00 PM', subject: 'DBMS Lab (Batch B1)', code: 'CS-3092', room: 'Lab 3 (Campus 15)', faculty: 'Prof. A. K. Das', type: 'Lab' },
    ],
  },
  {
    day: 'Thursday',
    slots: [
      { time: '10:00 AM - 11:00 AM', subject: 'Database Management Systems', code: 'CS-3002', room: 'C-LH-302', faculty: 'Prof. A. K. Das', type: 'Lecture' },
      { time: '11:00 AM - 12:00 PM', subject: 'Computer Networks', code: 'CS-3006', room: 'C-LH-201', faculty: 'Dr. K. R. Das', type: 'Lecture' },
    ],
  },
  {
    day: 'Friday',
    slots: [
      { time: '09:00 AM - 11:00 AM', subject: 'OOPs Lab (Batch B1)', code: 'CS-2094', room: 'Lab 5 (Campus 15)', faculty: 'Prof. M. Ray', type: 'Lab' },
      { time: '02:00 PM - 03:00 PM', subject: 'Professional Ethics', code: 'HS-3001', room: 'Auditorium 2', faculty: 'Dr. P. Sharma', type: 'Lecture' },
    ],
  },
]

export default function ClassTimetablePage() {
  const [selectedDay, setSelectedDay] = useState('Monday')
  const [selectedSemester, setSelectedSemester] = useState('Semester 6')

  const currentDayData = sampleTimetable.find((t) => t.day === selectedDay) || sampleTimetable[0]

  return (
    <div className="space-y-8 pb-12 w-full text-white">

      {/* Top Header */}
      <div className="bg-[#111214] border border-white/[0.04] rounded-[24px] p-6 lg:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.35)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#FF453A]/10 text-[#FF453A] border border-[#FF453A]/20 text-[10px] font-bold uppercase tracking-wider block w-fit mb-1">
            Weekly Schedule
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-white tracking-tight leading-none">
            Class Timetable
          </h1>
          <p className="text-xs text-[#8A8A8A] font-normal mt-2 leading-relaxed">
            Weekly class schedule, lecture rooms, faculty details, and attendance shortcuts.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Semester Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8A8A8A] font-mono">Semester:</span>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="bg-[#0B0B0D] border border-white/10 text-xs text-white px-3.5 py-2 rounded-xl outline-none cursor-pointer font-bold"
            >
              <option value="Semester 5">Semester 5</option>
              <option value="Semester 6">Semester 6</option>
              <option value="Semester 7">Semester 7</option>
            </select>
          </div>
        </div>
      </div>

      {/* Legend & Day Selector Bar */}
      <div className="bg-[#111214] border border-white/[0.04] rounded-[20px] p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Day Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedDay === day
                  ? 'bg-[#FF453A] text-white shadow-md shadow-[#FF453A]/20'
                  : 'bg-[#0B0B0D] border border-white/10 text-[#8A8A8A] hover:text-white'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[11px] font-mono text-[#8A8A8A] shrink-0 border-t md:border-t-0 border-white/[0.04] pt-2 md:pt-0">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Lecture
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400" /> Lab
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Tutorial
          </span>
        </div>
      </div>

      {/* Schedule Subject Cards Grid */}
      <div className="space-y-4">
        {currentDayData.slots.map((slot, idx) => (
          <div
            key={idx}
            className="bg-[#111214] border border-white/[0.04] rounded-[22px] p-5 lg:p-6 shadow-[0_8px_24px_rgba(0,0,0,0.18)] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-white/15 transition-all"
          >
            <div className="flex items-start md:items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FF453A]/10 border border-[#FF453A]/20 flex flex-col items-center justify-center text-[#FF453A] shrink-0">
                <Clock size={20} />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white font-mono">{slot.time}</span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      slot.type === 'Lab'
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        : slot.type === 'Tutorial'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    {slot.type}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{slot.subject} ({slot.code})</h3>

                <div className="flex items-center gap-4 text-xs text-[#8A8A8A] font-mono flex-wrap">
                  <span className="flex items-center gap-1"><MapPin size={13} className="text-[#FF453A]" /> {slot.room}</span>
                  <span className="flex items-center gap-1"><User size={13} /> {slot.faculty}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/[0.04]">
              <button
                onClick={() => alert(`Marked attendance for ${slot.subject}`)}
                className="bg-[#141518] hover:bg-white/10 border border-white/10 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 size={14} className="text-emerald-400" /> Mark Attendance
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

