export const MAX_SORT_ARRAY_LENGTH = 32;

export function parseNumberArray(input: string): number[] {
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    throw new Error("Enter at least one number.");
  }

  const startsWithBracket = trimmed.startsWith("[");
  const endsWithBracket = trimmed.endsWith("]");
  if (startsWithBracket !== endsWithBracket) {
    throw new Error("Use matching square brackets around the array, or omit them.");
  }

  const contents = startsWithBracket ? trimmed.slice(1, -1).trim() : trimmed;
  if (contents.length === 0) {
    throw new Error("Enter at least one number.");
  }

  const entries = contents.split(",").map((entry) => entry.trim());
  if (entries.length > MAX_SORT_ARRAY_LENGTH) {
    throw new Error(`Enter no more than ${MAX_SORT_ARRAY_LENGTH} numbers.`);
  }
  if (entries.some((entry) => entry.length === 0)) {
    throw new Error("Separate values with commas and do not leave an entry empty.");
  }

  const values = entries.map(Number);
  if (values.some((value) => !Number.isFinite(value))) {
    throw new Error("Every array entry must be a finite number.");
  }
  return values;
}
