import { useState } from "react";

type LessonCategory = "Sorting" | "Searching" | "Graph" | "Data structures" | "Dynamic programming";

type AlgorithmLesson = {
  name: string;
  category: LessonCategory;
  labPage: string;
  summary: string;
  problem: string;
  approach: string;
  pseudocode: string[];
  python: string;
  best: string;
  average: string;
  worst: string;
  space: string;
  applications: string[];
};

const lessons: AlgorithmLesson[] = [
  {
    name: "Merge Sort",
    category: "Sorting",
    labPage: "Sorting Lab",
    summary: "Sort by dividing the array, sorting each half, then merging the results.",
    problem: "Arrange a sequence in order while keeping worst-case running time predictable.",
    approach: "Recursively split the input until each part has one value. Merge neighboring sorted parts by repeatedly choosing their smallest first value.",
    pseudocode: ["MERGE-SORT(A)", "  if length(A) <= 1: return A", "  split A into L and R", "  return MERGE(MERGE-SORT(L), MERGE-SORT(R))"],
    python: `def merge_sort(values):
    if len(values) <= 1:
        return values[:]

    middle = len(values) // 2
    left = merge_sort(values[:middle])
    right = merge_sort(values[middle:])
    merged = []
    i = j = 0

    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            merged.append(left[i])
            i += 1
        else:
            merged.append(right[j])
            j += 1

    return merged + left[i:] + right[j:]`,
    best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(n)",
    applications: ["Stable ordering of records", "External sorting of data too large for memory", "Sorting linked lists"],
  },
  {
    name: "Quick Sort",
    category: "Sorting",
    labPage: "Sorting Lab",
    summary: "Partition around a pivot, then sort the values on each side.",
    problem: "Sort an array in place with strong average-case performance.",
    approach: "Choose a pivot, move smaller values to its left and larger values to its right, then recursively sort the two partitions.",
    pseudocode: ["QUICK-SORT(A, low, high)", "  if low >= high: return", "  p = PARTITION(A, low, high)", "  QUICK-SORT(A, low, p - 1)", "  QUICK-SORT(A, p + 1, high)"],
    python: `def quick_sort(values):
    result = values[:]

    def partition(low, high):
        pivot = result[high]
        boundary = low
        for index in range(low, high):
            if result[index] <= pivot:
                result[boundary], result[index] = result[index], result[boundary]
                boundary += 1
        result[boundary], result[high] = result[high], result[boundary]
        return boundary

    def sort(low, high):
        if low < high:
            pivot_index = partition(low, high)
            sort(low, pivot_index - 1)
            sort(pivot_index + 1, high)

    sort(0, len(result) - 1)
    return result`,
    best: "O(n log n)", average: "O(n log n)", worst: "O(n²)", space: "O(log n) average recursion stack", 
    applications: ["In-memory sorting", "Partition-based selection", "Sorting numeric arrays"],
  },
  {
    name: "Bubble Sort",
    category: "Sorting",
    labPage: "Sorting Lab",
    summary: "Repeatedly swap adjacent values that are out of order.",
    problem: "Sort a small sequence using a simple, observable comparison process.",
    approach: "Scan adjacent pairs and move the largest remaining value to the end of each pass. Stop early if a pass makes no swaps.",
    pseudocode: ["BUBBLE-SORT(A)", "  repeat", "    swapped = false", "    for each adjacent pair in A", "      if pair is out of order: swap; swapped = true", "  until swapped = false"],
    python: `def bubble_sort(values):
    result = values[:]
    for end in range(len(result) - 1, 0, -1):
        swapped = False
        for index in range(end):
            if result[index] > result[index + 1]:
                result[index], result[index + 1] = result[index + 1], result[index]
                swapped = True
        if not swapped:
            break
    return result`,
    best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(1) auxiliary", 
    applications: ["Teaching adjacent comparisons and loop invariants", "Very small or nearly sorted inputs"],
  },
  {
    name: "Binary Search",
    category: "Searching",
    labPage: "Search Lab",
    summary: "Find a value in a sorted array by repeatedly halving the search interval.",
    problem: "Locate a target efficiently when the input is already sorted.",
    approach: "Compare the target with the middle value. Discard the half that cannot contain the target and repeat.",
    pseudocode: ["BINARY-SEARCH(A, target)", "  low = 0; high = length(A) - 1", "  while low <= high", "    mid = floor((low + high) / 2)", "    if A[mid] = target: return mid", "    if A[mid] < target: low = mid + 1", "    else: high = mid - 1", "  return NOT-FOUND"],
    python: `def binary_search(values, target):
    low, high = 0, len(values) - 1
    while low <= high:
        middle = (low + high) // 2
        if values[middle] == target:
            return middle
        if values[middle] < target:
            low = middle + 1
        else:
            high = middle - 1
    return -1`,
    best: "O(1)", average: "O(log n)", worst: "O(log n)", space: "O(1) iterative", 
    applications: ["Searching sorted indexes", "Lower/upper-bound queries", "Monotonic decision problems"],
  },
  {
    name: "Linear Search",
    category: "Searching",
    labPage: "Search Lab",
    summary: "Inspect each value in order until the target is found or the input ends.",
    problem: "Find a target in an unsorted sequence without requiring preprocessing.",
    approach: "Start at the first value, compare each value with the target, and stop at the first match. If the scan reaches the end, the target is absent.",
    pseudocode: ["LINEAR-SEARCH(A, target)", "  for i = 0 to length(A) - 1", "    if A[i] = target: return i", "  return NOT-FOUND"],
    python: `def linear_search(values, target):
    for index, value in enumerate(values):
        if value == target:
            return index
    return -1`,
    best: "O(1)", average: "O(n)", worst: "O(n)", space: "O(1)",
    applications: ["Small or unsorted collections", "Sequential data streams", "Finding a first matching record"],
  },
  {
    name: "Rabin–Karp",
    category: "Searching",
    labPage: "Search Lab",
    summary: "Use a rolling hash to find a pattern in text, then verify matching windows.",
    problem: "Find every occurrence of a pattern in a longer text, including overlapping matches.",
    approach: "Hash the pattern and first text window. Slide the window by removing the outgoing character and adding the incoming one. Verify characters whenever hashes match so collisions do not create false results.",
    pseudocode: ["RABIN-KARP(text, pattern)", "  hash pattern and first text window", "  for each text window", "    if hashes match and strings are equal: record start", "    update window hash in constant time", "  return recorded starts"],
    python: `def rabin_karp(text, pattern):
    if not pattern or len(pattern) > len(text):
        return []

    base, modulus = 256, 1_000_003
    width = len(pattern)
    high_power = pow(base, width - 1, modulus)
    pattern_hash = window_hash = 0
    for index in range(width):
        pattern_hash = (pattern_hash * base + ord(pattern[index])) % modulus
        window_hash = (window_hash * base + ord(text[index])) % modulus

    matches = []
    for start in range(len(text) - width + 1):
        if pattern_hash == window_hash and text[start:start + width] == pattern:
            matches.append(start)
        if start < len(text) - width:
            outgoing = ord(text[start]) * high_power
            incoming = ord(text[start + width])
            window_hash = (window_hash - outgoing) % modulus
            window_hash = (window_hash * base + incoming) % modulus
    return matches`,
    best: "O(n + m)", average: "O(n + m)", worst: "O(nm)", space: "O(1) auxiliary, excluding results",
    applications: ["Plagiarism screening", "Searching many patterns with shared text windows", "Document search"],
  },
  {
    name: "Breadth-first Search",
    category: "Graph",
    labPage: "Graph Lab",
    summary: "Visit a graph in layers, using a queue to explore nearby vertices first.",
    problem: "Traverse a graph or find a shortest path when every edge has equal cost.",
    approach: "Mark the start, enqueue it, then repeatedly dequeue a vertex and enqueue its unseen neighbors.",
    pseudocode: ["BFS(G, start)", "  mark start; enqueue(start)", "  while queue is not empty", "    v = dequeue()", "    for each neighbor u of v", "      if u is unseen: mark u; enqueue(u)"],
    python: `from collections import deque

def breadth_first_search(graph, start):
    visited = {start}
    queue = deque([start])
    order = []
    while queue:
        vertex = queue.popleft()
        order.append(vertex)
        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return order`,
    best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)", space: "O(V)",
    applications: ["Unweighted shortest paths", "Web crawling", "Level-order traversal"],
  },
  {
    name: "Depth-first Search",
    category: "Graph",
    labPage: "Graph Lab",
    summary: "Explore a branch as far as possible before backtracking.",
    problem: "Traverse connected components and reveal structural relationships in a graph.",
    approach: "Use a stack or recursion. Mark each vertex before following its unvisited neighbors.",
    pseudocode: ["DFS(G, start)", "  mark start; push(start)", "  while stack is not empty", "    v = pop()", "    for each unseen neighbor u of v", "      mark u; push(u)"],
    python: `def depth_first_search(graph, start):
    visited = set()
    stack = [start]
    order = []
    while stack:
        vertex = stack.pop()
        if vertex in visited:
            continue
        visited.add(vertex)
        order.append(vertex)
        for neighbor in reversed(graph[vertex]):
            if neighbor not in visited:
                stack.append(neighbor)
    return order`,
    best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)", space: "O(V)",
    applications: ["Cycle detection", "Connected components", "Topological sorting"],
  },
  {
    name: "Dijkstra's Algorithm",
    category: "Graph",
    labPage: "Graph Lab",
    summary: "Find shortest paths from one source when every edge weight is non-negative.",
    problem: "Compute the minimum path cost from a source to reachable vertices.",
    approach: "Repeatedly settle the unsettled vertex with the smallest known distance, then relax its outgoing edges.",
    pseudocode: ["DIJKSTRA(G, source)", "  dist[source] = 0; all other dist = infinity", "  while an unsettled vertex is reachable", "    u = unsettled vertex with minimum dist", "    settle u", "    for each edge (u, v, w)", "      dist[v] = min(dist[v], dist[u] + w)"],
    python: `from heapq import heappop, heappush
from math import inf

def dijkstra(graph, source):
    distance = {vertex: inf for vertex in graph}
    distance[source] = 0
    queue = [(0, source)]
    while queue:
        cost, vertex = heappop(queue)
        if cost != distance[vertex]:
            continue
        for neighbor, weight in graph[vertex]:
            if weight < 0:
                raise ValueError("Dijkstra requires non-negative weights")
            candidate = cost + weight
            if candidate < distance[neighbor]:
                distance[neighbor] = candidate
                heappush(queue, (candidate, neighbor))
    return distance`,
    best: "O((V + E) log V) with a binary heap", average: "O((V + E) log V)", worst: "O((V + E) log V)", space: "O(V + E)",
    applications: ["Road routing", "Network latency", "Non-negative cost planning"],
  },
  {
    name: "Prim's Algorithm",
    category: "Graph",
    labPage: "Graph Lab",
    summary: "Grow a minimum spanning tree by adding the lightest edge crossing its boundary.",
    problem: "Connect all vertices of a connected weighted graph at minimum total edge cost.",
    approach: "Start from one vertex. At each step, add the minimum-weight edge joining the current tree to a new vertex.",
    pseudocode: ["PRIM(G, start)", "  tree = {start}", "  while tree does not contain every vertex", "    choose lightest edge from tree to outside", "    add that edge and its outside vertex"],
    python: `from heapq import heappop, heappush

def prim(graph, start):
    visited = {start}
    queue = []
    for neighbor, weight in graph[start]:
        heappush(queue, (weight, start, neighbor))
    tree = []
    while queue:
        weight, source, target = heappop(queue)
        if target in visited:
            continue
        visited.add(target)
        tree.append((source, target, weight))
        for neighbor, next_weight in graph[target]:
            if neighbor not in visited:
                heappush(queue, (next_weight, target, neighbor))
    return tree`,
    best: "O(E log V) with a binary heap", average: "O(E log V)", worst: "O(E log V)", space: "O(V + E)",
    applications: ["Low-cost network design", "Road and utility planning", "Clustering"],
  },
  {
    name: "Kruskal's Algorithm",
    category: "Graph",
    labPage: "Graph Lab",
    summary: "Build a minimum spanning forest by adding edges in increasing weight order.",
    problem: "Connect graph components at minimum cost without creating cycles.",
    approach: "Sort all edges by weight and use a disjoint-set structure to decide whether each edge joins separate components.",
    pseudocode: ["KRUSKAL(G)", "  sort edges by nondecreasing weight", "  make a separate set for each vertex", "  for each edge (u, v)", "    if FIND(u) != FIND(v): add edge; UNION(u, v)"],
    python: `def kruskal(vertices, edges):
    parent = {vertex: vertex for vertex in vertices}

    def find(vertex):
        if parent[vertex] != vertex:
            parent[vertex] = find(parent[vertex])
        return parent[vertex]

    tree = []
    for weight, first, second in sorted(edges):
        first_root, second_root = find(first), find(second)
        if first_root != second_root:
            parent[first_root] = second_root
            tree.append((first, second, weight))
    return tree`,
    best: "O(E log E)", average: "O(E log E)", worst: "O(E log E)", space: "O(V)",
    applications: ["Network infrastructure", "Sparse graph connectivity", "Minimum-cost wiring"],
  },
  {
    name: "0/1 Knapsack",
    category: "Dynamic programming",
    labPage: "Experiments",
    summary: "Choose items with maximum value while keeping total weight within capacity.",
    problem: "Select each item at most once under a fixed capacity constraint.",
    approach: "For every item and capacity, compare leaving the item out with taking it and using the best value for the remaining capacity.",
    pseudocode: ["KNAPSACK(weights, values, capacity)", "  dp[0..n][0..capacity] = 0", "  for item i from 1 to n", "    for capacity c from 0 to capacity", "      dp[i][c] = dp[i-1][c]", "      if weight[i] <= c: maximize with value[i] + dp[i-1][c-weight[i]]"],
    python: `def knapsack(weights, values, capacity):
    rows = len(weights) + 1
    best = [[0] * (capacity + 1) for _ in range(rows)]
    for item in range(1, rows):
        weight = weights[item - 1]
        value = values[item - 1]
        for room in range(capacity + 1):
            best[item][room] = best[item - 1][room]
            if weight <= room:
                best[item][room] = max(
                    best[item][room],
                    value + best[item - 1][room - weight],
                )
    return best[-1][-1]`,
    best: "O(nW)", average: "O(nW)", worst: "O(nW)", space: "O(nW)", 
    applications: ["Cargo selection", "Budget allocation", "Resource planning"],
  },
  {
    name: "B-tree Search",
    category: "Data structures",
    labPage: "Structures Lab",
    summary: "Search a balanced multiway tree by narrowing the key range at each node.",
    problem: "Find a key in an ordered tree while keeping its height small as records are inserted.",
    approach: "Scan the current node's sorted keys. If the target is not present, descend through the child whose key interval can contain it. B-trees split full nodes during insertion to remain balanced.",
    pseudocode: ["B-TREE-SEARCH(node, key)", "  i = first index where node.keys[i] >= key", "  if i is inside node and node.keys[i] = key: return true", "  if node is a leaf: return false", "  return B-TREE-SEARCH(node.children[i], key)"],
    python: `def btree_search(node, key):
    index = 0
    while index < len(node.keys) and key > node.keys[index]:
        index += 1

    if index < len(node.keys) and key == node.keys[index]:
        return True
    if node.leaf:
        return False
    return btree_search(node.children[index], key)`,
    best: "O(log n)", average: "O(log n)", worst: "O(log n)", space: "O(log n) recursion stack",
    applications: ["Database indexes", "File-system indexes", "Storage systems with block reads"],
  },
];

const categories: (LessonCategory | "All")[] = ["All", "Sorting", "Searching", "Graph", "Data structures", "Dynamic programming"];

function AlgorithmLibrary({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [selectedName, setSelectedName] = useState(lessons[0].name);
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [query, setQuery] = useState("");
  const selectedLesson = lessons.find((lesson) => lesson.name === selectedName) ?? lessons[0];
  const visibleLessons = lessons.filter((lesson) =>
    (category === "All" || lesson.category === category) &&
    `${lesson.name} ${lesson.summary}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="algorithm-library">
      <header className="library-heading">
        <span className="section-eyebrow">ALGORITHM KNOWLEDGE CENTRE</span>
        <h1>Algorithm Library</h1>
        <p>Learn the problem, reasoning, pseudocode, implementation, and complexity behind each algorithm.</p>
      </header>

      <div className="library-layout">
        <aside className="library-index">
          <label className="library-search">
            <span>Find an algorithm</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search algorithms" />
          </label>
          <div className="library-categories" aria-label="Filter by category">
            {categories.map((item) => (
              <button className={category === item ? "active" : ""} key={item} onClick={() => setCategory(item)}>{item}</button>
            ))}
          </div>
          <div className="library-lesson-list">
            {visibleLessons.map((lesson) => (
              <button
                className={`library-lesson-link ${selectedLesson.name === lesson.name ? "active" : ""}`}
                key={lesson.name}
                onClick={() => setSelectedName(lesson.name)}
              >
                <span>{lesson.name}</span>
                <small>{lesson.category}</small>
              </button>
            ))}
            {visibleLessons.length === 0 && <p className="library-no-results">No matching algorithms.</p>}
          </div>
        </aside>

        <article className="lesson-content">
          <div className="lesson-title-row">
            <div>
              <span className="lesson-category-tag">{selectedLesson.category}</span>
              <h2>{selectedLesson.name}</h2>
              <p>{selectedLesson.summary}</p>
            </div>
          </div>

          <section className="lesson-section">
            <h3>Problem</h3>
            <p>{selectedLesson.problem}</p>
          </section>
          <section className="lesson-section">
            <h3>Approach</h3>
            <p>{selectedLesson.approach}</p>
          </section>
          <section className="lesson-section">
            <h3>Pseudocode</h3>
            <pre className="lesson-pseudocode"><code>{selectedLesson.pseudocode.join("\n")}</code></pre>
          </section>
          <section className="lesson-section">
            <h3>Python implementation</h3>
            <pre className="lesson-python"><code>{selectedLesson.python}</code></pre>
          </section>
          <section className="lesson-section">
            <h3>Complexity</h3>
            <div className="lesson-complexity-grid">
              <div><span>Best case</span><strong>{selectedLesson.best}</strong></div>
              <div><span>Average case</span><strong>{selectedLesson.average}</strong></div>
              <div><span>Worst case</span><strong>{selectedLesson.worst}</strong></div>
              <div><span>Auxiliary space</span><strong>{selectedLesson.space}</strong></div>
            </div>
          </section>
          <section className="lesson-section">
            <h3>Applications</h3>
            <ul className="lesson-applications">
              {selectedLesson.applications.map((application) => <li key={application}>{application}</li>)}
            </ul>
          </section>
          <section className="lesson-section lesson-visualization-section">
            <h3>Interactive visualization</h3>
            <button className="primary-button lesson-visualization-button" onClick={() => onNavigate(selectedLesson.labPage)}>
              Open {selectedLesson.labPage}
            </button>
          </section>
        </article>
      </div>
    </div>
  );
}

export default AlgorithmLibrary;
