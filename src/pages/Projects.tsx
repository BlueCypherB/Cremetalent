
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Filter } from 'lucide-react';

// Sample project data
const projectsData = [
  {
    id: "1",
    title: "Educational Scholarship for Aspiring Medical Students",
    creator: "Dr. Amanda Chen",
    raised: 12500,
    goal: 25000,
    daysLeft: 18,
    category: "Education",
    description: "Help support the next generation of medical professionals with scholarships for underprivileged students.",
    slug: "med-scholarship"
  },
  {
    id: "2",
    title: "Community Art Center Renovation",
    creator: "Local Artists Collective",
    raised: 8200,
    goal: 15000,
    daysLeft: 30,
    category: "Arts",
    description: "Renovating a community space to provide a creative hub for artists of all ages in our neighborhood.",
    slug: "art-center"
  },
  {
    id: "3",
    title: "Tech Training Program for Underserved Youth",
    creator: "Future Coders Initiative",
    raised: 18500,
    goal: 20000,
    daysLeft: 12,
    category: "Technology",
    description: "Providing coding bootcamps and mentorship for youth from underserved communities.",
    slug: "tech-training"
  },
  {
    id: "4",
    title: "Urban Garden Community Project",
    creator: "Green City Coalition",
    raised: 3400,
    goal: 10000,
    daysLeft: 45,
    category: "Environment",
    description: "Creating sustainable urban gardens to provide fresh produce and green spaces in urban food deserts.",
    slug: "urban-garden"
  },
  {
    id: "5",
    title: "Documentary on Immigrant Entrepreneurs",
    creator: "New Horizons Film Collective",
    raised: 15000,
    goal: 30000,
    daysLeft: 22,
    category: "Film",
    description: "A documentary highlighting the success stories and challenges faced by immigrant entrepreneurs.",
    slug: "immigrant-entrepreneurs"
  },
  {
    id: "6",
    title: "Mobile Healthcare for Rural Communities",
    creator: "Health Access Now",
    raised: 22000,
    goal: 50000,
    daysLeft: 15,
    category: "Healthcare",
    description: "Bringing essential healthcare services to isolated rural communities through mobile clinics.",
    slug: "mobile-healthcare"
  }
];

const categories = [
  "All Categories", 
  "Education", 
  "Arts", 
  "Technology", 
  "Environment", 
  "Film", 
  "Healthcare", 
  "Music", 
  "Community"
];

const ProjectCard = ({ 
  title, 
  creator, 
  raised, 
  goal, 
  daysLeft, 
  category,
  description,
  slug 
}: { 
  title: string;
  creator: string;
  raised: number;
  goal: number;
  daysLeft: number;
  category: string;
  description: string;
  slug: string;
}) => {
  const progress = (raised / goal) * 100;
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="aspect-video bg-muted relative">
        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
          {category}
        </div>
      </div>
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-3">by {creator}</p>
        <p className="text-sm mb-4 line-clamp-2">{description}</p>
        
        <div className="relative h-2 bg-muted rounded-full mb-2">
          <div 
            className="absolute top-0 left-0 h-full bg-primary rounded-full" 
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="font-medium">${raised.toLocaleString()} raised</span>
          <span className="text-muted-foreground">${goal.toLocaleString()} goal</span>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-muted-foreground">{daysLeft} days left</span>
          <Link to={`/projects/${slug}`}>
            <Button variant="outline" size="sm">View Project</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  
  const filteredProjects = projectsData.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-muted/30 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Discover Projects</h1>
          <p className="text-muted-foreground">Find and support projects that resonate with your values</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
          <div className="md:col-span-8 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search projects..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="md:col-span-4 flex gap-2">
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Project Results */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={index} {...project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
            <Button onClick={() => {setSearchTerm(''); setSelectedCategory('All Categories');}}>
              Reset Filters
            </Button>
          </div>
        )}
      </div>
      
      {/* CTA Section */}
      <section className="mt-auto py-12 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Have a Project of Your Own?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto text-muted-foreground">
            Share your vision with our supportive community and bring your ideas to life.
          </p>
          <Link to="/create-project">
            <Button size="lg">
              Start Your Project
            </Button>
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Projects;
