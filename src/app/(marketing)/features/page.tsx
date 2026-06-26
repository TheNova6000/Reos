import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { AnimateOnScroll } from "@/components/effects/animate-on-scroll";
import {
  Building2, Users, FileText, BarChart3, ShieldCheck, Globe,
  ArrowRight, Map, CreditCard, MessageSquare, Smartphone,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Features — REOS",
  description:
    "Property inventory, full-lifecycle CRM, bookings, payments, documents, RERA compliance, analytics, and a branded website — all in one platform.",
};

const modules = [
  {
    icon: Building2, title: "Property Digitization", subtitle: "Module 1",
    description: "Every property gets a structured digital record. Plot number, area, facing, price, status, images, documents, layout position — all searchable, all linked.",
    highlights: ["Structured records replace WhatsApp screenshots", "Project and property hierarchy", "Image galleries and document links", "Bulk import from Excel/CSV"],
  },
  {
    icon: Map, title: "Inventory Management", subtitle: "Module 2",
    description: "Interactive layout maps show every plot with color-coded status. When one agent reserves a plot, everyone sees it instantly.",
    highlights: ["Interactive SVG layout maps", "Real-time status: available, reserved, sold, blocked", "Inline status changes from inventory table", "Filter by project, status, facing, price"],
  },
  {
    icon: Users, title: "Full-Lifecycle CRM", subtitle: "Module 3",
    description: "Not a generic sales funnel — the actual Indian real estate workflow. Lead to contact to site visit to negotiation to booking to payment to registration to possession.",
    highlights: ["Kanban pipeline with 6 stages", "Activity timeline (calls, WhatsApp, site visits, notes)", "Agent assignment and follow-up tracking", "Lead-to-booking conversion in one click"],
  },
  {
    icon: CreditCard, title: "Bookings & Payments", subtitle: "Module 3b",
    description: "The part Sell.Do doesn't cover. Token payment, installment tracking, TDS auto-calculation, and automatic property status changes.",
    highlights: ["Booking creates from lead detail page", "Payment recording with mode and receipt", "TDS auto-calculation (Section 194-IA, amounts >= 50L)", "Status flow: pending to confirmed to registered"],
  },
  {
    icon: FileText, title: "Document Management", subtitle: "Module 4",
    description: "No more 15-minute WhatsApp hunts. Every document is categorized, linked to a property or project, and searchable.",
    highlights: ["Types: sale deed, DTCP, RERA, layout, KYC, brochure", "Linked to properties, projects, and leads", "Search by name, filter by type", "Upload form with metadata"],
  },
  {
    icon: ShieldCheck, title: "RERA Compliance", subtitle: "Module 5",
    description: "Built into the data, not bolted on. Track registrations, spot missing RERA numbers, and maintain compliance checklists.",
    highlights: ["RERA project registry with registration numbers", "Missing-registration warnings", "State coverage tracking", "6-item compliance checklist"],
  },
  {
    icon: BarChart3, title: "Analytics", subtitle: "Module 9",
    description: "Real insights computed from your actual data. Not placeholder charts — numbers that change when you add a lead or close a deal.",
    highlights: ["Conversion rate, avg deal size, top source", "Pipeline funnel across all 6 stages", "Revenue and inventory breakdown by project", "Facing demand and budget distribution"],
  },
  {
    icon: Globe, title: "Your Branded Website", subtitle: "Module 8",
    description: "Every subscriber gets companyname.reos.in — a fully functional property website. Add a project in the dashboard, it shows up on your site.",
    highlights: ["Home, projects, properties, contact pages", "Your company name, logo, and colors", "Property search with filters", "Lead capture forms into your CRM"],
  },
  {
    icon: Smartphone, title: "Field Agent Showcase", subtitle: "Module 6",
    description: "Agents at site visits can show properties on a tablet. Layout maps, availability, pricing, images — all on one screen.",
    highlights: ["Mobile-first design", "Works offline with cached data", "Quick share via WhatsApp or PDF", "Comparison mode for multiple plots"],
    coming: true,
  },
  {
    icon: MessageSquare, title: "WhatsApp Integration", subtitle: "Module 7",
    description: "Official Business API. Every conversation linked to a lead. Template messages for follow-ups. Chat history becomes searchable business data.",
    highlights: ["WhatsApp Business API (official, not scraping)", "Conversations linked to lead records", "Template messages for common actions", "Searchable chat history"],
    coming: true,
  },
];

export default function FeaturesPage() {
  return (
    <>
      {/* HEADER */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <AnimateOnScroll animation="fade-up">
            <div className="max-w-3xl">
              <div className="inline-block border-2 border-primary bg-primary/10 px-4 py-1.5 mb-8 brutal-shadow-red">
                <span className="text-xs font-black uppercase tracking-widest text-primary">Features</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9]">
                Everything a real estate company needs
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-2xl font-medium">
                10 modules. Every feature traces back to a real problem documented
                in Indian real estate companies. Nothing built &ldquo;because it seemed useful.&rdquo;
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* MODULES */}
      <section className="pb-20 md:pb-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl space-y-6">
            {modules.map((mod, i) => (
              <AnimateOnScroll key={mod.title} animation="fade-up" delay={i * 0.03}>
                <div className="brutal-border bg-card p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-11 h-11 bg-primary flex items-center justify-center shrink-0 brutal-shadow">
                      <mod.icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h2 className="text-lg font-black uppercase tracking-wide">{mod.title}</h2>
                        {mod.coming && (
                          <span className="text-[9px] font-black text-primary bg-primary/10 border-2 border-primary/30 px-2 py-0.5 uppercase tracking-widest">
                            Soon
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest">{mod.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{mod.description}</p>
                  <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
                    {mod.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 border-t-3 border-foreground/10">
        <div className="container mx-auto px-4 text-center">
          <AnimateOnScroll animation="scale-up">
            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-4">Seen enough?</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Dashboard and branded website included in every plan.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" nativeButton={false} render={<Link href="/pricing" />} className="font-black uppercase tracking-wide brutal-shadow-red">
                View Plans <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" nativeButton={false} render={<Link href="/contact" />} className="font-bold uppercase tracking-wide border-2">
                Talk to Us
              </Button>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}
