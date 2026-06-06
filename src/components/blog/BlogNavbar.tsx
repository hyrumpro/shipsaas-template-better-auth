import Link from "next/link";
import { Logo } from "@/components/Logo";

const navLinks = [
  { label: "Blog", href: "/blog" },
  { label: "Components", href: "/playground" },
  { label: "Docs", href: "/docs" },
];

export function BlogNavbar() {
  return (
    <header className="border-border bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" aria-label="ShipSaaS home">
          <Logo />
        </Link>
        <nav
          aria-label="Blog"
          className="hidden items-center gap-6 md:flex"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/auth/register"
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors"
        >
          Get started
        </Link>
      </div>
    </header>
  );
}
