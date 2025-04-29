
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { WashingMachine } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center bg-laundry-50 py-16">
        <div className="text-center px-4">
          <WashingMachine className="h-24 w-24 text-laundry-500 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4 text-laundry-800">404</h1>
          <p className="text-2xl text-gray-600 mb-8">Oops! This page seems to have been lost in the wash</p>
          <Button asChild size="lg">
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NotFound;
