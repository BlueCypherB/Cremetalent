
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  // Simple authentication check - in a real app, you would use a proper auth system
  // This is just a placeholder for demonstration purposes
  const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Admin Header */}
      <header className="bg-amber-800 text-white px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6" />
            <h1 className="text-xl font-bold">CrémeTalent Admin</h1>
          </div>
          <Button 
            variant="outline" 
            className="text-white border-white hover:bg-amber-700"
            onClick={() => {
              localStorage.removeItem('adminAuthenticated');
              window.location.href = '/admin/login';
            }}
          >
            Logout
          </Button>
        </div>
      </header>
      
      {/* Admin Content */}
      <div className="flex-grow container mx-auto p-6">
        {children}
      </div>
      
      {/* Admin Footer */}
      <footer className="bg-amber-800 text-white py-4 px-6">
        <div className="container mx-auto text-center text-sm">
          CrémeTalent Admin Portal © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;
