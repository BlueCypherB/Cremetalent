import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import type { ClientAccount, JobListing } from '@/lib/database.types';
import PostJobForm from '@/components/client/PostJobForm';
import { LogOut, Briefcase, PlusCircle, Settings, MapPin, Clock, Globe } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const STATUS_STYLES: Record<string, string> = {
  draft:  'bg-slate-100 text-slate-600 border-slate-200',
  open:   'bg-emerald-50 text-emerald-700 border-emerald-200',
  closed: 'bg-rose-50 text-rose-700 border-rose-200',
};

const ENGAGEMENT_LABELS: Record<string, string> = {
  'project':   'Project-based',
  'part-time': 'Part-time',
  'full-time': 'Full-time',
  'retainer':  'Monthly retainer',
};

const ClientDashboard = () => {
  const { user, signOut } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('postings');
  const [settingsEdit, setSettingsEdit] = useState<Partial<ClientAccount>>({});
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const { data: account, isLoading: accountLoading } = useQuery({
    queryKey: ['client_account', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_accounts')
        .select('*')
        .eq('id', user!.id)
        .single();
      if (error) throw error;
      return data as ClientAccount;
    },
  });

  const { data: listings = [], isLoading: listingsLoading } = useQuery({
    queryKey: ['job_listings', 'client', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_listings')
        .select('*')
        .eq('client_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as JobListing[];
    },
  });

  const effectiveSettings = Object.keys(settingsEdit).length > 0 ? settingsEdit : account ?? {};

  const publishM = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('job_listings')
        .update({ status: 'open', published_at: new Date().toISOString() })
        .eq('id', id)
        .eq('client_id', user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job_listings', 'client', user?.id] });
      toast({ title: "Job published", description: "Your listing is now live on the public job board." });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const closeM = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('job_listings')
        .update({ status: 'closed' })
        .eq('id', id)
        .eq('client_id', user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job_listings', 'client', user?.id] });
      toast({ title: "Job closed" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !account) return;
    setIsSavingSettings(true);
    const { error } = await supabase
      .from('client_accounts')
      .update({
        full_name:    String(effectiveSettings.full_name    ?? account.full_name),
        company_name: String(effectiveSettings.company_name ?? account.company_name),
        phone:        String(effectiveSettings.phone        ?? account.phone ?? ''),
        website:      String(effectiveSettings.website      ?? account.website ?? ''),
        industry:     String(effectiveSettings.industry     ?? account.industry ?? ''),
      })
      .eq('id', user.id);
    setIsSavingSettings(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      queryClient.invalidateQueries({ queryKey: ['client_account', user.id] });
      toast({ title: "Settings saved" });
    }
  }

  if (accountLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-12">
          <Skeleton className="h-12 w-1/3 mb-8" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-semibold mb-2">Account not found</h2>
          <p className="text-slate-500 mb-4">Could not load your client account. Please sign in again.</p>
          <Button onClick={signOut}>Sign out</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const draftCount = listings.filter(l => l.status === 'draft').length;
  const openCount  = listings.filter(l => l.status === 'open').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="flex-grow">
        {/* Header */}
        <div className="bg-white border-b border-slate-200">
          <div className="container mx-auto px-4 py-6 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {account.company_name || account.full_name}
              </h1>
              <p className="text-sm text-slate-500 mt-1">{account.email}</p>
              {account.website && (
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <Globe className="h-3 w-3" />
                  <a href={account.website} target="_blank" rel="noopener noreferrer" className="hover:text-amber-700">
                    {account.website.replace(/^https?:\/\//, '')}
                  </a>
                </p>
              )}
              {account.industry && (
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3 w-3" />{account.industry}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {openCount > 0 && (
                <span className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {openCount} live listing{openCount !== 1 ? 's' : ''}
                </span>
              )}
              <Button variant="ghost" size="sm" onClick={signOut} className="gap-1.5 text-slate-500">
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6 overflow-hidden">
              <TabsList className="w-full h-auto p-0 bg-transparent border-b border-slate-100 rounded-none flex">
                {[
                  { value: 'postings', label: 'My Job Listings', icon: Briefcase, count: listings.length },
                  { value: 'post',     label: 'Post a Job',       icon: PlusCircle },
                  { value: 'settings', label: 'Account Settings', icon: Settings },
                ].map(({ value, label, icon: Icon, count }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className="flex-1 sm:flex-none flex items-center gap-2 px-5 py-3.5 text-sm font-medium text-slate-500 rounded-none border-b-2 border-transparent data-[state=active]:border-amber-500 data-[state=active]:text-amber-700 data-[state=active]:bg-amber-50/50 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{label}</span>
                    {count != null && count > 0 && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 leading-none">
                        {count}
                      </span>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* My Job Listings */}
            <TabsContent value="postings" className="mt-0">
              {listingsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
                </div>
              ) : listings.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm py-16 text-center">
                  <Briefcase className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm font-medium mb-1">No job listings yet</p>
                  <p className="text-slate-400 text-xs mb-4">Click "Post a Job" to create your first listing.</p>
                  <Button size="sm" onClick={() => setActiveTab('post')} className="gap-1.5">
                    <PlusCircle className="h-3.5 w-3.5" /> Post a Job
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {listings.map(listing => (
                    <Card key={listing.id} className="border-slate-200 shadow-sm rounded-xl">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-slate-900 text-sm truncate">{listing.title}</h3>
                              <span className={`flex-shrink-0 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border ${STATUS_STYLES[listing.status] ?? STATUS_STYLES.draft}`}>
                                {listing.status}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-500">
                              <span>{listing.specialization}</span>
                              <span>·</span>
                              <span>{ENGAGEMENT_LABELS[listing.engagement_type] ?? listing.engagement_type}</span>
                              {listing.location && (
                                <>
                                  <span>·</span>
                                  <span>{listing.location}{listing.is_remote ? ' (Remote)' : ''}</span>
                                </>
                              )}
                              {listing.is_remote && !listing.location && <span>Remote</span>}
                              {listing.deadline && (
                                <>
                                  <span>·</span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    Deadline {new Date(listing.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                  </span>
                                </>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-1">
                              Created {new Date(listing.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {listing.status === 'draft' && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-xs gap-1.5"
                                onClick={() => publishM.mutate(listing.id)}
                                disabled={publishM.isPending}
                              >
                                Publish
                              </Button>
                            )}
                            {listing.status === 'open' && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5">
                                    Close
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Close this job listing?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will remove the listing from the public job board.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => closeM.mutate(listing.id)}>
                                      Close listing
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              {draftCount > 0 && (
                <p className="text-xs text-slate-400 text-center mt-4">
                  {draftCount} draft{draftCount !== 1 ? 's' : ''} — click Publish to make them live.
                </p>
              )}
            </TabsContent>

            {/* Post a Job */}
            <TabsContent value="post" className="mt-0">
              <Card className="border-slate-200 shadow-sm rounded-xl">
                <CardHeader>
                  <CardTitle className="text-lg">Post a New Job</CardTitle>
                  <p className="text-sm text-slate-500">
                    Drafts are saved immediately. Click Publish from My Job Listings to go live.
                  </p>
                </CardHeader>
                <CardContent>
                  <PostJobForm
                    defaultCompanyName={account.company_name}
                    onSuccess={() => setActiveTab('postings')}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Account Settings */}
            <TabsContent value="settings" className="mt-0">
              <Card className="border-slate-200 shadow-sm rounded-xl">
                <CardHeader>
                  <CardTitle className="text-lg">Account Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveSettings} className="space-y-5 max-w-lg">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={String(effectiveSettings.full_name ?? '')}
                        onChange={e => setSettingsEdit(prev => ({ ...prev, full_name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company_name">Company Name</Label>
                      <Input
                        id="company_name"
                        value={String(effectiveSettings.company_name ?? '')}
                        onChange={e => setSettingsEdit(prev => ({ ...prev, company_name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={String(effectiveSettings.phone ?? '')}
                        onChange={e => setSettingsEdit(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        type="url"
                        placeholder="https://yourcompany.com"
                        value={String(effectiveSettings.website ?? '')}
                        onChange={e => setSettingsEdit(prev => ({ ...prev, website: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Input
                        id="industry"
                        placeholder="e.g. Technology, Media, Healthcare…"
                        value={String(effectiveSettings.industry ?? '')}
                        onChange={e => setSettingsEdit(prev => ({ ...prev, industry: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input value={account.email} disabled className="bg-slate-50 text-slate-500" />
                      <p className="text-xs text-slate-400">Email cannot be changed here.</p>
                    </div>
                    <Button type="submit" disabled={isSavingSettings}>
                      {isSavingSettings ? 'Saving…' : 'Save changes'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ClientDashboard;
