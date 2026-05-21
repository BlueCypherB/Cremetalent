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
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { BlogPost } from '@/lib/database.types';

type BlogPostInsert = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category: string;
  author_name: string;
  read_time: string;
  image_url: string;
  is_featured: boolean;
  is_published: boolean;
  published_at: string | null;
};

const emptyPost: BlogPostInsert = {
  title: '', slug: '', excerpt: '', body: '',
  category: '', author_name: '', read_time: '',
  image_url: '', is_featured: false, is_published: false,
  published_at: null,
};

const toSlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const BlogAdmin = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<BlogPostInsert>(emptyPost);

  const { data: posts, isLoading } = useQuery({
    queryKey: ['blog_posts', 'admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as BlogPost[];
    },
  });

  const saveM = useMutation({
    mutationFn: async (payload: BlogPostInsert & { id?: string }) => {
      const { id, ...fields } = payload;
      const data = {
        ...fields,
        image_url: fields.image_url?.trim() || null,
        read_time: fields.read_time?.trim() || null,
        published_at: fields.is_published && !fields.published_at
          ? new Date().toISOString()
          : fields.published_at || null,
      };
      if (id) {
        const { error } = await supabase.from('blog_posts').update(data).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('blog_posts').insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog_posts'] });
      toast({ title: editing ? 'Post updated' : 'Post created' });
      closeDialog();
    },
    onError: (e: Error) => toast({ title: 'Save failed', description: e.message, variant: 'destructive' }),
  });

  const togglePublishM = useMutation({
    mutationFn: async ({ id, is_published }: { id: string; is_published: boolean }) => {
      const { error } = await supabase.from('blog_posts').update({
        is_published,
        published_at: is_published ? new Date().toISOString() : null,
      }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blog_posts'] }),
    onError: (e: Error) => toast({ title: 'Update failed', description: e.message, variant: 'destructive' }),
  });

  const deleteM = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog_posts'] });
      toast({ title: 'Post deleted' });
    },
    onError: (e: Error) => toast({ title: 'Delete failed', description: e.message, variant: 'destructive' }),
  });

  function openCreate() {
    setEditing(null);
    setDraft(emptyPost);
    setOpen(true);
  }

  function openEdit(post: BlogPost) {
    setEditing(post);
    setDraft({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      body: post.body ?? '',
      category: post.category,
      author_name: post.author_name,
      read_time: post.read_time ?? '',
      image_url: post.image_url ?? '',
      is_featured: post.is_featured,
      is_published: post.is_published,
      published_at: post.published_at,
    });
    setOpen(true);
  }

  function closeDialog() {
    setOpen(false);
    setEditing(null);
  }

  function handleTitleChange(title: string) {
    setDraft(prev => ({
      ...prev,
      title,
      slug: editing ? prev.slug : toSlug(title),
    }));
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    saveM.mutate({ ...draft, ...(editing && { id: editing.id }) });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold">Blog Posts</h3>
          <p className="text-sm text-muted-foreground">Manage articles and insights</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          New post
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map(i => <Skeleton key={i} className="h-16 w-full" />)}
        </div>
      ) : !posts || posts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-md shadow text-muted-foreground">
          No posts yet. Click "New post" to create one.
        </div>
      ) : (
        <div className="bg-white rounded-md shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium">{post.title}</div>
                    <div className="text-xs text-muted-foreground">/blog/{post.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-sm">{post.category}</td>
                  <td className="px-4 py-3 text-sm">{post.author_name}</td>
                  <td className="px-4 py-3">
                    {post.is_featured && <Badge variant="secondary">Featured</Badge>}
                  </td>
                  <td className="px-4 py-3">
                    <Switch
                      checked={post.is_published}
                      onCheckedChange={(checked) => togglePublishM.mutate({ id: post.id, is_published: checked })}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(post)}>
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
                            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This permanently removes <strong>{post.title}</strong>. This cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => deleteM.mutate(post.id)}
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
            <DialogTitle>{editing ? 'Edit post' : 'New post'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" required value={draft.title}
                onChange={e => handleTitleChange(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="slug">Slug <span className="text-muted-foreground font-normal">(URL path)</span></Label>
              <Input id="slug" required value={draft.slug}
                onChange={e => setDraft({ ...draft, slug: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea id="excerpt" required rows={2} value={draft.excerpt}
                onChange={e => setDraft({ ...draft, excerpt: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="body">Body <span className="text-muted-foreground font-normal">(HTML)</span></Label>
              <Textarea id="body" rows={8} value={draft.body}
                onChange={e => setDraft({ ...draft, body: e.target.value })}
                placeholder="<p>Start writing your article...</p>" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Input id="category" required value={draft.category}
                  onChange={e => setDraft({ ...draft, category: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="author_name">Author</Label>
                <Input id="author_name" required value={draft.author_name}
                  onChange={e => setDraft({ ...draft, author_name: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="read_time">Read time <span className="text-muted-foreground font-normal">(e.g. "5 min read")</span></Label>
                <Input id="read_time" value={draft.read_time}
                  onChange={e => setDraft({ ...draft, read_time: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="image_url">Cover image URL <span className="text-muted-foreground font-normal">(optional)</span></Label>
                <Input id="image_url" type="url" placeholder="https://..." value={draft.image_url}
                  onChange={e => setDraft({ ...draft, image_url: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-2">
                <Switch id="is_featured" checked={draft.is_featured}
                  onCheckedChange={checked => setDraft({ ...draft, is_featured: checked })} />
                <Label htmlFor="is_featured" className="cursor-pointer">Featured</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="is_published" checked={draft.is_published}
                  onCheckedChange={checked => setDraft({ ...draft, is_published: checked })} />
                <Label htmlFor="is_published" className="cursor-pointer">Published</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
              <Button type="submit" disabled={saveM.isPending}>
                {saveM.isPending ? 'Saving…' : (editing ? 'Save changes' : 'Create post')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogAdmin;
