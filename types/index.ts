// KIITAnumaan — All Enterprise Data Models

export type UserRole = 'student' | 'faculty' | 'admin' | 'placement_officer'
export type Semester = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
export type Branch = 'CSE' | 'ECE' | 'EEE' | 'ME' | 'CE' | 'IT' | 'CSE-AI' | 'CSE-DS'

export interface User {
  id: string
  name: string
  email: string
  rollNumber: string
  branch: Branch
  semester: Semester
  section: string
  cgpa: number
  role: UserRole
  avatar?: string
}

export interface PYQ {
  id: string
  subject: string
  subjectCode: string
  year: number
  semester: Semester
  examType: 'Mid Term' | 'End Term' | 'Supplementary'
  branch: Branch[]
  fileSize: string
  downloads: number
  aiProbability?: number
  isImportant?: boolean
}

export interface NoteItem {
  id: string
  title: string
  subject: string
  type: 'pdf' | 'doc' | 'image'
  size: string
  author: string
  downloads: number
  stars: number
  semester: Semester
}

export interface PlacementDrive {
  id: string
  company: string
  role: string
  package: string
  deadline: string
  status: 'open' | 'closed' | 'upcoming'
  cgpaCriteria: number
  branches: Branch[]
  applicantsCount: number
}

export interface FacultyMember {
  id: string
  name: string
  designation: string
  department: string
  subjects: string[]
  rating: number
  reviewsCount: number
  email: string
}

export interface SectionSwapRequest {
  id: string
  studentName: string
  currentSection: string
  desiredSection: string
  subject: string
  status: 'open' | 'matched' | 'closed'
  postedAt: string
}
