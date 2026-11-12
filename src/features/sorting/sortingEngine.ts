import type { MergeSortTrace, MergeSortStep } from "./mergeSortTrace.ts";
import { generateMergeSortTrace } from "./mergeSortTrace.ts";

export type SortingAlgorithm = "bubble" | "merge" | "quick";

export const sortingAlgorithmDetails: Record<SortingAlgorithm, {
  name: string;
  best: string;
  average: string;
  worst: string;
  space: string;
}> = {
  bubble: {
    name: "Bubble Sort",
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
  },
  merge: {
    name: "Merge Sort",
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
    space: "O(n)",
  },
  quick: {
    name: "Quick Sort",
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n²)",
    space: "O(log n) average recursion stack",
  },
};

export function generateSortingTrace(
  algorithm: SortingAlgorithm,
  values: number[],
): MergeSortTrace {
  if (algorithm === "merge") return generateMergeSortTrace(values);

  const steps: MergeSortStep[] = [];
  const working = [...values];
  let comparisons = 0;
  let writes = 0;

  function recordStep(
    type: MergeSortStep["type"],
    message: string,
    compared?: [number, number],
    pivot?: number,
  ) {
    steps.push({
      type,
      message,
      left: [],
      right: [],
      result: [...working],
      compared,
      pivot,
      comparisons,
      writes,
      operations: comparisons + writes,
    });
  }

  if (algorithm === "bubble") {
    for (let end = working.length - 1; end > 0; end -= 1) {
      let swapped = false;
      for (let index = 0; index < end; index += 1) {
        const pair: [number, number] = [working[index], working[index + 1]];
        comparisons += 1;
        recordStep("compare", `Compare adjacent values ${pair[0]} and ${pair[1]}.`, pair);
        if (pair[0] > pair[1]) {
          [working[index], working[index + 1]] = [working[index + 1], working[index]];
          writes += 2;
          swapped = true;
          recordStep("swap", `Swap ${pair[0]} and ${pair[1]}.`, pair);
        }
      }
      if (!swapped) break;
    }
  } else {
    function quickSort(low: number, high: number) {
      if (low >= high) return;

      const pivot = working[high];
      let boundary = low;
      for (let index = low; index < high; index += 1) {
        const pair: [number, number] = [working[index], pivot];
        comparisons += 1;
        recordStep("compare", `Compare ${pair[0]} with pivot ${pivot}.`, pair, pivot);
        if (working[index] <= pivot) {
          if (boundary !== index) {
            [working[boundary], working[index]] = [working[index], working[boundary]];
            writes += 2;
            recordStep("swap", `Move ${working[boundary]} to the lower partition.`, pair, pivot);
          }
          boundary += 1;
        }
      }

      if (boundary !== high) {
        [working[boundary], working[high]] = [working[high], working[boundary]];
        writes += 2;
      }
      recordStep("partition", `Place pivot ${pivot} at index ${boundary}.`, undefined, pivot);
      quickSort(low, boundary - 1);
      quickSort(boundary + 1, high);
    }

    quickSort(0, working.length - 1);
  }

  recordStep("complete", `${sortingAlgorithmDetails[algorithm].name} completed.`);
  return {
    steps,
    sortedValues: working,
    comparisons,
    writes,
    operations: comparisons + writes,
  };
}
