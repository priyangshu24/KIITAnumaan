'use client'

import { useState } from 'react'
import {
  Users,
  Search,
  Star,
  Mail,
  MapPin,
  Clock,
  ArrowLeftRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Lock,
  Plus,
  BookOpen
} from 'lucide-react'

// Faculty Members
const facultyList = [
  {
    id: 'f-5',
    name: 'Dr. Suresh Senapati',
    designation: 'Head of Department (HOD)',
    department: 'School of Computer Engineering',
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
    specialization: 'Computer Networks & Cloud Computing',
    cabin: 'Campus 15, Block C, Room 105',
    officeHours: 'Mon to Fri: 04:00 - 05:00 PM',
    email: 'pk.pattnaik@kiit.ac.in',
    subjects: ['CS-3006 Computer Networks'],
    rating: 4.6,
    reviewsCount: 56,
    availability: 'Out of Office',
  },
]

// Sample Swap Requests
const initialSwapRequests = [
  {
    id: 'swap-101',
    studentA: { name: 'Soumya S.', roll: '22051892', currentSec: 'CSE-14' },
    studentB: { name: 'Pritam K.', roll: '22051904', currentSec: 'CSE-02' },
    subject: 'CS-3004 Operating Systems',
    status: 'Pending' as 'Pending' | 'Accepted' | 'Completed' | 'Cancelled',
    date: '2026-07-30',
  },
  {
    id: 'swap-102',
    studentA: { name: 'Rohan Verma', roll: '22051740', currentSec: 'CSE-08' },
    studentB: { name: 'Soumya S.', roll: '22051892', currentSec: 'CSE-14' },
    subject: 'CS-3002 DBMS',
    status: 'Accepted' as 'Pending' | 'Accepted' | 'Completed' | 'Cancelled',
    date: '2026-07-29',
  },
]

export default function FacultyWorkspacePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('All')
  const [activeTab, setActiveTab] = useState<'directory' | 'swap'>('directory')

  // Section Swap Modal & Form States
  const [showSwapModal, setShowSwapModal] = useState(false)
  const [swapStep, setSwapStep] = useState<1 | 2 | 3>(1) // Step 1: Details, Step 2: Peer, Step 3: OTP
  const [targetSec, setTargetSec] = useState('CSE-02')
  const [targetPeerRoll, setTargetPeerRoll] = useState('22051904')
  const [otpInput, setOtpInput] = useState('')
  const [swapRequests, setSwapRequests] = useState(initialSwapRequests)

  const filteredFaculty = facultyList.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.subjects.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesDept = departmentFilter === 'All' || f.department.includes(departmentFilter)
    return matchesSearch && matchesDept
  })

  const handleVerifyOtpAndSubmit = () => {
    if (otpInput.length < 6) {
      alert('Please enter a valid 6-digit OTP code')
      return
    }
    const newSwap = {
      id: `swap-${Date.now()}`,
      studentA: { name: 'Soumya S.', roll: '22051892', currentSec: 'CSE-14' },
      studentB: { name: 'Peer Student', roll: targetPeerRoll, currentSec: targetSec },
      subject: 'CS-3004 Operating Systems',
      status: 'Pending' as const,
      date: new Date().toISOString().split('T')[0],
    }
    setSwapRequests([newSwap, ...swapRequests])
    setShowSwapModal(false)
    setSwapStep(1)
    setOtpInput('')
    alert('Section Swap Request Initiated! OTP Verified Successfully.')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.08)] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-[#FF3B30]/10 text-[#FF3B30] border border-[#FF3B30]/30 text-[10px] font-bold uppercase tracking-wider">
              FACULTY & REGISTRY
            </span>
            <span className="text-xs text-green-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Official Swap Period Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight mt-1">
            Faculty & Section Swap Workspace
          </h1>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center bg-[#101010] border border-[rgba(255,255,255,0.08)] p-1 rounded-xl gap-1">
          <button
            onClick={() => setActiveTab('directory')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'directory' ? 'bg-[#FF3B30] text-white shadow-md' : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            <Users size={14} /> Teacher Directory
          </button>
          <button
            onClick={() => setActiveTab('swap')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'swap' ? 'bg-[#FF3B30] text-white shadow-md' : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            <ArrowLeftRight size={14} /> Section Swap
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------
          TAB 1: TEACHER DIRECTORY
      ---------------------------------------------------- */}
      {activeTab === 'directory' && (
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
              <span className="text-xs text-[#6B7280] font-bold uppercase">Department:</span>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="bg-[#101010] border border-[rgba(255,255,255,0.08)] text-xs text-white p-2 rounded-lg outline-none font-medium"
              >
                <option value="All">All Departments</option>
                <option value="Computer Engineering">Computer Engineering</option>
                <option value="Electronics">Electronics</option>
              </select>
            </div>
          </div>

          {/* Directory Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredFaculty.map((teacher) => (
              <div key={teacher.id} className="saas-card p-6 space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#FF3B30]/15 border border-[#FF3B30]/30 flex items-center justify-center font-bold text-[#FF3B30] text-base shrink-0">
                      {teacher.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white leading-tight">{teacher.name}</h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xs text-[#FF3B30] font-semibold">{teacher.designation}</p>
                        {(teacher.designation.includes('Dean') || teacher.designation.includes('HOD')) && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                            <ShieldCheck size={10} /> Leadership
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-[#6B7280] font-mono mt-0.5">{teacher.department}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      teacher.availability === 'Available in Cabin'
                        ? 'bg-green-500/10 text-green-400 border-green-500/30'
                        : teacher.availability === 'In Lecture'
                        ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                        : 'bg-red-500/10 text-red-400 border-red-500/30'
                    }`}
                  >
                    {teacher.availability}
                  </span>
                </div>

                <div className="space-y-3 border-t border-b border-[rgba(255,255,255,0.06)] py-4 text-xs">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#9CA3AF]">
                      <MapPin size={14} className="text-[#FF3B30] shrink-0" />
                      <span>Cabin: <span className="text-white font-semibold">{teacher.cabin}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-[#9CA3AF]">
                      <Clock size={14} className="text-[#FF3B30] shrink-0" />
                      <span>Office Hours: <span className="text-white font-semibold">{teacher.officeHours}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-[#9CA3AF]">
                      <Mail size={14} className="text-[#FF3B30] shrink-0" />
                      <span className="font-mono text-white">{teacher.email}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-[#9CA3AF] pt-1">
                    <BookOpen size={14} className="text-[#FF3B30] shrink-0 mt-0.5" />
                    <div className="flex flex-wrap gap-1.5">
                      {teacher.subjects.map((sub, idx) => (
                        <span key={idx} className="bg-[#141418] border border-[rgba(255,255,255,0.08)] px-2 py-0.5 rounded text-[10px] font-semibold text-white whitespace-nowrap">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-[#6B7280] uppercase block">Student Rating</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      <span className="font-bold text-white">{teacher.rating} / 5.0</span>
                      <span className="text-[10px] text-[#6B7280]">({teacher.reviewsCount} reviews)</span>
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`Contacting ${teacher.name} at ${teacher.email}`)}
                    className="bg-[#101010] border border-[rgba(255,255,255,0.1)] hover:border-[#FF3B30] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 2: SECTION SWAP SYSTEM
      ---------------------------------------------------- */}
      {activeTab === 'swap' && (
        <div className="space-y-6">
          {/* Official Period Banner */}
          <div className="bg-[#FF3B30]/10 border border-[#FF3B30]/30 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="px-2 py-0.5 bg-[#FF3B30] text-white text-[9px] font-bold uppercase rounded">
                Official Window Open
              </span>
              <h3 className="text-base font-extrabold text-white uppercase mt-1">
                Official Autumn 2026 Section Swap Window
              </h3>
              <p className="text-xs text-[#9CA3AF] mt-0.5">
                Swap section requests require mutual consent from Student A & Student B, followed by 2FA OTP Verification.
              </p>
            </div>

            <button
              onClick={() => setShowSwapModal(true)}
              className="bg-[#FF3B30] text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-lg hover:bg-[#E03126] transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(255,59,48,0.3)] shrink-0"
            >
              <Plus size={16} /> Request Section Swap
            </button>
          </div>

          {/* Active Swap Requests Table */}
          <div className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-xl overflow-hidden">
            <div className="p-4 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Active Swap Requests & Pipeline
              </h4>
              <span className="text-xs text-[#6B7280] font-mono">{swapRequests.length} Total Requests</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#101010] text-[#6B7280] font-bold uppercase tracking-wider border-b border-[rgba(255,255,255,0.08)]">
                    <th className="p-4">Initiator (Student A)</th>
                    <th className="p-4">Target Peer (Student B)</th>
                    <th className="p-4">Subject</th>
                    <th className="p-4">Status Pipeline</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(255,255,255,0.06)] font-medium">
                  {swapRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-[#101010] transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-white">{req.studentA.name}</p>
                        <p className="text-[10px] text-[#6B7280] font-mono">Roll: {req.studentA.roll} · <span className="text-[#FF3B30]">{req.studentA.currentSec}</span></p>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-white">{req.studentB.name}</p>
                        <p className="text-[10px] text-[#6B7280] font-mono">Roll: {req.studentB.roll} · <span className="text-green-400">{req.studentB.currentSec}</span></p>
                      </td>
                      <td className="p-4 text-[#9CA3AF]">{req.subject}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase border ${
                            req.status === 'Pending'
                              ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                              : req.status === 'Accepted'
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                              : req.status === 'Completed'
                              ? 'bg-green-500/10 text-green-400 border-green-500/30'
                              : 'bg-red-500/10 text-red-400 border-red-500/30'
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {req.status === 'Pending' && (
                          <button
                            onClick={() => {
                              setSwapRequests(
                                swapRequests.map((r) => (r.id === req.id ? { ...r, status: 'Accepted' } : r))
                              )
                            }}
                            className="bg-[#FF3B30] text-white px-2.5 py-1 rounded text-[10px] font-bold hover:bg-[#E03126]"
                          >
                            Accept Swap
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSwapRequests(
                              swapRequests.map((r) => (r.id === req.id ? { ...r, status: 'Cancelled' } : r))
                            )
                          }}
                          className="bg-[#101010] text-[#6B7280] hover:text-white px-2.5 py-1 rounded text-[10px] font-semibold border border-[rgba(255,255,255,0.08)]"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section Swap Workflow Modal */}
          {showSwapModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="bg-[#141414] border border-[rgba(255,255,255,0.1)] rounded-2xl max-w-lg w-full p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] pb-3">
                  <div className="flex items-center gap-2">
                    <ArrowLeftRight size={18} className="text-[#FF3B30]" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Initiate Section Swap Workflow
                    </h3>
                  </div>
                  <button onClick={() => setShowSwapModal(false)} className="text-[#6B7280] hover:text-white">
                    <X size={18} />
                  </button>
                </div>

                {/* Step indicator */}
                <div className="flex items-center justify-between text-[10px] font-mono text-[#6B7280] border-b border-[rgba(255,255,255,0.06)] pb-2">
                  <span className={swapStep === 1 ? 'text-[#FF3B30] font-bold' : ''}>1. Swap Info</span>
                  <span className={swapStep === 2 ? 'text-[#FF3B30] font-bold' : ''}>2. Peer Roll</span>
                  <span className={swapStep === 3 ? 'text-[#FF3B30] font-bold' : ''}>3. OTP Verification</span>
                </div>

                {/* Step 1 Form */}
                {swapStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-[#6B7280] uppercase block mb-1">Your Current Section</label>
                      <input
                        type="text"
                        disabled
                        value="CSE-14 (Roll: 22051892)"
                        className="w-full bg-[#101010] border border-[rgba(255,255,255,0.08)] text-xs text-[#9CA3AF] p-2.5 rounded-lg outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-[#6B7280] uppercase block mb-1">Desired Target Section</label>
                      <select
                        value={targetSec}
                        onChange={(e) => setTargetSec(e.target.value)}
                        className="w-full bg-[#101010] border border-[rgba(255,255,255,0.08)] text-xs text-white p-2.5 rounded-lg outline-none font-bold"
                      >
                        <option>CSE-02</option>
                        <option>CSE-04</option>
                        <option>CSE-08</option>
                      </select>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => setSwapStep(2)}
                        className="bg-[#FF3B30] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg hover:bg-[#E03126]"
                      >
                        Next: Select Peer
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2 Form */}
                {swapStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-[#6B7280] uppercase block mb-1">Target Student B Roll Number</label>
                      <input
                        type="text"
                        value={targetPeerRoll}
                        onChange={(e) => setTargetPeerRoll(e.target.value)}
                        placeholder="Enter 8-digit Roll Number"
                        className="w-full bg-[#101010] border border-[rgba(255,255,255,0.08)] text-xs text-white p-2.5 rounded-lg outline-none font-mono focus:border-[#FF3B30]"
                      />
                    </div>

                    <div className="bg-[#101010] p-3 rounded-lg border border-[rgba(255,255,255,0.06)] text-xs text-[#9CA3AF]">
                      Matching Peer Found: <span className="text-white font-bold">Pritam K. (CSE-02)</span>
                    </div>

                    <div className="flex justify-between pt-2">
                      <button onClick={() => setSwapStep(1)} className="text-xs text-[#6B7280] hover:text-white">
                        Back
                      </button>
                      <button
                        onClick={() => setSwapStep(3)}
                        className="bg-[#FF3B30] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg hover:bg-[#E03126]"
                      >
                        Send OTP Code
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3 Form (OTP Verification) */}
                {swapStep === 3 && (
                  <div className="space-y-4">
                    <div className="text-center space-y-1">
                      <Lock size={24} className="text-[#FF3B30] mx-auto" />
                      <p className="text-xs font-bold text-white">Enter 6-Digit Verification OTP</p>
                      <p className="text-[10px] text-[#6B7280]">Sent to official KIIT student webmail</p>
                    </div>

                    <input
                      type="text"
                      maxLength={6}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="e.g. 849201"
                      className="w-full bg-[#101010] border border-[#FF3B30]/50 text-center font-mono text-lg text-white tracking-widest p-3 rounded-lg outline-none"
                    />

                    <div className="flex justify-between items-center pt-2">
                      <button onClick={() => setSwapStep(2)} className="text-xs text-[#6B7280] hover:text-white">
                        Back
                      </button>
                      <button
                        onClick={handleVerifyOtpAndSubmit}
                        className="bg-[#FF3B30] text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-lg hover:bg-[#E03126]"
                      >
                        Confirm & Verify OTP
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
