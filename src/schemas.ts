// Sdílená Zod schémata dopedalu.cz. Jediný zdroj pravdy pro kontrakt dat, který
// se historicky duplikoval mezi klientem (formulář) a validací (edge).
//
// Vyžaduje `zod` — deklarováno jako peerDependency, aby konzument použil svou
// vlastní instanci (žádné duplikáty v bundlu, žádný konflikt verzí). Importuj
// jen přes subcestu `@dopedalu/shared/schemas`; kořen balíčku zůstává bez zod.
//
// POZN.: edge funkce `feedback-submit` běží na Deno a importuje npm:/esm.sh, ne
// tenhle git-tarball balíček → zatím validuje ručně stejným kontraktem. Sdílení
// i do edge by vyžadovalo publikaci na npm registr (samostatné rozhodnutí).

import { z } from "zod";

/** Typy zpětné vazby (musí odpovídat TYPY v edge `feedback-submit`). */
export const FEEDBACK_TYPY = ["napad", "chyba", "pochvala"] as const;

/** Zóny, odkud může zpětná vazba přijít (= klíče ZONE_PATHS v constants). */
export const FEEDBACK_ZONY = ["portal", "blog", "bazar", "mapa", "akce"] as const;

/**
 * Payload odesílaný z FeedbackWidget na edge `feedback-submit`.
 * `website` je honeypot — lidé ho nevyplní, boti ano (server takové tiše zahodí).
 */
export const feedbackPayloadSchema = z.object({
  typ: z.enum(FEEDBACK_TYPY),
  zona: z.enum(FEEDBACK_ZONY),
  zprava: z.string().trim().min(1).max(4000),
  // Volitelný kontaktní e-mail: prázdný řetězec (nevyplněno) NEBO platný ≤200.
  email: z.union([z.string().trim().max(200).email(), z.literal("")]).optional(),
  url: z.string().max(2048).optional(),
  website: z.string().optional(),
});

export type FeedbackTyp = (typeof FEEDBACK_TYPY)[number];
export type FeedbackZona = (typeof FEEDBACK_ZONY)[number];
export type FeedbackPayload = z.infer<typeof feedbackPayloadSchema>;
