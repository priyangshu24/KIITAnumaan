import { Suspense } from 'react'
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar'
import WorkspaceNavbar from '@/components/workspace/WorkspaceNavbar'
import FloatingAIAssistant from '@/components/workspace/FloatingAIAssistant'

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#080808] text-white flex overflow-x-hidden selection:bg-[#FF3B30] selection:text-white relative">
      {/* Root Body Background Grid (< 3% opacity) */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[size:4rem_4rem] bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)]" />

      {/* Floating Fixed Sidebar wrapped in Suspense */}
      <Suspense fallback={<div className="w-[88px] h-[calc(100vh-24px)] fixed top-[12px] left-[12px] flex flex-col gap-3 z-40"><div className="flex-1 bg-[#0B0B0D] rounded-[24px] border border-white/[0.05]" /><div className="h-[54px] bg-[#0B0B0D] rounded-[24px] border border-white/[0.05]" /></div>}>
        <WorkspaceSidebar />
      </Suspense>

      {/* Layout Spacer for Fixed Sidebar (88px width + 16px offset) */}
      <div className="w-[104px] shrink-0 hidden sm:block" />

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <WorkspaceNavbar />
        <main className="flex-1 px-4 lg:px-6 py-4 w-full">
          {children}
        </main>
      </div>






      {/* Floating AI Assistant in Bottom Right Corner */}
      <FloatingAIAssistant />
    </div>
  )
}


