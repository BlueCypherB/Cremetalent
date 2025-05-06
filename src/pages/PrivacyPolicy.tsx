
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Separator } from "@/components/ui/separator";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section className="py-12 bg-white flex-grow">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last Updated: May 1, 2025</p>
          
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold mt-8 mb-4">Introduction</h2>
            <p>
              At CrémeTalent ("we," "our," or "us"), we respect your privacy and are committed to protecting 
              the personal information you share with us. This Privacy Policy explains how we collect, use, 
              disclose, and safeguard your information when you use our website and services.
            </p>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
            <p>
              We collect information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Create an account or profile</li>
              <li>Apply to join our talent pool</li>
              <li>Submit a request for creative talent</li>
              <li>Contact us through our website</li>
              <li>Subscribe to our newsletter</li>
              <li>Participate in surveys or feedback</li>
            </ul>
            
            <p className="mt-4">
              This information may include:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Personal identifiers (name, email address, phone number)</li>
              <li>Professional information (resume, portfolio, skills, experience)</li>
              <li>Employment history and preferences</li>
              <li>Communication records between you and CrémeTalent</li>
            </ul>
            
            <p className="mt-4">
              We also automatically collect certain information when you visit our website, such as:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>IP address and device information</li>
              <li>Browser type and operating system</li>
              <li>Pages viewed and time spent on our website</li>
              <li>Referring website or source</li>
            </ul>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Provide and improve our services</li>
              <li>Match creative professionals with appropriate opportunities</li>
              <li>Communicate with you about our services</li>
              <li>Respond to your inquiries and support requests</li>
              <li>Send you relevant updates and promotional materials (with your consent)</li>
              <li>Process applications and manage talent profiles</li>
              <li>Analyze and improve our website performance and user experience</li>
              <li>Protect our services and prevent fraud</li>
            </ul>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Information Sharing and Disclosure</h2>
            <p>
              We may share your information with:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Potential employers or clients (with your consent)</li>
              <li>Service providers who help us operate our business</li>
              <li>Legal authorities when required by law</li>
              <li>Professional advisors (attorneys, accountants, etc.)</li>
            </ul>
            
            <p className="mt-4">
              We do not sell your personal information to third parties.
            </p>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect the security 
              of your personal information. However, no method of transmission over the Internet or 
              electronic storage is 100% secure, so we cannot guarantee absolute security.
            </p>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Your Rights and Choices</h2>
            <p>
              Depending on your location, you may have rights regarding your personal information, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Accessing your personal information</li>
              <li>Correcting inaccurate information</li>
              <li>Deleting your personal information</li>
              <li>Restricting or objecting to certain processing</li>
              <li>Data portability</li>
              <li>Withdrawing consent</li>
            </ul>
            
            <p className="mt-4">
              To exercise these rights, please contact us using the information provided below.
            </p>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience on our website, 
              analyze usage patterns, and deliver personalized content. You can control cookies through your 
              browser settings, although this may limit certain functionalities of our website.
            </p>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Children's Privacy</h2>
            <p>
              Our services are not directed to individuals under the age of 18. We do not knowingly collect 
              personal information from children. If we learn that we have collected personal information from 
              a child under 18, we will take steps to delete such information.
            </p>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. The updated version will be indicated by 
              an updated "Last Updated" date. We encourage you to review this Privacy Policy periodically.
            </p>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <p className="mt-4">
              CrémeTalent<br />
              123 Creative Avenue<br />
              Talent City, CA 90210<br />
              Email: privacy@cremetalent.com<br />
              Phone: (555) 123-4567
            </p>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
