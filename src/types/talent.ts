
export interface TalentData {
  id: number;
  name: string;
  photo: string | null;
  location: string;
  category: string;
  experience: string;
  availability: string;
  bio: string;
  skills: string[];
  portfolio: string[];
  email: string;
  status?: string;
  notes?: string;
  matchScore?: number;
  lastContact?: string;
}
