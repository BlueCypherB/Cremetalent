
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Filter,
  Briefcase,
  MapPin,
  Clock,
  Star,
  Link as LinkIcon,
  ExternalLink
} from 'lucide-react';

// Sample talent data for demonstration
const sampleTalent = [
  {
    id: 1,
    name: "Alex Morgan",
    photo: null,
    location: "New York, NY",
    category: "Graphic Design",
    experience: "Advanced",
    availability: "Full-time",
    bio: "Award-winning graphic designer with 8+ years of experience in branding and visual identity.",
    skills: ["Brand Design", "Typography", "Print Design", "Adobe Creative Suite"],
    portfolio: ["Brand Identity for Tech Startup", "Magazine Redesign", "Annual Report Design"]
  },
  {
    id: 2,
    name: "Jordan Lee",
    photo: null,
    location: "Los Angeles, CA",
    category: "Video Editing",
    experience: "Intermediate",
    availability: "Freelance",
    bio: "Creative video editor specializing in commercial and documentary content with an eye for compelling storytelling.",
    skills: ["Video Editing", "Color Grading", "Motion Graphics", "Audio Editing"],
    portfolio: ["Documentary Short Film", "Product Launch Videos", "Social Media Campaign"]
  },
  {
    id: 3,
    name: "Taylor Wilson",
    photo: null,
    location: "Chicago, IL",
    category: "Content Creation",
    experience: "Beginner",
    availability: "Part-time",
    bio: "Emerging content creator with a fresh perspective and strong writing skills across various digital platforms.",
    skills: ["Copywriting", "Social Media Content", "Blog Writing", "SEO"],
    portfolio: ["Company Blog Redesign", "Email Marketing Campaign", "Social Media Strategy"]
  },
  {
    id: 4,
    name: "Sam Rivera",
    photo: null,
    location: "Austin, TX",
    category: "UI/UX Design",
    experience: "Advanced",
    availability: "Full-time",
    bio: "User-focused designer creating intuitive and beautiful digital experiences across web and mobile platforms.",
    skills: ["UI Design", "User Research", "Wireframing", "Figma", "Prototyping"],
    portfolio: ["E-commerce App Redesign", "Banking Dashboard UI", "Travel Website Overhaul"]
  },
  {
    id: 5,
    name: "Casey Zhang",
    photo: null,
    location: "San Francisco, CA",
    category: "Digital Marketing",
    experience: "Intermediate",
    availability: "Freelance",
    bio: "Strategic digital marketer with a data-driven approach to campaigns and a knack for growth hacking.",
    skills: ["PPC Advertising", "Analytics", "Email Marketing", "Campaign Strategy"],
    portfolio: ["SaaS Growth Campaign", "Retail Holiday Marketing", "Non-profit Awareness Drive"]
  },
  {
    id: 6,
    name: "Morgan Smith",
    photo: null,
    location: "Portland, OR",
    category: "Illustration",
    experience: "Advanced",
    availability: "Part-time",
    bio: "Versatile illustrator with a distinct style working across editorial, advertising, and children's publishing.",
    skills: ["Digital Illustration", "Character Design", "Editorial Art", "Book Illustration"],
    portfolio: ["Children's Book Series", "Magazine Editorial Art", "Brand Mascot Design"]
  }
];

const TalentCard = ({ talent }: { talent: typeof sampleTalent[0] }) => (
  <Card className="h-full overflow-hidden">
    <CardContent className="p-6">
      <div className="flex items-center mb-4">
        <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
          {talent.photo ? (
            <img src={talent.photo} alt={talent.name} className="w-full h-full object-cover rounded-full" />
          ) : (
            <span className="text-amber-600 text-xl font-bold">{talent.name.charAt(0)}</span>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-lg">{talent.name}</h3>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{talent.location}</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs flex items-center">
          <Briefcase className="h-3 w-3 mr-1" />
          {talent.category}
        </span>
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center">
          <Star className="h-3 w-3 mr-1" />
          {talent.experience}
        </span>
        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          {talent.availability}
        </span>
      </div>
      
      <p className="text-muted-foreground mb-4">{talent.bio}</p>
      
      <div className="mb-4">
        <h4 className="font-medium mb-2">Skills</h4>
        <div className="flex flex-wrap gap-1">
          {talent.skills.map((skill, index) => (
            <span key={index} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
              {skill}
            </span>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="font-medium mb-2">Notable Projects</h4>
        <ul className="space-y-1">
          {talent.portfolio.map((project, index) => (
            <li key={index} className="flex items-center text-sm">
              <LinkIcon className="h-3.5 w-3.5 mr-2 text-primary" />
              {project}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-6">
        <Button variant="outline" className="w-full" size="sm">
          <ExternalLink className="h-4 w-4 mr-2" />
          View Full Profile
        </Button>
      </div>
    </CardContent>
  </Card>
);

const TalentPool = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    experience: '',
    location: '',
    availability: ''
  });
  
  const filteredTalent = sampleTalent.filter(talent => {
    // Search term filter
    const searchMatch = searchTerm === '' || 
      talent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      talent.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      talent.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Category filter
    const categoryMatch = filters.category === '' || talent.category === filters.category;
    
    // Experience filter
    const experienceMatch = filters.experience === '' || talent.experience === filters.experience;
    
    // Location filter
    const locationMatch = filters.location === '' || talent.location.includes(filters.location);
    
    // Availability filter
    const availabilityMatch = filters.availability === '' || talent.availability === filters.availability;
    
    return searchMatch && categoryMatch && experienceMatch && locationMatch && availabilityMatch;
  });

  const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
    setFilters({
      ...filters,
      [filterName]: value
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Creative Talent Pool</h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover exceptional creative professionals for your next project or connect with potential employers.
          </p>
          
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
        </div>
      </section>
      
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-amber-50 p-6 rounded-lg">
                <div className="flex items-center mb-6">
                  <Filter className="mr-2 text-amber-600" />
                  <h2 className="text-xl font-semibold">Filter Results</h2>
                </div>
                
                <div className="space-y-6">
                  {/* Category Filter */}
                  <div>
                    <h3 className="font-medium mb-3">Skill Category</h3>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                    >
                      <option value="">All Categories</option>
                      <option value="Graphic Design">Graphic Design</option>
                      <option value="Video Editing">Video Editing</option>
                      <option value="Content Creation">Content Creation</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                      <option value="Digital Marketing">Digital Marketing</option>
                      <option value="Illustration">Illustration</option>
                    </select>
                  </div>
                  
                  {/* Experience Level Filter */}
                  <div>
                    <h3 className="font-medium mb-3">Experience Level</h3>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={filters.experience}
                      onChange={(e) => handleFilterChange('experience', e.target.value)}
                    >
                      <option value="">All Levels</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  
                  {/* Location Filter */}
                  <div>
                    <h3 className="font-medium mb-3">Location</h3>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                    >
                      <option value="">All Locations</option>
                      <option value="New York">New York</option>
                      <option value="Los Angeles">Los Angeles</option>
                      <option value="Chicago">Chicago</option>
                      <option value="San Francisco">San Francisco</option>
                      <option value="Austin">Austin</option>
                      <option value="Portland">Portland</option>
                    </select>
                  </div>
                  
                  {/* Availability Filter */}
                  <div>
                    <h3 className="font-medium mb-3">Availability</h3>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={filters.availability}
                      onChange={(e) => handleFilterChange('availability', e.target.value)}
                    >
                      <option value="">All Types</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Freelance">Freelance</option>
                    </select>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setFilters({
                      category: '',
                      experience: '',
                      location: '',
                      availability: ''
                    })}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
              
              <div className="mt-8 bg-primary/10 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-4">Join Our Talent Pool</h3>
                <p className="text-muted-foreground mb-4">
                  Are you a creative professional looking for new opportunities? Join our exclusive talent network.
                </p>
                <Button>Apply Now</Button>
              </div>
            </div>
            
            {/* Results Grid */}
            <div className="lg:w-3/4">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold">Talent Results</h2>
                <p className="text-muted-foreground">Showing {filteredTalent.length} professionals</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTalent.map(talent => (
                  <TalentCard key={talent.id} talent={talent} />
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
      
      <Footer />
    </div>
  );
};

export default TalentPool;
