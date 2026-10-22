import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "../hooks/use-theme";

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative rounded-full"
    >
      {/* Sun icon (light mode) */}
      <SunIcon className="h-[1.2rem] w-[1.2rem] transition-all scale-100 rotate-0 dark:scale-0 dark:-rotate-90" />

      {/* Moon icon (dark mode) */}
      <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] transition-all scale-0 rotate-90 dark:scale-100 dark:rotate-0" />

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
