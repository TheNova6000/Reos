import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScrollProvider } from "@/components/providers/scroll-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#1e40af",
};

export const metadata: Metadata = {
  title: {
    default: "REOS — Real Estate Operating System by TechClick",
    template: "%s | REOS",
  },
  description:
    "Dashboard + branded website, bundled. Manage properties, leads, bookings, documents, analytics, and RERA compliance. Built by TechClick.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>
          <ScrollProvider>
            {children}
          </ScrollProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
