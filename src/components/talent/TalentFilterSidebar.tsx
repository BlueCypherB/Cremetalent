import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TALENT_CATEGORIES } from '@/lib/taxonomy';

interface Filters {
  category: string;
  experience: string;
  location: string;
  availability: string;
}

interface TalentFilterSidebarProps {
  filters: Filters;
  handleFilterChange: (filterName: keyof Filters, value: string) => void;
}

const FilterField = ({
  label,
  id,
  value,
  placeholder,
  options,
  onChange,
}: {
  label: string;
  id: string;
  value: string;
  placeholder: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
      {label}
    </label>
    <Select value={value || '__all__'} onValueChange={v => onChange(v === '__all__' ? '' : v)}>
      <SelectTrigger
        id={id}
        className="h-9 text-sm border-slate-200 bg-white focus:ring-amber-400/30 focus:border-amber-400"
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="__all__" className="text-sm text-slate-500">{placeholder}</SelectItem>
        {options.map(o => (
          <SelectItem key={o.value} value={o.value} className="text-sm">{o.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

const TalentFilterSidebar = ({ filters, handleFilterChange }: TalentFilterSidebarProps) => {
  const activeCount = Object.values(filters).filter(Boolean).length;

  const clearAll = () => {
    handleFilterChange('category', '');
    handleFilterChange('experience', '');
    handleFilterChange('location', '');
    handleFilterChange('availability', '');
  };

  // Active filter chips
  const activeFilters = [
    filters.category && { key: 'category' as const, label: filters.category },
    filters.experience && { key: 'experience' as const, label: filters.experience },
    filters.location && { key: 'location' as const, label: filters.location },
    filters.availability && { key: 'availability' as const, label: filters.availability },
  ].filter(Boolean) as { key: keyof Filters; label: string }[];

  return (
    <div className="lg:w-72 flex-shrink-0 space-y-4">
      {/* Filter panel */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-semibold text-slate-800">Filters</span>
            {activeCount > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                {activeCount}
              </span>
            )}
          </div>
          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="text-xs text-slate-400 hover:text-rose-500 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="p-5 space-y-5">
          <FilterField
            label="Specialization"
            id="filter-category"
            value={filters.category}
            placeholder="All categories"
            onChange={v => handleFilterChange('category', v)}
            options={TALENT_CATEGORIES
              .filter(c => c.value !== 'Other')
              .map(c => ({ value: c.value, label: c.label }))
            }
          />
          <FilterField
            label="Experience Level"
            id="filter-experience"
            value={filters.experience}
            placeholder="All levels"
            onChange={v => handleFilterChange('experience', v)}
            options={[
              { value: 'Advanced',     label: 'Advanced (5+ years)' },
              { value: 'Intermediate', label: 'Intermediate (2–4 years)' },
              { value: 'Beginner',     label: 'Beginner (0–1 years)' },
            ]}
          />
          <FilterField
            label="Location"
            id="filter-location"
            value={filters.location}
            placeholder="All countries"
            onChange={v => handleFilterChange('location', v)}
            options={[
              { value: 'Nigeria',      label: 'Nigeria' },
              { value: 'Ghana',        label: 'Ghana' },
              { value: 'Kenya',        label: 'Kenya' },
              { value: 'South Africa', label: 'South Africa' },
              { value: 'Egypt',        label: 'Egypt' },
              { value: 'Morocco',      label: 'Morocco' },
              { value: 'Ethiopia',     label: 'Ethiopia' },
              { value: 'Tanzania',     label: 'Tanzania' },
              { value: 'Uganda',       label: 'Uganda' },
              { value: "Côte d'Ivoire",label: "Côte d'Ivoire" },
              { value: 'Senegal',      label: 'Senegal' },
              { value: 'Rwanda',       label: 'Rwanda' },
              { value: 'Remote',       label: 'Remote' },
            ]}
          />
          <FilterField
            label="Availability"
            id="filter-availability"
            value={filters.availability}
            placeholder="Any availability"
            onChange={v => handleFilterChange('availability', v)}
            options={[
              { value: 'Immediate',   label: 'Immediate' },
              { value: 'Two weeks',   label: '2 weeks notice' },
              { value: 'One month',   label: '1 month notice' },
            ]}
          />
        </div>

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="px-5 pb-5 flex flex-wrap gap-1.5">
            {activeFilters.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleFilterChange(key, '')}
                className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors"
              >
                {label}
                <X className="h-2.5 w-2.5" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* CTA card */}
      <div className="bg-amber-700 rounded-2xl p-5 text-white">
        <p className="text-xs text-amber-200 font-semibold uppercase tracking-wide mb-2">Are you a creative?</p>
        <h3 className="font-bold text-base leading-snug mb-2">
          Join the CrémeTalent network
        </h3>
        <p className="text-xs text-amber-100 leading-relaxed mb-4">
          Get matched with top brands and grow your creative career.
        </p>
        <Button
          asChild
          size="sm"
          className="bg-white text-amber-800 hover:bg-amber-50 shadow-none h-8 px-4 text-xs font-semibold w-full"
        >
          <Link to="/join-talent-pool">Apply Now →</Link>
        </Button>
      </div>
    </div>
  );
};

export default TalentFilterSidebar;
