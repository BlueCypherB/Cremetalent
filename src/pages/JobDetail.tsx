import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getJobById } from '@/services/clientService';
import { ArrowLeft, MapPin, Briefcase, Clock, Users, ExternalLink } from 'lucide-react';

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: job, isLoading, isError } = useQuery({
    queryKey: ['job_listing', id],
    enabled: !!id,
    queryFn: () => getJobById(id!),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-12 max-w-3xl">
          <Skeleton className="h-6 w-24 mb-6" />
          <Skeleton className="h-10 w-2/3 mb-4" />
          <Skeleton className="h-5 w-1/3 mb-8" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
        <Footer />
      </div>
    );
  }

  if (isError || !job || job.status !== 'open') {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-16 text-center">
          <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Job not found</h2>
          <p className="text-slate-500 mb-6">This listing may have been closed or removed.</p>
          <Button asChild variant="outline">
            <Link to="/jobs">← Back to jobs</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const companyName = job.client_accounts?.company_name;
  const companyWebsite = job.client_accounts?.website;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow bg-slate-50">
        <div className="container mx-auto px-4 py-10 max-w-4xl">
          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-amber-700 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to jobs
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    {job.specialization}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    {job.engagement_type}
                  </span>
                  {job.is_remote && (
                    <span className="text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Remote
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">{job.title}</h1>
                {companyName && (
                  <p className="text-lg text-slate-600 font-medium mb-3">
                    {companyWebsite ? (
                      <a href={companyWebsite} target="_blank" rel="noopener noreferrer" className="hover:text-amber-700 transition-colors">
                        {companyName}
                      </a>
                    ) : companyName}
                  </p>
                )}
                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                  {job.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />{job.location}
                    </span>
                  )}
                  {job.experience_level && (
                    <span className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />{job.experience_level}
                    </span>
                  )}
                  {job.deadline && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      Apply by {new Date(job.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-base font-semibold text-slate-900 mb-3">About the Role</h2>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Apply CTA */}
              <div className="bg-amber-700 rounded-2xl p-5 text-white">
                <h3 className="font-bold text-base mb-2">Interested in this role?</h3>
                <p className="text-xs text-amber-100 leading-relaxed mb-4">
                  Submit your brief through our client intake form to get matched with this opportunity, or reach out directly.
                </p>
                <Button
                  asChild
                  size="sm"
                  className="bg-white text-amber-800 hover:bg-amber-50 shadow-none w-full text-xs font-semibold gap-1.5"
                >
                  <Link to="/client-intake-form">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Get in touch
                  </Link>
                </Button>
              </div>

              {/* Job details summary */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h3 className="font-semibold text-slate-900 text-sm mb-4">Job Details</h3>
                <dl className="space-y-3 text-xs">
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Engagement type</dt>
                    <dd className="font-medium text-slate-700 capitalize">{job.engagement_type}</dd>
                  </div>
                  {job.experience_level && (
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Experience level</dt>
                      <dd className="font-medium text-slate-700">{job.experience_level}</dd>
                    </div>
                  )}
                  {job.location && (
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Location</dt>
                      <dd className="font-medium text-slate-700">{job.location}</dd>
                    </div>
                  )}
                  {job.budget_range && (
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Compensation</dt>
                      <dd className="font-medium text-slate-700">{job.budget_range}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Posted</dt>
                    <dd className="font-medium text-slate-700">
                      {new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Browse more */}
              <Button asChild variant="outline" size="sm" className="w-full gap-1.5">
                <Link to="/jobs">
                  <Briefcase className="h-3.5 w-3.5" />
                  Browse all jobs
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JobDetail;
