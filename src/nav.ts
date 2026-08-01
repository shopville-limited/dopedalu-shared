// Jednotná platformní navigace dopedalu.cz (Freelo 31504193 — sjednotit head menu).
//
// JEDINÝ zdroj pravdy pro sekce hlavičky: stejné názvy, stejné pořadí a stejné
// ikony napříč všemi zónami. Data jsou framework-agnostická (žádný React, žádný
// Tailwind) → sdílená v balíčku; každá zóna je vykreslí VLASTNÍMI třídami (v3/v4).
//
// Pořadí je závazné: Blog › Cyklobazar › Servisy › Akce › Bikeparky › Účet.
//
// Ikony jsou pole SVG `path` d-stringů pro viewBox "0 0 24 24", kreslené jako
// outline (fill none, stroke currentColor, strokeWidth 2, linecap/join round).
// Zóna je zabalí do svého <svg> s vlastní velikostí/barvou → identické všude.

export interface PlatformNavItem {
  /** Stabilní klíč sekce; zóna jím pozná „svou" aktivní položku. */
  key: "blog" | "bazar" | "servisy" | "akce" | "bikeparky" | "ucet";
  /** Zobrazený název (jednotný napříč zónami). */
  label: string;
  /** Cesta od kořene apex domény (cross-zone → plain <a>, ne framework <Link>). */
  path: string;
  /** SVG path d-stringy ikony (viewBox 0 0 24 24, outline). */
  icon: string[];
  /**
   * `account` = položka je session-aware (Přihlásit / Účet), zóna ji vykreslí
   * svým účtovým prvkem místo prostého odkazu.
   */
  account?: true;
}

/** Ikona: kniha (blog / čtení). */
const ICON_BLOG = [
  "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z",
  "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
];
/** Ikona: cenovka (bazar / prodej). */
const ICON_BAZAR = [
  "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z",
  "M7 7h.01",
];
/** Ikona: klíč (servisy / oprava). */
const ICON_SERVISY = [
  "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
];
/** Ikona: kalendář (akce). */
const ICON_AKCE = [
  "M8 2v4",
  "M16 2v4",
  "M3 10h18",
  "M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
];
/** Ikona: hora (bikeparky / traily / singletreky). */
const ICON_BIKEPARKY = ["m8 3 4 8 5-5 5 15H2L8 3z"];
/** Ikona: uživatel (účet). */
const ICON_UCET = [
  "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  "M6 21v-1a6 6 0 0 1 12 0v1",
];

/** Závazné pořadí + názvy + cesty + ikony sekcí hlavičky. */
export const PLATFORM_NAV: readonly PlatformNavItem[] = [
  { key: "blog", label: "Blog", path: "/blog", icon: ICON_BLOG },
  { key: "bazar", label: "Cyklobazar", path: "/bazar", icon: ICON_BAZAR },
  { key: "servisy", label: "Servisy", path: "/mapa-cykloservisu", icon: ICON_SERVISY },
  { key: "akce", label: "Akce", path: "/akce", icon: ICON_AKCE },
  { key: "bikeparky", label: "Bikeparky", path: "/bikeparky", icon: ICON_BIKEPARKY },
  { key: "ucet", label: "Účet", path: "/ucet", icon: ICON_UCET, account: true },
];

export type PlatformNavKey = PlatformNavItem["key"];
