// Čtení sdílené Supabase session cookie BEZ klienta.
//
// Proč to existuje: session je na dopedalu.cz sdílená napříč zónami přes cookie
// s `Domain=.dopedalu.cz`. Zóny, které stav přihlášení jenom ZOBRAZUJÍ (chip
// „Můj účet" v hlavičce, apex hub /ucet), na to dřív volaly `getSession()` —
// jenže ten vypršelou session sám obnoví. Každá zóna a každý otevřený tab tak
// byl další klient prající se o týž ROTUJÍCÍ refresh token.
//
// Supabase má u projektu zapnuté „Detect and revoke potentially compromised
// refresh tokens": použití už zrotovaného tokenu po uplynutí reuse intervalu
// (10 s) se vyhodnotí jako replay a zneplatní se CELÁ RODINA tokenů — uživatel
// vypadne úplně všude. Ověřeno na produkci 9. 8. 2026: `dopedalu.cz/ucet` se bez
// jediného kliknutí překlopil z „Přihlášen jako…" na „Nejsi přihlášen(a)" během
// šesti vteřin.
//
// Pravidlo, které z toho plyne: session obnovuje JEDINÁ zóna (bazar). Ostatní ji
// jen čtou těmito funkcemi a mají `autoRefreshToken: false`.
//
// Formát píše @supabase/ssr: `sb-<ref>-auth-token` = `base64-` + base64url JSONu
// se session; delší session se seká do `…auth-token.0`, `.1`, …
//
// Podpis tokenu se tu ZÁMĚRNĚ neověřuje: podle těchto hodnot se nikomu nic
// nepovoluje, jen se vykresluje popisek nebo se rozhoduje „zkusit refresh, ne".
// Autoritou zůstává Supabase a serverové guardy.

/** Jen chunky vlastní session — `…-code-verifier` je jiná cookie a JSON nenese. */
const SESSION_COOKIE_RE = /^sb-.+-auth-token(?:\.(\d+))?$/;

function decodeBase64Url(value: string): string {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded.padEnd(Math.ceil(padded.length / 4) * 4, "="));
  const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
  // TextDecoder, ne atob samotný — v session bývá jméno s diakritikou (UTF-8).
  return new TextDecoder().decode(bytes);
}

/** Uložená session, nebo `null`. Rozbitá cookie = `null`, nikdy výjimka. */
function parseSession(chunks: { index: number; value: string }[]): Record<string, unknown> | null {
  if (chunks.length === 0) return null;

  // Číselně, ne abecedně: `.10` patří za `.9`, ne mezi `.1` a `.2`.
  chunks.sort((a, b) => a.index - b.index);
  const raw = chunks.map((c) => c.value).join("");

  try {
    const json = raw.startsWith("base64-") ? decodeBase64Url(raw.slice(7)) : decodeURIComponent(raw);
    const parsed: unknown = JSON.parse(json);
    return typeof parsed === "object" && parsed !== null ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/**
 * Session z hlavičky/`document.cookie` — tedy z řetězce `a=1; b=2`.
 * Vrací `null`, když v cookies žádná čitelná session není.
 */
export function parseSessionCookieString(cookieString: string): Record<string, unknown> | null {
  const chunks: { index: number; value: string }[] = [];

  for (const part of cookieString.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    const name = part.slice(0, eq).trim();
    const match = SESSION_COOKIE_RE.exec(name);
    if (!match) continue;
    // Nesekaná cookie nemá index; ať se seřadí první.
    chunks.push({
      index: match[1] === undefined ? -1 : Number(match[1]),
      value: part.slice(eq + 1).trim(),
    });
  }

  return parseSession(chunks);
}

/**
 * Session z už rozparsovaných cookies — pro server, kde je má framework
 * v poli (Next `request.cookies.getAll()`).
 */
export function parseSessionCookies(
  cookies: readonly { name: string; value: string }[],
): Record<string, unknown> | null {
  const chunks: { index: number; value: string }[] = [];

  for (const { name, value } of cookies) {
    const match = SESSION_COOKIE_RE.exec(name);
    if (!match) continue;
    chunks.push({ index: match[1] === undefined ? -1 : Number(match[1]), value });
  }

  return parseSession(chunks);
}

/**
 * E-mail přihlášeného uživatele, nebo `null`. Předej `document.cookie`.
 *
 * Platnost tokenu se schválně NEŘEŠÍ — jde o popisek v hlavičce, ne o autorizaci.
 */
export function readSessionEmail(cookieString: string): string | null {
  const session = parseSessionCookieString(cookieString);
  const user = session?.user as { email?: unknown } | undefined;
  const email = user?.email;
  return typeof email === "string" && email.length > 0 ? email : null;
}

/**
 * `expires_at` access tokenu (unixové sekundy), nebo `null`.
 *
 * Pro middleware, který podle toho pozná, jestli má vůbec smysl sahat na
 * refresh — a nespouští ho tak na každém requestu.
 */
export function readSessionExpiry(
  cookies: readonly { name: string; value: string }[],
): number | null {
  const session = parseSessionCookies(cookies);
  const expiresAt = session?.expires_at;
  return typeof expiresAt === "number" ? expiresAt : null;
}
