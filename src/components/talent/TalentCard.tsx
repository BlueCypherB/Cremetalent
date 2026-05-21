import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase, Clock, ChevronRight, Zap } from 'lucide-react';
import { TalentData } from '@/types/talent';

interface TalentCardProps {
  talent: TalentData;
}

const AVATAR_PALETTES = [
  { bg: 'bg-amber-100',   text: 'text-amber-800',   ring: 'ring-amber-200' },
  { bg: 'bg-violet-100',  text: 'text-violet-800',  ring: 'ring-violet-200' },
  { bg: 'bg-sky-100',     text: 'text-sky-800',     ring: 'ring-sky-200' },
  { bg: 'bg-emerald-100', text: 'text-emerald-800', ring: 'ring-emerald-200' },
  { bg: 'bg-rose-100',    text: 'text-rose-800',    ring: 'ring-rose-200' },
  { bg: 'bg-orange-100',  text: 'text-orange-800',  ring: 'ring-orange-200' },
  { bg: 'bg-indigo-100',  text: 'text-indigo-800',  ring: 'ring-indigo-200' },
  { bg: 'bg-teal-100',    text: 'text-teal-800',    ring: 'ring-teal-200' },
];

const EXP_STYLES: Record<string, string> = {
  Advanced:     'bg-violet-50 text-violet-700 border-violet-200',
  Intermediate: 'bg-sky-50 text-sky-700 border-sky-200',
  Beginner:     'bg-slate-50 text-slate-600 border-slate-200',
};

const AVAIL_STYLES: Record<string, { dot: string; text: string }> = {
  Immediate:  { dot: 'bg-emerald-500', text: 'text-emerald-700' },
  'Two weeks':{ dot: 'bg-amber-400',   text: 'text-amber-700' },
  'One month':{ dot: 'bg-orange-400',  text: 'text-orange-700' },
  Custom:     { dot: 'bg-slate-400',   text: 'text-slate-600' },
};

const avatarPalette = (name: string) =>
  AVATAR_PALETTES[name.charCodeAt(0) % AVATAR_PALETTES.length];

const getInitials = (name: string) =>
  name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);

const TalentCard = ({ talent }: TalentCardProps) => {
  const palette = avatarPalette(talent.name);
  const expStyle = EXP_STYLES[talent.experience] ?? EXP_STYLES.Beginner;
  const availStyle = AVAIL_STYLES[talent.availability] ?? { dot: 'bg-slate-400', text: 'text-slate-600' };
  const hasMatch = (talent.matchScore ?? 0) > 0;

  return (
    <div className="service-card group flex flex-col h-full overflow-hidden">
      {/* Card top accent */}
      <div className="h-0.5 w-full bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 group-hover:from-amber-400 group-hover:to-amber-300 transition-colors" />

      {/* Header */}
      <div className="p-5 pb-4">
        <div className="flex items-start gap-3">
          <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold text-base ring-2 flex-shrink-0 ${palette.bg} ${palette.text} ${palette.ring}`}>
            {talent.photo ? (
              <img src={talent.photo} alt={talent.name} className="h-full w-full object-cover rounded-full" />
            ) : (
              getInitials(talent.name)
            )}
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-semibold text-slate-900 text-sm leading-tight truncate min-w-0">{talent.name}</h3>
              {hasMatch && (
                <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex-shrink-0">
                  <Zap className="h-2.5 w-2.5" />
                  {talent.matchScore}% match
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{talent.location}</span>
            </p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            <Briefcase className="h-3 w-3" />
            {talent.category}
          </span>
          <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border ${expStyle}`}>
            {talent.experience}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-100 mx-5" />

      {/* Bio */}
      <div className="px-5 pt-4 pb-3 flex-1">
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{talent.bio}</p>
      </div>

      {/* Skills */}
      <div className="px-5 pb-4">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {talent.skills.slice(0, 5).map(skill => (
            <span key={skill} className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
              {skill}
            </span>
          ))}
          {talent.skills.length > 5 && (
            <span className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 text-slate-400 rounded-full">
              +{talent.skills.length - 5}
            </span>
          )}
        </div>
        <div className={`flex items-center gap-1.5 text-xs font-medium ${availStyle.text}`}>
          <Clock className="h-3 w-3" />
          <span className={`h-1.5 w-1.5 rounded-full ${availStyle.dot}`} />
          {talent.availability}
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 pb-5">
        <Button
          asChild
          size="sm"
          className="w-full bg-slate-900 hover:bg-amber-700 text-white shadow-none transition-colors duration-200 gap-1.5 text-xs h-9"
        >
          <Link to={`/talent/${talent.id}`}>
            View Full Profile
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default TalentCard;
