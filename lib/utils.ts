import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Derives avatar initials from a display name (or email/phone fallback).
 * Two-or-more-word names use the first letter of the first two words
 * (e.g. "Jay Prakash Vishvakarma" -> "JP"); single-word names use the
 * first two letters (e.g. "Adarsh" -> "AD").
 */
export function getInitials(source?: string | null, fallback = "U") {
  if (!source) return fallback;
  const words = source
    .trim()
    .replace(/[@._-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return fallback;
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}
