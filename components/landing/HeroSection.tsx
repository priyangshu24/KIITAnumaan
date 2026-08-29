'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Play, X, ChevronDown, ArrowDown } from 'lucide-react'

export default function HeroSection() {
  const [showDemoModal, setShowDemoModal] = useState(false)

  return (
    <section className="relative pt-[120px] sm:pt-[130px] pb-4 sm:pb-6 px-6 lg:px-12 flex flex-col max-w-[1440px] mx-auto overflow-hidden bg-[#080808] selection:bg-[#ff453a] selection:text-white z-[1]">
      
      {/* BACKGROUND ILLUSTRATION - Screen Blend Mode & Smooth Gradient Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* KIIT Campus Map Image */}
        <div className="absolute top-0 right-0 w-full lg:w-[82%] xl:w-[88%] h-full flex items-center justify-end">
          <img
            src="/kiit-map.jpg"
            alt="KIIT Campus Wireframe Map"
            className="w-full h-full object-cover lg:object-contain object-right opacity-90 contrast-140 brightness-120 scale-105 mix-blend-screen transition-all duration-1000"
          />
          {/* Transparent Ambient Gradient Blend */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/60 sm:via-[#080808]/20 to-transparent w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-[#080808]/60 w-full h-full" />
        </div>
      </div>

      {/* Smooth Bottom Fade to Seamlessly Transition Hero Background into Features Section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#080808] via-[#080808]/80 to-transparent pointer-events-none z-[5]" />

      {/* HERO MAIN GRID - 80px Gap between Left and Right */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-[80px] items-center z-10 relative">
        
        {/* LEFT CONTENT CONTAINER */}
        <div className="lg:col-span-7 xl:col-span-7">
          
          {/* Headline - Max-width 600px, leading 0.95, overflow protection */}
          <div className="max-w-[600px] w-full break-words">
            <h1 className="text-[34px] sm:text-[44px] lg:text-[56px] font-[800] tracking-tight text-white leading-[0.95]">
              Everything a<br />
              <span className="text-[#ff453a]">KIIT</span> student needs.<br />
              <span className="text-[#ff453a]">
                One place.
              </span>
            </h1>
          </div>

          {/* Subtitle Paragraph - Color #bdbdbd */}
          <p className="text-xs sm:text-sm text-[#bdbdbd] max-w-[460px] font-normal leading-relaxed mt-4">
            One platform for Previous Year Papers, Notes, AI Exam Prediction, Resume Builder, Placement Planner, Campus Navigation, Faculty Directory and much more.
          </p>

          {/* BUTTONS - Margin Top 24px */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-6">
            {/* Primary Button: Red Gradient (#ff3b30 -> #ff5a4f), Rounded 18px, Soft Glow, Hover Scale 1.03 */}
            <Link
              href="/workspace"
              className="bg-gradient-to-r from-[#ff3b30] to-[#ff5a4f] text-white text-xs font-bold uppercase tracking-wider px-7 py-4 rounded-[18px] hover:scale-[1.03] transition-all duration-[250ms] active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,59,48,0.3)]"
            >
              Open Workspace <ArrowRight size={16} />
            </Link>

            {/* Secondary Button: Transparent, White Border, White Text, Hover Border Red */}
            <button
              onClick={() => setShowDemoModal(true)}
              className="group bg-transparent border border-white/20 text-white text-xs font-bold uppercase tracking-wider px-7 py-4 rounded-[18px] hover:border-[#ff453a] transition-all duration-[250ms] active:scale-95 flex items-center justify-center gap-2"
            >
              <Play size={15} fill="currentColor" className="text-white group-hover:text-[#ff453a] transition-colors" /> Watch Demo
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN - Illustration Area */}
        <div className="hidden lg:block lg:col-span-5" />

      </div>

      {/* SCROLL DOWN INDICATOR */}
      <div className="z-20 relative flex justify-center mt-8 sm:mt-10 pointer-events-auto">
        <a
          href="#features"
          className="group flex flex-col items-center gap-1 cursor-pointer text-[#bdbdbd] hover:text-white transition-colors duration-300"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.25em]">
            Scroll Down
          </span>
          <ChevronDown
            size={15}
            className="text-[#ff453a] animate-bounce"
          />
        </a>
      </div>

      {/* Demo Video Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#111111] border border-white/[0.08] rounded-2xl max-w-3xl w-full p-6 relative space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Play size={18} className="text-[#ff453a]" /> KIITAnumaan Walkthrough
              </h3>
              <button
                onClick={() => setShowDemoModal(false)}
                className="text-[#bdbdbd] hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="aspect-video bg-[#090909] rounded-xl border border-white/[0.08] flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#1A1A1A] border border-[#ff453a]/40 flex items-center justify-center text-[#ff453a]">
                <Play size={28} fill="currentColor" className="ml-1" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Interactive Platform Demo</h4>
                <p className="text-xs text-[#bdbdbd] mt-1 max-w-md">
                  Experience AI Exam Prediction, PYQ repository, ATS Resume Checker, and Section Swap live in action.
                </p>
              </div>
              <Link
                href="/workspace"
                onClick={() => setShowDemoModal(false)}
                className="bg-gradient-to-r from-[#ff3b30] to-[#ff5a4f] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-[18px] hover:scale-[1.03] transition-all"
              >
                Launch Workspace
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
