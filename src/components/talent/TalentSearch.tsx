
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';

interface TalentSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const TalentSearch = ({ searchTerm, setSearchTerm }: TalentSearchProps) => {
  return (
    <div className="max-w-3xl mx-auto flex">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name, skills or keywords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 py-6 text-lg rounded-l-lg rounded-r-none"
        />
      </div>
      <Button className="rounded-l-none" size="lg">
        <Search className="mr-2" />
        Search
      </Button>
    </div>
  );
};

export default TalentSearch;
