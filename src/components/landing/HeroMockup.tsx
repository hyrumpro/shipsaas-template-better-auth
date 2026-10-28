"use client";

import { motion } from "framer-motion";
import {
  LayoutDashboard,
  CreditCard,
  Users,
  Mail,
  Settings,
  BarChart3,
  TrendingUp,
  Activity,
} from "lucide-react";

const nav = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: BarChart3, label: "Analytics" },
  { icon: Users, label: "Customers" },
  { icon: CreditCard, label: "Billing" },
  { icon: Mail, label: "Emails" },
  { icon: Settings, label: "Settings" },
];

const stats = [
  { label: "MRR", value: "$12,480", delta: "+12.4%", up: true },
  { label: "Active users", value: "3,214", delta: "+8.1%", up: true },
  { label: "Conversion", value: "4.2%", delta: "-0.3%", up: false },
];

const chart = [42, 58, 46, 72, 60, 84, 76, 92, 66, 88, 78, 96];

const activity = [
  { who: "New subscription", what: "Acme Inc. · Premium", when: "2m ago" },
  { who: "Payment succeeded", what: "Globex Corp · $29.00", when: "18m ago" },
  { who: "User signed up", what: "example@email.com", when: "1h ago" },
];

/**
 * A pure-markup dashboard preview for the hero. Uses only theme tokens
 * (card, border, muted, chart-*), no images and no glass. A single light
 * fade+rise on scroll; `prefers-reduced-motion` is honored globally.
 */
export function DashboardMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
      className="border-border bg-background/80 mt-16 overflow-hidden rounded-xl border shadow-md md:mt-20"
    >
      {/* Window chrome */}
      <div className="border-border bg-muted/40 flex items-center gap-2 border-b px-4 py-2.5">
        <span className="bg-muted-foreground/30 h-2.5 w-2.5 rounded-full" />
        <span className="bg-muted-foreground/20 h-2.5 w-2.5 rounded-full" />
        <span className="bg-muted-foreground/20 h-2.5 w-2.5 rounded-full" />
        <span className="text-muted-foreground ml-3 text-xs font-medium">
          app.acme.com/dashboard
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr]">
        {/* Sidebar */}
        <aside className="border-border bg-muted/20 hidden border-r p-3 md:block">
          <div className="mb-4 flex items-center gap-2 px-2 pt-1">
            <span className="bg-foreground text-background inline-flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold">
              A
            </span>
            <span className="text-foreground text-sm font-semibold">
              Acme SaaS
            </span>
          </div>
          <nav className="flex flex-col gap-1">
            {nav.map(({ icon: Icon, label, active }) => (
              <span
                key={label}
                className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] ${
                  active
                    ? "bg-accent text-foreground font-medium"
                    : "text-muted-foreground"
                }`}
              >
                <Icon className="size-3.5" aria-hidden />
                {label}
              </span>
            ))}
          </nav>
        </aside>

        {/* Main panel */}
        <div className="p-4 sm:p-6">
          {/* Header row + stat cards */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground text-sm font-semibold">Overview</p>
              <p className="text-muted-foreground text-xs">
                Here&apos;s what&apos;s happening today
              </p>
            </div>
            <span className="border-border bg-primary text-primary-foreground rounded-md border border-transparent px-3 py-1.5 text-xs font-medium shadow-sm">
              Export
            </span>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="border-border bg-card rounded-lg border p-3"
              >
                <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-wide">
                  {s.label}
                </p>
                <p className="text-foreground mt-1 text-lg font-semibold tracking-tight sm:text-xl">
                  {s.value}
                </p>
                <p
                  className={`mt-0.5 flex items-center gap-1 text-[11px] font-medium ${
                    s.up
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-destructive"
                  }`}
                >
                  <TrendingUp className="size-3" aria-hidden />
                  {s.delta}
                </p>
              </div>
            ))}
          </div>

          {/* Bar chart */}
          <div className="border-border bg-card mt-4 rounded-lg border p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-foreground text-sm font-semibold">Revenue</p>
              <span className="text-muted-foreground text-xs">
                Last 12 months
              </span>
            </div>
            <div className="flex h-28 items-end gap-1.5">
              {chart.map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${h}%` }}
                  className={`flex-1 rounded-sm ${
                    i === chart.length - 1 ? "bg-primary" : "bg-chart-3"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Activity list */}
          <div className="border-border bg-card mt-4 rounded-lg border p-4">
            <p className="text-foreground mb-3 flex items-center gap-2 text-sm font-semibold">
              <Activity className="size-4 text-muted-foreground" aria-hidden />
              Recent activity
            </p>
            <ul className="divide-border divide-y">
              {activity.map((a) => (
                <li
                  key={a.what}
                  className="flex items-center justify-between py-2 text-[13px]"
                >
                  <div>
                    <p className="text-foreground font-medium">{a.who}</p>
                    <p className="text-muted-foreground text-xs">{a.what}</p>
                  </div>
                  <span className="text-muted-foreground text-xs">
                    {a.when}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
