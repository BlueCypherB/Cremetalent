import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from "@/components/ui/card";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Linkedin, 
  Instagram, 
  X
} from 'lucide-react';
import ClientIntakeForm from '@/components/client/ClientIntakeForm';

const ContactInfoCard = ({ 
  icon: Icon, 
  title, 
  content, 
  link 
}: { 
  icon: React.ElementType; 
  title: string; 
  content: string;
  link?: string;
}) => (
  <Card className="h-full">
    <CardContent className="p-6 flex flex-col items-center text-center">
      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-amber-600" />
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      {link ? (
        <a href={link} className="text-primary hover:underline">
          {content}
        </a>
      ) : (
        <p className="text-muted-foreground">{content}</p>
      )}
    </CardContent>
  </Card>
);

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Reach out to discuss how CrémeTalent can help with your creative recruitment needs or career development.
          </p>
        </div>
      </section>
      
      {/* Contact Info & Client Intake Form Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Side - Contact Info */}
            <div className="lg:col-span-4">
              <h2 className="text-3xl font-bold mb-6">Our Contact Information</h2>
              <p className="text-muted-foreground mb-8">
                You can reach us using the information below or visit our office during business hours.
              </p>
              
              <div className="grid grid-cols-1 gap-6 mb-8">
                <ContactInfoCard 
                  icon={Phone} 
                  title="Phone" 
                  content="+234 9077937879"
                  link="tel:+2349077937879"
                />
                
                <ContactInfoCard 
                  icon={Mail} 
                  title="Email" 
                  content="Cremetalentafrica@gmail.com"
                  link="mailto:Cremetalentafrica@gmail.com"
                />
                
                <ContactInfoCard 
                  icon={MapPin} 
                  title="Office Address" 
                  content="Federal Capital City, Abuja, Nigeria"
                />
                
                <ContactInfoCard 
                  icon={Clock} 
                  title="Business Hours" 
                  content="Mon-Fri: 9AM-5PM, Weekends: Closed"
                />
              </div>
              
              <div className="bg-amber-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-4">Connect With Us</h3>
                <div className="flex justify-center space-x-6">
                  <a href="https://www.linkedin.com" className="bg-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-amber-100 transition-colors">
                    <Linkedin className="h-5 w-5 text-amber-600" />
                  </a>
                  <a href="https://www.instagram.com/cremetalentafrica?igsh=MTFmejR1aXE5b2R0bQ%3D%3D&utm_source=qr" className="bg-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-amber-100 transition-colors">
                    <Instagram className="h-5 w-5 text-amber-600" />
                  </a>
                  <a href="https://x.com/cremetalenta?s=21" className="bg-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-amber-100 transition-colors">
                    <X className="h-5 w-5 text-amber-600" />
                  </a>
                </div>
              </div>
            </div>
            
            {/* Right Side - Client Intake Form */}
            <div className="lg:col-span-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-amber-200">
                <h2 className="text-3xl font-bold mb-2 text-center">CreméTalentAfrica – Client Intake Form</h2>
                <p className="text-center text-muted-foreground mb-6">Helping You Find the Right Creatives for Your Vision</p>
                <ClientIntakeForm />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="bg-amber-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Visit Our Office</h2>
          {/* This would typically be an embedded map - placeholder for now */}
          <div className="w-full h-80 bg-white rounded-lg border flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-amber-300 mx-auto mb-4" />
              <p className="text-muted-foreground">
                Interactive map would be displayed here.<br />
                Our office is located at: Federal Capital City, Abuja, Nigeria
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Contact;
