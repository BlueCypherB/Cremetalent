
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { TalentData } from '@/types/talent';
import PendingTalentList from '@/components/admin/PendingTalentList';
import AdminDashboardStats from '@/components/admin/AdminDashboardStats';
import ApprovedTalentList from '@/components/admin/ApprovedTalentList';
import RejectedTalentList from '@/components/admin/RejectedTalentList';
import { 
  loadTalentData, 
  approveTalent as approveTalentService, 
  rejectTalent as rejectTalentService 
} from '@/services/talentService';

const AdminDashboard = () => {
  const [pendingTalent, setPendingTalent] = useState<TalentData[]>([]);
  const [approvedTalent, setApprovedTalent] = useState<TalentData[]>([]);
  const [rejectedTalent, setRejectedTalent] = useState<TalentData[]>([]);
  
  useEffect(() => {
    // Load all applications from localStorage
    try {
      const { pendingTalent, approvedTalent, rejectedTalent } = loadTalentData();
      setPendingTalent(pendingTalent);
      setApprovedTalent(approvedTalent);
      setRejectedTalent(rejectedTalent);
    } catch (error) {
      console.error("Error loading applications:", error);
      toast({
        title: "Error",
        description: "Failed to load talent applications",
        variant: "destructive",
      });
    }
  }, []);

  const handleApproveTalent = (talent: TalentData) => {
    try {
      const { newPendingList, talent: approvedTalentData } = approveTalentService(talent, pendingTalent);
      setPendingTalent(newPendingList);
      setApprovedTalent([...approvedTalent, talent]);
      
      toast({
        title: "Application Approved",
        description: `${talent.name} has been added to the talent pool.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve application",
        variant: "destructive",
      });
    }
  };

  const handleRejectTalent = (talent: TalentData, rejectionReason: string) => {
    try {
      const { newPendingList, rejectedTalentData } = rejectTalentService(talent, rejectionReason, pendingTalent);
      setPendingTalent(newPendingList);
      setRejectedTalent([...rejectedTalent, rejectedTalentData]);
      
      toast({
        title: "Application Rejected",
        description: `${talent.name}'s application has been rejected.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject application",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Admin Dashboard</h2>
        <p className="text-muted-foreground">Manage talent applications and site content</p>
      </div>
      
      <AdminDashboardStats 
        pendingCount={pendingTalent.length} 
        approvedCount={approvedTalent.length}
        rejectedCount={rejectedTalent.length}
      />
      
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="pending">Pending Review ({pendingTalent.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedTalent.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedTalent.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <PendingTalentList 
            talents={pendingTalent}
            onApprove={handleApproveTalent}
            onReject={handleRejectTalent}
          />
        </TabsContent>
        
        <TabsContent value="approved">
          <ApprovedTalentList talents={approvedTalent} />
        </TabsContent>
        
        <TabsContent value="rejected">
          <RejectedTalentList talents={rejectedTalent} />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminDashboard;
