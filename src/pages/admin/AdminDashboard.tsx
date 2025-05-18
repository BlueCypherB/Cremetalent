
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PendingTalentList from '@/components/admin/PendingTalentList';
import { TalentData } from '@/types/talent';

const AdminDashboard = () => {
  const [pendingTalent, setPendingTalent] = useState<TalentData[]>([]);
  const [approvedTalent, setApprovedTalent] = useState<TalentData[]>([]);
  const [rejectedTalent, setRejectedTalent] = useState<TalentData[]>([]);
  
  useEffect(() => {
    // Load all applications from localStorage
    try {
      // Load pending applications
      const pendingApps = localStorage.getItem('pendingTalentApplications');
      if (pendingApps) {
        const applications = JSON.parse(pendingApps);
        const formattedApplications = applications.map((app: any, index: number) => ({
          id: index + 1000, // Use a different ID range for pending applications
          name: `${app.firstName} ${app.lastName}`,
          photo: null,
          location: `${app.city}, ${app.country}`,
          category: app.specialization,
          experience: app.experienceLevel,
          availability: app.availability,
          bio: app.bio,
          skills: app.skills.split(',').map((skill: string) => skill.trim()),
          portfolio: [app.portfolioUrl],
          email: app.email,
          status: "Pending",
          notes: "",
          matchScore: 0,
          lastContact: new Date().toISOString().split('T')[0]
        }));
        
        setPendingTalent(formattedApplications);
      }
      
      // Load approved talent
      const approvedApps = localStorage.getItem('talentApplications');
      if (approvedApps) {
        const applications = JSON.parse(approvedApps);
        const formattedApplications = applications.map((app: any, index: number) => ({
          id: index + 1,
          name: `${app.firstName} ${app.lastName}`,
          photo: null,
          location: `${app.city}, ${app.country}`,
          category: app.specialization,
          experience: app.experienceLevel,
          availability: app.availability,
          bio: app.bio,
          skills: app.skills.split(',').map((skill: string) => skill.trim()),
          portfolio: [app.portfolioUrl],
          email: app.email,
          status: "Active",
          notes: "",
          matchScore: 0,
          lastContact: new Date().toISOString().split('T')[0]
        }));
        
        setApprovedTalent(formattedApplications);
      }
      
      // Load rejected applications
      const rejectedApps = localStorage.getItem('rejectedTalentApplications');
      if (rejectedApps) {
        const applications = JSON.parse(rejectedApps);
        const formattedApplications = applications.map((app: any, index: number) => ({
          id: index + 2000, // Use a different ID range for rejected applications
          name: `${app.firstName} ${app.lastName}`,
          photo: null,
          location: `${app.city}, ${app.country}`,
          category: app.specialization,
          experience: app.experienceLevel,
          availability: app.availability,
          bio: app.bio,
          skills: app.skills.split(',').map((skill: string) => skill.trim()),
          portfolio: [app.portfolioUrl],
          email: app.email,
          status: "Rejected",
          notes: app.rejectionReason || "",
          matchScore: 0,
          lastContact: new Date().toISOString().split('T')[0]
        }));
        
        setRejectedTalent(formattedApplications);
      }
    } catch (error) {
      console.error("Error loading applications:", error);
      toast({
        title: "Error",
        description: "Failed to load talent applications",
        variant: "destructive",
      });
    }
  }, []);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Admin Dashboard</h2>
        <p className="text-muted-foreground">Manage talent applications and site content</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Pending Review</CardTitle>
            <CardDescription>New talent applications awaiting review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingTalent.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Approved Talent</CardTitle>
            <CardDescription>Currently active in talent pool</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{approvedTalent.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Rejected</CardTitle>
            <CardDescription>Applications that didn't meet criteria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{rejectedTalent.length}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="pending">Pending Review ({pendingTalent.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedTalent.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedTalent.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <PendingTalentList 
            talents={pendingTalent}
            onApprove={(talent: TalentData, rejectionReason?: string) => {
              // Handle approval logic
              try {
                // Remove from pending list
                const newPendingList = pendingTalent.filter(item => item.id !== talent.id);
                setPendingTalent(newPendingList);
                localStorage.setItem('pendingTalentApplications', JSON.stringify(
                  newPendingList.map(item => {
                    // Convert back to application format for storage
                    return {
                      firstName: item.name.split(' ')[0],
                      lastName: item.name.split(' ')[1] || '',
                      email: item.email,
                      city: item.location.split(',')[0].trim(),
                      country: item.location.split(',')[1]?.trim() || '',
                      specialization: item.category,
                      experienceLevel: item.experience,
                      availability: item.availability,
                      bio: item.bio,
                      skills: item.skills.join(', '),
                      portfolioUrl: item.portfolio[0] || '',
                    };
                  })
                ));
                
                // Add to approved list
                const existingApproved = localStorage.getItem('talentApplications');
                const approvedList = existingApproved ? JSON.parse(existingApproved) : [];
                
                // Convert TalentData back to application format
                const applicationData = {
                  firstName: talent.name.split(' ')[0],
                  lastName: talent.name.split(' ')[1] || '',
                  email: talent.email,
                  city: talent.location.split(',')[0].trim(),
                  country: talent.location.split(',')[1]?.trim() || '',
                  specialization: talent.category,
                  experienceLevel: talent.experience,
                  availability: talent.availability,
                  bio: talent.bio,
                  skills: talent.skills.join(', '),
                  portfolioUrl: talent.portfolio[0] || '',
                  phone: '', // These fields might not exist in TalentData
                  linkedin: '',
                  instagram: '',
                  twitter: '',
                  heardFrom: '',
                  acceptTerms: true
                };
                
                approvedList.push(applicationData);
                localStorage.setItem('talentApplications', JSON.stringify(approvedList));
                
                // Update state
                setApprovedTalent([...approvedTalent, talent]);
                
                // Send approval notification email
                sendNotificationEmail(talent.email, "Application Approved", 
                  `Congratulations! Your application to join the CrémeTalent talent pool has been approved. 
                   Your profile is now visible in our talent pool.`);
                
                toast({
                  title: "Application Approved",
                  description: `${talent.name} has been added to the talent pool.`,
                });
              } catch (error) {
                console.error("Error approving application:", error);
                toast({
                  title: "Error",
                  description: "Failed to approve application",
                  variant: "destructive",
                });
              }
            }}
            onReject={(talent: TalentData, rejectionReason: string) => {
              // Handle rejection logic
              try {
                // Remove from pending list
                const newPendingList = pendingTalent.filter(item => item.id !== talent.id);
                setPendingTalent(newPendingList);
                localStorage.setItem('pendingTalentApplications', JSON.stringify(
                  newPendingList.map(item => {
                    // Convert back to application format for storage
                    return {
                      firstName: item.name.split(' ')[0],
                      lastName: item.name.split(' ')[1] || '',
                      email: item.email,
                      city: item.location.split(',')[0].trim(),
                      country: item.location.split(',')[1]?.trim() || '',
                      specialization: item.category,
                      experienceLevel: item.experience,
                      availability: item.availability,
                      bio: item.bio,
                      skills: item.skills.join(', '),
                      portfolioUrl: item.portfolio[0] || '',
                    };
                  })
                ));
                
                // Add to rejected list
                const existingRejected = localStorage.getItem('rejectedTalentApplications');
                const rejectedList = existingRejected ? JSON.parse(existingRejected) : [];
                
                // Convert TalentData back to application format with rejection reason
                const applicationData = {
                  firstName: talent.name.split(' ')[0],
                  lastName: talent.name.split(' ')[1] || '',
                  email: talent.email,
                  city: talent.location.split(',')[0].trim(),
                  country: talent.location.split(',')[1]?.trim() || '',
                  specialization: talent.category,
                  experienceLevel: talent.experience,
                  availability: talent.availability,
                  bio: talent.bio,
                  skills: talent.skills.join(', '),
                  portfolioUrl: talent.portfolio[0] || '',
                  rejectionReason: rejectionReason,
                  phone: '', // These fields might not exist in TalentData
                  linkedin: '',
                  instagram: '',
                  twitter: '',
                  heardFrom: '',
                  acceptTerms: true
                };
                
                rejectedList.push(applicationData);
                localStorage.setItem('rejectedTalentApplications', JSON.stringify(rejectedList));
                
                // Update state
                const rejectedTalentData = {
                  ...talent,
                  status: "Rejected",
                  notes: rejectionReason
                };
                setRejectedTalent([...rejectedTalent, rejectedTalentData]);
                
                // Send rejection notification email
                sendNotificationEmail(talent.email, "Application Status Update", 
                  `Thank you for your interest in joining the CrémeTalent talent pool. 
                   After careful review, we regret to inform you that we are unable to accept your application at this time. 
                   ${rejectionReason ? `Reason: ${rejectionReason}` : ''}`);
                
                toast({
                  title: "Application Rejected",
                  description: `${talent.name}'s application has been rejected.`,
                });
              } catch (error) {
                console.error("Error rejecting application:", error);
                toast({
                  title: "Error",
                  description: "Failed to reject application",
                  variant: "destructive",
                });
              }
            }}
          />
        </TabsContent>
        
        <TabsContent value="approved">
          {approvedTalent.length > 0 ? (
            <div className="bg-white rounded-md shadow">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {approvedTalent.map((talent) => (
                    <tr key={talent.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{talent.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{talent.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{talent.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{talent.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-md shadow">
              <p className="text-gray-500">No approved talent yet</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="rejected">
          {rejectedTalent.length > 0 ? (
            <div className="bg-white rounded-md shadow">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rejection Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {rejectedTalent.map((talent) => (
                    <tr key={talent.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{talent.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{talent.email}</td>
                      <td className="px-6 py-4">{talent.notes || "No reason provided"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-md shadow">
              <p className="text-gray-500">No rejected applications</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

// Helper function to simulate sending an email notification
const sendNotificationEmail = (email: string, subject: string, message: string) => {
  console.log(`Sending email to: ${email}`);
  console.log(`Subject: ${subject}`);
  console.log(`Message: ${message}`);
  
  // In a real application, you would integrate with an email service
  // This is just a placeholder for demonstration purposes
};

export default AdminDashboard;
