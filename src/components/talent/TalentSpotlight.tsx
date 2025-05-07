
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Sample talent data for the random spotlight selection
// In a real app, this would come from your API or database
const sampleTalent = [
  {
    id: 1,
    name: "Amara Johnson",
    avatar: "/lovable-uploads/90e525c1-9643-4777-b523-84b6d202cb2d.png",
    role: "Graphic Designer",
    skills: ["Adobe Photoshop", "Illustrator", "UI/UX"],
    bio: "Award-winning graphic designer with 5+ years of experience creating stunning visual identities and brand materials.",
    rating: 4.9
  },
  {
    id: 2,
    name: "Tunde Okafor",
    avatar: "",
    role: "Videographer",
    skills: ["Video Editing", "Animation", "Storytelling"],
    bio: "Creative videographer specializing in documentary-style corporate videos and emotionally engaging storytelling.",
    rating: 4.8
  },
  {
    id: 3,
    name: "Zainab Ahmed",
    avatar: "",
    role: "Content Writer",
    skills: ["Copywriting", "Blog Writing", "SEO"],
    bio: "Versatile content writer with a knack for creating compelling narratives that drive engagement and conversions.",
    rating: 4.7
  },
  {
    id: 4,
    name: "David Nnamdi",
    avatar: "",
    role: "Web Developer",
    skills: ["React", "Node.js", "UI Design"],
    bio: "Full-stack developer passionate about creating smooth, responsive user experiences with clean, efficient code.",
    rating: 4.9
  }
];

const TalentSpotlight = () => {
  const [spotlightTalent, setSpotlightTalent] = useState<typeof sampleTalent[0] | null>(null);
  
  useEffect(() => {
    // Select a random talent from the sample data when component mounts
    const randomIndex = Math.floor(Math.random() * sampleTalent.length);
    setSpotlightTalent(sampleTalent[randomIndex]);
  }, []);

  if (!spotlightTalent) return null;

  return (
    <div className="bg-amber-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Talent Spotlight</h2>
          <p className="text-muted-foreground mt-2">Featuring one of our exceptional creative professionals</p>
        </div>
        
        <Card className="max-w-2xl mx-auto border-amber-200 shadow-md">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0 flex justify-center">
                <Avatar className="h-32 w-32 border-4 border-amber-100">
                  <AvatarImage src={spotlightTalent.avatar} alt={spotlightTalent.name} />
                  <AvatarFallback className="text-3xl bg-amber-200">
                    {spotlightTalent.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold">{spotlightTalent.name}</h3>
                <p className="text-amber-700 font-medium mb-2">{spotlightTalent.role}</p>
                
                <div className="flex items-center mb-3">
                  <div className="flex items-center text-amber-500 mr-2">
                    <Star className="h-4 w-4 fill-amber-500" />
                    <span className="ml-1 text-sm font-medium">{spotlightTalent.rating}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{spotlightTalent.bio}</p>
                
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-500 mb-2">Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {spotlightTalent.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="bg-amber-50">{skill}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6">
                  <Link to="/talent-pool">
                    <Button variant="default">View More Talent</Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TalentSpotlight;
