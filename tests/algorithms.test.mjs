import assert from "node:assert/strict";
import test from "node:test";
import { generateMergeSortTrace } from "../src/features/sorting/mergeSortTrace.ts";
import { generateSortingTrace } from "../src/features/sorting/sortingEngine.ts";
import { parseNumberArray } from "../src/features/sorting/sortingInput.ts";
import { generateGraphTrace } from "../src/features/graph/graphAlgorithms.ts";
import { benchmarkSortingAlgorithms } from "../src/features/complexity/sortingBenchmark.ts";
import { countLoopBodyExecutions, getGrowthSamples, getMergeSortRecursionTree } from "../src/features/complexity/complexityModels.ts";
import { solveKnapsack } from "../src/features/experiments/knapsack.ts";
import { insertAvl, insertBst, inorderValues, searchTree } from "../src/features/structures/trees.ts";
import { binarySearch, linearSearch } from "../src/features/search/searchAlgorithms.ts";
import { generateRabinKarpTrace } from "../src/features/search/rabinKarp.ts";
import { scheduleActivities } from "../src/features/experiments/scheduling.ts";
import { btreeLevels, inorderBTree, insertBTree, searchBTree } from "../src/features/structures/btree.ts";

test("Merge Sort trace sorts values, counts operations, and preserves input", () => {
  const input = [8, -2, 5, 5, 1];
  const trace = generateMergeSortTrace(input);

  assert.deepEqual(trace.sortedValues, [-2, 1, 5, 5, 8]);
  assert.equal(trace.comparisons, 8);
  assert.equal(trace.operations, trace.comparisons + trace.writes);
  assert.deepEqual(input, [8, -2, 5, 5, 1]);
});

test("Bubble, Merge, and Quick Sort traces handle empty, duplicate, and ordered inputs", () => {
  const inputs = [[], [1], [4, 2, 2, -1], [1, 2, 3, 4]];
  const algorithms = ["bubble", "merge", "quick"];

  for (const algorithm of algorithms) {
    for (const input of inputs) {
      const original = [...input];
      const trace = generateSortingTrace(algorithm, input);
      assert.deepEqual(trace.sortedValues, [...input].sort((first, second) => first - second));
      assert.equal(trace.operations, trace.comparisons + trace.writes);
      assert.deepEqual(input, original);
    }
  }
});

test("sorting input parser accepts bracketed arrays and rejects malformed entries", () => {
  assert.deepEqual(parseNumberArray(" [8, -2, 3.5] "), [8, -2, 3.5]);
  assert.deepEqual(parseNumberArray("4, 1"), [4, 1]);
  assert.throws(() => parseNumberArray("1,,2"), /entry empty/);
  assert.throws(() => parseNumberArray("[1,2"), /matching square brackets/);
  assert.throws(() => parseNumberArray("1, Infinity"), /finite number/);
  assert.throws(() => parseNumberArray(" "), /at least one number/);
});

const vertices = [
  { id: "A", x: 0, y: 0 },
  { id: "B", x: 1, y: 0 },
  { id: "C", x: 0, y: 1 },
  { id: "D", x: 1, y: 1 },
];

const edges = [
  { id: "ab", from: "A", to: "B", weight: 4 },
  { id: "ac", from: "A", to: "C", weight: 1 },
  { id: "cb", from: "C", to: "B", weight: 2 },
  { id: "bd", from: "B", to: "D", weight: 1 },
  { id: "cd", from: "C", to: "D", weight: 5 },
];

test("Dijkstra finds and reconstructs the minimum path", () => {
  const trace = generateGraphTrace("dijkstra", vertices, edges, "A", "D");
  assert.match(trace.result, /distance from A to D: 4/);
  assert.match(trace.result, /A → C → B → D/);
  assert.deepEqual(trace.steps.at(-1).pathEdges, ["ac", "cb", "bd"]);
});

test("Dijkstra rejects negative weights and reports unreachable targets", () => {
  assert.throws(
    () => generateGraphTrace("dijkstra", vertices, [{ ...edges[0], weight: -1 }], "A", "D"),
    /non-negative edge weights/,
  );
  assert.match(generateGraphTrace("dijkstra", vertices, [], "A", "D").result, /No path exists/);
});

test("BFS and DFS visit reachable vertices once and report disconnected nodes", () => {
  const disconnected = [vertices[0], vertices[1], vertices[2], vertices[3]];
  const traceEdges = [edges[0], edges[1]];
  for (const algorithm of ["bfs", "dfs"]) {
    const trace = generateGraphTrace(algorithm, disconnected, traceEdges, "A");
    assert.match(trace.result, /visited 3 of 4/);
    assert.equal(new Set(trace.steps.at(-1).visitedNodes).size, 3);
  }
});

test("Prim and Kruskal return minimum spanning trees", () => {
  for (const algorithm of ["prim", "kruskal"]) {
    const trace = generateGraphTrace(algorithm, vertices, edges, "A");
    const selected = trace.steps.at(-1).selectedEdges;
    const totalWeight = selected.reduce(
      (total, edgeId) => total + edges.find((edge) => edge.id === edgeId).weight,
      0,
    );
    assert.equal(selected.length, vertices.length - 1);
    assert.equal(totalWeight, 4);
  }
});

test("Knapsack returns an optimal feasible selection and handles empty input", () => {
  const items = [
    { id: "a", name: "A", weight: 1, value: 1 },
    { id: "b", name: "B", weight: 3, value: 4 },
    { id: "c", name: "C", weight: 4, value: 5 },
    { id: "d", name: "D", weight: 5, value: 7 },
  ];
  const solution = solveKnapsack(items, 7);
  assert.equal(solution.maximumValue, 9);
  assert.equal(solution.selectedItems.reduce((total, item) => total + item.weight, 0), 7);
  assert.equal(solveKnapsack([], 0).maximumValue, 0);
  assert.throws(() => solveKnapsack(items, -1), /non-negative whole number/);
});

test("benchmark counters match measured algorithm work without mutating data", () => {
  const input = [4, 3, 2, 1];
  const [bubble, merge] = benchmarkSortingAlgorithms(input, 3);
  assert.equal(bubble.comparisons, 6);
  assert.equal(bubble.writes, 12);
  assert.equal(bubble.operations, 18);
  assert.equal(merge.operations, merge.comparisons + merge.writes);
  assert.ok(bubble.medianMilliseconds >= 0);
  assert.ok(merge.medianMilliseconds >= 0);
  assert.deepEqual(input, [4, 3, 2, 1]);
  assert.throws(() => benchmarkSortingAlgorithms(input, 0), /positive integer/);
});

test("complexity examples report growth values, recursion costs, and loop-body counts", () => {
  assert.deepEqual(getGrowthSamples(8).map((sample) => sample.value), [1, 3, 8, 24, 64, 256]);

  const levels = getMergeSortRecursionTree(16);
  assert.deepEqual(levels.map((level) => level.nodeCount), [1, 2, 4, 8, 16]);
  assert.deepEqual(levels.map((level) => level.totalWork), [16, 16, 16, 16, 16]);
  assert.equal(levels.at(-1)?.isLeaf, true);

  assert.equal(countLoopBodyExecutions("linear", 12), 12);
  assert.equal(countLoopBodyExecutions("nested", 12), 144);
  assert.equal(countLoopBodyExecutions("halving", 9), 4);
  assert.equal(countLoopBodyExecutions("halving", 1), 0);
  assert.throws(() => getGrowthSamples(17), /from 2 to 16/);
  assert.throws(() => getMergeSortRecursionTree(12), /power-of-two/);
});

test("Linear and Binary Search find values and Binary Search validates sorted input", () => {
  assert.equal(linearSearch([8, 3, 7], 3).resultIndex, 1);
  const binary = binarySearch([1, 3, 5, 7, 9, 11, 13], 7);
  assert.equal(binary.resultIndex, 3);
  assert.ok(binary.comparisons < 7);
  assert.equal(binarySearch([], 1).resultIndex, -1);
  assert.throws(() => binarySearch([3, 1, 2], 1), /sorted in ascending order/);
});

test("Rabin-Karp finds overlapping matches, verifies collisions, and indexes Unicode characters", () => {
  const overlapping = generateRabinKarpTrace("ABABABA", "ABA");
  assert.deepEqual(overlapping.matches, [0, 2, 4]);
  const collision = generateRabinKarpTrace("ca", "a", 2, 2);
  assert.equal(collision.collisions, 1);
  assert.deepEqual(collision.matches, [1]);
  assert.deepEqual(generateRabinKarpTrace("😀a😀", "a😀").matches, [1]);
  assert.throws(() => generateRabinKarpTrace("abc", ""), /cannot be empty/);
});

test("BST ordering and AVL rotations preserve sorted traversal", () => {
  const values = [30, 20, 10, 25, 28, 40, 50, 45];
  const bst = values.reduce((root, value) => insertBst(root, value), null);
  const avl = values.reduce((root, value) => insertAvl(root, value), null);
  assert.deepEqual(inorderValues(bst), [...values].sort((first, second) => first - second));
  assert.deepEqual(inorderValues(avl), [...values].sort((first, second) => first - second));
  assert.equal(searchTree(avl, 28), true);
  assert.equal(searchTree(avl, 29), false);
  function assertBalanced(node) {
    if (!node) return 0;
    const leftHeight = assertBalanced(node.left);
    const rightHeight = assertBalanced(node.right);
    assert.ok(Math.abs(leftHeight - rightHeight) <= 1);
    return 1 + Math.max(leftHeight, rightHeight);
  }
  assertBalanced(avl);
});

test("B-tree insertion splits full nodes and keeps every leaf at the same depth", () => {
  const values = [10, 20, 5, 6, 12, 30, 7, 17, 3, 2, 4, 8, 9, 11, 13, 14, 15, 16, 18, 19, 21, 22];
  const root = values.reduce((tree, value) => insertBTree(tree, value), null);
  assert.deepEqual(inorderBTree(root), [...values].sort((first, second) => first - second));
  assert.equal(searchBTree(root, 17), true);
  assert.equal(searchBTree(root, 23), false);
  assert.equal(btreeLevels(root).length > 1, true);
  const leafDepths = new Set();
  function validate(node, depth) {
    assert.ok(node.keys.length <= 3);
    assert.deepEqual(node.keys, [...node.keys].sort((first, second) => first - second));
    if (node.leaf) leafDepths.add(depth);
    else {
      assert.equal(node.children.length, node.keys.length + 1);
      node.children.forEach((child) => validate(child, depth + 1));
    }
  }
  validate(root, 0);
  assert.equal(leafDepths.size, 1);
});

test("weighted scheduling maximizes reward while greedy scheduling maximizes task count", () => {
  const activities = [
    { id: "a", name: "A", start: 1, end: 4, value: 5 },
    { id: "b", name: "B", start: 3, end: 5, value: 6 },
    { id: "c", name: "C", start: 0, end: 6, value: 10 },
    { id: "d", name: "D", start: 5, end: 7, value: 5 },
    { id: "e", name: "E", start: 8, end: 9, value: 3 },
    { id: "f", name: "F", start: 5, end: 9, value: 11 },
  ];
  const weighted = scheduleActivities(activities, "weighted");
  const greedy = scheduleActivities(activities, "greedy");
  assert.equal(weighted.score, 17);
  assert.deepEqual(weighted.selected.map((activity) => activity.id), ["b", "f"]);
  assert.equal(greedy.score, 3);
  assert.throws(() => scheduleActivities([{ ...activities[0], end: 0 }], "weighted"), /finish after start/);
});
