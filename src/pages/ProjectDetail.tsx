import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';
import type { Project } from '@/lib/database.types';
import { HandCoins, Clock, Users, ArrowLeft, Tag } from 'lucide-react';

function daysLeft(createdAt: string, durationDays: number): number {
  const end = new Date(createdAt).getTime() + durationDays * 86400000;
  return Math.max(0, Math.ceil((end - Date.now()) / 86400000));
}

const donationOptions = [10, 25, 50, 100, 250, 500];

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [donationAmount, setDonationAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustomAmount, setIsCustomAmount] = useState(false);

  const { data: project, isLoading, error } = useQuery<Project | null>({
    queryKey: ['project', id],
    enabled: !!id,
    queryFn: async () => {
      // Try slug first (preferred), fall back to UUID
      const { data: bySlug } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', id!)
        .eq('is_published', true)
        .maybeSingle();

      if (bySlug) return bySlug as Project;

      const { data: byId, error: idErr } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id!)
        .eq('is_published', true)
        .maybeSingle();

      if (idErr) throw idErr;
      return (byId as Project) ?? null;
    },
  });

  const handleDonate = () => {
    const amount = isCustomAmount ? Number(customAmount) : donationAmount;
    if (!amount || amount <= 0) {
      toast({ title: "Enter a valid amount", variant: "destructive" });
      return;
    }
    toast({
      title: "Coming soon",
      description: "Online donations will be available shortly. Contact us to contribute.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-10 max-w-5xl">
          <Skeleton className="h-4 w-28 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="aspect-video w-full rounded-2xl" />
              <Skeleton className="h-9 w-3/4" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-40 w-full rounded-xl" />
            </div>
            <Skeleton className="h-80 rounded-2xl" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center px-4">
            <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-5">
              <span className="text-2xl">🔍</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Project not found</h1>
            <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">
              This project may no longer be available or the link is incorrect.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/projects">
                <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
                Browse projects
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const progress = project.goal_amount > 0
    ? Math.min((project.raised_amount / project.goal_amount) * 100, 100)
    : 0;
  const remaining = daysLeft(project.created_at, project.duration_days);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-10 max-w-5xl">
          <Button asChild variant="ghost" size="sm" className="-ml-2 mb-7 text-slate-500 hover:text-slate-800 gap-1">
            <Link to="/projects">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to projects
            </Link>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="aspect-video bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl overflow-hidden relative">
                {project.image_url ? (
                  <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                ) : null}
                <span className="absolute top-4 left-4 inline-flex items-center gap-1 px-3 py-1 bg-white/90 text-amber-800 text-xs font-semibold rounded-full border border-amber-200">
                  <Tag className="h-3 w-3" />
                  {project.category}
                </span>
              </div>

              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">{project.title}</h1>
                <p className="text-sm text-slate-500">by <span className="font-medium text-slate-700">{project.creator_name}</span></p>
              </div>

              <div className="service-card p-6">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">About this project</h2>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{project.full_description}</p>
              </div>
            </div>

            {/* Funding sidebar */}
            <div className="service-card p-6 sticky top-4">
              <div className="mb-5">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-2xl font-bold text-slate-900">
                    ₦{project.raised_amount.toLocaleString()}
                  </span>
                  <span className="text-xs font-medium text-slate-500">{Math.round(progress)}% funded</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1.5">
                  of ₦{project.goal_amount.toLocaleString()} goal
                </p>
              </div>

              <div className="flex gap-4 mb-6 text-sm">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Users className="h-3.5 w-3.5 text-amber-600" />
                  <strong>{project.backers_count}</strong> backers
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Clock className="h-3.5 w-3.5 text-amber-600" />
                  <strong>{remaining}</strong> days left
                </div>
              </div>

              <h3 className="text-sm font-semibold text-slate-700 mb-3">Support this project</h3>

              {!isCustomAmount ? (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {donationOptions.map(amount => (
                    <button
                      key={amount}
                      onClick={() => setDonationAmount(amount)}
                      className={`py-2 rounded-lg text-sm font-semibold border transition-colors ${
                        donationAmount === amount
                          ? 'bg-amber-600 border-amber-600 text-white'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-amber-300'
                      }`}
                    >
                      ₦{amount}
                    </button>
                  ))}
                  <button
                    onClick={() => setIsCustomAmount(true)}
                    className="col-span-3 py-2 rounded-lg text-sm font-medium border border-dashed border-slate-300 text-slate-500 hover:border-amber-400 hover:text-amber-700 transition-colors"
                  >
                    Custom amount
                  </button>
                </div>
              ) : (
                <div className="mb-3">
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                    <span className="px-3 text-slate-400 text-sm">₦</span>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={e => setCustomAmount(e.target.value)}
                      className="flex-1 py-2 pr-3 text-sm outline-none bg-transparent"
                      autoFocus
                    />
                  </div>
                  <button
                    onClick={() => { setIsCustomAmount(false); setCustomAmount(''); }}
                    className="mt-1.5 text-xs text-slate-500 hover:text-amber-700 transition-colors"
                  >
                    Choose preset amount
                  </button>
                </div>
              )}

              <Button
                onClick={handleDonate}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white shadow-none gap-2"
              >
                <HandCoins className="h-4 w-4" />
                Donate Now
              </Button>

              <p className="text-xs text-slate-400 text-center mt-3 leading-relaxed">
                All contributions are handled securely. You'll receive a confirmation by email.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProjectDetail;
