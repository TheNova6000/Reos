import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { AnimateOnScroll } from "@/components/effects/animate-on-scroll";
import { GLSLHillsBackground } from "@/components/effects/glsl-hills-dynamic";
import {
  Building2, Users, FileText, BarChart3, ShieldCheck, Globe,
  ArrowRight, MessageSquare, CreditCard, Search,
  Zap, X,
} from "lucide-react";

export const metadata: Metadata = {
  title: "REOS — The Operating System for Indian Real Estate",
  description:
    "Dashboard + branded website, bundled. Manage properties, leads, bookings, documents, analytics, and RERA compliance. Built by TechClick.",
};

const features = [
  { icon: Building2, title: "Property & Inventory", description: "Structured records. Interactive layout maps. Real-time status. No more Excel." },
  { icon: Users, title: "Full-Lifecycle CRM", description: "Lead capture through possession. The actual Indian real estate workflow." },
  { icon: CreditCard, title: "Bookings & Payments", description: "TDS auto-calculation. Payment tracking. Status automation." },
  { icon: FileText, title: "Document Management", description: "Central repo. Sale deeds, DTCP, RERA, KYC. Searchable." },
  { icon: ShieldCheck, title: "RERA Compliance", description: "Built into the data. Registrations, warnings, checklists." },
  { icon: BarChart3, title: "Analytics", description: "Conversion funnels. Source breakdown. Revenue by project." },
  { icon: Globe, title: "Your Branded Website", description: "companyname.reos.in. Powered by your dashboard data." },
  { icon: MessageSquare, title: "WhatsApp Integration", description: "Business API. Linked to leads. Template messages.", coming: true },
];

const killedTools = [
  { name: "WhatsApp for business data", reason: "Data locked in personal phones" },
  { name: "Excel for inventory", reason: "Double-bookings, stale data, no sync" },
  { name: "Sell.Do", reason: "Stops at booking, no post-sale lifecycle" },
  { name: "Your web developer", reason: "Website updates itself from your dashboard" },
];

export default function ReosHomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative py-28 md:py-44 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <GLSLHillsBackground speed={0.3} cameraZ={140} />
        </div>
        <div className="container mx-auto px-4 text-center flex flex-col items-center">
          <AnimateOnScroll animation="fade-up" stagger={0.1}>
            <div className="inline-block border-2 border-primary bg-primary/10 px-4 py-1.5 mb-8 brutal-shadow-red">
              <span className="text-xs font-black uppercase tracking-widest text-primary">Real Estate Operating System</span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter max-w-5xl leading-[0.9] uppercase">
              One dashboard.
              <br />
              <span className="text-primary">Your website.</span>
              <br />
              Everything managed.
            </h1>
            <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl font-medium text-center">
              REOS gives real estate companies a management dashboard and a branded
              website — bundled. Add a property in the dashboard, it appears on your site.
              No developers needed.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                nativeButton={false}
                render={<Link href="/pricing" />}
                className="font-black uppercase tracking-wide text-base brutal-shadow-red"
              >
                View Plans <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" nativeButton={false} render={<Link href="/features" />} className="font-bold uppercase tracking-wide border-2">
                <Search className="w-4 h-4 mr-2" /> Explore Features
              </Button>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="py-20 md:py-28 border-t-3 border-foreground/10">
        <div className="container mx-auto px-4">
          <AnimateOnScroll animation="fade-up">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">Two things. One subscription.</h2>
            <p className="text-muted-foreground text-lg mb-14 max-w-xl font-medium">
              Every company that subscribes gets both. No separate purchases.
            </p>
          </AnimateOnScroll>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            <AnimateOnScroll animation="fade-right">
              <div className="brutal-card p-6 bg-card h-full">
                <div className="w-12 h-12 bg-primary flex items-center justify-center mb-4 brutal-shadow">
                  <BarChart3 className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-black uppercase mb-1">The Dashboard</h3>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Product</span>
                <p className="text-muted-foreground text-sm leading-relaxed mt-3 mb-4">
                  Manage properties, leads, bookings, payments, documents, analytics, RERA compliance,
                  and team settings. Everything a real estate company runs on.
                </p>
                <div className="text-xs font-bold text-muted-foreground/60 uppercase tracking-wide border-t-2 border-foreground/10 pt-3">
                  app.reos.in — login required
                </div>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll animation="fade-left">
              <div className="brutal-card p-6 bg-card h-full">
                <div className="w-12 h-12 bg-primary flex items-center justify-center mb-4 brutal-shadow">
                  <Globe className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-black uppercase mb-1">Your Website</h3>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Service</span>
                <p className="text-muted-foreground text-sm leading-relaxed mt-3 mb-4">
                  A branded property website for your company. Projects, listings, contact forms,
                  layout maps — all powered by your dashboard data. We build and host it.
                </p>
                <div className="text-xs font-bold text-muted-foreground/60 uppercase tracking-wide border-t-2 border-foreground/10 pt-3">
                  companyname.reos.in — public
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-20 md:py-28 border-t-3 border-foreground/10">
        <div className="container mx-auto px-4">
          <AnimateOnScroll animation="fade-up">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">Everything you need</h2>
            <p className="text-muted-foreground text-lg mb-14 max-w-xl font-medium">
              Replace WhatsApp, Excel, Sell.Do, and your web developer — with one system.
            </p>
          </AnimateOnScroll>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl">
            {features.map((feature, i) => (
              <AnimateOnScroll key={feature.title} animation="fade-up" delay={i * 0.05}>
                <div className="brutal-border bg-card p-4 h-full hover:bg-primary/5 transition-colors">
                  <div className="w-10 h-10 bg-primary/10 border-2 border-primary/30 flex items-center justify-center mb-3">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-black text-sm uppercase tracking-wide mb-1">
                    {feature.title}
                    {feature.coming && (
                      <span className="ml-1.5 text-[9px] font-black text-primary bg-primary/10 border border-primary/30 px-1.5 py-0.5 uppercase tracking-widest">
                        Soon
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE REPLACE */}
      <section className="py-20 md:py-28 border-t-3 border-foreground/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <AnimateOnScroll animation="fade-up">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">What REOS replaces</h2>
              <p className="text-muted-foreground text-lg mb-14 max-w-xl font-medium">
                Indian real estate runs on WhatsApp, Excel, and gut feeling. Not anymore.
              </p>
            </AnimateOnScroll>

            <div className="grid sm:grid-cols-2 gap-4">
              {killedTools.map((item, i) => (
                <AnimateOnScroll key={item.name} animation="fade-up" delay={i * 0.08}>
                  <div className="brutal-border bg-card p-5 flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary/10 border-2 border-primary/30 flex items-center justify-center shrink-0">
                      <X className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-black text-sm uppercase tracking-wide mb-1">{item.name}</div>
                      <p className="text-xs text-muted-foreground">{item.reason}</p>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 md:py-28 border-t-3 border-foreground/10">
        <div className="container mx-auto px-4">
          <AnimateOnScroll animation="fade-up">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-14">How it works</h2>
          </AnimateOnScroll>

          <div className="max-w-3xl space-y-6">
            {[
              { n: "01", title: "Subscribe", desc: "Sign up for REOS. You get a dashboard and a branded website." },
              { n: "02", title: "Add your data", desc: "Projects, properties, team members. Import from Excel or add manually." },
              { n: "03", title: "Website goes live", desc: "companyname.reos.in — showing your projects, properties, and contact info." },
              { n: "04", title: "Manage everything", desc: "Leads flow in from your website. Track them through booking, payment, and possession." },
            ].map((step, i) => (
              <AnimateOnScroll key={step.n} animation="fade-left" delay={i * 0.1}>
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-primary flex items-center justify-center shrink-0 brutal-shadow font-black text-primary-foreground text-lg">
                    {step.n}
                  </div>
                  <div className="pt-2">
                    <h3 className="font-black uppercase tracking-wide mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* BUILT BY */}
      <section className="py-20 md:py-28 border-t-3 border-foreground/10">
        <div className="container mx-auto px-4">
          <AnimateOnScroll animation="fade-up">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-6">Built by TechClick</h2>
              <p className="text-muted-foreground text-lg mb-8 font-medium">
                We&apos;re a group of B.Tech students from Aurora University, Hyderabad.
                We researched the Indian real estate market — 7 academic sources, 3 existing tools analyzed,
                7 comparison criteria — before writing a single line of code.
              </p>
              <div className="flex gap-4 flex-wrap">
                {["Sri Krishna Batkeeri", "Sanjana", "Sahithi"].map((name) => (
                  <div key={name} className="brutal-border bg-card px-4 py-2">
                    <span className="font-bold text-sm">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 border-t-3 border-foreground/10">
        <div className="container mx-auto px-4">
          <AnimateOnScroll animation="scale-up">
            <div className="max-w-2xl mx-auto text-center border-3 border-primary bg-primary/5 p-10 md:p-14 brutal-shadow-red">
              <Zap className="w-10 h-10 text-primary mx-auto mb-4" />
              <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-4">Ready to modernize?</h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Stop running your business on WhatsApp and Excel.
                Get a dashboard and a website — both, from day one.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button size="lg" nativeButton={false} render={<Link href="/signup" />} className="font-black uppercase tracking-wide brutal-shadow-red">
                  Get Started
                </Button>
                <Button size="lg" variant="outline" nativeButton={false} render={<Link href="/features" />} className="font-bold uppercase tracking-wide border-2">
                  All Features
                </Button>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}
