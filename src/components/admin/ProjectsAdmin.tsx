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
import { Pencil, Trash2, FolderKanban } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Project, ProjectInsert } from '@/lib/database.types';
import { format } from 'date-fns';

type ProjectForm = {
  title: string;
  creator_name: string;
  category: string;
  short_description: string;
  full_description: string;
  goal_amount: string;
  duration_days: string;
  image_url: string;
};

const EMPTY_FORM: ProjectForm = {
  title: '',
  creator_name: '',
  category: '',
  short_description: '',
  full_description: '',
  goal_amount: '',
  duration_days: '30',
  image_url: '',
};

const CATEGORIES = [
  'Education', 'Arts', 'Technology', 'Community',
  'Environment', 'Healthcare', 'Film', 'Music', 'Publishing', 'Other',
];

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const ProjectsAdmin = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form, setForm] = useState<ProjectForm>(EMPTY_FORM);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects_admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Project[];
    },
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['projects_admin'] });
    queryClient.invalidateQueries({ queryKey: ['projects'] });
  };

  const togglePublishM = useMutation({
    mutationFn: async ({ id, is_published, title, slug }: { id: string; is_published: boolean; title: string; slug: string | null }) => {
      const update: Partial<Project> = { is_published };
      if (is_published && !slug) update.slug = slugify(title);
      const { error } = await supabase.from('projects').update(update).eq('id', id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: (e: Error) => toast({ title: "Update failed", description: e.message, variant: "destructive" }),
  });

  const toggleFeaturedM = useMutation({
    mutationFn: async ({ id, is_featured }: { id: string; is_featured: boolean }) => {
      const { error } = await supabase.from('projects').update({ is_featured }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: (e: Error) => toast({ title: "Update failed", description: e.message, variant: "destructive" }),
  });

  const saveM = useMutation({
    mutationFn: async (payload: { id?: string; data: ProjectInsert }) => {
      if (payload.id) {
        const { error } = await supabase.from('projects').update(payload.data).eq('id', payload.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('projects').insert(payload.data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      invalidate();
      setDialogOpen(false);
      toast({ title: editingProject ? "Project updated" : "Project created" });
    },
    onError: (e: Error) => toast({ title: "Save failed", description: e.message, variant: "destructive" }),
  });

  const deleteM = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast({ title: "Project deleted" });
    },
    onError: (e: Error) => toast({ title: "Delete failed", description: e.message, variant: "destructive" }),
  });

  function openEdit(project: Project) {
    setEditingProject(project);
    setForm({
      title: project.title,
      creator_name: project.creator_name,
      category: project.category,
      short_description: project.short_description,
      full_description: project.full_description,
      goal_amount: String(project.goal_amount),
      duration_days: String(project.duration_days),
      image_url: project.image_url ?? '',
    });
    setDialogOpen(true);
  }

  function openCreate() {
    setEditingProject(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }

  function handleSave() {
    const goal = parseFloat(form.goal_amount);
    const duration = parseInt(form.duration_days);
    if (!form.title || !form.creator_name || !form.category || !form.short_description || !form.full_description) {
      toast({ title: "All fields required", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    if (isNaN(goal) || goal <= 0) {
      toast({ title: "Invalid goal", description: "Enter a positive goal amount.", variant: "destructive" });
      return;
    }
    if (isNaN(duration) || duration < 7 || duration > 90) {
      toast({ title: "Invalid duration", description: "Duration must be 7–90 days.", variant: "destructive" });
      return;
    }
    const data: ProjectInsert = {
      title: form.title,
      creator_name: form.creator_name,
      category: form.category,
      short_description: form.short_description,
      full_description: form.full_description,
      goal_amount: goal,
      duration_days: duration,
      image_url: form.image_url || null,
      slug: slugify(form.title),
    };
    saveM.mutate({ id: editingProject?.id, data });
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FolderKanban className="h-5 w-5 text-slate-500" />
          <span className="font-semibold text-slate-800">Projects</span>
          <Badge className="bg-slate-100 text-slate-600 border-slate-200">
            {projects.length} total
          </Badge>
          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
            {projects.filter(p => p.is_published).length} live
          </Badge>
        </div>
        <Button size="sm" onClick={openCreate} className="gap-1.5">
          + Add project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <FolderKanban className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No projects yet. Create one or submit via the public form.</p>
        </div>
      ) : (
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Title</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Creator</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Goal</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Published</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Featured</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Submitted</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.map(project => (
                <tr key={project.id} className={project.is_published ? '' : 'opacity-60'}>
                  <td className="px-4 py-3 font-medium text-slate-800 max-w-[180px] truncate">{project.title}</td>
                  <td className="px-4 py-3 text-slate-500 hidden md:table-cell">{project.creator_name}</td>
                  <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">{project.category}</td>
                  <td className="px-4 py-3 text-slate-500 hidden lg:table-cell">₦{project.goal_amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <Switch
                      checked={project.is_published}
                      onCheckedChange={checked =>
                        togglePublishM.mutate({ id: project.id, is_published: checked, title: project.title, slug: project.slug })
                      }
                    />
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <Switch
                      checked={project.is_featured}
                      onCheckedChange={checked => toggleFeaturedM.mutate({ id: project.id, is_featured: checked })}
                    />
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs hidden lg:table-cell">
                    {format(new Date(project.created_at), 'MMM d, yyyy')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-700" onClick={() => openEdit(project)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-rose-500">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete project?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete <strong>{project.title}</strong>. This cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteM.mutate(project.id)}
                              className="bg-rose-600 hover:bg-rose-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProject ? 'Edit project' : 'Add project'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label>Title *</Label>
                <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Project title" />
              </div>
              <div>
                <Label>Creator / Organisation *</Label>
                <Input value={form.creator_name} onChange={e => setForm({ ...form, creator_name: e.target.value })} placeholder="Name" />
              </div>
              <div>
                <Label>Category *</Label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <Label>Goal amount (₦) *</Label>
                <Input type="number" min="1" value={form.goal_amount} onChange={e => setForm({ ...form, goal_amount: e.target.value })} placeholder="50000" />
              </div>
              <div>
                <Label>Duration (days, 7–90) *</Label>
                <Input type="number" min="7" max="90" value={form.duration_days} onChange={e => setForm({ ...form, duration_days: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Label>Short description * <span className="text-slate-400 font-normal">(max 200 chars)</span></Label>
                <Textarea
                  rows={2}
                  value={form.short_description}
                  onChange={e => setForm({ ...form, short_description: e.target.value })}
                  className="resize-none"
                  maxLength={200}
                />
              </div>
              <div className="sm:col-span-2">
                <Label>Full description *</Label>
                <Textarea
                  rows={5}
                  value={form.full_description}
                  onChange={e => setForm({ ...form, full_description: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <Label>Image URL <span className="text-slate-400 font-normal">(optional)</span></Label>
                <Input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://…" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saveM.isPending}>
              {saveM.isPending ? "Saving…" : "Save project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectsAdmin;
