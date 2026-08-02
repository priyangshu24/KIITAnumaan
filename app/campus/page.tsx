'use client'

import { useState } from 'react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import Card from '@/components/shared/Card'
import Button from '@/components/shared/Button'
import Badge from '@/components/shared/Badge'

import {
  Users,
  Search,
  Star,
  ArrowLeftRight,
  Building,
  Mail,
  Check
} from 'lucide-react'

const sampleFaculty = [
  { id: 'f1', name: 'Dr. Amitabh Mishra', designation: 'Associate Professor', dept: 'CSE', subjects: ['Computer Networks', 'Network Security'], rating: 4.7, email: 'amitabh.mishra@kiit.ac.in' },
  { id: 'f2', name: 'Prof. Sunita Panda', designation: 'Assistant Professor', dept: 'CSE', subjects: ['Machine Learning', 'AI'], rating: 4.9, email: 'sunita.panda@kiit.ac.in' },
  { id: 'f3', name: 'Dr. Ravi Nanda', designation: 'Professor', dept: 'CSE', subjects: ['Software Engineering'], rating: 4.2, email: 'ravi.nanda@kiit.ac.in' },
  { id: 'f4', name: 'Prof. Kaushik Das', designation: 'Assistant Professor', dept: 'CSE', subjects: ['Compiler Design'], rating: 4.5, email: 'kaushik.das@kiit.ac.in' },
]

const sampleSwaps = [
  { id: 's1', student: 'Rahul Kumar', currentSec: 'A', desiredSec: 'B', subject: 'Computer Networks', status: 'open' },
  { id: 's2', student: 'Priya Singh', currentSec: 'C', desiredSec: 'A', subject: 'Machine Learning', status: 'matched' },
  { id: 's3', student: 'Amit Patel', currentSec: 'B', desiredSec: 'D', subject: 'Software Engineering', status: 'open' },
]

export default function CampusPage() {
  const [search, setSearch] = useState('')

  return (
    <div className="relative min-h-screen bg-[#080808] text-white noise-overlay bg-grid-lines bg-dot-matrix">
      <Navbar />

      <main className="pt-28 pb-20 px-6 lg:px-12 max-w-[1440px] mx-auto space-y-12">

        {/* Page Header */}
        <div className="border-b border-[rgba(255,255,255,0.08)] pb-8">
          <Badge status="primary" label="Campus Workspace" />
          <h1 className="text-3xl font-extrabold uppercase text-white tracking-tight sm:text-4xl mt-3">
            Faculty Directory & Section Swap
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-1 font-medium max-w-2xl">
            Read peer reviews of professors, search faculty contact details, and find section swap partners.
          </p>
        </div>

        {/* Section Swap Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold uppercase text-white flex items-center gap-2">
              <ArrowLeftRight size={18} className="text-[#FF3B30]" /> Section Swap Coordination
            </h3>
            <Button size="sm" variant="primary" href="/login">
              Post Request
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleSwaps.map((swap) => (
              <Card key={swap.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{swap.student}</span>
                  <Badge
                    status={swap.status === 'matched' ? 'success' : 'primary'}
                    label={swap.status.toUpperCase()}
                  />
                </div>
                <p className="text-xs text-[#A1A1AA] font-semibold">{swap.subject}</p>
                <div className="flex items-center justify-center gap-4 p-3 bg-[#101010] rounded-xl text-center">
                  <div>
                    <p className="text-[10px] text-[#71717A] uppercase font-bold">Has Sec</p>
                    <p className="text-lg font-black text-[#FF3B30]">{swap.currentSec}</p>
                  </div>
                  <ArrowLeftRight size={16} className="text-[#71717A]" />
                  <div>
                    <p className="text-[10px] text-[#71717A] uppercase font-bold">Wants Sec</p>
                    <p className="text-lg font-black text-[#FF5A4D]">{swap.desiredSec}</p>
                  </div>
                </div>
                <Button fullWidth size="sm" variant={swap.status === 'matched' ? 'outline' : 'primary'} disabled={swap.status === 'matched'}>
                  {swap.status === 'matched' ? 'Matched' : 'Request Swap'}
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Faculty Directory Table */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold uppercase text-white flex items-center gap-2">
            <Users size={18} className="text-[#FF3B30]" /> Faculty Directory
          </h3>

          <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#151515] overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs font-medium">
              <thead className="bg-[#101010] text-[#A1A1AA] uppercase tracking-wider border-b border-[rgba(255,255,255,0.08)]">
                <tr>
                  <th className="py-4 px-6 font-bold">Faculty Member</th>
                  <th className="py-4 px-6 font-bold">Designation</th>
                  <th className="py-4 px-6 font-bold">Dept</th>
                  <th className="py-4 px-6 font-bold">Subjects</th>
                  <th className="py-4 px-6 font-bold">Rating</th>
                  <th className="py-4 px-6 font-bold text-right">Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.05)] text-white">
                {sampleFaculty.map((f) => (
                  <tr key={f.id} className="hover:bg-[#1A1A1A] transition-colors">
                    <td className="py-4 px-6 font-bold">{f.name}</td>
                    <td className="py-4 px-6 text-[#A1A1AA]">{f.designation}</td>
                    <td className="py-4 px-6">{f.dept}</td>
                    <td className="py-4 px-6">{f.subjects.join(', ')}</td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-[#F59E0B]">★ {f.rating}</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <a href={`mailto:${f.email}`} className="text-[#FF3B30] hover:underline font-semibold flex items-center justify-end gap-1">
                        <Mail size={12} /> Email
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  )
}
