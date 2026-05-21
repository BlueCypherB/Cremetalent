export interface TalentCategory {
  value: string
  label: string
  sector: string
}

export const TALENT_CATEGORIES: TalentCategory[] = [
  // Creative & Design
  { value: 'Graphic Design',        label: 'Graphic Design',        sector: 'Creative & Design' },
  { value: 'UX/UI Design',          label: 'UX/UI Design',          sector: 'Creative & Design' },
  { value: 'Illustration',          label: 'Illustration',          sector: 'Creative & Design' },
  { value: 'Motion Graphics',       label: 'Motion Graphics',       sector: 'Creative & Design' },
  { value: 'Brand Identity',        label: 'Brand Identity',        sector: 'Creative & Design' },
  { value: 'Brand Strategy',        label: 'Brand Strategy',        sector: 'Creative & Design' },
  { value: 'Print Design',          label: 'Print Design',          sector: 'Creative & Design' },
  { value: 'Fashion Design',        label: 'Fashion Design',        sector: 'Creative & Design' },

  // Video & Photography
  { value: 'Videography',           label: 'Videography',           sector: 'Video & Photography' },
  { value: 'Video Editing',         label: 'Video Editing',         sector: 'Video & Photography' },
  { value: 'Photography',           label: 'Photography',           sector: 'Video & Photography' },
  { value: 'Animation',             label: 'Animation',             sector: 'Video & Photography' },
  { value: 'Drone Operation',       label: 'Drone Operation',       sector: 'Video & Photography' },
  { value: '3D Modeling',           label: '3D Modeling',           sector: 'Video & Photography' },

  // Content & Writing
  { value: 'Copywriting',           label: 'Copywriting',           sector: 'Content & Writing' },
  { value: 'Content Creation',      label: 'Content Creation',      sector: 'Content & Writing' },
  { value: 'Scriptwriting',         label: 'Scriptwriting',         sector: 'Content & Writing' },
  { value: 'Technical Writing',     label: 'Technical Writing',     sector: 'Content & Writing' },
  { value: 'Blogging',              label: 'Blogging',              sector: 'Content & Writing' },
  { value: 'Podcast Production',    label: 'Podcast Production',    sector: 'Content & Writing' },
  { value: 'Voice-Over',            label: 'Voice-Over',            sector: 'Content & Writing' },

  // Digital Marketing
  { value: 'Digital Marketing',     label: 'Digital Marketing',     sector: 'Digital Marketing' },
  { value: 'Social Media',          label: 'Social Media',          sector: 'Digital Marketing' },
  { value: 'SEO / SEM',             label: 'SEO / SEM',             sector: 'Digital Marketing' },
  { value: 'Email Marketing',       label: 'Email Marketing',       sector: 'Digital Marketing' },
  { value: 'Influencer Marketing',  label: 'Influencer Marketing',  sector: 'Digital Marketing' },
  { value: 'Paid Advertising',      label: 'Paid Advertising',      sector: 'Digital Marketing' },
  { value: 'Community Management',  label: 'Community Management',  sector: 'Digital Marketing' },

  // Technology
  { value: 'Web Development',       label: 'Web Development',       sector: 'Technology' },
  { value: 'App Development',       label: 'App Development',       sector: 'Technology' },
  { value: 'E-commerce Development', label: 'E-commerce Development', sector: 'Technology' },
  { value: 'DevOps / Cloud',        label: 'DevOps / Cloud',        sector: 'Technology' },
  { value: 'Data Analysis',         label: 'Data Analysis',         sector: 'Technology' },
  { value: 'Cybersecurity',         label: 'Cybersecurity',         sector: 'Technology' },
  { value: 'AI / Machine Learning', label: 'AI / Machine Learning', sector: 'Technology' },
  { value: 'Blockchain',            label: 'Blockchain',            sector: 'Technology' },

  // Business & Strategy
  { value: 'Business Strategy',     label: 'Business Strategy',     sector: 'Business & Strategy' },
  { value: 'Project Management',    label: 'Project Management',    sector: 'Business & Strategy' },
  { value: 'Market Research',       label: 'Market Research',       sector: 'Business & Strategy' },
  { value: 'Financial Consulting',  label: 'Financial Consulting',  sector: 'Business & Strategy' },
  { value: 'HR / Recruitment',      label: 'HR / Recruitment',      sector: 'Business & Strategy' },
  { value: 'Legal Services',        label: 'Legal Services',        sector: 'Business & Strategy' },
  { value: 'Event Management',      label: 'Event Management',      sector: 'Business & Strategy' },

  // Media & Communications
  { value: 'Journalism',            label: 'Journalism',            sector: 'Media & Communications' },
  { value: 'PR Strategy',           label: 'PR Strategy',           sector: 'Media & Communications' },
  { value: 'Media Training',        label: 'Media Training',        sector: 'Media & Communications' },
  { value: 'Event Hosting / MCing', label: 'Event Hosting / MCing', sector: 'Media & Communications' },
  { value: 'Radio Production',      label: 'Radio Production',      sector: 'Media & Communications' },

  // Education & Training
  { value: 'Training & Coaching',   label: 'Training & Coaching',   sector: 'Education & Training' },
  { value: 'Curriculum Design',     label: 'Curriculum Design',     sector: 'Education & Training' },
  { value: 'E-learning Development', label: 'E-learning Development', sector: 'Education & Training' },
  { value: 'Academic Research',     label: 'Academic Research',     sector: 'Education & Training' },

  // Health & Wellness
  { value: 'Health Communications', label: 'Health Communications', sector: 'Health & Wellness' },
  { value: 'Fitness & Wellness Coaching', label: 'Fitness & Wellness Coaching', sector: 'Health & Wellness' },
  { value: 'Medical Illustration',  label: 'Medical Illustration',  sector: 'Health & Wellness' },
  { value: 'Mental Health Advocacy', label: 'Mental Health Advocacy', sector: 'Health & Wellness' },

  { value: 'Other',                 label: 'Other',                 sector: 'Other' },
]

export const TALENT_CATEGORY_VALUES = TALENT_CATEGORIES.map(c => c.value) as [string, ...string[]]

export const TALENT_CATEGORIES_BY_SECTOR = TALENT_CATEGORIES.reduce<Record<string, TalentCategory[]>>(
  (acc, cat) => {
    if (!acc[cat.sector]) acc[cat.sector] = []
    acc[cat.sector].push(cat)
    return acc
  },
  {}
)

export const ENGAGEMENT_TYPES = [
  { value: 'project',   label: 'Project-based' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'full-time', label: 'Full-time' },
  { value: 'retainer',  label: 'Monthly retainer' },
] as const

export const EXPERIENCE_LEVELS = [
  { value: 'Beginner',     label: 'Beginner (0–1 years)' },
  { value: 'Intermediate', label: 'Intermediate (2–4 years)' },
  { value: 'Advanced',     label: 'Advanced (5–7 years)' },
  { value: 'Expert',       label: 'Expert (8+ years)' },
] as const

export const AVAILABILITY_OPTIONS = [
  { value: 'Immediate',  label: 'Immediate' },
  { value: 'Two weeks',  label: '2 weeks notice' },
  { value: 'One month',  label: '1 month notice' },
  { value: 'Custom',     label: 'Custom notice period' },
] as const

export const AFRICAN_COUNTRIES = [
  { value: 'Nigeria',          label: 'Nigeria' },
  { value: 'Ghana',            label: 'Ghana' },
  { value: 'Kenya',            label: 'Kenya' },
  { value: 'South Africa',     label: 'South Africa' },
  { value: 'Egypt',            label: 'Egypt' },
  { value: 'Morocco',          label: 'Morocco' },
  { value: 'Ethiopia',         label: 'Ethiopia' },
  { value: 'Tanzania',         label: 'Tanzania' },
  { value: 'Uganda',           label: 'Uganda' },
  { value: "Côte d'Ivoire",    label: "Côte d'Ivoire" },
  { value: 'Senegal',          label: 'Senegal' },
  { value: 'Rwanda',           label: 'Rwanda' },
  { value: 'Cameroon',         label: 'Cameroon' },
  { value: 'Zambia',           label: 'Zambia' },
  { value: 'Zimbabwe',         label: 'Zimbabwe' },
  { value: 'Remote',           label: 'Remote' },
] as const

export const INDUSTRY_OPTIONS = [
  'Advertising & Marketing',
  'Agriculture',
  'Arts & Entertainment',
  'Automotive',
  'Banking & Finance',
  'Construction & Real Estate',
  'Consumer Goods',
  'E-commerce & Retail',
  'Education',
  'Energy & Utilities',
  'Fashion & Beauty',
  'Food & Beverage',
  'Government & Public Sector',
  'Healthcare & Pharma',
  'Hospitality & Tourism',
  'Insurance',
  'Legal',
  'Logistics & Supply Chain',
  'Manufacturing',
  'Media & Publishing',
  'NGO & Non-profit',
  'Oil & Gas',
  'Professional Services',
  'Real Estate',
  'Sports & Recreation',
  'Technology & SaaS',
  'Telecommunications',
  'Transport & Aviation',
  'Other',
]
