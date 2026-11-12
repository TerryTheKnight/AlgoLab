export type GrowthSample = {
  name: string;
  symbol: string;
  value: number;
};

export function getGrowthSamples(inputSize: number): GrowthSample[] {
  if (!Number.isInteger(inputSize) || inputSize < 2 || inputSize > 16) {
    throw new Error("Growth examples support whole-number input sizes from 2 to 16.");
  }

  const logarithm = Math.log2(inputSize);
  return [
    { name: "Constant", symbol: "1", value: 1 },
    { name: "Logarithmic", symbol: "log₂ n", value: logarithm },
    { name: "Linear", symbol: "n", value: inputSize },
    { name: "Linearithmic", symbol: "n log₂ n", value: inputSize * logarithm },
    { name: "Quadratic", symbol: "n²", value: inputSize ** 2 },
    { name: "Exponential", symbol: "2ⁿ", value: 2 ** inputSize },
  ];
}

export type RecursionTreeLevel = {
  level: number;
  nodeCount: number;
  subproblemSize: number;
  workPerNode: number;
  totalWork: number;
  isLeaf: boolean;
};

export function getMergeSortRecursionTree(inputSize: number): RecursionTreeLevel[] {
  if (
    !Number.isInteger(inputSize) ||
    inputSize < 2 ||
    inputSize > 4096 ||
    (inputSize & (inputSize - 1)) !== 0
  ) {
    throw new Error("Choose a power-of-two input size from 2 to 4096.");
  }

  const height = Math.log2(inputSize);
  return Array.from({ length: height + 1 }, (_, level) => {
    const nodeCount = 2 ** level;
    const subproblemSize = inputSize / nodeCount;
    const isLeaf = subproblemSize === 1;
    const workPerNode = isLeaf ? 1 : subproblemSize;
    return {
      level,
      nodeCount,
      subproblemSize,
      workPerNode,
      totalWork: nodeCount * workPerNode,
      isLeaf,
    };
  });
}

export type LoopKind = "linear" | "nested" | "halving";

export function countLoopBodyExecutions(kind: LoopKind, inputSize: number): number {
  if (!Number.isInteger(inputSize) || inputSize < 1 || inputSize > 1_000_000) {
    throw new Error("Loop examples support whole-number input sizes from 1 to 1,000,000.");
  }

  if (kind === "linear") return inputSize;
  if (kind === "nested") return inputSize ** 2;
  return Math.ceil(Math.log2(inputSize));
}
