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
 * Predefined color schemes
 */
export const THEME_PRESETS: Record<string, ThemeConfig> = {
  amber: {
    name: "Amber (Default)",
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
  if (typeof window === "undefined") return THEME_PRESETS.amber;

  const savedTheme = localStorage.getItem("theme-preset");
  const preset = Object.values(THEME_PRESETS).find(t => t.name === savedTheme);

  return preset || THEME_PRESETS.amber;
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
