import { useState } from 'react';
import { Briefcase, Mail, Lock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, Link } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ClientLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(email, password);
    if (error) {
      toast({ title: "Login failed", description: error, variant: "destructive" });
      setIsLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Check if this is actually a talent who ended up here by mistake
      const { data: talent } = await supabase
        .from('talent_applications')
        .select('id, status')
        .eq('user_id', user.id)
        .maybeSingle();
      if (talent?.status === 'approved') {
        toast({ title: "Welcome back", description: "Redirecting to your talent profile." });
        navigate('/talent/profile');
        setIsLoading(false);
        return;
      }

      const { data: clientAccount } = await supabase
        .from('client_accounts')
        .select('id, is_active')
        .eq('id', user.id)
        .maybeSingle();

      if (!clientAccount?.is_active) {
        await supabase.auth.signOut();
        toast({
          title: "Access not available",
          description: "This account isn't linked to an active client profile. Please create an account after submitting an intake form.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
    }

    toast({ title: "Welcome back" });
    navigate('/client/dashboard');
    setIsLoading(false);
  }

  async function handleForgotPassword() {
    if (!email) {
      toast({ title: "Enter your email first", variant: "destructive" });
      return;
    }
    setResetting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/client/set-password`,
    });
    if (error) {
      toast({ title: "Reset failed", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: "Check your email",
        description: "We've sent a password reset link to your inbox.",
      });
    }
    setResetting(false);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow hero-gradient relative overflow-hidden flex items-center justify-center p-4">
        <div className="hero-ripple" aria-hidden="true" />
        <Card className="w-full max-w-md relative">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/15 p-2 text-amber-800">
              <Briefcase className="h-full w-full" />
            </div>
            <CardTitle className="display-xl text-3xl font-semibold">Client Sign In</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Sign in to post jobs and manage your listings.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={resetting}
                    className="text-xs text-amber-700 hover:underline disabled:opacity-60"
                  >
                    {resetting ? 'Sending…' : 'Forgot password?'}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading} size="lg">
                {isLoading ? "Signing in…" : "Sign in"}
              </Button>
            </form>

            <p className="text-sm text-muted-foreground text-center mt-6">
              Need to hire talent?{' '}
              <Link to="/client-intake-form" className="text-amber-700 hover:underline font-medium">
                Submit a brief
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default ClientLogin;
