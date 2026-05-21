import React, { useState, useRef, useCallback } from 'react';
import { TALENT_CATEGORIES } from '@/lib/taxonomy';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import {
  User, Mail, Phone, MapPin, Briefcase, Clock, FileText,
  Link2, Linkedin, Instagram, Twitter, Upload, X, Check,
  ChevronRight, ChevronLeft, Send, Sparkles
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  specialization: string;
  experienceLevel: string;
  availability: string;
  bio: string;
  skills: string[];
  portfolioUrl: string;
  resumeFile: File | null;
  linkedin: string;
  instagram: string;
  twitter: string;
  heardFrom: string;
  acceptTerms: boolean;
}

const EMPTY_FORM: FormData = {
  firstName: '', lastName: '', email: '', phone: '',
  city: '', country: '', specialization: '', experienceLevel: '',
  availability: '', bio: '', skills: [], portfolioUrl: '',
  resumeFile: null, linkedin: '', instagram: '', twitter: '',
  heardFrom: '', acceptTerms: false,
};

// ─── Step config ──────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: 'Personal',     icon: User },
  { id: 2, label: 'Professional', icon: Briefcase },
  { id: 3, label: 'Portfolio',    icon: Link2 },
  { id: 4, label: 'Finalize',     icon: Send },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const FieldRow = ({ children, cols = 2 }: { children: React.ReactNode; cols?: number }) => (
  <div className={`grid grid-cols-1 ${cols === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'} gap-4`}>
    {children}
  </div>
);

const Field = ({
  id, label, required, helper, children,
}: {
  id: string; label: string; required?: boolean; helper?: string; children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <Label htmlFor={id} className="text-sm font-medium text-slate-700 flex items-center gap-1">
      {label}
      {required && <span className="text-amber-500 text-xs">*</span>}
    </Label>
    {children}
    {helper && <p className="text-xs text-slate-400">{helper}</p>}
  </div>
);

const StyledSelect = ({
  id, name, value, placeholder, required, options, onChange,
}: {
  id: string; name: string; value: string; placeholder: string;
  required?: boolean; options: { value: string; label: string }[];
  onChange: (name: string, value: string) => void;
}) => (
  <Select value={value} onValueChange={(v) => onChange(name, v)} required={required}>
    <SelectTrigger
      id={id}
      className="h-10 border-slate-200 bg-white text-sm focus:ring-amber-400/30 focus:border-amber-400"
    >
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent>
      {options.map(o => (
        <SelectItem key={o.value} value={o.value} className="text-sm">
          {o.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

// ─── Tag input ────────────────────────────────────────────────────────────────

const TagInput = ({
  tags, onChange,
}: { tags: string[]; onChange: (tags: string[]) => void }) => {
  const [input, setInput] = useState('');

  const addTag = (raw: string) => {
    const newTags = raw.split(',').map(s => s.trim()).filter(s => s && !tags.includes(s));
    if (newTags.length) onChange([...tags, ...newTags]);
    setInput('');
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (input.trim()) addTag(input);
    }
    if (e.key === 'Backspace' && !input && tags.length) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <div className="min-h-[42px] flex flex-wrap gap-1.5 items-center px-3 py-2 rounded-md border border-slate-200 bg-white focus-within:ring-2 focus-within:ring-amber-400/30 focus-within:border-amber-400 cursor-text"
      onClick={(e) => (e.currentTarget.querySelector('input') as HTMLInputElement)?.focus()}
    >
      {tags.map(tag => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-xs font-medium"
        >
          {tag}
          <button
            type="button"
            onClick={() => onChange(tags.filter(t => t !== tag))}
            className="text-amber-500 hover:text-amber-700 ml-0.5"
            aria-label={`Remove ${tag}`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKey}
        onBlur={() => { if (input.trim()) addTag(input); }}
        placeholder={tags.length === 0 ? 'Type a skill and press Enter…' : ''}
        className="flex-1 min-w-[140px] bg-transparent text-sm outline-none placeholder:text-slate-400"
      />
    </div>
  );
};

// ─── File dropzone ────────────────────────────────────────────────────────────

const FileDropzone = ({
  file, onChange,
}: { file: File | null; onChange: (file: File | null) => void }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const validate = useCallback((f: File) => {
    if (f.type !== 'application/pdf') {
      toast({ title: "Invalid file type", description: "Please upload a PDF file.", variant: "destructive" });
      return false;
    }
    if (f.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Resume must be under 10 MB.", variant: "destructive" });
      return false;
    }
    return true;
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && validate(f)) onChange(f);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && validate(f)) onChange(f);
    e.target.value = '';
  };

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 cursor-pointer transition-colors text-center
        ${dragging ? 'border-amber-400 bg-amber-50' : file ? 'border-emerald-300 bg-emerald-50/40' : 'border-slate-200 bg-slate-50/60 hover:border-amber-300 hover:bg-amber-50/30'}`}
    >
      <input ref={inputRef} type="file" accept=".pdf,application/pdf" onChange={handleInput} className="sr-only" />
      {file ? (
        <>
          <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
            <Check className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="text-sm font-medium text-slate-700 break-all">{file.name}</p>
          <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
          <button
            type="button"
            onClick={e => { e.stopPropagation(); onChange(null); }}
            className="text-xs text-rose-500 hover:text-rose-600 underline mt-1"
          >
            Remove
          </button>
        </>
      ) : (
        <>
          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
            <Upload className="h-5 w-5 text-slate-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">
              Drop your CV/Resume here or <span className="text-amber-600">browse</span>
            </p>
            <p className="text-xs text-slate-400 mt-0.5">PDF only · max 10 MB</p>
          </div>
        </>
      )}
    </div>
  );
};

// ─── Step progress indicator ──────────────────────────────────────────────────

const StepIndicator = ({ current }: { current: number }) => (
  <div className="flex items-center justify-center mb-8">
    {STEPS.map((step, i) => {
      const done = current > step.id;
      const active = current === step.id;
      const Icon = step.icon;
      return (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center gap-1.5">
            <div className={`h-9 w-9 rounded-full flex items-center justify-center border-2 transition-all duration-200
              ${done ? 'bg-amber-500 border-amber-500' : active ? 'bg-white border-amber-500' : 'bg-white border-slate-200'}`}>
              {done
                ? <Check className="h-4 w-4 text-white" />
                : <Icon className={`h-4 w-4 ${active ? 'text-amber-600' : 'text-slate-300'}`} />
              }
            </div>
            <span className={`text-[10px] font-semibold uppercase tracking-wide hidden sm:block
              ${active ? 'text-amber-600' : done ? 'text-slate-500' : 'text-slate-300'}`}>
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 mb-5 rounded-full transition-all duration-300
              ${current > step.id ? 'bg-amber-400' : 'bg-slate-200'}`} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ─── Success screen ───────────────────────────────────────────────────────────

const SuccessScreen = () => (
  <div className="flex flex-col items-center text-center py-12 px-4">
    <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mb-5">
      <Check className="h-8 w-8 text-emerald-600" />
    </div>
    <h3 className="text-2xl font-bold text-slate-900 mb-2">Application Submitted!</h3>
    <p className="text-slate-500 max-w-sm leading-relaxed text-sm">
      Thank you for applying to CrémeTalent. We'll review your application and get back to you within <strong className="text-slate-700">3–5 business days</strong>.
    </p>
    <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
      <Sparkles className="h-3.5 w-3.5 text-amber-400" />
      Redirecting you to our talent pool…
    </div>
  </div>
);

// ─── Main form component ──────────────────────────────────────────────────────

const ApplicationForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);

  const set = (name: keyof FormData, value: unknown) =>
    setFormData(prev => ({ ...prev, [name]: value }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    set(name as keyof FormData, value);
  };

  const handleSelectChange = (name: string, value: string) =>
    set(name as keyof FormData, value);

  // ── validation per step ──
  const canProceed = () => {
    if (step === 1) return formData.firstName && formData.lastName && formData.email && formData.phone && formData.city && formData.country;
    if (step === 2) return formData.specialization && formData.experienceLevel && formData.availability && formData.bio.trim().length >= 30 && formData.skills.length > 0;
    if (step === 3) return true;
    if (step === 4) return formData.acceptTerms;
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) { setStep(s => s + 1); return; }
    setIsSubmitting(true);

    try {
      let resumeUrl: string | null = null;

      if (formData.resumeFile) {
        try {
          const fileName = `${Date.now()}-${formData.email.replace(/[@.]/g, '_')}.pdf`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('resumes')
            .upload(fileName, formData.resumeFile, { contentType: 'application/pdf', upsert: false });
          if (uploadError) throw uploadError;
          resumeUrl = uploadData.path;
        } catch {
          toast({
            title: "Resume upload skipped",
            description: "Your application will be submitted without the resume.",
          });
        }
      }

      const insertQuery = supabase.from('talent_applications').insert({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        country: formData.country,
        specialization: formData.specialization,
        experience_level: formData.experienceLevel,
        availability: formData.availability,
        bio: formData.bio,
        skills: formData.skills,
        portfolio_url: formData.portfolioUrl || null,
        resume_url: resumeUrl,
        linkedin: formData.linkedin || null,
        instagram: formData.instagram || null,
        twitter: formData.twitter || null,
        heard_from: formData.heardFrom || null,
        accepted_terms: formData.acceptTerms,
        status: 'pending',
      });

      const insertResult = await Promise.race([
        insertQuery,
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), 30_000)
        ),
      ]);

      if (insertResult.error) throw new Error(insertResult.error.message);

      supabase.functions.invoke('send-email', {
        body: {
          to: formData.email,
          subject: 'Application Received — CrémeTalent',
          html: `<p>Dear ${formData.firstName},</p><p>Thank you for applying to CrémeTalent. We've received your application and will review it within 3–5 business days.</p><p>Warm regards,<br/>The CrémeTalent Team</p>`
        }
      }).catch(() => null);

      supabase.functions.invoke('send-email', {
        body: {
          to: 'Cremetalentafrica@gmail.com',
          subject: `New Talent Application: ${formData.firstName} ${formData.lastName}`,
          html: `<p>New application received.</p><p><strong>Name:</strong> ${formData.firstName} ${formData.lastName}<br/><strong>Email:</strong> ${formData.email}<br/><strong>Specialization:</strong> ${formData.specialization}<br/><strong>Location:</strong> ${formData.city}, ${formData.country}</p>`
        }
      }).catch(() => null);

      setSubmitted(true);
      setTimeout(() => navigate('/talent-pool'), 3500);
    } catch (error) {
      const isTimeout = error instanceof Error && error.message === 'timeout';
      toast({
        title: isTimeout ? "Server is starting up" : "Submission Error",
        description: isTimeout
          ? "The server took too long to respond. Please wait a moment and try again."
          : error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) return <SuccessScreen />;

  const inputClass = "h-10 border-slate-200 bg-white text-sm focus-visible:ring-amber-400/30 focus-visible:border-amber-400";

  return (
    <div className="w-full">
      <StepIndicator current={step} />

      <form onSubmit={handleSubmit}>
        {/* ── Step 1: Personal Info ─────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div className="mb-1">
              <h3 className="text-base font-semibold text-slate-900">Personal Information</h3>
              <p className="text-xs text-slate-500 mt-0.5">Let us know who you are</p>
            </div>

            <FieldRow>
              <Field id="firstName" label="First Name" required>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange}
                    className={`${inputClass} pl-9`} placeholder="Jane" required />
                </div>
              </Field>
              <Field id="lastName" label="Last Name" required>
                <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange}
                  className={inputClass} placeholder="Doe" required />
              </Field>
            </FieldRow>

            <FieldRow>
              <Field id="email" label="Email Address" required>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange}
                    className={`${inputClass} pl-9`} placeholder="jane@example.com" required autoComplete="email" />
                </div>
              </Field>
              <Field id="phone" label="Phone Number" required>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange}
                    className={`${inputClass} pl-9`} placeholder="+234 800 000 0000" required autoComplete="tel" />
                </div>
              </Field>
            </FieldRow>

            <FieldRow>
              <Field id="city" label="City" required>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input id="city" name="city" value={formData.city} onChange={handleChange}
                    className={`${inputClass} pl-9`} placeholder="Lagos" required />
                </div>
              </Field>
              <Field id="country" label="Country" required>
                <Input id="country" name="country" value={formData.country} onChange={handleChange}
                  className={inputClass} placeholder="Nigeria" required />
              </Field>
            </FieldRow>
          </div>
        )}

        {/* ── Step 2: Professional Info ─────────────────────────── */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div className="mb-1">
              <h3 className="text-base font-semibold text-slate-900">Professional Background</h3>
              <p className="text-xs text-slate-500 mt-0.5">Tell us about your expertise</p>
            </div>

            <FieldRow>
              <Field id="specialization" label="Specialization" required>
                <StyledSelect
                  id="specialization" name="specialization" value={formData.specialization}
                  placeholder="Select your field"
                  required
                  onChange={handleSelectChange}
                  options={TALENT_CATEGORIES.map(c => ({ value: c.value, label: c.label }))}
                />
              </Field>
              <Field id="experienceLevel" label="Experience Level" required>
                <StyledSelect
                  id="experienceLevel" name="experienceLevel" value={formData.experienceLevel}
                  placeholder="How long have you worked?"
                  required
                  onChange={handleSelectChange}
                  options={[
                    { value: 'Beginner', label: 'Beginner (0–1 years)' },
                    { value: 'Intermediate', label: 'Intermediate (2–4 years)' },
                    { value: 'Advanced', label: 'Advanced (5+ years)' },
                  ]}
                />
              </Field>
            </FieldRow>

            <Field id="availability" label="Availability" required>
              <StyledSelect
                id="availability" name="availability" value={formData.availability}
                placeholder="When can you start?"
                required
                onChange={handleSelectChange}
                options={[
                  { value: 'Immediate', label: 'Immediate' },
                  { value: 'Two weeks', label: '2 weeks notice' },
                  { value: 'One month', label: '1 month notice' },
                  { value: 'Custom', label: 'Custom notice period' },
                ]}
              />
            </Field>

            <Field id="bio" label="Professional Bio" required helper="Min. 30 characters — describe your background, approach, and what makes you stand out.">
              <Textarea
                id="bio" name="bio" value={formData.bio} onChange={handleChange}
                placeholder="I'm a brand designer with 5 years of experience helping startups build bold visual identities…"
                className="min-h-[130px] border-slate-200 text-sm focus-visible:ring-amber-400/30 focus-visible:border-amber-400 resize-none"
                required
              />
              <p className="text-xs text-slate-400 text-right -mt-0.5">{formData.bio.length} chars</p>
            </Field>

            <Field id="skills" label="Skills" required helper="Press Enter or comma to add each skill.">
              <TagInput tags={formData.skills} onChange={tags => set('skills', tags)} />
            </Field>
          </div>
        )}

        {/* ── Step 3: Portfolio & Presence ──────────────────────── */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div className="mb-1">
              <h3 className="text-base font-semibold text-slate-900">Portfolio & Online Presence</h3>
              <p className="text-xs text-slate-500 mt-0.5">Show us your work and where to find you</p>
            </div>

            <Field id="portfolioUrl" label="Portfolio Website">
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <Input id="portfolioUrl" name="portfolioUrl" type="url" value={formData.portfolioUrl}
                  onChange={handleChange} className={`${inputClass} pl-9`}
                  placeholder="https://yourportfolio.com" />
              </div>
            </Field>

            <Field id="resumeFile" label="Resume / CV" helper="Optional but recommended — PDF only, max 10 MB">
              <FileDropzone
                file={formData.resumeFile}
                onChange={file => set('resumeFile', file)}
              />
            </Field>

            <div className="pt-1">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-3">Social Profiles</p>
              <div className="space-y-3">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0A66C2]">
                    <Linkedin className="h-3.5 w-3.5" />
                  </div>
                  <Input id="linkedin" name="linkedin" value={formData.linkedin} onChange={handleChange}
                    className={`${inputClass} pl-9`} placeholder="https://linkedin.com/in/username" />
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#E1306C]">
                    <Instagram className="h-3.5 w-3.5" />
                  </div>
                  <Input id="instagram" name="instagram" value={formData.instagram} onChange={handleChange}
                    className={`${inputClass} pl-9`} placeholder="@username" />
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-700">
                    <Twitter className="h-3.5 w-3.5" />
                  </div>
                  <Input id="twitter" name="twitter" value={formData.twitter} onChange={handleChange}
                    className={`${inputClass} pl-9`} placeholder="@username" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 4: Finalize ──────────────────────────────────── */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="mb-1">
              <h3 className="text-base font-semibold text-slate-900">Almost there!</h3>
              <p className="text-xs text-slate-500 mt-0.5">One last step before submitting</p>
            </div>

            {/* Summary card */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
              <p className="text-xs text-slate-400 uppercase font-semibold tracking-wide">Application Summary</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                {[
                  { label: 'Name', value: `${formData.firstName} ${formData.lastName}` },
                  { label: 'Email', value: formData.email },
                  { label: 'Location', value: `${formData.city}, ${formData.country}` },
                  { label: 'Specialization', value: formData.specialization },
                  { label: 'Experience', value: formData.experienceLevel },
                  { label: 'Availability', value: formData.availability },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">{label}</p>
                    <p className="font-medium text-slate-700 text-xs truncate">{value || '—'}</p>
                  </div>
                ))}
              </div>
              {formData.skills.length > 0 && (
                <div className="pt-1 border-t border-slate-100">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-1.5">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {formData.skills.map(s => (
                      <span key={s} className="text-[11px] px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Field id="heardFrom" label="How did you hear about us?">
              <StyledSelect
                id="heardFrom" name="heardFrom" value={formData.heardFrom}
                placeholder="Select an option"
                onChange={handleSelectChange}
                options={[
                  { value: 'Social Media', label: 'Social Media' },
                  { value: 'Friend or Colleague', label: 'Friend or Colleague' },
                  { value: 'Search Engine', label: 'Search Engine' },
                  { value: 'Event', label: 'Event' },
                  { value: 'Other', label: 'Other' },
                ]}
              />
            </Field>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50/60 border border-amber-100">
              <Checkbox
                id="acceptTerms"
                checked={formData.acceptTerms}
                onCheckedChange={checked => set('acceptTerms', !!checked)}
                className="mt-0.5 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                required
              />
              <Label htmlFor="acceptTerms" className="text-xs text-slate-600 leading-relaxed cursor-pointer">
                I agree to the <span className="text-amber-700 underline">Terms & Conditions</span> and acknowledge that my data will be processed in accordance with the <span className="text-amber-700 underline">Privacy Policy</span>. I consent to being contacted about matching opportunities.<span className="text-amber-500 ml-0.5">*</span>
              </Label>
            </div>
          </div>
        )}

        {/* ── Navigation buttons ────────────────────────────────── */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
          {step > 1 ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-1.5 text-slate-600 hover:text-slate-900"
              onClick={() => setStep(s => s - 1)}
              disabled={isSubmitting}
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Step {step} of {STEPS.length}</span>
            {step < 4 ? (
              <Button
                type="button"
                size="sm"
                className="bg-amber-600 hover:bg-amber-700 text-white shadow-none gap-1.5 px-5"
                onClick={() => {
                  if (!canProceed()) {
                    toast({ title: "Incomplete", description: "Please fill in all required fields before continuing.", variant: "destructive" });
                    return;
                  }
                  setStep(s => s + 1);
                }}
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="sm"
                className="bg-amber-600 hover:bg-amber-700 text-white shadow-none gap-2 px-6"
                disabled={isSubmitting || !formData.acceptTerms}
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    Submit Application
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;
