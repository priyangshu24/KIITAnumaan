export type Year = '1st Year' | '2nd Year' | '3rd Year' | '4th Year'

export interface SubjectAssignment {
  name: string
  theory: string
  lab: string | null
}

export interface SectionOption {
  code: string
  label: string
  year: Year
  meta: string
  rating: number
  isYours: boolean
  full: boolean
  peer: string | null
  subjects: SubjectAssignment[]
}

export const studentYear: Year = '3rd Year'

export const sections: SectionOption[] = [
  // ---------------- 1st Year (CSE) ----------------
  {
    code: '1A', label: 'CSE 1', year: '1st Year', meta: '72 students', rating: 4.0,
    isYours: false, full: false, peer: null,
    subjects: [
      { name: 'Engineering Mathematics I', theory: 'Dr. Meera Swain', lab: null },
      { name: 'Programming in C', theory: 'Dr. Rakesh Behera', lab: 'Ms. Priyanka Jena' },
      { name: 'Engineering Physics', theory: 'Dr. Alok Mishra', lab: 'Mr. Debasish Rout' },
    ],
  },
  {
    code: '1B', label: 'CSE 2', year: '1st Year', meta: '65 students', rating: 4.3,
    isYours: false, full: false, peer: null,
    subjects: [
      { name: 'Engineering Mathematics I', theory: 'Dr. Meera Swain', lab: null },
      { name: 'Programming in C', theory: 'Ms. Swagatika Pati', lab: 'Ms. Priyanka Jena' },
      { name: 'Engineering Physics', theory: 'Dr. Alok Mishra', lab: 'Mr. Debasish Rout' },
    ],
  },
  {
    code: '1C', label: 'CSE 3', year: '1st Year', meta: '70 students · full', rating: 3.8,
    isYours: false, full: true, peer: null,
    subjects: [
      { name: 'Engineering Mathematics I', theory: 'Dr. Rakesh Behera', lab: null },
      { name: 'Programming in C', theory: 'Dr. Rakesh Behera', lab: 'Mr. Debasish Rout' },
      { name: 'Engineering Physics', theory: 'Ms. Swagatika Pati', lab: 'Mr. Abhishek Panda' },
    ],
  },

  // ---------------- 2nd Year (CSE) ----------------
  {
    code: '2A', label: 'CSE 1', year: '2nd Year', meta: '66 students', rating: 4.2,
    isYours: false, full: false, peer: null,
    subjects: [
      { name: 'Data Structures', theory: 'Dr. Ananya Mishra', lab: 'Mr. Chinmay Sahoo' },
      { name: 'Digital Logic Design', theory: 'Dr. Snigdha Patra', lab: 'Mr. Abhishek Panda' },
      { name: 'Discrete Mathematics', theory: 'Dr. Rashmi Dalai', lab: null },
    ],
  },
  {
    code: '2B', label: 'CSE 2', year: '2nd Year', meta: '60 students', rating: 4.5,
    isYours: false, full: false, peer: null,
    subjects: [
      { name: 'Data Structures', theory: 'Dr. Ananya Mishra', lab: 'Ms. Puja Mallick' },
      { name: 'Digital Logic Design', theory: 'Mr. Abhishek Panda', lab: 'Mr. Chinmay Sahoo' },
      { name: 'Discrete Mathematics', theory: 'Dr. Rashmi Dalai', lab: null },
    ],
  },
  {
    code: '2C', label: 'CSE 3', year: '2nd Year', meta: '69 students · full', rating: 4.0,
    isYours: false, full: true, peer: null,
    subjects: [
      { name: 'Data Structures', theory: 'Dr. Snigdha Patra', lab: 'Ms. Puja Mallick' },
      { name: 'Digital Logic Design', theory: 'Dr. Snigdha Patra', lab: 'Mr. Abhishek Panda' },
      { name: 'Discrete Mathematics', theory: 'Dr. Rashmi Dalai', lab: null },
    ],
  },

  // ---------------- 3rd Year (CSE) ----------------
  {
    code: 'C', label: 'CSE 1', year: '3rd Year', meta: 'yours · 68 students', rating: 4.1,
    isYours: true, full: false, peer: null,
    subjects: [
      { name: 'Operating Systems', theory: 'Prof. R. N. Dash', lab: 'Ms. Priya Rout' },
      { name: 'DBMS', theory: 'Dr. A. K. Mohapatra', lab: 'Mr. Ashish Nayak' },
      { name: 'Computer Networks', theory: 'Dr. P. K. Pattnaik', lab: 'Ms. Debasmita Sahu' },
    ],
  },
  {
    code: 'D', label: 'CSE 2', year: '3rd Year', meta: '62 students · 6 seats', rating: 4.4,
    isYours: false, full: false, peer: 'A. Tripathy',
    subjects: [
      { name: 'Operating Systems', theory: 'Dr. Suresh Senapati', lab: 'Ms. Priya Rout' },
      { name: 'DBMS', theory: 'Dr. Ananya Mishra', lab: 'Mr. Ashish Nayak' },
      { name: 'Computer Networks', theory: 'Prof. R. N. Dash', lab: 'Ms. Debasmita Sahu' },
    ],
  },
  {
    code: 'E', label: 'CSE 3', year: '3rd Year', meta: '66 students · 2 seats', rating: 4.2,
    isYours: false, full: false, peer: 'B. Mallick',
    subjects: [
      { name: 'Operating Systems', theory: 'Dr. A. K. Mohapatra', lab: 'Mr. Ashish Nayak' },
      { name: 'DBMS', theory: 'Dr. P. K. Pattnaik', lab: 'Ms. Priya Rout' },
      { name: 'Computer Networks', theory: 'Dr. Suresh Senapati', lab: 'Ms. Debasmita Sahu' },
    ],
  },
  {
    code: 'F', label: 'CSE 4', year: '3rd Year', meta: '64 students · 4 seats', rating: 4.6,
    isYours: false, full: false, peer: 'R. Sahu',
    subjects: [
      { name: 'Operating Systems', theory: 'Dr. Suresh Senapati', lab: 'Ms. Priya Rout' },
      { name: 'DBMS', theory: 'Dr. Ananya Mishra', lab: 'Mr. Ashish Nayak' },
      { name: 'Computer Networks', theory: 'Prof. R. N. Dash', lab: 'Ms. Debasmita Sahu' },
    ],
  },
  {
    code: 'A', label: 'CSE 5', year: '3rd Year', meta: '70 students · full', rating: 3.9,
    isYours: false, full: true, peer: 'K. Panigrahi',
    subjects: [
      { name: 'Operating Systems', theory: 'Dr. A. K. Mohapatra', lab: 'Mr. Ashish Nayak' },
      { name: 'DBMS', theory: 'Dr. P. K. Pattnaik', lab: 'Mr. Biswajit Nanda' },
      { name: 'Computer Networks', theory: 'Dr. Suresh Senapati', lab: 'Ms. Debasmita Sahu' },
    ],
  },

  // ---------------- 4th Year (CSE) ----------------
  {
    code: '4A', label: 'CSE 1', year: '4th Year', meta: '58 students', rating: 4.5,
    isYours: false, full: false, peer: null,
    subjects: [
      { name: 'Machine Learning', theory: 'Dr. Ananya Mishra', lab: 'Ms. Priya Rout' },
      { name: 'Cloud Computing', theory: 'Dr. P. K. Pattnaik', lab: 'Mr. Ashish Nayak' },
      { name: 'Software Engineering', theory: 'Dr. Suresh Senapati', lab: null },
    ],
  },
  {
    code: '4B', label: 'CSE 2', year: '4th Year', meta: '60 students · full', rating: 4.1,
    isYours: false, full: true, peer: null,
    subjects: [
      { name: 'Machine Learning', theory: 'Dr. Ananya Mishra', lab: 'Ms. Debasmita Sahu' },
      { name: 'Cloud Computing', theory: 'Dr. P. K. Pattnaik', lab: 'Mr. Ashish Nayak' },
      { name: 'Software Engineering', theory: 'Dr. Suresh Senapati', lab: null },
    ],
  },
  {
    code: '4C', label: 'CSE 3', year: '4th Year', meta: '55 students', rating: 4.7,
    isYours: false, full: false, peer: null,
    subjects: [
      { name: 'Machine Learning', theory: 'Dr. Ananya Mishra', lab: 'Ms. Priya Rout' },
      { name: 'Cloud Computing', theory: 'Dr. Suresh Senapati', lab: 'Mr. Ashish Nayak' },
      { name: 'Software Engineering', theory: 'Dr. P. K. Pattnaik', lab: null },
    ],
  },
]

// Individual faculty ratings (out of 5) used to color-code the ratings sheet.
export const facultyRatings: Record<string, number> = {
  'Dr. Meera Swain': 4.0,
  'Dr. Rakesh Behera': 3.6,
  'Ms. Priyanka Jena': 4.3,
  'Mr. Debasish Rout': 3.1,
  'Dr. Alok Mishra': 4.7,
  'Ms. Swagatika Pati': 3.4,
  'Dr. Ananya Mishra': 4.8,
  'Mr. Chinmay Sahoo': 3.9,
  'Dr. Snigdha Patra': 4.5,
  'Mr. Abhishek Panda': 3.0,
  'Dr. Rashmi Dalai': 4.2,
  'Ms. Puja Mallick': 4.6,
  'Prof. R. N. Dash': 4.9,
  'Dr. A. K. Mohapatra': 4.7,
  'Dr. P. K. Pattnaik': 4.6,
  'Dr. Suresh Senapati': 4.9,
  'Ms. Priya Rout': 3.8,
  'Mr. Ashish Nayak': 2.9,
  'Ms. Debasmita Sahu': 4.1,
  'Mr. Biswajit Nanda': 3.0,
}

export type RatingTier = 'blue' | 'green' | 'yellow' | 'red'

export function getRatingTier(rating: number): RatingTier {
  if (rating >= 4.6) return 'blue'
  if (rating >= 4.0) return 'green'
  if (rating >= 3.3) return 'yellow'
  return 'red'
}

function getSectionTeacherRatings(section: SectionOption): number[] {
  return section.subjects.flatMap((sub) => {
    const list = [facultyRatings[sub.theory] ?? 0]
    if (sub.lab) list.push(facultyRatings[sub.lab] ?? 0)
    return list
  })
}

export function getSectionAverageRating(section: SectionOption): number {
  const values = getSectionTeacherRatings(section)
  return values.reduce((sum, v) => sum + v, 0) / values.length
}

export function getSectionRedTeacherCount(section: SectionOption): number {
  return getSectionTeacherRatings(section).filter((r) => getRatingTier(r) === 'red').length
}

// A section with 2 or more poorly-rated (red) teachers is flagged red overall,
// even if its average rating would otherwise land in a higher tier.
export function getSectionTier(section: SectionOption): RatingTier {
  if (getSectionRedTeacherCount(section) >= 2) return 'red'
  return getRatingTier(getSectionAverageRating(section))
}

export const tierStyles: Record<RatingTier, { text: string; bg: string; border: string; rowBg: string; rowBorder: string; label: string }> = {
  blue: {
    text: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/30',
    rowBg: 'bg-sky-500/[0.05]',
    rowBorder: 'border-sky-500/25',
    label: 'Excellent',
  },
  green: {
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    rowBg: 'bg-emerald-500/[0.05]',
    rowBorder: 'border-emerald-500/25',
    label: 'Good',
  },
  yellow: {
    text: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    rowBg: 'bg-yellow-500/[0.05]',
    rowBorder: 'border-yellow-500/25',
    label: 'Average',
  },
  red: {
    text: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    rowBg: 'bg-red-500/[0.06]',
    rowBorder: 'border-red-500/30',
    label: 'Needs Improvement',
  },
}
