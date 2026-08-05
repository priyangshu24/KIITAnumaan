'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, User, ArrowRight } from 'lucide-react'

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
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-4">
      <div className="max-w-[420px] w-full bg-[#0a0a0d] p-8 rounded-3xl border border-[#1e1e24] shadow-2xl">
        
        {/* ----------------------------------------------------
            LOGIN VIEW
        ---------------------------------------------------- */}
        {mode === 'login' ? (
          <div>
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-1">
                Login to your <span className="text-[#E50914]">Account</span>
              </h1>
              <p className="text-gray-400 text-xs">
                See what is going on with your business
              </p>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={() => router.push('/workspace')}
              className="w-full bg-black border border-[#E50914] rounded-xl py-2.5 text-xs text-white font-medium flex items-center justify-center gap-2 hover:bg-zinc-900 transition-colors mb-5 cursor-pointer"
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
            <div className="relative flex items-center justify-center mb-5">
              <div className="w-full border-t border-dashed border-[#333]" />
              <span className="absolute bg-[#0a0a0d] px-3 text-gray-500 text-xs lowercase">
                or
              </span>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-white mb-1.5 block">Email</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mail@abc.com"
                    required
                    className="w-full bg-[#0a0a0a] border border-[#222] rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-[#555] outline-none focus:border-[#E50914] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-white mb-1.5 block">Password</label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 w-4 h-4 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    className="w-full bg-[#0a0a0a] border border-[#222] rounded-xl py-2.5 pl-10 pr-10 text-xs text-white placeholder-[#555] outline-none focus:border-[#E50914] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-gray-500 hover:text-white transition-colors cursor-pointer"
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
                    className="w-4 h-4 rounded border-[#333] bg-[#0a0a0a] accent-[#E50914] checked:bg-[#E50914] checked:border-[#E50914] cursor-pointer"
                  />
                  <span className="text-xs text-[#ccc]">Remember Me</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password reset link sent to your email')}
                  className="text-[#E50914] text-xs hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#E50914] hover:bg-[#c40812] text-white rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors mt-2 cursor-pointer shadow-lg shadow-[#E50914]/20"
              >
                <span>Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center text-xs text-gray-400">
              Not Registered Yet?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-[#E50914] font-medium cursor-pointer hover:underline"
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
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-1">
                Create an <span className="text-[#E50914]">Account</span>
              </h1>
              <p className="text-gray-400 text-xs">
                Fill in your details to get started with your account
              </p>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-white mb-1.5 block">Full Name</label>
                <div className="relative flex items-center">
                  <User className="absolute left-3 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="w-full bg-[#0a0a0a] border border-[#222] rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-[#555] outline-none focus:border-[#E50914] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-white mb-1.5 block">Email</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mail@abc.com"
                    required
                    className="w-full bg-[#0a0a0a] border border-[#222] rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-[#555] outline-none focus:border-[#E50914] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-white mb-1.5 block">Password</label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 w-4 h-4 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    className="w-full bg-[#0a0a0a] border border-[#222] rounded-xl py-2.5 pl-10 pr-10 text-xs text-white placeholder-[#555] outline-none focus:border-[#E50914] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-gray-500 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-white mb-1.5 block">Confirm Password</label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 w-4 h-4 text-gray-500" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    required
                    className="w-full bg-[#0a0a0a] border border-[#222] rounded-xl py-2.5 pl-10 pr-10 text-xs text-white placeholder-[#555] outline-none focus:border-[#E50914] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 text-gray-500 hover:text-white transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#E50914] hover:bg-[#c40812] text-white rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors mt-2 cursor-pointer shadow-lg shadow-[#E50914]/20"
              >
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center text-xs text-gray-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[#E50914] font-medium cursor-pointer hover:underline"
              >
                Sign in
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
