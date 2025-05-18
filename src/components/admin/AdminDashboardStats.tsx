
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminDashboardStatsProps {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

const AdminDashboardStats = ({ pendingCount, approvedCount, rejectedCount }: AdminDashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">Pending Review</CardTitle>
          <CardDescription>New talent applications awaiting review</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{pendingCount}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">Approved Talent</CardTitle>
          <CardDescription>Currently active in talent pool</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{approvedCount}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">Rejected</CardTitle>
          <CardDescription>Applications that didn't meet criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{rejectedCount}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardStats;
