
import React from 'react';
import { TalentData } from '@/types/talent';

interface RejectedTalentListProps {
  talents: TalentData[];
}

const RejectedTalentList = ({ talents }: RejectedTalentListProps) => {
  if (talents.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-md shadow">
        <p className="text-gray-500">No rejected applications</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md shadow">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rejection Reason</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {talents.map((talent) => (
            <tr key={talent.id}>
              <td className="px-6 py-4 whitespace-nowrap">{talent.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{talent.email}</td>
              <td className="px-6 py-4">{talent.notes || "No reason provided"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RejectedTalentList;
