import { useState, useRef } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type FieldPath } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { INDUSTRY_OPTIONS } from '@/lib/taxonomy';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Lock,
  UserPlus,
} from 'lucide-react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Smartphone,
  Palette,
  Video,
  PenLine,
  Mic,
  Monitor,
} from 'lucide-react';

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
  companyName: z.string().min(1, { message: "Company name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(5, { message: "Phone number is required" }),
  website: z.string().optional(),
  location: z.string().min(2, { message: "Location is required" }),
  socialMedia: z.string().optional(),
  industry: z.string().min(1, { message: "Industry is required" }),

  projectTitle: z.string().min(1, { message: "Project title is required" }),
  projectType: z.enum(["one-time", "monthly", "ongoing", "event", "launch", "other"], {
    message: "Please choose a project type"
  }),
  projectTypeOther: z.string().optional(),
  objectives: z.array(z.string()).optional(),
  objectiveOther: z.string().optional(),
  description: z.string().min(10, { message: "Please provide a brief description (10+ characters)" }),
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string().optional(),
  importantDates: z.string().optional(),

  digitalServices: z.array(z.string()).optional(),
  visualServices: z.array(z.string()).optional(),
  videoServices: z.array(z.string()).optional(),
  contentServices: z.array(z.string()).optional(),
  mediaServices: z.array(z.string()).optional(),
  techServices: z.array(z.string()).optional(),

  hasBrandGuidelines: z.enum(["yes", "no"], { message: "Please select an option" }),
  brandTone: z.string().optional(),
  colorFonts: z.string().optional(),
  inspirationalBrands: z.string().optional(),

  targetAudience: z.string().min(5, { message: "Target audience information is required" }),
  audienceLocation: z.array(z.string()).min(1, { message: "Please select at least one location" }),
  contentPlatforms: z.array(z.string()).min(1, { message: "Please select at least one platform" }),
  contentPlatformsOther: z.string().optional(),

  budgetRange: z.enum(["100k-250k", "250k-500k", "500k-1M", "1M-2M", "custom"], {
    message: "Please select a budget range"
  }),
  customBudget: z.string().optional(),
  paymentStructure: z.enum(["one-off", "split", "monthly", "other"], {
    message: "Please select a payment structure"
  }),
  paymentStructureOther: z.string().optional(),

  deliverables: z.string().min(5, { message: "Please describe expected deliverables" }),
  kpis: z.array(z.string()).min(1, { message: "Please select at least one KPI" }),
  kpiOther: z.string().optional(),

  primaryContactName: z.string().min(2, { message: "Contact name is required" }),
  primaryContactInfo: z.string().min(5, { message: "Contact information is required" }),
  communicationMode: z.array(z.string()).min(1, { message: "Please select at least one communication mode" }),
  approvalTimeline: z.enum(["24h", "48h", "72h", "flexible"], {
    message: "Please select an approval timeline"
  }),
  additionalNotes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const projectTypes = [
  { id: "one-time", label: "One-time campaign" },
  { id: "monthly", label: "Monthly retainer" },
  { id: "ongoing", label: "Ongoing project" },
  { id: "event", label: "Event-based" },
  { id: "launch", label: "Product/service launch" },
  { id: "other", label: "Other" },
];

const objectives = [
  { id: "awareness", label: "Increase brand awareness" },
  { id: "sales", label: "Boost sales or leads" },
  { id: "event", label: "Promote an event" },
  { id: "community", label: "Build a community" },
  { id: "educate", label: "Educate an audience" },
  { id: "rebrand", label: "Rebrand or refresh identity" },
  { id: "other", label: "Other" },
];

const digitalServices = [
  { id: "social-management", label: "Social Media Management" },
  { id: "social-strategy", label: "Social Media Strategy" },
  { id: "influencer", label: "Influencer Marketing" },
  { id: "paid-ads", label: "Paid Ads Management" },
  { id: "community", label: "Community Engagement" },
  { id: "campaigns", label: "Digital Campaigns" },
];

const visualServices = [
  { id: "graphic-design", label: "Graphic Design" },
  { id: "motion", label: "Motion Graphics" },
  { id: "brand-identity", label: "Brand Identity (logos, colors, fonts)" },
  { id: "uiux", label: "UI/UX & Website Mockups" },
  { id: "presentations", label: "Presentations / Decks" },
  { id: "infographics", label: "Infographics" },
];

const videoServices = [
  { id: "videography", label: "Videography" },
  { id: "editing", label: "Video Editing" },
  { id: "reels", label: "Reels / Short-form Video" },
  { id: "photography", label: "Photography" },
  { id: "drone", label: "Drone Coverage" },
  { id: "animation", label: "Animation (2D/3D)" },
];

const contentServices = [
  { id: "content-strategy", label: "Content Strategy" },
  { id: "copywriting", label: "Copywriting" },
  { id: "scriptwriting", label: "Scriptwriting" },
  { id: "blogging", label: "Blogging / Articles" },
  { id: "captions", label: "Caption Writing" },
  { id: "seo", label: "SEO Content" },
];

const mediaServices = [
  { id: "voice-over", label: "Voice-Over Work" },
  { id: "hosting", label: "Event Hosting" },
  { id: "podcast", label: "Podcast Production" },
  { id: "media-training", label: "Media Training" },
  { id: "pr", label: "PR Strategy" },
];

const techServices = [
  { id: "web-dev", label: "Website Design / Development" },
  { id: "ecommerce", label: "E-commerce Setup" },
  { id: "landing-pages", label: "Landing Pages" },
  { id: "funnel", label: "Funnel Building" },
  { id: "email", label: "Email Marketing" },
];

const audienceLocations = [
  { id: "nigeria", label: "Nigeria" },
  { id: "ghana", label: "Ghana" },
  { id: "kenya", label: "Kenya" },
  { id: "south-africa", label: "South Africa" },
  { id: "egypt", label: "Egypt" },
  { id: "morocco", label: "Morocco" },
  { id: "ethiopia", label: "Ethiopia" },
  { id: "tanzania", label: "Tanzania" },
  { id: "uganda", label: "Uganda" },
  { id: "cote-divoire", label: "Côte d'Ivoire" },
  { id: "senegal", label: "Senegal" },
  { id: "rwanda", label: "Rwanda" },
  { id: "pan-african", label: "Pan-African (multiple countries)" },
  { id: "diaspora", label: "African Diaspora" },
  { id: "other-africa", label: "Other African country" },
];

const contentPlatforms = [
  { id: "instagram", label: "Instagram" },
  { id: "facebook", label: "Facebook" },
  { id: "tiktok", label: "TikTok" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "youtube", label: "YouTube" },
  { id: "twitter", label: "Twitter / X" },
  { id: "other", label: "Other" },
];

const budgetRanges = [
  { id: "100k-250k", label: "₦100k – ₦250k" },
  { id: "250k-500k", label: "₦250k – ₦500k" },
  { id: "500k-1M", label: "₦500k – ₦1M" },
  { id: "1M-2M", label: "₦1M – ₦2M" },
  { id: "custom", label: "Custom / Negotiable" },
];

const paymentStructures = [
  { id: "one-off", label: "One-off payment" },
  { id: "split", label: "70% upfront, 30% after delivery" },
  { id: "monthly", label: "Monthly retainer" },
  { id: "other", label: "Other" },
];

const kpis = [
  { id: "reach", label: "Reach / Impressions" },
  { id: "engagement", label: "Engagement (likes, shares, comments)" },
  { id: "clicks", label: "Website clicks" },
  { id: "conversions", label: "Sales / Conversions" },
  { id: "growth", label: "Community growth" },
  { id: "other", label: "Other" },
];

const communicationModes = [
  { id: "email", label: "Email" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "zoom", label: "Zoom calls" },
  { id: "phone", label: "Phone call" },
];

const approvalTimelines = [
  { id: "24h", label: "Within 24 hours" },
  { id: "48h", label: "Within 48 hours" },
  { id: "72h", label: "Within 72 hours" },
  { id: "flexible", label: "Flexible" },
];

const STEPS = [
  { id: 'about', title: 'About you', subtitle: 'Tell us about you and your brand.', fields: ['fullName', 'companyName', 'email', 'phone', 'location', 'industry'] as FieldPath<FormValues>[] },
  { id: 'project', title: 'The project', subtitle: 'What are we building together?', fields: ['projectTitle', 'projectType', 'description', 'startDate'] as FieldPath<FormValues>[] },
  { id: 'talent', title: 'Talent needs', subtitle: 'What creative skills are you looking for? Pick anything that applies.', fields: [] as FieldPath<FormValues>[] },
  { id: 'brand', title: 'Brand & style', subtitle: 'Help us understand your aesthetic.', fields: ['hasBrandGuidelines'] as FieldPath<FormValues>[] },
  { id: 'audience', title: 'Audience', subtitle: 'Who are we trying to reach?', fields: ['targetAudience', 'audienceLocation', 'contentPlatforms'] as FieldPath<FormValues>[] },
  { id: 'budget', title: 'Budget & terms', subtitle: "Let's talk numbers and how you'd like to pay.", fields: ['budgetRange', 'paymentStructure'] as FieldPath<FormValues>[] },
  { id: 'deliverables', title: 'Deliverables', subtitle: 'What does success look like for this project?', fields: ['deliverables', 'kpis'] as FieldPath<FormValues>[] },
  { id: 'contact', title: 'Almost done', subtitle: 'How should we stay in touch?', fields: ['primaryContactName', 'primaryContactInfo', 'communicationMode', 'approvalTimeline'] as FieldPath<FormValues>[] },
] as const;

const TOTAL_STEPS = STEPS.length;

interface CheckGroupProps {
  options: { id: string; label: string }[];
  value: string[] | undefined;
  onChange: (next: string[]) => void;
  columns?: 1 | 2 | 3;
}

function CheckGroup({ options, value, onChange, columns = 2 }: CheckGroupProps) {
  const cols = columns === 1 ? 'grid-cols-1' : columns === 3 ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2';
  return (
    <div className={`grid gap-2 ${cols}`}>
      {options.map((opt) => {
        const checked = value?.includes(opt.id) ?? false;
        return (
          <label
            key={opt.id}
            className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${
              checked
                ? 'border-primary/60 bg-primary/5'
                : 'border-border hover:border-primary/30 hover:bg-muted/40'
            }`}
          >
            <Checkbox
              checked={checked}
              onCheckedChange={(next) => {
                onChange(next ? [...(value ?? []), opt.id] : (value ?? []).filter(v => v !== opt.id));
              }}
            />
            <span className="text-sm font-medium">{opt.label}</span>
          </label>
        );
      })}
    </div>
  );
}

interface RadioCardsProps {
  options: { id: string; label: string }[];
  value: string | undefined;
  onChange: (next: string) => void;
  columns?: 1 | 2;
}

function RadioCards({ options, value, onChange, columns = 1 }: RadioCardsProps) {
  const cols = columns === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1';
  return (
    <RadioGroup value={value} onValueChange={onChange} className={`grid gap-2 ${cols}`}>
      {options.map((opt) => {
        const checked = value === opt.id;
        return (
          <label
            key={opt.id}
            className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${
              checked
                ? 'border-primary/60 bg-primary/5'
                : 'border-border hover:border-primary/30 hover:bg-muted/40'
            }`}
          >
            <RadioGroupItem value={opt.id} />
            <span className="text-sm font-medium">{opt.label}</span>
          </label>
        );
      })}
    </RadioGroup>
  );
}

const ClientIntakeForm = () => {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [submittedFullName, setSubmittedFullName] = useState('');
  const [submittedCompanyName, setSubmittedCompanyName] = useState('');
  const [submittedLocation, setSubmittedLocation] = useState('');
  // Account creation state
  const [accountPassword, setAccountPassword] = useState('');
  const [accountConfirm, setAccountConfirm] = useState('');
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
    defaultValues: {
      fullName: '', companyName: '', email: '', phone: '', website: '', location: '', socialMedia: '', industry: '',
      projectTitle: '', projectTypeOther: '', objectives: [], objectiveOther: '', description: '', startDate: '', endDate: '', importantDates: '',
      digitalServices: [], visualServices: [], videoServices: [], contentServices: [], mediaServices: [], techServices: [],
      brandTone: '', colorFonts: '', inspirationalBrands: '',
      targetAudience: '', audienceLocation: [], contentPlatforms: [], contentPlatformsOther: '',
      customBudget: '', paymentStructureOther: '',
      deliverables: '', kpis: [], kpiOther: '',
      primaryContactName: '', primaryContactInfo: '', communicationMode: [], additionalNotes: '',
    },
  });

  async function onNext() {
    const fields = STEPS[step].fields;
    const valid = fields.length === 0 || await form.trigger(fields);
    if (!valid) return;
    setStep(s => Math.min(s + 1, TOTAL_STEPS - 1));
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function onBack() {
    setStep(s => Math.max(0, s - 1));
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function onSubmit(data: FormValues) {
    try {
      const insertQuery = supabase.from('client_intake_submissions').insert({
        full_name: data.fullName,
        company_name: data.companyName,
        email: data.email,
        phone: data.phone,
        website: data.website || null,
        location: data.location,
        social_media: data.socialMedia || null,
        industry: data.industry,
        project_title: data.projectTitle,
        project_type: data.projectType,
        project_type_other: data.projectTypeOther || null,
        objectives: data.objectives ?? [],
        objective_other: data.objectiveOther || null,
        description: data.description,
        start_date: data.startDate,
        end_date: data.endDate || null,
        important_dates: data.importantDates || null,
        digital_services: data.digitalServices ?? [],
        visual_services: data.visualServices ?? [],
        video_services: data.videoServices ?? [],
        content_services: data.contentServices ?? [],
        media_services: data.mediaServices ?? [],
        tech_services: data.techServices ?? [],
        has_brand_guidelines: data.hasBrandGuidelines,
        brand_tone: data.brandTone || null,
        color_fonts: data.colorFonts || null,
        inspirational_brands: data.inspirationalBrands || null,
        target_audience: data.targetAudience,
        audience_location: data.audienceLocation,
        content_platforms: data.contentPlatforms,
        content_platforms_other: data.contentPlatformsOther || null,
        budget_range: data.budgetRange,
        custom_budget: data.customBudget || null,
        payment_structure: data.paymentStructure,
        payment_structure_other: data.paymentStructureOther || null,
        deliverables: data.deliverables,
        kpis: data.kpis,
        kpi_other: data.kpiOther || null,
        primary_contact_name: data.primaryContactName,
        primary_contact_info: data.primaryContactInfo,
        communication_mode: data.communicationMode,
        approval_timeline: data.approvalTimeline,
        additional_notes: data.additionalNotes || null,
        status: 'new',
      }).select('id').single();

      const result = await Promise.race([
        insertQuery,
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), 30_000)
        ),
      ]);

      if (result.error) {
        toast({ title: "Submission failed", description: result.error.message, variant: "destructive" });
        return;
      }

      // Store submission details for account creation step
      setSubmissionId(result.data?.id ?? null);
      setSubmittedEmail(data.email);
      setSubmittedFullName(data.fullName);
      setSubmittedCompanyName(data.companyName);
      setSubmittedLocation(data.location);

      supabase.functions.invoke('send-email', {
        body: {
          to: data.email,
          subject: 'Project brief received — CrémeTalent',
          html: `<p>Dear ${data.fullName},</p><p>Thank you for submitting your project brief to CrémeTalent. Our team will review your requirements and reach out within 2 business days.</p><p>Warm regards,<br/>The CrémeTalent Team</p>`
        }
      }).catch(() => null);

      setSubmitted(true);
    } catch (err) {
      const isTimeout = err instanceof Error && err.message === 'timeout';
      toast({
        title: isTimeout ? "Server is starting up" : "Submission error",
        description: isTimeout
          ? "The server is waking up. Please wait a few seconds and try again."
          : err instanceof Error ? err.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  }

  async function handleCreateAccount(e: React.FormEvent) {
    e.preventDefault();
    if (accountPassword.length < 8) {
      toast({ title: "Password too short", description: "Password must be at least 8 characters.", variant: "destructive" });
      return;
    }
    if (accountPassword !== accountConfirm) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }
    setCreatingAccount(true);
    const result = await supabase.functions.invoke('create-client-account', {
      body: {
        email: submittedEmail,
        password: accountPassword,
        full_name: submittedFullName,
        company_name: submittedCompanyName || undefined,
        location: submittedLocation || undefined,
        intake_submission_id: submissionId ?? undefined,
      },
    });
    setCreatingAccount(false);
    if (result.error || result.data?.error) {
      toast({
        title: "Account creation failed",
        description: result.error?.message ?? String(result.data?.error),
        variant: "destructive",
      });
      return;
    }
    // Sign in immediately after account creation
    const { error: signInError } = await signIn(submittedEmail, accountPassword);
    if (signInError) {
      toast({ title: "Account created! Please sign in.", description: "Head to /client/login to access your dashboard." });
      setAccountCreated(true);
      return;
    }
    setAccountCreated(true);
    navigate('/client/dashboard');
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/15 mb-6">
            <CheckCircle2 className="h-10 w-10 text-amber-700" />
          </div>
          <h2 className="display-xl text-4xl md:text-5xl font-semibold mb-4">Brief received.</h2>
          <p className="text-lg text-muted-foreground mb-4">
            Thank you for trusting CrémeTalent with your project. Our team will review your requirements and reach out within <strong>2 business days</strong>.
          </p>
          <Button asChild variant="outline" size="sm">
            <a href="/">Back to home</a>
          </Button>
        </div>

        {/* Account creation section */}
        {!accountCreated && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-full bg-amber-700/10 flex items-center justify-center">
                <UserPlus className="h-4 w-4 text-amber-700" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-base">Create your client account</h3>
                <p className="text-xs text-slate-500">Optional — post jobs and manage listings from your dashboard.</p>
              </div>
            </div>
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <Input value={submittedEmail} disabled className="bg-white text-slate-500" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  <Lock className="inline h-3.5 w-3.5 mr-1 text-slate-400" />
                  Choose a password
                </label>
                <Input
                  type="password"
                  placeholder="At least 8 characters"
                  value={accountPassword}
                  onChange={e => setAccountPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Confirm password</label>
                <Input
                  type="password"
                  placeholder="Repeat your password"
                  value={accountConfirm}
                  onChange={e => setAccountConfirm(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={creatingAccount} className="w-full gap-1.5">
                <UserPlus className="h-4 w-4" />
                {creatingAccount ? 'Creating account…' : 'Create account & go to dashboard'}
              </Button>
            </form>
          </div>
        )}
      </div>
    );
  }

  const current = STEPS[step];
  const progress = ((step + 1) / TOTAL_STEPS) * 100;
  const isLastStep = step === TOTAL_STEPS - 1;

  return (
    <div className="max-w-3xl mx-auto py-8 md:py-12 px-4">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-muted-foreground">
            Step {step + 1} of {TOTAL_STEPS}
          </span>
          <span className="text-sm font-medium text-amber-700">{current.title}</span>
        </div>
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step header */}
      <div className="mb-8">
        <h2 className="display-xl text-3xl md:text-5xl font-semibold mb-3 leading-[1.1]">
          {current.title}
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed">{current.subtitle}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* STEP 1: About you */}
          {step === 0 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="fullName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl><Input placeholder="Your name" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="companyName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company / brand name</FormLabel>
                    <FormControl><Input placeholder="Your company" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input type="email" placeholder="you@company.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl><Input placeholder="+234 …" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="location" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl><Input placeholder="Lagos, Nigeria" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="industry" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry / niche</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your industry…" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {INDUSTRY_OPTIONS.map(opt => (
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="website" render={({ field }) => (
                <FormItem>
                  <FormLabel>Website <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                  <FormControl><Input placeholder="https://…" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="socialMedia" render={({ field }) => (
                <FormItem>
                  <FormLabel>Social media handles <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                  <FormControl><Textarea placeholder="@yourcompany on Instagram, etc." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          )}

          {/* STEP 2: Project */}
          {step === 1 && (
            <div className="space-y-6">
              <FormField control={form.control} name="projectTitle" render={({ field }) => (
                <FormItem>
                  <FormLabel>Project title</FormLabel>
                  <FormControl><Input placeholder="Give it a name" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="projectType" render={({ field }) => (
                <FormItem>
                  <FormLabel>Type of project</FormLabel>
                  <FormControl>
                    <RadioCards
                      options={projectTypes}
                      value={field.value}
                      onChange={(v) => field.onChange(v as FormValues['projectType'])}
                      columns={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              {form.watch("projectType") === "other" && (
                <FormField control={form.control} name="projectTypeOther" render={({ field }) => (
                  <FormItem>
                    <FormControl><Input placeholder="Please specify" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              )}

              <FormField control={form.control} name="objectives" render={({ field }) => (
                <FormItem>
                  <FormLabel>What are you trying to achieve? <span className="text-muted-foreground font-normal">(select all that apply)</span></FormLabel>
                  <FormControl>
                    <CheckGroup
                      options={objectives}
                      value={field.value}
                      onChange={field.onChange}
                      columns={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              {form.watch("objectives")?.includes("other") && (
                <FormField control={form.control} name="objectiveOther" render={({ field }) => (
                  <FormItem>
                    <FormControl><Input placeholder="Please specify" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              )}

              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Brief description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about the project — what's the vision, what's the context, what would success look like?"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="startDate" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start date</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="endDate" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target end date <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="importantDates" render={({ field }) => (
                <FormItem>
                  <FormLabel>Key milestones or deadlines <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                  <FormControl><Textarea placeholder="Launch event on… campaign goes live… etc." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          )}

          {/* STEP 3: Talent needs */}
          {step === 2 && (
            <div className="space-y-8">
              {[
                { icon: Smartphone, title: 'Digital & social', name: 'digitalServices' as const, options: digitalServices },
                { icon: Palette, title: 'Visual design', name: 'visualServices' as const, options: visualServices },
                { icon: Video, title: 'Video & photo', name: 'videoServices' as const, options: videoServices },
                { icon: PenLine, title: 'Content creation', name: 'contentServices' as const, options: contentServices },
                { icon: Mic, title: 'Media & comms', name: 'mediaServices' as const, options: mediaServices },
                { icon: Monitor, title: 'Tech & web', name: 'techServices' as const, options: techServices },
              ].map(group => (
                <div key={group.name}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="inline-flex p-2 rounded-lg bg-primary/10">
                      <group.icon className="h-4 w-4 text-amber-700" />
                    </div>
                    <h3 className="text-base font-semibold">{group.title}</h3>
                  </div>
                  <FormField control={form.control} name={group.name} render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <CheckGroup options={group.options} value={field.value} onChange={field.onChange} columns={2} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              ))}
            </div>
          )}

          {/* STEP 4: Brand & style */}
          {step === 3 && (
            <div className="space-y-6">
              <FormField control={form.control} name="hasBrandGuidelines" render={({ field }) => (
                <FormItem>
                  <FormLabel>Do you have existing brand guidelines?</FormLabel>
                  <FormControl>
                    <RadioCards
                      options={[{ id: 'yes', label: 'Yes, we have guidelines' }, { id: 'no', label: "No, we'll need help defining them" }]}
                      value={field.value}
                      onChange={(v) => field.onChange(v as 'yes' | 'no')}
                      columns={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="brandTone" render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand tone & visual style <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                  <FormControl><Textarea placeholder="Fun, elegant, minimal, bold…" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="colorFonts" render={({ field }) => (
                <FormItem>
                  <FormLabel>Colors or fonts to use / avoid <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                  <FormControl><Textarea placeholder="We prefer… we avoid…" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="inspirationalBrands" render={({ field }) => (
                <FormItem>
                  <FormLabel>Brands or competitors you admire <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                  <FormControl><Textarea placeholder="Links or social handles" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          )}

          {/* STEP 5: Audience */}
          {step === 4 && (
            <div className="space-y-6">
              <FormField control={form.control} name="targetAudience" render={({ field }) => (
                <FormItem>
                  <FormLabel>Who is your target audience?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Demographics, behavior, interests, location, anything that paints a picture."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="audienceLocation" render={({ field }) => (
                <FormItem>
                  <FormLabel>Where is your audience?</FormLabel>
                  <FormControl>
                    <CheckGroup options={audienceLocations} value={field.value} onChange={field.onChange} columns={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="contentPlatforms" render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred content platforms</FormLabel>
                  <FormControl>
                    <CheckGroup options={contentPlatforms} value={field.value} onChange={field.onChange} columns={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              {form.watch("contentPlatforms")?.includes("other") && (
                <FormField control={form.control} name="contentPlatformsOther" render={({ field }) => (
                  <FormItem>
                    <FormControl><Input placeholder="Please specify" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              )}
            </div>
          )}

          {/* STEP 6: Budget */}
          {step === 5 && (
            <div className="space-y-6">
              <FormField control={form.control} name="budgetRange" render={({ field }) => (
                <FormItem>
                  <FormLabel>Total budget range</FormLabel>
                  <FormControl>
                    <RadioCards
                      options={budgetRanges}
                      value={field.value}
                      onChange={(v) => field.onChange(v as FormValues['budgetRange'])}
                      columns={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              {form.watch("budgetRange") === "custom" && (
                <FormField control={form.control} name="customBudget" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom budget</FormLabel>
                    <FormControl><Input placeholder="₦ or $ amount, or describe" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              )}
              <FormField control={form.control} name="paymentStructure" render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred payment structure</FormLabel>
                  <FormControl>
                    <RadioCards
                      options={paymentStructures}
                      value={field.value}
                      onChange={(v) => field.onChange(v as FormValues['paymentStructure'])}
                      columns={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              {form.watch("paymentStructure") === "other" && (
                <FormField control={form.control} name="paymentStructureOther" render={({ field }) => (
                  <FormItem>
                    <FormControl><Input placeholder="Please specify" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              )}
            </div>
          )}

          {/* STEP 7: Deliverables */}
          {step === 6 && (
            <div className="space-y-6">
              <FormField control={form.control} name="deliverables" render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected deliverables</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g. 10 graphics, 5 videos, 3 captions per week, a brand identity package…"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="kpis" render={({ field }) => (
                <FormItem>
                  <FormLabel>How will we measure success?</FormLabel>
                  <FormControl>
                    <CheckGroup options={kpis} value={field.value} onChange={field.onChange} columns={2} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              {form.watch("kpis")?.includes("other") && (
                <FormField control={form.control} name="kpiOther" render={({ field }) => (
                  <FormItem>
                    <FormControl><Input placeholder="Please specify" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              )}
            </div>
          )}

          {/* STEP 8: Contact */}
          {step === 7 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="primaryContactName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary contact name</FormLabel>
                    <FormControl><Input placeholder="Who should we talk to?" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="primaryContactInfo" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone or email</FormLabel>
                    <FormControl><Input placeholder="+234 … or name@company.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="communicationMode" render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred communication</FormLabel>
                  <FormControl>
                    <CheckGroup options={communicationModes} value={field.value} onChange={field.onChange} columns={2} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="approvalTimeline" render={({ field }) => (
                <FormItem>
                  <FormLabel>Approval turnaround</FormLabel>
                  <FormControl>
                    <RadioCards
                      options={approvalTimelines}
                      value={field.value}
                      onChange={(v) => field.onChange(v as FormValues['approvalTimeline'])}
                      columns={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="additionalNotes" render={({ field }) => (
                <FormItem>
                  <FormLabel>Anything else we should know? <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                  <FormControl><Textarea placeholder="Special instructions, context, anything on your mind…" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          )}

          {/* Footer navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              onClick={onBack}
              disabled={step === 0}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            {isLastStep ? (
              <Button
                type="submit"
                size="lg"
                disabled={form.formState.isSubmitting}
                className="gap-2 shadow-lg shadow-primary/20"
              >
                {form.formState.isSubmitting ? "Submitting…" : (
                  <>
                    Submit brief
                    <Check className="h-4 w-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button type="button" onClick={onNext} size="lg" className="gap-2 shadow-lg shadow-primary/20">
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ClientIntakeForm;
