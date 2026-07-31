/** Racing-orange primární accent. Klíče = Tailwind váhy. */
export declare const BRAND_SCALE: {
    readonly 50: "#fff3ed";
    readonly 100: "#ffe2d2";
    readonly 200: "#ffc0a5";
    readonly 300: "#ff966d";
    readonly 400: "#ff5f2e";
    readonly 500: "#ff4d14";
    readonly 600: "#f03405";
    readonly 700: "#c72507";
    readonly 800: "#9e1f0e";
    readonly 900: "#7f1d0f";
};
/** Výchozí odstín značky (= brand-500). */
export declare const BRAND_DEFAULT: "#ff4d14";
/**
 * AA-safe odstín pro accent TEXT (odkazy, aktivní nav, data). Kontrast 5,68:1
 * na bílé — splňuje WCAG AA pro normální text. Nepoužívej brand-500 pro text.
 */
export declare const ACCENT_TEXT: "#c72507";
/** Hi-vis lime — sekundární zvýraznění / glow (hlavně dark mode). */
export declare const HIVIS_SCALE: {
    readonly 400: "#d4ff2e";
    readonly 500: "#b6e600";
};
export declare const HIVIS_DEFAULT: "#d4ff2e";
/** Ink — near-black povrchy pro dark mode. */
export declare const INK_SCALE: {
    readonly 600: "#2a2e38";
    readonly 700: "#1d2027";
    readonly 800: "#15171c";
    readonly 900: "#0b0c0f";
};
export declare const INK_DEFAULT: "#0b0c0f";
export type BrandWeight = keyof typeof BRAND_SCALE;
//# sourceMappingURL=tokens.d.ts.map