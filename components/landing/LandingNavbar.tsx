'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

const navItems = [
  { name: 'Features', href: '#features', id: 'features' },
  { name: 'Modules', href: '#modules', id: 'modules' },
  { name: 'About', href: '#about', id: 'about' },
  { name: 'Contact', href: '#contact', id: 'contact' },
]

export default function LandingNavbar() {
  const [activeSection, setActiveSection] = useState('features')
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const { scrollY } = useScroll()

  // Ultra-smooth spring-interpolated scroll progress (0 to 1 over 0 to 40px scroll)
  const rawProgress = useTransform(scrollY, [0, 40], [0, 1])
  const scrollProgress = useSpring(rawProgress, {
    stiffness: 220,
    damping: 26,
    mass: 0.3,
  })

  // Dynamic spring values for silky 60fps interpolation
  const bgOpacity = useTransform(scrollProgress, [0, 1], [0, 0.72])
  const blurVal = useTransform(scrollProgress, [0, 1], [0, 28])
  const saturateVal = useTransform(scrollProgress, [0, 1], [100, 180])
  const borderOpacity = useTransform(scrollProgress, [0, 1], [0, 0.08])
  const shadowAlpha = useTransform(scrollProgress, [0, 1], [0, 0.45])
  const redGlowAlpha = useTransform(scrollProgress, [0, 1], [0, 0.08])

  // Combine interpolated values into motion CSS styles
  const backgroundColor = useTransform(bgOpacity, (v) => `rgba(10, 10, 10, ${v})`)
  const backdropFilter = useTransform(
    [blurVal, saturateVal],
    ([b, s]) => `blur(${b}px) saturate(${s}%)`
  )
  const borderColor = useTransform(borderOpacity, (v) => `rgba(255, 255, 255, ${v})`)
  const boxShadow = useTransform(
    [shadowAlpha, redGlowAlpha],
    ([s, r]) => `0 18px 45px rgba(0, 0, 0, ${s}), 0 0 20px rgba(255, 0, 0, ${r})`
  )

  // Logo scroll animation values with subtle micro-blur: opacity 1 -> 0, y 0 -> -6, blur 0 -> 4px
  const logoOpacity = useTransform(scrollProgress, [0, 1], [1, 0])
  const logoY = useTransform(scrollProgress, [0, 1], [0, -6])
  const logoScale = useTransform(scrollProgress, [0, 1], [1, 0.97])
  const logoBlur = useTransform(scrollProgress, [0, 1], [0, 4])
  const logoFilter = useTransform(logoBlur, (b) => `blur(${b}px)`)
  const logoPointerEvents = useTransform(scrollProgress, (v) => (v > 0.8 ? 'none' : 'auto'))

  // Scroll spy to detect active section on page scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 220
      for (let i = navItems.length - 1; i >= 0; i--) {
        const item = navItems[i]
        const element = document.getElementById(item.id)
        if (element) {
          const top = element.offsetTop
          if (scrollPosition >= top) {
            setActiveSection(item.id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const activeIndex = navItems.findIndex((item) => item.id === activeSection)
  const highlightedIndex = hoveredIndex !== null ? hoveredIndex : (activeIndex >= 0 ? activeIndex : 0)

  return (
    <header className="fixed top-[20px] left-0 right-0 z-[9999] w-full px-6 lg:px-12 pointer-events-none">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between pointer-events-auto relative">
        
        {/* LOGO ON LEFT - Ultra-smoothly hides on scroll */}
        <motion.div
          style={{
            opacity: logoOpacity,
            y: logoY,
            scale: logoScale,
            filter: logoFilter,
            pointerEvents: logoPointerEvents,
          }}
          className="relative z-10 flex-shrink-0 will-change-[transform,opacity,filter]"
        >
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#ff453a] flex items-center justify-center font-black text-white text-sm shadow-[0_0_15px_rgba(255,69,58,0.4)] transition-transform duration-300 group-hover:scale-105">
              K
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight leading-tight">
                <span className="text-[#ff453a]">KIIT</span>
                <span className="text-white">Anumaan</span>
              </span>
              <span className="text-[9px] font-semibold tracking-widest uppercase text-[#bdbdbd]">
                STUDENT PLATFORM
              </span>
            </div>
          </Link>
        </motion.div>

        {/* CENTER FLOATING GLASS NOTCH PILL strictly enclosing Features to Contact */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center justify-center">
          <motion.nav
            style={{
              backgroundColor,
              backdropFilter,
              borderColor,
              boxShadow,
            }}
            onMouseLeave={() => setHoveredIndex(null)}
            className="hidden md:flex items-center justify-center gap-1 px-3.5 h-[50px] rounded-full border transition-all duration-150 relative will-change-[transform,opacity,backdrop-filter]"
          >
            {navItems.map((item, index) => {
              const isHighlighted = highlightedIndex === index

              return (
                <a
                  key={item.name}
                  href={item.href}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onClick={(e) => {
                    setActiveSection(item.id)
                    const targetEl = document.getElementById(item.id)
                    if (targetEl) {
                      e.preventDefault()
                      targetEl.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                  className={`relative px-5 py-2 text-xs font-semibold tracking-wider transition-colors duration-150 rounded-full select-none flex items-center justify-center ${
                    isHighlighted ? 'text-white' : 'text-white/70 hover:text-white'
                  }`}
                >
                  <span className="relative z-20 pointer-events-none">{item.name}</span>

                  {/* Liquid Glass Pill Highlight that smoothly glides with cursor */}
                  {isHighlighted && (
                    <motion.div
                      layoutId="navbar-glass-pill"
                      className="absolute inset-0 rounded-full bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] border border-white/15 z-10"
                      transition={{
                        type: 'spring',
                        stiffness: 650,
                        damping: 35,
                        mass: 0.3,
                      }}
                    />
                  )}

                  {/* Glowing Red Accent Underline Bar with Solid Red Gradient */}
                  {isHighlighted && (
                    <motion.span
                      layoutId="navbar-red-indicator"
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-[2.5px] rounded-full shadow-[0_0_12px_#ff453a] z-30"
                      style={{
                        background: 'linear-gradient(180deg, #FF4040, #E50914)',
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 650,
                        damping: 35,
                        mass: 0.3,
                      }}
                    />
                  )}
                </a>
              )
            })}
          </motion.nav>
        </div>

        {/* RIGHT SIDE: LOGIN & GET STARTED */}
        <div className="relative z-10 flex-shrink-0 flex items-center gap-4">
          <Link
            href="/login"
            className="text-xs font-semibold uppercase tracking-wider text-[#bdbdbd] hover:text-white transition-colors px-3 py-2"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-gradient-to-r from-[#ff3b30] to-[#ff5a4f] text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-[18px] hover:scale-[1.03] transition-all duration-[250ms] active:scale-95 shadow-[0_0_20px_rgba(255,59,48,0.3)] flex items-center gap-1.5"
          >
            Get Started <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </header>
  )
}



