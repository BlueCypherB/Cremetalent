
import React from 'react';
import { Button } from "@/components/ui/button";
import { Filter } from 'lucide-react';

interface TalentFilterSidebarProps {
  filters: {
    category: string;
    experience: string;
    location: string;
    availability: string;
  };
  handleFilterChange: (filterName: keyof TalentFilterSidebarProps['filters'], value: string) => void;
}

const TalentFilterSidebar = ({ filters, handleFilterChange }: TalentFilterSidebarProps) => {
  return (
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
              <option value="Brand Strategy">Brand Strategy</option>
              <option value="Copywriting">Copywriting</option>
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
              <option value="Immediate">Immediate</option>
            </select>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {
              handleFilterChange('category', '');
              handleFilterChange('experience', '');
              handleFilterChange('location', '');
              handleFilterChange('availability', '');
            }}
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
  );
};

export default TalentFilterSidebar;
