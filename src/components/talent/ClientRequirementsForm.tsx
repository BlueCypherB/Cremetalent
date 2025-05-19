
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClipboardList, UserCheck, Download } from 'lucide-react';

interface ClientRequirementFormProps {
  clientRequirements: {
    position: string;
    experienceLevel: string;
    location: string;
    availability: string;
    skills: string;
  };
  handleClientRequirementChange: (field: string, value: string) => void;
  findMatches: () => void;
  exportData: (format: 'csv' | 'pdf') => void;
}

const ClientRequirementsForm = ({ 
  clientRequirements, 
  handleClientRequirementChange, 
  findMatches,
  exportData 
}: ClientRequirementFormProps) => {
  return (
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
    </div>
  );
};

export default ClientRequirementsForm;
