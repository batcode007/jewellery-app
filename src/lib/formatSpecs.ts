/**
 * Format weight for display — ensures "g" unit is always visible.
 * "4.2"  → "4.2 g"
 * "4.2g" → "4.2 g"
 * "4.2 g"→ "4.2 g"  (already correct)
 */
export function fmtWeight(raw: string | null | undefined): string {
  if (!raw) return "—";
  const clean = raw.trim();
  // already has a unit-like suffix (letters after digits)
  if (/[a-zA-Z]/.test(clean)) {
    // normalise spacing: "4.2g" → "4.2 g"
    return clean.replace(/([0-9])([a-zA-Z])/, "$1 $2");
  }
  return `${clean} g`;
}

/**
 * Format purity for display — normalises karat notation and ensures unit is visible.
 * "22K"   → "22 kt"
 * "22KT"  → "22 kt"
 * "22 kt" → "22 kt"  (already correct)
 * "925"   → "925"    (silver fineness — no unit needed)
 * "999"   → "999"    (silver fineness — no unit needed)
 */
export function fmtPurity(raw: string | null | undefined): string {
  if (!raw) return "—";
  const clean = raw.trim();
  // match patterns like "22K", "22KT", "22 K", "22 KT" (case-insensitive)
  const karatMatch = clean.match(/^(\d+(?:\.\d+)?)\s*kt?$/i);
  if (karatMatch) return `${karatMatch[1]} kt`;
  return clean;
}
