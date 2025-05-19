import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { loadTalentData } from '@/services/talentService';

const SPOTLIGHT_REFRESH_INTERVAL = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

const TalentSpotlight = () => {
  const [spotlightTalent, setSpotlightTalent] = useState<any | null>(null);

  useEffect(() => {
    const selectFeaturedTalent = () => {
      // Load approved talent from the talent pool
      const { approvedTalent } = loadTalentData();
      
      if (approvedTalent.length === 0) {
        // No approved talent available, use the sample data
        console.log("No approved talent available for spotlight");
        return null;
      }
      
      // If only one talent is available, select that one
      if (approvedTalent.length === 1) {
        console.log("Only one talent available, selecting them for spotlight");
        return {
          id: approvedTalent[0].id,
          name: approvedTalent[0].name,
          avatar: approvedTalent[0].photo || "",
          role: approvedTalent[0].category,
          skills: approvedTalent[0].skills,
          bio: approvedTalent[0].bio,
          rating: 4.9 // Default rating since we don't have real ratings yet
        };
      }
      
      // If multiple talents are available, select one randomly based on the current week
      // This ensures the selection stays the same for a week
      const currentDate = new Date();
      const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
      const weekNumber = Math.floor((currentDate.getTime() - startOfYear.getTime()) / (7 * 24 * 60 * 60 * 1000));
      
      // Use the week number to get a consistent index for the week
      const selectedIndex = weekNumber % approvedTalent.length;
      const selected = approvedTalent[selectedIndex];
      
      console.log(`Selected talent for spotlight: ${selected.name} (Week ${weekNumber})`);
      
      return {
        id: selected.id,
        name: selected.name,
        avatar: selected.photo || "",
        role: selected.category,
        skills: selected.skills,
        bio: selected.bio,
        rating: 4.9 // Default rating since we don't have real ratings yet
      };
    };
    
    // Check localStorage for an existing spotlight talent and its timestamp
    const savedSpotlight = localStorage.getItem('spotlightTalent');
    const savedTimestamp = localStorage.getItem('spotlightTimestamp');
    const currentTime = new Date().getTime();
    
    if (savedSpotlight && savedTimestamp && (currentTime - Number(savedTimestamp)) < SPOTLIGHT_REFRESH_INTERVAL) {
      // If we have a saved spotlight talent that's less than a week old, use it
      setSpotlightTalent(JSON.parse(savedSpotlight));
      console.log("Using saved spotlight talent from localStorage");
    } else {
      // Otherwise, select a new spotlight talent
      const selected = selectFeaturedTalent();
      
      if (selected) {
        setSpotlightTalent(selected);
        // Save to localStorage with current timestamp
        localStorage.setItem('spotlightTalent', JSON.stringify(selected));
        localStorage.setItem('spotlightTimestamp', currentTime.toString());
        console.log("Selected new spotlight talent and saved to localStorage");
      }
    }
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
                    {spotlightTalent.name.split(' ').map((n: string) => n[0]).join('')}
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
                    {spotlightTalent.skills.map((skill: string, index: number) => (
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
