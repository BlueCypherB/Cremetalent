
import React from 'react';
import { WashingMachine, Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-laundry-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Logo and Description */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <WashingMachine className="h-8 w-8" />
              <h3 className="text-xl font-bold">SpinCycle</h3>
            </div>
            <p className="text-laundry-100 mb-4">
              Your friendly neighborhood laundromat offering self-service machines and full-service laundry options.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-laundry-300 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-laundry-300 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-laundry-300 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-laundry-100 hover:text-white transition-colors">Home</Link></li>
              <li><a href="#services" className="text-laundry-100 hover:text-white transition-colors">Services</a></li>
              <li><a href="#location" className="text-laundry-100 hover:text-white transition-colors">Location</a></li>
              <li><a href="#about" className="text-laundry-100 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#pricing" className="text-laundry-100 hover:text-white transition-colors">Pricing</a></li>
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
                  <p className="text-laundry-100">6:00 AM - 10:00 PM</p>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <Clock className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Saturday</p>
                  <p className="text-laundry-100">7:00 AM - 9:00 PM</p>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <Clock className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Sunday</p>
                  <p className="text-laundry-100">8:00 AM - 8:00 PM</p>
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
                <p className="text-laundry-100">123 Wash Street, Cleanville, CA 90210</p>
              </li>
              <li className="flex items-start space-x-2">
                <Phone className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <p className="text-laundry-100">(555) 123-4567</p>
              </li>
              <li className="flex items-start space-x-2">
                <Mail className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <p className="text-laundry-100">info@spincycle.com</p>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-laundry-700 pt-6 mt-6 text-center text-laundry-300 text-sm">
          <p>© {currentYear} SpinCycle Laundromat. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
