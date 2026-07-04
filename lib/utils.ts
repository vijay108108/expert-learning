import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Derives a single avatar initial from a display name with email/phone
 * fallback. Names use the first letter of the first word; non-name
 * fallbacks use the first alphanumeric character.
 */
export function getInitials(source?: string | null, fallback = "U") {
  if (!source) return fallback;
  const trimmed = source.trim();
  if (!trimmed) return fallback;

  const nameWords = trimmed.split(/\s+/).filter(Boolean);
  const nameMatch = nameWords[0]?.match(/[A-Za-z0-9]/);
  if (nameMatch) {
    return nameMatch[0].toUpperCase();
  }

  const fallbackMatch = trimmed.match(/[A-Za-z0-9]/);
  return fallbackMatch ? fallbackMatch[0].toUpperCase() : fallback;
}
