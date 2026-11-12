export type RabinKarpStep = {
  index: number;
  window: string;
  windowHash: number;
  patternHash: number;
  hashMatch: boolean;
  verified: boolean;
  message: string;
};

export type RabinKarpTrace = {
  steps: RabinKarpStep[];
  matches: number[];
  collisions: number;
};

export function generateRabinKarpTrace(
  text: string,
  pattern: string,
  base = 256,
  modulus = 101,
): RabinKarpTrace {
  if (pattern.length === 0) throw new Error("The pattern cannot be empty.");
  if (!Number.isInteger(base) || base < 2 || !Number.isInteger(modulus) || modulus < 2) {
    throw new Error("Hash base and modulus must be integers greater than one.");
  }

  const textCharacters = Array.from(text);
  const patternCharacters = Array.from(pattern);
  const steps: RabinKarpStep[] = [];
  const matches: number[] = [];
  let collisions = 0;
  if (patternCharacters.length > textCharacters.length) return { steps, matches, collisions };

  let highPower = 1;
  for (let index = 1; index < patternCharacters.length; index += 1) {
    highPower = (highPower * base) % modulus;
  }

  let patternHash = 0;
  let windowHash = 0;
  for (let index = 0; index < patternCharacters.length; index += 1) {
    patternHash = (base * patternHash + patternCharacters[index].codePointAt(0)!) % modulus;
    windowHash = (base * windowHash + textCharacters[index].codePointAt(0)!) % modulus;
  }

  for (let start = 0; start <= textCharacters.length - patternCharacters.length; start += 1) {
    const window = textCharacters.slice(start, start + patternCharacters.length).join("");
    const hashMatch = windowHash === patternHash;
    let verified = false;
    if (hashMatch) {
      verified = true;
      for (let offset = 0; offset < patternCharacters.length; offset += 1) {
        if (textCharacters[start + offset] !== patternCharacters[offset]) {
          verified = false;
          break;
        }
      }
      if (verified) matches.push(start);
      else collisions += 1;
    }

    steps.push({
      index: start,
      window,
      windowHash,
      patternHash,
      hashMatch,
      verified,
      message: verified
        ? `Hash and character verification match at index ${start}.`
        : hashMatch
          ? `Hash collision at index ${start}; the characters do not match.`
          : `Window at index ${start} has a different hash.`,
    });

    if (start < textCharacters.length - patternCharacters.length) {
      const leadingCode = textCharacters[start].codePointAt(0)!;
      const trailingCode = textCharacters[start + patternCharacters.length].codePointAt(0)!;
      windowHash = (base * (windowHash - leadingCode * highPower) + trailingCode) % modulus;
      if (windowHash < 0) windowHash += modulus;
    }
  }

  return { steps, matches, collisions };
}
