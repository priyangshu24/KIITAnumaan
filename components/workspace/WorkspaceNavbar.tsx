'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Search,
  Bell,
  Moon,
  Sun,
  Laptop,
  X,
  CheckCircle2,
  FileText,
  Sparkles,
  ChevronDown,
} from 'lucide-react'

const sampleNotifications = [
  {
    id: '1',
    title: 'AI Paper Prediction Ready',
    message: 'Operating Systems (CS-3004) End-Sem prediction is now 94.8% generated.',
    time: '10m ago',
    type: 'ai',
    unread: true,
  },
  {
    id: '2',
    title: 'Section Swap Request Match',
    message: 'Student B (22051904) requested swap for CSE-04 to CSE-14.',
    time: '1h ago',
    type: 'swap',
    unread: true,
  },
  {
    id: '3',
    title: 'HighRadius Recruitment Drive',
    message: 'Online Assessment schedule released for Batch 2026.',
    time: '3h ago',
    type: 'career',
    unread: false,
  },
]

type ThemeMode = 'dark' | 'light' | 'system'

export default function WorkspaceNavbar() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState(sampleNotifications)
  const [theme, setTheme] = useState<ThemeMode>('dark')
  const [showThemeMenu, setShowThemeMenu] = useState(false)

  const unreadCount = notifications.filter((n) => n.unread).length

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })))
  }

  const handleSelectTheme = (mode: ThemeMode) => {
    setTheme(mode)
    setShowThemeMenu(false)
  }

  // Theme Switching Effect (Defaults to Dark Theme)
  useEffect(() => {
    const root = document.documentElement

    if (theme === 'light') {
      root.classList.add('light')
      root.classList.remove('dark')
    } else if (theme === 'system') {
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (isSystemDark) {
        root.classList.add('dark')
        root.classList.remove('light')
      } else {
        root.classList.add('light')
        root.classList.remove('dark')
      }
    } else {
      // Dark (Default)
      root.classList.add('dark')
      root.classList.remove('light')
    }
  }, [theme])

  return (
    <header className="h-[56px] py-1 sticky top-0 z-20 flex items-center justify-between gap-4 px-2 sm:px-4 bg-transparent">
      {/* Left-Aligned Search Bar (Dark Transparent Notch) */}
      <div className="w-72 sm:w-80 md:w-[480px]">
        <div className="flex items-center bg-[#111214]/80 border border-white/[0.06] rounded-full h-[44px] px-5 backdrop-blur-md shadow-sm focus-within:border-[#FF453A]/60 focus-within:bg-[#111214] transition-all duration-200">
          <Search size={16} className="text-[#8A8A8A] mr-3 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search papers, notes, PYQs..."
            className="w-full bg-transparent text-xs text-white placeholder-[#8A8A8A] outline-none font-medium"
          />
        </div>
      </div>

      {/* Right Controls: Notifications, Interactive Theme Selector, Profile Avatar Pill */}
      <div className="flex items-center gap-3 sm:gap-4">
        
        {/* Notifications Bell Button */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications)
              setShowThemeMenu(false)
            }}
            className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-[#8A8A8A] hover:text-white transition-all relative"
            aria-label="Notifications"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#FF453A] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#111214] border border-white/15 rounded-2xl shadow-2xl p-4 space-y-3 z-50 backdrop-blur-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Notifications
                  </h4>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 bg-[#FF453A]/20 text-[#FF453A] text-[9px] font-bold rounded-full border border-[#FF453A]/30">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={markAllRead}
                    className="text-[10px] text-[#FF453A] hover:underline font-semibold"
                  >
                    Mark all read
                  </button>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-[#8A8A8A] hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-2.5 rounded-xl border text-xs transition-colors ${
                      item.unread
                        ? 'bg-white/[0.04] border-[#FF453A]/30'
                        : 'bg-transparent border-transparent text-[#8A8A8A]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        {item.type === 'ai' && <Sparkles size={12} className="text-[#FF453A]" />}
                        {item.type === 'swap' && <FileText size={12} className="text-yellow-400" />}
                        {item.type === 'career' && <CheckCircle2 size={12} className="text-green-400" />}
                        {item.title}
                      </span>
                      <span className="text-[9px] font-mono text-[#8A8A8A]">{item.time}</span>
                    </div>
                    <p className="text-[11px] text-[#8A8A8A] mt-1 leading-snug">
                      {item.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Interactive Theme Selector Dropdown (Dark, Light, System Default) */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => {
              setShowThemeMenu(!showThemeMenu)
              setShowNotifications(false)
            }}
            className="flex items-center gap-2 px-3.5 py-2 h-[44px] rounded-full bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] text-xs text-[#8A8A8A] hover:text-white font-medium transition-all"
          >
            {theme === 'dark' && <Moon size={14} className="text-[#FF453A]" />}
            {theme === 'light' && <Sun size={14} className="text-amber-400" />}
            {theme === 'system' && <Laptop size={14} className="text-blue-400" />}

            <span className="capitalize">{theme === 'dark' ? 'Dark' : theme === 'light' ? 'Light' : 'System'}</span>
            <ChevronDown size={13} className={`transition-transform duration-200 ${showThemeMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* Theme Options Dropdown Menu */}
          {showThemeMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-[#111214] border border-white/15 rounded-xl shadow-2xl p-1.5 space-y-1 z-50">
              <button
                onClick={() => handleSelectTheme('dark')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  theme === 'dark'
                    ? 'bg-white/[0.08] text-white'
                    : 'text-[#8A8A8A] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Moon size={14} className="text-[#FF453A]" />
                <span>Dark</span>
              </button>

              <button
                onClick={() => handleSelectTheme('light')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  theme === 'light'
                    ? 'bg-white/[0.08] text-white'
                    : 'text-[#8A8A8A] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Sun size={14} className="text-amber-400" />
                <span>Light</span>
              </button>

              <button
                onClick={() => handleSelectTheme('system')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  theme === 'system'
                    ? 'bg-white/[0.08] text-white'
                    : 'text-[#8A8A8A] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Laptop size={14} className="text-blue-400" />
                <span>System</span>
              </button>
            </div>
          )}
        </div>

        {/* User Profile Avatar Pill */}
        <Link href="/workspace/profile" className="flex items-center gap-2.5 h-[44px] px-4 rounded-full bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] transition-all">
          <div className="w-7 h-7 rounded-full bg-[#FF453A] text-white flex items-center justify-center font-bold text-xs shadow-sm">
            SS
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-bold text-white leading-tight">Soumya S.</span>
            <span className="text-[10px] text-[#8A8A8A] font-mono">CSE · Sem 6</span>
          </div>
        </Link>

      </div>
    </header>
  )
}
