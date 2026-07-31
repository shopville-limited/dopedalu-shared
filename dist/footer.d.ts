/** Sociální sítě (ikony FB/IG kreslí zóna; klíč = který ikonový tvar). */
export declare const FOOTER_SOCIALS: ({
    key: "facebook";
    label: string;
    href: string;
} | {
    key: "instagram";
    label: string;
    href: string;
})[];
export type FooterSocialKey = (typeof FOOTER_SOCIALS)[number]["key"];
/** Právní stránky (fyzicky v zóně mapy + blogu). */
export declare const FOOTER_LEGAL: {
    label: string;
    href: string;
}[];
/**
 * „Objevuj" — klíčové vstupy z jednotlivých sekcí. Tímto se patička (a hlavně HP)
 * obohacuje o obsah ostatních sekcí (Freelo 31507192).
 */
export declare const FOOTER_DISCOVER: {
    label: string;
    href: string;
}[];
/** Krátký claim značky pod logem v patičce. */
export declare const FOOTER_TAGLINE = "Cyklistick\u00E1 platforma pro silnici, gravel a MTB.";
//# sourceMappingURL=footer.d.ts.map