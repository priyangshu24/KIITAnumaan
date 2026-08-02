'use client'

import { Settings, Bell, Shield, Moon } from 'lucide-react'

export default function WorkspaceSettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="border-b border-[rgba(255,255,255,0.08)] pb-4">
        <h1 className="text-2xl font-extrabold text-white uppercase">Workspace Settings</h1>
        <p className="text-xs text-[#6B7280] font-mono">System Preferences & Security</p>
      </div>

      <div className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-4">
          <div className="flex items-center gap-3">
            <Bell size={18} className="text-[#FF3B30]" />
            <div>
              <p className="text-sm font-bold text-white">Push Notifications</p>
              <p className="text-xs text-[#9CA3AF]">Receive alerts for PYQ uploads and section swap requests.</p>
            </div>
          </div>
          <input type="checkbox" defaultChecked className="accent-[#FF3B30] w-4 h-4" />
        </div>

        <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-4">
          <div className="flex items-center gap-3">
            <Moon size={18} className="text-[#FF3B30]" />
            <div>
              <p className="text-sm font-bold text-white">Default Theme</p>
              <p className="text-xs text-[#9CA3AF]">Matte Dark Mode (#080808) strictly enabled.</p>
            </div>
          </div>
          <span className="text-xs text-white font-mono font-bold bg-[#101010] px-2.5 py-1 rounded border border-[rgba(255,255,255,0.08)]">
            DARK ONLY
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield size={18} className="text-[#FF3B30]" />
            <div>
              <p className="text-sm font-bold text-white">Two-Factor Authentication (OTP)</p>
              <p className="text-xs text-[#9CA3AF]">Enforced for official section swap approvals.</p>
            </div>
          </div>
          <span className="text-xs text-green-400 font-bold bg-green-500/10 px-2.5 py-1 rounded border border-green-500/30">
            ACTIVE
          </span>
        </div>
      </div>
    </div>
  )
}
