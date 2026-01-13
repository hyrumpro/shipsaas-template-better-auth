import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

export function BlogNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-4 mt-4">
        <div className="glass-strong rounded-2xl">
          <div className="container px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                  <Zap className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">ShipSaaS</span>
              </Link>

              <div className="flex items-center gap-3">
                <Link href="/blog">
                  <Button variant="ghost" size="sm">
                    Blog
                  </Button>
                </Link>
                <Link href="/playground">
                  <Button variant="ghost" size="sm">
                    Components
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="default" size="sm">
                    Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
