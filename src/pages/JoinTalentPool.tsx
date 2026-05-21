import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ApplicationForm from '@/components/talent/ApplicationForm';
import { CheckCircle2, Users, Zap, Globe2, Star } from 'lucide-react';

const BENEFITS = [
  {
    icon: Users,
    title: 'Matched with the right clients',
    description: 'Our team hand-matches you with brands that fit your creative style and expertise.',
  },
  {
    icon: Zap,
    title: 'Flexible opportunities',
    description: 'Freelance, contract, or full-time — find work that fits your schedule.',
  },
  {
    icon: Globe2,
    title: 'Pan-African network',
    description: 'Connect with top brands and creatives across the continent and beyond.',
  },
];

const TRUST_POINTS = [
  '3–5 day review turnaround',
  'No application fee',
  'Personalised support',
  '200+ creatives placed',
];

const JoinTalentPool = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white border-b border-slate-100">
        {/* Decorative amber blobs */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-amber-100 blur-3xl opacity-60" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-64 rounded-full bg-amber-50 blur-2xl opacity-70" />

        <div className="relative container mx-auto px-4 pt-16 pb-14 md:pt-20 md:pb-18">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              Now accepting applications
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-[1.1] tracking-tight mb-4">
              Join the CrémeTalent<br />
              <span className="text-amber-600">Creative Network</span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed max-w-xl mx-auto mb-8">
              Showcase your skills, get matched with exciting brands, and build a career doing what you love.
            </p>

            {/* Trust bar */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {TRUST_POINTS.map(point => (
                <div key={point} className="flex items-center gap-1.5 text-sm text-slate-600">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                  {point}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Main content: form + sidebar ───────────────────────────── */}
      <section className="flex-1 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">

            {/* Form card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7 md:p-9">
              <ApplicationForm />
            </div>

            {/* Sidebar */}
            <div className="space-y-5 lg:sticky lg:top-24">
              {/* Benefits */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <p className="text-xs text-slate-400 uppercase font-semibold tracking-wide mb-4">
                  Why join CrémeTalent?
                </p>
                <div className="space-y-4">
                  {BENEFITS.map(({ icon: Icon, title, description }) => (
                    <div key={title} className="flex gap-3">
                      <div className="h-8 w-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* What happens next */}
              <div className="bg-amber-700 rounded-2xl p-6 text-white">
                <p className="text-xs text-amber-200 uppercase font-semibold tracking-wide mb-4">
                  What happens next?
                </p>
                <div className="space-y-3">
                  {[
                    'Submit your application',
                    'Our team reviews your profile (3–5 days)',
                    'You receive an approval notification',
                    'Get matched with opportunities',
                  ].map((item, i) => (
                    <div key={item} className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-amber-600/60 border border-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold text-amber-100">
                        {i + 1}
                      </div>
                      <p className="text-sm text-amber-100 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default JoinTalentPool;
