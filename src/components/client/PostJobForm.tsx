import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { TALENT_CATEGORIES_BY_SECTOR, ENGAGEMENT_TYPES, EXPERIENCE_LEVELS } from '@/lib/taxonomy';

const jobSchema = z.object({
  title: z.string().min(3, 'Job title is required (min 3 characters)'),
  specialization: z.string().min(1, 'Please select a specialization'),
  engagement_type: z.enum(['project', 'part-time', 'full-time', 'retainer'], {
    required_error: 'Please select an engagement type',
  }),
  experience_level: z.string().optional(),
  location: z.string().optional(),
  is_remote: z.boolean().default(false),
  budget_range: z.string().optional(),
  deadline: z.string().optional(),
  description: z.string().min(50, 'Description must be at least 50 characters'),
});

type JobFormValues = z.infer<typeof jobSchema>;

interface PostJobFormProps {
  onSuccess?: () => void;
  defaultCompanyName?: string;
}

const PostJobForm = ({ onSuccess }: PostJobFormProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: '',
      specialization: '',
      engagement_type: undefined,
      experience_level: '',
      location: '',
      is_remote: false,
      budget_range: '',
      deadline: '',
      description: '',
    },
  });

  async function onSubmit(data: JobFormValues) {
    if (!user) return;

    setIsSubmitting(true);
    const { error } = await supabase.from('job_listings').insert({
      client_id: user.id,
      title: data.title,
      specialization: data.specialization,
      engagement_type: data.engagement_type,
      experience_level: data.experience_level || null,
      location: data.location || null,
      is_remote: data.is_remote,
      budget_range: data.budget_range || null,
      deadline: data.deadline || null,
      description: data.description,
      status: 'draft',
    });

    setIsSubmitting(false);

    if (error) {
      toast({ title: "Failed to post job", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Job saved as draft", description: "Click 'Publish' in My Job Postings to make it live." });
    queryClient.invalidateQueries({ queryKey: ['job_listings', 'client', user.id] });
    form.reset();
    onSuccess?.();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField control={form.control} name="title" render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Job Title *</FormLabel>
              <FormControl><Input placeholder="e.g. Senior Graphic Designer" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="specialization" render={({ field }) => (
            <FormItem>
              <FormLabel>Specialization *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Select specialization…" /></SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-72">
                  {Object.entries(TALENT_CATEGORIES_BY_SECTOR).map(([sector, cats]) => (
                    <div key={sector}>
                      <div className="px-2 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                        {sector}
                      </div>
                      {cats.map(c => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="engagement_type" render={({ field }) => (
            <FormItem>
              <FormLabel>Engagement Type *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Select type…" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ENGAGEMENT_TYPES.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="experience_level" render={({ field }) => (
            <FormItem>
              <FormLabel>Experience Level <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ''}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Any level" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  {EXPERIENCE_LEVELS.map(l => (
                    <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="location" render={({ field }) => (
            <FormItem>
              <FormLabel>Location <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
              <FormControl><Input placeholder="e.g. Lagos, Nigeria" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="is_remote" render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-3 space-y-0 pt-6">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel className="font-normal">Remote / hybrid work available</FormLabel>
            </FormItem>
          )} />

          <FormField control={form.control} name="budget_range" render={({ field }) => (
            <FormItem>
              <FormLabel>Budget / Compensation <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
              <FormControl><Input placeholder="e.g. ₦150,000/month or negotiable" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="deadline" render={({ field }) => (
            <FormItem>
              <FormLabel>Application Deadline <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
              <FormControl><Input type="date" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem>
            <FormLabel>Job Description *</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe the role, responsibilities, required skills, and what you're looking for…"
                rows={7}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <Button type="submit" disabled={isSubmitting} size="lg">
          {isSubmitting ? 'Saving…' : 'Save as Draft'}
        </Button>
      </form>
    </Form>
  );
};

export default PostJobForm;
