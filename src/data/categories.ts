// Re-export canonical lists from taxonomy.ts so client-side code
// can import from one consistent location.
export {
  TALENT_CATEGORIES as SPECIALIZATIONS,
  TALENT_CATEGORY_VALUES,
  TALENT_CATEGORIES_BY_SECTOR,
  ENGAGEMENT_TYPES,
  EXPERIENCE_LEVELS,
  AVAILABILITY_OPTIONS,
  AFRICAN_COUNTRIES,
  INDUSTRY_OPTIONS,
} from '@/lib/taxonomy'

export type { TalentCategory } from '@/lib/taxonomy'
