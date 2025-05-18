
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import {
  Search,
  Filter,
  Briefcase,
  MapPin,
  Clock,
  Star,
  Link as LinkIcon,
  ExternalLink,
  Download,
  ClipboardList,
  CheckCircle,
  XCircle,
  UserCheck
} from 'lucide-react';
import TalentCard from '@/components/talent/TalentCard';
import TalentFilterSidebar from '@/components/talent/TalentFilterSidebar';
import { TalentData } from '@/types/talent';
import AdminTalentTable from '@/components/talent/AdminTalentTable';

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

const TalentPool = () => {
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
          status: "New",
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
            description: `${formattedApplications.length} new application(s) loaded from submissions.`,
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
    // For now, we'll just log the action
    console.log(`Exporting data in ${format} format`);
    alert(`Talent data would be exported as ${format.toUpperCase()} here.`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-100 via-amber-50 to-background py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Creative Talent Pool</h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover exceptional creative professionals for your next project or connect with potential employers.
          </p>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="browse">Browse Talent</TabsTrigger>
              <TabsTrigger value="admin">Admin Dashboard</TabsTrigger>
            </TabsList>
            
            <TabsContent value="browse" className="mt-0">
              <div className="max-w-3xl mx-auto flex">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, skills or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 py-6 text-lg rounded-l-lg rounded-r-none"
                  />
                </div>
                <Button className="rounded-l-none" size="lg">
                  <Search className="mr-2" />
                  Search
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="admin" className="mt-0">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <ClipboardList className="mr-2" />
                  Client Requirements Matching
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                  <Input 
                    placeholder="Position/Category"
                    value={clientRequirements.position}
                    onChange={(e) => handleClientRequirementChange('position', e.target.value)}
                  />
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={clientRequirements.experienceLevel}
                    onChange={(e) => handleClientRequirementChange('experienceLevel', e.target.value)}
                  >
                    <option value="">Experience Level</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Beginner">Beginner</option>
                  </select>
                  <Input 
                    placeholder="Location"
                    value={clientRequirements.location}
                    onChange={(e) => handleClientRequirementChange('location', e.target.value)}
                  />
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={clientRequirements.availability}
                    onChange={(e) => handleClientRequirementChange('availability', e.target.value)}
                  >
                    <option value="">Availability</option>
                    <option value="Immediate">Immediate</option>
                    <option value="Two weeks">Two weeks</option>
                    <option value="One month">One month</option>
                  </select>
                  <Input 
                    placeholder="Required Skills (comma-separated)"
                    value={clientRequirements.skills}
                    onChange={(e) => handleClientRequirementChange('skills', e.target.value)}
                  />
                </div>
                <div className="flex justify-between items-center mb-6">
                  <Button onClick={findMatches} className="bg-amber-600 hover:bg-amber-700">
                    <UserCheck className="mr-2" />
                    Find Matches
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => exportData('csv')}>
                      <Download className="mr-2" />
                      Export CSV
                    </Button>
                    <Button variant="outline" onClick={() => exportData('pdf')}>
                      <Download className="mr-2" />
                      Export PDF
                    </Button>
                  </div>
                </div>
                <AdminTalentTable 
                  talent={filteredTalent} 
                  onUpdateStatus={handleUpdateStatus}
                  onUpdateNotes={handleUpdateNotes}
                  selectedId={selectedTalentId}
                  setSelectedId={setSelectedTalentId}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      <Tabs value={activeTab} className="w-full">
        <TabsContent value="browse" className="mt-0">
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Filters Sidebar */}
                <TalentFilterSidebar 
                  filters={filters} 
                  handleFilterChange={handleFilterChange} 
                />
                
                {/* Results Grid */}
                <div className="lg:w-3/4">
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold">Talent Results</h2>
                    <p className="text-muted-foreground">Showing {filteredTalent.length} professionals</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredTalent.map(talentItem => (
                      <TalentCard key={talentItem.id} talent={talentItem} />
                    ))}
                  </div>
                  
                  {filteredTalent.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-2xl font-medium mb-2">No results found</p>
                      <p className="text-muted-foreground">
                        Try adjusting your filters or search terms to find more creative professionals.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </TabsContent>
        
        <TabsContent value="admin">
          {/* Admin tab content is rendered in the hero section */}
        </TabsContent>
      </Tabs>
      
      <Footer />
    </div>
  );
};

export default TalentPool;
