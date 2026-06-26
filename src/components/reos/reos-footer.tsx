import Link from "next/link";
import { Layers, Mail, MapPin } from "lucide-react";

export function ReosFooter() {
  return (
    <footer className="border-t-3 border-foreground/20 bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-primary flex items-center justify-center brutal-shadow">
                <Layers className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-black leading-tight uppercase">REOS</span>
                <span className="text-[10px] font-bold text-muted-foreground leading-none uppercase tracking-widest">by TechClick</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The operating system for Indian real estate.
              Dashboard + website, bundled.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-3 text-sm uppercase tracking-wide">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="/login" className="hover:text-primary transition-colors">Login</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-3 text-sm uppercase tracking-wide">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-3 text-sm uppercase tracking-wide">Get in Touch</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                srikrishnabatkeeri@gmail.com
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-primary" />
                Hyderabad, Telangana, India
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t-2 border-foreground/10 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} TechClick. All rights reserved.</p>
          <p className="text-xs font-bold uppercase tracking-widest">REOS &mdash; Real Estate OS</p>
        </div>
      </div>
    </footer>
  );
}
