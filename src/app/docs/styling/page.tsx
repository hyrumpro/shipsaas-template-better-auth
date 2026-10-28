import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Styling",
  description:
    "Pick from 24 theme presets, set a custom brand color, and see every component adapt via CSS variables.",
};

export default function StylingDocsPage() {
  return (
    <article>
      <h1>Styling (24 themes + CSS variables)</h1>
      <p>
        ShipSaaS uses CSS custom properties for the entire design system, so
        theming is just a matter of changing a handful of{" "}
        <code>--variable</code> values. The catalog ships with 24 presets, and{" "}
        <code>applyTheme()</code> applies one at runtime without a rebuild.
      </p>

      <h2>How themes work</h2>
      <p>
        Colors are defined as <code>--background</code>,{" "}
        <code>--foreground</code>, <code>--primary</code>,{" "}
        <code>--primary-foreground</code>, <code>--accent</code>,{" "}
        <code>--muted</code>, and so on. The dark-mode variants use the same
        names, scoped to a <code>.dark</code> class on <code>&lt;html&gt;</code>
        .
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

      <h2>Switching themes at runtime</h2>
      <p>
        <code>applyTheme()</code> from <code>src/config/theme.ts</code> writes a
        preset&apos;s HSL values to <code>--primary</code>,{" "}
        <code>--accent</code>, <code>--ring</code>,{" "}
        <code>--gradient-primary</code>, and <code>--shadow-glow</code> on{" "}
        <code>&lt;html&gt;</code>, and remembers the choice in{" "}
        <code>localStorage</code>:
      </p>
      <pre className="not-prose bg-secondary p-4 rounded-md text-sm overflow-x-auto">
        {`import { applyTheme, THEME_PRESETS } from "@/config/theme";

applyTheme(THEME_PRESETS.blue);`}
      </pre>
      <p>
        A ready-made dropdown (<code>ThemeSwitcher</code>) lives at{" "}
        <code>src/components/playground/ui/ThemeSwitcher.tsx</code> — try it on{" "}
        <a href="/playground">/playground</a>. It is playground-scoped on
        purpose; copy it into your own layout or navbar if you want user-facing
        switching.
      </p>

      <h2>Adding a new theme</h2>
      <p>
        Each preset is a pair of HSL triples in <code>src/config/theme.ts</code>
        :
      </p>
      <pre className="not-prose bg-secondary p-4 rounded-md text-sm overflow-x-auto">
        {`export const THEME_PRESETS: Record<string, ThemeConfig> = {
  // ...
  sunset: {
    name: "Sunset",
    primary: { h: 18, s: 95, l: 55 },
    accent: { h: 320, s: 90, l: 60 },
  },
};`}
      </pre>
      <p>
        Or apply a one-off brand without adding a preset —{" "}
        <code>applyTheme()</code> accepts any shape with <code>primary</code>{" "}
        and <code>accent</code> triples:
      </p>
      <pre className="not-prose bg-secondary p-4 rounded-md text-sm overflow-x-auto">
        {`applyTheme({
  name: "My Brand",
  primary: { h: 280, s: 100, l: 60 },
  accent: { h: 290, s: 100, l: 65 },
});`}
      </pre>

      <h2>Dark mode</h2>
      <p>
        Dark variants for every token ship under a <code>.dark</code> class on{" "}
        <code>&lt;html&gt;</code>, and the Tailwind <code>class</code> strategy
        is already configured. Automatic system-preference flipping and a manual
        toggle are <em>not</em> included — when you need one, add a small client
        component that toggles the <code>dark</code> class.
      </p>

      <h2>Component playground</h2>
      <p>
        Visit <a href="/playground">/playground</a> to browse all components and
        switch themes live.
      </p>
    </article>
  );
}
