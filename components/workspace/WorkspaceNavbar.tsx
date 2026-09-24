'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Search,
  Bell,
  Moon,
  X,
  CheckCircle2,
  FileText,
  Sparkles,
  LogOut,
  UserRound,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

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

export default function WorkspaceNavbar() {
  const router = useRouter()
  const [supabase] = useState(() => createClient())
  const [user, setUser] = useState<User | null>(null)
  const [showProfile, setShowProfile] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState(sampleNotifications)

  const unreadCount = notifications.filter((n) => n.unread).length

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })))
  }

  // This app only has a dark theme implemented — every page uses hardcoded
  // dark backgrounds, so there is no light-mode styling to switch to.
  useEffect(() => {
    document.documentElement.classList.add('dark')
    document.documentElement.classList.remove('light')
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null))
    return () => sub.subscription.unsubscribe()
  }, [supabase])

  const fullName = (user?.user_metadata as { full_name?: string } | undefined)?.full_name || user?.email?.split('@')[0] || 'Guest'
  const initials = fullName.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('') || '?'

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setShowProfile(false)
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="h-[56px] py-1 sticky top-0 z-20 flex items-center justify-end gap-4 px-2 sm:px-4 bg-transparent">
      {/* Right Controls: Notifications, Interactive Theme Selector, Profile Avatar Pill */}
      <div className="flex items-center gap-3 sm:gap-4">
        
        {/* Notifications Bell Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
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

        {/* Dark Theme Indicator (this app has no light-mode styling to switch to) */}
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 h-[44px] rounded-full bg-white/[0.04] border border-white/10 text-xs text-[#8A8A8A] font-medium">
          <Moon size={14} className="text-[#FF453A]" />
          <span>Dark</span>
        </div>

        {/* User Profile Avatar Pill */}
        <div className="relative">
          <button
            onClick={() => setShowProfile((v) => !v)}
            className="flex items-center gap-2.5 h-[44px] px-4 rounded-full bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] transition-all cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-[#FF453A] text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
              {initials}
            </div>
            <div className="hidden md:flex flex-col text-left min-w-0">
              <span className="text-xs font-bold text-white leading-tight truncate max-w-[120px]">{fullName}</span>
              <span className="text-[10px] text-[#8A8A8A] font-mono">{user ? 'Signed in' : 'Guest — sign in to sync'}</span>
            </div>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-3 w-56 bg-[#111214] border border-white/15 rounded-2xl shadow-2xl p-1.5 z-50 backdrop-blur-2xl">
              {user ? (
                <>
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <p className="text-xs font-bold text-white truncate">{fullName}</p>
                    <p className="text-[10px] text-[#8A8A8A] font-mono truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/workspace/profile"
                    onClick={() => setShowProfile(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#D1D5DB] hover:text-white hover:bg-white/[0.06] transition-colors"
                  >
                    <UserRound size={14} /> Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#FF453A] hover:bg-[#FF453A]/10 transition-colors cursor-pointer"
                  >
                    <LogOut size={14} /> Sign out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setShowProfile(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-white hover:bg-white/[0.06] transition-colors"
                >
                  <UserRound size={14} /> Sign in
                </Link>
              )}
            </div>
          )}
        </div>

      </div>
    </header>
  )
}


