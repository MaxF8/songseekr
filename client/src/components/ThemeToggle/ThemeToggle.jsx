import { Moon, Sun } from "lucide-react";

import { useTheme } from "../../hooks/useTheme";
import { Button } from "../ui/button";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === "dark" ? "light" : "dark";
  const label = `Switch to ${nextTheme} mode`;

  return (
    <Button
      className={`theme-toggle ${className}`.trim()}
      variant="ghost"
      size="icon"
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
    >
      {theme === "dark" ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </Button>
  );
}
