import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ClientIntakeForm from '@/components/client/ClientIntakeForm';

const ClientIntakeFormPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow hero-gradient relative overflow-hidden">
        <div className="hero-ripple" aria-hidden="true" />
        <div className="container mx-auto relative">
          <div className="pt-16 pb-8 text-center max-w-3xl mx-auto px-4">
            <span className="eyebrow mb-5 mx-auto">Client Intake</span>
            <h1 className="display-xl text-4xl md:text-6xl font-semibold mb-4 leading-[1.1]">
              Tell us about your <em className="not-italic text-primary">project</em>.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A few quick steps to help us match you with the right creatives. We'll review your brief and reach out within 2 business days.
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
