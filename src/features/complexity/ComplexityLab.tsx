import { useState } from "react";
import type { BenchmarkDatasetOrder, SortingBenchmarkResult } from "./sortingBenchmark";
import { benchmarkSortingAlgorithms, createBenchmarkDataset } from "./sortingBenchmark";
import ComplexityFoundations from "./ComplexityFoundations";

function formatMilliseconds(milliseconds: number) {
  return milliseconds < 1 ? `${milliseconds.toFixed(3)} ms` : `${milliseconds.toFixed(2)} ms`;
}

function BenchmarkCard({
  result,
  maximumTime,
}: {
  result: SortingBenchmarkResult;
  maximumTime: number;
}) {
  const barWidth = Math.max(2, (result.medianMilliseconds / maximumTime) * 100);

  return (
    <article className={`benchmark-card ${result.algorithm === "Merge Sort" ? "merge-benchmark" : "bubble-benchmark"}`}>
      <div className="benchmark-card-heading">
        <div>
          <span className="benchmark-kicker">MEASURED RESULT</span>
          <h3>{result.algorithm}</h3>
        </div>
        <strong className="benchmark-time">{formatMilliseconds(result.medianMilliseconds)}</strong>
      </div>
      <div className="benchmark-bar-track" aria-label={`${result.algorithm} relative execution time`}>
        <div style={{ width: `${barWidth}%` }} />
      </div>
      <div className="benchmark-stat-grid">
        <div><span>Comparisons</span><strong>{result.comparisons.toLocaleString()}</strong></div>
        <div><span>Writes</span><strong>{result.writes.toLocaleString()}</strong></div>
        <div><span>Total operations</span><strong>{result.operations.toLocaleString()}</strong></div>
      </div>
      <div className="benchmark-complexity">
        <span>Time: {result.timeComplexity}</span>
        <span>Auxiliary space: {result.spaceComplexity}</span>
      </div>
    </article>
  );
}

function SortingBenchmarkPanel() {
  const [size, setSize] = useState(500);
  const [order, setOrder] = useState<BenchmarkDatasetOrder>("random");
  const [results, setResults] = useState<SortingBenchmarkResult[] | null>(null);
  const [error, setError] = useState("");

  function handleBenchmark() {
    try {
      const input = createBenchmarkDataset(size, order);
      const nextResults = benchmarkSortingAlgorithms(input, 3);
      setResults(nextResults);
      setError("");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "The benchmark could not be completed.");
    }
  }

  const maximumTime = Math.max(...(results ?? []).map((result) => result.medianMilliseconds), 0.001);

  return (
    <div className="benchmark-panel-content">
      <section className="benchmark-controls">
        <label>
          Input size
          <div className="benchmark-size-control">
            <input
              type="range"
              min="100"
              max="2500"
              step="100"
              value={size}
              onChange={(event) => setSize(Number(event.target.value))}
              aria-label="Benchmark input size"
            />
            <strong>{size.toLocaleString()}</strong>
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
        <button className="primary-button benchmark-run-button" onClick={handleBenchmark}>Run benchmark</button>
      </section>

      {error && <p className="benchmark-error" role="alert">{error}</p>}

      <div className="benchmark-method-note">
        <strong>How measurements work</strong>
        <span>Both algorithms receive the same generated input. Execution time is the median of three runs, measured separately from visualization.</span>
        <span>Operations count comparisons plus array writes. Browser timing varies with device load; memory use is not measured.</span>
      </div>

      {results ? (
        <section className="benchmark-results" aria-live="polite">
          <div className="benchmark-results-heading">
            <div>
              <span className="section-eyebrow">{order.toUpperCase()} DATASET · {size.toLocaleString()} VALUES</span>
              <h2>Benchmark results</h2>
            </div>
            <span className="benchmark-repeat-badge">3-run median</span>
          </div>
          <div className="benchmark-cards">
            {results.map((result) => (
              <BenchmarkCard key={result.algorithm} result={result} maximumTime={maximumTime} />
            ))}
          </div>
          <p className="benchmark-conclusion">
            {results[0].medianMilliseconds > results[1].medianMilliseconds
              ? "Merge Sort completed faster on this dataset."
              : results[0].medianMilliseconds < results[1].medianMilliseconds
                ? "Bubble Sort completed faster on this dataset."
                : "Both algorithms measured the same median time on this dataset."}
            {" "}One run shows behavior for this input; repeat with different sizes and orders to study growth rates.
          </p>
        </section>
      ) : (
        <section className="benchmark-empty">
          <div className="benchmark-empty-mark">n² / n log n</div>
          <h2>Test how input changes performance</h2>
          <p>Choose a dataset shape and size, then compare two real implementations on the same values.</p>
        </section>
      )}
    </div>
  );
}

function ComplexityLab() {
  const [activeTab, setActiveTab] = useState<"foundations" | "benchmark">("foundations");

  return (
    <div className="complexity-lab">
      <div className="complexity-lab-heading">
        <span className="section-eyebrow">EMPIRICAL ANALYSIS</span>
        <h1>Complexity &amp; Benchmark Lab</h1>
        <p>Explore asymptotic analysis, recursion, loop counts, and measured algorithm performance.</p>
      </div>

      <div className="complexity-mode-tabs" role="group" aria-label="Complexity lab mode">
        <button type="button" aria-pressed={activeTab === "foundations"} className={activeTab === "foundations" ? "active" : ""} onClick={() => setActiveTab("foundations")}>DAA foundations</button>
        <button type="button" aria-pressed={activeTab === "benchmark"} className={activeTab === "benchmark" ? "active" : ""} onClick={() => setActiveTab("benchmark")}>Sorting benchmarks</button>
      </div>

      {activeTab === "foundations" ? <ComplexityFoundations /> : <SortingBenchmarkPanel />}
    </div>
  );
}

export default ComplexityLab;
