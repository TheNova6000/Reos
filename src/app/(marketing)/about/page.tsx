import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { AnimateOnScroll } from "@/components/effects/animate-on-scroll";
import { ArrowRight, Target, Eye, Lightbulb, Shield, Building2 } from "lucide-react";

export const metadata: Metadata = {
  title: "About — REOS",
  description:
    "TechClick builds REOS — a research-backed operating system for Indian real estate companies. B.Tech students from Aurora University, Hyderabad.",
};

const values = [
  {
    icon: Target,
    title: "Research before implementation",
    description: "Every feature traces to a documented problem. 7 academic sources, 3 real tools analyzed, 7 comparison criteria — before any code.",
  },
  {
    icon: Eye,
    title: "Structured data before AI",
    description: "AI is the reward for getting the data layer right, not the starting point. We build the foundation that makes intelligence possible.",
  },
  {
    icon: Lightbulb,
    title: "Honest assessment over optimistic claims",
    description: "If something is missing, we say so. Our planning documents track what actually happened, not what we wished happened.",
  },
  {
    icon: Shield,
    title: "Tenant isolation is non-negotiable",
    description: "Every company's data is completely invisible to every other company. Shared infrastructure, isolated data. No exceptions.",
  },
];

const team = [
  { name: "Sri Krishna Batkeeri", role: "Full-Stack Development & Architecture" },
  { name: "Sanjana", role: "Frontend & UX Research" },
  { name: "Sahithi", role: "Backend & Data Modeling" },
];

export default function AboutPage() {
  return (
    <>
      {/* HEADER */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <AnimateOnScroll animation="fade-up">
            <div className="max-w-3xl">
              <div className="inline-block border-2 border-primary bg-primary/10 px-4 py-1.5 mb-8 brutal-shadow-red">
                <span className="text-xs font-black uppercase tracking-widest text-primary">About Us</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9]">
                Built by <span className="text-primary">TechClick</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-2xl font-medium">
                A research-backed operating system for Indian real estate companies.
                Not a generic CRM adapted for property sales. A system built from the ground up
                for how Indian real estate actually works.
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-20 md:py-28 border-t-3 border-foreground/10">
        <div className="container mx-auto px-4">
          <AnimateOnScroll animation="fade-up">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">The Team</h2>
            <p className="text-muted-foreground text-lg mb-10 font-medium">
              B.Tech students from Aurora University, Hyderabad.
            </p>
          </AnimateOnScroll>
          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl">
            {team.map((member, i) => (
              <AnimateOnScroll key={member.name} animation="fade-up" delay={i * 0.1}>
                <div className="brutal-card p-5 bg-card">
                  <div className="w-12 h-12 bg-primary flex items-center justify-center mb-4 brutal-shadow font-black text-primary-foreground text-lg">
                    {member.name.charAt(0)}
                  </div>
                  <h3 className="font-black text-sm uppercase tracking-wide">{member.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{member.role}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* WHY WE BUILT THIS */}
      <section className="py-20 md:py-28 border-t-3 border-foreground/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <AnimateOnScroll animation="fade-up">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-8">Why we built this</h2>
            </AnimateOnScroll>
            <AnimateOnScroll animation="fade-up" delay={0.1}>
              <div className="space-y-5 text-muted-foreground leading-relaxed">
                <p>
                  Indian real estate is a &#8377;50 lakh crore market. Yet 72% of firms haven&apos;t adopted multiple
                  technology products. The industry runs on WhatsApp groups, Excel sheets, and phone calls.
                </p>
                <p>
                  Property data lives on personal devices. Leads get forgotten because follow-ups depend on
                  human memory. Inventory is tracked in spreadsheets where double-bookings are a real risk.
                  RERA compliance — legally mandatory across 32 states — is handled ad-hoc.
                </p>
                <p>
                  Existing tools solve pieces. Sell.Do handles pre-booking CRM but stops at booking.
                  Listing portals generate leads but share them with 5-10 agents. No tool covers the full lifecycle,
                  and none of them give you a website.
                </p>
                <p className="text-foreground font-bold text-lg bg-primary/8 px-4 py-3">
                  REOS solves this by being two things at once: a dashboard companies manage their business with,
                  and a branded website their customers see. One system, from lead capture through possession.
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-20 md:py-28 border-t-3 border-foreground/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <AnimateOnScroll animation="fade-up">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-10">What we believe</h2>
            </AnimateOnScroll>
            <div className="space-y-6">
              {values.map((value, i) => (
                <AnimateOnScroll key={value.title} animation="fade-left" delay={i * 0.1}>
                  <div className="flex items-start gap-5 brutal-border bg-card p-5">
                    <div className="w-10 h-10 bg-primary/10 border-2 border-primary/30 flex items-center justify-center shrink-0">
                      <value.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-black text-sm uppercase tracking-wide mb-1">{value.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* JOURNEY */}
      <section className="py-20 md:py-28 border-t-3 border-foreground/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <AnimateOnScroll animation="fade-up">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-10">Where we are</h2>
            </AnimateOnScroll>
            <div className="space-y-4">
              {[
                { n: "01", label: "Research Phase", detail: "6 phases completed — literature survey, existing system analysis, comparison, proposed system, technology stack, project plan." },
                { n: "02", label: "Core Implementation", detail: "7 steps — agent CRUD, analytics, compliance, documents, settings, booking/payments, Supabase sync. 17 routes, 0 build errors." },
                { n: "03", label: "Multi-Tenant Architecture", detail: "Pivoted to SaaS — shared database with tenant isolation, hostname routing, per-company branded websites." },
                { n: "04", label: "First Live Deployment", detail: "Vision Infra Tech goes live — real inventory, real leads, real CRM. Our first company running on REOS in production." },
                { n: "05", label: "What's Next", detail: "WhatsApp integration, offline support, payment gateway, AI lead scoring, and onboarding more clients." },
              ].map((m, i) => (
                <AnimateOnScroll key={m.n} animation="fade-up" delay={i * 0.1}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary flex items-center justify-center shrink-0 brutal-shadow font-black text-primary-foreground">
                      {m.n}
                    </div>
                    <div className="pt-1">
                      <h3 className="font-black text-sm uppercase tracking-wide mb-1">{m.label}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{m.detail}</p>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FIRST CLIENT */}
      <section className="py-20 md:py-28 border-t-3 border-foreground/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <AnimateOnScroll animation="fade-up">
              <div className="inline-block border-2 border-primary bg-primary/10 px-4 py-1.5 mb-6 brutal-shadow-red">
                <span className="text-xs font-black uppercase tracking-widest text-primary">Live Now</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-8">Our First Deal</h2>
            </AnimateOnScroll>
            <AnimateOnScroll animation="fade-up" delay={0.1}>
              <div className="brutal-card bg-card p-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary flex items-center justify-center shrink-0 brutal-shadow">
                    <Building2 className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg uppercase tracking-wide mb-3">Vision Infra Tech</h3>
                    <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                      <p>
                        Vision Infra Tech is our first live client — a Hyderabad-based real estate developer
                        managing plots, villas, and commercial spaces across the city&apos;s high-growth corridors.
                        They came to us with inventory scattered across spreadsheets and leads tracked on WhatsApp.
                        Now their entire operation runs through REOS.
                      </p>
                      <p>
                        We built their branded public website, seeded 84 properties across 3 projects, wired
                        their lead capture directly into the CRM, and gave their team a dashboard for bookings,
                        documents, and compliance — all under their brand, all in one system.
                      </p>
                    </div>
                    <a
                      href="https://vision-infra-tech-thlq.vercel.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-4 text-sm font-bold text-primary hover:underline uppercase tracking-wide"
                    >
                      Visit their website <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed font-medium text-lg">
                This is deal one. The system is real, the data is real, the client is real.
                Everything from here is scale.
              </p>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 border-t-3 border-foreground/10">
        <div className="container mx-auto px-4 text-center">
          <AnimateOnScroll animation="scale-up">
            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-4">Want to see it in action?</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              We&apos;ll walk you through the dashboard and show you what your branded website would look like.
            </p>
            <Button size="lg" nativeButton={false} render={<Link href="/contact" />} className="font-black uppercase tracking-wide brutal-shadow-red">
              Get in Touch <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}
