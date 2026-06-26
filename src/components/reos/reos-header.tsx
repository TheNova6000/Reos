import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, LogIn, Layers, ArrowRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function ReosHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b-3 border-foreground/20 bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary flex items-center justify-center brutal-shadow">
            <Layers className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg tracking-tight leading-tight uppercase">REOS</span>
            <span className="text-[10px] font-bold text-muted-foreground leading-none uppercase tracking-widest">by TechClick</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 text-sm font-bold uppercase tracking-wide text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Button size="sm" variant="outline" className="ml-2 font-bold uppercase tracking-wide border-2" nativeButton={false} render={<Link href="/login" />}>
            <LogIn className="w-3.5 h-3.5 mr-1.5" />
            Login
          </Button>
          <Button size="sm" className="ml-1 font-bold uppercase tracking-wide brutal-shadow-red" nativeButton={false} render={<Link href="/signup" />}>
            Get Started <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </nav>

        <Sheet>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="flex flex-col gap-4 mt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-lg font-bold uppercase tracking-wide"
                >
                  {link.label}
                </Link>
              ))}
              <Button className="mt-4 font-bold uppercase brutal-shadow-red" nativeButton={false} render={<Link href="/signup" />}>
                Get Started <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" className="font-bold uppercase border-2" nativeButton={false} render={<Link href="/login" />}>
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
