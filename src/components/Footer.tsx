import { Phone, Mail, MapPin, Linkedin, Instagram, X } from 'lucide-react';
import { Link } from 'react-router-dom';

// ─── Data ─────────────────────────────────────────────────────────────────────

const QUICK_LINKS = [
  { label: 'About Us',           to: '/about' },
  { label: 'Services',           to: '/services' },
  { label: 'How It Works',       to: '/how-it-works' },
  { label: 'Talent Pool',        to: '/talent-pool' },
  { label: 'Training Resources', to: '/training-resources' },
  { label: 'Blog',               to: '/blog' },
  { label: 'Contact',            to: '/contact' },
];

const SOCIALS = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com',
    icon: Linkedin,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/cremetalentafrica?igsh=MTFmejR1aXE5b2R0bQ%3D%3D&utm_source=qr',
    icon: Instagram,
  },
  {
    label: 'X (Twitter)',
    href: 'https://x.com/cremetalenta?s=21',
    icon: X,
  },
];

// ─── Footer ───────────────────────────────────────────────────────────────────

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-amber-900 text-white">
      {/* Top accent */}
      <div className="h-0.5 w-full bg-gradient-to-r from-amber-700 via-amber-400 to-amber-700" />

      <div className="container mx-auto px-4 pt-14 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* ── Brand ─────────────────────────────────────────────────────── */}
          <div>
            <Link to="/" aria-label="CrémeTalent — home">
              <img
                src="/logo.png"
                alt="CrémeTalent"
                className="h-16 w-auto brightness-0 invert mb-5"
              />
            </Link>
            <p className="text-sm text-amber-100 leading-relaxed mb-6">
              Empowering the creative economy by connecting exceptional talent with opportunities that make a difference.
            </p>
            <div className="flex items-center gap-2.5">
              {SOCIALS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-amber-800 border border-amber-700 flex items-center justify-center text-amber-200 hover:text-white hover:bg-amber-600 hover:border-amber-500 transition-all duration-200"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* ── Quick Links ───────────────────────────────────────────────── */}
          <div>
            <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {QUICK_LINKS.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-amber-100 hover:text-white transition-colors duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Hours ─────────────────────────────────────────────────────── */}
          <div>
            <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-5">
              Hours
            </h3>
            <ul className="space-y-4">
              <li>
                <p className="text-sm font-medium text-white mb-0.5">Monday – Friday</p>
                <p className="text-sm text-amber-100">9:00 AM – 5:00 PM</p>
              </li>
              <li>
                <p className="text-sm font-medium text-white mb-0.5">Saturday &amp; Sunday</p>
                <p className="text-sm text-amber-100">Closed</p>
              </li>
            </ul>
          </div>

          {/* ── Contact ───────────────────────────────────────────────────── */}
          <div id="contact">
            <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-5">
              Contact
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-100 leading-snug">
                  Federal Capital City, Abuja, Nigeria
                </p>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <a
                  href="tel:+2348127570333"
                  className="text-sm text-amber-100 hover:text-white transition-colors"
                >
                  +234 8127570333
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <a
                  href="mailto:Cremetalentafrica@gmail.com"
                  className="text-sm text-amber-100 hover:text-white transition-colors break-all"
                >
                  Cremetalentafrica@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ────────────────────────────────────────────────────── */}
        <div className="border-t border-amber-800 pt-6 text-center">
          <p className="text-xs text-amber-300">
            © {currentYear} CrémeTalent. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
