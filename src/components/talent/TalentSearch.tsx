import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';

interface TalentSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const TalentSearch = ({ searchTerm, setSearchTerm }: TalentSearchProps) => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-stretch h-14 rounded-2xl border border-border bg-background shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary transition-shadow">
        <div className="relative flex-grow flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by name, skills or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-0 bg-transparent pl-12 h-full text-base focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
          />
        </div>
        <Button className="h-full rounded-none px-6 gap-2">
          <Search className="h-4 w-4" />
          Search
        </Button>
      </div>
    </div>
  );
};

export default TalentSearch;
