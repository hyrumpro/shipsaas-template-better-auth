import { cn } from "@/lib/utils";

/**
 * ShipSaaS wordmark. Square glyph + sans wordmark, hairline border,
 * no gradient. Used in nav and footer for consistency.
 */
export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <span
      className={cn(
        "text-foreground inline-flex items-center gap-2 font-semibold tracking-tight",
        className
      )}
    >
      <span
        aria-hidden
        className="border-foreground/20 bg-foreground text-background inline-flex h-6 w-6 items-center justify-center rounded border"
      >
        <svg
          viewBox="0 0 12 12"
          className="h-3 w-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 2.5 6 9.5 9 2.5" />
        </svg>
      </span>
      {showWordmark && <span className="text-base">ShipSaaS</span>}
    </span>
  );
}
