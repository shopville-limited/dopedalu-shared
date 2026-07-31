// Jednotná patička dopedalu.cz (Freelo 31507192 — sjednotit patičku všech sekcí).
//
// JEDINÝ zdroj pravdy pro obsah patičky napříč zónami: sekce (viz PLATFORM_NAV),
// „Objevuj" (klíčové vstupy z jednotlivých sekcí — obohacení patičky obsahem
// dalších sekcí), právní odkazy a sociální sítě. Data framework-agnostická →
// každá zóna je vykreslí vlastními třídami (Tailwind v3/v4 i mapa CSS).
//
// Cesty jsou apex-absolutní (od kořene domény) → cross-zone plain <a>.
/** Sociální sítě (ikony FB/IG kreslí zóna; klíč = který ikonový tvar). */
export const FOOTER_SOCIALS = [
    {
        key: "facebook",
        label: "dopedalu.cz na Facebooku",
        href: "https://www.facebook.com/profile.php?id=61591191802182",
    },
    {
        key: "instagram",
        label: "dopedalu.cz na Instagramu",
        href: "https://www.instagram.com/dopedalu.cz/",
    },
];
/** Právní stránky (fyzicky v zóně mapy + blogu). */
export const FOOTER_LEGAL = [
    { label: "Soukromí", href: "/blog/soukromi" },
    { label: "Ochrana osobních údajů", href: "/mapa-cykloservisu/ochrana-osobnich-udaju" },
    { label: "Cookies", href: "/mapa-cykloservisu/cookies" },
    { label: "Výmaz a nahlášení", href: "/mapa-cykloservisu/vymaz-a-nahlaseni" },
];
/**
 * „Objevuj" — klíčové vstupy z jednotlivých sekcí. Tímto se patička (a hlavně HP)
 * obohacuje o obsah ostatních sekcí (Freelo 31507192).
 */
export const FOOTER_DISCOVER = [
    { label: "Prodat kolo", href: "/bazar/prodat" },
    { label: "Rádce", href: "/bazar/radce" },
    { label: "Značky", href: "/bazar/znacky" },
    { label: "Přidat servis", href: "/mapa-cykloservisu/pridat-servis" },
    { label: "Autoři blogu", href: "/blog/autori" },
    { label: "RSS článků", href: "/blog/rss.xml" },
];
/** Krátký claim značky pod logem v patičce. */
export const FOOTER_TAGLINE = "Cyklistická platforma pro silnici, gravel a MTB.";
