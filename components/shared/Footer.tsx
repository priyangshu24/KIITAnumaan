'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.08)] bg-[#080808] pt-16 pb-12 px-6 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[rgba(255,255,255,0.05)]">

          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white">
                KIITAnumaan
              </span>
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#71717A] mt-0.5">
                AI Academic & Career Workspace
              </span>
            </Link>
            <p className="text-xs text-[#71717A] leading-relaxed max-w-xs font-medium">
              Enterprise workspace tailored for KIIT University students, faculty, and placement preparation.
            </p>
          </div>

          {/* Col 2: Academic */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#A1A1AA]">Academic</h4>
            <ul className="space-y-2 text-xs font-medium text-[#71717A]">
              <li><Link href="/academic" className="hover:text-white transition-colors">AI Predicted Papers</Link></li>
              <li><Link href="/academic" className="hover:text-white transition-colors">PYQ Library</Link></li>
              <li><Link href="/academic" className="hover:text-white transition-colors">Notes Repository</Link></li>
              <li><Link href="/academic" className="hover:text-white transition-colors">Timetable Planner</Link></li>
            </ul>
          </div>

          {/* Col 3: Career & Campus */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#A1A1AA]">Workspace</h4>
            <ul className="space-y-2 text-xs font-medium text-[#71717A]">
              <li><Link href="/career" className="hover:text-white transition-colors">Resume Builder</Link></li>
              <li><Link href="/career" className="hover:text-white transition-colors">ATS Checker</Link></li>
              <li><Link href="/career" className="hover:text-white transition-colors">Placement Roadmap</Link></li>
              <li><Link href="/campus" className="hover:text-white transition-colors">Faculty Ratings & Swap</Link></li>
            </ul>
          </div>

          {/* Col 4: Platform & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#A1A1AA]">Platform</h4>
            <ul className="space-y-2 text-xs font-medium text-[#71717A]">
              <li><Link href="/workspace" className="hover:text-white transition-colors">Open Workspace</Link></li>
              <li><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub Repository</a></li>
              <li><span className="text-[#22C55E] font-semibold">● Operational</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[#71717A] uppercase tracking-wider">
          <span>&copy; {new Date().getFullYear()} KIITANUMAAN · ENTERPRISE SAAS PLATFORM</span>
          <span>WCAG AA COMPLIANT · DARK-FIRST</span>
        </div>
      </div>
    </footer>
  )
}
