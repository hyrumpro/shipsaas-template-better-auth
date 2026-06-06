import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Styling",
    description:
      "Pick from 24 theme presets, set a custom brand color, and let dark mode flip automatically.",
};

export default function StylingDocsPage() {
  return (
    <article>
      <h1>Styling (24 themes + dark mode)</h1>
      <p>
        ShipSaaS uses CSS custom properties for the entire design
        system, so theming is just a matter of changing a handful of{" "}
        <code>--variable</code> values. The theme system ships with
        24 presets and a <code>ThemeProvider</code> that flips dark
        mode based on the user&apos;s system preference.
      </p>

      <h2>How themes work</h2>
      <p>
        Colors are defined as <code>--background</code>,{" "}
        <code>--foreground</code>, <code>--primary</code>,{" "}
        <code>--primary-foreground</code>, <code>--accent</code>,{" "}
        <code>--muted</code>, and so on. The dark-mode variants use the
        same names, scoped to a <code>.dark</code> class on{" "}
        <code>&lt;html&gt;</code>.
      </p>
      <pre className="not-prose bg-secondary p-4 rounded-md text-sm overflow-x-auto">
{`:root {
  --background: 0 0% 100%;
  --foreground: 222 47% 11%;
  --primary: 222 89% 55%;
  /* ... */
}

.dark {
  --background: 222 47% 6%;
  --foreground: 0 0% 98%;
  --primary: 217 91% 60%;
  /* ... */
}`}
      </pre>

      <h2>Switching themes</h2>
      <p>
        Add the <code>ThemeProvider</code> in the root layout, then
        use the <code>ThemeSwitcher</code> component to let users
        pick. The active theme is persisted in <code>localStorage</code>
        .
      </p>
      <pre className="not-prose bg-secondary p-4 rounded-md text-sm overflow-x-auto">
{`// src/app/layout.tsx
import { ThemeProvider } from "@/components/theme/ThemeProvider";

<ThemeProvider themes={themes} defaultTheme="blue" attribute="class">
  {children}
</ThemeProvider>`}
      </pre>

      <h2>Adding a new theme</h2>
      <p>
        Each theme is a HSL triple object. To add a new one, append to{" "}
        <code>src/config/theme.ts</code>:
      </p>
      <pre className="not-prose bg-secondary p-4 rounded-md text-sm overflow-x-auto">
{`export const themes = [
  { name: "blue", primary: "222 89% 55%" },
  { name: "emerald", primary: "158 64% 40%" },
  { name: "rose", primary: "350 89% 60%" },
  // add yours here
];`}
      </pre>
      <p>
        The <code>ThemeProvider</code> applies the value to a{" "}
        <code>data-theme</code> attribute on <code>&lt;html&gt;</code>,
        and your CSS can use:
      </p>
      <pre className="not-prose bg-secondary p-4 rounded-md text-sm overflow-x-auto">
{`[data-theme="emerald"] {
  --primary: 158 64% 40%;
}`}
      </pre>

      <h2>Dark mode</h2>
      <p>
        Dark mode is automatic. The provider listens to{" "}
        <code>prefers-color-scheme</code> and the <code>class</code>{" "}
        strategy used by Tailwind. Users can override with a manual
        toggle.
      </p>

      <h2>Component playground</h2>
      <p>
        Visit <a href="/playground">/playground</a> to see all
        components rendered in every theme.
      </p>
    </article>
  );
}
