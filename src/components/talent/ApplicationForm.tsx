import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';

const ApplicationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    specialization: '',
    experienceLevel: '',
    availability: '',
    bio: '',
    skills: '',
    portfolioUrl: '',
    resumeFile: null as File | null,
    linkedin: '',
    instagram: '',
    twitter: '',
    heardFrom: '',
    acceptTerms: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        // @ts-ignore - TypeScript doesn't know this is a checkbox input
        [name]: e.target.checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        resumeFile: e.target.files[0]
      });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      try {
        // Save application data to pending applications in localStorage
        const existingApplications = localStorage.getItem('pendingTalentApplications');
        let applications = existingApplications ? JSON.parse(existingApplications) : [];
        
        // Add new application
        applications.push({...formData});
        
        // Save back to localStorage
        localStorage.setItem('pendingTalentApplications', JSON.stringify(applications));
        
        // Show success message
        toast({
          title: "Application Submitted",
          description: "Your talent profile has been submitted for review. We will notify you once it's approved.",
        });
        
        // Send notification email to admin
        sendAdminNotificationEmail(formData);
        
        // Send confirmation email to applicant
        sendApplicantConfirmationEmail(formData.email, formData.firstName);
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          city: '',
          country: '',
          specialization: '',
          experienceLevel: '',
          availability: '',
          bio: '',
          skills: '',
          portfolioUrl: '',
          resumeFile: null,
          linkedin: '',
          instagram: '',
          twitter: '',
          heardFrom: '',
          acceptTerms: false
        });
        
        // Redirect back to talent pool page
        setTimeout(() => {
          navigate('/talent-pool');
        }, 1500);
      } catch (error) {
        console.error("Error submitting application:", error);
        toast({
          title: "Submission Error",
          description: "There was an error submitting your application. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }, 1000);
  };

  // Helper function to send notification email to admin
  const sendAdminNotificationEmail = (applicationData: typeof formData) => {
    console.log('Sending admin notification email about new application');
    console.log(`Sending to: Cremetalentafrica@gmail.com`);
    console.log(`Applicant: ${applicationData.firstName} ${applicationData.lastName}`);
    console.log(`Email: ${applicationData.email}`);
    console.log(`Specialization: ${applicationData.specialization}`);
    
    // In a real application, this would send an actual email
    // For now, we're just logging to the console
  };

  // Helper function to send confirmation email to applicant
  const sendApplicantConfirmationEmail = (email: string, firstName: string) => {
    console.log(`Sending confirmation email to ${email}`);
    console.log(`Subject: Application Received - CrémeTalent`);
    console.log(`Message: Dear ${firstName}, thank you for your application. We have received your submission and will review it shortly.`);
    
    // In a real application, this would send an actual email
    // For now, we're just logging to the console
  };
  
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Talent Application</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name*</Label>
              <Input 
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name*</Label>
              <Input 
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email*</Label>
              <Input 
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number*</Label>
              <Input 
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City*</Label>
              <Input 
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="country">Country*</Label>
              <Input 
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>
        
        {/* Professional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Professional Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="specialization">Specialization*</Label>
              <select 
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Select Specialization</option>
                <option value="Graphic Design">Graphic Design</option>
                <option value="UX/UI Design">UX/UI Design</option>
                <option value="Copywriting">Copywriting</option>
                <option value="Brand Strategy">Brand Strategy</option>
                <option value="Photography">Photography</option>
                <option value="Videography">Videography</option>
                <option value="Social Media">Social Media</option>
                <option value="Web Development">Web Development</option>
                <option value="App Development">App Development</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Animation">Animation</option>
                <option value="Illustration">Illustration</option>
                <option value="Content Creation">Content Creation</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <Label htmlFor="experienceLevel">Experience Level*</Label>
              <select 
                id="experienceLevel"
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Select Experience Level</option>
                <option value="Beginner">Beginner (0-1 years)</option>
                <option value="Intermediate">Intermediate (2-4 years)</option>
                <option value="Advanced">Advanced (5+ years)</option>
              </select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="availability">Availability*</Label>
            <select 
              id="availability"
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select Availability</option>
              <option value="Immediate">Immediate</option>
              <option value="Two weeks">2 weeks notice</option>
              <option value="One month">1 month notice</option>
              <option value="Custom">Custom notice period</option>
            </select>
          </div>
          
          <div>
            <Label htmlFor="bio">Professional Bio*</Label>
            <Textarea 
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about your professional background, skills, and experience..."
              className="min-h-[150px]"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="skills">Skills* (comma-separated)</Label>
            <Input 
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g., Adobe Photoshop, Copywriting, Social Media Strategy"
              required
            />
          </div>
        </div>
        
        {/* Portfolio & Resume */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Portfolio & Resume</h3>
          
          <div>
            <Label htmlFor="portfolioUrl">Portfolio URL</Label>
            <Input 
              id="portfolioUrl"
              name="portfolioUrl"
              type="url"
              value={formData.portfolioUrl}
              onChange={handleChange}
              placeholder="https://yourportfolio.com"
            />
          </div>
          
          <div>
            <Label htmlFor="resumeFile">Resume/CV (PDF)</Label>
            <Input 
              id="resumeFile"
              name="resumeFile"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200"
            />
          </div>
        </div>
        
        {/* Social Media & Referral */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Social Media & Referral</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="linkedin">LinkedIn Profile</Label>
              <Input 
                id="linkedin"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div>
              <Label htmlFor="instagram">Instagram Profile</Label>
              <Input 
                id="instagram"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                placeholder="@username"
              />
            </div>
            <div>
              <Label htmlFor="twitter">Twitter/X Profile</Label>
              <Input 
                id="twitter"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                placeholder="@username"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="heardFrom">How did you hear about us?</Label>
            <select 
              id="heardFrom"
              name="heardFrom"
              value={formData.heardFrom}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select option</option>
              <option value="Social Media">Social Media</option>
              <option value="Friend or Colleague">Friend or Colleague</option>
              <option value="Search Engine">Search Engine</option>
              <option value="Event">Event</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        
        {/* Terms & Conditions */}
        <div className="space-y-4">
          <div className="flex items-top space-x-2">
            <input 
              id="acceptTerms"
              name="acceptTerms"
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="mt-1"
              required
            />
            <Label htmlFor="acceptTerms" className="text-sm">
              I agree to the Terms and Conditions and acknowledge that my data will be used in accordance with the Privacy Policy. I consent to being contacted about opportunities matching my profile.*
            </Label>
          </div>
        </div>
        
        <div className="pt-4">
          <Button 
            type="submit"
            size="lg" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;
