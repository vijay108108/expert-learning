export const GLOBAL_COUPON_CODE = "GENZNEXT99";
export const GLOBAL_COUPON_DISCOUNT_PERCENT = 99;

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
  return normalizeCouponCode(value) === GLOBAL_COUPON_CODE;
}

export function getCouponPricing(subtotalPaise: number, couponCode?: string | null): CouponPricing {
  const enteredCouponCode = normalizeCouponCode(couponCode);
  const isApplied = isValidCouponCode(enteredCouponCode);
  const discountPercent = isApplied ? GLOBAL_COUPON_DISCOUNT_PERCENT : 0;
  const discountPaise = isApplied ? Math.round((subtotalPaise * discountPercent) / 100) : 0;
  const finalAmountPaise = Math.max(subtotalPaise - discountPaise, 0);

  return {
    enteredCouponCode,
    appliedCouponCode: isApplied ? GLOBAL_COUPON_CODE : "",
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
