'use client'

import { useState } from 'react'
import { Mail, MapPin, MessageSquare, Send, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react'

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false)
  const [category, setCategory] = useState('academic')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', message: '' })
    }, 4000)
  }

  return (
    <section
      id="contact"
      className="relative py-24 px-6 lg:px-12 max-w-[1440px] mx-auto text-white overflow-hidden"
    >
      {/* Subtle ambient red background light glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#FF3B30]/5 blur-[160px] pointer-events-none rounded-full" />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <span className="text-[#FF3B30] text-xs font-black tracking-[0.25em] uppercase block mb-3">
            GET IN TOUCH
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-tight leading-tight">
            Have Questions or Feedback?
          </h2>
          <p className="text-xs sm:text-sm text-[#9CA3AF] mt-3 font-medium leading-relaxed">
            Reach out to the KIITAnumaan team. Whether you need help with exam predictions, section swap, or platform features, we&apos;re here for you.
          </p>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Contact Cards & Info */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Email Card */}
            <div className="bg-[#101010] border border-white/[0.08] rounded-2xl p-6 hover:border-[#FF3B30]/40 transition-all duration-300 group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FF3B30]/10 border border-[#FF3B30]/30 flex items-center justify-center text-[#FF3B30] group-hover:scale-110 transition-transform">
                  <Mail size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280]">Official Email</span>
                  <h4 className="text-base font-bold text-white mt-0.5">support@kiitanumaan.ac.in</h4>
                  <p className="text-xs text-[#9CA3AF] mt-1 font-medium">Average response time: &lt; 2 hours</p>
                </div>
              </div>
            </div>

            {/* Campus Office Card */}
            <div className="bg-[#101010] border border-white/[0.08] rounded-2xl p-6 hover:border-[#FF3B30]/40 transition-all duration-300 group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FF3B30]/10 border border-[#FF3B30]/30 flex items-center justify-center text-[#FF3B30] group-hover:scale-110 transition-transform">
                  <MapPin size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280]">Campus Location</span>
                  <h4 className="text-base font-bold text-white mt-0.5">Campus 15, CSE Block</h4>
                  <p className="text-xs text-[#9CA3AF] mt-1 leading-relaxed">
                    KIIT University, Patia, Bhubaneswar, Odisha 751024
                  </p>
                </div>
              </div>
            </div>

            {/* Community & Discord */}
            <div className="bg-[#101010] border border-white/[0.08] rounded-2xl p-6 hover:border-[#FF3B30]/40 transition-all duration-300 group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FF3B30]/10 border border-[#FF3B30]/30 flex items-center justify-center text-[#FF3B30] group-hover:scale-110 transition-transform">
                  <MessageSquare size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280]">Student Community</span>
                  <h4 className="text-base font-bold text-white mt-0.5">Join 12,000+ KIITians</h4>
                  <p className="text-xs text-[#9CA3AF] mt-1">Connect on Discord &amp; Telegram for instant help</p>
                </div>
              </div>
            </div>

            {/* Quick Stat Pill */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FF3B30]/10 via-transparent to-transparent border border-[#FF3B30]/20 flex items-center gap-3">
              <Sparkles size={20} className="text-[#FF3B30] flex-shrink-0" />
              <p className="text-xs text-[#9CA3AF]">
                <strong className="text-white">24/7 AI Assistance:</strong> Try asking our AI Assistant inside the workspace for immediate instant answers.
              </p>
            </div>

          </div>

          {/* Right Side: Glassmorphism Interactive Contact Form */}
          <div className="lg:col-span-7 bg-[#101010] border border-white/[0.08] rounded-3xl p-6 sm:p-10 shadow-2xl relative">
            
            {submitted ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-2xl font-bold text-white">Message Sent Successfully!</h3>
                <p className="text-xs text-[#9CA3AF] max-w-md mx-auto">
                  Thank you for contacting us. A member of the KIITAnumaan support team will review your query and respond shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Category Pill Selector */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] block mb-3">
                    Select Topic
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'academic', label: 'Academic Query' },
                      { id: 'bug', label: 'Report a Bug' },
                      { id: 'feature', label: 'Feature Request' },
                      { id: 'general', label: 'General Inquiry' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setCategory(item.id)}
                        className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all ${
                          category === item.id
                            ? 'bg-[#FF3B30] text-white shadow-[0_0_15px_rgba(255,59,48,0.4)]'
                            : 'bg-white/[0.04] text-[#9CA3AF] hover:text-white border border-white/[0.06]'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Inputs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] block mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Soumya Ranjan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#080808] border border-white/[0.1] rounded-xl px-4 py-3 text-xs text-white placeholder:text-[#4B5563] focus:outline-none focus:border-[#FF3B30] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] block mb-2">
                      KIIT Email / Roll No.
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. student@kiit.ac.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#080808] border border-white/[0.1] rounded-xl px-4 py-3 text-xs text-white placeholder:text-[#4B5563] focus:outline-none focus:border-[#FF3B30] transition-colors"
                    />
                  </div>
                </div>

                {/* Message Field */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] block mb-2">
                    Your Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us what you need help with or share your feedback..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#080808] border border-white/[0.1] rounded-xl px-4 py-3 text-xs text-white placeholder:text-[#4B5563] focus:outline-none focus:border-[#FF3B30] transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#FF3B30] to-[#FF5A4F] text-white text-xs font-bold uppercase tracking-wider py-4 rounded-xl hover:scale-[1.01] transition-all active:scale-95 shadow-[0_0_25px_rgba(255,59,48,0.35)] flex items-center justify-center gap-2"
                >
                  Send Message <Send size={15} />
                </button>
              </form>
            )}

          </div>

        </div>
      </div>
    </section>
  )
}
