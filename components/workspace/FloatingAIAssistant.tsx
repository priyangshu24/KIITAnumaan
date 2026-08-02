'use client'

import { useState } from 'react'
import { Bot, Sparkles, X, Send, User, ChevronDown } from 'lucide-react'

export default function FloatingAIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello Soumya! I am your KIITAnumaan AI Assistant. How can I help you with your exams, notes, or career today?',
    },
  ])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }])
    setInput('')

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Based on KIIT PYQs & syllabus data for Operating Systems & DBMS, I am analyzing "${userMsg}". Here is your high-probability topic breakdown!`,
        },
      ])
    }, 800)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      
      {/* Floating AI Chat Window Drawer */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 h-[480px] max-h-[calc(100vh-100px)] bg-[#0B0B0D] border border-white/15 rounded-[24px] shadow-[0_16px_48px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Drawer Header */}
          <div className="p-4 bg-[#111214] border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#FF453A] text-white flex items-center justify-center shadow-sm">
                <Bot size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  KIITAnumaan AI <Sparkles size={12} className="text-[#FF453A]" />
                </h4>
                <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active · Model v3.6
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-[#8A8A8A] hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-lg bg-[#FF453A]/20 text-[#FF453A] flex items-center justify-center shrink-0 border border-[#FF453A]/30 mt-0.5">
                    <Bot size={12} />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#FF453A] text-white font-medium rounded-tr-none'
                      : 'bg-[#141418] border border-white/10 text-white rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Prompts */}
          <div className="px-3.5 py-2.5 border-t border-white/10 flex items-center gap-2 overflow-x-auto text-xs bg-[#111214]">
            {['Predict OS Midsem', 'Check Section Swap', 'ATS Resume Score'].map((prompt) => (
              <button
                key={prompt}
                onClick={() => {
                  setInput(prompt)
                }}
                className="whitespace-nowrap px-3 py-1 rounded-full bg-white/[0.08] hover:bg-white/20 border border-white/20 text-white font-medium text-[11px] transition-all shrink-0 cursor-pointer shadow-sm"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-3 bg-[#111214] border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask AI anything about KIIT exams..."
              className="flex-1 bg-transparent text-xs text-white placeholder-zinc-400 focus:text-white caret-white outline-none px-2 font-medium [color-scheme:dark]"
            />
            <button
              onClick={handleSend}
              className="w-8 h-8 rounded-xl bg-[#FF453A] hover:brightness-110 text-white flex items-center justify-center transition-all shrink-0 shadow-sm cursor-pointer"
            >
              <Send size={14} />
            </button>
          </div>

        </div>
      )}

      {/* Floating Button in Bottom Right Corner */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 bg-[#111214] border border-[#FF453A]/40 hover:border-[#FF453A] text-white rounded-full px-3 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.4)] hover:scale-[1.03] active:scale-95 transition-all cursor-pointer"
      >
        <div className="relative flex items-center justify-center">
          <div className="w-7 h-7 rounded-full bg-[#FF453A] text-white flex items-center justify-center shadow-sm">
            <Bot size={15} />
          </div>
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-[#111214]" />
        </div>

        <div className="flex flex-col text-left pr-0.5">
          <span className="text-[11px] font-bold text-white leading-tight flex items-center gap-1">
            AI Assistant <Sparkles size={10} className="text-[#FF453A]" />
          </span>
          <span className="text-[9px] text-[#8A8A8A] font-mono leading-none mt-0.5">
            Ask Anything
          </span>
        </div>
      </button>

    </div>
  )
}
