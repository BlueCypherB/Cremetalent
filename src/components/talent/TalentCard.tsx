
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  MapPin,
  Clock,
  Star,
  Link as LinkIcon,
  ExternalLink
} from 'lucide-react';
import { TalentData } from '@/types/talent';

interface TalentCardProps {
  talent: TalentData;
}

const TalentCard = ({ talent }: TalentCardProps) => (
  <Card className="h-full overflow-hidden">
    <CardContent className="p-6">
      <div className="flex items-center mb-4">
        <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
          {talent.photo ? (
            <img src={talent.photo} alt={talent.name} className="w-full h-full object-cover rounded-full" />
          ) : (
            <span className="text-amber-600 text-xl font-bold">{talent.name.charAt(0)}</span>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-lg">{talent.name}</h3>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{talent.location}</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs flex items-center">
          <Briefcase className="h-3 w-3 mr-1" />
          {talent.category}
        </span>
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center">
          <Star className="h-3 w-3 mr-1" />
          {talent.experience}
        </span>
        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          {talent.availability}
        </span>
      </div>
      
      <p className="text-muted-foreground mb-4">{talent.bio}</p>
      
      <div className="mb-4">
        <h4 className="font-medium mb-2">Skills</h4>
        <div className="flex flex-wrap gap-1">
          {talent.skills.map((skill, index) => (
            <span key={index} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
              {skill}
            </span>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="font-medium mb-2">Portfolio</h4>
        <ul className="space-y-1">
          {talent.portfolio.map((project, index) => (
            <li key={index} className="flex items-center text-sm">
              <LinkIcon className="h-3.5 w-3.5 mr-2 text-primary" />
              {project}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h4 className="font-medium mb-2">Contact</h4>
        <p className="text-sm flex items-center">
          <ExternalLink className="h-3.5 w-3.5 mr-2 text-primary" />
          {talent.email}
        </p>
      </div>
      
      <div className="mt-6">
        <Button variant="outline" className="w-full" size="sm">
          <ExternalLink className="h-4 w-4 mr-2" />
          View Full Profile
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default TalentCard;
