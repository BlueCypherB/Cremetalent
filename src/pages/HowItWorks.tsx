
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Briefcase,
  Users,
  GraduationCap,
  Award,
  MessageSquare,
  FileText,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

const ProcessStep = ({ 
  number, 
  title, 
  description, 
  icon: Icon,
  color = "bg-primary"
}: { 
  number: number; 
  title: string; 
  description: string;
  icon: React.ElementType;
  color?: string;
}) => (
  <div className="flex space-x-4">
    <div className={`w-12 h-12 rounded-full ${color} text-white flex items-center justify-center flex-shrink-0`}>
      <span className="text-xl font-bold">{number}</span>
    </div>
    <div>
      <div className="flex items-center mb-2">
        <Icon className="h-5 w-5 mr-2" />
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </div>
);

const FAQ = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <Card className="overflow-hidden">
      <div 
        className="p-6 cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <HelpCircle className="h-5 w-5 text-primary mr-2" />
          <h3 className="font-semibold">{question}</h3>
        </div>
        <div>
          <ChevronIcon direction={isOpen ? "up" : "down"} />
        </div>
      </div>
      {isOpen && (
        <CardContent className="pt-0 pb-6 border-t">
          <p className="text-muted-foreground">{answer}</p>
        </CardContent>
      )}
    </Card>
  );
};

const ChevronIcon = ({ direction }: { direction: "up" | "down" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={`transition-transform ${direction === "up" ? "rotate-180" : ""}`}
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const HowItWorks = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Our streamlined process connects creative talent with the right opportunities efficiently and effectively.
          </p>
        </div>
      </section>
      
      {/* For Creatives Process */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">For Creative Professionals</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Your journey to exciting creative opportunities begins here.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-12">
            <ProcessStep 
              number={1} 
              title="Apply" 
              icon={FileText}
              description="Submit your application to join our talent pool. Share your portfolio, resume, and career goals so we can understand your unique skills and aspirations."
            />
            
            <ProcessStep 
              number={2} 
              title="Train" 
              icon={GraduationCap}
              description="Participate in our free training programs designed to enhance your skills, keep you updated on industry trends, and maximize your marketability."
            />
            
            <ProcessStep 
              number={3} 
              title="Match" 
              icon={Users}
              description="Get connected with job opportunities that fit your skills, experience, and career goals. We carefully match you with projects and positions that align with your expertise."
            />
            
            <ProcessStep 
              number={4} 
              title="Grow" 
              icon={Award}
              description="Receive ongoing support and career development as you progress. We're invested in your long-term success and professional growth."
            />
            
            <div className="text-center pt-6">
              <Link to="/talent-pool">
                <Button size="lg">Join Our Talent Pool</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* For Clients Process */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">For Businesses</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Finding the perfect creative talent for your projects has never been easier.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-12">
            <ProcessStep 
              number={1} 
              title="Reach Out" 
              icon={MessageSquare}
              color="bg-secondary"
              description="Contact our team with your recruitment needs. Share details about your company, project requirements, and the type of creative talent you're seeking."
            />
            
            <ProcessStep 
              number={2} 
              title="Define Needs" 
              icon={FileText}
              color="bg-secondary"
              description="Work with our recruitment specialists to identify the exact skills, experience, and qualities you're looking for in creative professionals."
            />
            
            <ProcessStep 
              number={3} 
              title="Select Talent" 
              icon={CheckCircle2}
              color="bg-secondary"
              description="Review our carefully curated list of candidates who match your requirements. Interview and select the creative professionals who best fit your team and culture."
            />
            
            <ProcessStep 
              number={4} 
              title="Integrate" 
              icon={Briefcase}
              color="bg-secondary"
              description="Experience seamless onboarding as we help integrate the new talent into your team, with continuous support throughout the process."
            />
            
            <div className="text-center pt-6">
              <Link to="/services">
                <Button size="lg" variant="secondary">Request Creative Talent</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQs Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Find answers to common questions about our services and process.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-4">
            <FAQ 
              question="How long does the recruitment process take?" 
              answer="The timeline varies based on the complexity of the role and your specific requirements. Typically, we can provide a shortlist of qualified candidates within 1-2 weeks. For urgent needs, we also offer expedited services."
            />
            
            <FAQ 
              question="What industries do you specialize in?" 
              answer="We specialize in various creative fields including graphic design, web and UI/UX design, content creation, video production, marketing, advertising, and digital media. Our network includes talent across these and other related creative disciplines."
            />
            
            <FAQ 
              question="Are training programs mandatory for creatives?" 
              answer="No, our training programs are optional benefits for creative professionals in our network. However, we highly recommend participation as they enhance skills, marketability, and career opportunities."
            />
            
            <FAQ 
              question="What support do you offer post-placement?" 
              answer="We provide comprehensive post-placement support including regular check-ins with both the client and the creative professional, performance reviews, conflict resolution if needed, and ongoing career development guidance."
            />
            
            <FAQ 
              question="Do you offer temporary or project-based talent solutions?" 
              answer="Yes, we offer flexible talent solutions including full-time placement, contract-to-hire, project-based work, and freelance arrangements to meet the diverse needs of both businesses and creative professionals."
            />
            
            <FAQ 
              question="How do you ensure quality in your talent pool?" 
              answer="All creative professionals in our network undergo a rigorous vetting process including portfolio review, skill assessment, interviews, reference checks, and in some cases, practical assignments to ensure they meet our high-quality standards."
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Whether you're a creative professional looking for opportunities or a business seeking talent, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/talent-pool">
              <Button size="lg" variant="secondary">
                For Creative Professionals
              </Button>
            </Link>
            <Link to="/services">
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/20">
                For Businesses
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default HowItWorks;
