"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AnimateOnScroll } from "@/components/effects/animate-on-scroll";
import { Mail, MapPin, Phone, CheckCircle2, Send } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      {/* HEADER */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <AnimateOnScroll animation="fade-up">
            <div className="max-w-3xl">
              <div className="inline-block border-2 border-primary bg-primary/10 px-4 py-1.5 mb-8 brutal-shadow-red">
                <span className="text-xs font-black uppercase tracking-widest text-primary">Contact</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9]">
                Let&apos;s talk
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-2xl font-medium">
                Whether you want a demo, have questions about pricing, or just want to
                understand if REOS is right for your company — reach out.
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* FORM + INFO */}
      <section className="pb-20 md:pb-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl grid md:grid-cols-5 gap-6">
            {/* Form */}
            <div className="md:col-span-3">
              <AnimateOnScroll animation="fade-right">
                <div className="brutal-border bg-card p-6">
                  {submitted ? (
                    <div className="text-center py-12">
                      <div className="w-14 h-14 bg-primary flex items-center justify-center mx-auto mb-4 brutal-shadow">
                        <CheckCircle2 className="w-7 h-7 text-primary-foreground" />
                      </div>
                      <h3 className="text-lg font-black uppercase mb-2">Message sent</h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        We&apos;ll get back to you within 24 hours.
                      </p>
                      <Button variant="outline" onClick={() => setSubmitted(false)} className="font-bold uppercase border-2">
                        Send another
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="font-bold uppercase text-xs tracking-wide">Name</Label>
                          <Input id="name" placeholder="Your name" required className="border-2" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company" className="font-bold uppercase text-xs tracking-wide">Company</Label>
                          <Input id="company" placeholder="Your company name" className="border-2" />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="font-bold uppercase text-xs tracking-wide">Email</Label>
                          <Input id="email" type="email" placeholder="you@company.com" required className="border-2" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="font-bold uppercase text-xs tracking-wide">Phone</Label>
                          <Input id="phone" type="tel" placeholder="+91 93912 38940" className="border-2" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="interest" className="font-bold uppercase text-xs tracking-wide">Interested in</Label>
                        <select
                          id="interest"
                          className="flex h-9 w-full border-2 border-input bg-transparent px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          defaultValue=""
                        >
                          <option value="" disabled>Select one</option>
                          <option value="demo">Product demo</option>
                          <option value="pricing">Pricing questions</option>
                          <option value="starter">Starter plan</option>
                          <option value="professional">Professional plan</option>
                          <option value="enterprise">Enterprise / Custom</option>
                          <option value="other">Something else</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message" className="font-bold uppercase text-xs tracking-wide">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us about your company and what you're looking for..."
                          rows={4}
                          className="border-2"
                        />
                      </div>
                      <Button type="submit" className="w-full font-black uppercase tracking-wide brutal-shadow-red">
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                    </form>
                  )}
                </div>
              </AnimateOnScroll>
            </div>

            {/* Info */}
            <div className="md:col-span-2">
              <AnimateOnScroll animation="fade-left">
                <div className="space-y-5">
                  <div>
                    <h3 className="font-black uppercase text-sm tracking-wide mb-4">Contact info</h3>
                    <ul className="space-y-4 text-sm text-muted-foreground">
                      <li className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary flex items-center justify-center shrink-0 brutal-shadow">
                          <Mail className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground/50 mb-0.5">Email</div>
                          srikrishnabatkeeri@gmail.com
                        </div>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary flex items-center justify-center shrink-0 brutal-shadow">
                          <Phone className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground/50 mb-0.5">Phone</div>
                          +91 93912 38940
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-9 h-9 bg-primary flex items-center justify-center shrink-0 brutal-shadow">
                          <MapPin className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground/50 mb-0.5">Location</div>
                          Hyderabad, Telangana, India
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="brutal-border bg-card p-5">
                    <h4 className="font-black text-sm uppercase tracking-wide mb-3">What happens next?</h4>
                    <ol className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="font-black text-primary shrink-0">1.</span>
                        We reply within 24 hours
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-black text-primary shrink-0">2.</span>
                        We schedule a 30-min demo call
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-black text-primary shrink-0">3.</span>
                        We set up your dashboard and website
                      </li>
                    </ol>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
