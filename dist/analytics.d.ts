import { type ConsentLevel } from "./consent.js";
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
export type PathScopeOptions = {
    /** Segment, pod kterým zóna běží (`akce`, `bikeparky`). Cesta ho mít nemusí. */
    zone?: string;
    /** První segmenty, pod kterými se neměří — typicky administrace. */
    excluded?: readonly string[];
};
/**
 * True, když se na téhle cestě má měřit.
 *
 * Administrace zón jsou interní nástroje redakce. Kdyby se měřily, ředily by
 * čísla v GA4 a mísily chování redakce s chováním návštěvníků — u zón s desítkami
 * návštěv denně by to bylo znát okamžitě.
 *
 * Přijímá cestu s prefixem zóny i bez něj. Routery (`usePathname`, `useLocation`)
 * vracejí cestu bez basePath/basename, ale spoléhat se na to jako na jedinou
 * pojistku u *vypnutí* měření je zbytečné riziko.
 */
export declare function trackingAllowedOnPath(pathname: string | null, options?: PathScopeOptions): boolean;
/** Produkční projekt Clarity (veřejné ID). Zóny ho přebíjejí přes env, prázdná hodnota loader vypne. */
export declare const DEFAULT_CLARITY_ID = "ywkdkpqvm2";
/**
 * Inline skript, který natáhne Clarity a předá mu souhlas. Vkládá se AŽ po souhlasu.
 * `adStorage` = návštěvník povolil i reklamní cookies (úroveň `all`).
 */
export declare function claritySnippet(projectId: string, adStorage?: boolean): string;
/** Aktuální úroveň souhlasu z úložiště (pro rozhodnutí o reklamním úložišti Clarity). */
export declare function storedConsentLevel(storage?: Uloziste | null): ConsentLevel | null;
/**
 * Vloží Clarity do hlavičky (Vite zóny i Next přes `useEffect`). Idempotentní —
 * druhé volání nic neudělá a vrátí `false`.
 */
export declare function injectClarity(projectId: string, adStorage?: boolean, doc?: Document): boolean;
export {};
//# sourceMappingURL=analytics.d.ts.map