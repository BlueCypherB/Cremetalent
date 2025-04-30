
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }).max(100, {
    message: "Title must not exceed 100 characters."
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  shortDescription: z.string().min(20, {
    message: "Short description must be at least 20 characters.",
  }).max(200, {
    message: "Short description must not exceed 200 characters."
  }),
  fullDescription: z.string().min(100, {
    message: "Full description must be at least 100 characters.",
  }),
  goalAmount: z.string().refine((val) => {
    const num = Number(val);
    return !isNaN(num) && num > 0;
  }, {
    message: "Goal amount must be a positive number.",
  }),
  duration: z.string().refine((val) => {
    const num = Number(val);
    return !isNaN(num) && num >= 7 && num <= 90;
  }, {
    message: "Campaign duration must be between 7 and 90 days.",
  }),
});

const categories = [
  { value: "", label: "Select a category" },
  { value: "Education", label: "Education" },
  { value: "Arts", label: "Arts & Creative Works" },
  { value: "Technology", label: "Technology & Innovation" },
  { value: "Community", label: "Community & Local Projects" },
  { value: "Environment", label: "Environment & Sustainability" },
  { value: "Healthcare", label: "Healthcare & Medical" },
  { value: "Film", label: "Film & Video" },
  { value: "Music", label: "Music & Performance" },
  { value: "Publishing", label: "Publishing & Writing" },
  { value: "Other", label: "Other" },
];

const CreateProject = () => {
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      shortDescription: "",
      fullDescription: "",
      goalAmount: "",
      duration: "30",
    },
  });
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real application, this would connect to a backend API
    console.log(values);
    toast.success("Project created successfully! In a real app, this would be saved to a database.");
    
    // Simulate a successful creation and redirect
    setTimeout(() => {
      navigate("/projects");
    }, 1500);
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Create Your Project</h1>
          <p className="text-muted-foreground mb-8">Share your vision with the world and find supporters who believe in your idea</p>
          
          <Card className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your project title" {...field} />
                      </FormControl>
                      <FormDescription>
                        Choose a clear, specific title that describes your project.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          {...field}
                        >
                          {categories.map((category) => (
                            <option key={category.value} value={category.value}>
                              {category.label}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormDescription>
                        Select the category that best represents your project.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Briefly describe your project (1-2 sentences)"
                          {...field}
                          className="resize-none"
                          rows={2}
                        />
                      </FormControl>
                      <FormDescription>
                        This will appear in project cards and search results.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="fullDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Provide a detailed description of your project, its goals, and why it matters"
                          {...field}
                          className="min-h-[200px]"
                        />
                      </FormControl>
                      <FormDescription>
                        Tell your story, explain your project's purpose, and share why people should support it.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="goalAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Funding Goal ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="1000"
                            min="1"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Set a realistic amount needed to complete your project.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Campaign Duration (Days)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="30"
                            min="7"
                            max="90"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Campaigns can run between 7-90 days.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="pt-4">
                  <p className="text-sm text-muted-foreground mb-6">
                    In a complete application, you would be able to upload project images, add team members, 
                    and configure reward tiers for donors here.
                  </p>
                  
                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Create Project</Button>
                  </div>
                </div>
              </form>
            </Form>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CreateProject;
