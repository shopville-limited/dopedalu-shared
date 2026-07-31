// @dopedalu/shared — framework-agnostická sdílená data + logika pro zóny
// dopedalu.cz. Kořen re-exportuje jen moduly BEZ runtime závislostí (tokeny,
// konstanty, search provider) — bezpečné importovat v jakékoli zóně (v3 i v4).
//
// Zod schémata jsou ZÁMĚRNĚ jen přes subcestu `@dopedalu/shared/schemas`, aby
// kořen nevyžadoval `zod`. Konzument, který schémata nechce, zod neinstaluje.

export * from "./tokens.js";
export * from "./constants.js";
export * from "./search.js";
export * from "./nav.js";
