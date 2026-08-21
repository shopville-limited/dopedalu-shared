import { describe, it, expect } from "vitest";
import {
  CONSENT_STORAGE_KEY,
  adsAllowed,
  analyticsAllowed,
  consentDefaultScript,
  consentSignals,
  needsAdsDecision,
  parseConsent,
} from "./consent.js";

describe("parseConsent", () => {
  it("vrací platné úrovně beze změny, legacy 'granted' jako analytics", () => {
    expect(parseConsent("denied")).toBe("denied");
    expect(parseConsent("analytics")).toBe("analytics");
    expect(parseConsent("all")).toBe("all");
    expect(parseConsent("granted")).toBe("analytics");
  });

  it("neznámé hodnoty a null vrací null", () => {
    expect(parseConsent(null)).toBeNull();
    expect(parseConsent("cokoliv")).toBeNull();
  });
});

describe("needsAdsDecision", () => {
  it("true jen pro legacy 'granted'", () => {
    expect(needsAdsDecision("granted")).toBe(true);
    expect(needsAdsDecision("analytics")).toBe(false);
    expect(needsAdsDecision(null)).toBe(false);
  });
});

describe("consentSignals", () => {
  it("analytics povoluje jen statistiku, all i reklamu", () => {
    expect(consentSignals("analytics")).toEqual({
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    expect(consentSignals("all").ad_storage).toBe("granted");
    expect(consentSignals("denied").analytics_storage).toBe("denied");
    expect(analyticsAllowed("all")).toBe(true);
    expect(adsAllowed("analytics")).toBe(false);
  });
});

describe("consentDefaultScript", () => {
  it("čte sdílený klíč a je syntakticky validní JS", () => {
    const s = consentDefaultScript();
    expect(s).toContain(CONSENT_STORAGE_KEY);
    expect(s).toContain("wait_for_update:500");
    // new Function parsne bez spuštění — chytí missing ) apod. (SWC bug, mapa#90)
    expect(() => new Function(s)).not.toThrow();
  });
});
