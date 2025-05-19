
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TalentSearch from './TalentSearch';
import ClientRequirementsForm from './ClientRequirementsForm';
import TalentCard from './TalentCard';
import { TalentData } from '@/types/talent';

interface TalentPoolHeroProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
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
  filteredTalent: TalentData[];
}

const TalentPoolHero = ({
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  clientRequirements,
  handleClientRequirementChange,
  findMatches,
  exportData,
  filteredTalent
}: TalentPoolHeroProps) => {
  return (
    <section className="bg-gradient-to-br from-amber-100 via-amber-50 to-background py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Creative Talent Pool</h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Discover exceptional creative professionals for your next project or connect with potential employers.
        </p>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="browse">Browse Talent</TabsTrigger>
            <TabsTrigger value="admin">Match Talent</TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse" className="mt-0">
            <TalentSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </TabsContent>
          
          <TabsContent value="admin" className="mt-0">
            <ClientRequirementsForm 
              clientRequirements={clientRequirements} 
              handleClientRequirementChange={handleClientRequirementChange}
              findMatches={findMatches}
              exportData={exportData}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
              {filteredTalent.map(talentItem => (
                <TalentCard key={talentItem.id} talent={talentItem} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default TalentPoolHero;
