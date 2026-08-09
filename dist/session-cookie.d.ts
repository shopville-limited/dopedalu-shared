/**
 * Session z hlavičky/`document.cookie` — tedy z řetězce `a=1; b=2`.
 * Vrací `null`, když v cookies žádná čitelná session není.
 */
export declare function parseSessionCookieString(cookieString: string): Record<string, unknown> | null;
/**
 * Session z už rozparsovaných cookies — pro server, kde je má framework
 * v poli (Next `request.cookies.getAll()`).
 */
export declare function parseSessionCookies(cookies: readonly {
    name: string;
    value: string;
}[]): Record<string, unknown> | null;
/**
 * E-mail přihlášeného uživatele, nebo `null`. Předej `document.cookie`.
 *
 * Platnost tokenu se schválně NEŘEŠÍ — jde o popisek v hlavičce, ne o autorizaci.
 */
export declare function readSessionEmail(cookieString: string): string | null;
/**
 * `expires_at` access tokenu (unixové sekundy), nebo `null`.
 *
 * Pro middleware, který podle toho pozná, jestli má vůbec smysl sahat na
 * refresh — a nespouští ho tak na každém requestu.
 */
export declare function readSessionExpiry(cookies: readonly {
    name: string;
    value: string;
}[]): number | null;
//# sourceMappingURL=session-cookie.d.ts.map