'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  GraduationCap,
  MapPin,
  Briefcase,
  Users,
  User,
  LogOut,
  ChevronRight,
  Sparkles,
  FileText,
  BookOpen,
  Bookmark,
  Calendar,
  Navigation,
  ArrowRightLeft,
  CheckCircle2,
  Compass,
} from 'lucide-react'

// Academic Submenu items specification
const academicSubmenu = [
  { name: 'Predicted Questions', href: '/workspace/academic/predicted-questions', icon: Sparkles },
  { name: 'PYQ Library', href: '/workspace/academic/pyq-library', icon: BookOpen },
  { name: 'Notes Library', href: '/workspace/academic/notes-library', icon: FileText },
  { name: 'Important Topics', href: '/workspace/academic/important-topics', icon: Bookmark },
  { name: 'Class Timetable', href: '/workspace/academic/class-timetable', icon: Calendar },
]


// Campus Submenu items specification
const campusSubmenu = [
  { name: 'Campus Navigation', tab: 'navigation', icon: Navigation },
  { name: 'Faculty Directory', tab: 'faculty', icon: Users },
  { name: 'Section Swap', tab: 'section-swap', icon: ArrowRightLeft },
]

// Career Submenu items specification
const careerSubmenu = [
  { name: 'Resume Builder', tab: 'resume-builder', icon: FileText },
  { name: 'ATS Checker', tab: 'ats-checker', icon: CheckCircle2 },
  { name: 'Placement Planner', tab: 'placement-planner', icon: Calendar },
  { name: 'AI Blueprint', tab: 'ai-blueprint', icon: Compass },
]

const mainNavItems = [
  {
    name: 'Profile & Settings',
    href: '/workspace/profile',
    icon: User,
  },
]


export default function WorkspaceSidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const [isHovered, setIsHovered] = useState(false)
  const [isManuallyCollapsed] = useState(false)
  const [isAcademicOpen, setIsAcademicOpen] = useState(false)
  const [isCampusOpen, setIsCampusOpen] = useState(false)
  const [isCareerOpen, setIsCareerOpen] = useState(false)

  const isExpanded = isHovered && !isManuallyCollapsed
  const isAcademicActive = pathname.startsWith('/workspace/academic')
  const isCampusActive = pathname.startsWith('/workspace/campus')
  const isCareerActive = pathname.startsWith('/workspace/career')
  const currentTab = searchParams.get('tab') || ''

  const handleAcademicClick = () => {
    if (pathname !== '/workspace/academic') {
      router.push('/workspace/academic')
    }
  }

  const handleAcademicChevronClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsAcademicOpen((prev) => !prev)
  }

  const handleCampusClick = () => {
    if (pathname !== '/workspace/campus') {
      router.push('/workspace/campus')
    }
  }

  const handleCampusChevronClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsCampusOpen((prev) => !prev)
  }

  const handleCareerClick = () => {
    if (pathname !== '/workspace/career') {
      router.push('/workspace/career')
    }
  }

  const handleCareerChevronClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsCareerOpen((prev) => !prev)
  }

  const handleExit = () => {
    router.push('/')
  }

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed top-[12px] left-[12px] h-[calc(100vh-24px)] shrink-0 z-40 flex flex-col gap-3 transition-[width] duration-350 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
        isExpanded ? 'w-[260px]' : 'w-[88px]'
      }`}
    >
      {/* PART 1: Top Floating Navigation Card (Ends right after Profile & Settings) */}
      <div className="shrink-0 h-fit max-h-[calc(100vh-100px)] bg-[#0B0B0D] border border-white/[0.05] shadow-[0_12px_36px_rgba(0,0,0,0.3)] rounded-[24px] p-3 flex flex-col overflow-hidden">
        {/* 1. FIXED TOP LOGO SECTION (Never Scrolls) */}
        <div className="flex items-center justify-start px-2 pt-1 pb-3 border-b border-white/[0.05] h-[52px] shrink-0 bg-[#0B0B0D] z-10">
          <Link href="/workspace/academic" className="flex items-center gap-3 group">
            <div className="w-[38px] h-[38px] rounded-xl bg-[#FF453A] flex items-center justify-center font-extrabold text-white text-base transition-transform duration-200 group-hover:scale-105 shrink-0 shadow-sm">
              K
            </div>
            <span
              className={`text-sm font-bold text-white tracking-tight whitespace-nowrap transition-all duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
                isExpanded
                  ? 'opacity-100 translate-x-0 delay-[80ms]'
                  : 'opacity-0 translate-x-3 pointer-events-none'
              }`}
            >
              <span className="text-[#FF453A]">KIIT</span>Anumaan
            </span>
          </Link>
        </div>

        {/* 2. SCROLLABLE MIDDLE NAVIGATION MENU */}
        <nav className="overflow-y-auto overflow-x-hidden space-y-1.5 py-3 pr-0.5 max-h-[calc(100vh-180px)]">
          
          {/* ACADEMIC WORKSPACE EXPANDABLE ACCORDION GROUP */}
          <div className="space-y-1">
            <div
              onClick={handleAcademicClick}
              className={`group relative flex items-center justify-between px-3.5 py-2.5 h-[48px] rounded-[16px] text-xs font-semibold cursor-pointer transition-all duration-200 ${
                isAcademicActive
                  ? 'bg-[#141418] border border-white/[0.06] text-white'
                  : 'bg-transparent text-[#8A8A8A] hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              {isAcademicActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 rounded-r-full bg-[#FF453A]" />
              )}

              <div className="flex items-center gap-3.5 min-w-0 pl-1">
                <GraduationCap
                  size={20}
                  className={`shrink-0 transition-transform duration-200 group-hover:scale-[1.05] ${
                    isAcademicActive ? 'text-[#FF453A]' : 'text-[#71717A] group-hover:text-white'
                  }`}
                />
                <span
                  className={`whitespace-nowrap truncate transition-all duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
                    isExpanded
                      ? 'opacity-100 translate-x-0 delay-[80ms]'
                      : 'opacity-0 translate-x-3 pointer-events-none'
                  }`}
                >
                  Academic Workspace
                </span>
              </div>

              {isExpanded && (
                <button
                  type="button"
                  onClick={handleAcademicChevronClick}
                  className="p-1 hover:bg-white/10 rounded-md transition-colors shrink-0"
                  aria-label="Toggle Submenu"
                >
                  <ChevronRight
                    size={16}
                    className={`text-[#71717A] group-hover:text-white transition-transform duration-250 ease-in-out ${
                      isAcademicOpen ? 'rotate-90' : 'rotate-0'
                    }`}
                  />
                </button>
              )}
            </div>

            {/* Submenu Container with Tree Connector Lines */}
            <div
              className={`relative overflow-hidden transition-all duration-250 ease-in-out pl-[24px] ${
                isAcademicOpen && isExpanded
                  ? 'max-h-[300px] opacity-100 translate-y-0 py-1'
                  : 'max-h-0 opacity-0 -translate-y-2 pointer-events-none py-0'
              }`}
            >
              <div className="absolute left-[12px] top-1 bottom-4 w-[1px] bg-white/15" />
              <div className="space-y-1">
                {academicSubmenu.map((sub, index) => {
                  const SubIcon = sub.icon
                  const isSubActive = pathname === sub.href

                  return (
                    <Link
                      key={sub.name}
                      href={sub.href}
                      style={{ transitionDelay: `${index * 30}ms` }}
                      className={`group relative flex items-center gap-3 h-[40px] px-3 rounded-[10px] text-[14px] font-medium transition-all duration-200 ${
                        isSubActive
                          ? 'bg-[#141418] text-white font-semibold'
                          : 'bg-transparent text-[#8A8A8A] hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <span className="absolute -left-[12px] top-1/2 -translate-y-1/2 w-[9px] h-[1px] bg-white/15" />
                      {isSubActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 rounded-r-full bg-[#FF453A]" />
                      )}
                      <SubIcon
                        size={16}
                        className={`shrink-0 transition-colors duration-200 ${
                          isSubActive ? 'text-[#FF453A]' : 'text-[#71717A] group-hover:text-white'
                        }`}
                      />
                      <span className="whitespace-nowrap truncate">{sub.name}</span>
                    </Link>
                  )
                })}
              </div>

            </div>
          </div>

          {/* ----------------------------------------------------
              CAMPUS WORKSPACE EXPANDABLE ACCORDION GROUP
          ---------------------------------------------------- */}
          <div className="space-y-1">
            <div
              onClick={handleCampusClick}
              className={`group relative flex items-center justify-between px-3.5 py-2.5 h-[48px] rounded-[16px] text-xs font-semibold cursor-pointer transition-all duration-200 ${
                isCampusActive
                  ? 'bg-[#141418] border border-white/[0.06] text-white'
                  : 'bg-transparent text-[#8A8A8A] hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              {isCampusActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 rounded-r-full bg-[#FF453A]" />
              )}

              <div className="flex items-center gap-3.5 min-w-0 pl-1">
                <MapPin
                  size={20}
                  className={`shrink-0 transition-transform duration-200 group-hover:scale-[1.05] ${
                    isCampusActive ? 'text-[#FF453A]' : 'text-[#71717A] group-hover:text-white'
                  }`}
                />
                <span
                  className={`whitespace-nowrap truncate transition-all duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
                    isExpanded
                      ? 'opacity-100 translate-x-0 delay-[80ms]'
                      : 'opacity-0 translate-x-3 pointer-events-none'
                  }`}
                >
                  Campus Workspace
                </span>
              </div>

              {isExpanded && (
                <button
                  type="button"
                  onClick={handleCampusChevronClick}
                  className="p-1 hover:bg-white/10 rounded-md transition-colors shrink-0"
                  aria-label="Toggle Campus Submenu"
                >
                  <ChevronRight
                    size={16}
                    className={`text-[#71717A] group-hover:text-white transition-transform duration-250 ease-in-out ${
                      isCampusOpen ? 'rotate-90' : 'rotate-0'
                    }`}
                  />
                </button>
              )}
            </div>

            {/* Campus Submenu Container with Tree Lines */}
            <div
              className={`relative overflow-hidden transition-all duration-250 ease-in-out pl-[24px] ${
                isCampusOpen && isExpanded
                  ? 'max-h-[200px] opacity-100 translate-y-0 py-1'
                  : 'max-h-0 opacity-0 -translate-y-2 pointer-events-none py-0'
              }`}
            >
              <div className="absolute left-[12px] top-1 bottom-4 w-[1px] bg-white/15" />
              <div className="space-y-1">
                {campusSubmenu.map((sub, index) => {
                  const SubIcon = sub.icon
                  const isSubActive = isCampusActive && currentTab === sub.tab

                  return (
                    <Link
                      key={sub.name}
                      href={`/workspace/campus?tab=${sub.tab}`}
                      style={{ transitionDelay: `${index * 30}ms` }}
                      className={`group relative flex items-center gap-3 h-[40px] px-3 rounded-[10px] text-[14px] font-medium transition-all duration-200 ${
                        isSubActive
                          ? 'bg-[#141418] text-white font-semibold'
                          : 'bg-transparent text-[#8A8A8A] hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <span className="absolute -left-[12px] top-1/2 -translate-y-1/2 w-[9px] h-[1px] bg-white/15" />
                      {isSubActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 rounded-r-full bg-[#FF453A]" />
                      )}
                      <SubIcon
                        size={16}
                        className={`shrink-0 transition-colors duration-200 ${
                          isSubActive ? 'text-[#FF453A]' : 'text-[#71717A] group-hover:text-white'
                        }`}
                      />
                      <span className="whitespace-nowrap truncate">{sub.name}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------
              CAREER WORKSPACE EXPANDABLE ACCORDION GROUP
          ---------------------------------------------------- */}
          <div className="space-y-1">
            <div
              onClick={handleCareerClick}
              className={`group relative flex items-center justify-between px-3.5 py-2.5 h-[48px] rounded-[16px] text-xs font-semibold cursor-pointer transition-all duration-200 ${
                isCareerActive
                  ? 'bg-[#141418] border border-white/[0.06] text-white'
                  : 'bg-transparent text-[#8A8A8A] hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              {isCareerActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 rounded-r-full bg-[#FF453A]" />
              )}

              <div className="flex items-center gap-3.5 min-w-0 pl-1">
                <Briefcase
                  size={20}
                  className={`shrink-0 transition-transform duration-200 group-hover:scale-[1.05] ${
                    isCareerActive ? 'text-[#FF453A]' : 'text-[#71717A] group-hover:text-white'
                  }`}
                />
                <span
                  className={`whitespace-nowrap truncate transition-all duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
                    isExpanded
                      ? 'opacity-100 translate-x-0 delay-[80ms]'
                      : 'opacity-0 translate-x-3 pointer-events-none'
                  }`}
                >
                  Career Workspace
                </span>
              </div>

              {isExpanded && (
                <button
                  type="button"
                  onClick={handleCareerChevronClick}
                  className="p-1 hover:bg-white/10 rounded-md transition-colors shrink-0"
                  aria-label="Toggle Career Submenu"
                >
                  <ChevronRight
                    size={16}
                    className={`text-[#71717A] group-hover:text-white transition-transform duration-250 ease-in-out ${
                      isCareerOpen ? 'rotate-90' : 'rotate-0'
                    }`}
                  />
                </button>
              )}
            </div>

            {/* Career Submenu Container with Tree Lines */}
            <div
              className={`relative overflow-hidden transition-all duration-250 ease-in-out pl-[24px] ${
                isCareerOpen && isExpanded
                  ? 'max-h-[250px] opacity-100 translate-y-0 py-1'
                  : 'max-h-0 opacity-0 -translate-y-2 pointer-events-none py-0'
              }`}
            >
              <div className="absolute left-[12px] top-1 bottom-4 w-[1px] bg-white/15" />
              <div className="space-y-1">
                {careerSubmenu.map((sub, index) => {
                  const SubIcon = sub.icon
                  const isSubActive = isCareerActive && currentTab === sub.tab

                  return (
                    <Link
                      key={sub.name}
                      href={`/workspace/career?tab=${sub.tab}`}
                      style={{ transitionDelay: `${index * 30}ms` }}
                      className={`group relative flex items-center gap-3 h-[40px] px-3 rounded-[10px] text-[14px] font-medium transition-all duration-200 ${
                        isSubActive
                          ? 'bg-[#141418] text-[#FF453A] font-semibold'
                          : 'bg-transparent text-[#8A8A8A] hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <span className="absolute -left-[12px] top-1/2 -translate-y-1/2 w-[9px] h-[1px] bg-white/15" />
                      {isSubActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 rounded-r-full bg-[#FF453A]" />
                      )}
                      <SubIcon
                        size={16}
                        className={`shrink-0 transition-colors duration-200 ${
                          isSubActive ? 'text-[#FF453A]' : 'text-[#71717A] group-hover:text-white'
                        }`}
                      />
                      <span className="whitespace-nowrap truncate">{sub.name}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Other Main Navigation Items */}
          {mainNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname.startsWith(item.href)

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group relative flex items-center justify-between px-3.5 py-2.5 h-[48px] rounded-[16px] text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#141418] border border-white/[0.06] text-white'
                    : 'bg-transparent text-[#8A8A8A] hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 rounded-r-full bg-[#FF453A]" />
                )}

                <div className="flex items-center gap-3.5 min-w-0 pl-1">
                  <Icon
                    size={20}
                    className={`shrink-0 transition-transform duration-200 group-hover:scale-[1.05] ${
                      isActive ? 'text-[#FF453A]' : 'text-[#71717A] group-hover:text-white'
                    }`}
                  />
                  <span
                    className={`whitespace-nowrap truncate transition-all duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
                      isExpanded
                        ? 'opacity-100 translate-x-0 delay-[80ms]'
                        : 'opacity-0 translate-x-3 pointer-events-none'
                    }`}
                  >
                    {item.name}
                  </span>
                </div>

                {isActive && isExpanded && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF453A] shrink-0" />
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Exit back to the public site (no auth layer yet) */}
      <div className="pt-2 border-t border-white/[0.05] mt-auto shrink-0 z-10">
        <button
          onClick={handleExit}
          className="group relative flex items-center justify-between w-full px-3.5 py-2.5 h-[48px] rounded-[16px] text-xs font-semibold text-[#FF453A] hover:bg-[#FF453A]/10 transition-all duration-200 cursor-pointer"
        >
          <div className="flex items-center gap-3.5 min-w-0 pl-1">
            <LogOut
              size={20}
              className="shrink-0 text-[#FF453A] transition-transform duration-200 group-hover:scale-105"
            />
            <span
              className={`whitespace-nowrap truncate transition-all duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
                isExpanded
                  ? 'opacity-100 translate-x-0 delay-[80ms]'
                  : 'opacity-0 translate-x-3 pointer-events-none'
              }`}
            >
              Exit Workspace
            </span>
          </div>
        </button>
      </div>
    </aside>
  )
}

