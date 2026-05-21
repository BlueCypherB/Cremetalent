import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import TalentSearch from './TalentSearch';
import ClientRequirementsForm from './ClientRequirementsForm';
import TalentCard from './TalentCard';
import { TalentData } from '@/types/talent';
import { Users, Zap, Globe2, CheckCircle2 } from 'lucide-react';

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
  exportData: () => void;
  matchedTalent: TalentData[];
  hasRunMatch: boolean;
}

const STATS = [
  { icon: Users,        value: '200+', label: 'Vetted creatives' },
  { icon: CheckCircle2, value: '15+',  label: 'Specializations' },
  { icon: Globe2,       value: '12+',  label: 'Countries' },
  { icon: Zap,          value: '3–5d', label: 'Avg. match time' },
];

const TalentPoolHero = ({
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  clientRequirements,
  handleClientRequirementChange,
  findMatches,
  exportData,
  matchedTalent,
  hasRunMatch,
}: TalentPoolHeroProps) => {
  return (
    <section className="bg-white border-b border-slate-100 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-amber-50 blur-3xl opacity-80" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-amber-50 blur-2xl opacity-60" />

      <div className="relative container mx-auto px-4 pt-14 pb-10">
        {/* Headline */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-[1.1] tracking-tight mb-3">
            Creative <span className="text-amber-600">Talent Pool</span>
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed">
            Discover exceptional African creative professionals — or find the perfect match for your next project.
          </p>
        </div>

        {/* Stats bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center">
                <Icon className="h-3.5 w-3.5 text-amber-600" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900">{value}</span>
                <span className="text-xs text-slate-500 ml-1">{label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <TabsList className="bg-slate-100/80 border border-slate-200 p-1 h-auto rounded-xl">
              <TabsTrigger
                value="browse"
                className="px-6 py-2 text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:text-amber-700 data-[state=active]:shadow-sm data-[state=active]:border-amber-200 text-slate-500 hover:text-slate-700 transition-all"
              >
                <Users className="h-3.5 w-3.5 mr-2" />
                Browse Talent
              </TabsTrigger>
              <TabsTrigger
                value="admin"
                className="px-6 py-2 text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:text-amber-700 data-[state=active]:shadow-sm data-[state=active]:border-amber-200 text-slate-500 hover:text-slate-700 transition-all"
              >
                <Zap className="h-3.5 w-3.5 mr-2" />
                Match Talent
              </TabsTrigger>
            </TabsList>
          </div>

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

            {!hasRunMatch ? (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <div className="h-12 w-12 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center mb-4">
                  <Zap className="h-5 w-5 text-amber-500" />
                </div>
                <p className="text-sm font-medium text-slate-600 mb-1">No results yet</p>
                <p className="text-xs text-slate-400 max-w-xs">
                  Fill in your requirements above and click <span className="font-semibold text-amber-600">Find Matches</span> to rank talent by fit.
                </p>
              </div>
            ) : matchedTalent.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <Users className="h-5 w-5 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-600 mb-1">No approved talent yet</p>
                <p className="text-xs text-slate-400 max-w-xs">
                  There are no approved profiles in the talent pool. Check back soon.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">
                {matchedTalent.map(talentItem => (
                  <TalentCard key={talentItem.id} talent={talentItem} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default TalentPoolHero;
