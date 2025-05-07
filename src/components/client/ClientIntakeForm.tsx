
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

// Define form schema with Zod
const formSchema = z.object({
  // Section 1: Client Details
  fullName: z.string().min(2, { message: "Full name is required" }),
  companyName: z.string().min(1, { message: "Company name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(5, { message: "Phone number is required" }),
  website: z.string().optional(),
  location: z.string().min(2, { message: "Location is required" }),
  socialMedia: z.string().optional(),
  industry: z.string().min(1, { message: "Industry is required" }),
  
  // Section 2: Project Overview
  projectTitle: z.string().min(1, { message: "Project title is required" }),
  projectType: z.enum([
    "one-time", "monthly", "ongoing", "event", "launch", "other"
  ]),
  projectTypeOther: z.string().optional(),
  objectives: z.array(z.string()).optional(),
  objectiveOther: z.string().optional(),
  description: z.string().min(10, { message: "Please provide a brief description" }),
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string().optional(),
  importantDates: z.string().optional(),
  
  // Section 3: Creative Talent Needs
  digitalServices: z.array(z.string()).optional(),
  visualServices: z.array(z.string()).optional(),
  videoServices: z.array(z.string()).optional(),
  contentServices: z.array(z.string()).optional(),
  mediaServices: z.array(z.string()).optional(),
  techServices: z.array(z.string()).optional(),
  
  // Section 4: Brand & Style Guidelines
  hasBrandGuidelines: z.enum(["yes", "no"]),
  brandTone: z.string().optional(),
  colorFonts: z.string().optional(),
  inspirationalBrands: z.string().optional(),
  
  // Section 5: Audience Targeting
  targetAudience: z.string().min(5, { message: "Target audience information is required" }),
  audienceLocation: z.array(z.string()).min(1, { message: "Please select at least one location" }),
  contentPlatforms: z.array(z.string()).min(1, { message: "Please select at least one platform" }),
  contentPlatformsOther: z.string().optional(),
  
  // Section 6: Budget & Payment
  budgetRange: z.enum(["100k-250k", "250k-500k", "500k-1M", "1M-2M", "custom"]),
  customBudget: z.string().optional(),
  paymentStructure: z.enum(["one-off", "split", "monthly", "other"]),
  paymentStructureOther: z.string().optional(),
  
  // Section 7: Deliverables & Expectations
  deliverables: z.string().min(5, { message: "Please describe expected deliverables" }),
  kpis: z.array(z.string()).min(1, { message: "Please select at least one KPI" }),
  kpiOther: z.string().optional(),
  
  // Section 8: Communication & Approvals
  primaryContactName: z.string().min(2, { message: "Contact name is required" }),
  primaryContactInfo: z.string().min(5, { message: "Contact information is required" }),
  communicationMode: z.array(z.string()).min(1, { message: "Please select at least one communication mode" }),
  approvalTimeline: z.enum(["24h", "48h", "72h", "flexible"]),
  additionalNotes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Define checkbox items for each section
const projectTypes = [
  { id: "one-time", label: "One-time Campaign" },
  { id: "monthly", label: "Monthly Retainer" },
  { id: "ongoing", label: "Ongoing Project" },
  { id: "event", label: "Event-Based" },
  { id: "launch", label: "Product/Service Launch" },
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
  { id: "graphic-design", label: "Graphic Design (general)" },
  { id: "motion", label: "Motion Graphics" },
  { id: "brand-identity", label: "Brand Identity Design (logos, colors, fonts)" },
  { id: "uiux", label: "UI/UX & Website Mockups" },
  { id: "presentations", label: "Presentations/Decks" },
  { id: "infographics", label: "Infographics" },
];

const videoServices = [
  { id: "videography", label: "Videography" },
  { id: "editing", label: "Video Editing" },
  { id: "reels", label: "Reels/Short-form Videos" },
  { id: "photography", label: "Photography (products, events, lifestyle)" },
  { id: "drone", label: "Drone Coverage" },
  { id: "animation", label: "Animation (2D/3D)" },
];

const contentServices = [
  { id: "content-strategy", label: "Content Strategy" },
  { id: "copywriting", label: "Copywriting" },
  { id: "scriptwriting", label: "Scriptwriting" },
  { id: "blogging", label: "Blogging/Articles" },
  { id: "captions", label: "Caption Writing" },
  { id: "seo", label: "SEO Content Writing" },
];

const mediaServices = [
  { id: "voice-over", label: "Voice-Over Work" },
  { id: "hosting", label: "Event Hosting" },
  { id: "podcast", label: "Podcast Production" },
  { id: "media-training", label: "Media Training" },
  { id: "pr", label: "Public Relations Strategy" },
];

const techServices = [
  { id: "web-dev", label: "Website Design/Development" },
  { id: "ecommerce", label: "E-commerce Setup" },
  { id: "landing-pages", label: "Landing Pages" },
  { id: "funnel", label: "Funnel Building" },
  { id: "email", label: "Email Marketing Campaigns" },
];

const audienceLocations = [
  { id: "nigeria", label: "Nigeria" },
  { id: "africa", label: "Africa (other)" },
  { id: "usa", label: "USA" },
  { id: "europe", label: "Europe" },
  { id: "global", label: "Global" },
];

const contentPlatforms = [
  { id: "instagram", label: "Instagram" },
  { id: "facebook", label: "Facebook" },
  { id: "tiktok", label: "TikTok" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "youtube", label: "YouTube" },
  { id: "twitter", label: "Twitter/X" },
  { id: "other", label: "Other" },
];

const budgetRanges = [
  { id: "100k-250k", label: "₦100k–₦250k" },
  { id: "250k-500k", label: "₦250k–₦500k" },
  { id: "500k-1M", label: "₦500k–₦1M" },
  { id: "1M-2M", label: "₦1M–₦2M" },
  { id: "custom", label: "Custom/Negotiable" },
];

const paymentStructures = [
  { id: "one-off", label: "One-off" },
  { id: "split", label: "50% upfront, 50% after delivery" },
  { id: "monthly", label: "Monthly Retainer" },
  { id: "other", label: "Other" },
];

const kpis = [
  { id: "reach", label: "Reach/Impressions" },
  { id: "engagement", label: "Engagement (Likes, Shares, Comments)" },
  { id: "clicks", label: "Website Clicks" },
  { id: "conversions", label: "Sales/Conversions" },
  { id: "growth", label: "Community Growth" },
  { id: "other", label: "Other" },
];

const communicationModes = [
  { id: "email", label: "Email" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "zoom", label: "Zoom Calls" },
  { id: "phone", label: "Phone Call" },
];

const approvalTimelines = [
  { id: "24h", label: "24 hours" },
  { id: "48h", label: "48 hours" },
  { id: "72h", label: "72 hours" },
  { id: "flexible", label: "Flexible" },
];

const ClientIntakeForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      objectives: [],
      digitalServices: [],
      visualServices: [],
      videoServices: [],
      contentServices: [],
      mediaServices: [],
      techServices: [],
      audienceLocation: [],
      contentPlatforms: [],
      kpis: [],
      communicationMode: [],
    },
  });

  function onSubmit(data: FormValues) {
    console.log(data);
    toast({
      title: "Form submitted",
      description: "Thank you for submitting your intake form. We'll get back to you shortly.",
    });
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Card className="border-amber-200">
        <CardHeader className="bg-amber-50">
          <CardTitle className="text-center text-2xl">CreméTalentAfrica – Client Intake Form</CardTitle>
          <CardDescription className="text-center text-lg">
            Helping You Find the Right Creatives for Your Vision
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Section 1: Client Details */}
              <div>
                <h3 className="text-xl font-semibold mb-4">SECTION 1: CLIENT DETAILS</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company/Brand Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your company" {...field} />
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
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="your@email.com" type="email" {...field} />
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
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+234..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website (if any)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
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
                        <FormLabel>Location (City, Country)</FormLabel>
                        <FormControl>
                          <Input placeholder="Lagos, Nigeria" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="socialMedia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Social Media Handles (Instagram, LinkedIn, etc.)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="@yourcompany (Instagram), etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry/Niche</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Fashion, Tech, Healthcare" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Separator />
              
              {/* Section 2: Project Overview */}
              <div>
                <h3 className="text-xl font-semibold mb-4">SECTION 2: PROJECT OVERVIEW</h3>
                <FormField
                  control={form.control}
                  name="projectTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Your project name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="mt-4">
                  <FormLabel>Type of Project</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    {projectTypes.map((type) => (
                      <div key={type.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`project-type-${type.id}`} 
                          onCheckedChange={() => {
                            form.setValue("projectType", type.id as any);
                          }} 
                        />
                        <Label htmlFor={`project-type-${type.id}`}>{type.label}</Label>
                      </div>
                    ))}
                  </div>
                  {form.watch("projectType") === "other" && (
                    <FormField
                      control={form.control}
                      name="projectTypeOther"
                      render={({ field }) => (
                        <FormItem className="mt-2">
                          <FormControl>
                            <Input placeholder="Please specify" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                
                <div className="mt-4">
                  <FormLabel>What is the objective of this project? (Check all that apply)</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    {objectives.map((objective) => (
                      <FormField
                        key={objective.id}
                        control={form.control}
                        name="objectives"
                        render={({ field }) => {
                          return (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(objective.id)}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...(field.value || []), objective.id]
                                      : field.value?.filter((value) => value !== objective.id) || [];
                                    field.onChange(updatedValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{objective.label}</FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  {form.watch("objectives")?.includes("other") && (
                    <FormField
                      control={form.control}
                      name="objectiveOther"
                      render={({ field }) => (
                        <FormItem className="mt-2">
                          <FormControl>
                            <Input placeholder="Please specify" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                
                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brief Description of the Project/Initiative</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please describe your project in detail..." 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date / Timeline</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="importantDates"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Are there any important dates/deadlines we should know about?</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please list any important milestones or deadlines..." 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Separator />
              
              {/* Section 3: Creative Talent Needs */}
              <div>
                <h3 className="text-xl font-semibold mb-4">SECTION 3: CREATIVE TALENT NEEDS</h3>
                <p className="mb-4">What creative services are you looking to hire? (Check all that apply)</p>
                
                <div className="mt-4">
                  <h4 className="text-lg font-medium mb-2">📱 Digital & Social Media</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {digitalServices.map((service) => (
                      <FormField
                        key={service.id}
                        control={form.control}
                        name="digitalServices"
                        render={({ field }) => {
                          return (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(service.id)}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...(field.value || []), service.id]
                                      : field.value?.filter((value) => value !== service.id) || [];
                                    field.onChange(updatedValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{service.label}</FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-lg font-medium mb-2">🎨 Visual Design</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {visualServices.map((service) => (
                      <FormField
                        key={service.id}
                        control={form.control}
                        name="visualServices"
                        render={({ field }) => {
                          return (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(service.id)}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...(field.value || []), service.id]
                                      : field.value?.filter((value) => value !== service.id) || [];
                                    field.onChange(updatedValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{service.label}</FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-lg font-medium mb-2">🎥 Video & Photo</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {videoServices.map((service) => (
                      <FormField
                        key={service.id}
                        control={form.control}
                        name="videoServices"
                        render={({ field }) => {
                          return (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(service.id)}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...(field.value || []), service.id]
                                      : field.value?.filter((value) => value !== service.id) || [];
                                    field.onChange(updatedValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{service.label}</FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-lg font-medium mb-2">✍️ Content Creation</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {contentServices.map((service) => (
                      <FormField
                        key={service.id}
                        control={form.control}
                        name="contentServices"
                        render={({ field }) => {
                          return (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(service.id)}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...(field.value || []), service.id]
                                      : field.value?.filter((value) => value !== service.id) || [];
                                    field.onChange(updatedValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{service.label}</FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-lg font-medium mb-2">🎤 Media & Communication</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {mediaServices.map((service) => (
                      <FormField
                        key={service.id}
                        control={form.control}
                        name="mediaServices"
                        render={({ field }) => {
                          return (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(service.id)}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...(field.value || []), service.id]
                                      : field.value?.filter((value) => value !== service.id) || [];
                                    field.onChange(updatedValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{service.label}</FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-lg font-medium mb-2">💻 Tech & Web</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {techServices.map((service) => (
                      <FormField
                        key={service.id}
                        control={form.control}
                        name="techServices"
                        render={({ field }) => {
                          return (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(service.id)}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...(field.value || []), service.id]
                                      : field.value?.filter((value) => value !== service.id) || [];
                                    field.onChange(updatedValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{service.label}</FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Section 4: Brand & Style Guidelines */}
              <div>
                <h3 className="text-xl font-semibold mb-4">SECTION 4: BRAND & STYLE GUIDELINES</h3>
                <FormField
                  control={form.control}
                  name="hasBrandGuidelines"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Do you have existing brand guidelines?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="yes" />
                            </FormControl>
                            <FormLabel className="font-normal">Yes (Please upload)</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="no" />
                            </FormControl>
                            <FormLabel className="font-normal">No</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="brandTone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Describe your brand's tone & visual style (e.g., fun, elegant, minimal, bold)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Our brand is..." 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="colorFonts"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fonts or color schemes to use/avoid</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="We prefer... We avoid..." 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="inspirationalBrands"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inspirational Brands/Competitors (Links or Handles)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="We admire..." 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Separator />
              
              {/* Section 5: Audience Targeting */}
              <div>
                <h3 className="text-xl font-semibold mb-4">SECTION 5: AUDIENCE TARGETING</h3>
                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Who is your target audience? (Demographics, behavior, location, interests)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Our audience is..." 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="mt-4">
                  <FormLabel>Where is your audience primarily located?</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {audienceLocations.map((location) => (
                      <FormField
                        key={location.id}
                        control={form.control}
                        name="audienceLocation"
                        render={({ field }) => {
                          return (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(location.id)}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...(field.value || []), location.id]
                                      : field.value?.filter((value) => value !== location.id) || [];
                                    field.onChange(updatedValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{location.label}</FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="mt-4">
                  <FormLabel>Preferred Content Platforms</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {contentPlatforms.map((platform) => (
                      <FormField
                        key={platform.id}
                        control={form.control}
                        name="contentPlatforms"
                        render={({ field }) => {
                          return (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(platform.id)}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...(field.value || []), platform.id]
                                      : field.value?.filter((value) => value !== platform.id) || [];
                                    field.onChange(updatedValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{platform.label}</FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  
                  {form.watch("contentPlatforms")?.includes("other") && (
                    <FormField
                      control={form.control}
                      name="contentPlatformsOther"
                      render={({ field }) => (
                        <FormItem className="mt-2">
                          <FormControl>
                            <Input placeholder="Please specify" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
              
              <Separator />
              
              {/* Section 6: Budget & Payment */}
              <div>
                <h3 className="text-xl font-semibold mb-4">SECTION 6: BUDGET & PAYMENT</h3>
                <FormField
                  control={form.control}
                  name="budgetRange"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>What is your total budget range for this project (₦ or $)?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          {budgetRanges.map((budget) => (
                            <FormItem className="flex items-center space-x-3 space-y-0" key={budget.id}>
                              <FormControl>
                                <RadioGroupItem value={budget.id} />
                              </FormControl>
                              <FormLabel className="font-normal">{budget.label}</FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {form.watch("budgetRange") === "custom" && (
                  <FormField
                    control={form.control}
                    name="customBudget"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <FormLabel>Custom Budget</FormLabel>
                        <FormControl>
                          <Input placeholder="Please specify" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="paymentStructure"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Preferred Payment Structure</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            {paymentStructures.map((payment) => (
                              <FormItem className="flex items-center space-x-3 space-y-0" key={payment.id}>
                                <FormControl>
                                  <RadioGroupItem value={payment.id} />
                                </FormControl>
                                <FormLabel className="font-normal">{payment.label}</FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {form.watch("paymentStructure") === "other" && (
                    <FormField
                      control={form.control}
                      name="paymentStructureOther"
                      render={({ field }) => (
                        <FormItem className="mt-2">
                          <FormControl>
                            <Input placeholder="Please specify" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
              
              <Separator />
              
              {/* Section 7: Deliverables & Expectations */}
              <div>
                <h3 className="text-xl font-semibold mb-4">SECTION 7: DELIVERABLES & EXPECTATIONS</h3>
                <FormField
                  control={form.control}
                  name="deliverables"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What final deliverables are expected? (e.g., 10 graphics, 5 videos, 3 captions per week, etc.)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="We expect..." 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="mt-4">
                  <FormLabel>What metrics or KPIs will define success for you?</FormLabel>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {kpis.map((kpi) => (
                      <FormField
                        key={kpi.id}
                        control={form.control}
                        name="kpis"
                        render={({ field }) => {
                          return (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(kpi.id)}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...(field.value || []), kpi.id]
                                      : field.value?.filter((value) => value !== kpi.id) || [];
                                    field.onChange(updatedValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{kpi.label}</FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  
                  {form.watch("kpis")?.includes("other") && (
                    <FormField
                      control={form.control}
                      name="kpiOther"
                      render={({ field }) => (
                        <FormItem className="mt-2">
                          <FormControl>
                            <Input placeholder="Please specify" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                
                <div className="mt-4">
                  <FormLabel>Upload Files (logos, past campaigns, references)</FormLabel>
                  <div className="mt-2 p-4 border border-dashed border-gray-300 rounded-md">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        Click or drag files to upload (coming soon)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Section 8: Communication & Approvals */}
              <div>
                <h3 className="text-xl font-semibold mb-4">SECTION 8: COMMUNICATION & APPROVALS</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="primaryContactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Who is the primary contact for this project? (Name)</FormLabel>
                        <FormControl>
                          <Input placeholder="Contact name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="primaryContactInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone/Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Contact information" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="mt-4">
                  <FormLabel>Preferred mode of communication</FormLabel>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {communicationModes.map((mode) => (
                      <FormField
                        key={mode.id}
                        control={form.control}
                        name="communicationMode"
                        render={({ field }) => {
                          return (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(mode.id)}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...(field.value || []), mode.id]
                                      : field.value?.filter((value) => value !== mode.id) || [];
                                    field.onChange(updatedValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{mode.label}</FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="approvalTimeline"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Approval Timeline</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-wrap gap-4"
                          >
                            {approvalTimelines.map((timeline) => (
                              <FormItem className="flex items-center space-x-3 space-y-0" key={timeline.id}>
                                <FormControl>
                                  <RadioGroupItem value={timeline.id} />
                                </FormControl>
                                <FormLabel className="font-normal">{timeline.label}</FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="additionalNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Other Important Notes or Special Instructions</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Additional information..." 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="mt-8">
                <Button type="submit" className="w-full md:w-auto" size="lg">
                  Submit Application
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientIntakeForm;
