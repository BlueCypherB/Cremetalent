
import React from 'react';
import { HandHeart, Phone, Mail, MapPin, Clock, Linkedin, Instagram, Twitter, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-amber-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Logo and Description */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <HandHeart className="h-8 w-8" />
              <h3 className="text-xl font-bold">CrémeTalent</h3>
            </div>
            <p className="text-amber-100 mb-4">
              Empowering the creative economy by connecting exceptional talent with opportunities that make a difference.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-amber-300 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-amber-300 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-amber-300 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-amber-300 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-amber-100 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-amber-100 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/services" className="text-amber-100 hover:text-white transition-colors">Services</Link></li>
              <li><Link to="/how-it-works" className="text-amber-100 hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/talent-pool" className="text-amber-100 hover:text-white transition-colors">Talent Pool</Link></li>
              <li><Link to="/contact" className="text-amber-100 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          {/* Column 3: Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hours</h3>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <Clock className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Monday - Friday</p>
                  <p className="text-amber-100">9:00 AM - 6:00 PM</p>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <Clock className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Saturday</p>
                  <p className="text-amber-100">10:00 AM - 4:00 PM</p>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <Clock className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Sunday</p>
                  <p className="text-amber-100">Closed</p>
                </div>
              </li>
            </ul>
          </div>
          
          {/* Column 4: Contact */}
          <div id="contact">
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <p className="text-amber-100">123 Creative Avenue, Talent City, CA 90210</p>
              </li>
              <li className="flex items-start space-x-2">
                <Phone className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <p className="text-amber-100">(555) 123-4567</p>
              </li>
              <li className="flex items-start space-x-2">
                <Mail className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <p className="text-amber-100">info@cremetalent.com</p>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-amber-700 pt-6 mt-6 text-center text-amber-300 text-sm">
          <p>© {currentYear} CrémeTalent. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
