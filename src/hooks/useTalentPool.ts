import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { applicationToTalentData } from '@/services/talentService';
import type { TalentApplication } from '@/lib/database.types';

export const useTalentPool = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    experience: '',
    location: '',
    availability: ''
  });
  const [clientRequirements, setClientRequirements] = useState({
    position: '',
    experienceLevel: '',
    location: '',
    availability: '',
    skills: ''
  });
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedTalentId, setSelectedTalentId] = useState<string | null>(null);
  const [matchScores, setMatchScores] = useState<Record<string, number>>({});
  const [hasRunMatch, setHasRunMatch] = useState(false);

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['talent_applications', 'approved'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('talent_applications')
        .select('*')
        .eq('status', 'approved')
        .order('reviewed_at', { ascending: false });
      if (error) throw error;
      return data as TalentApplication[];
    }
  });

  const talent = applications.map(app => ({
    ...applicationToTalentData(app),
    matchScore: matchScores[app.id] ?? 0,
  }));

  const filteredTalent = talent.filter(item => {
    const searchMatch =
      searchTerm === '' ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));

    const categoryMatch = filters.category === '' || item.category === filters.category;
    const experienceMatch = filters.experience === '' || item.experience === filters.experience;
    const locationMatch = filters.location === '' || item.location.includes(filters.location);
    const availabilityMatch = filters.availability === '' || item.availability === filters.availability;

    return searchMatch && categoryMatch && experienceMatch && locationMatch && availabilityMatch;
  });

  const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const handleClientRequirementChange = (field: keyof typeof clientRequirements, value: string) => {
    setClientRequirements(prev => ({ ...prev, [field]: value }));
  };

  // Match tab: all talent sorted by score — never filtered by browse sidebar
  const matchedTalent = [...talent].sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));

  const findMatches = () => {
    const scores: Record<string, number> = {};

    for (const item of talent) {
      let score = 0;

      if (clientRequirements.position &&
        (item.category.toLowerCase().includes(clientRequirements.position.toLowerCase()) ||
          item.skills.some(s => s.toLowerCase().includes(clientRequirements.position.toLowerCase())))) {
        score += 30;
      }
      if (clientRequirements.experienceLevel && item.experience === clientRequirements.experienceLevel) score += 25;
      if (clientRequirements.location && item.location.toLowerCase().includes(clientRequirements.location.toLowerCase())) score += 20;
      if (clientRequirements.availability && item.availability === clientRequirements.availability) score += 15;
      if (clientRequirements.skills) {
        const required = clientRequirements.skills.toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
        const matched = item.skills.filter(s => required.some(r => s.toLowerCase().includes(r)));
        score += matched.length * 10;
      }

      scores[item.id] = score;
    }

    setMatchScores(scores);
    setHasRunMatch(true);
    setActiveTab('admin');
  };

  const exportData = () => {
    const header = ['Name', 'Email', 'Specialization', 'Experience', 'Location', 'Availability', 'Skills'];
    const rows = filteredTalent.map(t => [
      t.name,
      t.email,
      t.category,
      t.experience,
      t.location,
      t.availability,
      t.skills.join('; ')
    ]);

    const csv = [header, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cremetalent-export-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return {
    searchTerm,
    setSearchTerm,
    filters,
    talent,
    isLoading,
    clientRequirements,
    activeTab,
    setActiveTab,
    selectedTalentId,
    setSelectedTalentId,
    filteredTalent,
    matchedTalent,
    hasRunMatch,
    handleFilterChange,
    handleClientRequirementChange,
    findMatches,
    exportData,
  };
};
