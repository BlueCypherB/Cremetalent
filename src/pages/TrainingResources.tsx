import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Reveal } from '@/components/Reveal';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from '@/lib/supabase';
import type { Course, Webinar } from '@/lib/database.types';
import {
  GraduationCap,
  Video,
  Calendar,
  Clock,
  Tag,
  User,
  ArrowRight,
  PlayCircle,
  FileText,
  Sparkles,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

type ArticlePreview = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  read_time: string | null;
  published_at: string | null;
  author_name: string;
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }),
    time: d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }),
  };
};

// ─── Cards ─────────────────────────────────────────────────────────────────────

const CourseCard = ({ course, index }: { course: Course; index: number }) => (
  <Reveal delay={index * 80}>
    <div className="service-card h-full flex flex-col overflow-hidden">
      <div className="aspect-video bg-gradient-to-br from-amber-50 to-amber-100/50 relative flex-shrink-0">
        {course.thumbnail_url ? (
          <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <PlayCircle className="h-14 w-14 text-amber-700/30" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500 text-white rounded-full text-xs font-semibold shadow-sm">
            Free
          </span>
        </div>
      </div>

      <div className="p-6 flex-grow flex flex-col">
        <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-slate-500 mb-3">
          <span className="inline-flex items-center gap-1">
            <Tag className="h-3 w-3 text-amber-600" />
            {course.category}
          </span>
          <span className="text-slate-300">•</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3 text-amber-600" />
            {course.duration}
          </span>
        </div>

        <h3 className="font-bold text-slate-900 text-base leading-snug mb-2">{course.title}</h3>
        <p className="text-sm text-slate-500 mb-5 leading-relaxed flex-grow">{course.description}</p>

        <div className="flex items-center gap-2.5 mb-5 pt-4 border-t border-slate-100">
          <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
            <User className="h-3.5 w-3.5 text-amber-700" />
          </div>
          <span className="text-sm font-medium text-slate-700">{course.instructor}</span>
        </div>

        <Button asChild className="w-full shadow-none gap-1.5">
          <a href={course.video_url} target="_blank" rel="noopener noreferrer">
            <PlayCircle className="h-4 w-4" />
            Start course
          </a>
        </Button>
      </div>
    </div>
  </Reveal>
);

const ArticleCard = ({ article, index }: { article: ArticlePreview; index: number }) => (
  <Reveal delay={index * 80}>
    <div className="service-card h-full p-7 flex flex-col">
      <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-amber-100 mb-5">
        <FileText className="h-5 w-5 text-amber-700" />
      </div>

      <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-slate-500 mb-3">
        <span className="inline-flex items-center gap-1">
          <Tag className="h-3 w-3 text-amber-600" />
          {article.category}
        </span>
        {article.published_at && (
          <>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3 text-amber-600" />
              {new Date(article.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </>
        )}
        {article.read_time && (
          <>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3 text-amber-600" />
              {article.read_time}
            </span>
          </>
        )}
      </div>

      <h3 className="font-bold text-slate-900 text-base leading-snug mb-3">{article.title}</h3>
      <p className="text-sm text-slate-500 mb-5 leading-relaxed flex-grow">{article.excerpt}</p>

      <Button asChild variant="outline" size="sm" className="self-start gap-1.5">
        <Link to={`/blog/${article.slug}`}>
          Read article
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </Button>
    </div>
  </Reveal>
);

const WebinarCard = ({ webinar, index }: { webinar: Webinar; index: number }) => {
  const { date, time } = formatDateTime(webinar.event_date);
  return (
    <Reveal delay={index * 100}>
      <div className="service-card p-7 flex flex-col h-full">
        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-amber-100 mb-5">
          <Video className="h-5 w-5 text-amber-700" />
        </div>

        <h3 className="font-bold text-slate-900 text-base leading-snug mb-3">{webinar.title}</h3>
        <p className="text-sm text-slate-500 mb-5 leading-relaxed flex-grow">{webinar.description}</p>

        <div className="space-y-2 mb-6 text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="h-4 w-4 text-amber-600 flex-shrink-0" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Clock className="h-4 w-4 text-amber-600 flex-shrink-0" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <User className="h-4 w-4 text-amber-600 flex-shrink-0" />
            <span>Hosted by {webinar.host}</span>
          </div>
        </div>

        <Button asChild className="shadow-none gap-1.5 self-start">
          <a href={webinar.registration_url} target="_blank" rel="noopener noreferrer">
            Register now
            <ArrowRight className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </Reveal>
  );
};

// ─── Skeletons ─────────────────────────────────────────────────────────────────

const CourseSkeleton = () => (
  <div className="service-card overflow-hidden">
    <Skeleton className="aspect-video w-full rounded-none" />
    <div className="p-6 space-y-3">
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-9 w-full mt-3" />
    </div>
  </div>
);

const CardSkeleton = () => (
  <div className="service-card p-7 space-y-3">
    <Skeleton className="h-10 w-10 rounded-xl" />
    <Skeleton className="h-3 w-1/3 mt-2" />
    <Skeleton className="h-5 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
    <Skeleton className="h-8 w-28 mt-2" />
  </div>
);

// ─── Data ─────────────────────────────────────────────────────────────────────

const RESOURCE_TYPES = [
  { icon: PlayCircle, label: 'Free video courses', desc: 'Expert-led lessons you can watch anytime.' },
  { icon: FileText,  label: 'Articles & insights', desc: 'Industry trends and career perspectives.' },
  { icon: Video,     label: 'Live webinars',        desc: 'Real-time workshops with active Q&A.' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

const TrainingResources = () => {
  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ['courses', 'published'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: articles, isLoading: articlesLoading } = useQuery({
    queryKey: ['blog_posts', 'training_preview'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, category, read_time, published_at, author_name')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(3);
      if (error) throw error;
      return data as ArticlePreview[];
    },
  });

  const { data: webinars, isLoading: webinarsLoading } = useQuery({
    queryKey: ['webinars', 'upcoming'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('webinars')
        .select('*')
        .eq('is_published', true)
        .gte('event_date', new Date().toISOString())
        .order('event_date', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative bg-white overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-amber-100 blur-3xl opacity-50" aria-hidden="true" />
        <div className="pointer-events-none absolute top-16 -left-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl opacity-60" aria-hidden="true" />

        <div className="relative container mx-auto px-4 py-20 md:py-28 text-center">
          <Reveal>
            <span className="eyebrow mb-5 mx-auto">
              <GraduationCap className="h-3.5 w-3.5" />
              Training &amp; Resources
            </span>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold mb-6 leading-[1.1] text-slate-900">
              Level up your{' '}
              <em className="not-italic text-primary">creative skills.</em>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Free courses, expert articles, and live workshops — everything you need to grow your creative practice and advance your career across Africa.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                <a href="#courses">
                  Browse courses
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-foreground/20 hover:bg-foreground/5">
                <Link to="/blog">
                  Read articles
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>

        {/* Resource type strip */}
        <div className="relative border-t border-slate-100 bg-slate-50/70">
          <div className="container mx-auto px-4 py-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-0 sm:divide-x divide-slate-200 max-w-3xl mx-auto">
              {RESOURCE_TYPES.map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-center gap-3 sm:px-8 first:sm:pl-0 last:sm:pr-0">
                  <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-amber-100">
                    <Icon className="h-5 w-5 text-amber-700" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{label}</p>
                    <p className="text-xs text-slate-500 leading-snug mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Courses ──────────────────────────────────────────────────────────── */}
      <section id="courses" className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <Reveal className="mb-12 max-w-2xl">
            <span className="eyebrow mb-4">Free Courses</span>
            <h2 className="text-4xl md:text-5xl font-semibold mb-4 leading-[1.1]">
              Develop your craft.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Expert-led video courses, available to every creative in our network — completely free.
            </p>
          </Reveal>

          {coursesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0, 1, 2].map(i => <CourseSkeleton key={i} />)}
            </div>
          ) : courses && courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, i) => <CourseCard key={course.id} course={course} index={i} />)}
            </div>
          ) : (
            <div className="text-center py-16 max-w-sm mx-auto">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-100">
                <PlayCircle className="h-6 w-6 text-amber-600" />
              </div>
              <p className="text-base font-semibold text-slate-900 mb-1">No courses yet</p>
              <p className="text-sm text-slate-500">We're building our course library. Check back soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Articles ─────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-slate-50">
        <div className="container mx-auto px-4">
          <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div className="max-w-2xl">
              <span className="eyebrow mb-4">Articles &amp; Insights</span>
              <h2 className="text-4xl md:text-5xl font-semibold mb-4 leading-[1.1]">
                From our journal.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Industry trends, career advice, and stories from Africa's creative economy.
              </p>
            </div>
            <Button asChild variant="outline" className="self-start md:self-auto shrink-0 gap-1.5">
              <Link to="/blog">
                View all articles
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Reveal>

          {articlesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[0, 1, 2].map(i => <CardSkeleton key={i} />)}
            </div>
          ) : articles && articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {articles.map((article, i) => <ArticleCard key={article.id} article={article} index={i} />)}
            </div>
          ) : (
            <div className="text-center py-16 max-w-sm mx-auto">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-100">
                <FileText className="h-6 w-6 text-amber-600" />
              </div>
              <p className="text-base font-semibold text-slate-900 mb-1">No articles yet</p>
              <p className="text-sm text-slate-500">Editorial content is coming soon. Follow us for updates.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Webinars ─────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <Reveal className="text-center mb-12 max-w-2xl mx-auto">
            <span className="eyebrow mb-4">Live Events</span>
            <h2 className="text-4xl md:text-5xl font-semibold mb-4 leading-[1.1]">
              Upcoming webinars &amp; workshops.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Join interactive sessions with industry experts and ask questions in real time.
            </p>
          </Reveal>

          {webinarsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[0, 1].map(i => <CardSkeleton key={i} />)}
            </div>
          ) : webinars && webinars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {webinars.map((webinar, i) => <WebinarCard key={webinar.id} webinar={webinar} index={i} />)}
            </div>
          ) : (
            <div className="text-center py-16 max-w-sm mx-auto">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-100">
                <Video className="h-6 w-6 text-amber-600" />
              </div>
              <p className="text-base font-semibold text-slate-900 mb-1">No upcoming webinars</p>
              <p className="text-sm text-slate-500">Follow us on social media to hear about new events first.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-amber-700 py-20 md:py-24">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-amber-600/40 blur-3xl" />
          <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-amber-900/40 blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 text-center">
          <Reveal>
            <span className="eyebrow mb-5 mx-auto border-white/20 text-amber-100 bg-white/10">
              <Sparkles className="h-3.5 w-3.5" />
              Grow with CrémeTalent
            </span>
            <h2 className="text-4xl md:text-5xl font-semibold text-white mb-4 leading-[1.1]">
              Ready to advance your career?
            </h2>
            <p className="text-lg text-amber-100 max-w-xl mx-auto mb-10 leading-relaxed">
              Join our network to unlock exclusive opportunities, get matched with the right roles, and stay connected to Africa's growing creative community.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="bg-white text-amber-800 hover:bg-amber-50 shadow-none font-semibold gap-1.5">
                <Link to="/join-talent-pool">
                  Join our network
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent border-white/40 text-white hover:bg-white/15 shadow-none font-medium"
              >
                <Link to="/talent-pool">
                  Browse talent pool
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TrainingResources;
