import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Reveal } from '@/components/Reveal';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Project } from '@/lib/database.types';
import { Search, Tag, Users, Clock, Zap, ArrowRight, FolderOpen } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Education',
  'Arts',
  'Technology',
  'Environment',
  'Film',
  'Healthcare',
  'Music',
  'Community',
];

const CATEGORY_PALETTES: Record<string, string> = {
  Education:   'bg-blue-50   text-blue-700   border-blue-200',
  Arts:        'bg-rose-50   text-rose-700   border-rose-200',
  Technology:  'bg-violet-50 text-violet-700 border-violet-200',
  Environment: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Film:        'bg-orange-50 text-orange-700 border-orange-200',
  Healthcare:  'bg-teal-50   text-teal-700   border-teal-200',
  Music:       'bg-pink-50   text-pink-700   border-pink-200',
  Community:   'bg-amber-50  text-amber-700  border-amber-200',
};

function daysLeft(createdAt: string, durationDays: number): number {
  const end = new Date(createdAt).getTime() + durationDays * 86400000;
  return Math.max(0, Math.ceil((end - Date.now()) / 86400000));
}

const ProjectCard = ({ project }: { project: Project }) => {
  const progress = project.goal_amount > 0
    ? Math.min((project.raised_amount / project.goal_amount) * 100, 100)
    : 0;
  const remaining = daysLeft(project.created_at, project.duration_days);
  const catStyle = CATEGORY_PALETTES[project.category] ?? 'bg-slate-100 text-slate-600 border-slate-200';

  return (
    <div className="service-card overflow-hidden group flex flex-col">
      {/* Image / placeholder */}
      <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100 flex-shrink-0">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FolderOpen className="h-10 w-10 text-amber-300" />
          </div>
        )}
        {project.is_featured && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wide rounded-full">
            <Zap className="h-2.5 w-2.5" />
            Featured
          </span>
        )}
        <span className={`absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide rounded-full border ${catStyle}`}>
          <Tag className="h-2.5 w-2.5" />
          {project.category}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-slate-900 text-base leading-snug mb-1 line-clamp-2 group-hover:text-amber-700 transition-colors">
          {project.title}
        </h3>
        <p className="text-xs text-slate-500 mb-3">by <span className="font-medium text-slate-600">{project.creator_name}</span></p>
        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4 flex-grow">
          {project.short_description}
        </p>

        {/* Progress bar */}
        <div className="space-y-1.5 mb-4">
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span><strong className="text-slate-800 font-semibold">₦{project.raised_amount.toLocaleString()}</strong> raised</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {project.backers_count} backers
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {remaining}d left
            </span>
          </div>
          <Link to={`/projects/${project.slug ?? project.id}`}>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300 shadow-none gap-1"
            >
              View
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const ProjectCardSkeleton = () => (
  <div className="service-card overflow-hidden">
    <Skeleton className="aspect-[16/9] w-full rounded-none" />
    <div className="p-5 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <Skeleton className="h-1.5 w-full rounded-full" />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-7 w-16 rounded-lg" />
      </div>
    </div>
  </div>
);

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_published', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Project[];
    },
    staleTime: 60_000,
  });

  const filtered = projects.filter(project => {
    const matchesSearch =
      !searchTerm ||
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.short_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.creator_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredCount = projects.filter(p => p.is_featured).length;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden py-16 px-4">
        <div className="hero-ripple" aria-hidden="true" />
        <div className="relative container mx-auto max-w-4xl text-center">
          <Reveal>
            <span className="eyebrow">Creative Initiatives</span>
            <h1 className="display-xl text-4xl md:text-5xl font-bold text-slate-900 mt-4 mb-4">
              Discover & Support Projects
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
              Find creative initiatives by Africa's brightest talent and help bring their vision to life.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search projects, creators, or categories…"
                className="pl-11 h-12 text-base bg-white shadow-sm border-slate-200"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats bar */}
      {!isLoading && projects.length > 0 && (
        <div className="bg-white border-b border-slate-100">
          <div className="container mx-auto px-4 py-3 flex items-center gap-6 text-xs text-slate-500">
            <span><strong className="text-slate-800">{projects.length}</strong> projects</span>
            {featuredCount > 0 && (
              <span><strong className="text-amber-700">{featuredCount}</strong> featured</span>
            )}
          </div>
        </div>
      )}

      <section className="flex-grow bg-slate-50 py-10">
        <div className="container mx-auto px-4">
          {/* Category pills */}
          <Reveal>
            <div className="flex flex-wrap gap-2 mb-8">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    selectedCategory === cat
                      ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-amber-300 hover:text-amber-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </Reveal>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <ProjectCardSkeleton key={i} />)}
            </div>
          ) : error ? (
            <div className="bg-white rounded-2xl border border-slate-200 py-16 text-center">
              <p className="text-slate-500 text-sm">Failed to load projects. Please refresh.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 py-16 text-center">
              <FolderOpen className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 font-semibold mb-1">No projects found</p>
              <p className="text-slate-400 text-sm mb-4">
                {searchTerm || selectedCategory !== 'All'
                  ? 'Try adjusting your search or category filter'
                  : 'Check back soon for new creative initiatives'}
              </p>
              {(searchTerm || selectedCategory !== 'All') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                  className="border-slate-200 text-slate-600 hover:border-amber-300 hover:text-amber-700"
                >
                  Reset filters
                </Button>
              )}
            </div>
          ) : (
            <Reveal>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white border-t border-slate-100 py-14">
        <div className="container mx-auto px-4 text-center">
          <Reveal>
            <span className="eyebrow">Launch Your Vision</span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-4 mb-3">
              Have a project in mind?
            </h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto mb-7">
              Share your creative initiative with our community and get the visibility and support it deserves.
            </p>
            <Link to="/create-project">
              <Button className="shadow-none gap-2 px-6">
                Start your project
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Projects;
