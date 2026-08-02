'use client'

import { useState } from 'react'
import { Bot, Send, Sparkles, Code, BookOpen, Terminal, CheckCircle2 } from 'lucide-react'

export default function AiAssistantWorkspacePage() {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello Soumya! I am KIITAnumaan AI Academic Assistant. Ask me anything about KIIT syllabus courses, code debugging, exam predictions, or formula derivations.',
    },
  ])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg = { sender: 'user', text: input }
    setMessages((prev) => [...prev, userMsg])
    const promptText = input
    setInput('')

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Here is the solution for your query "${promptText}":\n\n1. Overview: According to the official KIIT Semester 6 syllabus, this topic carries high weightage in mid-term and end-term examinations.\n2. Implementation Detail: Use modular decomposition and verify edge conditions.\n3. Exam Tip: Be sure to draw state transition diagrams when answering 10-mark questions!`,
        },
      ])
    }, 700)
  }

  const quickPrompts = [
    'Explain QuickSort partition logic with C++ trace',
    'High probability Operating Systems End-Sem questions',
    'How to calculate BCNF Decomposition for DBMS?',
    'Explain TCP 3-Way Handshake step by step',
  ]

  return (
    <div className="space-y-6">
      <div className="border-b border-[rgba(255,255,255,0.08)] pb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-[#FF3B30]/10 text-[#FF3B30] border border-[#FF3B30]/30 text-[10px] font-bold uppercase">
              AI ACADEMIC TUTOR
            </span>
            <span className="text-xs text-green-400 font-mono">KIIT Model v4.2 Active</span>
          </div>
          <h1 className="text-2xl font-black text-white uppercase mt-1">AI Assistant</h1>
        </div>
      </div>

      {/* Preset Chips */}
      <div className="flex flex-wrap gap-2">
        {quickPrompts.map((p) => (
          <button
            key={p}
            onClick={() => setInput(p)}
            className="bg-[#141414] border border-[rgba(255,255,255,0.08)] hover:border-[#FF3B30] text-xs text-[#9CA3AF] hover:text-white px-3 py-1.5 rounded-lg transition-colors font-medium text-left"
          >
            💡 {p}
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-xl p-6 min-h-[480px] flex flex-col justify-between space-y-4">
        <div className="space-y-4 overflow-y-auto max-h-[380px] pr-2">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xl p-4 rounded-xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#FF3B30] text-white rounded-br-none font-medium'
                    : 'bg-[#101010] border border-[rgba(255,255,255,0.08)] text-[#9CA3AF] rounded-bl-none whitespace-pre-wrap font-mono'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Controls */}
        <div className="flex items-center bg-[#101010] border border-[rgba(255,255,255,0.08)] rounded-xl p-2 focus-within:border-[#FF3B30]">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your syllabus question or coding doubt..."
            className="w-full bg-transparent px-3 py-2 text-xs text-white placeholder-[#6B7280] outline-none font-medium"
          />
          <button
            onClick={handleSend}
            className="bg-[#FF3B30] text-white p-2.5 rounded-lg hover:bg-[#E03126] transition-all shrink-0"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
