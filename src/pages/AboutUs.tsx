
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from "@/components/ui/card";
import { 
  Heart, 
  Lightbulb, 
  Shield, 
  Award, 
  Brush,
  Users
} from 'lucide-react';

const ValueCard = ({ icon: Icon, title, description }: { 
  icon: React.ElementType, 
  title: string, 
  description: string 
}) => (
  <Card className="h-full">
    <CardContent className="p-6 flex flex-col h-full items-center text-center">
      <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-amber-600" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const TeamMember = ({
  name,
  role,
  bio,
  image
}: {
  name: string;
  role: string;
  bio: string;
  image?: string;
}) => (
  <Card className="h-full">
    <CardContent className="p-6 flex flex-col items-center text-center">
      {image ? (
        <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center mb-4">
          <span className="text-amber-600 font-bold text-2xl">{name.charAt(0)}</span>
        </div>
      )}
      <h3 className="text-xl font-semibold">{name}</h3>
      <p className="text-amber-600 mb-4">{role}</p>
      <p className="text-muted-foreground">{bio}</p>
    </CardContent>
  </Card>
);

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About CrémeTalent</h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Our mission is to empower the creative economy by connecting exceptional talent with opportunities that make a difference.
          </p>
        </div>
      </section>
      
      {/* Our Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-lg text-muted-foreground mb-4">
                Born from a passion for nurturing talent, CrémeTalent was founded by industry professionals who 
                recognized the need for a dedicated platform to support creatives.
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                With years of experience in recruitment and a deep understanding of the creative landscape, 
                we've built a network that bridges the gap between talent and opportunity.
              </p>
              <p className="text-lg text-muted-foreground">
                Our journey began with a simple idea: to create a space where creative professionals could thrive 
                and businesses could find the exact talent they need to bring their visions to life.
              </p>
            </div>
            <div className="flex justify-center">
              <img 
                src="/lovable-uploads/2c7d8a69-0dd5-4145-a9b4-d627a7fe4ef1.png" 
                alt="Our team collaborating" 
                className="rounded-lg shadow-lg max-w-md w-full" 
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Core Values Section */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              These principles guide everything we do at CrémeTalent.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ValueCard 
              icon={Heart} 
              title="Empowerment" 
              description="We are dedicated to enabling creatives to reach their full potential through resources, connections, and opportunities."
            />
            <ValueCard 
              icon={Lightbulb} 
              title="Innovation" 
              description="We constantly embrace new ideas and approaches to stay ahead in the ever-evolving creative industry."
            />
            <ValueCard 
              icon={Shield} 
              title="Integrity" 
              description="We build trust through transparency and honesty in all our interactions with clients and creative professionals."
            />
            <ValueCard 
              icon={Award} 
              title="Excellence" 
              description="We strive for the highest standards in our recruitment processes, training programs, and client services."
            />
            <ValueCard 
              icon={Brush} 
              title="Creativity" 
              description="We celebrate and foster creative expression, recognizing it as the driving force of the industries we serve."
            />
            <ValueCard 
              icon={Users} 
              title="Collaboration" 
              description="We believe in the power of teamwork and partnership, bringing together diverse talents to achieve exceptional results."
            />
          </div>
        </div>
      </section>
      
      {/* Our Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The dedicated professionals behind CrémeTalent bring diverse expertise in recruitment, training, and talent management.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <TeamMember 
              name="Pamela Williams"
              role="CEO"
              bio="With over 6 years in creative recruitment and brand strategy, Pamela founded CrémeTalent to create meaningful connections between talent and opportunity."
            />
            <TeamMember 
              name="Abdulbari Sulaiman"
              role="Technical Director"
              bio="Abdulbari leads our technical operations, ensuring that our platform and digital tools effectively connect creative talent with the right opportunities."
            />
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
