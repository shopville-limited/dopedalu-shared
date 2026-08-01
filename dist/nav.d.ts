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
/** Závazné pořadí + názvy + cesty + ikony sekcí hlavičky. */
export declare const PLATFORM_NAV: readonly PlatformNavItem[];
export type PlatformNavKey = PlatformNavItem["key"];
//# sourceMappingURL=nav.d.ts.map