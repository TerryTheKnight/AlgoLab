export type GraphVertex = {
  id: string;
  x: number;
  y: number;
};

export type GraphEdge = {
  id: string;
  from: string;
  to: string;
  weight: number;
};

export type GraphAlgorithm = "bfs" | "dfs" | "dijkstra" | "prim" | "kruskal";

export type GraphTraceStep = {
  kind: "visit" | "inspect" | "relax" | "select" | "reject" | "complete";
  message: string;
  currentNode: string | null;
  currentEdgeId: string | null;
  visitedNodes: string[];
  selectedEdges: string[];
  pathEdges: string[];
  distances: Record<string, number>;
  operations: number;
};

export type GraphTrace = {
  steps: GraphTraceStep[];
  complexity: string;
  result: string;
};

type Neighbor = {
  vertexId: string;
  edge: GraphEdge;
};

const complexityByAlgorithm: Record<GraphAlgorithm, string> = {
  bfs: "O(V + E)",
  dfs: "O(V + E)",
  dijkstra: "O(V² + E)",
  prim: "O(VE)",
  kruskal: "O(E log E)",
};

export function generateGraphTrace(
  algorithm: GraphAlgorithm,
  vertices: GraphVertex[],
  edges: GraphEdge[],
  sourceId: string,
  targetId?: string,
): GraphTrace {
  const vertexIds = vertices.map((vertex) => vertex.id);
  if (vertexIds.length > 0 && !vertexIds.includes(sourceId)) {
    throw new Error(`Unknown source vertex: ${sourceId}.`);
  }
  if (algorithm === "dijkstra" && targetId && !vertexIds.includes(targetId)) {
    throw new Error(`Unknown destination vertex: ${targetId}.`);
  }
  for (const edge of edges) {
    if (!vertexIds.includes(edge.from) || !vertexIds.includes(edge.to)) {
      throw new Error(`Edge ${edge.id} references an unknown vertex.`);
    }
    if (!Number.isFinite(edge.weight)) {
      throw new Error("Edge weights must be finite numbers.");
    }
    if (algorithm === "dijkstra" && edge.weight < 0) {
      throw new Error("Dijkstra's algorithm requires non-negative edge weights.");
    }
  }
  const startId = vertexIds.includes(sourceId) ? sourceId : vertexIds[0];
  const adjacency = new Map<string, Neighbor[]>(
    vertexIds.map((id) => [id, []]),
  );

  for (const edge of edges) {
    const fromNeighbors = adjacency.get(edge.from);
    const toNeighbors = adjacency.get(edge.to);
    if (!fromNeighbors || !toNeighbors) continue;
    fromNeighbors.push({ vertexId: edge.to, edge });
    toNeighbors.push({ vertexId: edge.from, edge });
  }

  for (const neighbors of adjacency.values()) {
    neighbors.sort((first, second) => first.vertexId.localeCompare(second.vertexId));
  }

  const steps: GraphTraceStep[] = [];
  const visited = new Set<string>();
  const selectedEdges = new Set<string>();
  const pathEdges: string[] = [];
  const distances = Object.fromEntries(
    vertexIds.map((id) => [id, Number.POSITIVE_INFINITY]),
  ) as Record<string, number>;
  let operations = 0;

  function recordStep(
    kind: GraphTraceStep["kind"],
    message: string,
    currentNode: string | null = null,
    currentEdgeId: string | null = null,
  ) {
    steps.push({
      kind,
      message,
      currentNode,
      currentEdgeId,
      visitedNodes: [...visited],
      selectedEdges: [...selectedEdges],
      pathEdges: [...pathEdges],
      distances: { ...distances },
      operations,
    });
  }

  if (vertexIds.length === 0) {
    return { steps, complexity: complexityByAlgorithm[algorithm], result: "Add vertices to begin." };
  }

  if (algorithm === "bfs") {
    const queue = [startId];
    let queueIndex = 0;
    visited.add(startId);

    while (queueIndex < queue.length) {
      const currentId = queue[queueIndex];
      queueIndex += 1;
      recordStep("visit", `Visit vertex ${currentId}.`, currentId);

      for (const neighbor of adjacency.get(currentId) ?? []) {
        operations += 1;
        recordStep(
          "inspect",
          `Inspect edge ${currentId}–${neighbor.vertexId}.`,
          currentId,
          neighbor.edge.id,
        );
        if (!visited.has(neighbor.vertexId)) {
          visited.add(neighbor.vertexId);
          selectedEdges.add(neighbor.edge.id);
          queue.push(neighbor.vertexId);
        }
      }
    }

    const result = `BFS visited ${visited.size} of ${vertexIds.length} vertices from ${startId}.`;
    recordStep("complete", result);
    return { steps, complexity: complexityByAlgorithm[algorithm], result };
  }

  if (algorithm === "dfs") {
    const stack = [startId];
    const discovered = new Set([startId]);

    while (stack.length > 0) {
      const currentId = stack.pop()!;
      visited.add(currentId);
      recordStep("visit", `Visit vertex ${currentId}.`, currentId);
      const neighbors = [...(adjacency.get(currentId) ?? [])].reverse();

      for (const neighbor of neighbors) {
        operations += 1;
        recordStep(
          "inspect",
          `Inspect edge ${currentId}–${neighbor.vertexId}.`,
          currentId,
          neighbor.edge.id,
        );
        if (!discovered.has(neighbor.vertexId)) {
          discovered.add(neighbor.vertexId);
          selectedEdges.add(neighbor.edge.id);
          stack.push(neighbor.vertexId);
        }
      }
    }

    const result = `DFS visited ${visited.size} of ${vertexIds.length} vertices from ${startId}.`;
    recordStep("complete", result);
    return { steps, complexity: complexityByAlgorithm[algorithm], result };
  }

  if (algorithm === "dijkstra") {
    distances[startId] = 0;
    const unsettled = new Set(vertexIds);
    const previousEdges = new Map<string, string>();

    while (unsettled.size > 0) {
      let currentId: string | undefined;
      for (const candidateId of unsettled) {
        if (
          currentId === undefined ||
          distances[candidateId] < distances[currentId]
        ) {
          currentId = candidateId;
        }
      }

      if (currentId === undefined || !Number.isFinite(distances[currentId])) break;
      unsettled.delete(currentId);
      visited.add(currentId);
      recordStep("visit", `Settle ${currentId} at distance ${distances[currentId]}.`, currentId);
      if (targetId && currentId === targetId) break;

      for (const neighbor of adjacency.get(currentId) ?? []) {
        operations += 1;
        if (visited.has(neighbor.vertexId)) continue;
        const candidateDistance = distances[currentId] + neighbor.edge.weight;
        const currentDistance = distances[neighbor.vertexId];
        if (candidateDistance < currentDistance) {
          distances[neighbor.vertexId] = candidateDistance;
          previousEdges.set(neighbor.vertexId, neighbor.edge.id);
          recordStep(
            "relax",
            `Update ${neighbor.vertexId}: ${candidateDistance} via ${currentId}.`,
            neighbor.vertexId,
            neighbor.edge.id,
          );
        } else {
          recordStep(
            "inspect",
            `Keep ${neighbor.vertexId} at ${currentDistance}; the route through ${currentId} is longer.`,
            neighbor.vertexId,
            neighbor.edge.id,
          );
        }
      }
    }

    let result = targetId
      ? `Shortest distance from ${startId} to ${targetId}: ${distances[targetId]}.`
      : `Computed shortest distances from ${startId}.`;
    if (targetId && Number.isFinite(distances[targetId])) {
      let currentId = targetId;
      const pathVertices = [targetId];
      while (currentId !== startId) {
        const edgeId = previousEdges.get(currentId);
        if (!edgeId) break;
        pathEdges.unshift(edgeId);
        const edge = edges.find((candidate) => candidate.id === edgeId);
        if (!edge) break;
        currentId = edge.from === currentId ? edge.to : edge.from;
        pathVertices.unshift(currentId);
      }
      result += ` Path: ${pathVertices.join(" → ")}.`;
    } else if (targetId) {
      result = `No path exists from ${startId} to ${targetId}.`;
    }
    recordStep("complete", result);
    return { steps, complexity: complexityByAlgorithm[algorithm], result };
  }

  if (algorithm === "prim") {
    visited.add(startId);
    recordStep("visit", `Start the tree at ${startId}.`, startId);

    while (visited.size < vertexIds.length) {
      let bestEdge: GraphEdge | undefined;
      for (const edge of edges) {
        operations += 1;
        const crossesTree = visited.has(edge.from) !== visited.has(edge.to);
        if (!crossesTree) continue;
        if (!bestEdge || edge.weight < bestEdge.weight) bestEdge = edge;
      }

      if (!bestEdge) break;
      selectedEdges.add(bestEdge.id);
      const nextId = visited.has(bestEdge.from) ? bestEdge.to : bestEdge.from;
      visited.add(nextId);
      recordStep(
        "select",
        `Add edge ${bestEdge.from}–${bestEdge.to} with weight ${bestEdge.weight}.`,
        nextId,
        bestEdge.id,
      );
    }

    const result = visited.size === vertexIds.length
      ? `Minimum spanning tree weight: ${[...selectedEdges].reduce((sum, id) => sum + edges.find((edge) => edge.id === id)!.weight, 0)}.`
      : `The graph is disconnected; built a minimum spanning tree for ${visited.size} reachable vertices.`;
    recordStep("complete", result);
    return { steps, complexity: complexityByAlgorithm[algorithm], result };
  }

  const parent = new Map(vertexIds.map((id) => [id, id]));

  function find(vertexId: string): string {
    const parentId = parent.get(vertexId)!;
    if (parentId === vertexId) return vertexId;
    const rootId = find(parentId);
    parent.set(vertexId, rootId);
    return rootId;
  }

  const sortedEdges = [...edges].sort(
    (first, second) => first.weight - second.weight || first.id.localeCompare(second.id),
  );
  for (const edge of sortedEdges) {
    if (selectedEdges.size === vertexIds.length - 1) break;
    operations += 1;
    const fromRoot = find(edge.from);
    const toRoot = find(edge.to);
    if (fromRoot !== toRoot) {
      parent.set(fromRoot, toRoot);
      selectedEdges.add(edge.id);
      recordStep(
        "select",
        `Select edge ${edge.from}–${edge.to} with weight ${edge.weight}.`,
        null,
        edge.id,
      );
    } else {
      recordStep(
        "reject",
        `Reject edge ${edge.from}–${edge.to}; it would create a cycle.`,
        null,
        edge.id,
      );
    }
  }

  for (const edgeId of selectedEdges) {
    const edge = edges.find((candidate) => candidate.id === edgeId)!;
    visited.add(edge.from);
    visited.add(edge.to);
  }
  if (vertexIds.length === 1) visited.add(vertexIds[0]);
  const forestWeight = [...selectedEdges].reduce(
    (sum, edgeId) => sum + edges.find((edge) => edge.id === edgeId)!.weight,
    0,
  );
  const result = visited.size === vertexIds.length
    ? `Minimum spanning tree weight: ${forestWeight}.`
    : `Minimum spanning forest weight: ${forestWeight}; the graph is disconnected.`;
  recordStep("complete", result);
  return { steps, complexity: complexityByAlgorithm[algorithm], result };
}
