'use client'

import { useState } from 'react'
import {
  Search,
  Star,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  BookOpen
} from 'lucide-react'

// Faculty Members
const facultyList = [
  {
    id: 'f-5',
    name: 'Dr. Suresh Senapati',
    designation: 'Head of Department (HOD)',
    department: 'School of Computer Engineering',
    branch: 'CSE',
    specialization: 'Software Engineering & Architecture',
    cabin: 'Campus 15, Block A, Room 501',
    officeHours: 'Mon, Wed, Fri: 10:00 AM - 12:00 PM',
    email: 'hod.cs@kiit.ac.in',
    subjects: ['CS-3005 Software Engineering', 'CS-4005 System Design'],
    rating: 4.9,
    reviewsCount: 120,
    availability: 'Available in Cabin',
  },
  {
    id: 'f-1',
    name: 'Dr. Ananya Mishra',
    designation: 'Associate Professor',
    department: 'School of Computer Engineering',
    branch: 'CSE',
    specialization: 'Artificial Intelligence & Machine Learning',
    cabin: 'Campus 15, Block B, Room 304-B',
    officeHours: 'Mon & Wed: 03:00 - 05:00 PM',
    email: 'ananya.mishra@kiit.ac.in',
    subjects: ['CS-4001 Machine Learning', 'CS-2001 Data Structures'],
    rating: 4.8,
    reviewsCount: 42,
    availability: 'Available in Cabin',
  },
  {
    id: 'f-2',
    name: 'Prof. R. N. Dash',
    designation: 'Professor & Dean Academic',
    department: 'School of Computer Engineering',
    branch: 'IT',
    specialization: 'Operating Systems & Distributed Systems',
    cabin: 'Campus 15, Block A, Room 412',
    officeHours: 'Tue & Thu: 02:00 - 04:00 PM',
    email: 'rn.dash@kiit.ac.in',
    subjects: ['CS-3004 Operating Systems', 'CS-3094 OS Lab'],
    rating: 4.9,
    reviewsCount: 88,
    availability: 'In Lecture',
  },
  {
    id: 'f-3',
    name: 'Dr. A. K. Mohapatra',
    designation: 'Associate Professor',
    department: 'School of Computer Engineering',
    branch: 'CSE',
    specialization: 'Database Systems & Data Mining',
    cabin: 'Campus 15, Block B, Room 210',
    officeHours: 'Fri: 11:00 AM - 01:00 PM',
    email: 'ak.mohapatra@kiit.ac.in',
    subjects: ['CS-3002 Database Management Systems'],
    rating: 4.7,
    reviewsCount: 35,
    availability: 'Available in Cabin',
  },
  {
    id: 'f-4',
    name: 'Dr. P. K. Pattnaik',
    designation: 'Professor',
    department: 'School of Computer Engineering',
    branch: 'IT',
    specialization: 'Computer Networks & Cloud Computing',
    cabin: 'Campus 15, Block C, Room 105',
    officeHours: 'Mon to Fri: 04:00 - 05:00 PM',
    email: 'pk.pattnaik@kiit.ac.in',
    subjects: ['CS-3006 Computer Networks'],
    rating: 4.6,
    reviewsCount: 56,
    availability: 'Out of Office',
  },
  {
    id: 'f-6',
    name: 'Dr. Bijayalaxmi Panda',
    designation: 'Professor & Dean, Student Affairs',
    department: 'School of Electronics Engineering',
    branch: 'ECE',
    specialization: 'VLSI Design & Embedded Systems',
    cabin: 'Campus 3, Block A, Room 218',
    officeHours: 'Tue & Fri: 11:00 AM - 01:00 PM',
    email: 'b.panda@kiit.ac.in',
    subjects: ['EC-3003 VLSI Design', 'EC-3007 Embedded Systems'],
    rating: 4.8,
    reviewsCount: 64,
    availability: 'Available in Cabin',
  },
  {
    id: 'f-7',
    name: 'Dr. Manoj Kumar Rath',
    designation: 'Assistant Professor',
    department: 'School of Mechanical Engineering',
    branch: 'ME',
    specialization: 'Thermodynamics & Fluid Mechanics',
    cabin: 'Campus 3, Block B, Room 112',
    officeHours: 'Mon & Thu: 01:00 - 03:00 PM',
    email: 'mk.rath@kiit.ac.in',
    subjects: ['ME-3001 Thermodynamics', 'ME-3009 Fluid Mechanics'],
    rating: 4.5,
    reviewsCount: 29,
    availability: 'In Lecture',
  },
]

export default function FacultyWorkspacePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [branchFilter, setBranchFilter] = useState('All')

  const filteredFaculty = facultyList.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.subjects.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesBranch = branchFilter === 'All' || f.branch === branchFilter
    return matchesSearch && matchesBranch
  })

  return (
    <div className="space-y-6 pb-12 w-full text-white">

      {/* ----------------------------------------------------
          TOP BANNER HEADER CARD (With Full Cover Red KIIT Campus Wireframe Background Image)
      ---------------------------------------------------- */}
      <div className="relative overflow-hidden w-full bg-[#0B0B0D] border border-white/[0.08] rounded-[24px] p-6 lg:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.45)] min-h-[160px] flex items-center">
        <img
          src="/kiit-campus-dotted.jpg"
          alt="KIIT Campus Wireframe Background"
          className="absolute inset-0 w-full h-full object-cover object-[75%_center] opacity-90 pointer-events-none z-0 rounded-[24px]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0D] via-[#0B0B0D]/75 to-transparent pointer-events-none z-10 rounded-[24px]" />

        <div className="relative z-20 space-y-1.5 max-w-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF453A] font-mono block drop-shadow">
            FACULTY & REGISTRY
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-white tracking-tight leading-none drop-shadow-md">
            Faculty Directory
          </h1>
          <p className="text-xs text-[#A0A0A0] font-normal mt-2 leading-relaxed drop-shadow">
            Find contact details, cabin locations, office hours, and student ratings for every KIIT faculty member.
          </p>
        </div>
      </div>

      <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#141414] border border-[rgba(255,255,255,0.08)] p-4 rounded-xl">
            <div className="relative w-full sm:w-80">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search teacher by name or subject..."
                className="w-full bg-[#101010] border border-[rgba(255,255,255,0.08)] text-xs text-white pl-9 pr-3 py-2 rounded-lg outline-none font-medium focus:border-[#FF3B30]"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-xs text-[#6B7280] font-bold uppercase">Branch:</span>
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="bg-[#101010] border border-[rgba(255,255,255,0.08)] text-xs text-white p-2 rounded-lg outline-none font-medium"
              >
                <option value="All">All Branches</option>
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="ME">Mechanical</option>
                <option value="CE">Civil</option>
              </select>
            </div>
          </div>

          {/* Directory Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFaculty.map((teacher) => (
              <div key={teacher.id} className="saas-card p-4 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[#FF3B30]/15 border border-[#FF3B30]/30 flex items-center justify-center font-bold text-[#FF3B30] text-xs shrink-0">
                    {teacher.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-tight">{teacher.name}</h3>
                    <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                      <p className="text-[11px] text-[#FF3B30] font-semibold">{teacher.designation}</p>
                      {(teacher.designation.includes('Dean') || teacher.designation.includes('HOD')) && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[8px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <ShieldCheck size={9} /> Leadership
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <p className="text-[9px] text-[#6B7280] font-mono">{teacher.department}</p>
                      <span className="px-1.5 py-0.5 rounded bg-[#FF3B30]/10 text-[#FF3B30] border border-[#FF3B30]/20 text-[8px] font-bold uppercase tracking-wider">
                        {teacher.branch}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 border-t border-b border-[rgba(255,255,255,0.06)] py-2.5 text-[11px]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[#9CA3AF]">
                      <MapPin size={12} className="text-[#FF3B30] shrink-0" />
                      <span>Cabin: <span className="text-white font-semibold">{teacher.cabin}</span></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#9CA3AF]">
                      <Clock size={12} className="text-[#FF3B30] shrink-0" />
                      <span>Office Hours: <span className="text-white font-semibold">{teacher.officeHours}</span></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#9CA3AF]">
                      <Mail size={12} className="text-[#FF3B30] shrink-0" />
                      <span className="font-mono text-white">{teacher.email}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-1.5 text-[#9CA3AF] pt-1">
                    <BookOpen size={12} className="text-[#FF3B30] shrink-0 mt-0.5" />
                    <div className="flex flex-wrap gap-1">
                      {teacher.subjects.map((sub, idx) => (
                        <span key={idx} className="bg-[#141418] border border-[rgba(255,255,255,0.08)] px-1.5 py-0.5 rounded text-[9px] font-semibold text-white whitespace-nowrap">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-[11px]">
                  <span className="text-[9px] font-bold text-[#6B7280] uppercase block">Student Rating</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    <span className="font-bold text-white">{teacher.rating} / 5.0</span>
                    <span className="text-[9px] text-[#6B7280]">({teacher.reviewsCount} reviews)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
      </div>
    </div>
  )
}
