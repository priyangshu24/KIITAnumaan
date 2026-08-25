'use client'

import { useState } from 'react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import Card from '@/components/shared/Card'
import Button from '@/components/shared/Button'
import Badge from '@/components/shared/Badge'
import Input from '@/components/shared/Input'
import {
  Briefcase,
  FileCode,
  Target,
  CheckCircle,
  Calendar,
  Sparkles,
  ArrowRight,
  Upload,
  AlertTriangle
} from 'lucide-react'

const sampleDrives = [
  { company: 'Google', role: 'Software Engineer', pkg: '45 LPA', deadline: '2025-02-28', status: 'open', cgpa: 8.0, applicants: 1240 },
  { company: 'Microsoft', role: 'SDE Intern', pkg: '80K/month', deadline: '2025-02-20', status: 'open', cgpa: 7.5, applicants: 876 },
  { company: 'Amazon', role: 'SDE-1', pkg: '32 LPA', deadline: '2025-03-10', status: 'upcoming', cgpa: 7.0, applicants: 0 },
  { company: 'Flipkart', role: 'Software Engineer', pkg: '28 LPA', deadline: '2025-01-31', status: 'closed', cgpa: 7.5, applicants: 654 },
]

export default function CareerPage() {
  const [resumeScore, setResumeScore] = useState(78)

  return (
    <div className="relative min-h-screen bg-[#080808] text-white noise-overlay bg-grid-lines bg-dot-matrix">
      <Navbar />

      <main className="pt-28 pb-20 px-6 lg:px-12 max-w-[1440px] mx-auto space-y-12">

        {/* Page Header */}
        <div className="border-b border-[rgba(255,255,255,0.08)] pb-8">
          <Badge status="primary" label="Career Workspace" />
          <h1 className="text-3xl font-extrabold uppercase text-white tracking-tight sm:text-4xl mt-3">
            Placement Prep & ATS Resume Checker
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-1 font-medium max-w-2xl">
            Build ATS-optimized resumes, check keyword match scores, and track campus recruitment drives.
          </p>
        </div>

        {/* ATS Checker & Resume Tool Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ATS Checker */}
          <Card className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold uppercase text-white flex items-center gap-2">
                <Target size={20} className="text-[#FF3B30]" /> ATS Resume Score
              </h3>
              <Badge status="success" label={`${resumeScore}/100 Match`} />
            </div>

            <div className="p-6 bg-[#101010] border border-[rgba(255,255,255,0.05)] rounded-xl text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#FF3B30]/10 border border-[#FF3B30]/30 mx-auto flex items-center justify-center text-[#FF3B30]">
                <Upload size={28} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Upload Your Resume</p>
                <p className="text-xs text-[#71717A] mt-1">PDF or DOCX · Max 5MB</p>
              </div>
              <Button size="sm" variant="primary" fullWidth>
                Analyze ATS Score
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold uppercase text-[#A1A1AA]">Suggestions:</p>
              <div className="p-3 bg-[#101010] rounded-xl border border-[rgba(255,255,255,0.05)] text-xs text-[#A1A1AA] flex items-center gap-2">
                <AlertTriangle size={14} className="text-[#F59E0B] flex-shrink-0" />
                Add keywords: <span className="text-white font-bold">Docker, AWS, System Design</span>
              </div>
            </div>
          </Card>

          {/* Resume Builder */}
          <Card className="space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold uppercase text-white flex items-center gap-2">
                  <FileCode size={20} className="text-[#FF3B30]" /> Resume Builder
                </h3>
                <Badge status="primary" label="Tech Template" />
              </div>
              <p className="text-xs text-[#A1A1AA] leading-relaxed font-medium">
                Create a high-impact, single-page resume engineered for top technical interview screeners.
              </p>
              <div className="space-y-2">
                {['Single-page ATS standard format', 'Automated achievement bullet points', 'Instant PDF download'].map((feat) => (
                  <div key={feat} className="flex items-center gap-2 text-xs text-white">
                    <CheckCircle size={14} className="text-[#22C55E]" />
                    {feat}
                  </div>
                ))}
              </div>
            </div>

            <Button href="/workspace/career" fullWidth size="lg" variant="primary">
              Build Resume Now <ArrowRight size={16} />
            </Button>
          </Card>
        </div>

        {/* Active Drives Table */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold uppercase text-white flex items-center gap-2">
            <Briefcase size={20} className="text-[#FF3B30]" /> Campus Placement Drives
          </h3>

          <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#151515] overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs font-medium">
              <thead className="bg-[#101010] text-[#A1A1AA] uppercase tracking-wider border-b border-[rgba(255,255,255,0.08)]">
                <tr>
                  <th className="py-4 px-6 font-bold">Company</th>
                  <th className="py-4 px-6 font-bold">Role</th>
                  <th className="py-4 px-6 font-bold">Package</th>
                  <th className="py-4 px-6 font-bold">Min CGPA</th>
                  <th className="py-4 px-6 font-bold">Deadline</th>
                  <th className="py-4 px-6 font-bold">Status</th>
                  <th className="py-4 px-6 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.05)] text-white">
                {sampleDrives.map((drive) => (
                  <tr key={drive.company} className="hover:bg-[#1A1A1A] transition-colors">
                    <td className="py-4 px-6 font-bold text-white">{drive.company}</td>
                    <td className="py-4 px-6 text-[#A1A1AA]">{drive.role}</td>
                    <td className="py-4 px-6 font-bold text-[#22C55E]">{drive.pkg}</td>
                    <td className="py-4 px-6">{drive.cgpa}</td>
                    <td className="py-4 px-6 text-[#71717A]">{drive.deadline}</td>
                    <td className="py-4 px-6">
                      <Badge
                        status={drive.status === 'open' ? 'success' : drive.status === 'upcoming' ? 'warning' : 'neutral'}
                        label={drive.status.toUpperCase()}
                      />
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Button size="sm" variant={drive.status === 'open' ? 'primary' : 'outline'} disabled={drive.status !== 'open'}>
                        {drive.status === 'open' ? 'Apply Now' : 'Closed'}
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
