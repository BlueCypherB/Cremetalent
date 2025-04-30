
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  HandCoins, 
  Users, 
  Heart, 
  Award, 
  HandHeart, 
  Gift, 
  FolderPlus
} from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }: { 
  icon: React.ElementType, 
  title: string, 
  description: string 
}) => (
  <Card className="feature-card h-full">
    <CardContent className="p-6 flex flex-col h-full">
      <Icon className="h-10 w-10 text-primary mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground flex-grow">{description}</p>
    </CardContent>
  </Card>
);

const ProjectCard = ({ 
  title, 
  creator, 
  raised, 
  goal, 
  daysLeft, 
  category,
  slug 
}: { 
  title: string;
  creator: string;
  raised: number;
  goal: number;
  daysLeft: number;
  category: string;
  slug: string;
}) => {
  const progress = (raised / goal) * 100;
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="aspect-video bg-muted relative">
        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
          {category}
        </div>
      </div>
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4">by {creator}</p>
        
        <div className="relative h-2 bg-muted rounded-full mb-2">
          <div 
            className="absolute top-0 left-0 h-full bg-primary rounded-full" 
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="font-medium">${raised.toLocaleString()} raised</span>
          <span className="text-muted-foreground">${goal.toLocaleString()} goal</span>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-muted-foreground">{daysLeft} days left</span>
          <Link to={`/projects/${slug}`}>
            <Button variant="outline" size="sm">View Project</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

const Index = () => {
  // Sample featured projects
  const featuredProjects = [
    {
      title: "Educational Scholarship for Aspiring Medical Students",
      creator: "Dr. Amanda Chen",
      raised: 12500,
      goal: 25000,
      daysLeft: 18,
      category: "Education",
      slug: "med-scholarship"
    },
    {
      title: "Community Art Center Renovation",
      creator: "Local Artists Collective",
      raised: 8200,
      goal: 15000,
      daysLeft: 30,
      category: "Arts",
      slug: "art-center"
    },
    {
      title: "Tech Training Program for Underserved Youth",
      creator: "Future Coders Initiative",
      raised: 18500,
      goal: 20000,
      daysLeft: 12,
      category: "Technology",
      slug: "tech-training"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="animate-fade-in">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">Fund Dreams, Build Futures</h1>
              <p className="text-xl mb-6 text-muted-foreground">
                CrémeTalent connects passionate creators with generous supporters.
                Discover and fund exceptional projects and help talented individuals reach their full potential.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/projects">
                  <Button size="lg">
                    <HandCoins className="mr-2" />
                    Fund a Project
                  </Button>
                </Link>
                <Link to="/create-project">
                  <Button size="lg" variant="outline">
                    <FolderPlus className="mr-2" />
                    Start Your Project
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <img 
                src="/lovable-uploads/90e525c1-9643-4777-b523-84b6d202cb2d.png" 
                alt="Artist painting on canvas" 
                className="w-full max-w-lg rounded-lg shadow-xl" 
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Projects Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Projects</h2>
            <Link to="/projects">
              <Button variant="outline">View All Projects</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={index} {...project} />
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How CrémeTalent Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform connects talented individuals with supporters who believe in their potential.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <FolderPlus className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Create a Project</h3>
              <p className="text-muted-foreground">Share your vision, set your funding goal, and tell your story.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gather Support</h3>
              <p className="text-muted-foreground">Connect with people who believe in your idea and want to help.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Achieve Goals</h3>
              <p className="text-muted-foreground">Use the funds to bring your project to life and share your success.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose CrémeTalent</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform is designed to maximize your success and impact.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={HandCoins} 
              title="Transparent Funding" 
              description="Clear tracking of all donations with regular updates on project progress."
            />
            <FeatureCard 
              icon={Heart} 
              title="Community Support" 
              description="Connect with a passionate community that believes in your potential."
            />
            <FeatureCard 
              icon={HandHeart} 
              title="Mentorship Access" 
              description="Get guidance from industry experts who can help your project succeed."
            />
            <FeatureCard 
              icon={Gift} 
              title="Backer Rewards" 
              description="Offer unique rewards to thank supporters for their contributions."
            />
            <FeatureCard 
              icon={Award} 
              title="Success Stories" 
              description="Join thousands of creators who have achieved their goals through CrémeTalent."
            />
            <FeatureCard 
              icon={Users} 
              title="Global Reach" 
              description="Connect with supporters from around the world who share your passion."
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Make an Impact?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join CrémeTalent today and be part of a community that believes in the power of supporting talent.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/projects">
              <Button size="lg" variant="secondary">
                Explore Projects
              </Button>
            </Link>
            <Link to="/create-project">
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/20">
                Start Your Project
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
