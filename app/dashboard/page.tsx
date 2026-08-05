'use client'

import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="relative min-h-screen bg-[#080808] text-white overflow-hidden selection:bg-[#FF3B30] selection:text-white">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[size:4rem_4rem] bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)]" />

      <div className="relative z-10">
        <Navbar />

        <main className="pt-28 pb-20 px-6 lg:px-12 max-w-[1440px] mx-auto space-y-8">
          {/* Overview Dashboard Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Student Dashboard Overview
            </h1>
            <p className="text-xs text-[#8A8A8A] mt-1">
              Welcome to KIITAnumaan academic portal.
            </p>
          </div>

          {/* Reserved Placeholder for AI Prediction Module */}
          <div className="bg-[#111214] border border-white/[0.06] rounded-[24px] p-8 sm:p-12 text-center shadow-[0_12px_40px_rgba(0,0,0,0.35)] flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FF453A]/10 border border-[#FF453A]/20 flex items-center justify-center text-[#FF453A] shadow-sm">
              <Sparkles size={24} />
            </div>
            
            <div className="max-w-md space-y-1.5">
              <h3 className="text-lg font-bold text-white tracking-tight">
                AI Predicted Questions Module
              </h3>
              <p className="text-xs text-[#8A8A8A] leading-relaxed">
                This workspace is reserved for the AI Prediction Module. Open &quot;Predicted Questions&quot; from the sidebar to upload papers and generate predictions.
              </p>
            </div>

            <Link
              href="/workspace/academic/predicted-questions"
              className="mt-2 bg-[#FF453A] hover:bg-[#FF453A]/90 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-sm"
            >
              Go to Predicted Questions <ArrowRight size={14} />
            </Link>

          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}



