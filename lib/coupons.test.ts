import { describe, expect, it } from "vitest";
import {
  GENZ100_COUPON_CODE,
  WELCOME50_COUPON_CODE,
  allocatePaiseProportionally,
  getCouponPricing,
  isValidCouponCode,
  normalizeCouponCode,
} from "./coupons";

describe("normalizeCouponCode", () => {
  it("trims and uppercases", () => {
    expect(normalizeCouponCode("  welcome50 ")).toBe("WELCOME50");
  });

  it("returns empty string for null/undefined", () => {
    expect(normalizeCouponCode(null)).toBe("");
    expect(normalizeCouponCode(undefined)).toBe("");
  });
});

describe("isValidCouponCode", () => {
  it("accepts known codes case-insensitively", () => {
    expect(isValidCouponCode("welcome50")).toBe(true);
  });

  it("rejects unknown codes", () => {
    expect(isValidCouponCode("NOT-A-REAL-CODE")).toBe(false);
  });
});

describe("getCouponPricing", () => {
  it("applies no discount when no coupon is given", () => {
    const pricing = getCouponPricing(100000, "");
    expect(pricing.isApplied).toBe(false);
    expect(pricing.discountPaise).toBe(0);
    expect(pricing.finalAmountPaise).toBe(100000);
  });

  it("applies no discount for an unrecognized coupon", () => {
    const pricing = getCouponPricing(100000, "FAKE-CODE");
    expect(pricing.isApplied).toBe(false);
    expect(pricing.finalAmountPaise).toBe(100000);
  });

  it("computes a partial discount correctly", () => {
    const pricing = getCouponPricing(100000, WELCOME50_COUPON_CODE);
    expect(pricing.isApplied).toBe(true);
    expect(pricing.discountPaise).toBe(50000);
    expect(pricing.finalAmountPaise).toBe(50000);
  });

  it("never produces a negative final amount", () => {
    const pricing = getCouponPricing(100000, GENZ100_COUPON_CODE);
    expect(pricing.finalAmountPaise).toBe(0);
    expect(pricing.finalAmountPaise).toBeGreaterThanOrEqual(0);
  });

  it("handles a zero subtotal without producing negative numbers", () => {
    const pricing = getCouponPricing(0, WELCOME50_COUPON_CODE);
    expect(pricing.finalAmountPaise).toBe(0);
    expect(pricing.discountPaise).toBe(0);
  });
});

describe("allocatePaiseProportionally", () => {
  it("returns an empty array for no sources", () => {
    expect(allocatePaiseProportionally(1000, [])).toEqual([]);
  });

  it("allocates the full total to the first item when sources are all zero", () => {
    expect(allocatePaiseProportionally(1000, [0, 0, 0])).toEqual([1000, 0, 0]);
  });

  it("splits proportionally and the parts always sum exactly to the total", () => {
    const total = 10000;
    const sources = [3333, 3333, 3334];
    const allocations = allocatePaiseProportionally(total, sources);
    expect(allocations.reduce((sum, value) => sum + value, 0)).toBe(total);
    expect(allocations).toHaveLength(3);
  });

  it("handles an odd total that doesn't divide evenly, still summing exactly", () => {
    const total = 100;
    const sources = [1, 1, 1];
    const allocations = allocatePaiseProportionally(total, sources);
    expect(allocations.reduce((sum, value) => sum + value, 0)).toBe(total);
  });
});
