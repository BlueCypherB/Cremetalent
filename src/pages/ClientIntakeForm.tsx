
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ClientIntakeForm from '@/components/client/ClientIntakeForm';

const ClientIntakeFormPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow bg-gradient-to-b from-white to-amber-50/30">
        <div className="container mx-auto">
          <div className="py-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Client Intake Form</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Please complete this form to help us understand your creative needs and match you with the perfect talent.
            </p>
          </div>
          
          <ClientIntakeForm />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ClientIntakeFormPage;
