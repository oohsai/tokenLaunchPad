import { PALETTES, useTheme } from "../hooks/use-theme";
import { cn } from "../lib/utils";

export function PaletteSwitcher() {
  const { palette, setPalette } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Colour palette"
      className="inline-flex items-center gap-1 rounded-full border bg-card/70 p-1 backdrop-blur"
    >
      {PALETTES.map((option) => {
        const active = option.id === palette;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setPalette(option.id)}
            className={cn(
              "flex h-8 items-center gap-2 rounded-full px-3 text-xs font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="flex -space-x-1">
              {option.swatches.map((color) => (
                <span
                  key={color}
                  className="size-3 rounded-full ring-1 ring-black/10"
                  style={{ backgroundColor: color }}
                />
              ))}
            </span>
            <span className="hidden sm:inline">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
