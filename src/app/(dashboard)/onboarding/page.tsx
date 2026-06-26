"use client";

import { useState } from "react";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useDemoStore } from "@/lib/demo-store";
import {
  Send, CheckCircle2, ArrowLeft, Palette, Globe, FileText,
  Layout, Image, MessageSquare,
} from "lucide-react";

const TECHCLICK_EMAIL = "srikrishnabatkeeri@gmail.com";
const TECHCLICK_PHONE = "919391238940";

interface FormData {
  brandColor: string;
  logoUrl: string;
  pages: string[];
  contentReady: string;
  referenceWebsites: string;
  companyDescription: string;
  specialRequirements: string;
}

const PAGE_OPTIONS = [
  { value: "home", label: "Home Page" },
  { value: "projects", label: "Projects Listing" },
  { value: "properties", label: "Properties Search" },
  { value: "about", label: "About Us" },
  { value: "contact", label: "Contact Page" },
  { value: "gallery", label: "Photo Gallery" },
  { value: "testimonials", label: "Testimonials" },
  { value: "blog", label: "Blog / News" },
  { value: "careers", label: "Careers" },
  { value: "custom", label: "Custom Page (describe below)" },
];

export default function OnboardingPage() {
  const store = useDemoStore();
  const [step, setStep] = useState(0);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState<FormData>({
    brandColor: "#dc2626",
    logoUrl: "",
    pages: ["home", "projects", "properties", "about", "contact"],
    contentReady: "",
    referenceWebsites: "",
    companyDescription: "",
    specialRequirements: "",
  });

  function togglePage(value: string) {
    setForm((f) => ({
      ...f,
      pages: f.pages.includes(value)
        ? f.pages.filter((p) => p !== value)
        : [...f.pages, value],
    }));
  }

  function buildEmailBody() {
    const companyName = store.settings.company_name;
    const selectedPages = form.pages
      .map((p) => PAGE_OPTIONS.find((o) => o.value === p)?.label)
      .filter(Boolean)
      .join(", ");

    return `NEW WEBSITE REQUEST — ${companyName}

Company: ${companyName}
Phone: ${store.settings.company_phone || "Not provided"}
Email: ${store.settings.company_email || "Not provided"}

BRAND COLOR: ${form.brandColor}
LOGO: ${form.logoUrl || "Not uploaded yet — will send separately"}

PAGES NEEDED:
${selectedPages}

CONTENT READY: ${form.contentReady || "Not specified"}

COMPANY DESCRIPTION:
${form.companyDescription || "Not provided"}

REFERENCE WEBSITES:
${form.referenceWebsites || "None"}

SPECIAL REQUIREMENTS:
${form.specialRequirements || "None"}

---
Sent from REOS Dashboard
Tenant: ${store.settings.company_name}`;
  }

  function buildWhatsAppMessage() {
    const companyName = store.settings.company_name;
    const selectedPages = form.pages
      .map((p) => PAGE_OPTIONS.find((o) => o.value === p)?.label)
      .filter(Boolean)
      .join(", ");

    return `*NEW WEBSITE REQUEST*
Company: ${companyName}
Color: ${form.brandColor}
Pages: ${selectedPages}
Content: ${form.contentReady || "Not specified"}
${form.companyDescription ? `About: ${form.companyDescription}` : ""}
${form.referenceWebsites ? `Reference: ${form.referenceWebsites}` : ""}
${form.specialRequirements ? `Special: ${form.specialRequirements}` : ""}`;
  }

  function handleSendEmail() {
    const subject = encodeURIComponent(`Website Request — ${store.settings.company_name}`);
    const body = encodeURIComponent(buildEmailBody());
    window.open(`mailto:${TECHCLICK_EMAIL}?subject=${subject}&body=${body}`, "_blank");
    setSent(true);
  }

  function handleSendWhatsApp() {
    const message = encodeURIComponent(buildWhatsAppMessage());
    window.open(`https://wa.me/${TECHCLICK_PHONE}?text=${message}`, "_blank");
    setSent(true);
  }

  const questions = [
    {
      title: "Brand & Colors",
      icon: Palette,
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Your Brand Color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.brandColor}
                onChange={(e) => setForm({ ...form, brandColor: e.target.value })}
                className="w-12 h-10 rounded cursor-pointer border-2 border-input"
              />
              <Input
                value={form.brandColor}
                onChange={(e) => setForm({ ...form, brandColor: e.target.value })}
                placeholder="#dc2626"
                className="w-32"
              />
              <div className="h-10 flex-1 rounded" style={{ backgroundColor: form.brandColor }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Company Logo URL (or upload separately)</Label>
            <Input
              value={form.logoUrl}
              onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
              placeholder="https://your-logo-url.com/logo.png or leave blank"
            />
            <p className="text-xs text-muted-foreground">No logo yet? No problem — you can send it via WhatsApp or email later.</p>
          </div>
        </div>
      ),
    },
    {
      title: "Pages You Need",
      icon: Layout,
      content: (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Select all the pages you want on your website:</p>
          <div className="grid grid-cols-2 gap-2">
            {PAGE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => togglePage(option.value)}
                className={`text-left p-3 rounded border text-sm transition-colors ${
                  form.pages.includes(option.value)
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border hover:border-muted-foreground/30"
                }`}
              >
                <span className="flex items-center gap-2">
                  {form.pages.includes(option.value) && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Content & Description",
      icon: FileText,
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Do you have content ready?</Label>
            <Select value={form.contentReady} onValueChange={(v) => v && setForm({ ...form, contentReady: v })}>
              <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="yes_all">Yes — all text and images ready</SelectItem>
                <SelectItem value="yes_partial">Partially — some content ready</SelectItem>
                <SelectItem value="no_write">No — I need TechClick to write it</SelectItem>
                <SelectItem value="no_later">No — I'll provide it later</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Tell us about your company (for the About page)</Label>
            <Textarea
              value={form.companyDescription}
              onChange={(e) => setForm({ ...form, companyDescription: e.target.value })}
              placeholder="E.g., We are a Hyderabad-based real estate developer focused on plotted developments near the IT corridor..."
              rows={4}
            />
          </div>
        </div>
      ),
    },
    {
      title: "References & Special Requests",
      icon: Globe,
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Any reference websites you like?</Label>
            <Textarea
              value={form.referenceWebsites}
              onChange={(e) => setForm({ ...form, referenceWebsites: e.target.value })}
              placeholder="Paste URLs of websites whose design you like. E.g., https://example.com — I like their layout"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Any special requirements?</Label>
            <Textarea
              value={form.specialRequirements}
              onChange={(e) => setForm({ ...form, specialRequirements: e.target.value })}
              placeholder="E.g., I need a virtual tour section, or integration with Google Maps showing all project locations, etc."
              rows={3}
            />
          </div>
        </div>
      ),
    },
  ];

  if (sent) {
    return (
      <>
        <DashboardHeader title="Website Setup" description="Tell us how you want your website" />
        <div className="p-4 max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-xl font-semibold">Request Sent!</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                We&apos;ve received your website preferences. Sri Krishna from TechClick will
                review them and get back to you within 24 hours. Your website will be
                ready in 3-4 business days.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button variant="outline" nativeButton={false} render={<Link href="/dashboard" />}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </Button>
                <Button onClick={() => setSent(false)}>
                  Edit & Resend
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  const currentQuestion = questions[step];

  return (
    <>
      <DashboardHeader
        title="Website Setup"
        description={`Step ${step + 1} of ${questions.length} — ${currentQuestion.title}`}
        actions={
          <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/dashboard" />}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Dashboard
          </Button>
        }
      />
      <div className="p-4 max-w-2xl mx-auto space-y-6">
        {/* Progress */}
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Question Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <currentQuestion.icon className="w-5 h-5 text-primary" />
              {currentQuestion.title}
            </CardTitle>
          </CardHeader>
          <CardContent>{currentQuestion.content}</CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
          >
            Previous
          </Button>

          {step < questions.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)}>
              Next
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSendWhatsApp} className="gap-2">
                <MessageSquare className="w-4 h-4" />
                Send via WhatsApp
              </Button>
              <Button onClick={handleSendEmail} className="gap-2">
                <Send className="w-4 h-4" />
                Send via Email
              </Button>
            </div>
          )}
        </div>

        {/* Preview on last step */}
        {step === questions.length - 1 && (
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-sm">Preview — what we&apos;ll receive</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed">
                {buildEmailBody()}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
