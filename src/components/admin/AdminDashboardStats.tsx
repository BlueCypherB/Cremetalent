
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
      <Card className={pendingCount > 0 ? "border-amber-300" : ""}>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">Pending Review</CardTitle>
          <CardDescription>New talent applications awaiting review</CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold ${pendingCount > 0 ? "text-amber-600" : ""}`}>
            {pendingCount}
          </div>
          {pendingCount > 0 && (
            <p className="text-sm text-amber-600 mt-1">Needs your attention</p>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">Approved Talent</CardTitle>
          <CardDescription>Currently active in talent pool</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">{approvedCount}</div>
          <p className="text-sm text-muted-foreground mt-1">Available for projects</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">Rejected</CardTitle>
          <CardDescription>Applications that didn't meet criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-600">{rejectedCount}</div>
          <p className="text-sm text-muted-foreground mt-1">Archived applications</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardStats;
