
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { HandCoins, Heart, Clock, Users, Award } from 'lucide-react';

// Sample project data (in a real app, you would fetch this from an API)
const projectsData = [
  {
    id: "med-scholarship",
    title: "Educational Scholarship for Aspiring Medical Students",
    creator: "Dr. Amanda Chen",
    creatorAvatar: "/placeholder.svg",
    raised: 12500,
    goal: 25000,
    daysLeft: 18,
    backers: 158,
    category: "Education",
    description: "This scholarship fund aims to support talented students from underrepresented communities who dream of pursuing medical education. With rising tuition costs creating significant barriers to entry, many promising future doctors struggle to access the education they need.",
    longDescription: "Our scholarship program identifies students with exceptional potential who face financial barriers to entering medical school. Recipients receive not only financial support but also mentorship from established medical professionals, access to study resources, and a supportive community.\n\nStatistics show that doctors from underrepresented communities are more likely to serve in areas with physician shortages. By increasing diversity in medical education, we can address healthcare inequities and improve patient outcomes.\n\nYour contribution directly funds scholarships that cover tuition, books, and essential living expenses for these future healthcare heroes.",
    updates: [
      {
        date: "June 15, 2023",
        title: "First round of scholarships awarded",
        content: "We're thrilled to announce that we've selected our first cohort of 5 scholarship recipients! These exceptional students will begin their medical education this fall. Thank you to all our supporters for making this possible."
      },
      {
        date: "May 3, 2023",
        title: "Application review process",
        content: "Our committee has begun reviewing the incredible applications we've received. We're amazed by the talent and dedication shown by these aspiring medical professionals."
      }
    ],
    faqs: [
      {
        question: "How are scholarship recipients selected?",
        answer: "Recipients are selected based on academic merit, financial need, community involvement, and demonstrated commitment to addressing healthcare inequities."
      },
      {
        question: "How much of my donation goes directly to scholarships?",
        answer: "95% of all donations go directly to student scholarships. The remaining 5% covers essential administrative costs."
      },
      {
        question: "Can I specify which medical specialty my donation supports?",
        answer: "For donations over $5,000, donors can indicate a preference for supporting students interested in specific medical specialties."
      }
    ]
  },
  {
    id: "art-center",
    title: "Community Art Center Renovation",
    creator: "Local Artists Collective",
    creatorAvatar: "/placeholder.svg",
    raised: 8200,
    goal: 15000,
    daysLeft: 30,
    backers: 94,
    category: "Arts",
    description: "Our community art center has been a creative haven for 15 years, but our building needs critical renovations to continue serving artists of all ages and backgrounds.",
    longDescription: "The Community Art Center has been the creative heart of our neighborhood for over a decade. Our mission is to make art accessible to everyone, regardless of economic background or formal training. We offer classes, exhibition space, and community events that bring people together through creativity.\n\nHowever, our aging facility now faces serious structural issues that threaten our ability to continue. The roof leaks during rainstorms, our heating system is failing, and our space isn't fully accessible to people with mobility challenges.\n\nWith your support, we'll repair the building's infrastructure, improve accessibility with a wheelchair ramp and accessible restrooms, and update our studio equipment so we can continue serving our community for years to come.",
    updates: [
      {
        date: "July 10, 2023",
        title: "Renovation plans finalized",
        content: "We're excited to share that we've finalized our renovation plans with a local architect who specializes in community spaces. Construction is scheduled to begin next month!"
      }
    ],
    faqs: [
      {
        question: "Will the center remain open during renovations?",
        answer: "We'll maintain limited operations during the renovation period, with some classes relocated to partner facilities nearby."
      },
      {
        question: "How can I volunteer to help with the renovation project?",
        answer: "We'll be organizing volunteer days for painting and finishing work. Sign up on our website to be notified when these opportunities become available."
      }
    ]
  },
  {
    id: "tech-training",
    title: "Tech Training Program for Underserved Youth",
    creator: "Future Coders Initiative",
    creatorAvatar: "/placeholder.svg",
    raised: 18500,
    goal: 20000,
    daysLeft: 12,
    backers: 210,
    category: "Technology",
    description: "Providing coding bootcamps and mentorship for youth from underserved communities.",
    longDescription: "The Future Coders Initiative bridges the digital divide by providing intensive tech training to young people from underserved communities. Our program combines technical skills development with mentorship from industry professionals.\n\nStudents learn coding, design thinking, and professional skills in our 12-week bootcamp. Upon completion, we connect graduates with internship and job opportunities through our network of tech company partners.\n\nYour funding supports instructor salaries, equipment for students, classroom space, and the development of our curriculum. With your help, we can expand our program to reach more students and create pathways to careers in technology.",
    updates: [
      {
        date: "August 5, 2023",
        title: "Spring cohort graduation",
        content: "Last week, we celebrated the graduation of 25 students from our spring cohort. 80% of graduates have already secured internships or full-time positions in the tech industry!"
      }
    ],
    faqs: [
      {
        question: "What age group does your program serve?",
        answer: "Our program is designed for youth ages 16-24 who have limited access to technology education."
      },
      {
        question: "Do students need prior coding experience?",
        answer: "No prior experience is required. We start with fundamentals and build progressively."
      }
    ]
  }
];

// Donation amount options
const donationOptions = [10, 25, 50, 100, 250, 500];

const ProjectDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("about");
  const [donationAmount, setDonationAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState("");
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  
  // Find the project based on the URL parameter
  const project = projectsData.find(p => p.id === id);
  
  if (!project) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
          <p className="mb-6">The project you are looking for does not exist or has been removed.</p>
          <Link to="/projects">
            <Button>Browse Projects</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }
  
  const progress = (project.raised / project.goal) * 100;
  
  const handleDonate = () => {
    const amount = isCustomAmount ? Number(customAmount) : donationAmount;
    
    if (amount <= 0) {
      toast.error("Please enter a valid donation amount");
      return;
    }
    
    // In a real app, this would connect to a payment processor
    toast.success(`Thank you for donating $${amount}! This would connect to a payment system in a production environment.`);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Link to="/projects" className="inline-flex items-center text-sm mb-6 text-muted-foreground hover:text-foreground">
          ← Back to all projects
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="aspect-video bg-muted rounded-lg mb-6 relative">
              <div className="absolute top-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                {project.category}
              </div>
            </div>
            
            <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
            
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-muted overflow-hidden mr-3">
                <img src={project.creatorAvatar} alt={project.creator} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created by</p>
                <p className="font-medium">{project.creator}</p>
              </div>
            </div>
            
            <Tabs defaultValue="about" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="updates">Updates</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
              </TabsList>
              <TabsContent value="about" className="pt-6">
                <p className="text-lg mb-4">{project.description}</p>
                <div className="whitespace-pre-line text-muted-foreground">
                  {project.longDescription}
                </div>
              </TabsContent>
              <TabsContent value="updates" className="pt-6">
                {project.updates.length > 0 ? (
                  <div className="space-y-6">
                    {project.updates.map((update, index) => (
                      <div key={index} className="border-b pb-6 last:border-b-0">
                        <p className="text-sm text-muted-foreground">{update.date}</p>
                        <h3 className="text-xl font-semibold mb-2">{update.title}</h3>
                        <p>{update.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No updates have been posted yet.</p>
                )}
              </TabsContent>
              <TabsContent value="faq" className="pt-6">
                {project.faqs.length > 0 ? (
                  <div className="space-y-6">
                    {project.faqs.map((faq, index) => (
                      <div key={index} className="border-b pb-6 last:border-b-0">
                        <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No FAQs available for this project.</p>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Donation Sidebar */}
          <div>
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <span className="text-2xl font-bold">${project.raised.toLocaleString()}</span>
                      <span className="text-muted-foreground"> raised of ${project.goal.toLocaleString()}</span>
                    </div>
                    <span className="text-sm font-medium">{Math.round(progress)}%</span>
                  </div>
                  <div className="relative h-2 bg-muted rounded-full">
                    <div 
                      className="absolute top-0 left-0 h-full bg-primary rounded-full" 
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span><strong>{project.backers}</strong> backers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span><strong>{project.daysLeft}</strong> days left</span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-lg mb-4">Support this project</h3>
                
                {!isCustomAmount ? (
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {donationOptions.map(amount => (
                      <Button
                        key={amount}
                        variant={donationAmount === amount ? "default" : "outline"}
                        onClick={() => setDonationAmount(amount)}
                        className="text-lg"
                      >
                        ${amount}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => setIsCustomAmount(true)}
                      className="col-span-3"
                    >
                      Custom Amount
                    </Button>
                  </div>
                ) : (
                  <div className="mb-4">
                    <div className="flex items-center">
                      <span className="text-xl mr-2">$</span>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="text-lg"
                        autoFocus
                      />
                    </div>
                    <Button
                      variant="link"
                      onClick={() => {
                        setIsCustomAmount(false);
                        setCustomAmount("");
                      }}
                      className="mt-2 p-0 h-auto"
                    >
                      Choose preset amount
                    </Button>
                  </div>
                )}
                
                <Button 
                  className="w-full text-lg mb-4"
                  onClick={handleDonate}
                >
                  <HandCoins className="mr-2 h-5 w-5" />
                  Donate Now
                </Button>
                
                <Alert className="bg-muted/50">
                  <AlertDescription className="text-sm">
                    All donations are processed securely. You'll receive a receipt via email after your donation.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Similar Projects Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Similar Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projectsData
              .filter(p => p.id !== id && p.category === project.category)
              .slice(0, 3)
              .map((p, index) => (
                <Card key={index} className="overflow-hidden transition-all hover:shadow-lg">
                  <div className="aspect-video bg-muted relative">
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                      {p.category}
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{p.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">by {p.creator}</p>
                    
                    <div className="relative h-2 bg-muted rounded-full mb-2">
                      <div 
                        className="absolute top-0 left-0 h-full bg-primary rounded-full" 
                        style={{ width: `${Math.min((p.raised / p.goal) * 100, 100)}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">${p.raised.toLocaleString()} raised</span>
                      <span className="text-muted-foreground">${p.goal.toLocaleString()} goal</span>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm text-muted-foreground">{p.daysLeft} days left</span>
                      <Link to={`/projects/${p.id}`}>
                        <Button variant="outline" size="sm">View Project</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {projectsData.filter(p => p.id !== id && p.category === project.category).length === 0 && (
                <p className="col-span-3 text-center py-8 text-muted-foreground">
                  No similar projects found at this time.
                </p>
              )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProjectDetail;
