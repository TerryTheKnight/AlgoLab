export type SortingBenchmarkResult = {
  algorithm: "Bubble Sort" | "Merge Sort";
  medianMilliseconds: number;
  comparisons: number;
  writes: number;
  operations: number;
  timeComplexity: string;
  spaceComplexity: string;
};

export type BenchmarkDatasetOrder = "random" | "sorted" | "reverse";

export function createBenchmarkDataset(size: number, order: BenchmarkDatasetOrder) {
  if (order === "sorted") {
    return Array.from({ length: size }, (_, index) => index + 1);
  }
  if (order === "reverse") {
    return Array.from({ length: size }, (_, index) => size - index);
  }
  return Array.from({ length: size }, () => Math.floor(Math.random() * size * 4));
}

type SortRun = {
  sortedValues: number[];
  comparisons: number;
  writes: number;
};

function runBubbleSort(input: number[]): SortRun {
  const values = [...input];
  let comparisons = 0;
  let writes = 0;

  for (let end = values.length - 1; end > 0; end -= 1) {
    let swapped = false;
    for (let index = 0; index < end; index += 1) {
      comparisons += 1;
      if (values[index] > values[index + 1]) {
        const temporary = values[index];
        values[index] = values[index + 1];
        values[index + 1] = temporary;
        writes += 2;
        swapped = true;
      }
    }
    if (!swapped) break;
  }

  return { sortedValues: values, comparisons, writes };
}

function runMergeSort(input: number[]): SortRun {
  let comparisons = 0;
  let writes = 0;

  function sort(values: number[]): number[] {
    if (values.length <= 1) return [...values];

    const middle = Math.floor(values.length / 2);
    const left = sort(values.slice(0, middle));
    const right = sort(values.slice(middle));
    const merged: number[] = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
      comparisons += 1;
      if (left[leftIndex] <= right[rightIndex]) {
        merged.push(left[leftIndex]);
        leftIndex += 1;
      } else {
        merged.push(right[rightIndex]);
        rightIndex += 1;
      }
      writes += 1;
    }

    while (leftIndex < left.length) {
      merged.push(left[leftIndex]);
      leftIndex += 1;
      writes += 1;
    }

    while (rightIndex < right.length) {
      merged.push(right[rightIndex]);
      rightIndex += 1;
      writes += 1;
    }

    return merged;
  }

  return { sortedValues: sort(input), comparisons, writes };
}

function median(values: number[]) {
  const sorted = [...values].sort((first, second) => first - second);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

function measure(
  algorithm: SortingBenchmarkResult["algorithm"],
  input: number[],
  repeats: number,
): SortingBenchmarkResult {
  const times: number[] = [];
  let finalRun: SortRun | undefined;

  if (algorithm === "Bubble Sort") runBubbleSort(input);
  else runMergeSort(input);

  for (let repeat = 0; repeat < repeats; repeat += 1) {
    const startedAt = performance.now();
    const run = algorithm === "Bubble Sort" ? runBubbleSort(input) : runMergeSort(input);
    times.push(performance.now() - startedAt);
    finalRun = run;
  }

  if (!finalRun) throw new Error("At least one benchmark repeat is required.");

  return {
    algorithm,
    medianMilliseconds: median(times),
    comparisons: finalRun.comparisons,
    writes: finalRun.writes,
    operations: finalRun.comparisons + finalRun.writes,
    timeComplexity: algorithm === "Bubble Sort" ? "O(n²) average / worst · O(n) best" : "O(n log n)",
    spaceComplexity: algorithm === "Bubble Sort" ? "O(1)" : "O(n)",
  };
}

export function benchmarkSortingAlgorithms(input: number[], repeats = 3) {
  if (!Number.isInteger(repeats) || repeats < 1) {
    throw new Error("Benchmark repeats must be a positive integer.");
  }

  const bubble = measure("Bubble Sort", input, repeats);
  const merge = measure("Merge Sort", input, repeats);
  return [bubble, merge];
}
