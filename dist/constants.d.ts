/** Základní cesty jednotlivých zón (od kořene apex domény). */
export declare const ZONE_PATHS: {
    readonly portal: "/";
    readonly blog: "/blog";
    readonly bazar: "/bazar";
    readonly akce: "/akce";
    readonly mapa: "/mapa-cykloservisu";
};
export type ZoneKey = keyof typeof ZONE_PATHS;
/** Neutrální apex rozcestník účtu (session-aware hub napříč zónami). */
export declare const ACCOUNT_HUB_URL = "/ucet";
/** Přihlašovací stránka (dnes žije v bazaru). */
export declare const LOGIN_URL = "/bazar/prihlaseni";
/**
 * Výchozí doména sdílené auth cookie. Cookie s `Domain=.dopedalu.cz` je čitelná
 * všemi zónami → jednotné přihlášení. Zóny čtou override z env
 * `NEXT_PUBLIC_COOKIE_DOMAIN`; tohle je fallback pro produkci.
 */
export declare const DEFAULT_COOKIE_DOMAIN = ".dopedalu.cz";
/** Env klíč, ze kterého zóny čtou doménu cookie (klient-side, proto NEXT_PUBLIC_). */
export declare const COOKIE_DOMAIN_ENV_KEY = "NEXT_PUBLIC_COOKIE_DOMAIN";
//# sourceMappingURL=constants.d.ts.map