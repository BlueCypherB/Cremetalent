import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Zap, Download, Search } from 'lucide-react';

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
  exportData: () => void;
}

const ClientRequirementsForm = ({
  clientRequirements,
  handleClientRequirementChange,
  findMatches,
  exportData,
}: ClientRequirementFormProps) => {
  const inputClass = "h-9 border-slate-200 bg-white text-sm focus-visible:ring-amber-400/30 focus-visible:border-amber-400";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-left">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
        <Zap className="h-4 w-4 text-amber-500" />
        <h3 className="text-sm font-semibold text-slate-800">Find matching talent</h3>
        <span className="text-xs text-slate-400 ml-1">— fill in your requirements and we'll rank the best fits</span>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
          <div className="space-y-1.5">
            <Label htmlFor="req-position" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Role / Category
            </Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input
                id="req-position"
                placeholder="e.g. Graphic Design"
                value={clientRequirements.position}
                onChange={e => handleClientRequirementChange('position', e.target.value)}
                className={`${inputClass} pl-8`}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="req-exp" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Experience
            </Label>
            <Select
              value={clientRequirements.experienceLevel || '__any__'}
              onValueChange={v => handleClientRequirementChange('experienceLevel', v === '__any__' ? '' : v)}
            >
              <SelectTrigger id="req-exp" className={inputClass}>
                <SelectValue placeholder="Any level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__any__" className="text-sm text-slate-500">Any level</SelectItem>
                <SelectItem value="Advanced" className="text-sm">Advanced</SelectItem>
                <SelectItem value="Intermediate" className="text-sm">Intermediate</SelectItem>
                <SelectItem value="Beginner" className="text-sm">Beginner</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="req-location" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Location
            </Label>
            <Input
              id="req-location"
              placeholder="e.g. Lagos"
              value={clientRequirements.location}
              onChange={e => handleClientRequirementChange('location', e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="req-avail" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Availability
            </Label>
            <Select
              value={clientRequirements.availability || '__any__'}
              onValueChange={v => handleClientRequirementChange('availability', v === '__any__' ? '' : v)}
            >
              <SelectTrigger id="req-avail" className={inputClass}>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__any__" className="text-sm text-slate-500">Any</SelectItem>
                <SelectItem value="Immediate" className="text-sm">Immediate</SelectItem>
                <SelectItem value="Two weeks" className="text-sm">2 weeks notice</SelectItem>
                <SelectItem value="One month" className="text-sm">1 month notice</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="req-skills" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Required Skills
            </Label>
            <Input
              id="req-skills"
              placeholder="Figma, React, …"
              value={clientRequirements.skills}
              onChange={e => handleClientRequirementChange('skills', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Button
            onClick={findMatches}
            size="sm"
            className="bg-amber-600 hover:bg-amber-700 text-white shadow-none gap-2 px-5"
          >
            <Zap className="h-3.5 w-3.5" />
            Find Matches
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportData()}
            className="border-slate-200 text-slate-600 hover:bg-slate-50 shadow-none gap-2 text-xs"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClientRequirementsForm;
