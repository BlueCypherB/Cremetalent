
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
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-laundry-800 hover:text-primary font-medium">Home</Link>
          <Link to="/about" className="text-laundry-800 hover:text-primary font-medium">About Us</Link>
          <Link to="/services" className="text-laundry-800 hover:text-primary font-medium">Services</Link>
          <Link to="/how-it-works" className="text-laundry-800 hover:text-primary font-medium">How It Works</Link>
          <Link to="/talent-pool" className="text-laundry-800 hover:text-primary font-medium">Talent Pool</Link>
          <Link to="/training-resources" className="text-laundry-800 hover:text-primary font-medium">Resources</Link>
          <Link to="/blog" className="text-laundry-800 hover:text-primary font-medium">Blog</Link>
          <Link to="/contact" className="text-laundry-800 hover:text-primary font-medium">Contact</Link>
        </div>
        
        <div className="hidden md:flex space-x-4">
          <Link to="/talent-pool">
            <Button variant="outline">For Creatives</Button>
          </Link>
          <Link to="/services">
            <Button variant="default">For Clients</Button>
          </Link>
        </div>
        
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
            <Link to="/about" className="text-laundry-800 hover:text-primary font-medium py-2" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
            <Link to="/services" className="text-laundry-800 hover:text-primary font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Services</Link>
            <Link to="/how-it-works" className="text-laundry-800 hover:text-primary font-medium py-2" onClick={() => setMobileMenuOpen(false)}>How It Works</Link>
            <Link to="/talent-pool" className="text-laundry-800 hover:text-primary font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Talent Pool</Link>
            <Link to="/training-resources" className="text-laundry-800 hover:text-primary font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Resources</Link>
            <Link to="/blog" className="text-laundry-800 hover:text-primary font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
            <Link to="/contact" className="text-laundry-800 hover:text-primary font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            <Link to="/talent-pool" className="w-full mt-2" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full" variant="outline">For Creatives</Button>
            </Link>
            <Link to="/services" className="w-full mt-2" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full" variant="default">For Clients</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
