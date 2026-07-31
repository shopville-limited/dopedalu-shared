export type SearchEntityType = "blog_post" | "service_shop" | "listing" | "event" | "bikepark" | "product";
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
    types: {
        value: string;
        count: number;
    }[];
    regions: {
        value: string;
        count: number;
    }[];
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
export declare function groupSuggestRows(rows: SuggestRow[]): SuggestGroup[];
export interface SupabaseSearchConfig {
    supabaseUrl: string;
    supabaseAnonKey: string;
}
export declare function createSupabaseSearchProvider(cfg: SupabaseSearchConfig): SearchProvider;
/** České popisky sekcí sdílené našeptávačem i stránkou výsledků. */
export declare const SEARCH_TYPE_LABELS: Record<SearchEntityType, string>;
export {};
//# sourceMappingURL=search.d.ts.map