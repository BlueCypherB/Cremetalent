import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Mail, Phone, MapPin, Globe, Building2, Calendar, Target,
  Users, Palette, DollarSign, BarChart2, MessageSquare, FileText,
} from 'lucide-react';
import type { ClientIntakeSubmission } from '@/lib/database.types';

interface Props {
  inquiry: ClientIntakeSubmission | null;
  onClose: () => void;
}

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-widest mb-1.5">{children}</p>
);

const Field = ({ label, value }: { label: string; value: string | null | undefined }) =>
  value ? (
    <div>
      <SectionLabel>{label}</SectionLabel>
      <p className="text-sm text-slate-700 whitespace-pre-wrap">{value}</p>
    </div>
  ) : null;

const Tags = ({ label, values }: { label: string; values: string[] | null | undefined }) => {
  if (!values?.length) return null;
  return (
    <div>
      <SectionLabel>{label}</SectionLabel>
      <div className="flex flex-wrap gap-1.5 mt-0.5">
        {values.map((v) => (
          <span key={v} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full text-[11px] font-medium border border-slate-200">
            {v}
          </span>
        ))}
      </div>
    </div>
  );
};

const Divider = () => <hr className="border-slate-100" />;

const SectionHeading = ({ icon: Icon, label }: { icon: React.ElementType; label: string }) => (
  <p className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
    <Icon className="h-3.5 w-3.5 text-slate-400" /> {label}
  </p>
);

const InquiryDetailSheet = ({ inquiry, onClose }: Props) => {
  const inq = inquiry;

  const allServices = [
    { label: 'Digital Services', values: inq?.digital_services },
    { label: 'Visual Services', values: inq?.visual_services },
    { label: 'Video Services', values: inq?.video_services },
    { label: 'Content Services', values: inq?.content_services },
    { label: 'Media Services', values: inq?.media_services },
    { label: 'Tech Services', values: inq?.tech_services },
  ].filter(({ values }) => values?.length);

  return (
    <Sheet open={!!inq} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        {inq && (
          <>
            <SheetHeader className="mb-6">
              <SheetTitle className="text-base font-semibold text-slate-900">{inq.project_title}</SheetTitle>
              <SheetDescription className="text-xs text-slate-500">
                Full brief · submitted {new Date(inq.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-5">
              {/* Contact */}
              <div className="space-y-3">
                <SectionHeading icon={Building2} label="Contact" />
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <span className="font-medium text-slate-800">{inq.full_name}{inq.company_name && ` · ${inq.company_name}`}</span>
                  <a href={`mailto:${inq.email}`} className="flex items-center gap-2 text-amber-600 hover:text-amber-700">
                    <Mail className="h-3.5 w-3.5 flex-shrink-0" /> {inq.email}
                  </a>
                  {inq.phone && (
                    <a href={`tel:${inq.phone}`} className="flex items-center gap-2 text-slate-600 hover:text-slate-800">
                      <Phone className="h-3.5 w-3.5 flex-shrink-0" /> {inq.phone}
                    </a>
                  )}
                  <span className="flex items-center gap-2 text-slate-600">
                    <MapPin className="h-3.5 w-3.5 flex-shrink-0" /> {inq.location}
                  </span>
                  {inq.industry && (
                    <span className="flex items-center gap-2 text-slate-600">
                      <Building2 className="h-3.5 w-3.5 flex-shrink-0" /> {inq.industry}
                    </span>
                  )}
                  {inq.website && (
                    <a href={inq.website.startsWith('http') ? inq.website : `https://${inq.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-amber-600 hover:text-amber-700">
                      <Globe className="h-3.5 w-3.5 flex-shrink-0" /> {inq.website}
                    </a>
                  )}
                  {inq.social_media && (
                    <Field label="Social media handles" value={inq.social_media} />
                  )}
                </div>
              </div>

              <Divider />

              {/* Project */}
              <div className="space-y-3">
                <SectionHeading icon={FileText} label="Project Details" />
                <div className="grid grid-cols-2 gap-3">
                  {inq.project_type && (
                    <div className="bg-slate-50 rounded-lg px-3 py-2 col-span-1">
                      <SectionLabel>Project type</SectionLabel>
                      <p className="text-xs text-slate-700 font-medium capitalize">{inq.project_type}{inq.project_type_other ? ` — ${inq.project_type_other}` : ''}</p>
                    </div>
                  )}
                  <div className="bg-slate-50 rounded-lg px-3 py-2 col-span-1">
                    <SectionLabel>Timeline</SectionLabel>
                    <p className="text-xs text-slate-700 font-medium">
                      {inq.start_date}
                      {inq.end_date ? ` → ${inq.end_date}` : ''}
                    </p>
                  </div>
                </div>
                {inq.objectives?.length > 0 && (
                  <Tags label="Objectives" values={inq.objectives.map(o => o === 'other' && inq.objective_other ? inq.objective_other : o)} />
                )}
                <Field label="Description" value={inq.description} />
                <Field label="Important dates / milestones" value={inq.important_dates} />
              </div>

              {/* Talent needs */}
              {allServices.length > 0 && (
                <>
                  <Divider />
                  <div className="space-y-3">
                    <SectionHeading icon={Users} label="Talent Needs" />
                    {allServices.map(({ label, values }) => (
                      <Tags key={label} label={label} values={values} />
                    ))}
                  </div>
                </>
              )}

              <Divider />

              {/* Brand & Style */}
              <div className="space-y-3">
                <SectionHeading icon={Palette} label="Brand & Style" />
                <div className="bg-slate-50 rounded-lg px-3 py-2">
                  <SectionLabel>Has brand guidelines?</SectionLabel>
                  <p className="text-xs text-slate-700 font-medium capitalize">{inq.has_brand_guidelines}</p>
                </div>
                <Field label="Brand tone & voice" value={inq.brand_tone} />
                <Field label="Colours & fonts" value={inq.color_fonts} />
                <Field label="Inspirational brands" value={inq.inspirational_brands} />
              </div>

              <Divider />

              {/* Audience */}
              <div className="space-y-3">
                <SectionHeading icon={Target} label="Audience" />
                <Field label="Target audience" value={inq.target_audience} />
                <Tags label="Audience locations" values={inq.audience_location} />
                <Tags
                  label="Content platforms"
                  values={inq.content_platforms?.map(p => p === 'other' && inq.content_platforms_other ? inq.content_platforms_other : p)}
                />
              </div>

              <Divider />

              {/* Budget */}
              <div className="space-y-3">
                <SectionHeading icon={DollarSign} label="Budget & Terms" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-lg px-3 py-2">
                    <SectionLabel>Budget range</SectionLabel>
                    <p className="text-xs text-slate-700 font-medium">
                      {inq.budget_range === 'custom' && inq.custom_budget ? inq.custom_budget : inq.budget_range}
                    </p>
                  </div>
                  {inq.payment_structure && (
                    <div className="bg-slate-50 rounded-lg px-3 py-2">
                      <SectionLabel>Payment structure</SectionLabel>
                      <p className="text-xs text-slate-700 font-medium capitalize">
                        {inq.payment_structure}{inq.payment_structure_other ? ` — ${inq.payment_structure_other}` : ''}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <Divider />

              {/* Deliverables */}
              <div className="space-y-3">
                <SectionHeading icon={BarChart2} label="Deliverables & KPIs" />
                <Field label="Deliverables" value={inq.deliverables} />
                <Tags
                  label="KPIs"
                  values={inq.kpis?.map(k => k === 'other' && inq.kpi_other ? inq.kpi_other : k)}
                />
              </div>

              <Divider />

              {/* Communication */}
              <div className="space-y-3 pb-6">
                <SectionHeading icon={MessageSquare} label="Communication" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-lg px-3 py-2">
                    <SectionLabel>Primary contact</SectionLabel>
                    <p className="text-xs text-slate-700 font-medium">{inq.primary_contact_name}</p>
                    <p className="text-xs text-slate-500">{inq.primary_contact_info}</p>
                  </div>
                  {inq.approval_timeline && (
                    <div className="bg-slate-50 rounded-lg px-3 py-2">
                      <SectionLabel>Approval timeline</SectionLabel>
                      <p className="text-xs text-slate-700 font-medium capitalize">{inq.approval_timeline}</p>
                    </div>
                  )}
                </div>
                <Tags label="Preferred communication" values={inq.communication_mode} />
                <Field label="Additional notes" value={inq.additional_notes} />
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default InquiryDetailSheet;
