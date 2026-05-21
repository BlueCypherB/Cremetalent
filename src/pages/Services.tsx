import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Reveal } from '@/components/Reveal';
import { Button } from "@/components/ui/button";
import {
  Users, GraduationCap, Award, Briefcase,
  HandHeart, FileText, CheckCircle2, ArrowRight,
  Sparkles, Zap, Shield, Clock,
} from 'lucide-react';

// ─── Types & data ─────────────────────────────────────────────────────────────

type Audience = 'creatives' | 'businesses';

interface Accent { iconBg: string; iconText: string; check: string }
interface ServiceItem {
  icon: React.ElementType;
  title: string;
  desc: string;
  features: string[];
  cta: { label: string; to: string };
  accent: Accent;
}

const SERVICES: Record<Audience, ServiceItem[]> = {
  creatives: [
    {
      icon: Users,
      title: 'Talent Pool Application',
      desc: 'Join our curated community of vetted creatives and gain access to exclusive career opportunities across Africa.',
      features: [
        'Access to top-tier clients across industries',
        'Complimentary training programmes',
        'Ongoing career development support',
        'Opportunities across creative disciplines',
      ],
      cta: { label: 'Apply Now', to: '/join-talent-pool' },
      accent: { iconBg: 'bg-amber-50', iconText: 'text-amber-700', check: 'text-amber-600' },
    },
    {
      icon: GraduationCap,
      title: 'Training & Development',
      desc: 'Sharpen your skills with structured programmes built around real industry demands and emerging creative trends.',
      features: [
        'Operational excellence in creative workflows',
        'Industry workshops with experienced leaders',
        'Creative innovation techniques & methodologies',
        'Portfolio development guidance',
      ],
      cta: { label: 'Explore Training', to: '/training-resources' },
      accent: { iconBg: 'bg-amber-50', iconText: 'text-amber-700', check: 'text-amber-600' },
    },
    {
      icon: Award,
      title: 'Talent Management',
      desc: 'Dedicated career managers who navigate opportunities on your behalf and keep your professional growth on track.',
      features: [
        'Personalised career guidance & planning',
        'Regular performance reviews and feedback',
        'Contract and negotiation support',
        'Long-term development opportunities',
      ],
      cta: { label: 'Learn More', to: '/contact' },
      accent: { iconBg: 'bg-amber-50', iconText: 'text-amber-700', check: 'text-amber-600' },
    },
  ],
  businesses: [
    {
      icon: Briefcase,
      title: 'Talent Sourcing & Recruitment',
      desc: 'Precision-matched creative professionals sourced from our rigorously vetted network — fast and without compromise.',
      features: [
        'Deep discovery of your creative requirements',
        'Access to our pre-vetted talent pool',
        'Curated shortlists within 3–5 business days',
        'Match scoring against your exact criteria',
      ],
      cta: { label: 'Hire Talent', to: '/client-intake-form' },
      accent: { iconBg: 'bg-slate-100', iconText: 'text-slate-700', check: 'text-amber-600' },
    },
    {
      icon: HandHeart,
      title: 'Onboarding & Integration',
      desc: 'We don\'t just place talent — we ensure each hire integrates smoothly into your team and culture from day one.',
      features: [
        'Structured onboarding process and checklist',
        'Cultural alignment and briefing support',
        'Dedicated onboarding manager assigned',
        'Early performance check-ins included',
      ],
      cta: { label: 'Learn More', to: '/contact' },
      accent: { iconBg: 'bg-slate-100', iconText: 'text-slate-700', check: 'text-amber-600' },
    },
    {
      icon: FileText,
      title: 'Ongoing Talent Management',
      desc: 'End-to-end management of your creative team — performance, contracts, development, and everything in between.',
      features: [
        'Regular performance evaluations & feedback',
        'Contract management and administration',
        'Replacement guarantee if placements don\'t work',
        'Long-term talent development planning',
      ],
      cta: { label: 'Learn More', to: '/contact' },
      accent: { iconBg: 'bg-slate-100', iconText: 'text-slate-700', check: 'text-amber-600' },
    },
  ],
};

const WHY_US = [
  {
    icon: Zap,
    title: 'Speed without sacrificing quality',
    desc: 'Most briefs receive a curated shortlist within 3–5 business days — not weeks.',
  },
  {
    icon: Shield,
    title: 'Pre-vetted creative talent',
    desc: 'Every professional passes portfolio review, skills assessment, and reference checks before joining our pool.',
  },
  {
    icon: Users,
    title: 'Deep African creative network',
    desc: 'Built specifically for the continent\'s creative economy — we know the market, the talent, and the culture.',
  },
  {
    icon: Clock,
    title: 'Support beyond the hire',
    desc: 'Our relationship doesn\'t end at placement — ongoing management, training, and development are all included.',
  },
];

const STATS = [
  { value: '500+', label: 'Creatives placed' },
  { value: '200+', label: 'Client companies' },
  { value: '15+', label: 'Creative disciplines' },
  { value: '98%',  label: 'Client satisfaction' },
];

// ─── Service card ─────────────────────────────────────────────────────────────

const ServiceCard = ({
  icon: Icon,
  title,
  desc,
  features,
  cta,
  accent,
  index,
}: ServiceItem & { index: number }) => (
  <Reveal delay={index * 80}>
    <div className="service-card h-full p-7 flex flex-col">
      <div className={`inline-flex p-3 rounded-xl self-start mb-5 border ${accent.iconBg} ${
        accent.iconBg === 'bg-amber-50' ? 'border-amber-100' : 'border-slate-200'
      }`}>
        <Icon className={`h-5 w-5 ${accent.iconText}`} />
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed mb-5">{desc}</p>

      <ul className="space-y-2.5 mb-7 flex-grow">
        {features.map(f => (
          <li key={f} className="flex items-start gap-2.5">
            <CheckCircle2 className={`h-4 w-4 flex-shrink-0 mt-0.5 ${accent.check}`} />
            <span className="text-sm text-slate-600 leading-relaxed">{f}</span>
          </li>
        ))}
      </ul>

      <Button asChild size="sm" className="w-full shadow-none gap-1.5 mt-auto">
        <Link to={cta.to}>
          {cta.label}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </Button>
    </div>
  </Reveal>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const Services = () => {
  const [audience, setAudience] = useState<Audience>('creatives');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative bg-white overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-amber-100 blur-3xl opacity-50" aria-hidden="true" />
        <div className="pointer-events-none absolute top-16 -left-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl opacity-60" aria-hidden="true" />

        <div className="relative container mx-auto px-4 py-20 md:py-28 text-center">
          <Reveal>
            <span className="eyebrow mb-5 mx-auto">
              <Sparkles className="h-3.5 w-3.5" />
              Our Services
            </span>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold mb-6 leading-[1.1] text-slate-900">
              Everything your creative <em className="not-italic text-primary">journey needs.</em>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Whether you're a creative professional building a career or a brand hunting for the right talent — we have a service designed for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                <Link to="/join-talent-pool">
                  Join as Creative
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-foreground/20 hover:bg-foreground/5">
                <Link to="/client-intake-form">
                  Hire Creative Talent
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>

        {/* Stats bar */}
        <div className="relative border-t border-slate-100 bg-slate-50/70">
          <div className="container mx-auto px-4 py-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 md:divide-x divide-slate-200">
              {STATS.map(({ value, label }) => (
                <div key={label} className="text-center px-4">
                  <p className="text-2xl md:text-3xl font-semibold text-amber-700 tabular-nums">{value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Services with audience toggle ────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-slate-50">
        <div className="container mx-auto px-4">
          <Reveal className="text-center mb-12 max-w-2xl mx-auto">
            <span className="eyebrow mb-4">What We Offer</span>
            <h2 className="text-4xl md:text-5xl font-semibold mb-4 leading-[1.1]">
              Services built for both sides.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Pick your path and explore what CrémeTalent offers.
            </p>
          </Reveal>

          {/* Audience toggle */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
              {(['creatives', 'businesses'] as Audience[]).map(a => (
                <button
                  key={a}
                  onClick={() => setAudience(a)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    audience === a
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {a === 'creatives' ? 'For Creatives' : 'For Businesses'}
                </button>
              ))}
            </div>
          </div>

          {/* Cards — key forces re-mount so Reveal animations replay on tab switch */}
          <div key={audience} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {SERVICES[audience].map((service, i) => (
              <ServiceCard key={service.title} {...service} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Why CrémeTalent ───────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <Reveal className="text-center mb-16 max-w-2xl mx-auto">
            <span className="eyebrow mb-4">Why CrémeTalent</span>
            <h2 className="text-4xl md:text-5xl font-semibold mb-4 leading-[1.1]">
              What sets us apart.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Built for Africa's creative economy with the standards international brands expect.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {WHY_US.map(({ icon: Icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 70}>
                <div className="service-card p-6 flex flex-col gap-4 h-full">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-amber-100">
                    <Icon className="h-5 w-5 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug">{title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
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
              Start Today
            </span>
            <h2 className="text-4xl md:text-5xl font-semibold text-white mb-4 leading-[1.1]">
              Ready to take the next step?
            </h2>
            <p className="text-lg text-amber-100 max-w-xl mx-auto mb-10 leading-relaxed">
              Whether you're a creative looking for your next opportunity or a brand searching for the right talent — we're ready.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="bg-white text-amber-800 hover:bg-amber-50 shadow-none font-semibold gap-1.5">
                <Link to="/join-talent-pool">
                  Join as Creative
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent border-white/40 text-white hover:bg-white/15 shadow-none font-medium"
              >
                <Link to="/client-intake-form">
                  Hire Talent
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

export default Services;
