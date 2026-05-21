import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { User, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'About',        to: '/about' },
  { label: 'Services',     to: '/services' },
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'Talent Pool',  to: '/talent-pool' },
  { label: 'Projects',     to: '/projects' },
  { label: 'Jobs',         to: '/jobs' },
  { label: 'Resources',    to: '/training-resources' },
  { label: 'Blog',         to: '/blog' },
  { label: 'Contact',      to: '/contact' },
] as const;

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const location = useLocation();
  const { isTalent, isAdmin, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Auto-close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const isActive = (to: string) =>
    location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-slate-100'
          : 'bg-white border-b border-slate-100/60'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0" aria-label="CrémeTalent — home">
            <img src="/logo.png" alt="CrémeTalent" className="h-9 md:h-10 w-auto" />
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-0" aria-label="Main navigation">
            {NAV_LINKS.map(({ label, to }) => {
              const active = isActive(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`relative px-2 py-2 text-[13px] font-medium rounded-lg transition-colors duration-150 ${
                    active
                      ? 'text-amber-700'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {label}
                  {active && (
                    <span
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] w-4 rounded-full bg-amber-500"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-1.5">
            {isTalent ? (
              <Link to="/talent/profile">
                <Button variant="ghost" size="sm" className="gap-1.5 text-slate-500 hover:text-slate-800 font-medium">
                  <User className="h-3.5 w-3.5" />
                  My profile
                </Button>
              </Link>
            ) : isAdmin ? (
              <>
                <Link to="/admin/dashboard">
                  <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-800 font-medium">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-500 hover:text-slate-800 font-medium"
                  onClick={() => signOut()}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <Link to="/talent/login">
                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-800 font-medium">
                  Sign in
                </Button>
              </Link>
            )}

            <div className="w-px h-5 bg-slate-200 mx-0.5" aria-hidden="true" />

            <Link to="/join-talent-pool">
              <Button
                variant="outline"
                size="sm"
                className="border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300 shadow-none font-medium"
              >
                Join as Creative
              </Button>
            </Link>
            <Link to="/client-intake-form">
              <Button size="sm" className="shadow-none font-medium">
                Hire Talent
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer — animated via max-height */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-200 ease-in-out ${
          mobileOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white border-t border-slate-100 px-4 pt-3 pb-5 space-y-1">

          {/* Nav links */}
          {NAV_LINKS.map(({ label, to }) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'bg-amber-50 text-amber-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {label}
              </Link>
            );
          })}

          {/* Auth */}
          <div className="pt-3 border-t border-slate-100 space-y-1">
            {isTalent ? (
              <Link
                to="/talent/profile"
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              >
                <User className="h-4 w-4 flex-shrink-0" />
                My profile
              </Link>
            ) : isAdmin ? (
              <>
                <Link
                  to="/admin/dashboard"
                  className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                >
                  Admin dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                to="/talent/login"
                className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              >
                Sign in
              </Link>
            )}
          </div>

          {/* CTA buttons */}
          <div className="pt-3 grid grid-cols-2 gap-2">
            <Link to="/join-talent-pool">
              <Button
                variant="outline"
                className="w-full border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300 shadow-none font-medium"
              >
                Join as Creative
              </Button>
            </Link>
            <Link to="/client-intake-form">
              <Button className="w-full shadow-none font-medium">
                Hire Talent
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
