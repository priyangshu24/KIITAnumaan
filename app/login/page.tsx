'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, Check } from 'lucide-react'

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  // Form states
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/workspace')
  }

  return (
    <div className="min-h-screen w-full bg-[#050505] flex flex-col lg:flex-row overflow-x-hidden">
      {/* ----------------------------------------------------
          LEFT SIDE: KIIT RED WIREFRAME HERO BACKGROUND (65%)
      ---------------------------------------------------- */}
      <div className="hidden lg:block lg:w-[65%] md:w-[55%] relative min-h-screen overflow-hidden">
        {/* Background Image - Object Cover, Crisp & Clearly Visible */}
        <img
          src="/kiit-campus-dotted.jpg"
          alt="KIIT Campus Illustration"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-85 transition-opacity duration-500"
        />

        {/* Subtle Black Overlay for Contrast */}
        <div className="absolute inset-0 bg-black/25" />

        {/* Smooth Gradient Fade toward Right Panel */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(5,5,5,0.2) 0%, rgba(5,5,5,0.4) 65%, #0b0b0d 100%)',
          }}
        />

        {/* Top-Left Branding Header */}
        <div className="absolute top-10 left-10 z-20 flex items-center gap-3 animate-in fade-in duration-500">
          <div className="w-10 h-10 rounded-xl bg-[#ff3b30] flex items-center justify-center font-black text-white text-lg shadow-lg shadow-[#ff3b30]/30 shrink-0">
            K
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-wide leading-none">
              KIIT<span className="text-[#ff3b30]">Anumaan</span>
            </h1>
            <p className="text-[11px] text-white/70 font-mono tracking-wider uppercase mt-1">
              AI Academic Workspace
            </p>
          </div>
        </div>

        {/* Bottom-Left Subtle Glass Feature Badges */}
        <div className="absolute bottom-10 left-10 z-20 flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.06] backdrop-blur-md border border-white/10 shadow-lg text-xs font-semibold text-white/90 hover:border-[#ff3b30]/40 transition-colors">
            <Check className="w-3.5 h-3.5 text-[#ff3b30]" />
            <span>AI Powered Predictions</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.06] backdrop-blur-md border border-white/10 shadow-lg text-xs font-semibold text-white/90 hover:border-[#ff3b30]/40 transition-colors">
            <Check className="w-3.5 h-3.5 text-[#ff3b30]" />
            <span>Smart PYQ Library</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.06] backdrop-blur-md border border-white/10 shadow-lg text-xs font-semibold text-white/90 hover:border-[#ff3b30]/40 transition-colors">
            <Check className="w-3.5 h-3.5 text-[#ff3b30]" />
            <span>KIIT Academic Workspace</span>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------
          RIGHT SIDE: CENTERED LOGIN CARD PANEL (35%)
      ---------------------------------------------------- */}
      <div className="w-full lg:w-[35%] md:w-[45%] min-h-screen flex items-center justify-center p-6 bg-[#0b0b0d] relative z-10">
        <div className="w-full max-w-[440px] bg-[#0e0e12]/92 backdrop-blur-[16px] border border-white/[0.06] rounded-[28px] p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_40px_rgba(255,59,48,0.08)] transition-all duration-300 animate-in fade-in slide-in-from-right-4">
          {/* ----------------------------------------------------
              LOGIN VIEW
          ---------------------------------------------------- */}
          {mode === 'login' ? (
            <div>
              {/* Header */}
              <div className="mb-7">
                <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
                  Login to your <span className="text-[#ff3b30]">Account</span>
                </h1>
                <p className="text-[#8c8c96] text-xs leading-relaxed font-normal">
                  See what is going on with your business
                </p>
              </div>

              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={() => router.push('/workspace')}
                className="w-full h-[52px] bg-[#101014] border border-white/10 hover:border-[#ff3b30]/50 rounded-xl text-xs text-white font-semibold flex items-center justify-center gap-3 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shadow-sm mb-6"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center mb-6">
                <div className="w-full border-t border-dashed border-white/10" />
                <span className="absolute bg-[#0e0e12] px-3.5 text-[#8c8c96] text-xs font-medium lowercase">
                  or
                </span>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-white/90 font-medium mb-2 block">Email</label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-4 w-4 h-4 text-[#8c8c96]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="mail@abc.com"
                      required
                      className="w-full h-[56px] bg-[#070709] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-xs text-white placeholder-[#555560] outline-none focus:border-[#ff3b30] focus:ring-1 focus:ring-[#ff3b30]/30 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/90 font-medium mb-2 block">Password</label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-4 w-4 h-4 text-[#8c8c96]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      required
                      className="w-full h-[56px] bg-[#070709] border border-white/10 rounded-xl py-3 pl-11 pr-11 text-xs text-white placeholder-[#555560] outline-none focus:border-[#ff3b30] focus:ring-1 focus:ring-[#ff3b30]/30 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 text-[#8c8c96] hover:text-white transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Action Row */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 bg-[#070709] accent-[#ff3b30] checked:bg-[#ff3b30] checked:border-[#ff3b30] cursor-pointer"
                    />
                    <span className="text-xs text-[#8c8c96]">Remember Me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Password reset link sent to your email')}
                    className="text-[#ff3b30] text-xs font-semibold hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  className="w-full h-[58px] bg-[#ff3b30] hover:bg-[#e03126] text-white rounded-[16px] py-3 text-sm font-semibold flex items-center justify-center gap-2.5 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shadow-lg shadow-[#ff3b30]/25 mt-3"
                >
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Footer */}
              <div className="mt-7 text-center text-xs text-[#8c8c96]">
                Not Registered Yet?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-[#ff3b30] font-semibold cursor-pointer hover:underline"
                >
                  Create an account
                </button>
              </div>
            </div>
          ) : (
            /* ----------------------------------------------------
                SIGNUP VIEW
            ---------------------------------------------------- */
            <div>
              {/* Header */}
              <div className="mb-7">
                <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
                  Create an <span className="text-[#ff3b30]">Account</span>
                </h1>
                <p className="text-[#8c8c96] text-xs leading-relaxed font-normal">
                  Fill in your details to get started with your account
                </p>
              </div>

              {/* Signup Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-white/90 font-medium mb-2 block">Full Name</label>
                  <div className="relative flex items-center">
                    <User className="absolute left-4 w-4 h-4 text-[#8c8c96]" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      required
                      className="w-full h-[56px] bg-[#070709] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-xs text-white placeholder-[#555560] outline-none focus:border-[#ff3b30] focus:ring-1 focus:ring-[#ff3b30]/30 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/90 font-medium mb-2 block">Email</label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-4 w-4 h-4 text-[#8c8c96]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="mail@abc.com"
                      required
                      className="w-full h-[56px] bg-[#070709] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-xs text-white placeholder-[#555560] outline-none focus:border-[#ff3b30] focus:ring-1 focus:ring-[#ff3b30]/30 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/90 font-medium mb-2 block">Password</label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-4 w-4 h-4 text-[#8c8c96]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      required
                      className="w-full h-[56px] bg-[#070709] border border-white/10 rounded-xl py-3 pl-11 pr-11 text-xs text-white placeholder-[#555560] outline-none focus:border-[#ff3b30] focus:ring-1 focus:ring-[#ff3b30]/30 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 text-[#8c8c96] hover:text-white transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/90 font-medium mb-2 block">Confirm Password</label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-4 w-4 h-4 text-[#8c8c96]" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      required
                      className="w-full h-[56px] bg-[#070709] border border-white/10 rounded-xl py-3 pl-11 pr-11 text-xs text-white placeholder-[#555560] outline-none focus:border-[#ff3b30] focus:ring-1 focus:ring-[#ff3b30]/30 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 text-[#8c8c96] hover:text-white transition-colors cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  className="w-full h-[58px] bg-[#ff3b30] hover:bg-[#e03126] text-white rounded-[16px] py-3 text-sm font-semibold flex items-center justify-center gap-2.5 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shadow-lg shadow-[#ff3b30]/25 mt-3"
                >
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Footer */}
              <div className="mt-7 text-center text-xs text-[#8c8c96]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-[#ff3b30] font-semibold cursor-pointer hover:underline"
                >
                  Sign in
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
