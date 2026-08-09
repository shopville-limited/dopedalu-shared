import { describe, expect, it } from "vitest";
import { readSessionEmail, readSessionExpiry } from "./session-cookie.js";

/** Session cookie tak, jak ji píše @supabase/ssr: `base64-` + base64url JSONu. */
function cookieValue(session: Record<string, unknown>): string {
  const b64 = Buffer.from(JSON.stringify(session), "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return `base64-${b64}`;
}

const NAME = "sb-rrutsanhutezzxrtjkkd-auth-token";
const SESSION = { expires_at: 1786299483, user: { email: "jiri@example.cz" } };

describe("readSessionEmail", () => {
  it("přečte e-mail z jedné cookie", () => {
    expect(readSessionEmail(`${NAME}=${cookieValue(SESSION)}`)).toBe("jiri@example.cz");
  });

  it("poskládá session rozsekanou do chunků", () => {
    const value = cookieValue(SESSION);
    const half = Math.ceil(value.length / 2);

    expect(
      readSessionEmail(`${NAME}.0=${value.slice(0, half)}; ${NAME}.1=${value.slice(half)}`),
    ).toBe("jiri@example.cz");
  });

  it("chunky řadí číselně, ne abecedně (10 patří za 9)", () => {
    const value = cookieValue(SESSION);
    const parts = Array.from({ length: 11 }, (_, i) =>
      value.slice(Math.floor((i * value.length) / 11), Math.floor(((i + 1) * value.length) / 11)),
    );
    // Schválně obrácené pořadí — cookies nechodí seřazené.
    const raw = parts
      .map((part, i) => `${NAME}.${i}=${part}`)
      .reverse()
      .join("; ");

    expect(readSessionEmail(raw)).toBe("jiri@example.cz");
  });

  it("zvládne diakritiku v metadatech (UTF-8, ne latin1)", () => {
    const value = cookieValue({
      expires_at: 1,
      user: { email: "tomas@example.cz", user_metadata: { display_name: "Tomáš Krásný" } },
    });

    expect(readSessionEmail(`${NAME}=${value}`)).toBe("tomas@example.cz");
  });

  it("bez session cookie vrací null", () => {
    expect(readSessionEmail("cookie-consent=all; theme=dark")).toBeNull();
  });

  it("prázdný vstup vrací null", () => {
    expect(readSessionEmail("")).toBeNull();
  });

  it("rozbitou cookie nebere jako session (a nespadne)", () => {
    expect(readSessionEmail(`${NAME}=base64-tohle-neni-json`)).toBeNull();
  });

  it("session bez e-mailu vrací null", () => {
    expect(readSessionEmail(`${NAME}=${cookieValue({ expires_at: 1 })}`)).toBeNull();
  });

  it("ignoruje code-verifier cookie, ta session nenese", () => {
    expect(readSessionEmail(`${NAME}-code-verifier=abc123`)).toBeNull();
  });

  it("nenechá se zmást cookie, která má jméno jen jako podřetězec", () => {
    expect(readSessionEmail(`x-${NAME}-backup=${cookieValue(SESSION)}`)).toBeNull();
  });
});

describe("readSessionExpiry", () => {
  it("přečte expires_at z rozparsovaných cookies", () => {
    expect(readSessionExpiry([{ name: NAME, value: cookieValue(SESSION) }])).toBe(1786299483);
  });

  it("poskládá chunky bez ohledu na pořadí", () => {
    const value = cookieValue(SESSION);
    const half = Math.ceil(value.length / 2);

    expect(
      readSessionExpiry([
        { name: `${NAME}.1`, value: value.slice(half) },
        { name: `${NAME}.0`, value: value.slice(0, half) },
      ]),
    ).toBe(1786299483);
  });

  it("bez session cookie vrací null", () => {
    expect(readSessionExpiry([{ name: "cookie-consent", value: "all" }])).toBeNull();
  });

  it("session bez expires_at vrací null", () => {
    expect(readSessionExpiry([{ name: NAME, value: cookieValue({ user: {} }) }])).toBeNull();
  });

  it("rozbitou cookie nebere jako session (a nespadne)", () => {
    expect(readSessionExpiry([{ name: NAME, value: "base64-neni-json" }])).toBeNull();
  });
});
