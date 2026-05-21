import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from '@/lib/supabase';
import {
  MapPin, Briefcase, Clock, ExternalLink, ArrowLeft,
  Linkedin, Instagram, Twitter, Sparkles,
} from 'lucide-react';

type PublicProfile = {
  id: string;
  first_name: string;
  last_name: string;
  city: string;
  country: string;
  specialization: string;
  experience_level: string;
  availability: string;
  bio: string;
  skills: string[];
  portfolio_url: string | null;
  linkedin: string | null;
  instagram: string | null;
  twitter: string | null;
  profile_photo_url: string | null;
};

const AVATAR_PALETTES = [
  { bg: 'bg-amber-100',   text: 'text-amber-800',   border: 'border-amber-200' },
  { bg: 'bg-violet-100',  text: 'text-violet-800',  border: 'border-violet-200' },
  { bg: 'bg-sky-100',     text: 'text-sky-800',     border: 'border-sky-200' },
  { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200' },
  { bg: 'bg-rose-100',    text: 'text-rose-800',    border: 'border-rose-200' },
  { bg: 'bg-indigo-100',  text: 'text-indigo-800',  border: 'border-indigo-200' },
];

const avatarPalette = (name: string) =>
  AVATAR_PALETTES[name.charCodeAt(0) % AVATAR_PALETTES.length];

const EXP_STYLES: Record<string, string> = {
  Advanced:     'bg-violet-50 text-violet-700 border border-violet-200',
  Intermediate: 'bg-sky-50 text-sky-700 border border-sky-200',
  Beginner:     'bg-slate-100 text-slate-600 border border-slate-200',
};

const AVAIL_STYLES: Record<string, { dot: string; text: string }> = {
  Immediate:    { dot: 'bg-emerald-500', text: 'text-emerald-700' },
  'Two weeks':  { dot: 'bg-amber-400',   text: 'text-amber-700' },
  'One month':  { dot: 'bg-orange-400',  text: 'text-orange-700' },
  Custom:       { dot: 'bg-slate-400',   text: 'text-slate-600' },
};

const TalentPublicProfile = () => {
  const { id } = useParams<{ id: string }>();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['talent_public_profile', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('talent_applications')
        .select('id, first_name, last_name, city, country, specialization, experience_level, availability, bio, skills, portfolio_url, linkedin, instagram, twitter, profile_photo_url')
        .eq('id', id!)
        .eq('status', 'approved')
        .single();
      if (error) throw error;
      return data as PublicProfile;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-grow">
          <div className="bg-white border-b border-slate-100 py-12">
            <div className="container mx-auto px-4 max-w-3xl">
              <Skeleton className="h-4 w-32 mb-8" />
              <div className="flex gap-5 items-start">
                <Skeleton className="h-20 w-20 rounded-full flex-shrink-0" />
                <div className="space-y-3 flex-1">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-28 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container mx-auto px-4 py-8 max-w-3xl space-y-5">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-28 w-full rounded-2xl" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center px-4">
            <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-5">
              <span className="text-2xl">🔍</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Profile not found</h1>
            <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">
              This talent profile may not be available or the link is incorrect.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/talent-pool">
                <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
                Browse talent pool
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const fullName = `${profile.first_name} ${profile.last_name}`;
  const palette = avatarPalette(fullName);
  const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const expStyle = EXP_STYLES[profile.experience_level] ?? EXP_STYLES.Beginner;
  const availStyle = AVAIL_STYLES[profile.availability] ?? { dot: 'bg-slate-400', text: 'text-slate-600' };

  const socialLinks = [
    profile.linkedin && {
      icon: Linkedin, label: 'LinkedIn', color: 'text-[#0A66C2]',
      href: profile.linkedin.startsWith('http') ? profile.linkedin : `https://linkedin.com/in/${profile.linkedin}`,
    },
    profile.instagram && {
      icon: Instagram, label: 'Instagram', color: 'text-[#E1306C]',
      href: profile.instagram.startsWith('http') ? profile.instagram : `https://instagram.com/${profile.instagram.replace('@', '')}`,
    },
    profile.twitter && {
      icon: Twitter, label: 'Twitter / X', color: 'text-slate-700',
      href: profile.twitter.startsWith('http') ? profile.twitter : `https://twitter.com/${profile.twitter.replace('@', '')}`,
    },
  ].filter(Boolean) as { icon: typeof Linkedin; label: string; color: string; href: string }[];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-grow">
        {/* Profile hero */}
        <div className="bg-white border-b border-slate-100 relative overflow-hidden">
          <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-amber-50 blur-3xl opacity-60" />
          <div className="relative container mx-auto px-4 py-12 max-w-3xl">
            <Button asChild variant="ghost" size="sm" className="-ml-2 mb-7 text-slate-500 hover:text-slate-800 gap-1">
              <Link to="/talent-pool">
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to talent pool
              </Link>
            </Button>

            <div className="flex items-start gap-5 flex-col sm:flex-row">
              <div className={`h-20 w-20 rounded-full overflow-hidden flex items-center justify-center text-2xl font-bold flex-shrink-0 border-2 ${palette.bg} ${palette.text} ${palette.border}`}>
                {profile.profile_photo_url ? (
                  <img src={profile.profile_photo_url} alt={fullName} className="h-full w-full object-cover" />
                ) : initials}
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">{fullName}</h1>
                <p className="text-sm text-slate-500 flex items-center gap-1.5 mb-4">
                  <MapPin className="h-3.5 w-3.5" />
                  {profile.city}, {profile.country}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    <Briefcase className="h-3 w-3" />
                    {profile.specialization}
                  </span>
                  <span className={`inline-flex items-center text-xs font-medium px-3 py-1.5 rounded-full ${expStyle}`}>
                    {profile.experience_level}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-white border border-slate-200 ${availStyle.text}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${availStyle.dot}`} />
                    <Clock className="h-3 w-3" />
                    {profile.availability}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8 max-w-3xl space-y-5">
          {/* Bio */}
          <div className="service-card p-6">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">About</h2>
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-sm">{profile.bio}</p>
          </div>

          {/* Skills */}
          {profile.skills.length > 0 && (
            <div className="service-card p-6">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Skills & Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map(skill => (
                  <span
                    key={skill}
                    className="text-xs font-medium px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Portfolio & links */}
          {(profile.portfolio_url || socialLinks.length > 0) && (
            <div className="service-card p-6">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Portfolio & Links</h2>
              <div className="space-y-3">
                {profile.portfolio_url && (
                  <a
                    href={profile.portfolio_url.startsWith('http') ? profile.portfolio_url : `https://${profile.portfolio_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-amber-700 hover:text-amber-800 hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Portfolio
                  </a>
                )}
                {socialLinks.map(({ icon: Icon, label, href, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    <Icon className={`h-4 w-4 ${color}`} />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="service-card p-6 bg-gradient-to-br from-amber-700 to-amber-900 border-amber-800">
            <div className="flex items-start gap-3 mb-4">
              <Sparkles className="h-5 w-5 text-amber-300 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="text-base font-bold text-white leading-snug">
                  Interested in working with {profile.first_name}?
                </h2>
                <p className="text-sm text-amber-200 mt-1 leading-relaxed">
                  Submit a project inquiry and our team will connect you with the right talent for your needs.
                </p>
              </div>
            </div>
            <Button
              asChild
              size="sm"
              className="bg-white text-amber-800 hover:bg-amber-50 shadow-none font-semibold gap-1.5"
            >
              <Link to="/client-intake-form">
                Submit a project inquiry
                <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TalentPublicProfile;
