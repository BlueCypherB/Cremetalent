import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const TalentSetPassword = () => {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // supabase-js v2 automatically exchanges the hash token from the URL.
    // Listen for the resulting auth events to know when it's safe to show the form.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setReady(true);
      }
      if (event === 'USER_UPDATED') {
        setDone(true);
        setTimeout(() => navigate('/talent/profile', { replace: true }), 1500);
      }
    });

    // Handle page-reload scenario: token already consumed, session in localStorage.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password.length < 8) {
      toast({ title: 'Password too short', description: 'Must be at least 8 characters.', variant: 'destructive' });
      return;
    }
    if (password !== confirm) {
      toast({ title: 'Passwords do not match', variant: 'destructive' });
      return;
    }

    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast({ title: 'Failed to set password', description: error.message, variant: 'destructive' });
      setSaving(false);
    }
    // On success, USER_UPDATED event fires → navigate handled in the listener above.
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow hero-gradient relative overflow-hidden flex items-center justify-center p-4">
        <div className="hero-ripple" aria-hidden="true" />
        <Card className="w-full max-w-md relative">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/15 p-2 text-amber-800">
              <Lock className="h-full w-full" />
            </div>
            <CardTitle className="display-xl text-3xl font-semibold">
              {done ? 'Password set!' : 'Set your password'}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              {done
                ? 'Redirecting you to your profile…'
                : 'Choose a password to secure your CrèmeTalent account.'}
            </p>
          </CardHeader>

          <CardContent>
            {done ? (
              <div className="flex justify-center py-6">
                <CheckCircle className="h-14 w-14 text-emerald-500" />
              </div>
            ) : !ready ? (
              <div className="space-y-3 py-4">
                <div className="h-10 rounded-md bg-muted animate-pulse" />
                <div className="h-10 rounded-md bg-muted animate-pulse" />
                <div className="h-10 rounded-md bg-muted animate-pulse" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirm"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Repeat your password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={saving}>
                  {saving ? 'Saving…' : 'Set password & continue'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default TalentSetPassword;
