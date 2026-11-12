# AlgoLab architecture

## Overview

AlgoLab is a static React application built with Vite and TypeScript. Feature pages live under `src/features`; the shared sidebar and active-page routing remain in the main application. Algorithm functions are kept separate from their visual controls so the same engines can be tested without rendering the UI.

The app currently runs entirely in the browser. It has no API service, database, authentication, or saved user accounts. This keeps classroom use and GitHub Pages deployment simple. The Python snippets in Algorithm Library are learning references and are not executed by the web app.

## Feature boundaries

- `sorting`: input parsing, operation traces for Bubble/Merge/Quick Sort, and playback.
- `graph`: undirected weighted graph data, traversal, shortest-path and spanning-tree traces.
- `search`: Linear Search, Binary Search, and Rabin–Karp trace generation.
- `structures`: tree insertion, traversal, search, layout, and AVL rotations; stack, queue, and list operations are held by the page.
- `complexity`: asymptotic growth examples, Merge Sort recursion-tree and loop-count models, independent sorting implementations, and repeated timing measurements.
- `experiments`: 0/1 Knapsack and interval scheduling algorithms with editable inputs.
- `library`: static algorithm lessons and Python reference implementations.

## Complexity notes

Complexity labels describe the implementations in this project:

| Algorithm | Implementation | Time | Extra space |
| --- | --- | --- | --- |
| Bubble Sort | Early exit after a swap-free pass | Best O(n), average/worst O(n²) | O(1) |
| Merge Sort | Recursive array splitting and merge buffers | O(n log n) | O(n) |
| Quick Sort | Last-element Lomuto pivot | Average O(n log n), worst O(n²) | O(log n) average recursion |
| BFS / DFS | Adjacency lists | O(V + E) | O(V) |
| Dijkstra | Linear scan for next unsettled vertex | O(V² + E) | O(V + E) |
| Prim | Repeated scan of graph edges | O(VE) | O(V) |
| Kruskal | Edge sort plus disjoint sets | O(E log E) | O(V) |
| 0/1 Knapsack | Full capacity DP table | O(nW) | O(nW) |
| Weighted interval scheduling | Finish-time sort and predecessor scan | O(n²) | O(n) |

The Complexity Lab's notation panel compares illustrative functions; it does not infer a formal bound from source code. Its recursion tree is for the recurrence `T(n) = 2T(n/2) + Θ(n)`. The loop counter reports body executions for explicitly shown loop patterns, not every control operation.

Graph inputs are undirected. Dijkstra accepts only non-negative weights. Prim and Kruskal support disconnected inputs by reporting a partial tree or a forest.

## Verification

`tests/algorithms.test.mjs` uses Node's built-in test runner and imports the pure TypeScript modules with Node's type-stripping support. The same suite is run by GitHub Actions before production builds.
