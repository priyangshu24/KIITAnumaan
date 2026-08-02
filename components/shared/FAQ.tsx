'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const faqItems = [
  {
    q: 'What is KIITAnumaan?',
    a: 'KIITAnumaan is a unified AI-powered Academic & Career Workspace engineered specifically for KIIT University students. It combines previous year papers, AI topic prediction, handwritten notes, ATS resume tools, and placement tracking into one minimal platform.',
  },
  {
    q: 'How accurate is the AI Exam Topic Predictor?',
    a: 'Our AI model analyzes historical KIIT examination patterns, mid-term/end-term question weightage, and syllabus topics to deliver topic forecasts with up to 95% accuracy for core CSE, IT, and ECE subjects.',
  },
  {
    q: 'Are the Previous Year Papers (PYQs) verified?',
    a: 'Yes, all PYQs are verified by top department rankers and categorized strictly by course code, semester, exam type (mid-term/end-term), and academic year.',
  },
  {
    q: 'Does the Resume Builder pass ATS screening?',
    a: 'Absolutely. The Resume Builder generates single-page, ATS-optimized plain text PDF templates designed to match recruiter keyword scanners used by top technical campus drives.',
  },
  {
    q: 'Is KIITAnumaan free for all KIIT students?',
    a: 'Yes! KIITAnumaan is built by students, for students. All core academic modules, notes, PYQ downloads, and career tools are completely free to access.',
  },
]

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx)
  }

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {faqItems.map((item, idx) => {
        const isOpen = openIdx === idx
        return (
          <div
            key={item.q}
            className="border border-[rgba(255,255,255,0.08)] bg-[#161616] rounded-2xl overflow-hidden transition-all duration-200"
          >
            <button
              type="button"
              onClick={() => toggle(idx)}
              className="w-full flex items-center justify-between p-6 text-left"
            >
              <span className="text-base font-bold text-white uppercase tracking-wide">
                {item.q}
              </span>
              <ChevronDown
                size={18}
                className={cn('text-[#FF3B30] transition-transform duration-200', isOpen && 'rotate-180')}
              />
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="px-6 pb-6 text-xs text-[#9CA3AF] leading-relaxed border-t border-[rgba(255,255,255,0.04)] pt-4">
                    {item.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
