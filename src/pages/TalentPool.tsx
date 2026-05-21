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
    isLoading,
    clientRequirements,
    activeTab,
    setActiveTab,
    filteredTalent,
    matchedTalent,
    hasRunMatch,
    talent,
    handleFilterChange,
    handleClientRequirementChange,
    findMatches,
    exportData,
  } = useTalentPool();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <TalentPoolHero
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        clientRequirements={clientRequirements}
        handleClientRequirementChange={handleClientRequirementChange}
        findMatches={findMatches}
        exportData={exportData}
        matchedTalent={matchedTalent}
        hasRunMatch={hasRunMatch}
      />

      <Tabs value={activeTab} className="w-full flex-1">
        <TabsContent value="browse" className="mt-0">
          <section className="py-10">
            <div className="container mx-auto px-4">
              <div className="flex flex-col lg:flex-row gap-7 items-start">
                <TalentFilterSidebar
                  filters={filters}
                  handleFilterChange={handleFilterChange}
                />
                <TalentResults
                  filteredTalent={filteredTalent}
                  isLoading={isLoading}
                  totalCount={talent.length}
                />
              </div>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="admin">
          {/* Match results rendered inside TalentPoolHero */}
        </TabsContent>
      </Tabs>

      <Footer />
    </div>
  );
};

export default TalentPool;
