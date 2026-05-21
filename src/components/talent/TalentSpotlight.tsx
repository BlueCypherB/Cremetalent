import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { TalentApplication } from '@/lib/database.types';
import { Star, Sparkles, ArrowRight } from 'lucide-react';

const AVATAR_PALETTES = [
  { bg: 'bg-amber-200',   text: 'text-amber-900' },
  { bg: 'bg-violet-200',  text: 'text-violet-900' },
  { bg: 'bg-sky-200',     text: 'text-sky-900' },
  { bg: 'bg-emerald-200', text: 'text-emerald-900' },
  { bg: 'bg-rose-200',    text: 'text-rose-900' },
];

const avatarPalette = (name: string) =>
  AVATAR_PALETTES[name.charCodeAt(0) % AVATAR_PALETTES.length];

const TalentSpotlight = () => {
  const { data: spotlight } = useQuery({
    queryKey: ['talent_spotlight'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('talent_applications')
        .select('id, first_name, last_name, specialization, skills, bio, profile_photo_url')
        .eq('status', 'approved')
        .order('reviewed_at', { ascending: false })
        .limit(20);

      if (error || !data || data.length === 0) return null;

      const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
      const selected = data[weekNumber % data.length] as Pick<
        TalentApplication,
        'id' | 'first_name' | 'last_name' | 'specialization' | 'skills' | 'bio' | 'profile_photo_url'
      >;

      return {
        id: selected.id,
        name: `${selected.first_name} ${selected.last_name}`,
        role: selected.specialization,
        skills: selected.skills,
        bio: selected.bio,
        photoUrl: selected.profile_photo_url ?? null,
      };
    },
    staleTime: 60 * 60 * 1000,
  });

  if (!spotlight) return null;

  const palette = avatarPalette(spotlight.name);
  const initials = spotlight.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <section className="py-16 bg-white border-y border-slate-100">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="flex items-center justify-between mb-8 max-w-3xl mx-auto">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide">Talent Spotlight</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Featured creative this week</h2>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Updated weekly
          </div>
        </div>

        {/* Spotlight card */}
        <div className="max-w-3xl mx-auto">
          <div className="service-card p-0 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr]">
              {/* Left accent panel */}
              <div className="bg-gradient-to-br from-amber-600 to-amber-800 p-8 flex flex-col items-center justify-center gap-4">
                <div className={`h-20 w-20 rounded-full overflow-hidden flex items-center justify-center text-2xl font-bold ring-4 ring-white/20 ${palette.bg} ${palette.text}`}>
                  {spotlight.photoUrl ? (
                    <img src={spotlight.photoUrl} alt={spotlight.name} className="h-full w-full object-cover" />
                  ) : initials}
                </div>
                <div className="text-center">
                  <p className="text-white font-semibold text-sm leading-tight">{spotlight.name}</p>
                  <p className="text-amber-200 text-xs mt-0.5">{spotlight.role}</p>
                </div>
                <div className="flex items-center gap-1 bg-white/15 rounded-full px-3 py-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-amber-300 text-amber-300" />
                  ))}
                </div>
              </div>

              {/* Right content */}
              <div className="p-7 flex flex-col justify-between">
                <div>
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-4 mb-5">
                    {spotlight.bio}
                  </p>

                  <div className="mb-6">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wide mb-2">Core skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {spotlight.skills.slice(0, 6).map(skill => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="text-[11px] bg-amber-50 text-amber-700 border-amber-200 font-medium"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {spotlight.skills.length > 6 && (
                        <Badge variant="outline" className="text-[11px] text-slate-400 border-slate-200">
                          +{spotlight.skills.length - 6} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button asChild size="sm" className="bg-slate-900 hover:bg-amber-700 text-white shadow-none gap-1.5 transition-colors">
                    <Link to={`/talent/${spotlight.id}`}>
                      View Profile
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm" className="text-slate-500 hover:text-slate-800 text-xs">
                    <Link to="/talent-pool">Browse all talent</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TalentSpotlight;
