
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ApplicationForm from '@/components/talent/ApplicationForm';

const JoinTalentPool = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-100 via-amber-50 to-background py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Join Our Talent Pool</h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Showcase your creative skills and connect with exciting opportunities. 
            We're looking for talented professionals across various creative disciplines.
          </p>
        </div>
      </section>
      
      {/* Application Form Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <ApplicationForm />
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Benefits of Joining</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-amber-600">Connect with Clients</h3>
              <p className="text-gray-600">
                Get matched with clients seeking your specific creative skills and expertise.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-amber-600">Flexible Opportunities</h3>
              <p className="text-gray-600">
                Find work that fits your schedule, whether you're looking for freelance gigs or full-time positions.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-amber-600">Grow Your Network</h3>
              <p className="text-gray-600">
                Connect with other creative professionals and expand your professional network.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default JoinTalentPool;
