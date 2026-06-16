export function normalizePhoneForAuth(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 10) {
    return `91${digits}`;
  }

  if (digits.length === 12 && digits.startsWith("91")) {
    return digits;
  }

  return digits;
}

export function getPhoneLookupCandidates(phone: string) {
  const trimmed = phone.trim();
  const digits = trimmed.replace(/\D/g, "");
  const normalized = normalizePhoneForAuth(trimmed);
  const candidates = new Set<string>();

  if (normalized) {
    candidates.add(normalized);
    candidates.add(`+${normalized}`);
  }

  if (digits) {
    candidates.add(digits);
    candidates.add(`+${digits}`);
  }

  if (digits.length === 10) {
    candidates.add(`91${digits}`);
    candidates.add(`+91${digits}`);
    candidates.add(`+91 ${digits}`);
  }

  if (digits.length === 12 && digits.startsWith("91")) {
    const localDigits = digits.slice(2);
    candidates.add(localDigits);
    candidates.add(`+${localDigits}`);
    candidates.add(`+91${localDigits}`);
    candidates.add(`+91 ${localDigits}`);
  }

  return Array.from(candidates).filter(Boolean);
}
