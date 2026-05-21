import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import PendingTalentList from '@/components/admin/PendingTalentList';
import AdminDashboardStats from '@/components/admin/AdminDashboardStats';
import ApprovedTalentList from '@/components/admin/ApprovedTalentList';
import RejectedTalentList from '@/components/admin/RejectedTalentList';
import CoursesAdmin from '@/components/admin/CoursesAdmin';
import WebinarsAdmin from '@/components/admin/WebinarsAdmin';
import BlogAdmin from '@/components/admin/BlogAdmin';
import NewsletterAdmin from '@/components/admin/NewsletterAdmin';
import ProjectsAdmin from '@/components/admin/ProjectsAdmin';
import JobPostingsAdmin from '@/components/admin/JobPostingsAdmin';
import ClientsAdmin from '@/components/admin/ClientsAdmin';
import InquiryDetailSheet from '@/components/admin/InquiryDetailSheet';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { approveTalent, rejectTalent, deleteTalent, applicationToTalentData } from '@/services/talentService';
import type { TalentData } from '@/types/talent';
import type { TalentApplication, ClientIntakeSubmission } from '@/lib/database.types';
import { Users, CheckSquare, XSquare, MessageSquare, BookOpen, Video, FileText, CalendarDays, Users2, FolderKanban, Briefcase, Building2, Send, ScrollText } from 'lucide-react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('pending');
  const [visitedTabs, setVisitedTabs] = useState<Set<string>>(new Set(['pending']));
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<ClientIntakeSubmission | null>(null);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setVisitedTabs(prev => new Set([...prev, value]));
  };

  const { data: allApplications = [], isLoading: applicationsLoading } = useQuery({
    queryKey: ['talent_applications', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('talent_applications')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as TalentApplication[];
    },
    staleTime: 30_000,
  });

  const pendingRaw = allApplications.filter(a => a.status === 'pending');
  const pendingTalent = pendingRaw.map(applicationToTalentData);
  const approvedTalent = allApplications.filter(a => a.status === 'approved').map(applicationToTalentData);
  const rejectedTalent = allApplications.filter(a => a.status === 'rejected').map(applicationToTalentData);

  const { data: inquiries = [], isLoading: inquiriesLoading } = useQuery({
    queryKey: ['client_intake_submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_intake_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as ClientIntakeSubmission[];
    },
    staleTime: 30_000,
  });

  const approveM = useMutation({
    mutationFn: (talent: TalentData) => approveTalent(talent.id),
    onSuccess: (result, talent) => {
      queryClient.invalidateQueries({ queryKey: ['talent_applications'] });
      if (result.inviteError) {
        toast({
          title: "Approved — invite email failed",
          description: `${talent.name} was approved but the setup email could not be sent: ${result.inviteError}. Use "Resend invite" from the Approved tab.`,
          variant: "destructive",
          duration: 8000,
        });
      } else {
        toast({ title: "Application Approved", description: `${talent.name} has been approved and sent a setup link.` });
      }
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to approve application", variant: "destructive" });
    }
  });

  const rejectM = useMutation({
    mutationFn: ({ talent, reason }: { talent: TalentData; reason: string }) =>
      rejectTalent(talent.id, reason),
    onSuccess: (_, { talent }) => {
      queryClient.invalidateQueries({ queryKey: ['talent_applications'] });
      toast({ title: "Application Rejected", description: `${talent.name}'s application has been rejected.` });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to reject application", variant: "destructive" });
    }
  });

  const deleteM = useMutation({
    mutationFn: (talent: TalentData) => deleteTalent(talent.id),
    onSuccess: (_, talent) => {
      queryClient.invalidateQueries({ queryKey: ['talent_applications'] });
      toast({ title: "Talent Deleted", description: `${talent.name} has been permanently removed.` });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete talent", variant: "destructive" });
    }
  });

  const updateInquiryM = useMutation({
    mutationFn: async ({ id, status, admin_notes }: { id: string; status: 'new' | 'in_review' | 'closed'; admin_notes?: string }) => {
      const { error } = await supabase
        .from('client_intake_submissions')
        .update({ status, ...(admin_notes !== undefined ? { admin_notes } : {}) })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['client_intake_submissions'] }),
    onError: (e: Error) => toast({ title: "Update failed", description: e.message, variant: "destructive" }),
  });

  const handleApproveTalent = (talent: TalentData) => approveM.mutate(talent);
  const handleRejectTalent = (talent: TalentData, reason: string) => rejectM.mutate({ talent, reason });
  const handleDeleteTalent = (talent: TalentData) => deleteM.mutate(talent);

  const { data: clientAccounts = [] } = useQuery({
    queryKey: ['client_accounts', 'admin', 'count'],
    queryFn: async () => {
      const { data, error } = await supabase.from('client_accounts').select('id');
      if (error) throw error;
      return data;
    },
    staleTime: 30_000,
  });

  const inviteClientM = useMutation({
    mutationFn: async (intake_submission_id: string) => {
      const { data, error } = await supabase.functions.invoke('invite-client', {
        body: { intake_submission_id },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client_intake_submissions'] });
      queryClient.invalidateQueries({ queryKey: ['client_accounts'] });
      toast({ title: "Invite sent", description: "Client has been sent a setup link via email." });
    },
    onError: (e: Error) => toast({ title: "Invite failed", description: e.message, variant: "destructive" }),
  });

  const clientsCount = clientAccounts.length;
  const newInquiriesCount = inquiries.filter(i => i.status === 'new').length;

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <AdminLayout>
      {/* Page header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            {today}
          </p>
        </div>
        {pendingTalent.length > 0 && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium px-3 py-1.5 rounded-full">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            {pendingTalent.length} pending application{pendingTalent.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Stats */}
      {applicationsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="h-1 w-full bg-slate-100" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <AdminDashboardStats
          pendingCount={pendingTalent.length}
          approvedCount={approvedTalent.length}
          rejectedCount={rejectedTalent.length}
        />
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6 overflow-hidden">
          <div className="overflow-x-auto scrollbar-none">
          <TabsList className="h-auto p-0 bg-transparent border-b border-slate-100 rounded-none flex min-w-max">
            {[
              { value: 'pending', label: 'Pending', icon: Users, count: pendingTalent.length, urgent: pendingTalent.length > 0 },
              { value: 'approved', label: 'Approved', icon: CheckSquare, count: approvedTalent.length },
              { value: 'rejected', label: 'Rejected', icon: XSquare, count: rejectedTalent.length },
              { value: 'inquiries', label: 'Inquiries', icon: MessageSquare, count: newInquiriesCount, urgent: newInquiriesCount > 0 },
              { value: 'clients', label: 'Clients', icon: Building2, count: clientsCount },
              { value: 'jobs', label: 'Job Listings', icon: Briefcase },
              { value: 'projects', label: 'Projects', icon: FolderKanban },
              { value: 'courses', label: 'Courses', icon: BookOpen },
              { value: 'webinars', label: 'Webinars', icon: Video },
              { value: 'blog', label: 'Blog', icon: FileText },
              { value: 'subscribers', label: 'Subscribers', icon: Users2 },
            ].map(({ value, label, icon: Icon, count, urgent }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="relative flex-shrink-0 flex items-center gap-2 px-5 py-3.5 text-sm font-medium text-slate-500 rounded-none border-b-2 border-transparent data-[state=active]:border-amber-500 data-[state=active]:text-amber-700 data-[state=active]:bg-amber-50/50 hover:text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
                {count != null && count > 0 && (
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none ${
                    urgent
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {count}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          </div>
        </div>

        <TabsContent value="pending" className="mt-0">
          {applicationsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-xl" />)}
            </div>
          ) : (
            <PendingTalentList
              talents={pendingTalent}
              rawApplications={pendingRaw}
              onApprove={handleApproveTalent}
              onReject={handleRejectTalent}
            />
          )}
        </TabsContent>

        <TabsContent value="approved" className="mt-0">
          {applicationsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
            </div>
          ) : (
            <ApprovedTalentList talents={approvedTalent} onDelete={handleDeleteTalent} />
          )}
        </TabsContent>

        <TabsContent value="rejected" className="mt-0">
          {applicationsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
            </div>
          ) : (
            <RejectedTalentList talents={rejectedTalent} onDelete={handleDeleteTalent} />
          )}
        </TabsContent>

        <TabsContent value="inquiries" className="mt-0">
          {inquiriesLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-36 w-full rounded-xl" />)}
            </div>
          ) : inquiries.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm py-16 text-center">
              <MessageSquare className="h-8 w-8 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm font-medium">No client inquiries yet</p>
              <p className="text-slate-400 text-xs mt-1">New submissions will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {inquiries.map(inquiry => (
                <Card key={inquiry.id} className="border-slate-200 shadow-sm rounded-xl">
                  <CardHeader className="pb-3 pt-5 px-5">
                    <div className="flex justify-between items-start gap-4">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-slate-900 text-sm truncate">{inquiry.project_title}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {inquiry.full_name}
                          {inquiry.company_name && <> &middot; {inquiry.company_name}</>}
                          &nbsp;&middot;&nbsp;{inquiry.email}
                        </p>
                      </div>
                      <span className={`flex-shrink-0 text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${
                        inquiry.status === 'new'
                          ? 'bg-amber-100 text-amber-700 border border-amber-200'
                          : inquiry.status === 'in_review'
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {inquiry.status?.replace('_', ' ')}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-5 px-5">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      {[
                        { label: 'Industry', value: inquiry.industry },
                        { label: 'Budget', value: inquiry.budget_range },
                        { label: 'Start', value: inquiry.start_date },
                        { label: 'Location', value: inquiry.location },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-slate-50 rounded-lg px-3 py-2">
                          <p className="text-slate-400 text-[10px] uppercase font-medium tracking-wide mb-0.5">{label}</p>
                          <p className="text-slate-700 font-medium">{value || '—'}</p>
                        </div>
                      ))}
                    </div>
                    {inquiry.description && (
                      <p className="mt-3 text-xs text-slate-500 line-clamp-2 leading-relaxed">{inquiry.description}</p>
                    )}
                    <div className="mt-4 flex items-center gap-2 flex-wrap">
                      <p className="text-[10px] text-slate-400 mr-auto">
                        Submitted {new Date(inquiry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs gap-1.5"
                        onClick={() => setSelectedInquiry(inquiry)}
                      >
                        <ScrollText className="h-3 w-3" />
                        View full brief
                      </Button>
                      {!inquiry.client_account_id ? (
                        <Button
                          size="sm"
                          className="h-7 text-xs gap-1.5 bg-amber-700 hover:bg-amber-800"
                          onClick={() => inviteClientM.mutate(inquiry.id)}
                          disabled={inviteClientM.isPending}
                        >
                          <Send className="h-3 w-3" />
                          Invite to platform
                        </Button>
                      ) : (
                        <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          Client invited
                        </span>
                      )}
                      {inquiry.status === 'new' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => updateInquiryM.mutate({ id: inquiry.id, status: 'in_review' })}
                          disabled={updateInquiryM.isPending}
                        >
                          Start review
                        </Button>
                      )}
                      {inquiry.status === 'in_review' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => updateInquiryM.mutate({ id: inquiry.id, status: 'closed' })}
                          disabled={updateInquiryM.isPending}
                        >
                          Close
                        </Button>
                      )}
                      {inquiry.status === 'closed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => updateInquiryM.mutate({ id: inquiry.id, status: 'new' })}
                          disabled={updateInquiryM.isPending}
                        >
                          Reopen
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs text-slate-500"
                        onClick={() => {
                          if (expandedNoteId === inquiry.id) {
                            setExpandedNoteId(null);
                          } else {
                            setExpandedNoteId(inquiry.id);
                            setNoteText(inquiry.admin_notes ?? '');
                          }
                        }}
                      >
                        {expandedNoteId === inquiry.id ? 'Hide notes' : 'Notes ▾'}
                      </Button>
                    </div>
                    {expandedNoteId === inquiry.id && (
                      <div className="mt-3 space-y-2">
                        <Textarea
                          rows={3}
                          placeholder="Add internal notes…"
                          value={noteText}
                          onChange={e => setNoteText(e.target.value)}
                          className="text-xs resize-none"
                        />
                        <Button
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => {
                            updateInquiryM.mutate(
                              { id: inquiry.id, status: inquiry.status, admin_notes: noteText },
                              { onSuccess: () => setExpandedNoteId(null) }
                            );
                          }}
                          disabled={updateInquiryM.isPending}
                        >
                          {updateInquiryM.isPending ? "Saving…" : "Save note"}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          <InquiryDetailSheet
            inquiry={selectedInquiry}
            onClose={() => setSelectedInquiry(null)}
          />
        </TabsContent>

        <TabsContent value="clients" className="mt-0">
          {visitedTabs.has('clients') && <ClientsAdmin />}
        </TabsContent>

        <TabsContent value="jobs" className="mt-0">
          {visitedTabs.has('jobs') && <JobPostingsAdmin />}
        </TabsContent>

        <TabsContent value="projects" className="mt-0">
          {visitedTabs.has('projects') && <ProjectsAdmin />}
        </TabsContent>

        <TabsContent value="courses" className="mt-0">
          {visitedTabs.has('courses') && <CoursesAdmin />}
        </TabsContent>

        <TabsContent value="webinars" className="mt-0">
          {visitedTabs.has('webinars') && <WebinarsAdmin />}
        </TabsContent>

        <TabsContent value="blog" className="mt-0">
          {visitedTabs.has('blog') && <BlogAdmin />}
        </TabsContent>

        <TabsContent value="subscribers" className="mt-0">
          {visitedTabs.has('subscribers') && <NewsletterAdmin />}
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminDashboard;
