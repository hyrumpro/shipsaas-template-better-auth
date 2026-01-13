import Link from "next/link";
import { Zap } from "lucide-react";

export function BlogFooter() {
  return (
    <footer className="border-t border-border/50 py-12 mt-20">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">ShipSaaS</span>
          </Link>

          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/blog" className="hover:text-foreground transition-colors">
              Blog
            </Link>
            <Link href="/playground" className="hover:text-foreground transition-colors">
              Components
            </Link>
          </div>

          <p className="text-sm text-muted-foreground">
            © 2024 ShipSaaS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
