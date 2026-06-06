/**
 * Theme Configuration
 *
 * Easily customize your app's colors by modifying the values below.
 * All components automatically adapt to these theme settings.
 *
 * Color format: HSL (Hue, Saturation, Lightness)
 * Example: { h: 220, s: 100, l: 55 } = hsl(220 100% 55%)
 */

export type ThemeColor = {
  h: number; // Hue: 0-360
  s: number; // Saturation: 0-100
  l: number; // Lightness: 0-100
};

export type ThemeConfig = {
  name: string;
  primary: ThemeColor;
  accent: ThemeColor;
};

/**
 * Predefined color schemes.
 *
 * Default is now `slate` (modern-minimal, Stripe/Linear school).
 * The 24-theme catalog is preserved for users who want a louder brand.
 */
export const THEME_PRESETS: Record<string, ThemeConfig> = {
  slate: {
    name: "Slate (Default)",
    primary: { h: 222, s: 47, l: 11 },
    accent: { h: 215, s: 16, l: 47 },
  },
  amber: {
    name: "Amber",
    primary: { h: 35, s: 100, l: 55 },
    accent: { h: 25, s: 100, l: 50 },
  },
  blue: {
    name: "Ocean Blue",
    primary: { h: 220, s: 100, l: 55 },
    accent: { h: 200, s: 100, l: 50 },
  },
  purple: {
    name: "Royal Purple",
    primary: { h: 270, s: 100, l: 60 },
    accent: { h: 280, s: 100, l: 65 },
  },
  green: {
    name: "Emerald Green",
    primary: { h: 142, s: 76, l: 36 },
    accent: { h: 150, s: 80, l: 40 },
  },
  red: {
    name: "Ruby Red",
    primary: { h: 0, s: 84, l: 60 },
    accent: { h: 10, s: 90, l: 55 },
  },
  cyan: {
    name: "Cyan Blue",
    primary: { h: 190, s: 95, l: 50 },
    accent: { h: 180, s: 100, l: 45 },
  },
  pink: {
    name: "Hot Pink",
    primary: { h: 330, s: 100, l: 60 },
    accent: { h: 340, s: 100, l: 65 },
  },
  orange: {
    name: "Sunset Orange",
    primary: { h: 25, s: 100, l: 50 },
    accent: { h: 15, s: 100, l: 45 },
  },
  teal: {
    name: "Deep Teal",
    primary: { h: 175, s: 80, l: 35 },
    accent: { h: 185, s: 75, l: 45 },
  },
  indigo: {
    name: "Cosmic Indigo",
    primary: { h: 240, s: 80, l: 55 },
    accent: { h: 250, s: 75, l: 60 },
  },
  violet: {
    name: "Electric Violet",
    primary: { h: 290, s: 85, l: 55 },
    accent: { h: 305, s: 90, l: 60 },
  },
  lime: {
    name: "Electric Lime",
    primary: { h: 84, s: 80, l: 45 },
    accent: { h: 95, s: 85, l: 50 },
  },
  yellow: {
    name: "Sunshine Yellow",
    primary: { h: 50, s: 95, l: 50 },
    accent: { h: 40, s: 100, l: 45 },
  },
  coral: {
    name: "Coral Reef",
    primary: { h: 15, s: 85, l: 60 },
    accent: { h: 5, s: 90, l: 55 },
  },
  fuchsia: {
    name: "Fuchsia Burst",
    primary: { h: 320, s: 90, l: 55 },
    accent: { h: 310, s: 95, l: 60 },
  },
  emerald: {
    name: "Forest Emerald",
    primary: { h: 160, s: 70, l: 35 },
    accent: { h: 170, s: 65, l: 40 },
  },
  sapphire: {
    name: "Sapphire",
    primary: { h: 215, s: 90, l: 50 },
    accent: { h: 205, s: 95, l: 55 },
  },
  rose: {
    name: "Dusty Rose",
    primary: { h: 340, s: 70, l: 55 },
    accent: { h: 350, s: 65, l: 60 },
  },
  mint: {
    name: "Fresh Mint",
    primary: { h: 155, s: 60, l: 45 },
    accent: { h: 165, s: 70, l: 50 },
  },
  lavender: {
    name: "Soft Lavender",
    primary: { h: 260, s: 55, l: 65 },
    accent: { h: 250, s: 60, l: 70 },
  },
  chocolate: {
    name: "Dark Chocolate",
    primary: { h: 25, s: 60, l: 30 },
    accent: { h: 20, s: 70, l: 40 },
  },
  neon: {
    name: "Neon Green",
    primary: { h: 130, s: 100, l: 50 },
    accent: { h: 165, s: 100, l: 45 },
  },
};

/**
 * Convert ThemeColor to HSL string
 */
export function colorToHSL(color: ThemeColor): string {
  return `${color.h} ${color.s}% ${color.l}%`;
}

/**
 * Apply theme to document
 */
export function applyTheme(theme: ThemeConfig): void {
  const root = document.documentElement;

  // Update primary color
  root.style.setProperty("--primary", colorToHSL(theme.primary));
  root.style.setProperty("--accent", colorToHSL(theme.accent));
  root.style.setProperty("--ring", colorToHSL(theme.primary));

  // Update gradient
  const gradientPrimary = `linear-gradient(135deg, hsl(${colorToHSL(theme.primary)}) 0%, hsl(${colorToHSL(theme.accent)}) 100%)`;
  root.style.setProperty("--gradient-primary", gradientPrimary);

  // Update glow shadow
  const shadowGlow = `0 0 60px hsl(${colorToHSL(theme.primary)} / 0.3)`;
  root.style.setProperty("--shadow-glow", shadowGlow);

  // Store theme preference
  localStorage.setItem("theme-preset", theme.name);
}

/**
 * Get saved theme or default
 */
export function getSavedTheme(): ThemeConfig {
  if (typeof window === "undefined") return THEME_PRESETS.slate;

  const savedTheme = localStorage.getItem("theme-preset");
  const preset = Object.values(THEME_PRESETS).find(t => t.name === savedTheme);

  return preset || THEME_PRESETS.slate;
}

/**
 * HOW TO CHANGE THE THEME:
 *
 * Option 1: Use a preset
 * ```typescript
 * import { applyTheme, THEME_PRESETS } from '@/config/theme';
 * applyTheme(THEME_PRESETS.blue);
 * ```
 *
 * Option 2: Create custom theme
 * ```typescript
 * import { applyTheme } from '@/config/theme';
 * applyTheme({
 *   name: "My Custom Theme",
 *   primary: { h: 280, s: 100, l: 60 },
 *   accent: { h: 290, s: 100, l: 65 },
 * });
 * ```
 *
 * Option 3: Modify CSS variables directly in globals.css
 * Change the values in :root block:
 * --primary: 35 100% 55%;
 */
