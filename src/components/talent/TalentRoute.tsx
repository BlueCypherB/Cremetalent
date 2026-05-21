import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from "@/components/ui/skeleton";

interface TalentRouteProps {
  children: React.ReactNode;
}

export function TalentRoute({ children }: TalentRouteProps) {
  const { session, isTalent, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="space-y-3 w-full max-w-md">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

  if (!session) return <Navigate to="/talent/login" replace />;
  if (!isTalent) return <Navigate to="/" replace />;

  return <>{children}</>;
}
