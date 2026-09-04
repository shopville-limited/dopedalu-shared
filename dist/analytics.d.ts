/** Produkční kontejner. Zóny ho přebíjejí přes env, prázdná hodnota loader vypne. */
export declare const DEFAULT_GTM_ID = "GTM-5HWNN2LP";
/** Událost, kterou lišta vystřelí po uložení volby. Nese `ConsentLevel` v `detail`. */
export declare const CONSENT_CHANGE_EVENT = "cookie-consent-change";
/** Inline skript, který natáhne GTM. Vkládá se AŽ po souhlasu. */
export declare function gtmSnippet(containerId: string): string;
type Uloziste = Pick<Storage, "getItem">;
type Cil = Pick<EventTarget, "addEventListener" | "removeEventListener">;
export type OnAnalyticsConsentOptions = {
    /** Kde je uložená volba. Výchozí `localStorage`, `null` = nedostupné (SSR). */
    storage?: Uloziste | null;
    /** Kdo vysílá změnu volby. Výchozí `window`. */
    target?: Cil | null;
};
/**
 * Zavolá `handler`, jakmile návštěvník povolí aspoň statistiky — hned, pokud
 * už volil dřív, jinak po volbě z lišty. Zavolá ho **nejvýš jednou**; dvojí
 * vložení GTM by zdvojilo každý zásah.
 *
 * Vrací odhlášení (pro `useEffect` cleanup).
 */
export declare function onAnalyticsConsent(handler: () => void, options?: OnAnalyticsConsentOptions): () => void;
/**
 * Vloží GTM do hlavičky. Pro zóny bez `next/script` (Vite). Idempotentní —
 * druhé volání nic neudělá a vrátí `false`.
 */
export declare function injectGtm(containerId: string, doc?: Document): boolean;
export {};
//# sourceMappingURL=analytics.d.ts.map