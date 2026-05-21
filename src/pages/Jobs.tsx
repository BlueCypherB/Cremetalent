import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getOpenJobs } from '@/services/clientService';
import type { JobListing } from '@/lib/database.types';
import { TALENT_CATEGORIES_BY_SECTOR, ENGAGEMENT_TYPES, EXPERIENCE_LEVELS } from '@/lib/taxonomy';
import { Search, MapPin, Briefcase, Clock, SlidersHorizontal, X } from 'lucide-react';

type OpenJob = JobListing & { client_accounts: { company_name: string } | null };

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterLevel, setFilterLevel] = useState('');

  const { data: jobs = [], isLoading, isError } = useQuery({
    queryKey: ['job_listings', 'public'],
    queryFn: getOpenJobs as () => Promise<OpenJob[]>,
    staleTime: 60_000,
  });

  const filtered = jobs.filter(job => {
    const companyName = job.client_accounts?.company_name ?? '';
    const matchesSearch =
      !searchTerm ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || job.specialization === filterCategory;
    const matchesType = !filterType || job.engagement_type === filterType;
    const matchesLevel = !filterLevel || job.experience_level === filterLevel;
    return matchesSearch && matchesCategory && matchesType && matchesLevel;
  });

  const activeFiltersCount = [filterCategory, filterType, filterLevel].filter(Boolean).length;

  const clearFilters = () => {
    setFilterCategory('');
    setFilterType('');
    setFilterLevel('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden py-16 px-4">
        <div className="hero-ripple" aria-hidden="true" />
        <div className="relative container mx-auto max-w-4xl text-center">
          <h1 className="display-xl text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Job Opportunities
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Discover creative and professional roles posted by leading organisations across Africa.
          </p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search jobs, companies, or keywords…"
              className="pl-11 h-12 text-base bg-white shadow-sm border-slate-200"
            />
          </div>
        </div>
      </section>

      <section className="flex-grow bg-slate-50 py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar filters */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-6">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-semibold text-slate-800">Filters</span>
                    {activeFiltersCount > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                        {activeFiltersCount}
                      </span>
                    )}
                  </div>
                  {activeFiltersCount > 0 && (
                    <button onClick={clearFilters} className="text-xs text-slate-400 hover:text-rose-500 transition-colors">
                      Clear all
                    </button>
                  )}
                </div>
                <div className="p-5 space-y-5">
                  {/* Specialization */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Specialization</label>
                    <Select value={filterCategory || '__all__'} onValueChange={v => setFilterCategory(v === '__all__' ? '' : v)}>
                      <SelectTrigger className="h-9 text-sm border-slate-200">
                        <SelectValue placeholder="All specializations" />
                      </SelectTrigger>
                      <SelectContent className="max-h-72">
                        <SelectItem value="__all__" className="text-sm text-slate-500">All specializations</SelectItem>
                        {Object.entries(TALENT_CATEGORIES_BY_SECTOR).map(([sector, cats]) => (
                          <div key={sector}>
                            <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{sector}</div>
                            {cats.filter(c => c.value !== 'Other').map(c => (
                              <SelectItem key={c.value} value={c.value} className="text-sm">{c.label}</SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Engagement type */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Engagement Type</label>
                    <Select value={filterType || '__all__'} onValueChange={v => setFilterType(v === '__all__' ? '' : v)}>
                      <SelectTrigger className="h-9 text-sm border-slate-200">
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__all__" className="text-sm text-slate-500">All types</SelectItem>
                        {ENGAGEMENT_TYPES.map(t => (
                          <SelectItem key={t.value} value={t.value} className="text-sm">{t.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Experience level */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Experience Level</label>
                    <Select value={filterLevel || '__all__'} onValueChange={v => setFilterLevel(v === '__all__' ? '' : v)}>
                      <SelectTrigger className="h-9 text-sm border-slate-200">
                        <SelectValue placeholder="All levels" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__all__" className="text-sm text-slate-500">All levels</SelectItem>
                        {EXPERIENCE_LEVELS.map(l => (
                          <SelectItem key={l.value} value={l.value} className="text-sm">{l.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {/* Active chips */}
                {activeFiltersCount > 0 && (
                  <div className="px-5 pb-5 flex flex-wrap gap-1.5">
                    {filterCategory && (
                      <button
                        onClick={() => setFilterCategory('')}
                        className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors"
                      >
                        {filterCategory}<X className="h-2.5 w-2.5" />
                      </button>
                    )}
                    {filterType && (
                      <button
                        onClick={() => setFilterType('')}
                        className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors"
                      >
                        {filterType}<X className="h-2.5 w-2.5" />
                      </button>
                    )}
                    {filterLevel && (
                      <button
                        onClick={() => setFilterLevel('')}
                        className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors"
                      >
                        {filterLevel}<X className="h-2.5 w-2.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </aside>

            {/* Job listings */}
            <div className="flex-1 min-w-0">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-36 w-full rounded-xl" />)}
                </div>
              ) : isError ? (
                <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
                  <p className="text-slate-500">Failed to load jobs. Please refresh.</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
                  <Briefcase className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm font-medium">No jobs found</p>
                  {(searchTerm || activeFiltersCount > 0) && (
                    <button
                      onClick={() => { setSearchTerm(''); clearFilters(); }}
                      className="text-amber-700 text-sm hover:underline mt-2"
                    >
                      Clear search and filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500 font-medium">
                    {filtered.length} job{filtered.length !== 1 ? 's' : ''} found
                  </p>
                  {filtered.map(job => (
                    <div
                      key={job.id}
                      className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:border-amber-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                              {job.specialization}
                            </span>
                            <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                              {job.engagement_type}
                            </span>
                            {job.is_remote && (
                              <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Remote
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-slate-900 text-base">{job.title}</h3>
                          <p className="text-sm text-slate-600 font-medium">{job.client_accounts?.company_name}</p>
                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5 flex-wrap">
                            {job.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />{job.location}
                              </span>
                            )}
                            {job.experience_level && <span>{job.experience_level}</span>}
                            {job.budget_range && <span>{job.budget_range}</span>}
                            {job.deadline && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Deadline {new Date(job.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                            {job.description}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <Button asChild size="sm" className="h-8 text-xs">
                            <Link to={`/jobs/${job.id}`}>View Details</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Jobs;
