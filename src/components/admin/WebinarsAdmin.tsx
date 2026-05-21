import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Webinar, WebinarInsert } from '@/lib/database.types';

const emptyWebinar: WebinarInsert = {
  title: '', description: '', host: '',
  event_date: '', registration_url: '',
  is_published: false,
};

const toLocalInputValue = (iso: string) => {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const WebinarsAdmin = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Webinar | null>(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<WebinarInsert>(emptyWebinar);

  const { data: webinars, isLoading } = useQuery({
    queryKey: ['webinars', 'admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('webinars')
        .select('*')
        .order('event_date', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const saveM = useMutation({
    mutationFn: async (payload: WebinarInsert & { id?: string }) => {
      const eventDateIso = new Date(payload.event_date).toISOString();
      if (payload.id) {
        const { id, ...update } = payload;
        const { error } = await supabase.from('webinars').update({ ...update, event_date: eventDateIso }).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('webinars').insert({ ...payload, event_date: eventDateIso });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webinars'] });
      toast({ title: editing ? "Webinar updated" : "Webinar created" });
      closeDialog();
    },
    onError: (e: Error) => {
      toast({ title: "Save failed", description: e.message, variant: "destructive" });
    },
  });

  const togglePublishM = useMutation({
    mutationFn: async ({ id, is_published }: { id: string; is_published: boolean }) => {
      const { error } = await supabase.from('webinars').update({ is_published }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['webinars'] }),
    onError: (e: Error) => toast({ title: "Update failed", description: e.message, variant: "destructive" }),
  });

  const deleteM = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('webinars').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webinars'] });
      toast({ title: "Webinar deleted" });
    },
    onError: (e: Error) => toast({ title: "Delete failed", description: e.message, variant: "destructive" }),
  });

  function openCreate() {
    setEditing(null);
    setDraft(emptyWebinar);
    setOpen(true);
  }

  function openEdit(webinar: Webinar) {
    setEditing(webinar);
    setDraft({
      title: webinar.title,
      description: webinar.description,
      host: webinar.host,
      event_date: toLocalInputValue(webinar.event_date),
      registration_url: webinar.registration_url,
      is_published: webinar.is_published,
    });
    setOpen(true);
  }

  function closeDialog() {
    setOpen(false);
    setEditing(null);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    saveM.mutate({ ...draft, ...(editing && { id: editing.id }) });
  }

  const now = new Date();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold">Webinars</h3>
          <p className="text-sm text-muted-foreground">Manage live events and workshops</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add webinar
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1].map(i => <Skeleton key={i} className="h-16 w-full" />)}
        </div>
      ) : !webinars || webinars.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-md shadow text-muted-foreground">
          No webinars yet. Click "Add webinar" to create one.
        </div>
      ) : (
        <div className="bg-white rounded-md shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Host</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {webinars.map(webinar => {
                const isPast = new Date(webinar.event_date) < now;
                return (
                  <tr key={webinar.id} className={`hover:bg-gray-50 ${isPast ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="font-medium">{webinar.title}</div>
                      <a href={webinar.registration_url} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-700 hover:underline inline-flex items-center gap-1">
                        Registration <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                    <td className="px-4 py-3 text-sm">{webinar.host}</td>
                    <td className="px-4 py-3 text-sm">
                      {new Date(webinar.event_date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                    <td className="px-4 py-3">
                      {isPast ? (
                        <Badge variant="outline" className="text-gray-600">Past</Badge>
                      ) : (
                        <Badge>Upcoming</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Switch
                        checked={webinar.is_published}
                        onCheckedChange={(checked) => togglePublishM.mutate({ id: webinar.id, is_published: checked })}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(webinar)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete this webinar?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This permanently removes <strong>{webinar.title}</strong>. This cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={() => deleteM.mutate(webinar.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit webinar' : 'Add webinar'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" required value={draft.title}
                onChange={e => setDraft({ ...draft, title: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" required rows={3} value={draft.description}
                onChange={e => setDraft({ ...draft, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="host">Host</Label>
                <Input id="host" required value={draft.host}
                  onChange={e => setDraft({ ...draft, host: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="event_date">Event date & time</Label>
                <Input id="event_date" type="datetime-local" required value={draft.event_date}
                  onChange={e => setDraft({ ...draft, event_date: e.target.value })} />
              </div>
            </div>
            <div>
              <Label htmlFor="registration_url">Registration URL (Zoom, Eventbrite, Google Forms…)</Label>
              <Input id="registration_url" required type="url" placeholder="https://..." value={draft.registration_url}
                onChange={e => setDraft({ ...draft, registration_url: e.target.value })} />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Switch id="is_published" checked={draft.is_published ?? false}
                onCheckedChange={checked => setDraft({ ...draft, is_published: checked })} />
              <Label htmlFor="is_published" className="cursor-pointer">Published</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
              <Button type="submit" disabled={saveM.isPending}>
                {saveM.isPending ? 'Saving…' : (editing ? 'Save changes' : 'Create webinar')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WebinarsAdmin;
