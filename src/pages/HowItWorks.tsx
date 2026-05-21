import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Reveal } from '@/components/Reveal';
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Briefcase, Users, GraduationCap, Award,
  MessageSquare, FileText, CheckCircle2,
  ArrowRight, Sparkles, HelpCircle,
} from 'lucide-react';

// ─── Step timeline ────────────────────────────────────────────────────────────

interface Step {
  title: string;
  description: string;
  icon: React.ElementType;
}

interface AccentConfig {
  numBg: string;
  numText: string;
  numRing: string;
  line: string;
  iconBg: string;
  iconText: string;
  tag: string;
  tagBg: string;
}

const CREATIVE_ACCENT: AccentConfig = {
  numBg:    'bg-amber-500',
  numText:  'text-white',
  numRing:  'ring-amber-100',
  line:     'bg-amber-200',
  iconBg:   'bg-amber-50',
  iconText: 'text-amber-700',
  tag:      'text-amber-700',
  tagBg:    'bg-amber-50 border-amber-200',
};

const BUSINESS_ACCENT: AccentConfig = {
  numBg:    'bg-slate-800',
  numText:  'text-white',
  numRing:  'ring-slate-100',
  line:     'bg-slate-200',
  iconBg:   'bg-slate-100',
  iconText: 'text-slate-700',
  tag:      'text-slate-600',
  tagBg:    'bg-slate-100 border-slate-200',
};

const StepItem = ({
  step,
  index,
  isLast,
  accent,
}: {
  step: Step;
  index: number;
  isLast: boolean;
  accent: AccentConfig;
}) => {
  const Icon = step.icon;
  const num = String(index + 1).padStart(2, '0');

  return (
    <Reveal delay={index * 80} className="flex gap-5">
      {/* Left: number pill + connector line */}
      <div className="flex flex-col items-center flex-shrink-0 pt-0.5">
        <div className={`h-11 w-11 rounded-full flex items-center justify-center font-bold text-sm ring-4 ${accent.numBg} ${accent.numText} ${accent.numRing}`}>
          {num}
        </div>
        {!isLast && (
          <div className={`w-px flex-1 min-h-[3rem] mt-2 ${accent.line}`} />
        )}
      </div>

      {/* Right: content */}
      <div className={`pb-10 flex-1 min-w-0 ${isLast ? 'pb-2' : ''}`}>
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className={`p-2 rounded-lg ${accent.iconBg}`}>
            <Icon className={`h-4 w-4 ${accent.iconText}`} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 leading-tight">{step.title}</h3>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
      </div>
    </Reveal>
  );
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const CREATIVE_STEPS: Step[] = [
  {
    title: 'Apply',
    icon: FileText,
    description: 'Submit your application to join our talent pool. Share your portfolio, resume, and career goals so we can understand your unique skills and aspirations.',
  },
  {
    title: 'Train',
    icon: GraduationCap,
    description: 'Participate in our free training programs designed to enhance your skills, keep you updated on industry trends, and maximise your marketability.',
  },
  {
    title: 'Match',
    icon: Users,
    description: 'Get connected with job opportunities that fit your skills, experience, and career goals. We carefully match you with projects and positions that align with your expertise.',
  },
  {
    title: 'Grow',
    icon: Award,
    description: 'Receive ongoing support and career development as you progress. We\'re invested in your long-term success and professional growth.',
  },
];

const BUSINESS_STEPS: Step[] = [
  {
    title: 'Reach Out',
    icon: MessageSquare,
    description: 'Contact our team with your recruitment needs. Share details about your company, project requirements, and the type of creative talent you\'re seeking.',
  },
  {
    title: 'Define Needs',
    icon: FileText,
    description: 'Work with our recruitment specialists to identify the exact skills, experience, and qualities you\'re looking for in creative professionals.',
  },
  {
    title: 'Select Talent',
    icon: CheckCircle2,
    description: 'Review our carefully curated list of candidates who match your requirements. Interview and select the creative professionals who best fit your team.',
  },
  {
    title: 'Integrate',
    icon: Briefcase,
    description: 'Experience seamless onboarding as we help integrate the new talent into your team, with continuous support throughout the process.',
  },
];

const FAQS = [
  {
    q: 'How long does the recruitment process take?',
    a: 'The timeline varies based on the complexity of the role and your specific requirements. Typically, we provide a shortlist of qualified candidates within 1–2 weeks. For urgent needs, we also offer expedited services.',
  },
  {
    q: 'What industries do you specialise in?',
    a: 'We specialise in graphic design, web and UI/UX design, content creation, video production, marketing, advertising, and digital media. Our network includes talent across these and other related creative disciplines.',
  },
  {
    q: 'Are training programmes mandatory for creatives?',
    a: 'No, our training programmes are optional benefits for creative professionals in our network. However, we highly recommend participation as they enhance skills, marketability, and career opportunities.',
  },
  {
    q: 'What support do you offer post-placement?',
    a: 'We provide comprehensive post-placement support including regular check-ins with both the client and the creative professional, performance reviews, conflict resolution if needed, and ongoing career development guidance.',
  },
  {
    q: 'Do you offer temporary or project-based talent solutions?',
    a: 'Yes, we offer flexible solutions including full-time placement, contract-to-hire, project-based work, and freelance arrangements to meet the diverse needs of both businesses and creative professionals.',
  },
  {
    q: 'How do you ensure quality in your talent pool?',
    a: 'All creative professionals in our network undergo a rigorous vetting process including portfolio review, skill assessment, interviews, reference checks, and in some cases, practical assignments to ensure they meet our high-quality standards.',
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

const HowItWorks = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-100 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-amber-50 blur-3xl opacity-70" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-amber-50 blur-2xl opacity-50" />

        <div className="relative container mx-auto px-4 py-20 md:py-24 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <Sparkles className="h-3 w-3" />
              The CrémeTalent Process
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-[1.1] tracking-tight mb-4">
              Simple steps, real results
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed mb-8">
              Our streamlined process connects creative talent with the right opportunities — efficiently, transparently, and with a personal touch.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a href="#for-creatives">
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white shadow-none gap-1.5">
                  For Creative Professionals
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </a>
              <a href="#for-businesses">
                <Button size="sm" variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50 shadow-none gap-1.5">
                  For Businesses
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── For Creatives ─────────────────────────────────────────── */}
      <section id="for-creatives" className="py-20 scroll-mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-12 items-start">

            {/* Left: section intro — sticky on desktop */}
            <Reveal className="lg:sticky lg:top-24">
              <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                For Creative Professionals
              </div>
              <h2 className="text-3xl font-bold text-slate-900 leading-tight mb-3">
                Your journey starts here.
              </h2>
              <p className="text-slate-500 leading-relaxed text-sm mb-6">
                Join Africa's most connected creative talent network — from first application to career-defining opportunities.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {['Free to join', 'No hidden fees', 'Dedicated support'].map(badge => (
                  <span key={badge} className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-white border border-amber-200 text-amber-700">
                    <CheckCircle2 className="h-3 w-3" />
                    {badge}
                  </span>
                ))}
              </div>
              <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white shadow-none gap-1.5" size="sm">
                <Link to="/join-talent-pool">
                  Apply Now
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </Reveal>

            {/* Right: timeline steps */}
            <div>
              {CREATIVE_STEPS.map((step, i) => (
                <StepItem
                  key={step.title}
                  step={step}
                  index={i}
                  isLast={i === CREATIVE_STEPS.length - 1}
                  accent={CREATIVE_ACCENT}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Divider ───────────────────────────────────────────────── */}
      <div className="container mx-auto px-4">
        <div className="h-px bg-slate-200 max-w-5xl mx-auto" />
      </div>

      {/* ── For Businesses ────────────────────────────────────────── */}
      <section id="for-businesses" className="py-20 scroll-mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">

            {/* Left: timeline steps */}
            <div className="order-2 lg:order-1">
              {BUSINESS_STEPS.map((step, i) => (
                <StepItem
                  key={step.title}
                  step={step}
                  index={i}
                  isLast={i === BUSINESS_STEPS.length - 1}
                  accent={BUSINESS_ACCENT}
                />
              ))}
            </div>

            {/* Right: section intro — sticky */}
            <Reveal className="lg:sticky lg:top-24 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
                For Businesses
              </div>
              <h2 className="text-3xl font-bold text-slate-900 leading-tight mb-3">
                Find the right creative, fast.
              </h2>
              <p className="text-slate-500 leading-relaxed text-sm mb-6">
                Access a vetted pool of Africa's top creative professionals — matched precisely to your project's needs.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {['Vetted talent', '1–2 week turnaround', 'Ongoing support'].map(badge => (
                  <span key={badge} className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600">
                    <CheckCircle2 className="h-3 w-3" />
                    {badge}
                  </span>
                ))}
              </div>
              <Button asChild variant="outline" className="border-slate-800 text-slate-800 hover:bg-slate-100 shadow-none gap-1.5" size="sm">
                <Link to="/client-intake-form">
                  Request Talent
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Reveal className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                <HelpCircle className="h-3 w-3" />
                Frequently Asked Questions
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Got questions?</h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                Find answers to the most common questions about our process, services, and talent network.
              </p>
            </Reveal>

            <Reveal>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
                <Accordion type="single" collapsible className="w-full">
                  {FAQS.map((faq, i) => (
                    <AccordionItem
                      key={i}
                      value={`faq-${i}`}
                      className="border-none px-6"
                    >
                      <AccordionTrigger className="text-sm font-semibold text-slate-800 hover:text-amber-700 hover:no-underline py-5 [&[data-state=open]]:text-amber-700 transition-colors text-left">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-slate-500 leading-relaxed pb-5">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="py-20 relative overflow-hidden bg-amber-700">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.08),_transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(0,0,0,0.15),_transparent_60%)]" />

        <div className="relative container mx-auto px-4 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-amber-100 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              <Sparkles className="h-3 w-3" />
              Ready to begin?
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-3">
              Take the next step today.
            </h2>
            <p className="text-amber-100 max-w-lg mx-auto leading-relaxed mb-8 text-sm">
              Whether you're a creative professional looking for meaningful work, or a business seeking exceptional talent — we're here to make the match.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button asChild size="sm" className="bg-white text-amber-800 hover:bg-amber-50 shadow-none font-semibold px-6 gap-1.5">
                <Link to="/join-talent-pool">
                  For Creative Professionals
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="bg-transparent border-white/40 text-white hover:bg-white/15 shadow-none font-medium px-6 gap-1.5">
                <Link to="/client-intake-form">
                  For Businesses
                  <ArrowRight className="h-3.5 w-3.5" />
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

export default HowItWorks;
