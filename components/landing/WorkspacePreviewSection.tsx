'use client'

import Link from 'next/link'
import { Layout, ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react'

export default function WorkspacePreviewSection() {
  return (
    <section id="modules" className="relative py-20 px-6 lg:px-12 max-w-[1440px] mx-auto bg-transparent">
      <div className="mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-tight">
          Workspace Preview
        </h2>
        <p className="text-xs text-[#9CA3AF] mt-2 font-semibold uppercase tracking-wider">
          Unified command center for academics, campus navigation, and career preparation
        </p>
      </div>

      <div className="space-y-8">
        {/* Short description */}
        <p className="text-sm text-[#9CA3AF] max-w-3xl leading-relaxed">
          Access your personalized KIIT student workspace equipped with real-time AI exam question prediction models, verified PYQs, faculty review directories, section swap management, and ATS resume optimization.
        </p>

        {/* Large Screenshot Placeholder Frame */}
        <div className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-2xl overflow-hidden shadow-2xl">
          {/* Top Bar Mock */}
          <div className="bg-[#101010] px-4 py-3 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF3B30]/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="text-[11px] font-mono text-[#6B7280] ml-3 hidden sm:inline">
                https://kiitanumaan.ac.in/workspace
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded bg-[#FF3B30]/10 text-[#FF3B30] text-[10px] font-bold uppercase tracking-wider border border-[#FF3B30]/30">
                PROD v2.4
              </span>
            </div>
          </div>

          {/* Main Preview Content */}
          <div className="p-6 lg:p-10 bg-[#080808] grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Sidebar Mock */}
            <div className="lg:col-span-3 bg-[#101010] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 space-y-3">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">
                Workspace Sidebar
              </div>
              <div className="space-y-1 text-xs font-semibold">
                <div className="px-3 py-2 rounded-lg bg-[#FF3B30]/10 text-[#FF3B30] flex items-center gap-2">
                  <Layout size={14} /> Academic Workspace
                </div>
                <div className="px-3 py-2 text-[#9CA3AF] hover:text-white flex items-center gap-2">
                  <Zap size={14} /> Campus Workspace
                </div>
                <div className="px-3 py-2 text-[#9CA3AF] hover:text-white flex items-center gap-2">
                  <Sparkles size={14} /> Career Workspace
                </div>
                <div className="px-3 py-2 text-[#9CA3AF] hover:text-white flex items-center gap-2">
                  <ShieldCheck size={14} /> Faculty Directory
                </div>
              </div>
            </div>

            {/* Dashboard Content Mock */}
            <div className="lg:col-span-9 bg-[#101010] border border-[rgba(255,255,255,0.06)] rounded-xl p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.06)] pb-4">
                <div>
                  <h4 className="text-base font-extrabold text-white">AI Predicted Paper Generator</h4>
                  <p className="text-xs text-[#9CA3AF]">Autumn 2026 End-Sem Exam Topic Forecast</p>
                </div>
                <span className="px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold rounded-md">
                  94.8% Prediction Accuracy
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#141414] border border-[rgba(255,255,255,0.06)] p-4 rounded-lg">
                  <span className="text-[10px] text-[#6B7280] uppercase font-bold">Predicted Questions</span>
                  <p className="text-xl font-extrabold text-white mt-1">18 High Priority</p>
                </div>
                <div className="bg-[#141414] border border-[rgba(255,255,255,0.06)] p-4 rounded-lg">
                  <span className="text-[10px] text-[#6B7280] uppercase font-bold">Difficulty Index</span>
                  <p className="text-xl font-extrabold text-white mt-1">Moderate (55%)</p>
                </div>
                <div className="bg-[#141414] border border-[rgba(255,255,255,0.06)] p-4 rounded-lg">
                  <span className="text-[10px] text-[#6B7280] uppercase font-bold">PYQ Archive</span>
                  <p className="text-xl font-extrabold text-white mt-1">3,800+ Verified</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button: Open Workspace */}
        <div className="pt-4 flex justify-start">
          <Link
            href="/workspace"
            className="bg-[#FF3B30] text-white text-sm font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl hover:bg-[#E03126] transition-all active:scale-95 flex items-center gap-2 shadow-[0_0_20px_rgba(255,59,48,0.3)]"
          >
            Open Workspace <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* ABOUT PLATFORM SECTION */}
      <div id="about" className="mt-24 pt-16 border-t border-[rgba(255,255,255,0.08)]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF3B30]">About KIITAnumaan</span>
            <h3 className="text-2xl font-extrabold text-white uppercase tracking-tight mt-2">
              Empowering Students with AI Intelligence
            </h3>
          </div>
          <div className="lg:col-span-2 text-xs text-[#9CA3AF] space-y-4 leading-relaxed">
            <p>
              KIITAnumaan is built specifically for students of Kalinga Institute of Industrial Technology (KIIT University). It combines deep learning predictive models with peer verification to deliver accurate exam topic forecasts, verified PYQ solutions, real-time section swap matching, and ATS resume scoring.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="bg-[#101010] p-4 rounded-xl border border-[rgba(255,255,255,0.06)]">
                <span className="text-xl font-extrabold text-white block">3,800+</span>
                <span className="text-[10px] text-[#6B7280] uppercase font-semibold">Verified Papers</span>
              </div>
              <div className="bg-[#101010] p-4 rounded-xl border border-[rgba(255,255,255,0.06)]">
                <span className="text-xl font-extrabold text-[#FF3B30] block">94.8%</span>
                <span className="text-[10px] text-[#6B7280] uppercase font-semibold">AI Accuracy</span>
              </div>
              <div className="bg-[#101010] p-4 rounded-xl border border-[rgba(255,255,255,0.06)]">
                <span className="text-xl font-extrabold text-white block">12,000+</span>
                <span className="text-[10px] text-[#6B7280] uppercase font-semibold">Active Students</span>
              </div>
              <div className="bg-[#101010] p-4 rounded-xl border border-[rgba(255,255,255,0.06)]">
                <span className="text-xl font-extrabold text-white block">24/7</span>
                <span className="text-[10px] text-[#6B7280] uppercase font-semibold">AI Assistant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
