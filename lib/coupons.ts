export const GLOBAL_COUPON_CODE = "GENZNEXT99";
export const GLOBAL_COUPON_DISCOUNT_PERCENT = 99;
export const GENZENEXT9_COUPON_CODE = "GENZENEXT9";
export const GENZENEXT9_COUPON_DISCOUNT_PERCENT = 99.9;
export const WELCOME50_COUPON_CODE = "WELCOME50";
export const WELCOME50_COUPON_DISCOUNT_PERCENT = 50;
export const SKILL99_COUPON_CODE = "SKILL99";
export const SKILL99_COUPON_DISCOUNT_PERCENT = 99.98;
export const LIFE99_COUPON_CODE = "LIFE99";
export const LIFE99_COUPON_DISCOUNT_PERCENT = 99;
export const GENZ100_COUPON_CODE = "GENZ100";
export const GENZ100_COUPON_DISCOUNT_PERCENT = 100;

const couponDiscountPercentByCode = {
  [GLOBAL_COUPON_CODE]: GLOBAL_COUPON_DISCOUNT_PERCENT,
  [GENZENEXT9_COUPON_CODE]: GENZENEXT9_COUPON_DISCOUNT_PERCENT,
  [WELCOME50_COUPON_CODE]: WELCOME50_COUPON_DISCOUNT_PERCENT,
  [SKILL99_COUPON_CODE]: SKILL99_COUPON_DISCOUNT_PERCENT,
  [LIFE99_COUPON_CODE]: LIFE99_COUPON_DISCOUNT_PERCENT,
  [GENZ100_COUPON_CODE]: GENZ100_COUPON_DISCOUNT_PERCENT,
} as const;

export type CouponPricing = {
  enteredCouponCode: string;
  appliedCouponCode: string;
  discountPercent: number;
  subtotalPaise: number;
  discountPaise: number;
  finalAmountPaise: number;
  isApplied: boolean;
};

export function normalizeCouponCode(value?: string | null) {
  return (value || "").trim().toUpperCase();
}

export function isValidCouponCode(value?: string | null) {
  return Boolean(getCouponDiscountPercent(value));
}

function getCouponDiscountPercent(value?: string | null) {
  const normalizedCouponCode = normalizeCouponCode(value);
  return couponDiscountPercentByCode[normalizedCouponCode as keyof typeof couponDiscountPercentByCode] || 0;
}

export function getCouponPricing(subtotalPaise: number, couponCode?: string | null): CouponPricing {
  const enteredCouponCode = normalizeCouponCode(couponCode);
  const discountPercent = getCouponDiscountPercent(enteredCouponCode);
  const isApplied = discountPercent > 0;
  const discountPaise = isApplied ? Math.round((subtotalPaise * discountPercent) / 100) : 0;
  const finalAmountPaise = Math.max(subtotalPaise - discountPaise, 0);

  return {
    enteredCouponCode,
    appliedCouponCode: isApplied ? enteredCouponCode : "",
    discountPercent,
    subtotalPaise,
    discountPaise,
    finalAmountPaise,
    isApplied,
  };
}

export function allocatePaiseProportionally(totalPaise: number, sourcePaise: number[]) {
  if (sourcePaise.length === 0) {
    return [];
  }

  const safeTotalPaise = Math.max(totalPaise, 0);
  const sourceTotalPaise = sourcePaise.reduce((sum, value) => sum + Math.max(value, 0), 0);

  if (sourceTotalPaise <= 0) {
    const allocations = new Array(sourcePaise.length).fill(0);
    allocations[0] = safeTotalPaise;
    return allocations;
  }

  const weighted = sourcePaise.map((value, index) => {
    const normalized = Math.max(value, 0);
    const raw = (normalized * safeTotalPaise) / sourceTotalPaise;
    const floored = Math.floor(raw);

    return {
      index,
      floored,
      fraction: raw - floored,
      weight: normalized,
    };
  });

  const allocations = weighted.map((item) => item.floored);
  let remainder = safeTotalPaise - allocations.reduce((sum, value) => sum + value, 0);

  weighted
    .slice()
    .sort((left, right) => {
      if (right.fraction !== left.fraction) {
        return right.fraction - left.fraction;
      }

      if (right.weight !== left.weight) {
        return right.weight - left.weight;
      }

      return left.index - right.index;
    })
    .forEach((item) => {
      if (remainder <= 0) {
        return;
      }

      allocations[item.index] += 1;
      remainder -= 1;
    });

  return allocations;
}
