
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import {
  GraduationCap,
  BookOpen,
  Video,
  Calendar,
  Clock,
  Star,
  ExternalLink,
  Tag,
  User
} from 'lucide-react';

// Sample data for training courses
const courses = [
  {
    id: 1,
    title: "Mastering Brand Design",
    type: "Free",
    category: "Design",
    duration: "6 hours",
    description: "Learn fundamental principles of branding and create compelling visual identities for businesses of all sizes.",
    instructor: "Emma Davis",
    rating: 4.8,
    reviews: 124,
    image: null
  },
  {
    id: 2,
    title: "Advanced Video Editing Techniques",
    type: "Free",
    category: "Video",
    duration: "8 hours",
    description: "Take your video editing skills to the next level with professional techniques for pacing, transitions, and visual effects.",
    instructor: "Marcus Chen",
    rating: 4.9,
    reviews: 96,
    image: null
  },
  {
    id: 3,
    title: "Content Writing for Digital Platforms",
    type: "Free",
    category: "Writing",
    duration: "4 hours",
    description: "Create engaging content optimized for various digital platforms including websites, social media, and email campaigns.",
    instructor: "Sophia Rodriguez",
    rating: 4.7,
    reviews: 83,
    image: null
  },
  {
    id: 4,
    title: "Adobe Creative Suite Masterclass",
    type: "Paid",
    category: "Software",
    duration: "12 hours",
    description: "Comprehensive training across the entire Adobe Creative Suite with practical projects and advanced techniques.",
    instructor: "James Wilson",
    rating: 4.9,
    reviews: 218,
    price: "$149",
    image: null
  },
  {
    id: 5,
    title: "UI/UX Certification Program",
    type: "Paid",
    category: "Design",
    duration: "20 hours",
    description: "Industry-recognized certification course covering user research, wireframing, prototyping, and usability testing.",
    instructor: "Aisha Patel",
    rating: 4.8,
    reviews: 156,
    price: "$299",
    image: null
  },
  {
    id: 6,
    title: "Digital Marketing Analytics",
    type: "Paid",
    category: "Marketing",
    duration: "10 hours",
    description: "Learn to leverage data and analytics tools to measure and optimize marketing campaign performance.",
    instructor: "David Thompson",
    rating: 4.7,
    reviews: 92,
    price: "$199",
    image: null
  }
];

// Sample data for articles
const articles = [
  {
    id: 1,
    title: "10 Portfolio Tips That Will Get You Hired",
    category: "Career Development",
    date: "May 1, 2025",
    readTime: "8 min read",
    excerpt: "Transform your creative portfolio from good to exceptional with these expert insights that hiring managers look for."
  },
  {
    id: 2,
    title: "The Future of Remote Work in Creative Industries",
    category: "Industry Trends",
    date: "April 24, 2025",
    readTime: "12 min read",
    excerpt: "How distributed teams are reshaping creative collaboration and what skills will be most valued in this new paradigm."
  },
  {
    id: 3,
    title: "Negotiating Freelance Rates: A Complete Guide",
    category: "Business Skills",
    date: "April 15, 2025",
    readTime: "10 min read",
    excerpt: "Practical strategies for pricing your creative work appropriately and handling client negotiations with confidence."
  }
];

// Sample data for upcoming webinars
const webinars = [
  {
    id: 1,
    title: "Breaking Into the UX Design Industry",
    date: "May 15, 2025",
    time: "2:00 PM EST",
    host: "Aisha Patel",
    description: "Learn how to position yourself for success in the competitive field of UX design with practical portfolio tips."
  },
  {
    id: 2,
    title: "Creative Collaboration Tools for Remote Teams",
    date: "May 22, 2025",
    time: "1:00 PM EST",
    host: "Marcus Chen",
    description: "Explore the latest tools and workflows for effective creative collaboration in distributed teams."
  }
];

const CourseCard = ({ course }: { course: typeof courses[0] }) => (
  <Card className="h-full flex flex-col">
    <div className="aspect-video bg-amber-50 relative">
      {course.image ? (
        <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <GraduationCap className="h-12 w-12 text-amber-300" />
        </div>
      )}
      <div className="absolute top-2 right-2 px-2 py-1 bg-white rounded-full text-xs font-medium">
        {course.type === "Free" ? (
          <span className="text-green-600">Free</span>
        ) : (
          <span className="text-amber-600">{course.price}</span>
        )}
      </div>
    </div>
    
    <CardContent className="p-6 flex-grow">
      <div className="flex items-center text-sm text-muted-foreground mb-2">
        <Tag className="h-4 w-4 mr-1" />
        <span>{course.category}</span>
        <span className="mx-2">•</span>
        <Clock className="h-4 w-4 mr-1" />
        <span>{course.duration}</span>
      </div>
      
      <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
      <p className="text-muted-foreground mb-4">{course.description}</p>
      
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-2">
          <User className="h-4 w-4 text-amber-600" />
        </div>
        <span className="text-sm">{course.instructor}</span>
      </div>
      
      <div className="flex items-center">
        <div className="flex text-amber-400 mr-2">
          <Star className="h-4 w-4 fill-current" />
          <Star className="h-4 w-4 fill-current" />
          <Star className="h-4 w-4 fill-current" />
          <Star className="h-4 w-4 fill-current" />
          <Star className="h-4 w-4 fill-current" />
        </div>
        <span className="text-sm font-medium">{course.rating}</span>
        <span className="text-sm text-muted-foreground ml-1">({course.reviews} reviews)</span>
      </div>
    </CardContent>
    
    <CardFooter className="px-6 py-4 border-t">
      <Button variant={course.type === "Free" ? "default" : "secondary"} className="w-full">
        {course.type === "Free" ? "Enroll Now" : "Purchase Course"}
      </Button>
    </CardFooter>
  </Card>
);

const ArticleCard = ({ article }: { article: typeof articles[0] }) => (
  <Card className="h-full">
    <CardContent className="p-6">
      <div className="flex items-center text-sm text-muted-foreground mb-2">
        <Tag className="h-4 w-4 mr-1" />
        <span>{article.category}</span>
        <span className="mx-2">•</span>
        <Calendar className="h-4 w-4 mr-1" />
        <span>{article.date}</span>
        <span className="mx-2">•</span>
        <Clock className="h-4 w-4 mr-1" />
        <span>{article.readTime}</span>
      </div>
      
      <h3 className="font-semibold text-lg mb-2">{article.title}</h3>
      <p className="text-muted-foreground mb-4">{article.excerpt}</p>
      
      <Button variant="outline" size="sm" className="mt-2">
        Read Article
        <ExternalLink className="h-4 w-4 ml-2" />
      </Button>
    </CardContent>
  </Card>
);

const WebinarCard = ({ webinar }: { webinar: typeof webinars[0] }) => (
  <Card className="h-full">
    <CardContent className="p-6">
      <div className="bg-amber-50 p-3 rounded-lg mb-4 inline-block">
        <Video className="h-6 w-6 text-amber-600" />
      </div>
      
      <h3 className="font-semibold text-lg mb-2">{webinar.title}</h3>
      <p className="text-muted-foreground mb-4">{webinar.description}</p>
      
      <div className="space-y-2 mb-6">
        <div className="flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-2 text-amber-600" />
          <span>{webinar.date}</span>
        </div>
        <div className="flex items-center text-sm">
          <Clock className="h-4 w-4 mr-2 text-amber-600" />
          <span>{webinar.time}</span>
        </div>
        <div className="flex items-center text-sm">
          <User className="h-4 w-4 mr-2 text-amber-600" />
          <span>Hosted by {webinar.host}</span>
        </div>
      </div>
      
      <Button size="sm">Register Now</Button>
    </CardContent>
  </Card>
);

const TrainingResources = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Training & Resources</h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Enhance your skills and stay ahead in the creative industry with our comprehensive learning resources.
          </p>
        </div>
      </section>
      
      {/* Training Courses Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Training Courses</h2>
              <p className="text-muted-foreground">Develop your skills with our expert-led courses</p>
            </div>
            <Button variant="outline">View All Courses</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.slice(0, 3).map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6">Premium Courses</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {courses.slice(3).map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Articles Section */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Articles & Insights</h2>
              <p className="text-muted-foreground">Stay informed with the latest industry trends and career advice</p>
            </div>
            <Button variant="outline">View All Articles</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Webinars Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Upcoming Webinars & Workshops</h2>
              <p className="text-muted-foreground">Join interactive sessions with industry experts</p>
            </div>
            <Button variant="outline">View All Events</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {webinars.map(webinar => (
              <WebinarCard key={webinar.id} webinar={webinar} />
            ))}
          </div>
          
          <div className="mt-12 bg-amber-100/50 rounded-xl p-8 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-6 md:mb-0 md:pr-6">
                <h3 className="text-2xl font-bold mb-3">Past Recordings</h3>
                <p className="text-muted-foreground mb-4">
                  Missed a live session? Access our library of recorded webinars and workshops covering a wide range of creative topics.
                </p>
                <Button>
                  <Video className="mr-2 h-4 w-4" />
                  Access Library
                </Button>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <div className="w-24 h-24 rounded-full bg-amber-200 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-amber-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Advance Your Creative Career?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join CrémeTalent to access exclusive training resources and connect with opportunities.
          </p>
          <Button size="lg" variant="secondary">
            Join Our Talent Pool
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default TrainingResources;
