
import React from 'react';
import { Button } from "@/components/ui/button";
import { HandHeart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 md:py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <HandHeart className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-primary-800">CrémeTalent</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-laundry-800 hover:text-primary font-medium">Home</Link>
          <Link to="/projects" className="text-laundry-800 hover:text-primary font-medium">Projects</Link>
          <a href="#about" className="text-laundry-800 hover:text-primary font-medium">About</a>
          <a href="#contact" className="text-laundry-800 hover:text-primary font-medium">Contact</a>
        </div>
        
        <Link to="/create-project" className="hidden md:block">
          <Button variant="default">
            Start a Project
          </Button>
        </Link>
        
        {/* Mobile menu button */}
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden text-laundry-800 hover:text-primary focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white px-4 py-3 shadow-md">
          <div className="flex flex-col space-y-3">
            <Link to="/" className="text-laundry-800 hover:text-primary font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/projects" className="text-laundry-800 hover:text-primary font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Projects</Link>
            <a href="#about" className="text-laundry-800 hover:text-primary font-medium py-2" onClick={() => setMobileMenuOpen(false)}>About</a>
            <a href="#contact" className="text-laundry-800 hover:text-primary font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Contact</a>
            <Link to="/create-project" className="w-full mt-2" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full" variant="default">Start a Project</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
