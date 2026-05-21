import React, { useEffect, useRef, useState } from 'react';
import { Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signOut, session, isAdmin, loading: authLoading } = useAuth();
  const loginAttempted = useRef(false);

  useEffect(() => {
    if (!authLoading && session && isAdmin) {
      navigate('/admin/dashboard', { replace: true });
      return;
    }
    if (loginAttempted.current && !authLoading) {
      loginAttempted.current = false;
      setIsLoading(false);
      if (session && !isAdmin) {
        signOut();
        toast({
          title: "Access denied",
          description: "This account does not have admin privileges.",
          variant: "destructive",
        });
      }
    }
  }, [authLoading, session, isAdmin, navigate, signOut]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      toast({ title: "Login failed", description: error, variant: "destructive" });
      setIsLoading(false);
      return;
    }
    loginAttempted.current = true;
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-[420px] xl:w-[480px] flex-col justify-between bg-amber-800 p-12 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2.5 mb-16">
            <Shield className="h-5 w-5 text-amber-200" />
            <span className="text-white font-semibold text-lg tracking-tight">CrémeTalent</span>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white leading-tight mb-4">
              Admin Portal
            </h2>
            <p className="text-amber-200 text-sm leading-relaxed">
              Manage talent applications, client inquiries, courses, and platform content from one place.
            </p>
          </div>

          <div className="mt-12 space-y-4">
            {[
              'Review & approve talent applications',
              'Manage client inquiry submissions',
              'Publish courses, webinars & blog posts',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                <p className="text-amber-100 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-amber-400/60 text-xs">
          CrémeTalent &copy; {new Date().getFullYear()}
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="h-8 w-8 rounded-full bg-amber-800 flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-slate-900">CrémeTalent Admin</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sign in</h1>
            <p className="text-sm text-slate-500 mt-1">Enter your admin credentials to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@cremetalent.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-10 bg-white border-slate-200 focus:border-amber-400 focus:ring-amber-400/20 text-sm"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-10 bg-white border-slate-200 focus:border-amber-400 focus:ring-amber-400/20 text-sm"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-10 bg-amber-700 hover:bg-amber-800 text-white font-medium text-sm shadow-none transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Verifying…
                </span>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            Admin access only &mdash; unauthorised access is prohibited
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
