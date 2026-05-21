import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
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
import type { Course, CourseInsert } from '@/lib/database.types';

const emptyCourse: CourseInsert = {
  title: '', description: '', category: '', duration: '',
  instructor: '', video_url: '', thumbnail_url: '',
  sort_order: 0, is_published: false,
};

const CoursesAdmin = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Course | null>(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<CourseInsert>(emptyCourse);

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses', 'admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const saveM = useMutation({
    mutationFn: async (payload: CourseInsert & { id?: string }) => {
      if (payload.id) {
        const { id, ...update } = payload;
        const { error } = await supabase.from('courses').update(update).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('courses').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({ title: editing ? "Course updated" : "Course created" });
      closeDialog();
    },
    onError: (e: Error) => {
      toast({ title: "Save failed", description: e.message, variant: "destructive" });
    },
  });

  const togglePublishM = useMutation({
    mutationFn: async ({ id, is_published }: { id: string; is_published: boolean }) => {
      const { error } = await supabase.from('courses').update({ is_published }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['courses'] }),
    onError: (e: Error) => toast({ title: "Update failed", description: e.message, variant: "destructive" }),
  });

  const deleteM = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({ title: "Course deleted" });
    },
    onError: (e: Error) => toast({ title: "Delete failed", description: e.message, variant: "destructive" }),
  });

  function openCreate() {
    setEditing(null);
    setDraft(emptyCourse);
    setOpen(true);
  }

  function openEdit(course: Course) {
    setEditing(course);
    setDraft({
      title: course.title,
      description: course.description,
      category: course.category,
      duration: course.duration,
      instructor: course.instructor,
      video_url: course.video_url,
      thumbnail_url: course.thumbnail_url ?? '',
      sort_order: course.sort_order,
      is_published: course.is_published,
    });
    setOpen(true);
  }

  function closeDialog() {
    setOpen(false);
    setEditing(null);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...draft,
      thumbnail_url: draft.thumbnail_url?.trim() ? draft.thumbnail_url : null,
      ...(editing && { id: editing.id }),
    };
    saveM.mutate(payload);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold">Courses</h3>
          <p className="text-sm text-muted-foreground">Manage free training courses</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add course
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map(i => <Skeleton key={i} className="h-16 w-full" />)}
        </div>
      ) : !courses || courses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-md shadow text-muted-foreground">
          No courses yet. Click "Add course" to create one.
        </div>
      ) : (
        <div className="bg-white rounded-md shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {courses.map(course => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium">{course.title}</div>
                    <a href={course.video_url} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-700 hover:underline inline-flex items-center gap-1">
                      Video <ExternalLink className="h-3 w-3" />
                    </a>
                  </td>
                  <td className="px-4 py-3 text-sm">{course.category}</td>
                  <td className="px-4 py-3 text-sm">{course.instructor}</td>
                  <td className="px-4 py-3 text-sm">{course.sort_order}</td>
                  <td className="px-4 py-3">
                    <Switch
                      checked={course.is_published}
                      onCheckedChange={(checked) => togglePublishM.mutate({ id: course.id, is_published: checked })}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(course)}>
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
                            <AlertDialogTitle>Delete this course?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This permanently removes <strong>{course.title}</strong>. This cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => deleteM.mutate(course.id)}
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit course' : 'Add course'}</DialogTitle>
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
                <Label htmlFor="category">Category</Label>
                <Input id="category" required placeholder="Design, Video, Writing…" value={draft.category}
                  onChange={e => setDraft({ ...draft, category: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input id="duration" required placeholder="6 hours" value={draft.duration}
                  onChange={e => setDraft({ ...draft, duration: e.target.value })} />
              </div>
            </div>
            <div>
              <Label htmlFor="instructor">Instructor</Label>
              <Input id="instructor" required value={draft.instructor}
                onChange={e => setDraft({ ...draft, instructor: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="video_url">Video URL (YouTube or Vimeo)</Label>
              <Input id="video_url" required type="url" placeholder="https://youtube.com/watch?v=..." value={draft.video_url}
                onChange={e => setDraft({ ...draft, video_url: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="thumbnail_url">Thumbnail URL <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <Input id="thumbnail_url" type="url" placeholder="https://..." value={draft.thumbnail_url ?? ''}
                onChange={e => setDraft({ ...draft, thumbnail_url: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4 items-end">
              <div>
                <Label htmlFor="sort_order">Sort order</Label>
                <Input id="sort_order" type="number" value={draft.sort_order ?? 0}
                  onChange={e => setDraft({ ...draft, sort_order: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="flex items-center gap-2 pb-2">
                <Switch id="is_published" checked={draft.is_published ?? false}
                  onCheckedChange={checked => setDraft({ ...draft, is_published: checked })} />
                <Label htmlFor="is_published" className="cursor-pointer">Published</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
              <Button type="submit" disabled={saveM.isPending}>
                {saveM.isPending ? 'Saving…' : (editing ? 'Save changes' : 'Create course')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoursesAdmin;
