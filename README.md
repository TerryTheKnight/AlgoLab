# AlgoLab

**Understand. Visualize. Analyze. Optimize.**

AlgoLab is an interactive learning platform for Design and Analysis of Algorithms (DAA). Students can run algorithms step by step, inspect decisions and operation counts, compare measured performance, and study reference implementations.

## Learning modules

- **Sorting Lab:** Bubble Sort, Merge Sort, and Quick Sort with custom or random arrays, trace playback, speed controls, comparison/write counts, and complexity summaries.
- **Graph Lab:** Edit or generate weighted graphs and trace BFS, DFS, Dijkstra, Prim, and Kruskal. The visualization highlights traversed vertices, shortest paths, and spanning-tree edges.
- **Structures Lab:** Practice stack, queue, singly linked-list, binary-search-tree, AVL-tree, and B-tree operations. Inspect in-order traversal, AVL balancing, and B-tree node splits.
- **Search Lab:** Step through Linear Search and Binary Search, or find overlapping text matches with Rabin–Karp and rolling-hash collision verification.
- **Complexity Lab:** Learn Big-O, Big-Omega, and Big-Theta; explore a Merge Sort recursion tree; count loop-body operations; and compare Bubble Sort with Merge Sort using a warm-up and three-run median.
- **Experiments:** Chart runtime and operation growth over four input sizes, solve 0/1 cargo Knapsack with its DP table, and compare greedy with weighted task scheduling.
- **Algorithm Library:** Thirteen learning pages include problem statements, approaches, pseudocode, Python reference implementations, complexity, applications, and links to the relevant interactive lab.

The app runs its interactive algorithms in the browser and needs no server or database. Python examples in the library are reference implementations; the visualizers themselves run in TypeScript. This keeps the project easy to install, teach, and publish as a static site.

## Quick start

Requirements: Node.js 22.12 or newer and npm 10 or newer.

```sh
npm ci
npm run dev
```

## Quality checks

```sh
npm test
npm run lint
npm run build
```

The test suite uses Node's built-in test runner and covers algorithm results, invalid inputs, edge cases, and operation counts.

## DAA course coverage

Download the [AlgoLab project report](docs/AlgoLab_Project_Report.docx).

See [the syllabus coverage map](docs/course-coverage.md) for the concepts and labs included. The [project roadmap](docs/roadmap.md) lists completed work and sensible follow-on ideas.

## Benchmark methodology

Each sorting benchmark warms up the implementation, then measures three runs on the same generated input and reports the median. Dataset generation and visualization are outside the timed section. Runtime includes each algorithm's working-array copies. Comparison counts and array writes are counted separately; memory use is not measured. Browser timing varies with device load and should be repeated across sizes and input orders.

## Deploy to GitHub Pages

The repository includes GitHub Actions workflows for checks and Pages deployment. Push to the `main` branch, then enable **Settings → Pages → Build and deployment → GitHub Actions** in the GitHub repository. The deployment workflow derives the Vite base path from the repository name.

## Project structure

```text
src/
  components/layout/       Sidebar and shared application navigation
  features/sorting/        Sort traces, parsing, and playback
  features/graph/          Graph algorithms and graph editor
  features/search/         Array search and Rabin–Karp
  features/structures/     Stack, queue, linked list, BST, AVL, and B-tree
  features/complexity/     Benchmarks, asymptotic notation, recursion trees, and loop counts
  features/experiments/    Knapsack and task scheduling
  features/library/        Algorithm reference pages
tests/                     Node built-in algorithm regression tests
.github/workflows/         Continuous integration and Pages deployment
docs/course-coverage.md    DAA syllabus-to-feature mapping
docs/roadmap.md            Completed scope and follow-on ideas
```

## License

AlgoLab is available under the MIT License. See [LICENSE](LICENSE).
