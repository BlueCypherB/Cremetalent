
import React from 'react';
import { TalentData } from '@/types/talent';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  MapPin,
  Clock,
  Star,
  Mail,
  ExternalLink,
  User
} from 'lucide-react';

interface TalentProfileModalProps {
  talent: TalentData;
  isOpen: boolean;
  onClose: () => void;
}

const TalentProfileModal = ({ talent, isOpen, onClose }: TalentProfileModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
              {talent.photo ? (
                <img src={talent.photo} alt={talent.name} className="w-full h-full object-cover rounded-full" />
              ) : (
                <span className="text-amber-600 text-md font-bold">{talent.name.charAt(0)}</span>
              )}
            </div>
            {talent.name}
          </DialogTitle>
          <DialogDescription className="flex items-center">
            <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
            {talent.location}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-amber-600" />
                <span className="font-medium">Specialization</span>
              </div>
              <Badge variant="outline" className="bg-amber-50 text-amber-800 w-fit">
                {talent.category}
              </Badge>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Experience Level</span>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-800 w-fit">
                {talent.experience}
              </Badge>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-600" />
                <span className="font-medium">Availability</span>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-800 w-fit">
                {talent.availability}
              </Badge>
            </div>
          </div>
          
          {/* Bio */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-3">About</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{talent.bio}</p>
          </div>
          
          {/* Skills */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {talent.skills.map((skill, index) => (
                <Badge key={index} variant="outline" className="bg-gray-100">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Portfolio */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-3">Portfolio</h3>
            <ul className="space-y-2">
              {talent.portfolio.map((project, index) => (
                <li key={index} className="flex items-center">
                  <ExternalLink className="h-4 w-4 mr-2 text-primary" />
                  <a 
                    href={project.startsWith('http') ? project : `https://${project}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline overflow-hidden text-ellipsis"
                  >
                    {project}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-primary" />
              <a 
                href={`mailto:${talent.email}`} 
                className="text-primary hover:underline"
              >
                {talent.email}
              </a>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TalentProfileModal;
