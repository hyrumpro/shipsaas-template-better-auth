const CURRENCY_FORMATTERS = new Map<string, Intl.NumberFormat>();

function getCurrencyFormatter(currency: string): Intl.NumberFormat {
  const key = currency.toLowerCase();
  const cached = CURRENCY_FORMATTERS.get(key);
  if (cached) return cached;
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  });
  CURRENCY_FORMATTERS.set(key, formatter);
  return formatter;
}

export function formatMoney(amountInCents: number, currency = "usd"): string {
  return getCurrencyFormatter(currency).format(amountInCents / 100);
}

export function formatMoneyCompact(amountInCents: number, currency = "usd"): string {
  const value = amountInCents / 100;
  if (value >= 1000) {
    return `${getCurrencyFormatter(currency)
      .format(value / 1000)
      .replace(/\.\d+/, "")}K`;
  }
  return getCurrencyFormatter(currency).format(value);
}

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const DATE_FORMATTER_SHORT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

const DATETIME_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "—";
  return DATE_FORMATTER.format(d);
}

export function formatDateShort(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "—";
  return DATE_FORMATTER_SHORT.format(d);
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "—";
  return DATETIME_FORMATTER.format(d);
}

export function formatRelativeTime(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "—";
  const now = Date.now();
  const diffMs = now - d.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);

  const rtf = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });
  if (Math.abs(diffSec) < 60) return rtf.format(-diffSec, "second");
  if (Math.abs(diffMin) < 60) return rtf.format(-diffMin, "minute");
  if (Math.abs(diffHour) < 24) return rtf.format(-diffHour, "hour");
  if (Math.abs(diffDay) < 30) return rtf.format(-diffDay, "day");
  return formatDate(d);
}

export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "incomplete"
  | "incomplete_expired"
  | "paused";

export type OrderStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded"
  | "canceled";

export type PaymentStatus = "succeeded" | "failed" | "pending" | "refunded";

export function subscriptionStatusLabel(status: SubscriptionStatus): string {
  switch (status) {
    case "active":
      return "Active";
    case "trialing":
      return "Trialing";
    case "past_due":
      return "Past due";
    case "canceled":
      return "Canceled";
    case "unpaid":
      return "Unpaid";
    case "incomplete":
      return "Incomplete";
    case "incomplete_expired":
      return "Expired";
    case "paused":
      return "Paused";
    default:
      return status;
  }
}

export function orderStatusLabel(status: OrderStatus): string {
  switch (status) {
    case "pending":
      return "Pending";
    case "paid":
      return "Paid";
    case "failed":
      return "Failed";
    case "refunded":
      return "Refunded";
    case "canceled":
      return "Canceled";
    default:
      return status;
  }
}

export function paymentStatusLabel(status: PaymentStatus | string): string {
  switch (status) {
    case "succeeded":
      return "Succeeded";
    case "paid":
      return "Paid";
    case "failed":
      return "Failed";
    case "pending":
      return "Pending";
    case "refunded":
      return "Refunded";
    default:
      return status;
  }
}

export function planIntervalLabel(
  interval: "month" | "year" | "week" | "day",
  intervalCount = 1
): string {
  const noun = intervalCount === 1 ? interval : `${interval}s`;
  if (intervalCount === 1) return `/ ${interval}`;
  return `/ ${intervalCount} ${noun}`;
}

export function initialsFromName(
  name: string | null | undefined,
  fallback = "?"
): string {
  if (!name) return fallback;
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return fallback;
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
