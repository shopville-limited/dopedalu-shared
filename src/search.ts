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

export type SearchEntityType =
  | "blog_post"
  | "service_shop"
  | "listing"
  | "event"
  | "bikepark"
  | "product";

export interface SuggestItem {
  type: SearchEntityType;
  id: string;
  url: string;
  title: string;
  summary?: string | null;
  imageUrl?: string | null;
  city?: string | null;
  score: number;
}

export interface SuggestGroup {
  type: SearchEntityType;
  items: SuggestItem[];
}

export interface SearchRequest {
  q: string;
  types?: SearchEntityType[];
  region?: string;
  page?: number;
}

export interface SearchHit {
  type: SearchEntityType;
  id: string;
  url: string;
  title: string;
  summary?: string | null;
  highlight?: string | null;
  imageUrl?: string | null;
  city?: string | null;
  score: number;
}

export interface SearchFacets {
  types: { value: string; count: number }[];
  regions: { value: string; count: number }[];
}

export interface SearchResponse {
  total: number;
  page: number;
  hits: SearchHit[];
  facets: SearchFacets;
}

export interface SuggestOptions {
  perType?: number;
  signal?: AbortSignal;
}

export interface SearchProvider {
  suggest(q: string, opts?: SuggestOptions): Promise<SuggestGroup[]>;
  search(req: SearchRequest, signal?: AbortSignal): Promise<SearchResponse>;
}

/** Pevné pořadí sekcí v našeptávači (brief §9.1). */
const GROUP_ORDER: SearchEntityType[] = [
  "blog_post",
  "service_shop",
  "listing",
  "event",
  "bikepark",
  "product",
];

interface SuggestRow {
  entity_type: SearchEntityType;
  entity_id: string;
  url: string;
  title: string;
  summary: string | null;
  image_url: string | null;
  city: string | null;
  score: number;
}

/** Seskup ploché RPC řádky do řazených sekcí; řádky přijdou pre-ranked per typ. */
export function groupSuggestRows(rows: SuggestRow[]): SuggestGroup[] {
  const byType = new Map<SearchEntityType, SuggestItem[]>();
  for (const r of rows) {
    const item: SuggestItem = {
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
    if (list) list.push(item);
    else byType.set(r.entity_type, [item]);
  }
  const groups: SuggestGroup[] = [];
  for (const type of GROUP_ORDER) {
    const items = byType.get(type);
    if (items && items.length > 0) groups.push({ type, items });
  }
  return groups;
}

export interface SupabaseSearchConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export function createSupabaseSearchProvider(cfg: SupabaseSearchConfig): SearchProvider {
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
      if (!res.ok) throw new Error(`search_suggest failed: ${res.status}`);
      const rows = (await res.json()) as SuggestRow[];
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
      if (!res.ok) throw new Error(`search failed: ${res.status}`);
      return (await res.json()) as SearchResponse;
    },
  };
}

/** České popisky sekcí sdílené našeptávačem i stránkou výsledků. */
export const SEARCH_TYPE_LABELS: Record<SearchEntityType, string> = {
  blog_post: "Články",
  service_shop: "Servisy",
  listing: "Bazar",
  event: "Události",
  bikepark: "Bikeparky",
  product: "E-shop",
};
