export function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/\s+/g, " ")
    .trim();
}

export function matchesSearchQuery(haystack: string, query: string): boolean {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;
  const normalizedHaystack = normalizeSearchText(haystack);
  const tokens = normalizedQuery.split(" ").filter(Boolean);
  return tokens.every((token) => normalizedHaystack.includes(token));
}
