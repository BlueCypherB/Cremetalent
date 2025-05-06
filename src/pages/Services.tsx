
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { 
  Users, 
  GraduationCap, 
  Award, 
  Briefcase, 
  HandHeart, 
  FileText,
  CheckCircle2
} from 'lucide-react';

const Services = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive solutions for creative professionals and the businesses that need them.
          </p>
        </div>
      </section>
      
      {/* For Creatives Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">For Creative Professionals</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Talent Pool Application */}
            <Card className="h-full">
              <CardHeader>
                <div className="mb-4 text-primary">
                  <Users className="h-12 w-12" />
                </div>
                <CardTitle>Talent Pool Application</CardTitle>
                <CardDescription>Join our exclusive network of creative professionals</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-6 text-muted-foreground">
                  Become part of our curated community of creative talent and gain access to exceptional opportunities.
                </p>
                <h4 className="font-semibold mb-4">Benefits include:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Access to top-tier clients across various industries</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Complimentary training programs to enhance your skills</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Ongoing career development support and guidance</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Opportunities across multiple creative disciplines</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link to="/talent-pool" className="w-full">
                  <Button className="w-full">Apply Now</Button>
                </Link>
              </CardFooter>
            </Card>
            
            {/* Training & Development */}
            <Card className="h-full">
              <CardHeader>
                <div className="mb-4 text-primary">
                  <GraduationCap className="h-12 w-12" />
                </div>
                <CardTitle>Training & Development</CardTitle>
                <CardDescription>Enhance your skills and stay ahead in your field</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-6 text-muted-foreground">
                  Our comprehensive training modules help creative professionals refine their skills and adapt to industry changes.
                </p>
                <h4 className="font-semibold mb-4">Our training covers:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Operational excellence in creative workflows</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Industry-specific workshops with experienced leaders</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Creative innovation techniques and methodologies</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link to="/training-resources" className="w-full">
                  <Button variant="outline" className="w-full">Explore Training</Button>
                </Link>
              </CardFooter>
            </Card>
            
            {/* Talent Management */}
            <Card className="h-full">
              <CardHeader>
                <div className="mb-4 text-primary">
                  <Award className="h-12 w-12" />
                </div>
                <CardTitle>Talent Management</CardTitle>
                <CardDescription>Continuous support for your creative career</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-6 text-muted-foreground">
                  Our talent management services help creative professionals navigate their careers and maximize their potential.
                </p>
                <h4 className="font-semibold mb-4">We offer:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Personalized career guidance and planning</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Regular performance reviews and feedback</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Continuous development and growth opportunities</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link to="/contact" className="w-full">
                  <Button variant="outline" className="w-full">Learn More</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
      
      {/* For Clients Section */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">For Businesses</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Talent Sourcing & Recruitment */}
            <Card className="h-full">
              <CardHeader>
                <div className="mb-4 text-secondary">
                  <Briefcase className="h-12 w-12" />
                </div>
                <CardTitle>Talent Sourcing & Recruitment</CardTitle>
                <CardDescription>Find the perfect creative professionals for your team</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-6 text-muted-foreground">
                  Our specialized recruitment services connect your business with exceptional creative talent that aligns with your needs.
                </p>
                <h4 className="font-semibold mb-4">Our process includes:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Understanding your specific creative needs</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Accessing our vetted talent pool of professionals</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Matching you with the ideal creative talent</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link to="/contact" className="w-full">
                  <Button className="w-full">Request Talent</Button>
                </Link>
              </CardFooter>
            </Card>
            
            {/* Onboarding & Integration */}
            <Card className="h-full">
              <CardHeader>
                <div className="mb-4 text-secondary">
                  <HandHeart className="h-12 w-12" />
                </div>
                <CardTitle>Onboarding & Integration</CardTitle>
                <CardDescription>Seamless integration of new creative talent</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-6 text-muted-foreground">
                  We ensure that your new creative hires integrate smoothly into your team and company culture.
                </p>
                <h4 className="font-semibold mb-4">We ensure:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Smooth transitions for new creative talent</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Alignment with your company culture and values</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Ongoing support during the onboarding phase</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link to="/contact" className="w-full">
                  <Button variant="outline" className="w-full">Learn More</Button>
                </Link>
              </CardFooter>
            </Card>
            
            {/* Talent Management Services */}
            <Card className="h-full">
              <CardHeader>
                <div className="mb-4 text-secondary">
                  <FileText className="h-12 w-12" />
                </div>
                <CardTitle>Talent Management Services</CardTitle>
                <CardDescription>Long-term support for your creative team</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-6 text-muted-foreground">
                  We provide comprehensive management services to help you maximize the potential of your creative talent.
                </p>
                <h4 className="font-semibold mb-4">Our offerings:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Regular performance evaluations and feedback</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Contract management and administration</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Long-term talent development strategies</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link to="/contact" className="w-full">
                  <Button variant="outline" className="w-full">Learn More</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Benefits for Clients</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Diverse Talent Pool</h3>
              <p className="text-muted-foreground">
                Access to a wide range of creative professionals with varied skills, experience levels, and specialties.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <Briefcase className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Streamlined Recruitment</h3>
              <p className="text-muted-foreground">
                Efficient hiring processes that save time and resources while ensuring you find the right creative match.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <HandHeart className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Dedicated Support</h3>
              <p className="text-muted-foreground">
                Comprehensive assistance throughout the entire hiring journey and ongoing management of creative talent.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find the Right Creative Talent?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Contact our team to discuss your creative recruitment needs and discover how CrémeTalent can help.
          </p>
          <Link to="/contact">
            <Button size="lg" variant="secondary">
              Contact Us to Find the Right Creative Talent
            </Button>
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Services;
