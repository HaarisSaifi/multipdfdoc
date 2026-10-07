/** Parse a selection strictly: invalid tokens must never silently select other pages. */
export function parsePageRange(value: string, pageCount: number): number[] {
  const pages = new Set<number>();
  for (const token of value.split(",")) {
    const match = token.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!match) throw new Error("Use page numbers or ranges, such as 1-3, 5.");
    const start = Number(match[1]);
    const end = Number(match[2] ?? match[1]);
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 1 || end < start || end > pageCount) {
      throw new Error(`Choose ascending ranges between 1 and ${pageCount}.`);
    }
    for (let page = start; page <= end; page++) pages.add(page - 1);
  }
  return [...pages].sort((a, b) => a - b);
}
