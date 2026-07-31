import { z } from "zod";
/** Typy zpětné vazby (musí odpovídat TYPY v edge `feedback-submit`). */
export declare const FEEDBACK_TYPY: readonly ["napad", "chyba", "pochvala"];
/** Zóny, odkud může zpětná vazba přijít (= klíče ZONE_PATHS v constants). */
export declare const FEEDBACK_ZONY: readonly ["portal", "blog", "bazar", "mapa", "akce"];
/**
 * Payload odesílaný z FeedbackWidget na edge `feedback-submit`.
 * `website` je honeypot — lidé ho nevyplní, boti ano (server takové tiše zahodí).
 */
export declare const feedbackPayloadSchema: z.ZodObject<{
    typ: z.ZodEnum<["napad", "chyba", "pochvala"]>;
    zona: z.ZodEnum<["portal", "blog", "bazar", "mapa", "akce"]>;
    zprava: z.ZodString;
    email: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>;
    url: z.ZodOptional<z.ZodString>;
    website: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    typ: "napad" | "chyba" | "pochvala";
    zona: "portal" | "blog" | "bazar" | "mapa" | "akce";
    zprava: string;
    email?: string | undefined;
    url?: string | undefined;
    website?: string | undefined;
}, {
    typ: "napad" | "chyba" | "pochvala";
    zona: "portal" | "blog" | "bazar" | "mapa" | "akce";
    zprava: string;
    email?: string | undefined;
    url?: string | undefined;
    website?: string | undefined;
}>;
export type FeedbackTyp = (typeof FEEDBACK_TYPY)[number];
export type FeedbackZona = (typeof FEEDBACK_ZONY)[number];
export type FeedbackPayload = z.infer<typeof feedbackPayloadSchema>;
//# sourceMappingURL=schemas.d.ts.map