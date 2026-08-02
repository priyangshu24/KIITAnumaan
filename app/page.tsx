'use client'

import LandingNavbar from '@/components/landing/LandingNavbar'
import HeroSection from '@/components/landing/HeroSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import WorkspacePreviewSection from '@/components/landing/WorkspacePreviewSection'
import ContactSection from '@/components/landing/ContactSection'
import LandingFooter from '@/components/landing/LandingFooter'

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#080808] text-white selection:bg-[#FF3B30] selection:text-white overflow-x-hidden">
      {/* UNIFIED CONTINUOUS GLOBAL BACKGROUND GRID (100% Seamless across all sections) */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0" />

      {/* AMBIENT SOFT RADIAL RED LIGHT GLOW */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(255,69,58,0.07),transparent_70%)] pointer-events-none z-0" />

      <LandingNavbar />
      <main className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <WorkspacePreviewSection />
        <ContactSection />
      </main>
      <LandingFooter />
    </div>
  )
}

