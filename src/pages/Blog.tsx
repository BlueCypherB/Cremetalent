import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Reveal } from '@/components/Reveal';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search, Calendar, Clock, User, Tag, ArrowRight,
  BookOpen, Sparkles, AlertCircle,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { BlogPost } from '@/lib/database.types';
import { toast } from "@/components/ui/use-toast";
import { format } from 'date-fns';

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  'All Categories',
  'Career Advice',
  'Career Development',
  'Work-Life Balance',
  'Industry Trends',
  'Portfolio Tips',
  'Networking',
  'Business Growth',
  'Remote Work',
];

// ─── Shared sub-components ────────────────────────────────────────────────────

const PostThumbnail = ({ post }: { post: BlogPost }) => (
  <div className="w-full h-full bg-gradient-to-br from-amber-50 to-amber-100/50 overflow-hidden">
    {post.image_url ? (
      <img
        src={post.image_url}
        alt={post.title}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center">
        <BookOpen className="h-12 w-12 text-amber-300" />
      </div>
    )}
  </div>
);

const CategoryPill = ({ category }: { category: string }) => (
  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium border border-amber-100">
    <Tag className="h-3 w-3" />
    {category}
  </span>
);

const PostMeta = ({ post }: { post: BlogPost }) => {
  const parts = [
    post.published_at ? format(new Date(post.published_at), 'MMM d, yyyy') : null,
    post.read_time,
  ].filter(Boolean).join(' · ');

  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
        <User className="h-3.5 w-3.5 text-amber-700" />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-900 leading-none mb-0.5">{post.author_name}</p>
        {parts && <p className="text-xs text-slate-500 leading-none">{parts}</p>}
      </div>
    </div>
  );
};

// ─── Cards ─────────────────────────────────────────────────────────────────────

const FeaturedPostCard = ({ post }: { post: BlogPost }) => (
  <Reveal>
    <div className="service-card overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-5 md:min-h-[300px]">

        {/* Thumbnail */}
        <div className="md:col-span-2 aspect-video md:aspect-auto">
          <PostThumbnail post={post} />
        </div>

        {/* Content */}
        <div className="md:col-span-3 p-7 flex flex-col">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-600 text-white rounded-full text-xs font-semibold">
              Featured
            </span>
            <CategoryPill category={post.category} />
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 leading-snug">{post.title}</h2>
          <p className="text-sm text-slate-500 leading-relaxed flex-grow mb-5">{post.excerpt}</p>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <PostMeta post={post} />
            <Button asChild size="sm" className="shadow-none gap-1.5 shrink-0">
              <Link to={`/blog/${post.slug}`}>
                Read article
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </Reveal>
);

const BlogPostCard = ({ post, index }: { post: BlogPost; index: number }) => (
  <Reveal delay={index * 70}>
    <div className="service-card h-full flex flex-col overflow-hidden">

      <div className="aspect-video flex-shrink-0">
        <PostThumbnail post={post} />
      </div>

      <div className="p-6 flex-grow flex flex-col">
        <div className="mb-3">
          <CategoryPill category={post.category} />
        </div>

        <h3 className="font-bold text-slate-900 text-base leading-snug mb-2">{post.title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed flex-grow mb-5">{post.excerpt}</p>

        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <PostMeta post={post} />
          <Button asChild variant="outline" size="sm" className="gap-1.5 shrink-0">
            <Link to={`/blog/${post.slug}`}>
              Read article
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  </Reveal>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const BlogCardSkeleton = () => (
  <div className="service-card overflow-hidden">
    <Skeleton className="aspect-video w-full rounded-none" />
    <div className="p-6 space-y-3">
      <Skeleton className="h-5 w-24 rounded-full" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
        <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const Blog = () => {
  const [searchTerm, setSearchTerm]         = useState('');
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [newsletterEmail, setNewsletterEmail]   = useState('');
  const [newsletterDone, setNewsletterDone]     = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  async function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterLoading(true);
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email: newsletterEmail.trim(), source: 'blog' });
      if (error && error.code !== '23505') throw error;
      setNewsletterDone(true);
    } catch {
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
    } finally {
      setNewsletterLoading(false);
    }
  }

  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['blog_posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });
      if (error) throw error;
      return data as BlogPost[];
    },
  });

  const filteredPosts = posts.filter(post => {
    const matchesSearch =
      searchTerm === '' ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeCategory === 'All Categories' || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = filteredPosts.filter(p => p.is_featured);
  const regularPosts  = filteredPosts.filter(p => !p.is_featured);
  const isFiltering   = searchTerm !== '' || activeCategory !== 'All Categories';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative bg-white overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-amber-100 blur-3xl opacity-50" aria-hidden="true" />
        <div className="pointer-events-none absolute top-16 -left-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl opacity-60" aria-hidden="true" />

        <div className="relative container mx-auto px-4 py-16 md:py-24 text-center">
          <Reveal>
            <span className="eyebrow mb-5 mx-auto">
              <BookOpen className="h-3.5 w-3.5" />
              The Journal
            </span>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold mb-6 leading-[1.1] text-slate-900">
              Insights for Africa's{' '}
              <em className="not-italic text-primary">creative economy.</em>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Career advice, industry trends, and stories from the world of African creative talent — written for professionals and the businesses that hire them.
            </p>

            {/* Search bar */}
            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <Input
                type="search"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-11 h-12 rounded-xl border-slate-200 bg-white shadow-sm text-sm"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Category filter strip ─────────────────────────────────────────────── */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-100">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all duration-150 ${
                  activeCategory === cat
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────────── */}
      {isLoading ? (
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <BlogCardSkeleton key={i} />)}
            </div>
          </div>
        </section>
      ) : error ? (
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4 text-center max-w-sm">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <p className="text-base font-semibold text-slate-900 mb-1">Failed to load articles</p>
            <p className="text-sm text-slate-500">Something went wrong. Please refresh the page to try again.</p>
          </div>
        </section>
      ) : (
        <>
          {/* Featured posts */}
          {featuredPosts.length > 0 && (
            <section className="py-20 md:py-28 bg-white">
              <div className="container mx-auto px-4 max-w-6xl">
                <Reveal className="mb-10">
                  <span className="eyebrow mb-4">Featured Articles</span>
                  <h2 className="text-4xl md:text-5xl font-semibold leading-[1.1]">
                    Editor's picks.
                  </h2>
                </Reveal>
                <div className="space-y-6">
                  {featuredPosts.map(post => (
                    <FeaturedPostCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Regular posts */}
          <section className="py-20 md:py-28 bg-slate-50">
            <div className="container mx-auto px-4 max-w-6xl">
              <Reveal className="mb-10">
                <span className="eyebrow mb-4">
                  {isFiltering ? 'Search Results' : 'Latest Articles'}
                </span>
                <h2 className="text-4xl md:text-5xl font-semibold leading-[1.1]">
                  {isFiltering
                    ? `${filteredPosts.length} article${filteredPosts.length !== 1 ? 's' : ''} found.`
                    : 'From the journal.'}
                </h2>
              </Reveal>

              {regularPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularPosts.map((post, i) => (
                    <BlogPostCard key={post.id} post={post} index={i} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 max-w-sm mx-auto">
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-100">
                    <Search className="h-6 w-6 text-amber-600" />
                  </div>
                  <p className="text-base font-semibold text-slate-900 mb-1">No articles found</p>
                  <p className="text-sm text-slate-500 mb-4">
                    Try adjusting your search or selecting a different category.
                  </p>
                  {isFiltering && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setSearchTerm(''); setActiveCategory('All Categories'); }}
                    >
                      Clear filters
                    </Button>
                  )}
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* ── Newsletter CTA ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-amber-700 py-20 md:py-24">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-amber-600/40 blur-3xl" />
          <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-amber-900/40 blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 text-center max-w-xl">
          <Reveal>
            <span className="eyebrow mb-5 mx-auto border-white/20 text-amber-100 bg-white/10">
              <Sparkles className="h-3.5 w-3.5" />
              Stay in the loop
            </span>
            <h2 className="text-4xl md:text-5xl font-semibold text-white mb-4 leading-[1.1]">
              Get it in your inbox.
            </h2>
            <p className="text-lg text-amber-100 mb-8 leading-relaxed">
              The latest articles, resources, and creative opportunities — delivered straight to you.
            </p>

            {newsletterDone ? (
              <div className="bg-white/10 border border-white/20 rounded-2xl px-6 py-5">
                <p className="text-white font-semibold">You're subscribed!</p>
                <p className="text-amber-100 text-sm mt-1">We'll be in touch with the best from CrémeTalent.</p>
              </div>
            ) : (
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  required
                  className="flex-grow h-12 bg-white/10 border-white/30 text-white placeholder:text-white/50 focus-visible:ring-white/20"
                />
                <Button
                  type="submit"
                  size="lg"
                  disabled={newsletterLoading}
                  className="bg-white text-amber-800 hover:bg-amber-50 shadow-none font-semibold h-12 shrink-0"
                >
                  {newsletterLoading ? "Subscribing…" : "Subscribe"}
                </Button>
              </form>
            )}

            <p className="text-xs text-amber-200/70 mt-4">
              By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
            </p>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
