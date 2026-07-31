# @dopedalu/shared

Framework-agnostická sdílená data pro zóny **dopedalu.cz** (portál, blog, bazar,
mapa, akce). Jediný zdroj pravdy pro to, co se historicky duplikovalo jako ruční
kopie napříč 5 oddělenými repy.

Zatím obsahuje čistá data bez runtime závislostí a bez vazby na framework —
bezpečné importovat v Tailwind v3 (portál/blog) i v4 (bazar/mapa/akce) zónách:

- **`tokens`** — brand škála, hivis, ink; `ACCENT_TEXT` (AA-safe brand-700).
- **`constants`** — cesty zón, `ACCOUNT_HUB_URL` (`/ucet`), `LOGIN_URL`, doména cookie.

## Instalace (git-dependency)

Konzumenti neinstalují z registru — balíček se instaluje přímo z GitHub tagu.
`dist/` je commitnutý, takže Vercel při buildu nic nekompiluje.

```jsonc
// package.json zóny
{
  "dependencies": {
    "@dopedalu/shared": "github:shopville-limited/dopedalu-shared#v0.1.0"
  }
}
```

```ts
import { ACCENT_TEXT, BRAND_SCALE } from "@dopedalu/shared/tokens";
import { ACCOUNT_HUB_URL, LOGIN_URL } from "@dopedalu/shared/constants";
```

## Vydání nové verze

1. Uprav `src/`, zvedni `version` v `package.json`.
2. `npm run build` (přegeneruje `dist/`).
3. Commitni **včetně `dist/`**, otaguj `vX.Y.Z`, pushni tag.
4. V zónách zvedni `#vX.Y.Z` v `package.json` a přeinstaluj.

## Roadmap konsolidace

Postupná migrace (Freelo 31498739, zvolen nízkorizikový přístup). Další
kandidáti na extrakci (framework-agnostická logika): Zod schémata sdílených
formulářů, search provider, wrapper session klienta. Tailwind-vázané UI
komponenty (AccountChip, PlatformHeader) zůstávají zatím jako kopie —
sjednotí se až po unifikaci Tailwindu v3→v4.
