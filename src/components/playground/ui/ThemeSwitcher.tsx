"use client";

import { useState } from "react";
import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { applyTheme, THEME_PRESETS, getSavedTheme, type ThemeConfig } from "@/config/theme";

export function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig | null>(() => getSavedTheme());

  const handleThemeChange = (theme: ThemeConfig) => {
    applyTheme(theme);
    setCurrentTheme(theme);
  };

  if (!currentTheme) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          aria-label={`Theme: ${currentTheme.name}. Click to change theme`}
        >
          <Palette className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Choose Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Object.values(THEME_PRESETS).map((theme) => (
          <DropdownMenuItem
            key={theme.name}
            onClick={() => handleThemeChange(theme)}
            className="cursor-pointer"
            aria-label={`Switch to ${theme.name} theme`}
          >
            <div className="flex items-center gap-3 w-full">
              <div
                className="w-4 h-4 rounded-full"
                style={{
                  background: `hsl(${theme.primary.h} ${theme.primary.s}% ${theme.primary.l}%)`,
                }}
              />
              <span className="flex-1">{theme.name}</span>
              {currentTheme.name === theme.name && (
                <span className="text-xs text-primary">✓</span>
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
