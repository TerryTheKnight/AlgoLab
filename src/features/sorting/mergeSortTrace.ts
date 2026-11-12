export type MergeSortStep = {
  type: "divide" | "compare" | "merge" | "swap" | "partition" | "complete";
  message: string;
  left: number[];
  right: number[];
  result: number[];
  selected?: number;
  compared?: [number, number];
  pivot?: number;
  comparisons: number;
  writes: number;
  operations: number;
};

export type MergeSortTrace = {
  steps: MergeSortStep[];
  sortedValues: number[];
  comparisons: number;
  writes: number;
  operations: number;
};

export function generateMergeSortTrace(values: number[]): MergeSortTrace {
  const steps: MergeSortStep[] = [];
  let comparisons = 0;
  let writes = 0;

  function recordStep(
    step: Omit<MergeSortStep, "comparisons" | "writes" | "operations">
  ) {
    steps.push({
      ...step,
      comparisons,
      writes,
      operations: comparisons + writes,
    });
  }

  function sort(array: number[]): number[] {
    if (array.length <= 1) {
      return [...array];
    }

    const middle = Math.floor(array.length / 2);
    const left = array.slice(0, middle);
    const right = array.slice(middle);

    recordStep({
      type: "divide",
      message: `Divide [${array}] into [${left}] and [${right}]`,
      left,
      right,
      result: [...array],
    });

    const sortedLeft = sort(left);
    const sortedRight = sort(right);
    let leftIndex = 0;
    let rightIndex = 0;
    const merged: number[] = [];

    while (leftIndex < sortedLeft.length && rightIndex < sortedRight.length) {
      const leftValue = sortedLeft[leftIndex];
      const rightValue = sortedRight[rightIndex];
      comparisons += 1;

      const selected = leftValue <= rightValue ? leftValue : rightValue;
      if (leftValue <= rightValue) {
        merged.push(leftValue);
        leftIndex += 1;
      } else {
        merged.push(rightValue);
        rightIndex += 1;
      }
      writes += 1;

      recordStep({
        type: "compare",
        message: `Compare ${leftValue} and ${rightValue}. Select ${selected}.`,
        left: sortedLeft.slice(leftIndex),
        right: sortedRight.slice(rightIndex),
        result: [...merged],
        compared: [leftValue, rightValue],
        selected,
      });
    }

    while (leftIndex < sortedLeft.length) {
      merged.push(sortedLeft[leftIndex]);
      leftIndex += 1;
      writes += 1;
    }

    while (rightIndex < sortedRight.length) {
      merged.push(sortedRight[rightIndex]);
      rightIndex += 1;
      writes += 1;
    }

    recordStep({
      type: "merge",
      message: `Merge completed: [${merged}]`,
      left: sortedLeft,
      right: sortedRight,
      result: [...merged],
    });

    return merged;
  }

  const sortedValues = sort(values);

  return {
    steps,
    sortedValues,
    comparisons,
    writes,
    operations: comparisons + writes,
  };
}
