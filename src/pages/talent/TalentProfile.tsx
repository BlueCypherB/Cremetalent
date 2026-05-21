import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import type { TalentApplication } from '@/lib/database.types';
import { LogOut, Upload, FileText, CheckCircle2, Clock, Camera } from 'lucide-react';
import { TALENT_CATEGORY_VALUES } from '@/lib/taxonomy';

const AVATAR_PALETTES = [
  { bg: 'bg-amber-100',   text: 'text-amber-800',   border: 'border-amber-200' },
  { bg: 'bg-violet-100',  text: 'text-violet-800',  border: 'border-violet-200' },
  { bg: 'bg-sky-100',     text: 'text-sky-800',     border: 'border-sky-200' },
  { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200' },
  { bg: 'bg-rose-100',    text: 'text-rose-800',    border: 'border-rose-200' },
  { bg: 'bg-indigo-100',  text: 'text-indigo-800',  border: 'border-indigo-200' },
];
const avatarPalette = (name: string) =>
  AVATAR_PALETTES[name.charCodeAt(0) % AVATAR_PALETTES.length];

interface EditableFields {
  bio: string;
  skills: string;
  phone: string;
  city: string;
  country: string;
  specialization: string;
  experience_level: string;
  availability: string;
  portfolio_url: string;
  linkedin: string;
  instagram: string;
  twitter: string;
}

const SPECIALIZATIONS = TALENT_CATEGORY_VALUES;
const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const AVAILABILITY_OPTIONS = ['Immediate', 'Two weeks', 'One month', 'Custom'];

const TalentProfile = () => {
  const { user, signOut } = useAuth();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<EditableFields | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ['talent_profile', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('talent_applications')
        .select('*')
        .eq('user_id', user!.id)
        .single();
      if (error) throw error;
      return data as TalentApplication;
    },
  });

  useEffect(() => {
    if (profile && !editing) {
      setEditing({
        bio: profile.bio,
        skills: profile.skills.join(', '),
        phone: profile.phone,
        city: profile.city,
        country: profile.country,
        specialization: profile.specialization,
        experience_level: profile.experience_level,
        availability: profile.availability,
        portfolio_url: profile.portfolio_url ?? '',
        linkedin: profile.linkedin ?? '',
        instagram: profile.instagram ?? '',
        twitter: profile.twitter ?? '',
      });
    }
  }, [profile, editing]);

  const saveM = useMutation({
    mutationFn: async (changes: EditableFields) => {
      if (!profile) throw new Error('Profile not loaded');
      const { error } = await supabase
        .from('talent_applications')
        .update({
          bio: changes.bio,
          skills: changes.skills.split(',').map(s => s.trim()).filter(Boolean),
          phone: changes.phone,
          city: changes.city,
          country: changes.country,
          specialization: changes.specialization,
          experience_level: changes.experience_level,
          availability: changes.availability,
          portfolio_url: changes.portfolio_url || null,
          linkedin: changes.linkedin || null,
          instagram: changes.instagram || null,
          twitter: changes.twitter || null,
        })
        .eq('id', profile.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['talent_profile'] });
      toast({ title: "Profile saved" });
    },
    onError: (e: Error) => {
      toast({ title: "Save failed", description: e.message, variant: "destructive" });
    },
  });

  async function handleResumeUpload() {
    if (!resumeFile || !profile) return;
    if (resumeFile.type !== 'application/pdf') {
      toast({ title: "PDF only", description: "Please upload a PDF file.", variant: "destructive" });
      return;
    }
    if (resumeFile.size > 10 * 1024 * 1024) {
      toast({ title: "Too large", description: "Maximum file size is 10MB.", variant: "destructive" });
      return;
    }

    setUploadingResume(true);
    try {
      // Remove old resume if present
      if (profile.resume_url) {
        await supabase.storage.from('resumes').remove([profile.resume_url]).catch(() => null);
      }

      const fileName = `${Date.now()}-${profile.email.replace(/[^a-z0-9]/gi, '_')}.pdf`;
      const { data, error: uploadErr } = await supabase.storage
        .from('resumes')
        .upload(fileName, resumeFile, { contentType: 'application/pdf', upsert: false });
      if (uploadErr) throw uploadErr;

      const { error: updateErr } = await supabase
        .from('talent_applications')
        .update({ resume_url: data.path })
        .eq('id', profile.id);
      if (updateErr) throw updateErr;

      queryClient.invalidateQueries({ queryKey: ['talent_profile'] });
      toast({ title: "Resume updated" });
      setResumeFile(null);
    } catch (e) {
      toast({ title: "Upload failed", description: String(e), variant: "destructive" });
    } finally {
      setUploadingResume(false);
    }
  }

  async function handlePhotoUpload(file: File) {
    if (!profile || !user) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast({ title: "Invalid file type", description: "Please upload a JPEG, PNG, or WebP image.", variant: "destructive" });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum photo size is 2MB.", variant: "destructive" });
      return;
    }
    setIsUploadingPhoto(true);
    try {
      const ext = file.type.split('/')[1];
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { data, error: uploadErr } = await supabase.storage
        .from('avatars')
        .upload(path, file, { contentType: file.type, upsert: true });
      if (uploadErr) throw uploadErr;
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(data.path);
      const { error: updateErr } = await supabase
        .from('talent_applications')
        .update({ profile_photo_url: publicUrl })
        .eq('id', profile.id);
      if (updateErr) throw updateErr;
      queryClient.invalidateQueries({ queryKey: ['talent_profile'] });
      toast({ title: "Photo updated" });
    } catch {
      toast({ title: "Photo upload failed", description: "Your profile info is still saved.", variant: "destructive" });
    } finally {
      setIsUploadingPhoto(false);
    }
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-slate-500 mb-4">Could not load your profile. Please refresh the page.</p>
          <Button onClick={() => window.location.reload()}>Refresh</Button>
        </div>
        <Footer />
      </div>
    );
  }

  if (isLoading || !editing) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-12">
          <Skeleton className="h-12 w-1/3 mb-8" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-semibold mb-2">No profile found</h2>
          <p className="text-muted-foreground">Your account isn't linked to an approved application.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const fullName = `${profile.first_name} ${profile.last_name}`;
  const palette = avatarPalette(fullName);
  const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const statusBadge = profile.status === 'approved'
    ? { label: 'Active in talent pool', icon: CheckCircle2, color: 'bg-green-100 text-green-800' }
    : profile.status === 'pending'
    ? { label: 'Under review', icon: Clock, color: 'bg-amber-100 text-amber-800' }
    : { label: 'Not listed', icon: Clock, color: 'bg-gray-100 text-gray-800' };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveM.mutate(editing);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-muted/30">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="flex items-start justify-between mb-8 flex-col md:flex-row gap-4">
            <div>
              <span className="eyebrow mb-3">Talent profile</span>
              <h1 className="display-xl text-4xl md:text-5xl font-semibold leading-tight">
                {profile.first_name} {profile.last_name}
              </h1>
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <Badge className={statusBadge.color}>
                  <statusBadge.icon className="h-3 w-3 mr-1" />
                  {statusBadge.label}
                </Badge>
                <span className="text-sm text-muted-foreground">{profile.email}</span>
              </div>
            </div>
            <Button variant="outline" onClick={() => signOut()}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile photo */}
            <section className="service-card p-6">
              <h2 className="text-lg font-semibold mb-4">Profile photo</h2>
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className={`h-20 w-20 rounded-full overflow-hidden flex items-center justify-center text-2xl font-bold border-2 ${palette.bg} ${palette.text} ${palette.border}`}>
                    {isUploadingPhoto ? (
                      <div className="h-full w-full bg-slate-100 animate-pulse" />
                    ) : profile.profile_photo_url ? (
                      <img src={profile.profile_photo_url} alt={profile.first_name} className="h-full w-full object-cover" />
                    ) : (
                      <span>{initials}</span>
                    )}
                  </div>
                  <label
                    htmlFor="photo-upload"
                    className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center cursor-pointer hover:bg-amber-50 hover:border-amber-300 transition-colors shadow-sm"
                  >
                    <Camera className="h-3.5 w-3.5 text-slate-600" />
                  </label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) handlePhotoUpload(file);
                      e.target.value = '';
                    }}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">{profile.first_name} {profile.last_name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">JPEG, PNG or WebP · max 2 MB</p>
                </div>
              </div>
            </section>

            {/* Resume */}
            <section className="service-card p-6">
              <h2 className="text-lg font-semibold mb-1">Resume</h2>
              <p className="text-sm text-muted-foreground mb-4">PDF only, max 10MB.</p>

              {profile.resume_url ? (
                <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/30 mb-4">
                  <FileText className="h-5 w-5 text-amber-700" />
                  <span className="text-sm flex-grow">Resume on file</span>
                  <span className="text-xs text-muted-foreground">{profile.resume_url.split('-').slice(-1)[0]}</span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic mb-4">No resume uploaded yet.</p>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={e => setResumeFile(e.target.files?.[0] ?? null)}
                  className="flex-grow"
                />
                <Button
                  type="button"
                  onClick={handleResumeUpload}
                  disabled={!resumeFile || uploadingResume}
                  variant="outline"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploadingResume ? "Uploading…" : "Upload new"}
                </Button>
              </div>
            </section>

            {/* About / Bio */}
            <section className="service-card p-6">
              <h2 className="text-lg font-semibold mb-4">About you</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    value={editing.bio}
                    onChange={e => setEditing({ ...editing, bio: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="skills">Skills <span className="text-muted-foreground font-normal">(comma-separated)</span></Label>
                  <Input
                    id="skills"
                    placeholder="Brand identity, Figma, Adobe Illustrator…"
                    value={editing.skills}
                    onChange={e => setEditing({ ...editing, skills: e.target.value })}
                  />
                </div>
              </div>
            </section>

            {/* Professional details */}
            <section className="service-card p-6">
              <h2 className="text-lg font-semibold mb-4">Professional details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="specialization">Specialization</Label>
                  <select
                    id="specialization"
                    value={editing.specialization}
                    onChange={e => setEditing({ ...editing, specialization: e.target.value })}
                    className="w-full p-2 border rounded-md bg-background h-10"
                  >
                    {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <Label htmlFor="experience_level">Experience level</Label>
                  <select
                    id="experience_level"
                    value={editing.experience_level}
                    onChange={e => setEditing({ ...editing, experience_level: e.target.value })}
                    className="w-full p-2 border rounded-md bg-background h-10"
                  >
                    {EXPERIENCE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <Label htmlFor="availability">Availability</Label>
                  <select
                    id="availability"
                    value={editing.availability}
                    onChange={e => setEditing({ ...editing, availability: e.target.value })}
                    className="w-full p-2 border rounded-md bg-background h-10"
                  >
                    {AVAILABILITY_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={editing.phone}
                    onChange={e => setEditing({ ...editing, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={editing.city}
                    onChange={e => setEditing({ ...editing, city: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={editing.country}
                    onChange={e => setEditing({ ...editing, country: e.target.value })}
                  />
                </div>
              </div>
            </section>

            {/* Links */}
            <section className="service-card p-6">
              <h2 className="text-lg font-semibold mb-4">Portfolio & links</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="portfolio_url">Portfolio URL</Label>
                  <Input
                    id="portfolio_url"
                    type="url"
                    placeholder="https://…"
                    value={editing.portfolio_url}
                    onChange={e => setEditing({ ...editing, portfolio_url: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      placeholder="username or URL"
                      value={editing.linkedin}
                      onChange={e => setEditing({ ...editing, linkedin: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      placeholder="@handle"
                      value={editing.instagram}
                      onChange={e => setEditing({ ...editing, instagram: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="twitter">Twitter / X</Label>
                    <Input
                      id="twitter"
                      placeholder="@handle"
                      value={editing.twitter}
                      onChange={e => setEditing({ ...editing, twitter: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </section>

            <div className="flex justify-end gap-3 sticky bottom-4">
              <Button type="submit" size="lg" disabled={saveM.isPending} className="shadow-lg shadow-primary/20">
                {saveM.isPending ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TalentProfile;
