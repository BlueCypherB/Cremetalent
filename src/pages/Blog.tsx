
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Calendar,
  Clock,
  User,
  Tag,
  ArrowRight
} from 'lucide-react';

// Sample blog post data
const blogPosts = [
  {
    id: 1,
    title: "Navigating the Creative Job Market in 2025",
    excerpt: "How to position yourself for success in a rapidly evolving creative economy with emerging technologies and changing client expectations.",
    category: "Career Advice",
    author: "Emma Davis",
    date: "May 3, 2025",
    readTime: "8 min read",
    image: null,
    featured: true
  },
  {
    id: 2,
    title: "Top Skills Employers Look for in Creatives",
    excerpt: "Beyond technical prowess: the soft skills and adaptability traits that make creative professionals stand out to potential employers.",
    category: "Career Development",
    author: "Marcus Chen",
    date: "April 28, 2025",
    readTime: "10 min read",
    image: null,
    featured: true
  },
  {
    id: 3,
    title: "Building a Sustainable Creative Career",
    excerpt: "Strategies for long-term success and fulfillment in the creative industry, from financial planning to avoiding burnout.",
    category: "Work-Life Balance",
    author: "Sophia Rodriguez",
    date: "April 22, 2025",
    readTime: "12 min read",
    image: null,
    featured: true
  },
  {
    id: 4,
    title: "The Rise of AI in Creative Work",
    excerpt: "How artificial intelligence is transforming creative processes and what professionals need to know to stay relevant.",
    category: "Industry Trends",
    author: "James Wilson",
    date: "April 15, 2025",
    readTime: "9 min read",
    image: null
  },
  {
    id: 5,
    title: "Crafting a Portfolio That Gets Noticed",
    excerpt: "Expert tips for creating a standout creative portfolio that showcases your best work and attracts ideal clients or employers.",
    category: "Portfolio Tips",
    author: "Aisha Patel",
    date: "April 8, 2025",
    readTime: "7 min read",
    image: null
  },
  {
    id: 6,
    title: "Networking Strategies for Introverted Creatives",
    excerpt: "How to build professional connections and find opportunities when networking doesn't come naturally to you.",
    category: "Networking",
    author: "David Thompson",
    date: "April 1, 2025",
    readTime: "6 min read",
    image: null
  },
  {
    id: 7,
    title: "From Freelancer to Agency: Growth Strategies",
    excerpt: "The roadmap for scaling your solo creative practice into a thriving agency with a team and diverse client base.",
    category: "Business Growth",
    author: "Emma Davis",
    date: "March 25, 2025",
    readTime: "11 min read",
    image: null
  },
  {
    id: 8,
    title: "Creative Collaboration in Remote Teams",
    excerpt: "Tools, techniques, and best practices for maintaining creative synergy when working with distributed teams.",
    category: "Remote Work",
    author: "Marcus Chen",
    date: "March 18, 2025",
    readTime: "9 min read",
    image: null
  },
];

// Blog post categories
const categories = [
  "All Categories",
  "Career Advice",
  "Career Development",
  "Work-Life Balance",
  "Industry Trends",
  "Portfolio Tips",
  "Networking",
  "Business Growth",
  "Remote Work"
];

const FeaturedPostCard = ({ post }: { post: typeof blogPosts[0] }) => (
  <Card className="overflow-hidden h-full">
    <div className="grid grid-cols-1 md:grid-cols-2 h-full">
      <div className="aspect-square md:aspect-auto bg-amber-50 flex items-center justify-center">
        {post.image ? (
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        ) : (
          <div className="text-4xl font-bold text-amber-200">CT</div>
        )}
      </div>
      <CardContent className="p-6 flex flex-col">
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Tag className="h-4 w-4 mr-1" />
          <span>{post.category}</span>
        </div>
        
        <h2 className="text-2xl font-bold mb-3">{post.title}</h2>
        <p className="text-muted-foreground mb-4 flex-grow">{post.excerpt}</p>
        
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-2">
              <User className="h-4 w-4 text-amber-600" />
            </div>
            <span className="text-sm">{post.author}</span>
          </div>
          
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{post.date}</span>
            <span className="mx-2">•</span>
            <Clock className="h-3 w-3 mr-1" />
            <span>{post.readTime}</span>
          </div>
        </div>
        
        <Button className="mt-4" variant="outline">
          Read Article
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </div>
  </Card>
);

const BlogPostCard = ({ post }: { post: typeof blogPosts[0] }) => (
  <Card className="h-full flex flex-col">
    <div className="aspect-video bg-amber-50 flex items-center justify-center">
      {post.image ? (
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
      ) : (
        <div className="text-4xl font-bold text-amber-200">CT</div>
      )}
    </div>
    
    <CardContent className="p-6 flex-grow flex flex-col">
      <div className="flex items-center text-sm text-muted-foreground mb-2">
        <Tag className="h-4 w-4 mr-1" />
        <span>{post.category}</span>
      </div>
      
      <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
      <p className="text-muted-foreground mb-4 flex-grow">{post.excerpt}</p>
      
      <div className="flex justify-between items-center pt-4 border-t">
        <div className="flex items-center">
          <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mr-2">
            <User className="h-3 w-3 text-amber-600" />
          </div>
          <span className="text-sm">{post.author}</span>
        </div>
        
        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="h-3 w-3 mr-1" />
          <span>{post.date}</span>
          <span className="mx-1">•</span>
          <Clock className="h-3 w-3 mr-1" />
          <span>{post.readTime}</span>
        </div>
      </div>
    </CardContent>
    
    <div className="px-6 pb-6">
      <Button variant="outline" size="sm" className="w-full">
        Read Article
      </Button>
    </div>
  </Card>
);

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Categories');
  
  // Filter posts based on search term and category
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = activeCategory === 'All Categories' || post.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Separate featured and regular posts
  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">CrémeTalent Blog</h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Insights, advice, and trends for creative professionals and businesses in the creative economy.
          </p>
          
          <div className="max-w-2xl mx-auto flex">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-6"
              />
            </div>
            <Button className="ml-2">
              <Search className="mr-2" />
              Search
            </Button>
          </div>
        </div>
      </section>
      
      {/* Categories Filter */}
      <section className="bg-white py-4 border-b sticky top-16 z-10">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto pb-2 scrollbar-none">
            {categories.map(category => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "ghost"}
                size="sm"
                className="mr-2 whitespace-nowrap"
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">Featured Articles</h2>
            <div className="space-y-8">
              {featuredPosts.map(post => (
                <FeaturedPostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Regular Posts Grid */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Latest Articles</h2>
          
          {regularPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map(post => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl font-medium mb-2">No articles found</p>
              <p className="text-muted-foreground">
                Try adjusting your search or category filters to find more articles.
              </p>
            </div>
          )}
        </div>
      </section>
      
      {/* Newsletter Signup */}
      <section className="py-12 bg-amber-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-muted-foreground">
              Get the latest articles, resources, and career opportunities delivered straight to your inbox.
            </p>
          </div>
          
          <form className="flex flex-col md:flex-row gap-4">
            <Input 
              placeholder="Enter your email address" 
              type="email" 
              className="md:flex-grow py-6"
              required
            />
            <Button size="lg">Subscribe</Button>
          </form>
          
          <p className="text-xs text-center text-muted-foreground mt-4">
            By subscribing, you agree to our Privacy Policy and consent to receive updates from CrémeTalent.
          </p>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Blog;
