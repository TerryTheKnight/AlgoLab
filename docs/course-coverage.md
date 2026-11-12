# DAA course coverage

This map connects common Design and Analysis of Algorithms topics to a working AlgoLab feature. The examples are designed for classroom demonstration; benchmark timings depend on the browser and device.

| Course topic | AlgoLab coverage |
| --- | --- |
| Algorithm specification and reasoning | Algorithm Library problem statements, approaches, pseudocode, Python references, complexity, and applications |
| Big-O, Big-Omega, and Big-Theta | Complexity Lab notation cards and interactive growth comparison |
| Recursive analysis | Merge Sort recurrence tree with per-level work and leaf counts |
| Non-recursive analysis | Adjustable loop-body counter for linear, nested, and repeated-doubling loops |
| Bubble, Merge, and Quick Sort | Sorting Lab traces, playback, custom inputs, and operation counts |
| Empirical analysis | Complexity Lab three-run median; Experiments page compares growth over four input sizes |
| Linear and Binary Search | Search Lab step traces and sorted-input validation |
| String matching | Rabin–Karp rolling-hash trace with collision verification and overlapping matches |
| Linked lists, stacks, and queues | Structures Lab operations and visual state |
| BST, AVL, and B-tree | Structures Lab insertion/search, traversal, AVL rotations, and B-tree splits |
| Graph traversal | Graph Lab BFS and DFS traces, including disconnected vertices |
| Shortest-path problems | Graph Lab Dijkstra trace and reconstructed route on non-negative weighted graphs |
| Delivery route example | Use the weighted graph editor as a small road map and demonstrate a lowest-cost route with Dijkstra |
| Minimum spanning trees | Graph Lab Prim and Kruskal traces for network connection costs |
| Dynamic programming | Cargo 0/1 Knapsack simulator and its DP table |
| Greedy and weighted scheduling | Task simulator compares maximum activity count with maximum total reward |

## Limits to keep clear in a presentation

- The graph editor uses undirected weighted edges. Dijkstra rejects negative edge weights.
- Prim and Kruskal can show a spanning forest for disconnected graphs; a disconnected graph has no single spanning tree.
- Benchmarks run in the browser and exclude visualization. They report measured time and instrumented operation counts; memory usage is not measured.
- The loop counter counts loop-body executions for the pseudocode displayed. It does not count comparisons, increments, or assignments in the loop control.
- Python examples in the library are educational references; the interactive application executes its TypeScript implementations.
