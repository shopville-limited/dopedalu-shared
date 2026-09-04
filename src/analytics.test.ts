import { describe, expect, it, vi } from "vitest";
import {
  DEFAULT_GTM_ID,
  CONSENT_CHANGE_EVENT,
  gtmSnippet,
  onAnalyticsConsent,
  injectGtm,
} from "./analytics.js";

/** Náhrada localStorage — jen `getItem`, víc loader nepotřebuje. */
function ulozisteS(hodnota: string | null) {
  return { getItem: () => hodnota };
}

/** Úložiště, které hází — privátní režim / zablokované cookies. */
const ulozisteKtereHazi = {
  getItem() {
    throw new Error("SecurityError");
  },
};

describe("gtmSnippet", () => {
  it("vloží ID kontejneru do skriptu", () => {
    expect(gtmSnippet("GTM-TEST123")).toContain("GTM-TEST123");
  });

  it("nenechá ve výstupu zástupný symbol", () => {
    expect(gtmSnippet("GTM-TEST123")).not.toContain("__GTM_ID__");
  });

  it("míří na googletagmanager", () => {
    expect(gtmSnippet(DEFAULT_GTM_ID)).toContain("googletagmanager.com/gtm.js");
  });

  it("dá se vložit do <script> bez rozbití — neobsahuje </script>", () => {
    expect(gtmSnippet(DEFAULT_GTM_ID)).not.toContain("</script>");
  });
});

describe("onAnalyticsConsent", () => {
  it("zavolá handler hned, když je souhlas s analytikou už uložený", () => {
    const handler = vi.fn();
    onAnalyticsConsent(handler, { storage: ulozisteS("analytics"), target: new EventTarget() });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("bere i plný souhlas", () => {
    const handler = vi.fn();
    onAnalyticsConsent(handler, { storage: ulozisteS("all"), target: new EventTarget() });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("bere legacy hodnotu 'granted' jako souhlas s analytikou", () => {
    const handler = vi.fn();
    onAnalyticsConsent(handler, { storage: ulozisteS("granted"), target: new EventTarget() });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("NEZAVOLÁ handler při odmítnutém souhlasu", () => {
    const handler = vi.fn();
    onAnalyticsConsent(handler, { storage: ulozisteS("denied"), target: new EventTarget() });
    expect(handler).not.toHaveBeenCalled();
  });

  it("NEZAVOLÁ handler, dokud návštěvník nevolil", () => {
    const handler = vi.fn();
    onAnalyticsConsent(handler, { storage: ulozisteS(null), target: new EventTarget() });
    expect(handler).not.toHaveBeenCalled();
  });

  it("zavolá handler, když lišta vystřelí souhlas", () => {
    const handler = vi.fn();
    const target = new EventTarget();
    onAnalyticsConsent(handler, { storage: ulozisteS(null), target });
    expect(handler).not.toHaveBeenCalled();

    target.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: "all" }));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("ignoruje událost s odmítnutím", () => {
    const handler = vi.fn();
    const target = new EventTarget();
    onAnalyticsConsent(handler, { storage: ulozisteS(null), target });
    target.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: "denied" }));
    expect(handler).not.toHaveBeenCalled();
  });

  it("zavolá handler NEJVÝŠ JEDNOU — GTM se nesmí vložit dvakrát", () => {
    const handler = vi.fn();
    const target = new EventTarget();
    onAnalyticsConsent(handler, { storage: ulozisteS(null), target });
    target.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: "all" }));
    target.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: "all" }));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("po odhlášení už handler nezavolá", () => {
    const handler = vi.fn();
    const target = new EventTarget();
    const odhlasit = onAnalyticsConsent(handler, { storage: ulozisteS(null), target });
    odhlasit();
    target.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: "all" }));
    expect(handler).not.toHaveBeenCalled();
  });

  it("událost bez detailu si úroveň dočte z úložiště", () => {
    // Lišta v některé zóně nemusí detail posílat. Pak je pravdou úložiště.
    const handler = vi.fn();
    const target = new EventTarget();
    let ulozeno: string | null = null;
    onAnalyticsConsent(handler, { storage: { getItem: () => ulozeno }, target });

    ulozeno = "analytics";
    target.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("nespadne, když úložiště hází (privátní režim), a počká na lištu", () => {
    const handler = vi.fn();
    const target = new EventTarget();
    expect(() => onAnalyticsConsent(handler, { storage: ulozisteKtereHazi, target })).not.toThrow();
    expect(handler).not.toHaveBeenCalled();

    target.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: "analytics" }));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("bez prostředí (SSR) nic nedělá a vrátí funkční odhlášení", () => {
    const handler = vi.fn();
    const odhlasit = onAnalyticsConsent(handler, { storage: null, target: null });
    expect(handler).not.toHaveBeenCalled();
    expect(() => odhlasit()).not.toThrow();
  });
});

describe("injectGtm", () => {
  function fakeDocument() {
    const head = { children: [] as unknown[], appendChild: (n: unknown) => head.children.push(n) };
    return {
      head,
      querySelector: (sel: string) =>
        head.children.find((n) => (n as { id?: string }).id === sel.replace("#", "")) ?? null,
      createElement: () => ({ id: "", async: false, src: "", innerHTML: "" }),
    };
  }

  it("vloží skript do hlavičky", () => {
    const doc = fakeDocument();
    expect(injectGtm("GTM-X", doc as never)).toBe(true);
    expect(doc.head.children).toHaveLength(1);
  });

  it("podruhé už nevkládá — dvojí GTM by zdvojil všechny zásahy", () => {
    const doc = fakeDocument();
    injectGtm("GTM-X", doc as never);
    expect(injectGtm("GTM-X", doc as never)).toBe(false);
    expect(doc.head.children).toHaveLength(1);
  });

  it("bez dokumentu (SSR) vrátí false a nespadne", () => {
    expect(injectGtm("GTM-X", null as never)).toBe(false);
  });
});
