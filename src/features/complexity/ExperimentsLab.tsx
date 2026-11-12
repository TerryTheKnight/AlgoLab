import { useState } from "react";
import type { BenchmarkDatasetOrder, SortingBenchmarkResult } from "./sortingBenchmark";
import { benchmarkSortingAlgorithms, createBenchmarkDataset } from "./sortingBenchmark";
import KnapsackSimulator from "../experiments/KnapsackSimulator";
import SchedulingSimulator from "../experiments/SchedulingSimulator";

type TrendPoint = {
  size: number;
  bubble: SortingBenchmarkResult;
  merge: SortingBenchmarkResult;
};

const chart = { width: 780, height: 300, left: 58, right: 22, top: 24, bottom: 44 };

function ExperimentsLab() {
  const [baseSize, setBaseSize] = useState(100);
  const [order, setOrder] = useState<BenchmarkDatasetOrder>("random");
  const [experimentMode, setExperimentMode] = useState<"scaling" | "cargo" | "schedule">("scaling");
  const [points, setPoints] = useState<TrendPoint[]>([]);
  const [error, setError] = useState("");

  function runExperiment() {
    try {
      const nextPoints = [1, 2, 3, 4].map((multiple) => {
        const size = baseSize * multiple;
        const input = createBenchmarkDataset(size, order);
        const [bubble, merge] = benchmarkSortingAlgorithms(input, 3);
        return { size, bubble, merge };
      });
      setPoints(nextPoints);
      setError("");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "The experiment could not be completed.");
    }
  }

  const maximumTime = Math.max(
    ...points.flatMap((point) => [point.bubble.medianMilliseconds, point.merge.medianMilliseconds]),
    0.001,
  );
  const plotWidth = chart.width - chart.left - chart.right;
  const plotHeight = chart.height - chart.top - chart.bottom;
  const xPosition = (index: number) => chart.left + (index / 3) * plotWidth;
  const yPosition = (time: number) => chart.top + (1 - time / maximumTime) * plotHeight;
  const bubblePoints = points.map((point, index) => `${xPosition(index)},${yPosition(point.bubble.medianMilliseconds)}`).join(" ");
  const mergePoints = points.map((point, index) => `${xPosition(index)},${yPosition(point.merge.medianMilliseconds)}`).join(" ");

  return (
    <div className="complexity-lab experiments-lab">
      <div className="complexity-lab-heading">
        <span className="section-eyebrow">CONTROLLED EXPERIMENTS</span>
        <h1>Algorithm Experiments</h1>
        <p>Change input size and shape to see how Bubble Sort and Merge Sort scale.</p>
      </div>

      <div className="experiment-mode-tabs" role="tablist" aria-label="Experiment type">
        <button role="tab" aria-selected={experimentMode === "scaling"} className={experimentMode === "scaling" ? "active" : ""} onClick={() => setExperimentMode("scaling")}>Sorting growth</button>
        <button role="tab" aria-selected={experimentMode === "cargo"} className={experimentMode === "cargo" ? "active" : ""} onClick={() => setExperimentMode("cargo")}>Cargo optimization</button>
        <button role="tab" aria-selected={experimentMode === "schedule"} className={experimentMode === "schedule" ? "active" : ""} onClick={() => setExperimentMode("schedule")}>Task scheduling</button>
      </div>

      {experimentMode === "scaling" ? (
        <>
      <section className="benchmark-controls experiment-controls">
        <label>
          Starting input size
          <div className="benchmark-size-control">
            <input
              type="range"
              min="100"
              max="375"
              step="25"
              value={baseSize}
              onChange={(event) => setBaseSize(Number(event.target.value))}
              aria-label="Starting input size"
            />
            <strong>{baseSize}</strong>
          </div>
        </label>
        <label>
          Dataset order
          <select value={order} onChange={(event) => setOrder(event.target.value as BenchmarkDatasetOrder)}>
            <option value="random">Random</option>
            <option value="sorted">Already sorted</option>
            <option value="reverse">Reverse sorted</option>
          </select>
        </label>
        <button className="primary-button benchmark-run-button" onClick={runExperiment}>Run size experiment</button>
      </section>

      {error && <p className="benchmark-error" role="alert">{error}</p>}

      <div className="benchmark-method-note">
        <strong>Method</strong>
        <span>Four input sizes are tested. Each algorithm receives the same generated values at each size; points show the median of three independent runs.</span>
        <span>Only sorting time is measured. Input generation and visualization are excluded.</span>
      </div>

      {points.length > 0 ? (
        <>
          <section className="experiment-chart-panel">
            <div className="benchmark-results-heading">
              <div>
                <span className="section-eyebrow">MEDIAN EXECUTION TIME</span>
                <h2>Runtime growth</h2>
              </div>
              <div className="experiment-legend">
                <span><i className="bubble-legend" />Bubble Sort</span>
                <span><i className="merge-legend" />Merge Sort</span>
              </div>
            </div>
            <svg className="experiment-chart" viewBox={`0 0 ${chart.width} ${chart.height}`} role="img" aria-label="Line chart comparing measured algorithm runtime by input size">
              {[0, 0.5, 1].map((fraction) => {
                const y = chart.top + fraction * plotHeight;
                return <line key={fraction} className="experiment-gridline" x1={chart.left} y1={y} x2={chart.width - chart.right} y2={y} />;
              })}
              <polyline className="experiment-line bubble-line" points={bubblePoints} />
              <polyline className="experiment-line merge-line" points={mergePoints} />
              {points.map((point, index) => (
                <g key={point.size}>
                  <circle className="experiment-point bubble-point" cx={xPosition(index)} cy={yPosition(point.bubble.medianMilliseconds)} r="5" />
                  <circle className="experiment-point merge-point" cx={xPosition(index)} cy={yPosition(point.merge.medianMilliseconds)} r="5" />
                  <text className="experiment-axis-label" x={xPosition(index)} y={chart.height - 14} textAnchor="middle">{point.size}</text>
                </g>
              ))}
              <text className="experiment-axis-title" x="16" y={chart.top + plotHeight / 2} transform={`rotate(-90 16 ${chart.top + plotHeight / 2})`} textAnchor="middle">milliseconds</text>
            </svg>
          </section>

          <section className="experiment-table-panel">
            <div className="benchmark-results-heading">
              <div>
                <span className="section-eyebrow">COUNTS FROM EXECUTION</span>
                <h2>Comparisons and operations</h2>
              </div>
              <span className="benchmark-repeat-badge">Same data per pair</span>
            </div>
            <div className="experiment-table-wrap">
              <table className="experiment-table">
                <thead>
                  <tr><th>Input size</th><th>Bubble time</th><th>Bubble operations</th><th>Merge time</th><th>Merge operations</th></tr>
                </thead>
                <tbody>
                  {points.map((point) => (
                    <tr key={point.size}>
                      <th>{point.size}</th>
                      <td>{point.bubble.medianMilliseconds.toFixed(3)} ms</td>
                      <td>{point.bubble.operations.toLocaleString()}</td>
                      <td>{point.merge.medianMilliseconds.toFixed(3)} ms</td>
                      <td>{point.merge.operations.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : (
        <section className="benchmark-empty">
          <div className="benchmark-empty-mark">n → 4n</div>
          <h2>Explore growth, not one timing</h2>
          <p>Run the experiment to compare measured runtime and operation counts over four input sizes.</p>
        </section>
      )}
        </>
      ) : experimentMode === "cargo" ? (
        <KnapsackSimulator />
      ) : (
        <SchedulingSimulator />
      )}
    </div>
  );
}

export default ExperimentsLab;
