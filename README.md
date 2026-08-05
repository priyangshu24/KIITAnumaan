<p align="center">
  <img src="https://img.shields.io/badge/KIIT-Anumaan-FF3B30?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNGRjNCMzAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTIgMmwzLjA5IDYuMjZMIDIyIDkuMjdsLTUgNC44NyAxLjE4IDYuODhMMTIgMTcuNzdsLTYuMTggMy4yNUw3IDIxLjE0bC01LTQuODcgNi45MS0xLjAxWiIvPjwvc3ZnPg==&logoColor=white" alt="KIITAnumaan" />
</p>

<h1 align="center">
  🎓 KIITAnumaan
</h1>

<p align="center">
  <strong>AI-Powered Academic & Campus Operating System for KIIT University</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2-000000?style=flat-square&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Framer_Motion-12.x-0055FF?style=flat-square&logo=framer&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />
</p>

<p align="center">
  <em>A premium, dark-themed SaaS platform that unifies academics, campus navigation, career services, and AI-powered exam prediction — built exclusively for KIIT University students.</em>
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Route Map](#-route-map)
- [Module Breakdown](#-module-breakdown)
- [Design System](#-design-system)
- [Component Library](#-component-library)
- [Data Models](#-data-models)
- [Animation System](#-animation-system)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**KIITAnumaan** (KIIT + अनुमान, meaning "prediction" in Hindi) is a full-featured academic operating system designed for KIIT University. It combines AI-driven exam question prediction, a comprehensive PYQ library, campus navigation, faculty directory, career services (resume builder, ATS checker, placement tracker), and an AI chat assistant — all within a stunning glassmorphic dark-mode interface.

```
  ╔══════════════════════════════════════════════════════════════╗
  ║                                                              ║
  ║   🎯  AI Predicted Questions    📚  PYQ Library              ║
  ║   📝  Notes & Resources         🔥  Important Topics         ║
  ║   📅  Class Timetable           🗺️  Campus Navigation        ║
  ║   👨‍🏫  Faculty Directory         💼  Career & Placements      ║
  ║   🤖  AI Academic Assistant     👤  Profile & Settings       ║
  ║                                                              ║
  ╚══════════════════════════════════════════════════════════════╝
```

---

## ✨ Key Features

### 🎯 Academic Intelligence
| Feature | Description |
|---------|-------------|
| **AI Predicted Questions** | Upload past papers → ML-powered question pattern analysis → High-probability predicted questions with unit-wise breakdown |
| **PYQ Library** | Searchable repository of previous year question papers with filters by year, semester, branch, subject, and exam type |
| **Notes Library** | Community-verified lecture notes with ratings, downloads, and subject categorization |
| **Important Topics** | Curated high-yield exam topics with chapter-wise priority mapping |
| **Class Timetable** | Interactive weekly schedule viewer with section-aware course display |

### 🏫 Campus Services
| Feature | Description |
|---------|-------------|
| **Interactive Campus Map** | Zoomable campus map with building pins, categories, and real-time navigation |
| **Faculty Directory** | Searchable faculty profiles with office hours, cabin locations, ratings, and reviews |
| **Section Swap** | Peer-to-peer section swap marketplace with matching engine |

### 💼 Career & Placement
| Feature | Description |
|---------|-------------|
| **Resume Builder** | Section-based resume editor with real-time preview and PDF export |
| **ATS Checker** | AI-powered ATS compatibility scoring with keyword optimization suggestions |
| **Placement Planner** | Company-wise placement drive tracker with eligibility checking |
| **AI Career Blueprint** | Personalized learning path generation based on career goals |

### 🤖 AI Assistant
| Feature | Description |
|---------|-------------|
| **Chat Interface** | Full-featured AI academic assistant for syllabus queries, code debugging, exam tips, and formula derivations |
| **Quick Prompts** | One-click prompt templates for common academic queries |
| **Floating Widget** | Accessible from any workspace page via a floating action button |

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          KIITAnumaan Platform                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────────┐    ┌──────────────┐    ┌─────────────────────┐       │
│   │  Landing     │    │  Auth Layer  │    │   Onboarding Flow   │       │
│   │  Page        │───▶│  Login /     │───▶│   (Auto-redirect    │       │
│   │  (Public)    │    │  Signup      │    │    to Workspace)    │       │
│   └─────────────┘    └──────────────┘    └─────────┬───────────┘       │
│                                                     │                   │
│                                                     ▼                   │
│   ┌─────────────────────────────────────────────────────────────┐       │
│   │                    WORKSPACE SHELL                          │       │
│   │  ┌──────────┐  ┌──────────────────────────────────────┐    │       │
│   │  │ Sidebar  │  │         Workspace Navbar             │    │       │
│   │  │ (Hover   │  ├──────────────────────────────────────┤    │       │
│   │  │ Expand)  │  │                                      │    │       │
│   │  │          │  │         ROUTE CONTENT AREA            │    │       │
│   │  │ • Acad.  │  │                                      │    │       │
│   │  │ • Campus │  │   ┌──────┬──────┬───────┬──────┐    │    │       │
│   │  │ • Career │  │   │ Acad │Campus│Career │ AI   │    │    │       │
│   │  │ • Faculty│  │   │ Hub  │  Hub │  Hub  │ Chat │    │    │       │
│   │  │ • AI     │  │   └──┬───┴──────┴───────┴──────┘    │    │       │
│   │  │ • Profile│  │      │                               │    │       │
│   │  └──────────┘  │      ▼                               │    │       │
│   │                │   ┌──────────────────────────────┐   │    │       │
│   │                │   │  ACADEMIC SUB-ROUTES         │   │    │       │
│   │                │   │  • /predicted-questions      │   │    │       │
│   │                │   │  • /pyq-library              │   │    │       │
│   │                │   │  • /notes-library            │   │    │       │
│   │                │   │  • /important-topics         │   │    │       │
│   │                │   │  • /class-timetable          │   │    │       │
│   │                │   └──────────────────────────────┘   │    │       │
│   │                └──────────────────────────────────────┘    │       │
│   └─────────────────────────────────────────────────────────────┘       │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────┐       │
│   │              FLOATING AI ASSISTANT (Global)                 │       │
│   └─────────────────────────────────────────────────────────────┘       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### User Flow

```
   ┌────────┐     ┌────────┐     ┌────────────┐     ┌─────────────────┐
   │Landing │────▶│ Login/ │────▶│ Onboarding │────▶│   Workspace     │
   │ Page   │     │ Signup │     │  (Redirect) │     │   /academic     │
   └────────┘     └────────┘     └────────────┘     └────────┬────────┘
                                                              │
                    ┌─────────────────────────────────────────┤
                    │                                         │
                    ▼                                         ▼
          ┌─────────────────┐                    ┌──────────────────────┐
          │ Academic Hub    │                    │ Other Workspace Hubs │
          │ ┌─────────────┐ │                    │ • Campus / Map       │
          │ │ Predictor   │ │                    │ • Career / Resume    │
          │ │ Chart +     │ │                    │ • Faculty Directory  │
          │ │ Module Cards│ │                    │ • AI Assistant       │
          │ └──────┬──────┘ │                    │ • Profile / Settings │
          │        │        │                    └──────────────────────┘
          │        ▼        │
          │ ┌─────────────┐ │
          │ │ Sub-pages:  │ │
          │ │ PYQ Library │ │
          │ │ Notes       │ │
          │ │ Topics      │ │
          │ │ Timetable   │ │
          │ │ Predicted Q │ │
          │ └─────────────┘ │
          └─────────────────┘
```

### Component Architecture

```
  RootLayout (app/layout.tsx)
  ├── ThemeProvider (next-themes)
  │
  ├── LandingPage (app/page.tsx)
  │   ├── LandingNavbar
  │   ├── HeroSection
  │   ├── FeaturesSection
  │   ├── WorkspacePreviewSection
  │   ├── ContactSection
  │   └── LandingFooter
  │
  ├── AuthPages
  │   ├── LoginPage (app/login/page.tsx)
  │   └── SignupPage (app/signup/page.tsx)
  │
  └── WorkspaceLayout (app/workspace/layout.tsx)
      ├── WorkspaceSidebar (hover-expandable, 88px → 256px)
      ├── WorkspaceNavbar (breadcrumbs + search + profile)
      ├── FloatingAIAssistant (global floating widget)
      │
      └── Route Pages
          ├── AcademicHub (/workspace/academic)
          │   ├── PredictedQuestions (/predicted-questions)
          │   ├── PYQLibrary (/pyq-library)
          │   ├── NotesLibrary (/notes-library)
          │   ├── ImportantTopics (/important-topics)
          │   └── ClassTimetable (/class-timetable)
          ├── CampusHub (/workspace/campus)
          ├── CareerHub (/workspace/career)
          ├── FacultyDirectory (/workspace/faculty)
          ├── AIAssistant (/workspace/ai-assistant)
          ├── Profile (/workspace/profile)
          └── Settings (/workspace/settings)
```

---

## 🛠️ Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | Next.js (App Router) | 16.2.12 | Server/Client rendering, file-based routing |
| **Language** | TypeScript | 5.x | Type-safe development |
| **UI Library** | React | 19.2.4 | Component architecture |
| **Styling** | Tailwind CSS | 4.x | Utility-first CSS framework |
| **Animations** | Framer Motion | 12.43.x | Declarative animations & page transitions |
| **Animations** | GSAP | 3.15.x | Advanced timeline animations |
| **Charts** | Recharts | 3.10.x | Data visualization (Area/Bar charts) |
| **Icons** | Lucide React | 1.28.x | Consistent icon system |
| **UI Primitives** | Radix UI | Various | Accessible dialog, dropdown, tabs, tooltips |
| **Forms** | React Hook Form + Zod | 7.83 / 3.25 | Validation & form state management |
| **Theming** | next-themes | 0.4.x | Dark/Light theme switching |
| **Utilities** | clsx + tailwind-merge | Latest | Conditional class merging |
| **Compiler** | React Compiler | 1.0.0 | Automatic memoization |
| **Fonts** | Google Fonts | — | Inter, Geist, Geist Mono, Cormorant Garamond |

---

## 📁 Project Structure

```
KIITAnumaan/
│
├── 📄 package.json                  # Dependencies & scripts
├── 📄 next.config.ts                # Next.js configuration (React Compiler enabled)
├── 📄 tsconfig.json                 # TypeScript compiler options
├── 📄 postcss.config.mjs            # PostCSS + Tailwind setup
│
├── 📂 app/                          # Next.js App Router (all routes)
│   ├── 📄 layout.tsx                # Root layout (fonts, metadata, ThemeProvider)
│   ├── 📄 page.tsx                  # Landing page (public marketing site)
│   ├── 📄 globals.css               # Enterprise SaaS design system tokens
│   ├── 📄 favicon.ico               # App favicon
│   │
│   ├── 📂 login/                    # Authentication - Login page
│   │   └── 📄 page.tsx              #   Login form with Google OAuth + email/password
│   │
│   ├── 📂 signup/                   # Authentication - Signup page
│   │   └── 📄 page.tsx              #   Registration form with validation
│   │
│   ├── 📂 onboarding/              # Post-auth redirect
│   │   └── 📄 page.tsx              #   Auto-redirects to /workspace
│   │
│   ├── 📂 academic/                 # Standalone academic landing (public)
│   │   └── 📄 page.tsx              #   Academic features showcase
│   │
│   ├── 📂 campus/                   # Standalone campus landing (public)
│   │   └── 📄 page.tsx              #   Campus features showcase
│   │
│   ├── 📂 career/                   # Standalone career landing (public)
│   │   └── 📄 page.tsx              #   Career features showcase
│   │
│   ├── 📂 dashboard/               # Dashboard overview page
│   │   └── 📄 page.tsx              #   Student dashboard with module links
│   │
│   └── 📂 workspace/               # 🏠 Main authenticated workspace
│       ├── 📄 layout.tsx            #   Workspace shell (Sidebar + Navbar + FAB)
│       ├── 📄 page.tsx              #   Auto-redirect to /workspace/academic
│       │
│       ├── 📂 academic/             # 📚 Academic Hub
│       │   ├── 📄 page.tsx          #   Academic command center with charts & cards
│       │   ├── 📂 predicted-questions/
│       │   │   └── 📄 page.tsx      #   AI question prediction + paper upload
│       │   ├── 📂 pyq-library/
│       │   │   └── 📄 page.tsx      #   Previous Year Questions browser
│       │   ├── 📂 notes-library/
│       │   │   └── 📄 page.tsx      #   Notes & resources repository
│       │   ├── 📂 important-topics/
│       │   │   ├── 📄 page.tsx      #   High-yield exam topics
│       │   │   └── 📂 lecture-videos/
│       │   └── 📂 class-timetable/
│       │       └── 📄 page.tsx      #   Weekly timetable viewer
│       │
│       ├── 📂 campus/               # 🗺️ Campus Hub
│       │   └── 📄 page.tsx          #   Interactive map + faculty + section swap
│       │
│       ├── 📂 career/               # 💼 Career Hub
│       │   └── 📄 page.tsx          #   Resume builder + ATS + placement tracker
│       │
│       ├── 📂 faculty/              # 👨‍🏫 Faculty Directory
│       │   └── 📄 page.tsx          #   Faculty search + ratings + section swap
│       │
│       ├── 📂 ai-assistant/         # 🤖 AI Chat Assistant
│       │   └── 📄 page.tsx          #   Full-page AI chat interface
│       │
│       ├── 📂 profile/              # 👤 User Profile
│       │   └── 📄 page.tsx          #   Profile settings & preferences
│       │
│       └── 📂 settings/             # ⚙️ Settings
│           └── 📄 page.tsx          #   App configuration
│
├── 📂 components/                   # Reusable React components
│   ├── 📂 landing/                  #   Landing page sections
│   │   ├── 📄 LandingNavbar.tsx     #   Public site navigation bar
│   │   ├── 📄 HeroSection.tsx       #   Hero banner with CTA
│   │   ├── 📄 FeaturesSection.tsx   #   Feature cards grid
│   │   ├── 📄 WorkspacePreviewSection.tsx  # Workspace preview mockup
│   │   ├── 📄 ContactSection.tsx    #   Contact form section
│   │   └── 📄 LandingFooter.tsx     #   Footer with links
│   │
│   ├── 📂 shared/                   #   Shared UI components
│   │   ├── 📄 Badge.tsx             #   Status badge component
│   │   ├── 📄 Button.tsx            #   Base button component
│   │   ├── 📄 Card.tsx              #   Card container component
│   │   ├── 📄 FAQ.tsx               #   Accordion FAQ component
│   │   ├── 📄 Footer.tsx            #   App footer
│   │   ├── 📄 GradientButton.tsx    #   Gradient-styled CTA button
│   │   ├── 📄 Input.tsx             #   Form input component
│   │   ├── 📄 Navbar.tsx            #   App navigation bar
│   │   ├── 📄 PageHeader.tsx        #   Page header with breadcrumbs
│   │   ├── 📄 Skeleton.tsx          #   Loading skeleton component
│   │   └── 📄 StatusBadge.tsx       #   Status indicator badge
│   │
│   └── 📂 workspace/               #   Workspace-specific components
│       ├── 📄 WorkspaceSidebar.tsx   #   Hover-expandable sidebar (88px ↔ 256px)
│       ├── 📄 WorkspaceNavbar.tsx    #   Top navbar with search & profile
│       └── 📄 FloatingAIAssistant.tsx  # Floating AI chat widget
│
├── 📂 lib/                          # Utility libraries
│   ├── 📄 animations.ts            #   Framer Motion animation variants
│   └── 📄 utils.ts                 #   Helper functions (cn, formatDate, etc.)
│
├── 📂 types/                        # TypeScript type definitions
│   └── 📄 index.ts                 #   All enterprise data models
│
└── 📂 public/                       # Static assets
    ├── 📄 kiit-campus-dotted.jpg    #   KIIT campus wireframe background
    ├── 📄 kiit-campus-dotted.png    #   KIIT campus wireframe (PNG)
    ├── 📄 kiit-map.jpg              #   KIIT campus map image
    └── 📄 *.svg                     #   Icon assets
```

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Minimum Version |
|-------------|----------------|
| **Node.js** | 18.17+ |
| **npm** | 9.x+ |
| **Git** | 2.x+ |

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/soumyarlenka/KIITAnumaan.git

# 2. Navigate into the project
cd KIITAnumaan

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

The app will be available at **`http://localhost:3000`**

### Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **Dev** | `npm run dev` | Start Next.js development server with hot reload |
| **Build** | `npm run build` | Create optimized production build |
| **Start** | `npm run start` | Serve the production build locally |

### Environment Setup

No environment variables are required for the frontend-only version. The platform currently runs with mock/sample data for all modules.

---

## 🗺️ Route Map

```
/                                    → Landing Page (Public)
├── /login                           → Login / Authentication
├── /signup                          → Registration
├── /onboarding                      → Post-auth redirect → /workspace
├── /dashboard                       → Student Dashboard Overview
│
└── /workspace                       → Auto-redirect → /workspace/academic
    ├── /workspace/academic          → 📚 Academic Command Center
    │   ├── /predicted-questions     →    AI Predicted Questions + Paper Upload
    │   ├── /pyq-library             →    Previous Year Question Papers
    │   ├── /notes-library           →    Notes & Resources Repository
    │   ├── /important-topics        →    High-Yield Exam Topics
    │   └── /class-timetable         →    Weekly Class Schedule
    │
    ├── /workspace/campus            → 🗺️ Campus Map + Navigation
    ├── /workspace/career            → 💼 Resume Builder + Placements
    ├── /workspace/faculty           → 👨‍🏫 Faculty Directory + Section Swap
    ├── /workspace/ai-assistant      → 🤖 Full AI Chat Interface
    ├── /workspace/profile           → 👤 User Profile
    └── /workspace/settings          → ⚙️ App Settings
```

---

## 📦 Module Breakdown

### 1. Landing Page (`/`)
The public-facing marketing page with a premium dark aesthetic featuring:
- **Hero Section**: Animated headline with CTA buttons and subtle red accent glow
- **Features Grid**: Interactive feature cards with hover lift animations
- **Workspace Preview**: Visual mockup of the platform workspace
- **Contact Section**: Inquiry form with glassmorphic styling
- **Seamless Grid Background**: Full-page CSS grid pattern overlay

### 2. Authentication (`/login`, `/signup`)
- Dual-mode auth form (login ↔ signup toggle)
- Google OAuth button with branded styling
- Email/password form with show/hide toggle
- Glassmorphic card on pure black background
- Auto-redirect to `/workspace` on submit

### 3. Workspace Shell (`/workspace`)
The authenticated workspace wraps all internal pages with:
- **Sidebar**: Hover-expandable (88px collapsed → 256px expanded) with 3-tier navigation (Academic, Campus, Career) and nested submenu items
- **Navbar**: Top bar with search input, breadcrumbs, profile avatar, and notification bell
- **Floating AI**: Global floating chat widget accessible from any page
- **Grid Background**: Subtle CSS grid pattern persists across all workspace pages

### 4. Academic Hub (`/workspace/academic`)
The central academic command center featuring:
- **Prediction Analytics Chart**: Recharts AreaChart showing weekly AI prediction trends
- **Module Navigation Cards**: Quick-access cards to all academic sub-modules
- **Tab-based Navigation**: Tab system with URL search param sync

### 5. AI Predicted Questions (`/workspace/academic/predicted-questions`)
The flagship feature:
- **Subject Selector**: Lock predictions to a single subject (Computer Networks, OS, DBMS)
- **Branch Selector**: Filter by branch (AI, System Design, Civil, Mechanical, etc.)
- **Semester/Exam Type Filter**: Autumn/Spring semester + Mid/End sem
- **Paper Upload**: Drag & drop file import modal with PDF/DOCX/Image support
- **Question Library Integration**: Redirect to PYQ Library with pre-filtered subject
- **Prediction Cards**: Unit-wise predicted questions with probability percentages, difficulty tags, and copy-to-clipboard

### 6. PYQ Library (`/workspace/academic/pyq-library`)
- **Hero Banner**: Full-bleed red KIIT campus wireframe background
- **Liquid Glass Toolbar**: Compact dropdown filter pills (Year, Semester, Branch, Subject, Exam Type)
- **Paper Cards**: Download-ready PYQ cards with metadata badges
- **Upload Paper Action**: Add new papers to the community library

### 7. Notes Library (`/workspace/academic/notes-library`)
- **Hero Banner**: Red KIIT wireframe background header
- **Note Cards**: Rated notes with author, downloads, stars, and file type indicators
- **Search & Filter**: Subject-based filtering with sort options

### 8. Important Topics (`/workspace/academic/important-topics`)
- **Topic Priority Cards**: Chapter-wise importance ranking with color-coded priority levels
- **Lecture Videos**: Sub-route for video resources
- **Progress Tracking**: Visual completion indicators per topic

### 9. Campus Hub (`/workspace/campus`)
- **Interactive Map**: Zoomable campus map with building pins
- **Category Tabs**: Filter by Hostels, Libraries, Labs, Cafeterias, Parking
- **Building Details**: Click pins to view building info, floor plans, and facilities
- **Navigation Mode**: Point-to-point campus navigation

### 10. Career Hub (`/workspace/career`)
- **Resume Builder Tab**: Section-based resume editor with real-time preview
- **ATS Checker Tab**: AI-powered resume scoring with keyword recommendations
- **Placement Tab**: Company drive cards with CTC, eligibility, and application status
- **AI Blueprint Tab**: Career path generator based on skills and goals
- **Mentor Connect Tab**: Faculty/alumni mentorship matching

### 11. Faculty Directory (`/workspace/faculty`)
- **Faculty Cards**: Searchable faculty profiles with photo, designation, department
- **Rating System**: Star ratings with review counts
- **Office Hours**: Cabin location, availability status, and contact info
- **Section Swap**: Integrated section swap marketplace

---

## 🎨 Design System

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-main` | `#080808` | Page background |
| `--bg-surface` | `#101010` | Elevated surface |
| `--bg-card` | `#141414` | Card backgrounds |
| `--border` | `rgba(255,255,255,0.08)` | Default borders |
| `--border-hover` | `rgba(255,59,48,0.5)` | Hover state borders |
| `--primary-accent` | `#FF3B30` | Primary brand red |
| `--primary-accent-hover` | `#E03126` | Red hover state |
| `--text-main` | `#FFFFFF` | Primary text |
| `--text-muted` | `#9CA3AF` | Secondary text |
| `--text-dim` | `#6B7280` | Tertiary text |

### Typography

| Font | Variable | Usage |
|------|----------|-------|
| **Inter** | `--font-inter` | Primary UI text |
| **Geist Sans** | `--font-geist-sans` | System text |
| **Geist Mono** | `--font-geist-mono` | Code & numbers |
| **Cormorant Garamond** | `--font-cormorant` | Editorial headings |

### Design Principles
- **Glassmorphism**: Frosted glass effects with `backdrop-blur` and semi-transparent backgrounds
- **Micro-animations**: Hover lifts, scale transitions, border color shifts on interactive elements
- **Liquid Glass Toolbar**: Compact filter pills with translucent dark glass aesthetic
- **Red Accent Language**: `#FF3B30` accent used consistently for CTAs, badges, and active states
- **Grid Overlay**: Subtle 4rem grid pattern across all pages for visual depth
- **Hero Banners**: Full-bleed red KIIT campus wireframe backgrounds on academic sub-pages

---

## 🧩 Component Library

### Landing Components (`components/landing/`)
| Component | Description |
|-----------|-------------|
| `LandingNavbar` | Transparent navbar with scroll-aware background transition |
| `HeroSection` | Full-viewport hero with animated headline and dual CTA buttons |
| `FeaturesSection` | 3×2 feature cards grid with icon + description |
| `WorkspacePreviewSection` | Workspace UI mockup with annotation callouts |
| `ContactSection` | Contact form with glassmorphic card styling |
| `LandingFooter` | Minimal footer with copyright and links |

### Shared Components (`components/shared/`)
| Component | Description |
|-----------|-------------|
| `Badge` | Rounded pill badge with variant support |
| `Button` | Base button with size/variant props |
| `Card` | Styled card container with hover effects |
| `FAQ` | Expandable accordion FAQ items |
| `Footer` | Full footer with link columns |
| `GradientButton` | Red gradient CTA button with glow effect |
| `Input` | Form input with label and validation styling |
| `Navbar` | App-wide navigation bar |
| `PageHeader` | Page title + breadcrumb component |
| `Skeleton` | Loading placeholder with pulse animation |
| `StatusBadge` | Color-coded status indicator |

### Workspace Components (`components/workspace/`)
| Component | Description |
|-----------|-------------|
| `WorkspaceSidebar` | Hover-expandable sidebar (88px → 256px) with nested submenu groups |
| `WorkspaceNavbar` | Top navigation with breadcrumbs, global search, and user avatar |
| `FloatingAIAssistant` | Bottom-right floating chat bubble with expandable chat window |

---

## 📐 Data Models

```typescript
// User roles within the KIIT ecosystem
type UserRole = 'student' | 'faculty' | 'admin' | 'placement_officer'
type Semester = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
type Branch = 'CSE' | 'ECE' | 'EEE' | 'ME' | 'CE' | 'IT' | 'CSE-AI' | 'CSE-DS'

interface User {
  id: string; name: string; email: string; rollNumber: string;
  branch: Branch; semester: Semester; section: string;
  cgpa: number; role: UserRole; avatar?: string;
}

interface PYQ {
  id: string; subject: string; subjectCode: string;
  year: number; semester: Semester;
  examType: 'Mid Term' | 'End Term' | 'Supplementary';
  branch: Branch[]; fileSize: string; downloads: number;
  aiProbability?: number; isImportant?: boolean;
}

interface NoteItem {
  id: string; title: string; subject: string;
  type: 'pdf' | 'doc' | 'image'; size: string;
  author: string; downloads: number; stars: number;
  semester: Semester;
}

interface PlacementDrive {
  id: string; company: string; role: string;
  package: string; deadline: string;
  status: 'open' | 'closed' | 'upcoming';
  cgpaCriteria: number; branches: Branch[];
  applicantsCount: number;
}

interface FacultyMember {
  id: string; name: string; designation: string;
  department: string; subjects: string[];
  rating: number; reviewsCount: number; email: string;
}

interface SectionSwapRequest {
  id: string; studentName: string;
  currentSection: string; desiredSection: string;
  subject: string; status: 'open' | 'matched' | 'closed';
  postedAt: string;
}
```

---

## 🎬 Animation System

KIITAnumaan uses a centralized animation system via **Framer Motion** variants defined in [`lib/animations.ts`](lib/animations.ts):

| Variant | Effect | Duration |
|---------|--------|----------|
| `fadeIn` | Opacity 0 → 1 | 300ms |
| `fadeInUp` | Fade + slide up 16px | 350ms |
| `fadeInDown` | Fade + slide down 16px | 350ms |
| `slideInLeft` | Fade + slide from left 20px | 350ms |
| `slideInRight` | Fade + slide from right 20px | 350ms |
| `scaleIn` | Fade + scale from 0.95 → 1 | 250ms |
| `staggerContainer` | Parent container with staggered children | 80ms stagger |
| `staggerItem` | Child item fade + slide up 12px | 300ms |
| `pageTransition` | Full page enter/exit animation | 400ms / 200ms |
| `cardHoverVariants` | Hover: scale 1.01 + lift -2px | 200ms |
| `progressVariants` | Width animation 0% → N% | 800ms |
| `sidebarVariants` | Expand/collapse 72px ↔ 256px | 300ms |

All animations use a custom cubic-bezier easing: `[0.16, 1, 0.3, 1]` for a natural, spring-like feel.

---

## 🖼️ Screenshots

> 🚧 *Screenshots coming soon. Run `npm run dev` to preview the full platform locally.*

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature`
3. **Commit** your changes: `git commit -m "feat: add your feature"`
4. **Push** to the branch: `git push origin feature/your-feature`
5. **Open** a Pull Request

### Commit Convention

| Prefix | Usage |
|--------|-------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `style:` | UI/design changes |
| `refactor:` | Code restructuring |
| `docs:` | Documentation updates |
| `chore:` | Build/config changes |

---

## 📄 License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

---

<p align="center">
  Built with ❤️ for <strong>KIIT University</strong> students
  <br/>
  <sub>© 2026 KIITAnumaan Team · Powered by Next.js 16 + React 19</sub>
</p>
