// Search provider abstrakce dopedalu.cz (Freelo 31007365, S6 — brief §9.3).
//
// Každý UI touchpoint (GlobalSearch našeptávač, /hledat stránka) mluví POUZE
// přes toto rozhraní. v1 je nad Supabase (suggest = přímý RPC, full search =
// `search` Edge Function); budoucí Meilisearch provider zapadne implementací
// stejného rozhraní — beze změny komponent.
//
// Plain `fetch`, žádná supabase-js závislost: oba endpointy jsou prosté
// PostgREST/functions HTTP volání. Framework-agnostické → sdíleno napříč zónami
// (portál/blog přes @blog/ui re-export, mapa přímo). Konec ruční kopie.
/** Pevné pořadí sekcí v našeptávači (brief §9.1). */
const GROUP_ORDER = [
    "blog_post",
    "service_shop",
    "listing",
    "event",
    "bikepark",
    "product",
];
/** Seskup ploché RPC řádky do řazených sekcí; řádky přijdou pre-ranked per typ. */
export function groupSuggestRows(rows) {
    const byType = new Map();
    for (const r of rows) {
        const item = {
            type: r.entity_type,
            id: r.entity_id,
            url: r.url,
            title: r.title,
            summary: r.summary,
            imageUrl: r.image_url,
            city: r.city,
            score: r.score,
        };
        const list = byType.get(r.entity_type);
        if (list)
            list.push(item);
        else
            byType.set(r.entity_type, [item]);
    }
    const groups = [];
    for (const type of GROUP_ORDER) {
        const items = byType.get(type);
        if (items && items.length > 0)
            groups.push({ type, items });
    }
    return groups;
}
export function createSupabaseSearchProvider(cfg) {
    const base = cfg.supabaseUrl.replace(/\/+$/, "");
    const headers = {
        "Content-Type": "application/json",
        apikey: cfg.supabaseAnonKey,
        Authorization: `Bearer ${cfg.supabaseAnonKey}`,
    };
    return {
        async suggest(q, opts = {}) {
            const res = await fetch(`${base}/rest/v1/rpc/search_suggest`, {
                method: "POST",
                headers,
                body: JSON.stringify({ q, per_type: opts.perType ?? 5 }),
                signal: opts.signal,
            });
            if (!res.ok)
                throw new Error(`search_suggest failed: ${res.status}`);
            const rows = (await res.json());
            return groupSuggestRows(rows);
        },
        async search(req, signal) {
            const res = await fetch(`${base}/functions/v1/search`, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    q: req.q,
                    types: req.types && req.types.length > 0 ? req.types : undefined,
                    region: req.region || undefined,
                    page: req.page ?? 1,
                }),
                signal,
            });
            if (!res.ok)
                throw new Error(`search failed: ${res.status}`);
            return (await res.json());
        },
    };
}
/** České popisky sekcí sdílené našeptávačem i stránkou výsledků. */
export const SEARCH_TYPE_LABELS = {
    blog_post: "Články",
    service_shop: "Servisy",
    listing: "Bazar",
    event: "Události",
    bikepark: "Bikeparky",
    product: "E-shop",
};
