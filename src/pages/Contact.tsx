import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Reveal } from '@/components/Reveal';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';
import {
  Phone, Mail, MapPin, Clock, Linkedin, Instagram, Twitter,
  CheckCircle2, ArrowRight, Briefcase, Send, Sparkles,
  ExternalLink, MessageCircle,
} from 'lucide-react';

// ─── Static data ──────────────────────────────────────────────────────────────

const INFO_ITEMS = [
  { icon: Phone,  title: 'Phone',          content: '+234 907 793 7879',           link: 'tel:+2349077937879' },
  { icon: Mail,   title: 'Email',          content: 'Cremetalentafrica@gmail.com', link: 'mailto:Cremetalentafrica@gmail.com' },
  { icon: MapPin, title: 'Office',         content: 'Federal Capital City, Abuja, Nigeria' },
  { icon: Clock,  title: 'Business Hours', content: 'Mon–Fri · 9 AM – 5 PM WAT' },
] as const;

const SOCIAL_LINKS = [
  {
    icon: Linkedin,
    label: 'LinkedIn',
    href: 'https://www.linkedin.com',
    color: 'text-[#0A66C2]',
    hover: 'hover:bg-blue-50 hover:border-blue-100',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    href: 'https://www.instagram.com/cremetalentafrica?igsh=MTFmejR1aXE5b2R0bQ%3D%3D&utm_source=qr',
    color: 'text-[#E1306C]',
    hover: 'hover:bg-pink-50 hover:border-pink-100',
  },
  {
    icon: Twitter,
    label: 'X / Twitter',
    href: 'https://x.com/cremetalenta?s=21',
    color: 'text-slate-700',
    hover: 'hover:bg-slate-100 hover:border-slate-200',
  },
] as const;

const TOPICS = [
  'General Inquiry',
  'Partnership Opportunity',
  'Press & Media',
  'Technical Support',
  'Careers at CrémeTalent',
  'Other',
];

// ─── Form ─────────────────────────────────────────────────────────────────────

type FormState = { name: string; email: string; topic: string; message: string };
const emptyForm: FormState = { name: '', email: '', topic: '', message: '' };
const MAX_MSG = 600;

const ContactForm = () => {
  const [form, setForm]           = useState<FormState>(emptyForm);
  const [errors, setErrors]       = useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function set<K extends keyof FormState>(key: K, value: string) {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const e: Partial<FormState> = {};
    if (!form.name.trim())  e.name  = 'Name is required';
    if (!form.email.trim()) {
      e.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Enter a valid email address';
    }
    if (!form.topic)          e.topic   = 'Please select a topic';
    if (!form.message.trim()) {
      e.message = 'Message is required';
    } else if (form.message.trim().length < 10) {
      e.message = 'Message must be at least 10 characters';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('send-email', {
        body: {
          to: 'Cremetalentafrica@gmail.com',
          subject: `[Contact] ${form.topic} — ${form.name}`,
          html: `
            <p><strong>From:</strong> ${form.name} (${form.email})</p>
            <p><strong>Topic:</strong> ${form.topic}</p>
            <hr/>
            <p>${form.message.replace(/\n/g, '<br/>')}</p>
          `,
        },
      });
      if (error) throw new Error(error.message ?? 'Failed to send message');
      setSubmitted(true);
      setForm(emptyForm);
    } catch (err) {
      toast({
        title: 'Could not send message',
        description: err instanceof Error ? err.message : 'Something went wrong. Please try emailing us directly.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center">
        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-5 ring-4 ring-amber-100">
          <CheckCircle2 className="h-8 w-8 text-amber-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Message sent!</h3>
        <p className="text-sm text-slate-500 max-w-xs mb-7 leading-relaxed">
          Thanks for reaching out. We'll get back to you within 1–2 business days.
        </p>
        <Button variant="outline" size="sm" onClick={() => setSubmitted(false)} className="gap-1.5">
          <Send className="h-3.5 w-3.5" />
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">

      {/* Topic chip picker */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Topic <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {TOPICS.map(t => (
            <button
              key={t}
              type="button"
              onClick={() => set('topic', t)}
              className={`px-3 py-2.5 rounded-xl text-xs font-medium border text-left transition-all duration-150 ${
                form.topic === t
                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-amber-300 hover:text-amber-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        {errors.topic && <p className="text-xs text-destructive mt-1">{errors.topic}</p>}
      </div>

      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <Label htmlFor="contact-name">
            Full name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="contact-name"
            placeholder="Your name"
            autoComplete="name"
            value={form.name}
            onChange={e => set('name', e.target.value)}
            className={errors.name ? 'border-destructive focus-visible:ring-destructive/30' : ''}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="contact-email">
            Email address <span className="text-destructive">*</span>
          </Label>
          <Input
            id="contact-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={form.email}
            onChange={e => set('email', e.target.value)}
            className={errors.email ? 'border-destructive focus-visible:ring-destructive/30' : ''}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="contact-message">
            Message <span className="text-destructive">*</span>
          </Label>
          <span className={`text-xs tabular-nums ${form.message.length > MAX_MSG * 0.9 ? 'text-amber-600' : 'text-slate-400'}`}>
            {form.message.length}/{MAX_MSG}
          </span>
        </div>
        <Textarea
          id="contact-message"
          placeholder="How can we help you?"
          rows={5}
          maxLength={MAX_MSG}
          value={form.message}
          onChange={e => set('message', e.target.value)}
          className={`resize-none ${errors.message ? 'border-destructive focus-visible:ring-destructive/30' : ''}`}
        />
        {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
      </div>

      <Button type="submit" disabled={submitting} className="w-full h-11 gap-2">
        {submitting ? (
          <>
            <svg className="animate-spin h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send message
          </>
        )}
      </Button>
    </form>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative bg-white overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-amber-100 blur-3xl opacity-50" aria-hidden="true" />
        <div className="pointer-events-none absolute top-8 -right-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl opacity-60" aria-hidden="true" />

        <div className="relative container mx-auto px-4 py-20 md:py-28 text-center">
          <Reveal>
            <span className="eyebrow mb-5 mx-auto">
              <MessageCircle className="h-3.5 w-3.5" />
              Get in Touch
            </span>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold mb-6 leading-[1.1] text-slate-900">
              We're here to <em className="not-italic text-primary">help.</em>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Whether you're a creative professional, a growing brand, or just curious — our team typically responds within 1–2 business days.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                <a href="#contact-form">
                  Send a message
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-foreground/20 hover:bg-foreground/5">
                <a href="#contact-info">
                  View contact details
                </a>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Main content ──────────────────────────────────────────────────────── */}
      <section id="contact-form" className="py-16 md:py-24 bg-slate-50 flex-grow">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 items-start">

            {/* Left — details */}
            <div id="contact-info" className="space-y-4">
              <Reveal>
                <div className="mb-2">
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">Contact details</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Reach us through any channel below during business hours.
                  </p>
                </div>
              </Reveal>

              {INFO_ITEMS.map((item, i) => (
                <Reveal key={item.title} delay={i * 60}>
                  <div className="service-card p-4 flex items-start gap-4">
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-amber-100">
                      <item.icon className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{item.title}</p>
                      {'link' in item && item.link ? (
                        <a href={item.link} className="text-sm text-slate-800 hover:text-amber-700 font-medium transition-colors">
                          {item.content}
                        </a>
                      ) : (
                        <p className="text-sm text-slate-700 font-medium">{item.content}</p>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}

              {/* Social */}
              <Reveal delay={260}>
                <div className="service-card p-5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Follow us</p>
                  <div className="space-y-1">
                    {SOCIAL_LINKS.map(({ icon: Icon, label, href, color, hover }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-3 p-2.5 rounded-xl border border-transparent ${hover} transition-all duration-150 group`}
                      >
                        <Icon className={`h-4 w-4 ${color} flex-shrink-0`} />
                        <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors flex-1">{label}</span>
                        <ExternalLink className="h-3 w-3 text-slate-300 group-hover:text-slate-400 transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Hire talent CTA */}
              <Reveal delay={320}>
                <div className="bg-slate-900 rounded-2xl p-6 text-white">
                  <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Briefcase className="h-5 w-5 text-amber-400" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 leading-tight">
                    Looking to hire creative talent?
                  </h3>
                  <p className="text-sm text-slate-300 mb-5 leading-relaxed">
                    Submit a project brief and our team will match you with the right creative professionals.
                  </p>
                  <Button
                    asChild
                    size="sm"
                    className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold gap-1.5 w-full shadow-none"
                  >
                    <Link to="/client-intake-form">
                      Start a project
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </Reveal>
            </div>

            {/* Right — form */}
            <Reveal delay={100}>
              <div className="service-card p-8 md:p-10">
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide">Send us a message</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">How can we help?</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    For general questions, press enquiries, partnership conversations, and more. We respond within 1–2 business days.
                  </p>
                </div>
                <ContactForm />
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ── Location ─────────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4">
          <Reveal className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

              <div>
                <span className="eyebrow mb-4">Our Location</span>
                <h2 className="text-3xl font-bold text-slate-900 mb-3 leading-tight">
                  Based in the heart of Abuja.
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  CrémeTalent is headquartered in Nigeria's Federal Capital City — at the centre of Africa's growing creative industry.
                </p>
                <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <MapPin className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">
                    Federal Capital City<br />
                    Abuja, Nigeria
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="pointer-events-none absolute -bottom-10 -right-10 h-44 w-44 rounded-full bg-amber-500/10 blur-2xl" aria-hidden="true" />
                <div className="relative">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-5">
                    <MapPin className="h-6 w-6 text-amber-400" />
                  </div>
                  <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-2">Headquarters</p>
                  <p className="text-2xl font-bold mb-1">Abuja, Nigeria</p>
                  <p className="text-slate-400 text-sm mb-6">Federal Capital City · West Africa</p>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                    Open · Mon–Fri, 9 AM – 5 PM WAT
                  </div>
                </div>
              </div>

            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
