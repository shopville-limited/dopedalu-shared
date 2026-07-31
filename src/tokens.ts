// Design tokeny dopedalu.cz — jediný zdroj pravdy pro barvy značky napříč zónami.
//
// Historicky žily dvakrát: v Tailwind v3 presetu (blog/portál, packages/ui/
// tailwind-preset.ts) a jako CSS proměnné --brand-N ve v4 zónách (bazar/mapa/
// akce). Tady je kanonická sada hodnot; obě strany z ní derivují:
//   - v3 preset: `colors.brand = brandScale` (importuje BRAND_SCALE)
//   - v4 zóny:   codegen / ruční @theme --brand-N z BRAND_SCALE
//
// WCAG pozn.: brand-500 (#ff4d14) = 3,32:1 na bílé → PROJDE jen pro velký text
// (≥3:1). Pro normální accent TEXT používej ACCENT_TEXT (brand-700 = 5,68:1,
// splňuje AA). Vivid brand-500 patří na výplně (bg-brand: tlačítka, chipy).

/** Racing-orange primární accent. Klíče = Tailwind váhy. */
export const BRAND_SCALE = {
  50: "#fff3ed",
  100: "#ffe2d2",
  200: "#ffc0a5",
  300: "#ff966d",
  400: "#ff5f2e",
  500: "#ff4d14", // DEFAULT accent (vivid; jen výplně / velký text)
  600: "#f03405",
  700: "#c72507", // AA-safe accent text (5,68:1 na bílé)
  800: "#9e1f0e",
  900: "#7f1d0f",
} as const;

/** Výchozí odstín značky (= brand-500). */
export const BRAND_DEFAULT = BRAND_SCALE[500];

/**
 * AA-safe odstín pro accent TEXT (odkazy, aktivní nav, data). Kontrast 5,68:1
 * na bílé — splňuje WCAG AA pro normální text. Nepoužívej brand-500 pro text.
 */
export const ACCENT_TEXT = BRAND_SCALE[700];

/** Hi-vis lime — sekundární zvýraznění / glow (hlavně dark mode). */
export const HIVIS_SCALE = {
  400: "#d4ff2e",
  500: "#b6e600",
} as const;

export const HIVIS_DEFAULT = HIVIS_SCALE[400];

/** Ink — near-black povrchy pro dark mode. */
export const INK_SCALE = {
  600: "#2a2e38",
  700: "#1d2027",
  800: "#15171c",
  900: "#0b0c0f", // DEFAULT (nejtmavší povrch)
} as const;

export const INK_DEFAULT = INK_SCALE[900];

export type BrandWeight = keyof typeof BRAND_SCALE;
