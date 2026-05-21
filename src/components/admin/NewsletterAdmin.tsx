import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
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
import { Trash2, Download, Users2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { NewsletterSubscriber } from '@/lib/database.types';
import { format } from 'date-fns';

const NewsletterAdmin = () => {
  const queryClient = useQueryClient();

  const { data: subscribers = [], isLoading } = useQuery({
    queryKey: ['newsletter_subscribers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as NewsletterSubscriber[];
    },
  });

  const toggleM = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({ is_active })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['newsletter_subscribers'] }),
    onError: (e: Error) => toast({ title: "Update failed", description: e.message, variant: "destructive" }),
  });

  const deleteM = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('newsletter_subscribers').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletter_subscribers'] });
      toast({ title: "Subscriber removed" });
    },
    onError: (e: Error) => toast({ title: "Delete failed", description: e.message, variant: "destructive" }),
  });

  function exportCsv() {
    const active = subscribers.filter(s => s.is_active);
    const rows = ['email,name,source,subscribed_at', ...active.map(s =>
      [s.email, s.name ?? '', s.source, s.created_at].map(v => `"${v}"`).join(',')
    )];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const activeCount = subscribers.filter(s => s.is_active).length;

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users2 className="h-5 w-5 text-slate-500" />
          <span className="font-semibold text-slate-800">Newsletter Subscribers</span>
          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
            {activeCount} active
          </Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={exportCsv}
          disabled={activeCount === 0}
          className="gap-1.5"
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </Button>
      </div>

      {subscribers.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Users2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No subscribers yet.</p>
        </div>
      ) : (
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Source</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Subscribed</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Active</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subscribers.map(sub => (
                <tr key={sub.id} className={sub.is_active ? '' : 'opacity-40'}>
                  <td className="px-4 py-3 text-slate-800 font-medium">{sub.email}</td>
                  <td className="px-4 py-3 text-slate-500 hidden sm:table-cell capitalize">{sub.source}</td>
                  <td className="px-4 py-3 text-slate-500 hidden md:table-cell">
                    {format(new Date(sub.created_at), 'MMM d, yyyy')}
                  </td>
                  <td className="px-4 py-3">
                    <Switch
                      checked={sub.is_active}
                      onCheckedChange={checked => toggleM.mutate({ id: sub.id, is_active: checked })}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-rose-500">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove subscriber?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete <strong>{sub.email}</strong> from the list.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteM.mutate(sub.id)}
                            className="bg-rose-600 hover:bg-rose-700"
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default NewsletterAdmin;
