'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const navLinks = [
  { name: 'Academic', href: '#features' },
  { name: 'Campus', href: '#features' },
  { name: 'Career', href: '#features' },
  { name: 'About', href: '#workspace-overview' },
  { name: 'Resources', href: '#workspace-overview' },
  { name: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 w-full h-[80px] transition-all duration-300 border-b border-[rgba(255,255,255,0.05)]',
        scrolled
          ? 'bg-[#080808]/85 backdrop-blur-md border-[rgba(255,255,255,0.08)] shadow-lg'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-6 lg:px-12">

        {/* Left: Brand Logo & Subtitle */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-tight text-white group-hover:text-[#FF3B30] transition-colors">
              KIITAnumaan
            </span>
            <span className="text-[9px] font-bold tracking-widest uppercase text-[#9CA3AF]">
              Student Platform
            </span>
          </div>
        </Link>

        {/* Middle Navigation: Academic, Campus, Career, About, Resources, Contact */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="hover-underline-animation text-xs font-bold uppercase tracking-wider text-[#9CA3AF] hover:text-white transition-colors py-1"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right Side: GitHub, LinkedIn, Sign In, Get Started */}
        <div className="flex items-center gap-5">
          {/* Social Links */}
          <div className="hidden sm:flex items-center gap-3 pr-2 border-r border-[rgba(255,255,255,0.08)]">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-[#9CA3AF] hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="text-[#9CA3AF] hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
            </a>
          </div>

          {/* Direct Workspace Entry */}
          <Link
            href="/workspace"
            className="bg-[#FF3B30] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl hover:bg-[#E03126] transition-all active:scale-95 shadow-[0_0_15px_rgba(255,59,48,0.25)]"
          >
            Open Workspace
          </Link>
        </div>

      </div>
    </header>
  )
}
