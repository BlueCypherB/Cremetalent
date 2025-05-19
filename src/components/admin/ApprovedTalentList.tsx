
import React, { useState } from 'react';
import { TalentData } from '@/types/talent';
import { Button } from "@/components/ui/button";
import { ExternalLink } from 'lucide-react';
import TalentProfileModal from '../talent/TalentProfileModal';

interface ApprovedTalentListProps {
  talents: TalentData[];
}

const ApprovedTalentList = ({ talents }: ApprovedTalentListProps) => {
  const [selectedTalent, setSelectedTalent] = useState<TalentData | null>(null);
  
  const openTalentProfile = (talent: TalentData) => {
    setSelectedTalent(talent);
  };

  const closeTalentProfile = () => {
    setSelectedTalent(null);
  };

  if (talents.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-md shadow">
        <p className="text-gray-500">No approved talent yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-md shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {talents.map((talent) => (
              <tr key={talent.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{talent.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{talent.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">{talent.location}</td>
                <td className="px-6 py-4 whitespace-nowrap">{talent.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openTalentProfile(talent)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTalent && (
        <TalentProfileModal 
          talent={selectedTalent} 
          isOpen={!!selectedTalent} 
          onClose={closeTalentProfile} 
        />
      )}
    </>
  );
};

export default ApprovedTalentList;
