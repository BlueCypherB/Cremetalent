import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TalentSpotlight from '@/components/talent/TalentSpotlight';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Briefcase, 
  GraduationCap, 
  Users, 
  Award, 
  Star, 
  FileText,
  HandHeart
} from 'lucide-react';

const ServiceCard = ({ icon: Icon, title, description }: { 
  icon: React.ElementType, 
  title: string, 
  description: string 
}) => (
  <Card className="service-card h-full">
    <CardContent className="p-6 flex flex-col h-full">
      <Icon className="h-10 w-10 text-primary mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground flex-grow">{description}</p>
    </CardContent>
  </Card>
);

const TestimonialCard = ({ 
  quote, 
  name, 
  company,
  image
}: { 
  quote: string;
  name: string;
  company: string;
  image?: string;
}) => (
  <Card className="h-full">
    <CardContent className="p-6 flex flex-col h-full">
      <div className="flex-grow">
        <div className="mb-4 text-amber-500">
          <Star className="inline-block h-5 w-5" />
          <Star className="inline-block h-5 w-5" />
          <Star className="inline-block h-5 w-5" />
          <Star className="inline-block h-5 w-5" />
          <Star className="inline-block h-5 w-5" />
        </div>
        <p className="italic mb-6 text-lg">"{quote}"</p>
      </div>
      <div className="flex items-center">
        {image ? (
          <div className="w-12 h-12 rounded-full overflow-hidden bg-amber-100 mr-4">
            <img src={image} alt={name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mr-4">
            <span className="text-amber-500 font-bold text-xl">{name.charAt(0)}</span>
          </div>
        )}
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-muted-foreground">{company}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="animate-fade-in">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">Empowering the Creative Economy by Connecting Talent with Opportunities</h1>
              <p className="text-xl mb-6 text-muted-foreground">
                At CrémeTalent, we bridge the gap between exceptional creative professionals and the companies that need them.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/talent-pool">
                  <Button size="lg">
                    <Users className="mr-2" />
                    Join Our Talent Pool
                  </Button>
                </Link>
                <Link to="/services">
                  <Button size="lg" variant="outline">
                    <Briefcase className="mr-2" />
                    Find the Perfect Creative Talent
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <img 
                src="/lovable-uploads/90e525c1-9643-4777-b523-84b6d202cb2d.png" 
                alt="Creative professional at work" 
                className="w-full max-w-lg rounded-lg shadow-xl" 
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Intro Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-3xl font-bold mb-6">Premier Talent Management for the Creative Industry</h2>
          <p className="text-xl text-muted-foreground mb-8">
            CrémeTalent connects top-tier creative professionals with forward-thinking brands — providing end-to-end talent services that source, train, and manage the very best in Nigeria's creative economy.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-amber-50 p-4 rounded-lg">
              <p className="text-4xl font-bold text-amber-500">500+</p>
              <p className="text-sm text-muted-foreground">Creatives Placed</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg">
              <p className="text-4xl font-bold text-amber-500">200+</p>
              <p className="text-sm text-muted-foreground">Client Companies</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg">
              <p className="text-4xl font-bold text-amber-500">50+</p>
              <p className="text-sm text-muted-foreground">Industries Served</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg">
              <p className="text-4xl font-bold text-amber-500">98%</p>
              <p className="text-sm text-muted-foreground">Client Satisfaction</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Talent Spotlight Section */}
      <TalentSpotlight />
      
      {/* Services Section */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Services</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We provide comprehensive solutions for both creative professionals and businesses looking to connect.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCard 
              icon={Briefcase} 
              title="Talent Sourcing & Recruitment" 
              description="Connecting businesses with top-tier creative professionals through our extensive network and rigorous vetting process."
            />
            <ServiceCard 
              icon={GraduationCap} 
              title="Training & Upskilling" 
              description="Providing creatives with the tools, workshops, and resources they need to excel in their careers and stay ahead of industry trends."
            />
            <ServiceCard 
              icon={Users} 
              title="Onboarding" 
              description="Ensuring smooth integration into new roles with comprehensive onboarding processes tailored to both clients and creative professionals."
            />
            <ServiceCard 
              icon={Award} 
              title="Talent Management" 
              description="Ongoing support for sustained success, including career guidance, performance reviews, and development opportunities."
            />
            <ServiceCard 
              icon={FileText} 
              title="HR Services for Creatives" 
              description="Tailored HR solutions for the creative sector, handling contracts, benefits, and administrative requirements."
            />
            <ServiceCard 
              icon={HandHeart} 
              title="Career Development" 
              description="Strategic guidance for career advancement, portfolio development, and long-term professional growth in creative fields."
            />
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Hear from the businesses and creative professionals who have experienced the CrémeTalent difference.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TestimonialCard 
              quote="CrémeTalent connected us with a designer who transformed our brand identity. Their process was seamless and efficient."
              name="Sarah Johnson"
              company="Creative Director, DesignHub"
            />
            <TestimonialCard 
              quote="The quality of talent in their pool is outstanding. We found the perfect video editor for our marketing team within days."
              name="Michael Chen"
              company="Marketing Manager, TechVision"
            />
            <TestimonialCard 
              quote="As a freelance graphic designer, joining CrémeTalent's network has been career-changing. Steady work with great clients!"
              name="Ava Washington"
              company="Independent Designer"
            />
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How CrémeTalent Works</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our streamlined process connects talent with opportunity efficiently and effectively.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-2xl font-bold mb-4 text-center">For Creative Professionals</h3>
              <ol className="space-y-4">
                <li className="flex">
                  <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center mr-4 shrink-0">1</span>
                  <div>
                    <p className="font-semibold">Apply</p>
                    <p className="text-muted-foreground">Submit your application to join our talent pool with your portfolio and credentials.</p>
                  </div>
                </li>
                <li className="flex">
                  <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center mr-4 shrink-0">2</span>
                  <div>
                    <p className="font-semibold">Train</p>
                    <p className="text-muted-foreground">Access our training programs to enhance your skills and marketability.</p>
                  </div>
                </li>
                <li className="flex">
                  <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center mr-4 shrink-0">3</span>
                  <div>
                    <p className="font-semibold">Match</p>
                    <p className="text-muted-foreground">Get connected with job opportunities that align with your skills and career goals.</p>
                  </div>
                </li>
                <li className="flex">
                  <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center mr-4 shrink-0">4</span>
                  <div>
                    <p className="font-semibold">Grow</p>
                    <p className="text-muted-foreground">Receive ongoing support and development opportunities as your career advances.</p>
                  </div>
                </li>
              </ol>
              <div className="mt-6 text-center">
                <Link to="/talent-pool">
                  <Button>Join Our Talent Pool</Button>
                </Link>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-2xl font-bold mb-4 text-center">For Businesses</h3>
              <ol className="space-y-4">
                <li className="flex">
                  <span className="bg-secondary text-secondary-foreground w-8 h-8 rounded-full flex items-center justify-center mr-4 shrink-0">1</span>
                  <div>
                    <p className="font-semibold">Reach Out</p>
                    <p className="text-muted-foreground">Contact us with your creative talent needs and recruitment goals.</p>
                  </div>
                </li>
                <li className="flex">
                  <span className="bg-secondary text-secondary-foreground w-8 h-8 rounded-full flex items-center justify-center mr-4 shrink-0">2</span>
                  <div>
                    <p className="font-semibold">Define Needs</p>
                    <p className="text-muted-foreground">Work with our team to identify the exact skills and experience you require.</p>
                  </div>
                </li>
                <li className="flex">
                  <span className="bg-secondary text-secondary-foreground w-8 h-8 rounded-full flex items-center justify-center mr-4 shrink-0">3</span>
                  <div>
                    <p className="font-semibold">Select Talent</p>
                    <p className="text-muted-foreground">Review our carefully curated candidates who match your requirements.</p>
                  </div>
                </li>
                <li className="flex">
                  <span className="bg-secondary text-secondary-foreground w-8 h-8 rounded-full flex items-center justify-center mr-4 shrink-0">4</span>
                  <div>
                    <p className="font-semibold">Integrate</p>
                    <p className="text-muted-foreground">Experience seamless onboarding and continuous support throughout the process.</p>
                  </div>
                </li>
              </ol>
              <div className="mt-6 text-center">
                <Link to="/services">
                  <Button variant="secondary">Request Creative Talent</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Take the Next Step?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join CrémeTalent today and be part of a community that connects exceptional talent with meaningful opportunities.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/talent-pool">
              <Button size="lg" variant="secondary">
                Join Our Talent Pool
              </Button>
            </Link>
            <Link to="/services">
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/20">
                Request Creative Talent
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
