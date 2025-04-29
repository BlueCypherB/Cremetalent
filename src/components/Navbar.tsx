
import React from 'react';
import { Button } from "@/components/ui/button";
import { WashingMachine } from 'lucide-react';
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
          <WashingMachine className="h-8 w-8 text-laundry-600" />
          <span className="text-xl font-bold text-laundry-800">SpinCycle</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-laundry-800 hover:text-laundry-600 font-medium">Home</Link>
          <a href="#services" className="text-laundry-800 hover:text-laundry-600 font-medium">Services</a>
          <a href="#location" className="text-laundry-800 hover:text-laundry-600 font-medium">Location</a>
          <a href="#about" className="text-laundry-800 hover:text-laundry-600 font-medium">About</a>
          <a href="#contact" className="text-laundry-800 hover:text-laundry-600 font-medium">Contact</a>
        </div>
        
        <Button className="hidden md:block" variant="default">
          Call Now
        </Button>
        
        {/* Mobile menu button */}
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden text-laundry-800 hover:text-laundry-600 focus:outline-none"
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
            <Link to="/" className="text-laundry-800 hover:text-laundry-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <a href="#services" className="text-laundry-800 hover:text-laundry-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Services</a>
            <a href="#location" className="text-laundry-800 hover:text-laundry-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Location</a>
            <a href="#about" className="text-laundry-800 hover:text-laundry-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>About</a>
            <a href="#contact" className="text-laundry-800 hover:text-laundry-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Contact</a>
            <Button className="w-full mt-2" variant="default">Call Now</Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
