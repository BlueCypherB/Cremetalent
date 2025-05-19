
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import TalentFilterSidebar from '@/components/talent/TalentFilterSidebar';
import TalentPoolHero from '@/components/talent/TalentPoolHero';
import TalentResults from '@/components/talent/TalentResults';
import { useTalentPool } from '@/hooks/useTalentPool';

const TalentPool = () => {
  const {
    searchTerm,
    setSearchTerm,
    filters,
    clientRequirements,
    activeTab,
    setActiveTab,
    filteredTalent,
    handleFilterChange,
    handleClientRequirementChange,
    findMatches,
    exportData
  } = useTalentPool();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section with Tabs */}
      <TalentPoolHero 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        clientRequirements={clientRequirements}
        handleClientRequirementChange={handleClientRequirementChange}
        findMatches={findMatches}
        exportData={exportData}
        filteredTalent={filteredTalent}
      />
      
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
                <TalentResults filteredTalent={filteredTalent} />
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
