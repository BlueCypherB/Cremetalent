import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  WashingMachine, 
  Wind, 
  Clock, 
  DollarSign, 
  Wifi, 
  CreditCard, 
  MapPin,
  Phone,
  Mail,
  Check
} from 'lucide-react';

const ServiceCard = ({ icon: Icon, title, description }: { 
  icon: React.ElementType, 
  title: string, 
  description: string 
}) => (
  <Card className="service-card">
    <CardContent className="p-6">
      <Icon className="h-10 w-10 text-laundry-500 mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const FeatureItem = ({ icon: Icon, title }: { icon: React.ElementType, title: string }) => (
  <div className="flex items-center space-x-3">
    <div className="bg-laundry-100 p-2 rounded-full">
      <Icon className="h-5 w-5 text-laundry-600" />
    </div>
    <span className="text-gray-700">{title}</span>
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-gradient text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="animate-fade-in">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">Clean Clothes, Happy You</h1>
              <p className="text-xl mb-6">
                Modern machines, clean environment, and affordable prices. 
                Your neighborhood laundromat that makes laundry day a breeze.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-laundry-600 hover:bg-laundry-50">
                  View Services
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/20">
                  Find Location
                </Button>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <img 
                src="/placeholder.svg" 
                alt="Modern Laundromat" 
                className="w-full max-w-lg rounded-lg shadow-xl" 
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section id="services" className="py-16 bg-laundry-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We offer a variety of laundry services to meet your needs.
              All machines are energy-efficient and regularly maintained.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCard 
              icon={WashingMachine} 
              title="Self-Service Washing" 
              description="High-efficiency washers with multiple load sizes available. Use our app to monitor your wash remotely."
            />
            <ServiceCard 
              icon={Wind} 
              title="Fast Dryers" 
              description="Our dryers are designed for quick, efficient drying to save you time and energy costs."
            />
            <ServiceCard 
              icon={Clock} 
              title="Wash & Fold Service" 
              description="Drop off your laundry and pick it up clean, dried, and folded at your convenience."
            />
            <ServiceCard 
              icon={DollarSign} 
              title="Affordable Pricing" 
              description="Competitive prices with loyalty programs and special discounts for regular customers."
            />
            <ServiceCard 
              icon={Wifi} 
              title="Free Wi-Fi" 
              description="Stay connected with our free high-speed Wi-Fi while waiting for your laundry."
            />
            <ServiceCard 
              icon={CreditCard} 
              title="Multiple Payment Options" 
              description="Pay with cash, credit card, or our convenient mobile payment app."
            />
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Pricing</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transparent pricing with no hidden fees. We offer various options to suit your laundry needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="border-laundry-200">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Washing Machines</h3>
                <ul className="space-y-3 mb-4">
                  <li className="flex justify-between">
                    <span>Small Load (15 lb)</span>
                    <span className="font-semibold">$2.50</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Medium Load (25 lb)</span>
                    <span className="font-semibold">$3.75</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Large Load (35 lb)</span>
                    <span className="font-semibold">$5.00</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Extra Large (50 lb)</span>
                    <span className="font-semibold">$7.50</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-laundry-200">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Dryers</h3>
                <ul className="space-y-3 mb-4">
                  <li className="flex justify-between">
                    <span>10 Minutes</span>
                    <span className="font-semibold">$0.75</span>
                  </li>
                  <li className="flex justify-between">
                    <span>30 Minutes</span>
                    <span className="font-semibold">$2.00</span>
                  </li>
                  <li className="flex justify-between">
                    <span>45 Minutes</span>
                    <span className="font-semibold">$3.00</span>
                  </li>
                  <li className="flex justify-between">
                    <span>60 Minutes</span>
                    <span className="font-semibold">$3.75</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-laundry-200">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Wash & Fold</h3>
                <ul className="space-y-3 mb-4">
                  <li className="flex justify-between">
                    <span>Per Pound</span>
                    <span className="font-semibold">$1.75</span>
                  </li>
                  <li className="flex justify-between">
                    <span>10+ lb Discount</span>
                    <span className="font-semibold">$1.50/lb</span>
                  </li>
                  <li className="flex justify-between">
                    <span>20+ lb Discount</span>
                    <span className="font-semibold">$1.25/lb</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Same-day Service</span>
                    <span className="font-semibold">+$10</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* About/Features Section */}
      <section id="about" className="py-16 bg-gradient-to-b from-white to-laundry-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">About Our Facility</h2>
              <p className="text-lg text-gray-700 mb-6">
                SpinCycle Laundromat is committed to providing a clean, safe, and efficient laundry experience. 
                Our modern facility features state-of-the-art equipment and amenities to make your laundry day as pleasant as possible.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FeatureItem icon={Check} title="Modern Machines" />
                <FeatureItem icon={Check} title="Free Wi-Fi" />
                <FeatureItem icon={Check} title="Ample Parking" />
                <FeatureItem icon={Check} title="Digital Payments" />
                <FeatureItem icon={Check} title="Security Cameras" />
                <FeatureItem icon={Check} title="Attendant On-site" />
                <FeatureItem icon={Check} title="Vending Machines" />
                <FeatureItem icon={Check} title="Folding Tables" />
              </div>
              
              <Button className="mt-8" size="lg">Learn More About Us</Button>
            </div>
            
            <div className="rounded-xl overflow-hidden shadow-xl">
              <img 
                src="/placeholder.svg" 
                alt="Inside our facility" 
                className="w-full h-auto" 
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Location Section */}
      <section id="location" className="py-16 bg-laundry-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Find Us</h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Conveniently located in your neighborhood with ample parking and easy access.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <MapPin className="h-8 w-8 text-laundry-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Address</h3>
                <p className="text-gray-700">123 Wash Street</p>
                <p className="text-gray-700">Cleanville, CA 90210</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <Phone className="h-8 w-8 text-laundry-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Phone</h3>
                <p className="text-gray-700">(555) 123-4567</p>
                <p className="text-gray-700 text-sm">Call us for any questions!</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <Mail className="h-8 w-8 text-laundry-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Email</h3>
                <p className="text-gray-700">info@spincycle.com</p>
                <p className="text-gray-700 text-sm">We'll respond within 24 hours</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-12 bg-white rounded-xl overflow-hidden shadow-xl h-80 md:h-96">
            {/* Map placeholder - In a real project, you would integrate Google Maps or another map provider */}
            <div className="w-full h-full bg-laundry-200 flex items-center justify-center">
              <p className="text-laundry-800 text-lg">Interactive Map Would Be Here</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action Section */}
      <section className="py-16 bg-laundry-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience Hassle-Free Laundry?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Visit SpinCycle Laundromat today and discover why we're the preferred choice in the neighborhood.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-white text-laundry-600 hover:bg-laundry-50">
              Get Directions
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white hover:bg-white/20">
              Call Now
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
