
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import CreateProject from "./pages/CreateProject";
import NotFound from "./pages/NotFound";
import AboutUs from "./pages/AboutUs";
import Services from "./pages/Services";
import HowItWorks from "./pages/HowItWorks";
import TalentPool from "./pages/TalentPool";
import JoinTalentPool from "./pages/JoinTalentPool";
import TrainingResources from "./pages/TrainingResources";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import TalentPublicProfile from "./pages/TalentPublicProfile";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import ClientIntakeForm from "./pages/ClientIntakeForm";

// Admin routes
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

// Talent routes
import TalentLogin from "./pages/talent/TalentLogin";
import TalentProfile from "./pages/talent/TalentProfile";
import TalentSetPassword from "./pages/talent/TalentSetPassword";
import { TalentRoute } from "./components/talent/TalentRoute";

// Client routes
import ClientLogin from "./pages/client/ClientLogin";
import ClientSetPassword from "./pages/client/ClientSetPassword";
import ClientDashboard from "./pages/client/ClientDashboard";
import { ClientRoute } from "./components/client/ClientRoute";

// Jobs
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/create-project" element={<CreateProject />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/services" element={<Services />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/talent-pool" element={<TalentPool />} />
          <Route path="/join-talent-pool" element={<JoinTalentPool />} />
          <Route path="/client-intake-form" element={<ClientIntakeForm />} />
          <Route path="/training-resources" element={<TrainingResources />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/talent/:id" element={<TalentPublicProfile />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* Talent Routes */}
          <Route path="/talent" element={<Navigate to="/talent/login" replace />} />
          <Route path="/talent/login" element={<TalentLogin />} />
          <Route path="/talent/set-password" element={<TalentSetPassword />} />
          <Route path="/talent/profile" element={<TalentRoute><TalentProfile /></TalentRoute>} />

          {/* Client Routes */}
          <Route path="/client" element={<Navigate to="/client/login" replace />} />
          <Route path="/client/login" element={<ClientLogin />} />
          <Route path="/client/set-password" element={<ClientSetPassword />} />
          <Route path="/client/dashboard" element={<ClientRoute><ClientDashboard /></ClientRoute>} />

          {/* Jobs */}
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
