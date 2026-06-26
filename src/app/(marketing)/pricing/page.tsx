import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { AnimateOnScroll } from "@/components/effects/animate-on-scroll";
import { CheckCircle2, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing — REOS",
  description:
    "Simple per-company pricing. Dashboard + branded website included in every plan. No per-user fees.",
};

const plans = [
  {
    name: "Starter",
    price: "₹4,999",
    period: "/month",
    description: "For small agencies and solo developers managing up to 2 projects.",
    features: [
      "Up to 2 projects",
      "Up to 100 properties",
      "3 team members",
      "Branded website (companyname.reos.in)",
      "Full CRM pipeline",
      "Booking & payment tracking",
      "Document management",
      "RERA compliance module",
      "Analytics dashboard",
      "Email support",
    ],
    highlighted: false,
  },
  {
    name: "Professional",
    price: "₹9,999",
    period: "/month",
    description: "For growing developers managing multiple projects across cities.",
    features: [
      "Up to 10 projects",
      "Unlimited properties",
      "10 team members",
      "Branded website (companyname.reos.in)",
      "Full CRM pipeline",
      "Booking & payment tracking",
      "Document management",
      "RERA compliance module",
      "Analytics dashboard",
      "WhatsApp Business API integration",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large developers and agencies with advanced requirements.",
    features: [
      "Unlimited projects",
      "Unlimited properties",
      "Unlimited team members",
      "Branded website (companyname.reos.in)",
      "Full CRM pipeline",
      "Booking & payment tracking",
      "Document management",
      "RERA compliance module",
      "Analytics dashboard",
      "WhatsApp Business API integration",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantee",
    ],
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <>
      {/* HEADER */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <AnimateOnScroll animation="fade-up">
            <div className="max-w-3xl">
              <div className="inline-block border-2 border-primary bg-primary/10 px-4 py-1.5 mb-8 brutal-shadow-red">
                <span className="text-xs font-black uppercase tracking-widest text-primary">Pricing</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9]">
                Simple pricing. <span className="text-primary">No per-user fees.</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-2xl font-medium">
                One price per company. Dashboard + branded website included in every plan.
                Add as many agents as your plan allows — no extra charge per seat.
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* PLANS */}
      <section className="pb-20 md:pb-28">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl">
            {plans.map((plan, i) => (
              <AnimateOnScroll key={plan.name} animation="fade-up" delay={i * 0.1}>
                <div className={`flex flex-col h-full bg-card p-6 ${plan.highlighted ? "border-3 border-primary brutal-shadow-red" : "brutal-border"}`}>
                  {plan.highlighted && (
                    <div className="inline-block w-fit border-2 border-primary bg-primary/10 px-3 py-1 mb-4">
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest">Most Popular</span>
                    </div>
                  )}
                  <h2 className="text-lg font-black uppercase tracking-wide">{plan.name}</h2>
                  <div className="mt-2 mb-1">
                    <span className="text-3xl font-black">{plan.price}</span>
                    <span className="text-sm text-muted-foreground font-bold">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

                  <ul className="space-y-2.5 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full font-bold uppercase tracking-wide ${plan.highlighted ? "brutal-shadow-red" : ""}`}
                    variant={plan.highlighted ? "default" : "outline"}
                    nativeButton={false}
                    render={<Link href="/contact" />}
                  >
                    {plan.highlighted ? "Get Started" : plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="py-20 md:py-28 border-t-3 border-foreground/10">
        <div className="container mx-auto px-4">
          <AnimateOnScroll animation="fade-up">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-10">Compare with what you pay now</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="brutal-border bg-card p-6">
                  <h3 className="font-black text-sm uppercase tracking-wide mb-4 text-destructive">Without REOS</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>Sell.Do CRM: ₹1,500–3,000/user/month</li>
                    <li>5 agents = ₹7,500–15,000/month</li>
                    <li>Website development: ₹50,000–2,00,000 one-time</li>
                    <li>Website hosting: ₹500–2,000/month</li>
                    <li>No post-booking features</li>
                    <li>No RERA compliance tools</li>
                  </ul>
                </div>
                <div className="border-3 border-primary bg-primary/5 p-6 brutal-shadow-red">
                  <h3 className="font-black text-sm uppercase tracking-wide mb-4 text-primary">With REOS Professional</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>₹9,999/month — all 10 team members</li>
                    <li>Website included and maintained</li>
                    <li>Full lifecycle: lead to possession</li>
                    <li>RERA compliance built in</li>
                    <li>Analytics, documents, payments</li>
                    <li>One vendor, one invoice</li>
                  </ul>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 border-t-3 border-foreground/10">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <AnimateOnScroll animation="fade-up">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-10">Common questions</h2>
            </AnimateOnScroll>
            <div className="space-y-4">
              {[
                { q: "Is the website really included?", a: "Yes. Every plan includes a branded website at companyname.reos.in. We build it, host it, and maintain it. Your data from the dashboard powers it automatically." },
                { q: "What happens to my data if I cancel?", a: "Your data is yours. We provide a full export (CSV/JSON) of all your properties, leads, bookings, and documents before account closure." },
                { q: "Do you charge per user/agent?", a: "No. Each plan has a team member limit, but there's no per-seat fee. The Starter plan includes 3 members, Professional includes 10." },
                { q: "Can I import my existing data from Excel?", a: "Yes. REOS supports bulk import from CSV/Excel for properties, leads, and projects." },
              ].map((item, i) => (
                <AnimateOnScroll key={item.q} animation="fade-up" delay={i * 0.06}>
                  <div className="brutal-border bg-card p-5">
                    <h3 className="font-black text-sm uppercase tracking-wide mb-1.5">{item.q}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
