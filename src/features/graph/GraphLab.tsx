import { useEffect, useState } from "react";
import type {
  GraphAlgorithm,
  GraphEdge,
  GraphTrace,
  GraphVertex,
} from "./graphAlgorithms";
import { generateGraphTrace } from "./graphAlgorithms";

const exampleVertices: GraphVertex[] = [
  { id: "A", x: 400, y: 62 },
  { id: "B", x: 635, y: 145 },
  { id: "C", x: 635, y: 315 },
  { id: "D", x: 400, y: 398 },
  { id: "E", x: 165, y: 315 },
  { id: "F", x: 165, y: 145 },
];

const exampleEdges: GraphEdge[] = [
  { id: "edge-1", from: "A", to: "B", weight: 4 },
  { id: "edge-2", from: "A", to: "F", weight: 2 },
  { id: "edge-3", from: "B", to: "C", weight: 3 },
  { id: "edge-4", from: "B", to: "F", weight: 1 },
  { id: "edge-5", from: "B", to: "E", weight: 5 },
  { id: "edge-6", from: "C", to: "D", weight: 2 },
  { id: "edge-7", from: "C", to: "E", weight: 2 },
  { id: "edge-8", from: "D", to: "E", weight: 6 },
  { id: "edge-9", from: "E", to: "F", weight: 1 },
];

const algorithmOptions: { id: GraphAlgorithm; label: string; description: string }[] = [
  {
    id: "dijkstra",
    label: "Dijkstra's shortest path",
    description: "Find minimum distances using non-negative edge weights.",
  },
  {
    id: "bfs",
    label: "Breadth-first search",
    description: "Explore the graph level by level using a queue.",
  },
  {
    id: "dfs",
    label: "Depth-first search",
    description: "Explore one branch at a time using a stack.",
  },
  {
    id: "prim",
    label: "Prim's minimum spanning tree",
    description: "Grow a spanning tree by repeatedly choosing its lightest crossing edge.",
  },
  {
    id: "kruskal",
    label: "Kruskal's minimum spanning tree",
    description: "Add edges by weight while rejecting edges that create cycles.",
  },
];

function createVertices(count: number): GraphVertex[] {
  return Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * Math.PI * 2 - Math.PI / 2;
    return {
      id: String.fromCharCode(65 + index),
      x: 400 + 275 * Math.cos(angle),
      y: 230 + 170 * Math.sin(angle),
    };
  });
}

function createRandomGraph() {
  const vertices = createVertices(6);
  const edges: GraphEdge[] = [];
  let edgeNumber = 1;

  for (let index = 1; index < vertices.length; index += 1) {
    edges.push({
      id: `edge-${edgeNumber}`,
      from: vertices[index - 1].id,
      to: vertices[index].id,
      weight: Math.floor(Math.random() * 9) + 1,
    });
    edgeNumber += 1;
  }

  for (let fromIndex = 0; fromIndex < vertices.length; fromIndex += 1) {
    for (let toIndex = fromIndex + 2; toIndex < vertices.length; toIndex += 1) {
      if (Math.random() < 0.32) {
        edges.push({
          id: `edge-${edgeNumber}`,
          from: vertices[fromIndex].id,
          to: vertices[toIndex].id,
          weight: Math.floor(Math.random() * 9) + 1,
        });
        edgeNumber += 1;
      }
    }
  }

  return { vertices, edges };
}

function formatDistance(distance: number | undefined) {
  return distance === undefined || !Number.isFinite(distance) ? "∞" : distance;
}

function GraphLab() {
  const [vertices, setVertices] = useState(exampleVertices);
  const [edges, setEdges] = useState(exampleEdges);
  const [algorithm, setAlgorithm] = useState<GraphAlgorithm>("dijkstra");
  const [sourceId, setSourceId] = useState("A");
  const [targetId, setTargetId] = useState("D");
  const [edgeFrom, setEdgeFrom] = useState("A");
  const [edgeTo, setEdgeTo] = useState("B");
  const [weight, setWeight] = useState("4");
  const [trace, setTrace] = useState<GraphTrace | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [error, setError] = useState("");
  const activeStep = trace?.steps[currentStep];
  const selectedAlgorithm = algorithmOptions.find((option) => option.id === algorithm)!;

  useEffect(() => {
    if (!isPlaying || !trace || currentStep >= trace.steps.length - 1) return;

    const timer = setTimeout(() => {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (nextStep >= trace.steps.length - 1) setIsPlaying(false);
    }, speed);

    return () => clearTimeout(timer);
  }, [currentStep, isPlaying, speed, trace]);

  function clearTrace() {
    setIsPlaying(false);
    setTrace(null);
    setCurrentStep(0);
  }

  function handleRun() {
    setError("");
    setIsPlaying(false);

    const nextTrace = generateGraphTrace(
      algorithm,
      vertices,
      edges,
      sourceId,
      algorithm === "dijkstra" ? targetId : undefined,
    );
    setTrace(nextTrace);
    setCurrentStep(0);
  }

  function handleAddVertex() {
    if (vertices.length >= 10) {
      setError("The editor supports up to 10 vertices.");
      return;
    }

    const nextId = String.fromCharCode(65 + vertices.length);
    setVertices(createVertices(vertices.length + 1));
    setEdgeTo(nextId);
    setError("");
    clearTrace();
  }

  function handleAddEdge() {
    const edgeWeight = Number(weight);
    if (edgeFrom === edgeTo) {
      setError("Choose two different vertices for an edge.");
      return;
    }
    if (weight.trim().length === 0 || !Number.isInteger(edgeWeight) || edgeWeight < 0 || edgeWeight > 999) {
      setError("Edge weights must be whole numbers from 0 to 999.");
      return;
    }

    const alreadyConnected = edges.some(
      (edge) =>
        (edge.from === edgeFrom && edge.to === edgeTo) ||
        (edge.from === edgeTo && edge.to === edgeFrom),
    );
    if (alreadyConnected) {
      setError(`An edge already connects ${edgeFrom} and ${edgeTo}.`);
      return;
    }

    let nextEdgeNumber = edges.length + 1;
    while (edges.some((edge) => edge.id === `edge-${nextEdgeNumber}`)) {
      nextEdgeNumber += 1;
    }
    setEdges((current) => [
      ...current,
      {
        id: `edge-${nextEdgeNumber}`,
        from: edgeFrom,
        to: edgeTo,
        weight: edgeWeight,
      },
    ]);
    setError("");
    clearTrace();
  }

  function handleRemoveEdge(edgeId: string) {
    setEdges((current) => current.filter((edge) => edge.id !== edgeId));
    clearTrace();
  }

  function handleRandomGraph() {
    const nextGraph = createRandomGraph();
    setVertices(nextGraph.vertices);
    setEdges(nextGraph.edges);
    setSourceId(nextGraph.vertices[0].id);
    setTargetId(nextGraph.vertices[nextGraph.vertices.length - 1].id);
    setEdgeFrom(nextGraph.vertices[0].id);
    setEdgeTo(nextGraph.vertices[1].id);
    setError("");
    clearTrace();
  }

  function handleResetGraph() {
    setVertices(exampleVertices);
    setEdges(exampleEdges);
    setSourceId("A");
    setTargetId("D");
    setEdgeFrom("A");
    setEdgeTo("B");
    setError("");
    clearTrace();
  }

  function togglePlayback() {
    if (!trace || trace.steps.length === 0) return;
    if (currentStep >= trace.steps.length - 1) setCurrentStep(0);
    setIsPlaying((playing) => !playing);
  }

  const visitedNodes = new Set(activeStep?.visitedNodes ?? []);
  const selectedEdges = new Set(activeStep?.selectedEdges ?? []);
  const pathEdges = new Set(activeStep?.pathEdges ?? []);

  return (
    <div className="graph-lab">
      <div className="graph-lab-heading">
        <div>
          <span className="section-eyebrow">DAA VISUALIZATION</span>
          <h1>Graph Laboratory</h1>
          <p>Build a weighted graph, choose an algorithm, and follow each decision.</p>
        </div>
        <div className="graph-heading-actions">
          <button className="graph-secondary-button" onClick={handleRandomGraph}>Random graph</button>
          <button className="graph-secondary-button" onClick={handleResetGraph}>Reset example</button>
        </div>
      </div>

      <div className="graph-control-panel">
        <label>
          Algorithm
          <select
            value={algorithm}
            onChange={(event) => {
              setAlgorithm(event.target.value as GraphAlgorithm);
              clearTrace();
            }}
          >
            {algorithmOptions.map((option) => (
              <option key={option.id} value={option.id}>{option.label}</option>
            ))}
          </select>
        </label>
        <label>
          Start vertex
          <select value={sourceId} onChange={(event) => { setSourceId(event.target.value); clearTrace(); }}>
            {vertices.map((vertex) => <option key={vertex.id} value={vertex.id}>{vertex.id}</option>)}
          </select>
        </label>
        {algorithm === "dijkstra" && (
          <label>
            Destination
            <select value={targetId} onChange={(event) => { setTargetId(event.target.value); clearTrace(); }}>
              {vertices.map((vertex) => <option key={vertex.id} value={vertex.id}>{vertex.id}</option>)}
            </select>
          </label>
        )}
        <div className="graph-algorithm-note">
          <strong>{selectedAlgorithm.label}</strong>
          <span>{selectedAlgorithm.description}</span>
          {trace && <span>Implementation complexity: {trace.complexity}</span>}
        </div>
        <button className="primary-button graph-run-button" onClick={handleRun}>Run algorithm</button>
      </div>

      {error && <p className="graph-error" role="alert">{error}</p>}

      <div className="graph-workspace">
        <section className="graph-canvas-panel" aria-label="Graph visualization">
          <div className="graph-canvas-heading">
            <div>
              <h2>Weighted graph</h2>
              <span>{vertices.length} vertices · {edges.length} edges</span>
            </div>
            <div className="graph-legend">
              <span><i className="legend-visited" />Visited</span>
              <span><i className="legend-selected" />Tree edge</span>
              <span><i className="legend-path" />Shortest path</span>
            </div>
          </div>

          <svg className="graph-canvas" viewBox="0 0 800 460" role="img" aria-label="Undirected weighted graph">
            {edges.map((edge) => {
              const from = vertices.find((vertex) => vertex.id === edge.from)!;
              const to = vertices.find((vertex) => vertex.id === edge.to)!;
              const isPath = pathEdges.has(edge.id);
              const isSelected = selectedEdges.has(edge.id);
              const isActive = activeStep?.currentEdgeId === edge.id;
              const edgeClass = isPath ? "path" : isSelected ? "selected" : isActive ? "active" : "";
              const midpointX = (from.x + to.x) / 2;
              const midpointY = (from.y + to.y) / 2;
              return (
                <g key={edge.id}>
                  <line className={`graph-edge ${edgeClass}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} />
                  <rect className="graph-weight-background" x={midpointX - 14} y={midpointY - 12} width="28" height="24" rx="8" />
                  <text className="graph-weight" x={midpointX} y={midpointY + 4} textAnchor="middle">{edge.weight}</text>
                </g>
              );
            })}
            {vertices.map((vertex) => {
              const isCurrent = activeStep?.currentNode === vertex.id;
              const isVisited = visitedNodes.has(vertex.id);
              const nodeClass = isCurrent ? "current" : isVisited ? "visited" : "";
              const distance = activeStep?.distances[vertex.id];
              return (
                <g key={vertex.id} className={`graph-vertex ${nodeClass}`}>
                  <circle cx={vertex.x} cy={vertex.y} r="27" />
                  <text className="graph-vertex-label" x={vertex.x} y={vertex.y + 5} textAnchor="middle">{vertex.id}</text>
                  {algorithm === "dijkstra" && activeStep && (
                    <text className="graph-distance-label" x={vertex.x} y={vertex.y + 44} textAnchor="middle">d={formatDistance(distance)}</text>
                  )}
                </g>
              );
            })}
          </svg>

          <div className="graph-editor">
            <div className="graph-editor-heading">
              <div>
                <h3>Edit graph</h3>
                <p>Add vertices and weighted edges, or remove an edge from the list.</p>
              </div>
              <button className="graph-secondary-button" onClick={handleAddVertex} disabled={vertices.length >= 10}>Add vertex</button>
            </div>
            <div className="edge-editor-form">
              <label>
                From
                <select value={edgeFrom} onChange={(event) => setEdgeFrom(event.target.value)}>
                  {vertices.map((vertex) => <option key={vertex.id} value={vertex.id}>{vertex.id}</option>)}
                </select>
              </label>
              <label>
                To
                <select value={edgeTo} onChange={(event) => setEdgeTo(event.target.value)}>
                  {vertices.map((vertex) => <option key={vertex.id} value={vertex.id}>{vertex.id}</option>)}
                </select>
              </label>
              <label>
                Weight
                <input type="number" min="0" max="999" step="1" value={weight} onChange={(event) => setWeight(event.target.value)} />
              </label>
              <button className="graph-secondary-button" onClick={handleAddEdge}>Add edge</button>
            </div>
            <div className="graph-edge-list">
              {edges.map((edge) => (
                <span className="graph-edge-chip" key={edge.id}>
                  {edge.from}–{edge.to} <strong>{edge.weight}</strong>
                  <button aria-label={`Remove edge ${edge.from} to ${edge.to}`} onClick={() => handleRemoveEdge(edge.id)}>×</button>
                </span>
              ))}
            </div>
          </div>
        </section>

        <aside className="graph-trace-panel">
          <div className="graph-trace-heading">
            <span className="section-eyebrow">STEP-BY-STEP</span>
            <h2>Execution trace</h2>
          </div>
          {activeStep ? (
            <>
              <div className="graph-step-count">Step {currentStep + 1} of {trace?.steps.length}</div>
              <p className="graph-step-message" aria-live="polite">{activeStep.message}</p>
              <div className="graph-step-metric">
                <span>{algorithm === "kruskal" ? "Edges processed" : algorithm === "prim" ? "Edge scans" : "Adjacency checks"}</span>
                <strong>{activeStep.operations}</strong>
              </div>
              {algorithm === "dijkstra" && (
                <div className="distance-table">
                  <h3>Current distances</h3>
                  {vertices.map((vertex) => (
                    <div key={vertex.id}>
                      <span>{vertex.id}</span>
                      <strong>{formatDistance(activeStep.distances[vertex.id])}</strong>
                    </div>
                  ))}
                </div>
              )}
              {currentStep === (trace?.steps.length ?? 0) - 1 && (
                <div className="graph-result">{trace?.result}</div>
              )}
              <div className="graph-playback-controls">
                <button onClick={togglePlayback}>{isPlaying ? "Pause" : "Play"}</button>
                <button onClick={() => { setIsPlaying(false); setCurrentStep(0); }}>Reset</button>
                <button disabled={currentStep === 0} onClick={() => { setIsPlaying(false); setCurrentStep((step) => Math.max(0, step - 1)); }}>Previous</button>
                <button disabled={currentStep >= (trace?.steps.length ?? 1) - 1} onClick={() => { setIsPlaying(false); setCurrentStep((step) => Math.min((trace?.steps.length ?? 1) - 1, step + 1)); }}>Next</button>
              </div>
              <label className="graph-speed-control">
                Playback speed
                <select value={speed} onChange={(event) => setSpeed(Number(event.target.value))}>
                  <option value={1600}>Slow</option>
                  <option value={900}>Normal</option>
                  <option value={450}>Fast</option>
                </select>
              </label>
            </>
          ) : (
            <div className="graph-trace-empty">
              <div className="trace-empty-icon">↗</div>
              <h3>Ready to explore</h3>
              <p>Choose an algorithm and run it to see vertices and edges highlighted one step at a time.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default GraphLab;
