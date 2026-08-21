/** Co návštěvník povolil. Ukládá se doslovně do localStorage (kromě legacy hodnoty). */
export type ConsentLevel = "denied" | "analytics" | "all";
/** Sdílený localStorage klíč s volbou návštěvníka — společný pro všechny zóny. */
export declare const CONSENT_STORAGE_KEY = "cookie-consent";
/**
 * Normalizuje uloženou hodnotu na úroveň, nebo null, když návštěvník ještě
 * nevolil. Legacy "granted" se čte jako jen-analytika.
 */
export declare function parseConsent(value: string | null): ConsentLevel | null;
/**
 * True, když uložená volba předchází dotazu na reklamu a lišta se musí zeptat
 * znovu. Legacy analytický souhlas mezitím zůstává v platnosti.
 */
export declare function needsAdsDecision(value: string | null): boolean;
/** True, když úroveň povoluje analytiku (GA4, Ecomail tracker…). */
export declare function analyticsAllowed(level: ConsentLevel | null): boolean;
/** True, když úroveň povoluje reklamní storage (konverze Google Ads). */
export declare function adsAllowed(level: ConsentLevel | null): boolean;
export type ConsentSignals = {
    analytics_storage: "granted" | "denied";
    ad_storage: "granted" | "denied";
    ad_user_data: "granted" | "denied";
    ad_personalization: "granted" | "denied";
};
/** Payload Google Consent Mode v2 pro úroveň (pro default i update). */
export declare function consentSignals(level: ConsentLevel): ConsentSignals;
/**
 * Inline skript do <head>, který nastaví Consent Mode v2 *default* z uložené
 * volby. Musí běžet PŘED GTM/GA, aby žádný Google tag nevystřelil dřív, než
 * je jasná volba návštěvníka.
 *
 * POZOR: skript musí zůstat JEDEN statický string literál. Skládání z template
 * literálů s interpolací (`…${KONST}…` + `…`) rozbíjí SWC constant-folding
 * v Next 15.5 (konzumenti mají `transpilePackages`) — v produkci pak vyjde
 * syntakticky vadný skript a default vůbec neběží (bike-mapa-servisu#90).
 * Klíč 'cookie-consent' hlídá unit test.
 */
export declare function consentDefaultScript(): string;
//# sourceMappingURL=consent.d.ts.map