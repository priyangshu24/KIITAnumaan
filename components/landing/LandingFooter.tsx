'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function LandingFooter() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.08)] bg-[#080808] py-8 px-6 lg:px-12">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#9CA3AF]">
        {/* Minimal Navigation Links */}
        <div className="flex flex-wrap items-center gap-6 font-semibold uppercase text-[11px] tracking-wider">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            GitHub
          </a>
          <Link href="/login" className="hover:text-white transition-colors">
            Login
          </Link>
          <Link href="/signup" className="hover:text-white transition-colors">
            Sign Up
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-[10px] font-mono uppercase tracking-widest text-[#6B7280]">
          &copy; {new Date().getFullYear()} KIITAnumaan. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
