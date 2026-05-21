import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow flex items-center justify-center bg-amber-50 py-16">
        <div className="text-center px-4">
          <FileQuestion className="h-24 w-24 text-amber-500 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4 text-amber-800">404</h1>
          <p className="text-2xl text-gray-600 mb-8">This page doesn't exist</p>
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
