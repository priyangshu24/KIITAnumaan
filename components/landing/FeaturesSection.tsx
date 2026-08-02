'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  MapPin,
  Briefcase,
  Brain,
  FileText,
  Users,
  ArrowRight,
  Play,
  X,
  ChevronRight,
} from 'lucide-react'
import { motion } from 'framer-motion'

const modules = [
  {
    title: 'Academic Workspace',
    description: 'AI predicted papers, PYQs, notes, timetable',
    icon: BookOpen,
    href: '/workspace/academic',
  },
  {
    title: 'Campus Workspace',
    description: 'Campus navigation, buildings, hostels, parking',
    icon: MapPin,
    href: '/workspace/campus',
  },
  {
    title: 'Career Workspace',
    description: 'Resume Builder, Placement Tracker, Interview Preparation',
    icon: Briefcase,
    href: '/workspace/career',
  },
  {
    title: 'AI Workspace',
    description: 'AI Exam Prediction, Study Assistant, Personalized recommendations',
    icon: Brain,
    href: '/workspace/ai-assistant',
  },
  {
    title: 'Placement Workspace',
    description: 'Company Insights, Previous Placements, Salary Statistics',
    icon: FileText,
    href: '/workspace/career?tab=placement',
  },
  {
    title: 'Community Workspace',
    description: 'Faculty Directory, Study Groups, Events',
    icon: Users,
    href: '/workspace/faculty',
  },
]

export default function FeaturesSection() {
  const [showDemoModal, setShowDemoModal] = useState(false)

  return (
    <section
      id="features"
      className="relative bg-transparent py-[100px] px-6 lg:px-12 text-white selection:bg-[#FF3B30] selection:text-white overflow-hidden"
    >
      {/* Floating subtle ambient red glow particle accents */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#080808] via-[#080808]/60 to-transparent pointer-events-none z-0" />
      <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-[#FF3B30]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-[#FF3B30]/5 blur-[150px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* SECTION TOP HEADER */}
        <div className="mb-12">
          <span className="text-[#FF3B30] text-xs font-black tracking-[0.25em] uppercase block mb-2">
            FEATURES PREVIEW
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-tight">
            Six Specialized Workspaces
          </h2>
          <p className="text-xs text-[#9CA3AF] mt-2 font-semibold uppercase tracking-wider">
            Engineered specifically for KIIT University students
          </p>
        </div>

        {/* 3-COLUMN GRID OF 6 FLOATING GLASS CARDS */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
            {modules.map((item) => {
              const Icon = item.icon

              return (
                <motion.div
                  key={item.title}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
                  }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className="group relative bg-transparent border border-white/10 rounded-[22px] p-6 hover:border-[#FF3B30] hover:bg-white/[0.03] hover:shadow-[0_12px_30px_rgba(255,59,48,0.15)] transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden backdrop-blur-sm"
                >
                  <div>
                    {/* Top 48x48 Icon Container */}
                    <div className="w-12 h-12 rounded-xl bg-transparent border border-[#FF3B30]/30 flex items-center justify-center text-[#FF3B30] mb-5 group-hover:bg-[#FF3B30]/10 group-hover:scale-105 transition-all">
                      <Icon size={22} />
                    </div>

                    {/* Title */}
                    <h3 className="text-[22px] font-bold text-white mb-2 leading-snug group-hover:text-[#FF3B30] transition-colors">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-[#9CA3AF] text-[15px] leading-relaxed line-clamp-2 mb-6 font-normal">
                      {item.description}
                    </p>
                  </div>

                  {/* Bottom Explore Link */}
                  <div className="pt-2 flex items-center">
                    <Link
                      href={item.href}
                      className="text-xs font-bold text-[#FF3B30] flex items-center gap-1.5 group-hover:gap-2.5 transition-all"
                    >
                      Explore <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              )
            })}
        </motion.div>

      </div>

      {/* Interactive Demo Video Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#111111] border border-white/10 rounded-2xl max-w-3xl w-full p-6 relative space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Play size={18} className="text-[#FF3B30]" /> KIITAnumaan Walkthrough
              </h3>
              <button
                onClick={() => setShowDemoModal(false)}
                className="text-[#bdbdbd] hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="aspect-video bg-[#090909] rounded-xl border border-white/10 flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#1A1A1A] border border-[#FF3B30]/40 flex items-center justify-center text-[#FF3B30]">
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
