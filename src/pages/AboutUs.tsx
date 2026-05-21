import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Reveal } from '@/components/Reveal';
import { Button } from "@/components/ui/button";
import {
  Heart, Lightbulb, Shield, Award, Brush, Users,
  ArrowRight, Sparkles, MapPin, Quote,
} from 'lucide-react';

// ─── Data ─────────────────────────────────────────────────────────────────────

const CORE_VALUES = [
  {
    icon: Heart,
    title: 'Empowerment',
    description: 'Enabling creatives to reach their full potential through resources, meaningful connections, and curated opportunities.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Embracing new ideas and fresh approaches to stay ahead in the ever-evolving creative industry across Africa.',
  },
  {
    icon: Shield,
    title: 'Integrity',
    description: 'Building trust through transparency and honesty in every interaction — with clients and creatives alike.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'Holding the highest standards in our recruitment processes, training programmes, and client services.',
  },
  {
    icon: Brush,
    title: 'Creativity',
    description: 'Celebrating creative expression and recognising it as the driving force of every industry we serve.',
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'Bringing together diverse talents to achieve exceptional results — the best work is always a team effort.',
  },
];

const IMPACT_STATS = [
  { value: '500+', label: 'Creatives placed' },
  { value: '200+', label: 'Client companies' },
  { value: '15+',  label: 'Creative disciplines' },
  { value: '98%',  label: 'Client satisfaction' },
];

const AVATAR_PALETTES = [
  { bg: 'bg-amber-100',   text: 'text-amber-800',   border: 'border-amber-200' },
  { bg: 'bg-violet-100',  text: 'text-violet-800',  border: 'border-violet-200' },
  { bg: 'bg-sky-100',     text: 'text-sky-800',     border: 'border-sky-200' },
  { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200' },
];

const avatarPalette = (name: string) =>
  AVATAR_PALETTES[name.charCodeAt(0) % AVATAR_PALETTES.length];

const TEAM = [
  {
    name: 'Pamela Williams',
    role: 'CEO & Co-Founder',
    bio: 'With over 6 years in creative recruitment and brand strategy, Pamela founded CrémeTalent to create meaningful connections between exceptional talent and the opportunities they deserve.',
  },
  {
    name: 'Abdulbari Sulaiman',
    role: 'Technical Director',
    bio: 'Abdulbari leads our technical operations, ensuring our platform and digital infrastructure effectively connects creative talent with the right opportunities across Africa.',
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative bg-white overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-amber-100 blur-3xl opacity-50" aria-hidden="true" />
        <div className="pointer-events-none absolute top-10 -right-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl opacity-60" aria-hidden="true" />

        <div className="relative container mx-auto px-4 py-20 md:py-28 text-center">
          <Reveal>
            <span className="eyebrow mb-5 mx-auto">
              <Sparkles className="h-3.5 w-3.5" />
              About CrémeTalent
            </span>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold mb-6 leading-[1.1] text-slate-900">
              Built for Africa's{' '}
              <em className="not-italic text-primary">creative economy.</em>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              We connect exceptional creative professionals with the brands building Africa's next chapter — through sourcing, training, and long-term career management.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                <Link to="/join-talent-pool">
                  Join Our Network
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-foreground/20 hover:bg-foreground/5">
                <Link to="/contact">
                  Get in Touch
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Our Story ────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">

            {/* Copy */}
            <Reveal>
              <span className="eyebrow mb-5">Our Story</span>
              <h2 className="text-4xl md:text-5xl font-semibold mb-6 leading-[1.1] text-slate-900">
                Born from a passion for nurturing talent.
              </h2>

              {/* Pull quote */}
              <div className="relative pl-5 border-l-2 border-amber-500 mb-6">
                <Quote className="absolute -top-0.5 -left-1 h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                <p className="text-base font-medium text-slate-700 italic leading-relaxed">
                  "We saw a gap between Africa's extraordinary creative potential and the structured pathways needed to fully realise it."
                </p>
              </div>

              <p className="text-base text-slate-500 leading-relaxed mb-4">
                CrémeTalent was founded by industry professionals who recognised a clear need — a dedicated platform built specifically to support and elevate creative talent across the continent.
              </p>
              <p className="text-base text-slate-500 leading-relaxed mb-4">
                Drawing from years of experience in recruitment and a deep understanding of the African creative landscape, we've built a network that genuinely bridges the gap between talent and opportunity.
              </p>
              <p className="text-base text-slate-500 leading-relaxed mb-8">
                Our journey began with a simple conviction: creative professionals deserve a space to thrive, and businesses deserve a trusted partner to help them find the exact talent needed to bring their visions to life.
              </p>

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <MapPin className="h-4 w-4 text-amber-600 flex-shrink-0" />
                <span>Headquartered in Abuja, Nigeria</span>
              </div>
            </Reveal>

            {/* Branded visual card */}
            <Reveal delay={120}>
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="pointer-events-none absolute -bottom-12 -right-12 h-52 w-52 rounded-full bg-amber-500/10 blur-3xl" aria-hidden="true" />
                <div className="pointer-events-none absolute -top-10 -left-10 h-40 w-40 rounded-full bg-amber-600/5 blur-2xl" aria-hidden="true" />

                <div className="relative">
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="h-4 w-4 text-amber-400" />
                    <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">Our Impact</span>
                  </div>

                  <p className="text-xl font-bold text-white leading-snug mb-1">CrémeTalent</p>
                  <p className="text-sm text-slate-400 mb-8">Africa's premier creative talent network</p>

                  <div className="grid grid-cols-2 gap-3">
                    {IMPACT_STATS.map(({ value, label }) => (
                      <div key={label} className="bg-white/5 rounded-xl p-4 border border-white/5">
                        <p className="text-2xl font-bold text-amber-400 tabular-nums">{value}</p>
                        <p className="text-xs text-slate-400 mt-0.5 leading-snug">{label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                    <span className="text-xs text-slate-400">Actively placing talent across Africa</span>
                  </div>
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ── Core Values ──────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <Reveal className="text-center mb-16 max-w-2xl mx-auto">
            <span className="eyebrow mb-4">What We Stand For</span>
            <h2 className="text-4xl md:text-5xl font-semibold mb-4 leading-[1.1]">
              Our core values.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              These principles guide every decision, every placement, and every relationship we build.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {CORE_VALUES.map(({ icon: Icon, title, description }, i) => (
              <Reveal key={title} delay={i * 60}>
                <div className="service-card p-7 flex flex-col gap-4 h-full">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-amber-100">
                    <Icon className="h-5 w-5 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">{title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Meet the Team ────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-slate-50">
        <div className="container mx-auto px-4">
          <Reveal className="text-center mb-16 max-w-2xl mx-auto">
            <span className="eyebrow mb-4">The People</span>
            <h2 className="text-4xl md:text-5xl font-semibold mb-4 leading-[1.1]">
              Meet our team.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The dedicated professionals behind CrémeTalent bring deep expertise in recruitment, training, and talent management.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {TEAM.map(({ name, role, bio }, i) => {
              const palette = avatarPalette(name);
              const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
              return (
                <Reveal key={name} delay={i * 100}>
                  <div className="service-card p-8 flex flex-col items-center text-center h-full">
                    <div className={`h-20 w-20 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0 border-2 mb-5 ${palette.bg} ${palette.text} ${palette.border}`}>
                      {initials}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-0.5">{name}</h3>
                    <p className="text-sm font-semibold text-amber-700 mb-4">{role}</p>
                    <div className="w-10 h-px bg-amber-200 mb-4" />
                    <p className="text-sm text-slate-500 leading-relaxed">{bio}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-amber-700 py-20 md:py-24">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-amber-600/40 blur-3xl" />
          <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-amber-900/40 blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 text-center">
          <Reveal>
            <span className="eyebrow mb-5 mx-auto border-white/20 text-amber-100 bg-white/10">
              <Sparkles className="h-3.5 w-3.5" />
              Work With Us
            </span>
            <h2 className="text-4xl md:text-5xl font-semibold text-white mb-4 leading-[1.1]">
              Be part of the story.
            </h2>
            <p className="text-lg text-amber-100 max-w-xl mx-auto mb-10 leading-relaxed">
              Whether you're a creative looking for your next opportunity or a brand ready to invest in Africa's creative future — we'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="bg-white text-amber-800 hover:bg-amber-50 shadow-none font-semibold gap-1.5">
                <Link to="/join-talent-pool">
                  Join Our Network
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent border-white/40 text-white hover:bg-white/15 shadow-none font-medium"
              >
                <Link to="/contact">
                  Get in Touch
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
