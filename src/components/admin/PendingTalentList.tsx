
import React, { useState } from 'react';
import { TalentData } from '@/types/talent';
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, User, Mail, MapPin, Briefcase, Clock } from 'lucide-react';

interface PendingTalentListProps {
  talents: TalentData[];
  onApprove: (talent: TalentData) => void;
  onReject: (talent: TalentData, rejectionReason: string) => void;
}

const PendingTalentList = ({ talents, onApprove, onReject }: PendingTalentListProps) => {
  const [selectedTalent, setSelectedTalent] = useState<TalentData | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleReject = () => {
    if (selectedTalent) {
      onReject(selectedTalent, rejectionReason);
      setRejectionReason('');
      setSelectedTalent(null);
      setIsDialogOpen(false);
    }
  };

  if (talents.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-md shadow">
        <p className="text-gray-500">No pending applications to review</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {talents.map((talent) => (
        <div key={talent.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-semibold flex items-center">
                  <User className="mr-2 h-5 w-5 text-amber-600" />
                  {talent.name}
                </h3>
                <div className="text-sm text-gray-500 mt-1 flex items-center">
                  <Mail className="mr-1 h-4 w-4" />
                  {talent.email}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  className="border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
                  onClick={() => onApprove(talent)}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                
                <Dialog open={isDialogOpen && selectedTalent?.id === talent.id} onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (!open) {
                    setSelectedTalent(null);
                    setRejectionReason('');
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => setSelectedTalent(talent)}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reject Application</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to reject {talent.name}'s application? 
                        Please provide a reason for the rejection.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Textarea
                      placeholder="Reason for rejection (optional)"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="min-h-[100px]"
                    />
                    
                    <DialogFooter className="mt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSelectedTalent(null);
                          setRejectionReason('');
                          setIsDialogOpen(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={handleReject}
                      >
                        Confirm Rejection
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <div className="mt-4 border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center text-sm">
                    <Briefcase className="mr-1 h-4 w-4 text-gray-500" />
                    <span className="font-medium">Specialization:</span>
                    <span className="ml-1">{talent.category}</span>
                  </div>
                  
                  <div className="flex items-center text-sm mt-2">
                    <Clock className="mr-1 h-4 w-4 text-gray-500" />
                    <span className="font-medium">Experience:</span>
                    <span className="ml-1">{talent.experience}</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center text-sm">
                    <MapPin className="mr-1 h-4 w-4 text-gray-500" />
                    <span className="font-medium">Location:</span>
                    <span className="ml-1">{talent.location}</span>
                  </div>
                  
                  <div className="flex items-center text-sm mt-2">
                    <Clock className="mr-1 h-4 w-4 text-gray-500" />
                    <span className="font-medium">Availability:</span>
                    <span className="ml-1">{talent.availability}</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Skills:</span>
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {talent.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm font-medium">Bio:</p>
                <p className="text-sm mt-1 text-gray-600">{talent.bio}</p>
              </div>
              
              {talent.portfolio[0] && (
                <div className="mt-4">
                  <p className="text-sm font-medium">Portfolio:</p>
                  <a 
                    href={talent.portfolio[0].startsWith('http') ? talent.portfolio[0] : `https://${talent.portfolio[0]}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline mt-1 block"
                  >
                    {talent.portfolio[0]}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PendingTalentList;
