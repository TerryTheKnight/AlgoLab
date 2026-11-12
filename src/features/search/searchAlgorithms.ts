export type ArraySearchStep = {
  index: number;
  value: number;
  low: number;
  high: number;
  found: boolean;
  message: string;
};

export type ArraySearchTrace = {
  steps: ArraySearchStep[];
  resultIndex: number;
  comparisons: number;
};

export function linearSearch(values: number[], target: number): ArraySearchTrace {
  const steps: ArraySearchStep[] = [];
  let comparisons = 0;
  for (let index = 0; index < values.length; index += 1) {
    comparisons += 1;
    const found = values[index] === target;
    steps.push({
      index,
      value: values[index],
      low: index,
      high: values.length - 1,
      found,
      message: found ? `Found ${target} at index ${index}.` : `Check ${values[index]} at index ${index}; continue to the next value.`,
    });
    if (found) return { steps, resultIndex: index, comparisons };
  }
  return { steps, resultIndex: -1, comparisons };
}

export function binarySearch(values: number[], target: number): ArraySearchTrace {
  if (values.some((value, index) => index > 0 && values[index - 1] > value)) {
    throw new Error("Binary Search requires values sorted in ascending order.");
  }

  const steps: ArraySearchStep[] = [];
  let low = 0;
  let high = values.length - 1;
  let comparisons = 0;

  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    const value = values[middle];
    comparisons += 1;
    const found = value === target;
    steps.push({
      index: middle,
      value,
      low,
      high,
      found,
      message: found
        ? `Found ${target} at index ${middle}.`
        : value < target
          ? `${value} is below ${target}; discard the lower half.`
          : `${value} is above ${target}; discard the upper half.`,
    });
    if (found) return { steps, resultIndex: middle, comparisons };
    if (value < target) low = middle + 1;
    else high = middle - 1;
  }

  return { steps, resultIndex: -1, comparisons };
}
