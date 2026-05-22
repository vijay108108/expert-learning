export const CART_STORAGE_KEY = "expert-learning-cart-v1";

export type CartEntry = {
  courseSlug: string;
  addedAt: string;
};

export function dedupeCartEntries(entries: CartEntry[]) {
  const seen = new Set<string>();
  return entries.filter((entry) => {
    if (seen.has(entry.courseSlug)) {
      return false;
    }
    seen.add(entry.courseSlug);
    return true;
  });
}
