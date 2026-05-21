import { Navigate } from 'react-router-dom';
import { Shield, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { session, isAdmin, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
          <span className="text-sm text-slate-500">Loading…</span>
        </div>
      </div>
    );
  }

  if (!session || !isAdmin) {
    return <Navigate to="/admin/login" />;
  }

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-7 w-1 rounded-full bg-amber-500" />
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-amber-600" />
              <span className="text-base font-semibold text-slate-900 tracking-tight">
                CrémeTalent
              </span>
              <span className="text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                Admin
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center">
              <span className="text-xs font-bold text-amber-800">A</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-500 hover:text-slate-800 hover:bg-slate-100 gap-1.5 text-sm"
              onClick={handleLogout}
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-screen-xl mx-auto w-full px-6 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 px-6">
        <div className="max-w-screen-xl mx-auto text-center text-xs text-slate-400">
          CrémeTalent Admin Portal &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;
