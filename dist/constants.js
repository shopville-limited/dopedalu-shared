// Cross-zone konstanty dopedalu.cz — jediný zdroj pravdy pro cesty a doménu
// sdílené session. Zabraňuje driftu typu „kopie AccountChip míří na /bazar/ucet
// místo /ucet" (Freelo 31498739).
//
// Zóny jsou nasazené jako oddělené Vercel projekty za apex reverse-proxy:
//   apex (/)            → dopedalu-portal
//   /blog               → bike-blog
//   /bazar              → bike-bazar
//   /akce               → bike-akce
//   /mapa-cykloservisu  → databaze-servisu (mapa)
// Cross-zone odkazy proto MUSÍ být absolutní od kořene domény (plain <a href>,
// ne framework <Link>, aby se nepřidal basePath aktuální zóny).
/** Základní cesty jednotlivých zón (od kořene apex domény). */
export const ZONE_PATHS = {
    portal: "/",
    blog: "/blog",
    bazar: "/bazar",
    akce: "/akce",
    mapa: "/mapa-cykloservisu",
};
/** Neutrální apex rozcestník účtu (session-aware hub napříč zónami). */
export const ACCOUNT_HUB_URL = "/ucet";
/** Přihlašovací stránka (dnes žije v bazaru). */
export const LOGIN_URL = "/bazar/prihlaseni";
/**
 * Výchozí doména sdílené auth cookie. Cookie s `Domain=.dopedalu.cz` je čitelná
 * všemi zónami → jednotné přihlášení. Zóny čtou override z env
 * `NEXT_PUBLIC_COOKIE_DOMAIN`; tohle je fallback pro produkci.
 */
export const DEFAULT_COOKIE_DOMAIN = ".dopedalu.cz";
/** Env klíč, ze kterého zóny čtou doménu cookie (klient-side, proto NEXT_PUBLIC_). */
export const COOKIE_DOMAIN_ENV_KEY = "NEXT_PUBLIC_COOKIE_DOMAIN";
