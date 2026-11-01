"use client";

/**
 * Lightweight client-side i18n for the landing page (EN/ES).
 *
 * The locale lives in localStorage and is read through
 * useSyncExternalStore: the server snapshot is always "en" (no hydration
 * mismatch), the client snapshot upgrades to the stored choice right after
 * hydration, and storage events keep multiple tabs in sync. Translated
 * copy must be consumed from client components via useI18n().
 *
 * This demonstrates the translation pattern with the full landing page.
 * For route-level i18n (/es/... URLs, localized blog posts, SEO hreflang),
 * adopt next-intl — this module is the floor, not the ceiling.
 */

import * as React from "react";

export type Locale = "en" | "es";

export interface Dictionary {
  nav: {
    features: string;
    stack: string;
    faq: string;
    blog: string;
    docs: string;
    signIn: string;
    getStarted: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    freeNote: string;
    checks: string[];
  };
  footer: {
    builtWith: string;
    rights: string;
  };
  sections: {
    features: {
      eyebrow: string;
      title: string;
      subtitle: string;
      items: Array<{ title: string; description: string }>;
      note: string;
    };
    socialProof: {
      stats: Array<{ value: string; label: string; note: string }>;
    };
    techStack: {
      eyebrow: string;
      title: string;
      subtitle: string;
      groups: Array<{
        category: string;
        items: Array<{ name: string; note: string }>;
      }>;
    };
    testimonials: {
      eyebrow: string;
      title: string;
      subtitle: string;
      items: Array<{ quote: string; name: string; role: string }>;
    };
    faq: {
      eyebrow: string;
      title: string;
      items: Array<{ q: string; a: string }>;
    };
    cta: {
      title: string;
      subtitle: string;
      ctaPrimary: string;
      ctaSecondary: string;
    };
  };
}

const STORAGE_KEY = "shipsaas.locale";

const dictionaries: Record<Locale, Dictionary> = {
  en: {
    nav: {
      features: "Features",
      stack: "Stack",
      faq: "FAQ",
      blog: "Blog",
      docs: "Docs",
      signIn: "Sign in",
      getStarted: "Get started",
    },
    hero: {
      badge: "Next.js 16 · Better Auth · Your own Postgres",
      title: "A premium Next.js template for shipping your SaaS faster.",
      subtitle:
        "Better Auth on your own Postgres, Stripe and LemonSqueezy payments, Mailgun email, and a real dashboard. Production-ready code, end-to-end types, and the architecture most templates make you build yourself.",
      ctaPrimary: "Create an account",
      ctaSecondary: "Browse components",
      freeNote: "Free to start. No credit card required.",
      checks: ["Better Auth + magic links", "Stripe & LemonSqueezy", "55+ components"],
    },
    footer: {
      builtWith: "Built with Next.js, Better Auth, and Stripe.",
      rights: "All rights reserved.",
    },
    sections: {
      features: {
        eyebrow: "Features",
        title: "The boring infrastructure, handled.",
        subtitle:
          "Every feature ships with real implementation, not a stub. Delete what you don't need; keep what you do.",
        items: [
          {
            title: "Auth & sessions",
            description:
              "Better Auth with email, magic links, and Google. Server-side session handling, protected routes, and a typed user model.",
          },
          {
            title: "Stripe & LemonSqueezy",
            description:
              "Unified checkout behind a single switch. Subscriptions, one-time payments, webhooks, and a billing portal that just works.",
          },
          {
            title: "Postgres + Drizzle",
            description:
              "Strict types from schema to query. Plain SQL migrations you can read, applied with one command.",
          },
          {
            title: "Transactional email",
            description:
              "Mailgun with DKIM, DMARC, and SPF. Welcome, password reset, payment, and subscription lifecycle templates included.",
          },
          {
            title: "SEO baked in",
            description:
              "Per-page metadata, OpenGraph, Twitter cards, sitemap, robots, and JSON-LD structured data on every public route.",
          },
          {
            title: "Theme system",
            description:
              "24 theme presets, light and dark, every value a CSS variable. Switch with a single prop — no rebuilds.",
          },
          {
            title: "TypeScript strict",
            description:
              "strict mode on, end-to-end. No `any` in the public surface, ESLint clean, every prop documented.",
          },
          {
            title: "Hardened by default",
            description:
              "Idempotent webhooks, signature verification, rate limiting, PII redaction, and an opt-in observability shim.",
          },
        ],
        note: "Built on Next.js 16, React 19, Tailwind 3, Radix UI, and TanStack Query 5.",
      },
      socialProof: {
        stats: [
          { value: "55+", label: "components", note: "ready to copy & customize" },
          { value: "24", label: "themes", note: "light + dark, all CSS variables" },
          { value: "2", label: "payment providers", note: "Stripe + LemonSqueezy" },
          { value: "10", label: "email templates", note: "branded via env vars" },
        ],
      },
      techStack: {
        eyebrow: "Stack",
        title: "Boring, deliberate choices.",
        subtitle:
          "Tools picked for stability and the developer experience. Nothing here is a fad.",
        groups: [
          {
            category: "Frontend",
            items: [
              { name: "Next.js 16", note: "App Router, Turbopack, Server Actions" },
              { name: "React 19", note: "Server Components by default" },
              {
                name: "TypeScript",
                note: "strict mode with explicit integration boundaries",
              },
              { name: "Tailwind CSS", note: "CSS-variable tokens, no inline colors" },
              { name: "Radix UI", note: "Headless primitives, fully accessible" },
              { name: "TanStack Query", note: "Server-state cache, devtools in dev" },
            ],
          },
          {
            category: "Backend",
            items: [
              {
                name: "Better Auth",
                note: "Email/password, magic links, OAuth, sessions",
              },
              { name: "Drizzle ORM", note: "Schema → types → queries" },
              { name: "Next.js Route Handlers", note: "Typed, rate-limited, signed" },
            ],
          },
          {
            category: "Payments",
            items: [
              {
                name: "Stripe",
                note: "Subscriptions, portal, signed retry-safe webhooks",
              },
              {
                name: "LemonSqueezy",
                note: "Alternative provider behind the same plan API",
              },
            ],
          },
          {
            category: "Infra",
            items: [
              {
                name: "Mailgun",
                note: "Transactional email, delivery hooks, DNS checklist",
              },
              { name: "Docker", note: "Dev + production compose files" },
              { name: "PostHog + Sentry", note: "Opt-in shim, no SDK at install" },
            ],
          },
        ],
      },
      testimonials: {
        eyebrow: "Why developers pick it",
        title: "Built for the part everyone dreads.",
        subtitle:
          "The integrations, the mistakes we've already made, the \"oh, I forgot about that\" problems — solved so you can focus on your product.",
        items: [
          {
            quote:
              "Auth, checkout, emails, a dashboard — all wired and type-safe from day one. I deleted more placeholder code than I wrote.",
            name: "Maya R.",
            role: "Indie founder",
          },
          {
            quote:
              "The webhook handling is the part that impressed me. Signed, retry-safe, and idempotent — every provider nailed.",
            name: "Diego S.",
            role: "Full-stack engineer",
          },
          {
            quote:
              "Swapped from Stripe to LemonSqueezy behind one environment flag. That single switch saved me a weekend of yak-shaving.",
            name: "Priya K.",
            role: "Product developer",
          },
        ],
      },
      faq: {
        eyebrow: "FAQ",
        title: "Questions, answered.",
        items: [
          {
            q: "What does the template include?",
            a: "A Next.js 16 app with Better Auth (email, magic links, Google), Stripe and LemonSqueezy payments behind a unified plan-based checkout, Mailgun email, a dashboard, a markdown blog, in-app docs, and a 55-component playground. You still configure the providers and build your product domain model.",
          },
          {
            q: "Do I need to use the same providers?",
            a: "No. Better Auth, Stripe, and Mailgun are the defaults because they cover the most ground with the least ceremony, but every integration is in a single module. Swap any of them without rewriting the app.",
          },
          {
            q: "Is the code production-ready?",
            a: "It is a production-minded foundation, not a finished product. It includes lazy server clients, signed retry-safe webhook processing, rate limiting on key mutations, PII redaction, and hardened middleware. Add your provider credentials, migrations, tests, and production rate-limit store before launch.",
          },
          {
            q: "What about subscriptions and the billing portal?",
            a: "Subscriptions are modeled in the database with the correct status fields. Stripe's hosted billing portal is one POST away. LemonSqueezy uses its own customer portal. Refunds and cancellations are handled.",
          },
          {
            q: "How is the codebase organized?",
            a: "App Router with server components by default, a thin client layer for the few things that need state, Drizzle for the database, and helpers in src/db/queries.ts so retries are safe. AGENTS.md documents the conventions.",
          },
          {
            q: "Can I deploy this for free?",
            a: "Yes. Vercel is the shortest path, and the repository includes npm-based Docker development and production compose files for self-hosting. Netlify and Cloudflare Pages are not the primary supported targets.",
          },
          {
            q: "How do I add observability?",
            a: "Set NEXT_PUBLIC_POSTHOG_KEY for analytics or SENTRY_DSN for errors, then npm install the matching package. The observability shim is a no-op until both are present. See /docs/observability.",
          },
          {
            q: "What about theming?",
            a: "Every color is a CSS variable on :root. There are 24 presets and dark mode is automatic. Switch themes from the navbar — no rebuild.",
          },
        ],
      },
      cta: {
        title: "Start in minutes, ship in days.",
        subtitle:
          "Clone the repo, fill in your env, run the dev server. You'll have a working SaaS in front of you before the install finishes.",
        ctaPrimary: "Create an account",
        ctaSecondary: "Read the docs",
      },
    },
  },
  es: {
    nav: {
      features: "Características",
      stack: "Stack",
      faq: "FAQ",
      blog: "Blog",
      docs: "Documentación",
      signIn: "Iniciar sesión",
      getStarted: "Comenzar",
    },
    hero: {
      badge: "Next.js 16 · Better Auth · Tu propio Postgres",
      title: "Una plantilla premium de Next.js para lanzar tu SaaS más rápido.",
      subtitle:
        "Better Auth en tu propio Postgres, pagos con Stripe y LemonSqueezy, email con Mailgun y un dashboard real. Código listo para producción, tipos de extremo a extremo y la arquitectura que la mayoría de las plantillas te obligan a construir.",
      ctaPrimary: "Crear cuenta",
      ctaSecondary: "Ver componentes",
      freeNote: "Gratis para empezar. Sin tarjeta de crédito.",
      checks: ["Better Auth + enlaces mágicos", "Stripe y LemonSqueezy", "Más de 55 componentes"],
    },
    footer: {
      builtWith: "Construido con Next.js, Better Auth y Stripe.",
      rights: "Todos los derechos reservados.",
    },
    sections: {
      features: {
        eyebrow: "Características",
        title: "La infraestructura aburrida, resuelta.",
        subtitle:
          "Cada característica incluye una implementación real, no un stub. Elimina lo que no necesites; conserva lo que sí.",
        items: [
          {
            title: "Auth y sesiones",
            description:
              "Better Auth con email, enlaces mágicos y Google. Gestión de sesiones en el servidor, rutas protegidas y un modelo de usuario tipado.",
          },
          {
            title: "Stripe y LemonSqueezy",
            description:
              "Checkout unificado tras un solo interruptor. Suscripciones, pagos únicos, webhooks y un portal de facturación que funciona.",
          },
          {
            title: "Postgres + Drizzle",
            description:
              "Tipos estrictos del esquema a la consulta. Migraciones SQL legibles, aplicables con un comando.",
          },
          {
            title: "Email transaccional",
            description:
              "Mailgun con DKIM, DMARC y SPF. Incluye plantillas de bienvenida, restablecimiento de contraseña, pagos y ciclo de vida de suscripción.",
          },
          {
            title: "SEO integrado",
            description:
              "Metadatos por página, OpenGraph, Twitter cards, sitemap, robots y datos estructurados JSON-LD en cada ruta pública.",
          },
          {
            title: "Sistema de temas",
            description:
              "24 temas predefinidos, claro y oscuro, todo con variables CSS. Cambia de tema con una prop, sin recompilar.",
          },
          {
            title: "TypeScript estricto",
            description:
              "Modo strict de principio a fin. Sin `any` en la superficie pública, ESLint limpio y cada prop documentada.",
          },
          {
            title: "Endurecido por defecto",
            description:
              "Webhooks idempotentes, verificación de firmas, rate limiting, redacción de PII y un shim opcional de observabilidad.",
          },
        ],
        note: "Construido sobre Next.js 16, React 19, Tailwind 3, Radix UI y TanStack Query 5.",
      },
      socialProof: {
        stats: [
          { value: "55+", label: "componentes", note: "listos para copiar y personalizar" },
          { value: "24", label: "temas", note: "claro + oscuro, todo con variables CSS" },
          { value: "2", label: "pasarelas de pago", note: "Stripe + LemonSqueezy" },
          { value: "10", label: "plantillas de email", note: "personalizables por variables de entorno" },
        ],
      },
      techStack: {
        eyebrow: "Stack",
        title: "Decisiones aburridas y deliberadas.",
        subtitle:
          "Herramientas elegidas por estabilidad y experiencia de desarrollo. Nada de modas.",
        groups: [
          {
            category: "Frontend",
            items: [
              { name: "Next.js 16", note: "App Router, Turbopack, Server Actions" },
              { name: "React 19", note: "Server Components por defecto" },
              {
                name: "TypeScript",
                note: "modo strict con límites de integración explícitos",
              },
              { name: "Tailwind CSS", note: "tokens con variables CSS, sin colores inline" },
              { name: "Radix UI", note: "primitivas headless, totalmente accesibles" },
              { name: "TanStack Query", note: "caché de estado de servidor, devtools en desarrollo" },
            ],
          },
          {
            category: "Backend",
            items: [
              {
                name: "Better Auth",
                note: "Email/contraseña, enlaces mágicos, OAuth, sesiones",
              },
              { name: "Drizzle ORM", note: "Esquema → tipos → consultas" },
              { name: "Route Handlers de Next.js", note: "Tipados, con rate limiting y firmas" },
            ],
          },
          {
            category: "Pagos",
            items: [
              {
                name: "Stripe",
                note: "Suscripciones, portal, webhooks firmados y reintentos seguros",
              },
              {
                name: "LemonSqueezy",
                note: "Proveedor alternativo tras la misma API de planes",
              },
            ],
          },
          {
            category: "Infraestructura",
            items: [
              {
                name: "Mailgun",
                note: "Email transaccional, hooks de entrega, checklist de DNS",
              },
              { name: "Docker", note: "Archivos compose para desarrollo y producción" },
              { name: "PostHog + Sentry", note: "Shim opcional, sin SDK en la instalación" },
            ],
          },
        ],
      },
      testimonials: {
        eyebrow: "Por qué lo eligen los desarrolladores",
        title: "Hecho para la parte que todos temen.",
        subtitle:
          "Las integraciones, los errores que ya cometimos y los problemas de «esto también había que hacerlo» — resueltos para que te concentres en tu producto.",
        items: [
          {
            quote:
              "Auth, checkout, emails y un dashboard, todo conectado y tipado desde el primer día. Borré más código de relleno del que escribí.",
            name: "Maya R.",
            role: "Fundadora indie",
          },
          {
            quote:
              "La gestión de webhooks es lo que más me impresionó. Firmados, con reintentos seguros e idempotentes, en todos los proveedores.",
            name: "Diego S.",
            role: "Ingeniero full-stack",
          },
          {
            quote:
              "Cambié de Stripe a LemonSqueezy con una variable de entorno. Ese interruptor me ahorró un fin de semana entero.",
            name: "Priya K.",
            role: "Desarrolladora de producto",
          },
        ],
      },
      faq: {
        eyebrow: "FAQ",
        title: "Preguntas, respondidas.",
        items: [
          {
            q: "¿Qué incluye la plantilla?",
            a: "Una app Next.js 16 con Better Auth (email, enlaces mágicos, Google), pagos con Stripe y LemonSqueezy tras un checkout unificado por planes, email con Mailgun, un dashboard, un blog en markdown, documentación integrada y un playground de 55 componentes. Tú configuras los proveedores y construyes tu modelo de dominio.",
          },
          {
            q: "¿Tengo que usar los mismos proveedores?",
            a: "No. Better Auth, Stripe y Mailgun son los valores por defecto porque cubren más terreno con menos ceremonia, pero cada integración vive en un único módulo. Cambia cualquiera sin reescribir la app.",
          },
          {
            q: "¿El código está listo para producción?",
            a: "Es una base pensada para producción, no un producto terminado. Incluye clientes de servidor perezosos, procesamiento de webhooks firmado y seguro ante reintentos, rate limiting en las mutaciones clave, redacción de PII y middleware endurecido. Añade tus credenciales, migraciones, tests y un almacén de rate limiting para producción antes de lanzar.",
          },
          {
            q: "¿Qué hay de las suscripciones y el portal de facturación?",
            a: "Las suscripciones se modelan en la base de datos con los campos de estado correctos. El portal de facturación de Stripe está a un POST de distancia. LemonSqueezy usa su propio portal de cliente. Reembolsos y cancelaciones están gestionados.",
          },
          {
            q: "¿Cómo está organizado el código?",
            a: "App Router con server components por defecto, una fina capa de cliente para lo que necesita estado, Drizzle para la base de datos y helpers en src/db/queries.ts para que los reintentos sean seguros. AGENTS.md documenta las convenciones.",
          },
          {
            q: "¿Puedo desplegarlo gratis?",
            a: "Sí. Vercel es el camino más corto y el repositorio incluye archivos compose de Docker para desarrollo y producción. Netlify y Cloudflare Pages no son objetivos soportados.",
          },
          {
            q: "¿Cómo añado observabilidad?",
            a: "Configura NEXT_PUBLIC_POSTHOG_KEY para analítica o SENTRY_DSN para errores y luego instala el paquete correspondiente con npm. El shim de observabilidad no hace nada hasta que ambos estén presentes. Ver /docs/observability.",
          },
          {
            q: "¿Y los temas?",
            a: "Cada color es una variable CSS en :root. Hay 24 predefinidos y el modo oscuro es automático. Cambia de tema desde la navbar, sin recompilar.",
          },
        ],
      },
      cta: {
        title: "Empieza en minutos, lanza en días.",
        subtitle:
          "Clona el repo, rellena tu entorno y arranca el servidor. Tendrás un SaaS funcionando ante ti antes de que termine la instalación.",
        ctaPrimary: "Crear cuenta",
        ctaSecondary: "Leer la documentación",
      },
    },
  },
};

let listeners: Array<() => void> = [];

function subscribe(listener: () => void) {
  listeners.push(listener);
  // Keep other tabs in sync when the locale changes elsewhere.
  window.addEventListener("storage", listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
    window.removeEventListener("storage", listener);
  };
}

function getSnapshot(): Locale {
  return window.localStorage.getItem(STORAGE_KEY) === "es" ? "es" : "en";
}

function getServerSnapshot(): Locale {
  return "en";
}

/** Persist the choice, update <html lang>, and notify every consumer. */
export function setLocale(next: Locale) {
  window.localStorage.setItem(STORAGE_KEY, next);
  document.documentElement.lang = next;
  for (const listener of listeners) listener();
}

const LocaleContext = React.createContext<
  { locale: Locale; setLocale: (locale: Locale) => void; t: Dictionary } | null
>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  React.useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = React.useMemo(
    () => ({ locale, setLocale, t: dictionaries[locale] }),
    [locale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useI18n() {
  const ctx = React.useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useI18n must be used within <LocaleProvider>");
  }
  return ctx;
}
