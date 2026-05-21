import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { JobListing } from '@/lib/database.types';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Briefcase, MapPin, Clock, XCircle, RefreshCw } from 'lucide-react';

type StatusFilter = 'all' | 'open' | 'draft' | 'closed';
type ListingWithClient = JobListing & { client_accounts: { company_name: string } | null };

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-slate-100 text-slate-600 border-slate-200',
  open: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  closed: 'bg-rose-50 text-rose-700 border-rose-200',
};

const JobPostingsAdmin = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('open');

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['job_listings', 'admin', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('job_listings')
        .select('*, client_accounts(company_name)')
        .order('created_at', { ascending: false });
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as unknown as ListingWithClient[];
    },
    staleTime: 30_000,
  });

  const closeM = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('job_listings')
        .update({ status: 'closed' })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job_listings'] });
      toast({ title: "Job listing closed" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const reopenM = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('job_listings')
        .update({ status: 'open', published_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job_listings'] });
      toast({ title: "Job listing reopened" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Select value={statusFilter} onValueChange={v => setStatusFilter(v as StatusFilter)}>
          <SelectTrigger className="w-40 h-9 text-sm border-slate-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Live / Open</SelectItem>
            <SelectItem value="draft">Drafts</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-xs text-slate-500">
          {isLoading ? '…' : `${listings.length} listing${listings.length !== 1 ? 's' : ''}`}
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
        </div>
      ) : listings.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm py-16 text-center">
          <Briefcase className="h-8 w-8 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-medium">No listings in this view</p>
        </div>
      ) : (
        <div className="space-y-3">
          {listings.map(listing => (
            <Card key={listing.id} className="border-slate-200 shadow-sm rounded-xl">
              <CardHeader className="pb-3 pt-5 px-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-slate-900 text-sm">{listing.title}</h3>
                      <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border ${STATUS_STYLES[listing.status]}`}>
                        {listing.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {listing.client_accounts?.company_name ?? '—'}
                      <span className="mx-1">·</span>
                      {listing.specialization}
                      <span className="mx-1">·</span>
                      {listing.engagement_type}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                      {listing.location && (
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{listing.location}{listing.is_remote ? ' (Remote)' : ''}</span>
                      )}
                      {listing.experience_level && <span>{listing.experience_level}</span>}
                      {listing.budget_range && <span>{listing.budget_range}</span>}
                      {listing.deadline && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Deadline {new Date(listing.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="flex-shrink-0 text-[10px] text-slate-400">
                    {new Date(listing.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="pb-5 px-5">
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">{listing.description}</p>
                <div className="flex items-center gap-2">
                  {listing.status === 'open' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs gap-1.5 text-rose-600 border-rose-200 hover:bg-rose-50"
                      onClick={() => closeM.mutate(listing.id)}
                      disabled={closeM.isPending}
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Close listing
                    </Button>
                  )}
                  {listing.status === 'closed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs gap-1.5"
                      onClick={() => reopenM.mutate(listing.id)}
                      disabled={reopenM.isPending}
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Reopen
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobPostingsAdmin;
