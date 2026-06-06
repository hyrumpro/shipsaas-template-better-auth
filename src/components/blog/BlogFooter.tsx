import Link from "next/link";
import { Logo } from "@/components/Logo";

const links = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Components", href: "/playground" },
  { label: "Docs", href: "/docs" },
];

export function BlogFooter() {
  return (
    <footer className="border-border border-t">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-6 py-10 md:flex-row md:items-center">
        <Link href="/" aria-label="ShipSaaS home">
          <Logo />
        </Link>
        <nav
          aria-label="Footer"
          className="text-muted-foreground flex flex-wrap items-center gap-x-6 gap-y-2 text-sm"
        >
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} ShipSaaS
        </p>
      </div>
    </footer>
  );
}
