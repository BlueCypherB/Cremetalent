
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { TalentData } from '@/types/talent';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Edit, 
  User,
  Share2,
  Save,
  Star
} from 'lucide-react';

interface AdminTalentTableProps {
  talent: TalentData[];
  onUpdateStatus: (id: number, status: string) => void;
  onUpdateNotes: (id: number, notes: string) => void;
  selectedId: number | null;
  setSelectedId: (id: number | null) => void;
}

const AdminTalentTable = ({ 
  talent, 
  onUpdateStatus, 
  onUpdateNotes,
  selectedId,
  setSelectedId
}: AdminTalentTableProps) => {
  const [editingNotes, setEditingNotes] = useState('');
  
  const statusColors = {
    'Active': 'bg-green-100 text-green-800',
    'Reviewing': 'bg-blue-100 text-blue-800',
    'Shortlisted': 'bg-amber-100 text-amber-800',
    'Contacted': 'bg-purple-100 text-purple-800',
    'On Hold': 'bg-gray-100 text-gray-800',
    'Rejected': 'bg-red-100 text-red-800'
  };

  const handleOpenNotes = (talentItem: TalentData) => {
    setSelectedId(talentItem.id);
    setEditingNotes(talentItem.notes || '');
  };

  const handleSaveNotes = () => {
    if (selectedId) {
      onUpdateNotes(selectedId, editingNotes);
    }
  };
  
  return (
    <div className="overflow-x-auto border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Name</TableHead>
            <TableHead>Skills</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Match Score</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {talent.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                No talent found matching your criteria
              </TableCell>
            </TableRow>
          ) : (
            talent.map(talentItem => (
              <TableRow key={talentItem.id} className="hover:bg-amber-50/30">
                <TableCell className="font-medium">{talentItem.name}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {talentItem.skills.map((skill, i) => (
                      <span key={i} className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{talentItem.experience}</TableCell>
                <TableCell>{talentItem.location}</TableCell>
                <TableCell>
                  {talentItem.matchScore !== undefined && talentItem.matchScore > 0 ? (
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      talentItem.matchScore > 50 ? 'bg-green-100 text-green-800' :
                      talentItem.matchScore > 30 ? 'bg-amber-100 text-amber-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {talentItem.matchScore}%
                    </span>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    statusColors[talentItem.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
                  }`}>
                    {talentItem.status || 'New'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {/* Status Update Menu */}
                    <div className="relative group">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden group-hover:block">
                        <div className="py-1">
                          <button 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            onClick={() => onUpdateStatus(talentItem.id, 'Active')}
                          >
                            <CheckCircle className="h-4 w-4 inline mr-2 text-green-500" />
                            Mark Active
                          </button>
                          <button 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            onClick={() => onUpdateStatus(talentItem.id, 'Shortlisted')}
                          >
                            <Star className="h-4 w-4 inline mr-2 text-amber-500" />
                            Shortlist
                          </button>
                          <button 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            onClick={() => onUpdateStatus(talentItem.id, 'Contacted')}
                          >
                            <User className="h-4 w-4 inline mr-2 text-purple-500" />
                            Mark Contacted
                          </button>
                          <button 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            onClick={() => onUpdateStatus(talentItem.id, 'On Hold')}
                          >
                            <Clock className="h-4 w-4 inline mr-2 text-gray-500" />
                            Put On Hold
                          </button>
                          <button 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            onClick={() => onUpdateStatus(talentItem.id, 'Rejected')}
                          >
                            <XCircle className="h-4 w-4 inline mr-2 text-red-500" />
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Notes */}
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleOpenNotes(talentItem)}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                        <SheetHeader>
                          <SheetTitle>Notes for {talentItem.name}</SheetTitle>
                        </SheetHeader>
                        <div className="mt-6">
                          <Textarea
                            placeholder="Add notes about this candidate, interview feedback, etc."
                            className="min-h-[200px] mb-4"
                            value={editingNotes}
                            onChange={(e) => setEditingNotes(e.target.value)}
                          />
                          <Button 
                            className="w-full"
                            onClick={handleSaveNotes}
                          >
                            <Save className="mr-2 h-4 w-4" />
                            Save Notes
                          </Button>
                        </div>
                      </SheetContent>
                    </Sheet>
                    
                    {/* Share with client */}
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminTalentTable;
