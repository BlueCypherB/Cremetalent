import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TalentSpotlight from '@/components/talent/TalentSpotlight';
import { Reveal } from '@/components/Reveal';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Briefcase,
  GraduationCap,
  Users,
  Award,
  Star,
  FileText,
  HandHeart,
  ArrowRight,
  Sparkles,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react';

// ─── How It Works section (homepage) ──────────────────────────────────────────

const HOW_TABS = [
  {
    id: 'creatives',
    label: 'For Creatives',
    accent: { num: 'bg-amber-500 text-white ring-amber-100', line: 'bg-amber-200', icon: 'bg-amber-50 text-amber-700', pill: 'bg-amber-50 border-amber-200 text-amber-700' },
    cta: { label: 'Apply Now →', to: '/join-talent-pool', className: 'bg-amber-600 hover:bg-amber-700 text-white' },
    steps: [
      { icon: FileText,      title: 'Apply',  desc: 'Submit your application with your portfolio and career goals.' },
      { icon: GraduationCap, title: 'Train',  desc: 'Access free training programmes to sharpen your skills and marketability.' },
      { icon: Users,         title: 'Match',  desc: 'Get connected with opportunities aligned to your expertise and ambitions.' },
      { icon: Award,         title: 'Grow',   desc: 'Receive ongoing career development and support as you advance.' },
    ],
  },
  {
    id: 'businesses',
    label: 'For Businesses',
    accent: { num: 'bg-slate-800 text-white ring-slate-100', line: 'bg-slate-200', icon: 'bg-slate-100 text-slate-700', pill: 'bg-slate-100 border-slate-200 text-slate-600' },
    cta: { label: 'Request Talent →', to: '/client-intake-form', className: 'bg-slate-900 hover:bg-amber-700 text-white' },
    steps: [
      { icon: MessageSquare, title: 'Reach Out',     desc: 'Tell us about your project requirements and the creative talent you need.' },
      { icon: FileText,      title: 'Define Needs',  desc: 'Work with our specialists to identify the exact skills and experience required.' },
      { icon: CheckCircle2,  title: 'Select Talent', desc: 'Review our curated shortlist and interview your top candidates.' },
      { icon: Briefcase,     title: 'Integrate',     desc: 'Enjoy seamless onboarding with continuous support throughout.' },
    ],
  },
] as const;

const HowItWorksSection = () => {
  const [active, setActive] = useState<'creatives' | 'businesses'>('creatives');
  const tab = HOW_TABS.find(t => t.id === active)!;

  return (
    <section className="py-20 md:py-28 bg-slate-50">
      <div className="container mx-auto px-4">
        <Reveal className="text-center mb-12 max-w-3xl mx-auto">
          <span className="eyebrow mb-5">How It Works</span>
          <h2 className="text-4xl md:text-5xl font-semibold mb-5 leading-[1.1]">
            A process built for creatives and the brands that need them.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Whether you're a creative professional or a growing business, our process is designed to deliver results at every step.
          </p>
        </Reveal>

        {/* Audience toggle */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            {HOW_TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setActive(t.id as typeof active)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active === t.id
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Steps grid */}
        <Reveal key={active} className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {tab.steps.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <div key={step.title} className="service-card p-5 flex flex-col gap-3">
                  {/* Top: number + connector (desktop) + icon */}
                  <div className="flex items-center gap-2">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ring-4 flex-shrink-0 ${tab.accent.num}`}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    {/* Connector line (hidden on mobile) */}
                    {i < tab.steps.length - 1 && (
                      <div className={`hidden lg:block flex-1 h-px ${tab.accent.line}`} />
                    )}
                  </div>
                  <div className={`p-2 rounded-lg self-start ${tab.accent.icon}`}>
                    <StepIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm mb-1">{step.title}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Button asChild size="sm" className={`shadow-none gap-1.5 px-6 ${tab.cta.className}`}>
              <Link to={tab.cta.to}>{tab.cta.label}</Link>
            </Button>
            <p className="text-xs text-muted-foreground mt-3">
              <Link to="/how-it-works" className="hover:text-amber-600 underline underline-offset-2">
                See the full process →
              </Link>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

const ServiceCard = ({ icon: Icon, title, description }: {
  icon: React.ElementType,
  title: string,
  description: string
}) => (
  <div className="service-card h-full p-7 flex flex-col">
    <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-6 self-start">
      <Icon className="h-6 w-6 text-amber-700" />
    </div>
    <h3 className="text-xl font-semibold mb-3 leading-tight">{title}</h3>
    <p className="text-muted-foreground leading-relaxed flex-grow">{description}</p>
  </div>
);

const TestimonialCard = ({ 
  quote, 
  name, 
  company,
  image
}: { 
  quote: string;
  name: string;
  company: string;
  image?: string;
}) => (
  <Card className="h-full rounded-2xl border-border/60 shadow-sm hover:shadow-lg transition-shadow duration-300">
    <CardContent className="p-7 flex flex-col h-full">
      <div className="flex-grow">
        <div className="mb-4 text-amber-500">
          <Star className="inline-block h-5 w-5" />
          <Star className="inline-block h-5 w-5" />
          <Star className="inline-block h-5 w-5" />
          <Star className="inline-block h-5 w-5" />
          <Star className="inline-block h-5 w-5" />
        </div>
        <p className="italic mb-6 text-lg">"{quote}"</p>
      </div>
      <div className="flex items-center">
        {image ? (
          <div className="w-12 h-12 rounded-full overflow-hidden bg-amber-100 mr-4">
            <img src={image} alt={name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mr-4">
            <span className="text-amber-500 font-bold text-xl">{name.charAt(0)}</span>
          </div>
        )}
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-muted-foreground">{company}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="hero-ripple" aria-hidden="true" />
        <div className="container mx-auto px-4 py-24 md:py-36 relative">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <span className="eyebrow mb-6 mx-auto">
              <Sparkles className="h-3.5 w-3.5" />
              Africa's Creative Talent Network
            </span>
            <h1 className="display-xl text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold mb-8 text-foreground">
              Where Africa's <em className="not-italic text-primary">creative talent</em> meets opportunity.
            </h1>
            <p className="text-lg md:text-xl mb-10 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              CrémeTalent connects exceptional creative professionals — designers, writers, videographers, developers — with brands building Africa's next chapter.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/talent-pool">
                <Button size="lg" className="shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                  Join the Talent Pool
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/services">
                <Button size="lg" variant="outline" className="border-foreground/20 hover:bg-foreground/5">
                  Find Creative Talent
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Intro Section */}
      <section className="py-20 md:py-28 bg-card">
        <div className="container mx-auto px-4">
          <Reveal className="text-center max-w-3xl mx-auto mb-16">
            <span className="eyebrow mb-5">About CrémeTalent</span>
            <h2 className="text-4xl md:text-5xl font-semibold mb-6 leading-[1.1]">
              Premier talent management for Africa's creative industry.
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              We source, train, and manage exceptional creatives — and pair them with brands ready to invest in the continent's creative future.
            </p>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { value: '500+', label: 'Creatives Placed' },
              { value: '200+', label: 'Client Companies' },
              { value: '50+', label: 'Industries Served' },
              { value: '98%', label: 'Client Satisfaction' },
            ].map((stat, i) => (
              <Reveal key={stat.label} delay={i * 80} className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10">
                <p className="display-xl text-4xl md:text-5xl font-semibold text-amber-700 mb-1">{stat.value}</p>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      
      {/* Talent Spotlight Section */}
      <TalentSpotlight />
      
      {/* Services Section */}
      <section className="py-20 md:py-28 bg-muted/40">
        <div className="container mx-auto px-4">
          <Reveal className="text-center mb-16 max-w-3xl mx-auto">
            <span className="eyebrow mb-5">What We Do</span>
            <h2 className="text-4xl md:text-5xl font-semibold mb-5 leading-[1.1]">
              End-to-end services for creatives and clients.
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              From sourcing and training to long-term career stewardship — comprehensive support at every stage.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCard 
              icon={Briefcase} 
              title="Talent Sourcing & Recruitment" 
              description="Connecting businesses with top-tier creative professionals through our extensive network and rigorous vetting process."
            />
            <ServiceCard 
              icon={GraduationCap} 
              title="Training & Upskilling" 
              description="Providing creatives with the tools, workshops, and resources they need to excel in their careers and stay ahead of industry trends."
            />
            <ServiceCard 
              icon={Users} 
              title="Onboarding" 
              description="Ensuring smooth integration into new roles with comprehensive onboarding processes tailored to both clients and creative professionals."
            />
            <ServiceCard 
              icon={Award} 
              title="Talent Management" 
              description="Ongoing support for sustained success, including career guidance, performance reviews, and development opportunities."
            />
            <ServiceCard 
              icon={FileText} 
              title="HR Services for Creatives" 
              description="Tailored HR solutions for the creative sector, handling contracts, benefits, and administrative requirements."
            />
            <ServiceCard 
              icon={HandHeart} 
              title="Career Development" 
              description="Strategic guidance for career advancement, portfolio development, and long-term professional growth in creative fields."
            />
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 md:py-28 bg-card">
        <div className="container mx-auto px-4">
          <Reveal className="text-center mb-16 max-w-3xl mx-auto">
            <span className="eyebrow mb-5">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-semibold mb-5 leading-[1.1]">
              Trusted by brands and creatives alike.
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Real stories from the people we've connected, trained, and championed.
            </p>
          </Reveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TestimonialCard 
              quote="CrémeTalent connected us with a designer who transformed our brand identity. Their process was seamless and efficient."
              name="Sarah Johnson"
              company="Creative Director, DesignHub"
            />
            <TestimonialCard 
              quote="The quality of talent in their pool is outstanding. We found the perfect video editor for our marketing team within days."
              name="Michael Chen"
              company="Marketing Manager, TechVision"
            />
            <TestimonialCard 
              quote="As a freelance graphic designer, joining CrémeTalent's network has been career-changing. Steady work with great clients!"
              name="Ava Washington"
              company="Independent Designer"
            />
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <HowItWorksSection />
      
      {/* CTA Section */}
      <section className="relative overflow-hidden bg-primary py-20 md:py-24">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-amber-900/15 blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 text-center">
          <Reveal>
            <span className="eyebrow mb-5 mx-auto bg-white/25 border-white/40 text-amber-900">
              <Sparkles className="h-3.5 w-3.5" />
              Get Started
            </span>
            <h2 className="text-4xl md:text-5xl font-semibold text-primary-foreground mb-4 leading-[1.1]">
              Ready to take the next step?
            </h2>
            <p className="text-lg text-primary-foreground/75 max-w-xl mx-auto mb-10 leading-relaxed">
              Join CrémeTalent and be part of a community that connects exceptional creative talent with meaningful opportunities across Africa.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="bg-slate-900 text-white hover:bg-amber-900 shadow-none font-semibold gap-1.5">
                <Link to="/join-talent-pool">
                  Join Our Talent Pool
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent border-slate-900/30 text-primary-foreground hover:bg-slate-900/10 shadow-none font-medium"
              >
                <Link to="/client-intake-form">
                  Request Creative Talent
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

export default Index;
