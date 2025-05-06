
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Separator } from "@/components/ui/separator";

const TermsConditions = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section className="py-12 bg-white flex-grow">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
          <p className="text-muted-foreground mb-8">Last Updated: May 1, 2025</p>
          
          <div className="prose max-w-none">
            <p>
              Welcome to CrémeTalent. These Terms and Conditions ("Terms") govern your use of our website 
              and services. By accessing or using our website and services, you agree to be bound by these Terms.
            </p>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Definitions</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>"CrémeTalent," "we," "our," or "us" refers to CrémeTalent, the company operating this website.</li>
              <li>"Services" refers to all services offered by CrémeTalent, including talent recruitment, training, and management.</li>
              <li>"User," "you," or "your" refers to any individual or entity using our website or services.</li>
              <li>"Creative Professional" refers to individuals seeking employment or projects through our platform.</li>
              <li>"Client" refers to businesses seeking creative talent through our platform.</li>
            </ul>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Account Registration</h2>
            <p>
              To access certain features of our service, you may need to create an account. You agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Provide accurate and complete information during registration</li>
              <li>Maintain the security of your account credentials</li>
              <li>Promptly update any changes to your account information</li>
              <li>Accept responsibility for all activities that occur under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Services</h2>
            <h3 className="text-xl font-medium mt-6 mb-3">3.1 For Creative Professionals</h3>
            <p>
              By joining our talent pool, you:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Authorize us to represent your professional profile to potential employers</li>
              <li>Agree to provide accurate information about your skills, experience, and availability</li>
              <li>Acknowledge that we do not guarantee employment or specific opportunities</li>
              <li>Commit to maintaining professional conduct in all interactions</li>
            </ul>
            
            <h3 className="text-xl font-medium mt-6 mb-3">3.2 For Clients</h3>
            <p>
              When using our services to find creative talent, you:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Agree to provide accurate information about your company and talent needs</li>
              <li>Accept our fee structure as outlined in your service agreement</li>
              <li>Commit to evaluating candidates fairly and professionally</li>
              <li>Acknowledge that final hiring decisions remain your responsibility</li>
            </ul>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Intellectual Property</h2>
            <p>
              All content on our website, including text, graphics, logos, images, and software, 
              is the property of CrémeTalent or our licensors and is protected by intellectual property laws.
            </p>
            <p className="mt-4">
              You may not reproduce, distribute, modify, create derivative works of, publicly display, 
              or exploit any content from our website without our express written permission.
            </p>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. User Content</h2>
            <p>
              By submitting content to our platform (including portfolios, resumes, and project descriptions), you:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Retain all ownership rights to your content</li>
              <li>Grant us a non-exclusive, royalty-free license to use, display, and distribute your content for the purpose of providing our services</li>
              <li>Represent that you have the right to share such content</li>
              <li>Understand that you are solely responsible for the content you submit</li>
            </ul>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Prohibited Activities</h2>
            <p>
              You agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Use our services for any unlawful purpose</li>
              <li>Submit false or misleading information</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the proper functioning of our website</li>
              <li>Engage in discriminatory practices or harassment</li>
              <li>Circumvent our fee structure or payment processes</li>
              <li>Use our services to spam or solicit others</li>
            </ul>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Payment and Fees</h2>
            <p>
              Fee structures for our services are outlined in separate service agreements. 
              By using our paid services, you agree to pay all applicable fees as described 
              in those agreements.
            </p>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, CrémeTalent shall not be liable for any 
              indirect, incidental, special, consequential, or punitive damages resulting from 
              your use of or inability to use our services.
            </p>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless CrémeTalent and its officers, directors, 
              employees, and agents from any claims, damages, liabilities, costs, or expenses 
              arising from your use of our services or violation of these Terms.
            </p>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">10. Modifications to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Updated Terms will be posted 
              on our website with a revised "Last Updated" date. Your continued use of our services 
              after such changes constitutes acceptance of the updated Terms.
            </p>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">11. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your access to our services at our discretion, 
              without notice, for conduct that we believe violates these Terms or is harmful to other users, 
              us, or third parties.
            </p>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">12. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of 
              California, without regard to its conflict of law provisions.
            </p>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">13. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="mt-4">
              CrémeTalent<br />
              123 Creative Avenue<br />
              Talent City, CA 90210<br />
              Email: legal@cremetalent.com<br />
              Phone: (555) 123-4567
            </p>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default TermsConditions;
