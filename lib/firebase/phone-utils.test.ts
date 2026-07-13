import { describe, expect, it } from "vitest";
import { getPhoneLookupCandidates, normalizePhoneForAuth } from "./phone-utils";

describe("normalizePhoneForAuth", () => {
  it("prefixes a bare 10-digit Indian number with 91", () => {
    expect(normalizePhoneForAuth("9876543210")).toBe("919876543210");
  });

  it("leaves an already-prefixed 12-digit 91 number unchanged", () => {
    expect(normalizePhoneForAuth("919876543210")).toBe("919876543210");
  });

  it("strips non-digit characters before normalizing", () => {
    expect(normalizePhoneForAuth("+91 98765-43210")).toBe("919876543210");
  });

  it("is idempotent across signup-time and login-time formats for the same number", () => {
    const signupTime = normalizePhoneForAuth("+919876543210");
    const loginTime = normalizePhoneForAuth("9876543210");
    expect(signupTime).toBe(loginTime);
  });
});

describe("getPhoneLookupCandidates", () => {
  it("includes the E.164 form for a 10-digit number", () => {
    const candidates = getPhoneLookupCandidates("9876543210");
    expect(candidates).toContain("+919876543210");
    expect(candidates).toContain("919876543210");
  });

  it("includes the local form for a 91-prefixed 12-digit number", () => {
    const candidates = getPhoneLookupCandidates("919876543210");
    expect(candidates).toContain("9876543210");
  });
});
