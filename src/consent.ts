// Cookie-consent primitiva sdílená všemi zónami dopedalu.cz (portál, blog,
// bazar, mapa) — všechny používají STEJNÝ localStorage klíč, takže se návštěvník
// rozhoduje jen jednou. Kanonický zdroj (Freelo 31972581) — nahrazuje dřívější
// tři ruční kopie (@blog/shared, bike-bazar/lib/consent.ts,
// bike-mapa-servisu/src/lib/consent.ts).
//
// Lišta se ptá na dva účely:
//   * analytics — Google Analytics 4 (statistika),
//   * advertising — měření konverzí Google Ads (`ad_storage` + `ad_user_data`;
//     bez nich Ads konverze jen modeluje a rozšířené konverze nefungují).
//
// Zpětná kompatibilita: starší analytická lišta ukládala hodnotu "granted"
// (jen analytika). Čteme ji jako souhlas s analytikou, ale `needsAdsDecision`
// ji hlásí jako zastaralou, takže se lišta jednou znovu zobrazí a návštěvník
// rozhodne o reklamě. Starý souhlas se NIKDY tiše nepovyšuje.

/** Co návštěvník povolil. Ukládá se doslovně do localStorage (kromě legacy hodnoty). */
export type ConsentLevel = "denied" | "analytics" | "all";

/** Sdílený localStorage klíč s volbou návštěvníka — společný pro všechny zóny. */
export const CONSENT_STORAGE_KEY = "cookie-consent";

/** Hodnota zapisovaná analytickou lištou z doby před dotazem na reklamu. */
const LEGACY_ANALYTICS_ONLY = "granted";

/**
 * Normalizuje uloženou hodnotu na úroveň, nebo null, když návštěvník ještě
 * nevolil. Legacy "granted" se čte jako jen-analytika.
 */
export function parseConsent(value: string | null): ConsentLevel | null {
  if (value === LEGACY_ANALYTICS_ONLY) return "analytics";
  return value === "denied" || value === "analytics" || value === "all" ? value : null;
}

/**
 * True, když uložená volba předchází dotazu na reklamu a lišta se musí zeptat
 * znovu. Legacy analytický souhlas mezitím zůstává v platnosti.
 */
export function needsAdsDecision(value: string | null): boolean {
  return value === LEGACY_ANALYTICS_ONLY;
}

/** True, když úroveň povoluje analytiku (GA4, Ecomail tracker…). */
export function analyticsAllowed(level: ConsentLevel | null): boolean {
  return level === "analytics" || level === "all";
}

/** True, když úroveň povoluje reklamní storage (konverze Google Ads). */
export function adsAllowed(level: ConsentLevel | null): boolean {
  return level === "all";
}

export type ConsentSignals = {
  analytics_storage: "granted" | "denied";
  ad_storage: "granted" | "denied";
  ad_user_data: "granted" | "denied";
  ad_personalization: "granted" | "denied";
};

/** Payload Google Consent Mode v2 pro úroveň (pro default i update). */
export function consentSignals(level: ConsentLevel): ConsentSignals {
  const analytics = analyticsAllowed(level) ? "granted" : "denied";
  const ads = adsAllowed(level) ? "granted" : "denied";
  return {
    analytics_storage: analytics,
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
  };
}

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
export function consentDefaultScript(): string {
  return "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());var __a='denied',__ad='denied';try{var v=localStorage.getItem('cookie-consent');if(v==='granted'||v==='analytics'||v==='all'){__a='granted';}if(v==='all'){__ad='granted';}}catch(e){}gtag('consent','default',{ad_storage:__ad,ad_user_data:__ad,ad_personalization:__ad,analytics_storage:__a,wait_for_update:500});";
}
