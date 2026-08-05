'use client'

import { useState } from 'react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import Card from '@/components/shared/Card'
import Button from '@/components/shared/Button'
import Badge from '@/components/shared/Badge'
import Input from '@/components/shared/Input'
import {
  FileText,
  BookOpen,
  Cpu,
  Search,
  Download,
  Star,
  Clock,
  Filter,
  CheckCircle2
} from 'lucide-react'

const samplePYQs = [
  { id: 'p1', subject: 'Data Structures & Algorithms', code: 'CS3201', sem: 5, year: 2024, type: 'End Term', size: '2.4 MB', downloads: '1,284', aiTag: 'High Likelihood' },
  { id: 'p2', subject: 'Operating Systems', code: 'CS3301', sem: 5, year: 2024, type: 'Mid Term', size: '1.8 MB', downloads: '876', aiTag: 'Predicted' },
  { id: 'p3', subject: 'Database Management Systems', code: 'CS3101', sem: 5, year: 2023, type: 'End Term', size: '3.1 MB', downloads: '2,043', aiTag: 'High Likelihood' },
  { id: 'p4', subject: 'Computer Networks', code: 'CS4201', sem: 6, year: 2024, type: 'End Term', size: '2.9 MB', downloads: '654', aiTag: 'Predicted' },
  { id: 'p5', subject: 'Machine Learning', code: 'CS5101', sem: 7, year: 2024, type: 'End Term', size: '4.2 MB', downloads: '1,876', aiTag: 'High Likelihood' },
  { id: 'p6', subject: 'Software Engineering', code: 'CS4101', sem: 6, year: 2023, type: 'Mid Term', size: '1.5 MB', downloads: '432', aiTag: 'Standard' },
]

export default function AcademicPage() {
  const [search, setSearch] = useState('')
  const [selectedSem, setSelectedSem] = useState<string>('All')

  const filtered = samplePYQs.filter((item) => {
    const matchSearch = !search || item.subject.toLowerCase().includes(search.toLowerCase()) || item.code.toLowerCase().includes(search.toLowerCase())
    const matchSem = selectedSem === 'All' || item.sem.toString() === selectedSem
    return matchSearch && matchSem
  })

  return (
    <div className="relative min-h-screen bg-[#080808] text-white noise-overlay bg-grid-lines bg-dot-matrix">
      <Navbar />

      <main className="pt-28 pb-20 px-6 lg:px-12 max-w-[1440px] mx-auto space-y-10">

        {/* Page Header */}
        <div className="border-b border-[rgba(255,255,255,0.08)] pb-8">
          <Badge status="primary" label="Academic Workspace" />
          <h1 className="text-3xl font-extrabold uppercase text-white tracking-tight sm:text-4xl mt-3">
            PYQ Library & AI Predicted Papers
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-1 font-medium max-w-2xl">
            Access 3,600+ previous year papers, AI-forecasted topic analysis, and student notes.
          </p>
        </div>

        {/* Filter Bar */}
        <Card className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">

              <span className="text-xs text-[#71717A] font-bold uppercase mr-2">Semester:</span>
              {['All', '5', '6', '7'].map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSem(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                    selectedSem === s ? 'bg-[#FF3B30] text-white' : 'bg-[#101010] text-[#A1A1AA] hover:text-white'
                  }`}
                >
                  {s === 'All' ? 'All' : `Sem ${s}`}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Enterprise Data Table */}
        <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#151515] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium">
              <thead className="bg-[#101010] text-[#A1A1AA] uppercase tracking-wider border-b border-[rgba(255,255,255,0.08)]">
                <tr>
                  <th className="py-4 px-6 font-bold">Subject</th>
                  <th className="py-4 px-6 font-bold">Code</th>
                  <th className="py-4 px-6 font-bold">Sem</th>
                  <th className="py-4 px-6 font-bold">Type</th>
                  <th className="py-4 px-6 font-bold">AI Status</th>
                  <th className="py-4 px-6 font-bold">Downloads</th>
                  <th className="py-4 px-6 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.05)] text-white">
                {filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-[#1A1A1A] transition-colors">
                    <td className="py-4 px-6 font-bold flex items-center gap-2">
                      <FileText size={15} className="text-[#FF3B30]" />
                      {row.subject}
                    </td>
                    <td className="py-4 px-6 font-mono text-[#A1A1AA]">{row.code}</td>
                    <td className="py-4 px-6">Sem {row.sem}</td>
                    <td className="py-4 px-6">{row.type} · {row.year}</td>
                    <td className="py-4 px-6">
                      <Badge
                        status={row.aiTag === 'High Likelihood' ? 'success' : 'primary'}
                        label={row.aiTag}
                      />
                    </td>
                    <td className="py-4 px-6 font-mono text-[#A1A1AA]">{row.downloads}</td>
                    <td className="py-4 px-6 text-right">
                      <Button size="sm" variant="outline" href="/login">
                        <Download size={13} /> PDF ({row.size})
                      </Button>
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
