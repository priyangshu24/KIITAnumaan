'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import Card from '@/components/shared/Card'
import Button from '@/components/shared/Button'
import Badge from '@/components/shared/Badge'
import {
  FileText,
  BookOpen,
  Cpu,
  Briefcase,
  Users,
  Target,
  TrendingUp,
  Clock,
  Download,
  Star,
  Sparkles,
  ArrowUpRight
} from 'lucide-react'
import Link from 'next/link'

const stats = [
  { label: 'Available PYQs', value: '3,654', change: '+12% this month', icon: FileText, color: '#FF3B30' },
  { label: 'Study Notes', value: '1,248', change: '+8% this month', icon: BookOpen, color: '#FF5A4D' },
  { label: 'AI Accuracy', value: '87%', change: 'ML Model v2.4', icon: Cpu, color: '#22C55E' },
  { label: 'Active Companies', value: '124', change: '+18% placement', icon: Briefcase, color: '#F59E0B' },
]

export default function DashboardPage() {
  return (
    <div className="relative min-h-screen bg-[#080808] text-white noise-overlay bg-grid-lines bg-dot-matrix">
      <Navbar />

      <main className="pt-28 pb-20 px-6 lg:px-12 max-w-[1440px] mx-auto space-y-10">

        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[rgba(255,255,255,0.08)] pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge status="primary" label="KIIT Student Workspace" />
              <span className="text-xs font-mono text-[#71717A]">CSE · Sem 6 · Section A</span>
            </div>
            <h1 className="text-3xl font-extrabold uppercase text-white tracking-tight sm:text-4xl">
              Welcome back, <span className="text-[#FF3B30]">Aryan</span>
            </h1>
            <p className="text-xs text-[#A1A1AA] mt-1 font-medium">
              Your AI-powered academic overview & placement readiness dashboard.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button href="/academic" size="sm" variant="outline">
              <FileText size={14} /> View PYQs
            </Button>
            <Button href="/career" size="sm" variant="primary">
              <Sparkles size={14} /> Resume Builder
            </Button>
          </div>
        </div>

        {/* Stat Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s) => (
            <Card key={s.label} className="flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA]">{s.label}</span>
                <div className="w-9 h-9 rounded-xl bg-[#1A1A1A] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#FF3B30]">
                  <s.icon size={18} />
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-white">{s.value}</p>
                <p className="text-[11px] text-[#71717A] mt-1 font-mono">{s.change}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Workspaces Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Academic Overview */}
          <Card className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF3B30]/10 border border-[#FF3B30]/30 flex items-center justify-center text-[#FF3B30]">
                  <Cpu size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold uppercase text-white">AI Examination Forecast</h3>
                  <p className="text-xs text-[#A1A1AA]">Computer Networks (CS4201) · End Term 2025</p>
                </div>
              </div>
              <Badge status="success" label="High Confidence" />
            </div>

            <div className="space-y-3">
              {[
                { topic: "Dijkstra's Algorithm & Link State Routing", prob: '92% Chance', tag: 'High Priority' },
                { topic: 'TCP/IP Congestion Control (Tahoe vs Reno)', prob: '87% Chance', tag: 'High Priority' },
                { topic: 'OSI Model vs TCP/IP Layer Mapping', prob: '81% Chance', tag: 'Medium Priority' },
                { topic: 'DNS Resolution & Socket Programming', prob: '74% Chance', tag: 'Medium Priority' },
              ].map((item) => (
                <div key={item.topic} className="flex items-center justify-between p-3.5 bg-[#101010] border border-[rgba(255,255,255,0.05)] rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#FF3B30]" />
                    <span className="text-xs font-semibold text-white">{item.topic}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#22C55E] font-bold">{item.prob}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <Button href="/academic" size="sm" variant="outline">
                Open AI Predictor <ArrowUpRight size={14} />
              </Button>
            </div>
          </Card>

          {/* Active Placement Drives */}
          <Card className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold uppercase text-white flex items-center gap-2">
                <Briefcase size={18} className="text-[#FF3B30]" /> Active Drives
              </h3>
              <Badge status="primary" label="Open" />
            </div>

            <div className="space-y-4">
              {[
                { company: 'Google', role: 'Software Engineer', pkg: '45 LPA', deadline: 'Feb 28' },
                { company: 'Microsoft', role: 'SDE Intern', pkg: '80K/mo', deadline: 'Feb 20' },
                { company: 'Amazon', role: 'SDE-1', pkg: '32 LPA', deadline: 'Mar 10' },
              ].map((drive) => (
                <div key={drive.company} className="p-4 bg-[#101010] border border-[rgba(255,255,255,0.05)] rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{drive.company}</span>
                    <span className="text-xs font-bold text-[#22C55E]">{drive.pkg}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#71717A]">
                    <span>{drive.role}</span>
                    <span>Deadline: {drive.deadline}</span>
                  </div>
                </div>
              ))}
            </div>

            <Button href="/career" fullWidth size="sm" variant="outline">
              View All Drives
            </Button>
          </Card>
        </div>

      </main>

      <Footer />
    </div>
  )
}
