import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from '@/lib/supabase';
import type { BlogPost as BlogPostType } from '@/lib/database.types';
import { Calendar, Clock, User, Tag, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog_post', slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug!)
        .eq('is_published', true)
        .single();
      if (error) throw error;
      return data as BlogPostType;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-16 max-w-3xl">
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/2 mb-8" />
          <Skeleton className="h-64 w-full mb-6" />
          <div className="space-y-3">
            {[0, 1, 2, 3, 4].map(i => <Skeleton key={i} className="h-4 w-full" />)}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-24 max-w-3xl text-center">
          <h1 className="text-3xl font-semibold mb-4">Article not found</h1>
          <p className="text-muted-foreground mb-8">This article may have been removed or the link is incorrect.</p>
          <Button asChild variant="outline">
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero */}
        {post.image_url && (
          <div className="w-full h-72 md:h-96 overflow-hidden">
            <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        <article className="container mx-auto px-4 py-12 max-w-3xl">
          <Button asChild variant="ghost" className="mb-8 -ml-2 text-muted-foreground">
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              All articles
            </Link>
          </Button>

          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-amber-700 font-medium">
              <Tag className="h-3 w-3" />
              {post.category}
            </span>
            {post.published_at && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {format(new Date(post.published_at), 'MMMM d, yyyy')}
              </span>
            )}
            {post.read_time && (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {post.read_time}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {post.author_name}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-semibold leading-tight mb-6">{post.title}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-10 border-l-4 border-primary/40 pl-4 italic">
            {post.excerpt}
          </p>

          {post.body ? (
            <div
              className="prose prose-amber max-w-none prose-headings:font-semibold prose-a:text-amber-700"
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
          ) : (
            <p className="text-muted-foreground italic">Full article content coming soon.</p>
          )}

          <div className="mt-16 pt-8 border-t flex items-center justify-between flex-wrap gap-4">
            <Button asChild variant="outline">
              <Link to="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
            <Button asChild>
              <Link to="/join-talent-pool">Join our talent pool</Link>
            </Button>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
