'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  MapPin,
  Users,
  Home,
  BookOpen,
  FlaskConical,
  Navigation,
  Utensils,
  Car,
  Plus,
  Minus,
  RotateCcw,
  Clock,
  GraduationCap,
} from 'lucide-react'

// Navigation tab types
type CampusTab =
  | 'map'
  | 'faculty'
  | 'hostels'
  | 'library'
  | 'labs'
  | 'navigation'
  | 'cafeteria'
  | 'parking'

interface PinData {
  id: string
  code: string
  name: string
  subtitle: string
  category: string
  coords: { x: number; y: number }
  description: string
  buildingDetails: {
    floors: string
    capacity: string
    area: string
  }
  hours: {
    weekday: string
    weekend: string
  }
  address: string
}

const campusPins: PinData[] = [
  {
    id: 'cse',
    code: 'CSE',
    name: 'Campus 15',
    subtitle: 'School of Computer Engineering',
    category: 'Academic',
    coords: { x: 42, y: 28 },
    description:
      'State-of-the-art academic facility housing advanced computing labs, AI research centers, and 3,000+ engineering students.',
    buildingDetails: {
      floors: '7 Floors • 42 Classrooms',
      capacity: '3,500 Students',
      area: '125,000 sq ft',
    },
    hours: {
      weekday: 'Mon – Sat: 8:00 AM – 8:00 PM',
      weekend: 'Sunday: 9:00 AM – 5:00 PM (Reading Room)',
    },
    address: 'Patia, Bhubaneswar, Odisha 751024',
  },
  {
    id: 'cs',
    code: 'CS',
    name: 'Campus 12',
    subtitle: 'School of Computer Applications',
    category: 'Academic',
    coords: { x: 28, y: 35 },
    description:
      'Premier hub for software application development, data science, and cloud technology programs.',
    buildingDetails: {
      floors: '5 Floors • 28 Classrooms',
      capacity: '2,200 Students',
      area: '95,000 sq ft',
    },
    hours: {
      weekday: 'Mon – Sat: 8:00 AM – 7:30 PM',
      weekend: 'Sunday: Closed',
    },
    address: 'Patia, Campus 12 Block B, Bhubaneswar',
  },
  {
    id: 'lib',
    code: 'Library',
    name: 'Central Library',
    subtitle: 'Campus 6 Knowledge Resource',
    category: 'Library',
    coords: { x: 55, y: 48 },
    description:
      '6-floor central library with over 200,000 volumes, 24/7 digital archives, and quiet study spaces for 800+ scholars.',
    buildingDetails: {
      floors: '6 Floors • 8 Reading Halls',
      capacity: '800 Scholars',
      area: '150,000 sq ft',
    },
    hours: {
      weekday: 'Mon – Sat: 8:00 AM – 11:00 PM',
      weekend: 'Sunday: 9:00 AM – 9:00 PM',
    },
    address: 'Campus 6 Avenue, Patia, Bhubaneswar',
  },
  {
    id: 'hostel',
    code: 'Hostel',
    name: 'King’s Palace (KP-7)',
    subtitle: 'Student Residence Complex',
    category: 'Hostel',
    coords: { x: 75, y: 62 },
    description:
      'Modern air-conditioned residential complex with 24/7 high-speed Wi-Fi, indoor gaming lounge, and dining hall.',
    buildingDetails: {
      floors: '10 Floors • 520 Rooms',
      capacity: '1,040 Residents',
      area: '180,000 sq ft',
    },
    hours: {
      weekday: '24 Hours Open (Gate Entry: 10:00 PM)',
      weekend: '24 Hours Open',
    },
    address: 'KP-7 Hostel Zone, KIIT Campus',
  },
  {
    id: 'aud',
    code: 'Auditorium',
    name: 'Campus 6 Auditorium',
    subtitle: 'Grand Convention Hall',
    category: 'Event Center',
    coords: { x: 34, y: 68 },
    description:
      'World-class 1,800-seat auditorium equipped with state-of-the-art acoustic sound systems and multi-tier seating.',
    buildingDetails: {
      floors: '3 Tiers • Main Stage',
      capacity: '1,800 Attendees',
      area: '60,000 sq ft',
    },
    hours: {
      weekday: 'Event Schedules (9:00 AM – 9:00 PM)',
      weekend: 'Event Schedules',
    },
    address: 'Campus 6 Convention Center, KIIT',
  },
  {
    id: 'cps',
    code: 'CPS',
    name: 'Campus 3 (CPS)',
    subtitle: 'Polytechnic & Mechanical Block',
    category: 'Academic',
    coords: { x: 68, y: 28 },
    description:
      'Heavy machinery workshops, CAD/CAM centers, and high-precision manufacturing engineering laboratories.',
    buildingDetails: {
      floors: '4 Floors • 32 Workshops',
      capacity: '1,800 Students',
      area: '110,000 sq ft',
    },
    hours: {
      weekday: 'Mon – Sat: 8:00 AM – 6:00 PM',
      weekend: 'Sunday: Closed',
    },
    address: 'Campus 3 Engineering Block, Patia',
  },
]

export default function CampusWorkspacePage() {
  const [activeTab, setActiveTab] = useState<CampusTab>('map')
  const [selectedPin, setSelectedPin] = useState<PinData>(campusPins[0])
  const [zoomLevel, setZoomLevel] = useState<number>(1)

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.2, 1.8))
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.2, 0.8))
  const handleResetZoom = () => setZoomLevel(1)

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto text-white pb-12">
      
      {/* ----------------------------------------------------
          TOP NAVIGATION CARD (Animated Capsule Bar)
      ---------------------------------------------------- */}
      <div className="bg-[#111214] border border-white/[0.04] rounded-full p-2 shadow-[0_8px_24px_rgba(0,0,0,0.18)] flex justify-center">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none max-w-full px-1 py-0.5">
          {[
            { id: 'map', name: 'Interactive Map', icon: MapPin },
            { id: 'faculty', name: 'Faculty Directory', icon: Users },
            { id: 'hostels', name: 'Hostels', icon: Home },
            { id: 'library', name: 'Library', icon: BookOpen },
            { id: 'labs', name: 'Labs', icon: FlaskConical },
            { id: 'navigation', name: 'Navigation', icon: Navigation },
            { id: 'cafeteria', name: 'Cafeteria', icon: Utensils },
            { id: 'parking', name: 'Parking', icon: Car },
          ].map((nav) => {
            const NavIcon = nav.icon
            const isActive = activeTab === nav.id
            return (
              <button
                key={nav.id}
                onClick={() => setActiveTab(nav.id as CampusTab)}
                className={`relative px-4 py-2 rounded-full text-xs font-medium transition-colors duration-200 flex flex-col items-center justify-center whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-[#8A8A8A] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {/* Active Pill Container with Framer Motion Layout Animation */}
                {isActive && (
                  <motion.div
                    layoutId="activeCampusTabPill"
                    className="absolute inset-0 bg-white/[0.08] border border-white/15 rounded-full shadow-inner z-0 pointer-events-none"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}

                <div className="relative z-10 flex items-center gap-2">
                  <NavIcon
                    size={15}
                    className={isActive ? 'text-[#FF4D4D]' : 'text-[#8A8A8A]'}
                  />
                  <span>{nav.name}</span>
                </div>

                {/* Centered Red Dash with Framer Motion Layout Animation */}
                {isActive && (
                  <motion.span
                    layoutId="activeCampusTabRedDash"
                    className="relative z-10 w-3.5 h-[2.5px] bg-[#FF4D4D] rounded-full mt-1 shadow-sm block"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ----------------------------------------------------
          TWO-COLUMN DASHBOARD (70% Left / 30% Right)
      ---------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN (70% -> lg:col-span-8) */}
        <div className="lg:col-span-8 bg-[#111214] border border-white/[0.04] rounded-[20px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.18)] flex flex-col justify-between space-y-4 hover:-translate-y-0.5 transition-all duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-semibold text-white tracking-tight">
              KIIT Main Campus Vector Blueprint
            </h2>

            {/* Top-Right Label */}
            <div className="flex items-center gap-2 bg-[#0B0B0D] border border-white/[0.06] px-3 py-1 rounded-full text-xs text-[#8A8A8A] font-mono">
              <span className="w-2 h-2 rounded-full bg-[#FF4D4D] animate-ping" />
              <span>Interactive map enabled</span>
            </div>
          </div>

          {/* Dark Vector-Style Campus Map Canvas */}
          <div className="relative w-full h-[410px] bg-[#0B0B0D] border border-white/[0.05] rounded-[16px] overflow-hidden group">
            
            {/* Zoom Transform Wrapper */}
            <div
              className="w-full h-full relative transition-transform duration-300 ease-out"
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
            >
              {/* Decorative Campus Roads & Building Vector Graphics SVG */}
              <svg
                className="absolute inset-0 w-full h-full stroke-white/10 fill-none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background Grid Pattern */}
                <pattern id="campusGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#campusGrid)" />

                {/* Main Arterial Roads */}
                <path d="M 20 180 C 180 120, 420 280, 780 200" stroke="rgba(255,77,77,0.25)" strokeWidth="6" />
                <path d="M 250 20 V 380" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
                <path d="M 540 20 V 380" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />

                {/* Secondary Connecting Streets */}
                <path d="M 100 80 Q 250 200 450 120" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" strokeDasharray="4 4" />
                <path d="M 300 300 C 450 360, 600 320, 720 280" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" strokeDasharray="4 4" />

                {/* Vector Building Polygons */}
                <rect x="25%" y="22%" width="75" height="50" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,77,77,0.3)" strokeWidth="1.5" />
                <rect x="40%" y="18%" width="90" height="60" rx="10" fill="rgba(255,77,77,0.06)" stroke="rgba(255,77,77,0.5)" strokeWidth="1.5" />
                <rect x="52%" y="42%" width="100" height="70" rx="12" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                <rect x="70%" y="55%" width="110" height="75" rx="12" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                <rect x="30%" y="62%" width="85" height="55" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                <rect x="64%" y="22%" width="80" height="50" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />

                {/* Water Body Vector Contour */}
                <path d="M 680 80 Q 740 120 720 160 Q 660 140 680 80 Z" fill="rgba(59,130,246,0.08)" stroke="rgba(59,130,246,0.3)" strokeWidth="1.5" />
              </svg>

              {/* Red Location Pins */}
              {campusPins.map((pin) => {
                const isSelected = selectedPin.id === pin.id
                return (
                  <button
                    key={pin.id}
                    onClick={() => setSelectedPin(pin)}
                    style={{ left: `${pin.coords.x}%`, top: `${pin.coords.y}%` }}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group/pin z-20"
                  >
                    {/* Pulsing ring */}
                    <span className="absolute -inset-2 rounded-full bg-[#FF4D4D]/25 animate-ping pointer-events-none" />

                    {/* Red Pin Button */}
                    <div
                      className={`relative px-2.5 py-1 rounded-full flex items-center gap-1.5 font-bold text-xs shadow-lg transition-all duration-200 ${
                        isSelected
                          ? 'bg-[#FF4D4D] text-white scale-110 border border-white'
                          : 'bg-[#111214] border border-[#FF4D4D]/50 text-white hover:scale-105 hover:border-[#FF4D4D]'
                      }`}
                    >
                      <MapPin size={13} className={isSelected ? 'text-white' : 'text-[#FF4D4D]'} />
                      <span>{pin.code}</span>
                    </div>
                  </button>
                )
              })}

            </div>

            {/* Bottom-Right Zoom (+ / –) Controls */}
            <div className="absolute bottom-4 right-4 z-30 flex items-center gap-1 bg-[#111214] border border-white/10 p-1 rounded-xl shadow-xl">
              <button
                onClick={handleZoomIn}
                className="w-8 h-8 rounded-lg hover:bg-white/10 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Zoom In"
              >
                <Plus size={16} />
              </button>
              <button
                onClick={handleZoomOut}
                className="w-8 h-8 rounded-lg hover:bg-white/10 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <Minus size={16} />
              </button>
              <button
                onClick={handleResetZoom}
                className="w-8 h-8 rounded-lg hover:bg-white/10 text-[#8A8A8A] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Reset Zoom"
              >
                <RotateCcw size={14} />
              </button>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN (30% -> lg:col-span-4) */}
        <div className="lg:col-span-4 bg-[#111214] border border-white/[0.04] rounded-[20px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.18)] flex flex-col justify-between space-y-5 hover:-translate-y-0.5 transition-all duration-200">
          
          <div className="space-y-4">
            {/* Top Tag & Title */}
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#FF4D4D]/10 text-[#FF4D4D] border border-[#FF4D4D]/20 text-[10px] uppercase font-bold tracking-wider inline-block">
                {selectedPin.category}
              </span>
              <h3 className="text-[24px] font-bold text-white tracking-tight mt-2 leading-snug">
                {selectedPin.name}
              </h3>
              <p className="text-xs text-[#8A8A8A] font-normal mt-0.5">
                {selectedPin.subtitle}
              </p>
            </div>

            <div className="h-[1px] bg-white/[0.04]" />

            {/* Information Details */}
            <div className="space-y-3.5 text-xs">
              
              {/* Description */}
              <div>
                <span className="text-[11px] font-mono text-[#71717A] uppercase block">
                  Description
                </span>
                <p className="text-[#8A8A8A] font-normal mt-1 leading-relaxed">
                  {selectedPin.description}
                </p>
              </div>

              {/* Building Details */}
              <div>
                <span className="text-[11px] font-mono text-[#71717A] uppercase block">
                  Building Details
                </span>
                <div className="bg-[#0B0B0D] border border-white/[0.04] rounded-[12px] p-2.5 mt-1 space-y-1 text-white font-mono text-[11px]">
                  <p>• {selectedPin.buildingDetails.floors}</p>
                  <p>• Capacity: {selectedPin.buildingDetails.capacity}</p>
                  <p>• Area: {selectedPin.buildingDetails.area}</p>
                </div>
              </div>

              {/* Operational Hours */}
              <div>
                <span className="text-[11px] font-mono text-[#71717A] uppercase block">
                  Operational Hours
                </span>
                <div className="mt-1 space-y-0.5 text-white font-mono text-[11px]">
                  <p className="flex items-center gap-1.5">
                    <Clock size={12} className="text-[#FF4D4D]" />
                    {selectedPin.hours.weekday}
                  </p>
                  <p className="text-[#8A8A8A] pl-4">{selectedPin.hours.weekend}</p>
                </div>
              </div>

              {/* Location Badge */}
              <div>
                <span className="text-[11px] font-mono text-[#71717A] uppercase block">
                  Location Badge
                </span>
                <p className="text-white font-normal mt-1 flex items-center gap-1.5">
                  <MapPin size={13} className="text-[#FF4D4D] shrink-0" />
                  {selectedPin.address}
                </p>
              </div>

            </div>
          </div>

          {/* Primary CTA Button */}
          <button
            onClick={() => {
              alert(`Routing initiated to ${selectedPin.name} (${selectedPin.subtitle})`)
            }}
            className="w-full bg-[#FF4D4D] hover:brightness-110 text-white text-xs font-bold uppercase tracking-wider rounded-[14px] h-[44px] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer mt-4"
          >
            <Navigation size={15} /> Route to Building
          </button>

        </div>

      </div>

      {/* ----------------------------------------------------
          BOTTOM STATS ROW (Four Equal Cards)
      ---------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {[
          {
            number: '25',
            label: 'Campuses',
            sub: 'Across Bhubaneswar',
            icon: GraduationCap,
          },
          {
            number: '12',
            label: 'Hostels',
            sub: 'Available for students',
            icon: Home,
          },
          {
            number: '3',
            label: 'Libraries',
            sub: 'Knowledge at your fingertips',
            icon: BookOpen,
          },
          {
            number: '24',
            label: 'Labs',
            sub: 'Advanced learning spaces',
            icon: FlaskConical,
          },
        ].map((stat, idx) => {
          const StatIcon = stat.icon
          return (
            <div
              key={idx}
              className="bg-[#111214] border border-white/[0.04] rounded-[20px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.18)] flex flex-col justify-between h-[150px] hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold text-white tracking-tight">
                  {stat.label}
                </span>
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.05] flex items-center justify-center text-[#FF4D4D] group-hover:scale-105 transition-transform">
                  <StatIcon size={18} />
                </div>
              </div>

              <div>
                <span className="text-[38px] font-bold text-white font-mono tracking-tight leading-none block">
                  {stat.number}
                </span>
                <span className="text-xs text-[#8A8A8A] font-normal mt-1.5 block">
                  {stat.sub}
                </span>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}
