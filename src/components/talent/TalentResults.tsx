
import React from 'react';
import TalentCard from '@/components/talent/TalentCard';
import { TalentData } from '@/types/talent';

interface TalentResultsProps {
  filteredTalent: TalentData[];
}

const TalentResults = ({ filteredTalent }: TalentResultsProps) => {
  return (
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
  );
};

export default TalentResults;
