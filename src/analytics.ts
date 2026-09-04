// Consent-gated loader Google Tag Manageru — KANONICKÝ ZDROJ pro všechny zóny.
//
// PROČ TENHLE MODUL VZNIKL. Loader byl opsaný ve čtyřech aplikacích a ty čtyři
// kopie se rozešly v tom nejhorším místě — v tom, jestli vůbec čekají na
// souhlas:
//
//   blog, portál   čekaly na souhlas   ✓
//   bazar, servisy načítaly GTM vždy   ✗
//
// Bazar a servisy zůstaly na starším přístupu „stačí Consent Mode default
// v <head>". Ten se ale měřením vyvrátil (Freelo 31969656): kontejner
// GTM-5HWNN2LP zapisoval `_gcl_au` (Conversion Linker) i při plně denied
// stavu — ověřeno hookem na `document.cookie`, zapisoval přímo gtm.js. Lišta
// přitom slibuje „Bez souhlasu neměříme nic". Consent Mode default je proto
// nutný, ale NESTAČÍ: GTM nesmí do stránky vůbec, dokud návštěvník nepovolí
// aspoň statistiky.
//
// Tenhle modul je framework-agnostický schválně — balíček konzumuje Next
// i Vite a nemá React mezi závislostmi. Zóny si nad ním postaví svých patnáct
// řádků: Next přes <Script>, Vite přes `injectGtm`.

import { CONSENT_STORAGE_KEY, analyticsAllowed, parseConsent, type ConsentLevel } from "./consent.js";

/** Produkční kontejner. Zóny ho přebíjejí přes env, prázdná hodnota loader vypne. */
export const DEFAULT_GTM_ID = "GTM-5HWNN2LP";

/** Událost, kterou lišta vystřelí po uložení volby. Nese `ConsentLevel` v `detail`. */
export const CONSENT_CHANGE_EVENT = "cookie-consent-change";

/** Id vloženého <script>, aby šlo poznat, že GTM už ve stránce je. */
const GTM_SCRIPT_ID = "gtm-loader";

// JEDEN statický literál se zástupným symbolem — ID se doplňuje `replace`.
//
// POZOR, tohle není zbytečná opatrnost: skládání inline skriptů z template
// literálů s interpolací rozbíjí SWC constant-folding v Next 15.5 (konzumenti
// mají `transpilePackages`) a v produkci pak vyjde syntakticky vadný skript.
// Stálo to jeden výpadek měření (bike-mapa-servisu#90). Stejný důvod má
// `consentDefaultScript()` v consent.ts.
const GTM_SNIPPET =
  "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});" +
  "var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;" +
  "j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})" +
  "(window,document,'script','dataLayer','__GTM_ID__');";

/** Inline skript, který natáhne GTM. Vkládá se AŽ po souhlasu. */
export function gtmSnippet(containerId: string): string {
  return GTM_SNIPPET.replace("__GTM_ID__", containerId);
}

// ZÁMĚRNĚ TU NENÍ POMOCNÍK PRO <noscript> IFRAME.
//
// Ten iframe natáhne kontejner bez ohledu na souhlas — a návštěvník s vypnutým
// JavaScriptem se nemá jak zeptat, protože lišta je taky JS. Byl by to přesně
// ten únik, kvůli kterému tenhle modul vznikl. Blog ho při přechodu na
// consent-gating zahodil; bazar a servisy si ho nesly dál.
//
// Kdyby ho někdy bylo potřeba (třeba pro kontejner bez měřicích tagů), musí
// být podmíněný souhlasem serverovou cestou, ne tímhle modulem.

type Uloziste = Pick<Storage, "getItem">;
type Cil = Pick<EventTarget, "addEventListener" | "removeEventListener">;

export type OnAnalyticsConsentOptions = {
  /** Kde je uložená volba. Výchozí `localStorage`, `null` = nedostupné (SSR). */
  storage?: Uloziste | null;
  /** Kdo vysílá změnu volby. Výchozí `window`. */
  target?: Cil | null;
};

function vychoziUloziste(): Uloziste | null {
  try {
    return typeof localStorage === "undefined" ? null : localStorage;
  } catch {
    // Privátní režim a zablokované cookies hází už při sáhnutí na `localStorage`.
    return null;
  }
}

function ulozenaUroven(storage: Uloziste | null): ConsentLevel | null {
  if (!storage) return null;
  try {
    return parseConsent(storage.getItem(CONSENT_STORAGE_KEY));
  } catch {
    return null;
  }
}

/**
 * Zavolá `handler`, jakmile návštěvník povolí aspoň statistiky — hned, pokud
 * už volil dřív, jinak po volbě z lišty. Zavolá ho **nejvýš jednou**; dvojí
 * vložení GTM by zdvojilo každý zásah.
 *
 * Vrací odhlášení (pro `useEffect` cleanup).
 */
export function onAnalyticsConsent(
  handler: () => void,
  options: OnAnalyticsConsentOptions = {},
): () => void {
  const storage = options.storage === undefined ? vychoziUloziste() : options.storage;
  const target =
    options.target === undefined ? (typeof window === "undefined" ? null : window) : options.target;

  let hotovo = false;
  const spustit = () => {
    if (hotovo) return;
    hotovo = true;
    handler();
  };

  if (analyticsAllowed(ulozenaUroven(storage))) {
    spustit();
    return () => {};
  }
  if (!target) return () => {};

  const naZmenu = (e: Event) => {
    // Lišta posílá úroveň v `detail`. Když ji nepošle, pravdou je úložiště.
    const zDetailu = (e as CustomEvent<ConsentLevel | undefined>).detail;
    const uroven = zDetailu ?? ulozenaUroven(storage);
    if (!analyticsAllowed(uroven ?? null)) return;
    spustit();
    target.removeEventListener(CONSENT_CHANGE_EVENT, naZmenu);
  };

  target.addEventListener(CONSENT_CHANGE_EVENT, naZmenu);
  return () => target.removeEventListener(CONSENT_CHANGE_EVENT, naZmenu);
}

/**
 * Vloží GTM do hlavičky. Pro zóny bez `next/script` (Vite). Idempotentní —
 * druhé volání nic neudělá a vrátí `false`.
 */
export function injectGtm(containerId: string, doc: Document = globalThis.document): boolean {
  if (!containerId || !doc) return false;
  if (doc.querySelector("#" + GTM_SCRIPT_ID)) return false;

  const script = doc.createElement("script");
  script.id = GTM_SCRIPT_ID;
  script.innerHTML = gtmSnippet(containerId);
  doc.head.appendChild(script);
  return true;
}
