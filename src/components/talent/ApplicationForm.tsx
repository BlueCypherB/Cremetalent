
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const formSchema = z.object({
  fullName: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(7, { message: 'Please enter a valid phone number' }),
  location: z.string().min(2, { message: 'Please enter your location' }),
  disciplines: z.array(z.string()).nonempty({ message: 'Please select at least one discipline' }),
  skillTags: z.string().optional(),
  proficiencyLevel: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  yearsExperience: z.string().min(1, { message: 'Please enter your years of experience' }),
  portfolioUrls: z.string().min(5, { message: 'Please provide at least one portfolio URL' }),
  socialLinks: z.string().optional(),
  workType: z.array(z.string()).nonempty({ message: 'Please select at least one work type' }),
  bio: z.string().min(20, { message: 'Bio should be at least 20 characters' }),
  availability: z.string().min(1, { message: 'Please enter your availability' }),
});

type FormValues = z.infer<typeof formSchema>;

const ApplicationForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      disciplines: [],
      skillTags: '',
      proficiencyLevel: 'Intermediate',
      yearsExperience: '',
      portfolioUrls: '',
      socialLinks: '',
      workType: [],
      bio: '',
      availability: '',
    },
  });

  function onSubmit(data: FormValues) {
    console.log(data);
    // In a real implementation, this would send the data to your backend
    alert('Application submitted successfully! We will review your application and get back to you soon.');
    form.reset();
  }

  const disciplines = [
    { id: 'graphic-design', label: 'Graphic Design' },
    { id: 'photography', label: 'Photography' },
    { id: 'videography', label: 'Videography' },
    { id: 'copywriting', label: 'Copywriting' },
    { id: 'social-media', label: 'Social Media Management' },
    { id: 'brand-strategy', label: 'Brand Strategy' },
    { id: 'ui-ux', label: 'UI/UX Design' },
  ];

  const workTypes = [
    { id: 'freelance', label: 'Freelance' },
    { id: 'contract', label: 'Contract' },
    { id: 'full-time', label: 'Full-time' },
    { id: 'remote', label: 'Remote' },
  ];

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Join Our Talent Pool</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address*</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number*</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location*</FormLabel>
                    <FormControl>
                      <Input placeholder="City, State, Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Professional Information</h3>
            
            <FormField
              control={form.control}
              name="disciplines"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Creative Discipline(s)*</FormLabel>
                    <FormDescription>
                      Select all that apply to your expertise
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {disciplines.map((discipline) => (
                      <FormField
                        key={discipline.id}
                        control={form.control}
                        name="disciplines"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={discipline.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(discipline.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, discipline.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== discipline.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {discipline.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skillTags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skill Tags (Optional)</FormLabel>
                  <FormDescription>
                    Enter specific skills separated by commas (e.g. Adobe Illustrator, Final Cut Pro)
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="Adobe Illustrator, Figma, Final Cut Pro..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="proficiencyLevel"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Proficiency Level*</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1 sm:flex-row sm:space-x-4 sm:space-y-0"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Beginner" />
                        </FormControl>
                        <FormLabel className="font-normal">Beginner</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Intermediate" />
                        </FormControl>
                        <FormLabel className="font-normal">Intermediate</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Advanced" />
                        </FormControl>
                        <FormLabel className="font-normal">Advanced</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="yearsExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience*</FormLabel>
                    <FormControl>
                      <Input placeholder="3+" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability (Start Date)*</FormLabel>
                    <FormControl>
                      <Input placeholder="Immediate, 2 weeks notice..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="workType"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Preferred Work Type*</FormLabel>
                    <FormDescription>
                      Select all that apply
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {workTypes.map((workType) => (
                      <FormField
                        key={workType.id}
                        control={form.control}
                        name="workType"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={workType.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(workType.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, workType.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== workType.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {workType.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Portfolio & Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Portfolio & Links</h3>
            <FormField
              control={form.control}
              name="portfolioUrls"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Portfolio URL(s)*</FormLabel>
                  <FormDescription>
                    Enter your portfolio URLs (one per line or separated by commas)
                  </FormDescription>
                  <FormControl>
                    <Textarea 
                      placeholder="https://www.behance.net/yourname
https://www.dribbble.com/yourname" 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="socialLinks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Social Media Links (Optional)</FormLabel>
                  <FormDescription>
                    Enter your social media links (one per line or separated by commas)
                  </FormDescription>
                  <FormControl>
                    <Textarea 
                      placeholder="LinkedIn: https://www.linkedin.com/in/yourname
Instagram: https://www.instagram.com/yourname" 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Bio */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">About You</h3>
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Bio*</FormLabel>
                  <FormDescription>
                    Tell us a bit about yourself and your creative journey
                  </FormDescription>
                  <FormControl>
                    <Textarea 
                      placeholder="I am a creative professional with experience in..." 
                      className="min-h-[150px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full md:w-auto">Submit Application</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ApplicationForm;
