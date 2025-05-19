
import { useState, useEffect } from 'react';
import { TalentData } from '@/types/talent';
import { toast } from "@/components/ui/use-toast";

// Initial talent data
const initialTalent: TalentData[] = [
  {
    id: 1,
    name: "Pamela Williams",
    photo: null,
    location: "New York, NY",
    category: "Brand Strategy",
    experience: "Advanced",
    availability: "Immediate",
    bio: "Strategic brand professional with 6+ years of experience in developing brand identities and compelling copy.",
    skills: ["Brand Strategy", "Copywriting"],
    portfolio: ["www.behance.net/pamela"],
    email: "pam@email.com",
    status: "Active",
    notes: "",
    matchScore: 0,
    lastContact: "2025-05-01"
  }
];

export const useTalentPool = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    experience: '',
    location: '',
    availability: ''
  });
  const [talent, setTalent] = useState(initialTalent);
  const [clientRequirements, setClientRequirements] = useState({
    position: '',
    experienceLevel: '',
    location: '',
    availability: '',
    skills: ''
  });
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedTalentId, setSelectedTalentId] = useState<number | null>(null);
  
  // Load talent data from localStorage when component mounts
  useEffect(() => {
    try {
      const savedTalent = localStorage.getItem('talentApplications');
      if (savedTalent) {
        // Parse the saved applications
        const applications = JSON.parse(savedTalent);
        
        // Map the application data to our TalentData format
        const formattedApplications = applications.map((app: any, index: number) => ({
          id: initialTalent.length + index + 1,
          name: `${app.firstName} ${app.lastName}`,
          photo: null,
          location: `${app.city}, ${app.country}`,
          category: app.specialization,
          experience: app.experienceLevel,
          availability: app.availability,
          bio: app.bio,
          skills: app.skills.split(',').map((skill: string) => skill.trim()),
          portfolio: [app.portfolioUrl],
          email: app.email,
          status: "Active",
          notes: "",
          matchScore: 0,
          lastContact: new Date().toISOString().split('T')[0]
        }));
        
        // Combine initial talent with new applications
        setTalent([...initialTalent, ...formattedApplications]);
        
        // Show a success message if new talent was added
        if (formattedApplications.length > 0) {
          toast({
            title: "Talent Pool Updated",
            description: `${formattedApplications.length} approved talent profile(s) loaded.`,
          });
        }
      }
    } catch (error) {
      console.error("Error loading talent applications:", error);
    }
  }, []);
  
  const filteredTalent = talent.filter(talentItem => {
    // Search term filter
    const searchMatch = searchTerm === '' || 
      talentItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      talentItem.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      talentItem.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Category filter
    const categoryMatch = filters.category === '' || talentItem.category === filters.category;
    
    // Experience filter
    const experienceMatch = filters.experience === '' || talentItem.experience === filters.experience;
    
    // Location filter
    const locationMatch = filters.location === '' || talentItem.location.includes(filters.location);
    
    // Availability filter
    const availabilityMatch = filters.availability === '' || talentItem.availability === filters.availability;
    
    return searchMatch && categoryMatch && experienceMatch && locationMatch && availabilityMatch;
  });

  const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
    setFilters({
      ...filters,
      [filterName]: value
    });
  };

  const handleClientRequirementChange = (field: keyof typeof clientRequirements, value: string) => {
    setClientRequirements({
      ...clientRequirements,
      [field]: value
    });
  };

  const findMatches = () => {
    // Calculate match scores based on client requirements
    const updatedTalent = talent.map(talentItem => {
      let score = 0;
      
      // Match category/position
      if (clientRequirements.position && 
          (talentItem.category.toLowerCase().includes(clientRequirements.position.toLowerCase()) ||
           talentItem.skills.some(skill => skill.toLowerCase().includes(clientRequirements.position.toLowerCase())))) {
        score += 30;
      }
      
      // Match experience level
      if (clientRequirements.experienceLevel && talentItem.experience === clientRequirements.experienceLevel) {
        score += 25;
      }
      
      // Match location
      if (clientRequirements.location && talentItem.location.toLowerCase().includes(clientRequirements.location.toLowerCase())) {
        score += 20;
      }
      
      // Match availability
      if (clientRequirements.availability && talentItem.availability === clientRequirements.availability) {
        score += 15;
      }
      
      // Match specific skills
      if (clientRequirements.skills) {
        const requiredSkills = clientRequirements.skills.toLowerCase().split(',').map(s => s.trim());
        const matchedSkills = talentItem.skills.filter(skill => 
          requiredSkills.some(reqSkill => skill.toLowerCase().includes(reqSkill))
        );
        
        if (matchedSkills.length > 0) {
          score += matchedSkills.length * 10;
        }
      }
      
      return {
        ...talentItem,
        matchScore: score
      };
    });
    
    // Sort by match score
    updatedTalent.sort((a, b) => b.matchScore - a.matchScore);
    setTalent(updatedTalent);
    setActiveTab('admin'); // Switch to admin view to see results
  };

  const handleUpdateStatus = (id: number, status: string) => {
    const updatedTalent = talent.map(item => 
      item.id === id ? { ...item, status } : item
    );
    setTalent(updatedTalent);
  };

  const handleUpdateNotes = (id: number, notes: string) => {
    const updatedTalent = talent.map(item => 
      item.id === id ? { ...item, notes } : item
    );
    setTalent(updatedTalent);
  };

  const exportData = (format: 'csv' | 'pdf') => {
    // This would be connected to actual export functionality
    console.log(`Exporting data in ${format} format`);
    alert(`Talent data would be exported as ${format.toUpperCase()} here.`);
  };

  return {
    searchTerm,
    setSearchTerm,
    filters,
    talent,
    clientRequirements,
    activeTab,
    setActiveTab,
    selectedTalentId,
    setSelectedTalentId,
    filteredTalent,
    handleFilterChange,
    handleClientRequirementChange,
    findMatches,
    handleUpdateStatus,
    handleUpdateNotes,
    exportData
  };
};
