import { useState } from "react";
import {
  countLoopBodyExecutions,
  getGrowthSamples,
  getMergeSortRecursionTree,
} from "./complexityModels";
import type { LoopKind } from "./complexityModels";

const loopExamples: Record<LoopKind, {
  name: string;
  summary: string;
  pseudocode: string[];
  complexity: string;
}> = {
  linear: {
    name: "Single loop",
    summary: "The body runs once for each input item.",
    pseudocode: ["for i from 0 to n - 1", "  process(i)"],
    complexity: "Θ(n)",
  },
  nested: {
    name: "Nested loops",
    summary: "For each outer iteration, the inner loop runs n times.",
    pseudocode: ["for i from 0 to n - 1", "  for j from 0 to n - 1", "    process(i, j)"],
    complexity: "Θ(n²)",
  },
  halving: {
    name: "Repeated doubling",
    summary: "The loop variable doubles, so it reaches n in logarithmically many steps.",
    pseudocode: ["i = 1", "while i < n", "  process(i)", "  i = 2 × i"],
    complexity: "Θ(log n)",
  },
};

function formatCount(value: number) {
  return Number.isInteger(value) ? value.toLocaleString() : value.toFixed(2);
}

function ComplexityFoundations() {
  const [growthInputSize, setGrowthInputSize] = useState(8);
  const [recursionSize, setRecursionSize] = useState(64);
  const [loopKind, setLoopKind] = useState<LoopKind>("nested");
  const [loopInputSize, setLoopInputSize] = useState(12);

  const growthSamples = getGrowthSamples(growthInputSize);
  const logScaleMaximum = Math.log10(growthSamples.at(-1)?.value ?? 1);
  const recursionLevels = getMergeSortRecursionTree(recursionSize);
  const selectedLoop = loopExamples[loopKind];
  const loopBodyExecutions = countLoopBodyExecutions(loopKind, loopInputSize);

  return (
    <div className="complexity-foundations">
      <section className="foundation-panel asymptotic-panel">
        <div className="foundation-panel-heading">
          <div>
            <span className="section-eyebrow">ASYMPTOTIC NOTATION</span>
            <h2>Compare growth rates</h2>
            <p>Notation describes how resource use grows as input size increases, ignoring constant factors and smaller terms.</p>
          </div>
          <label className="foundation-select-label">
            Example input size
            <select value={growthInputSize} onChange={(event) => setGrowthInputSize(Number(event.target.value))}>
              {Array.from({ length: 15 }, (_, index) => index + 2).map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
        </div>

        <div className="notation-cards">
          <article><strong>O(g(n))</strong><span>Asymptotic upper bound: the algorithm grows no faster than g(n), up to a constant factor.</span></article>
          <article><strong>Ω(g(n))</strong><span>Asymptotic lower bound: the algorithm grows at least as fast as g(n), up to a constant factor.</span></article>
          <article><strong>Θ(g(n))</strong><span>Tight bound: both the upper and lower bounds grow at the rate g(n).</span></article>
        </div>

        <div className="growth-table" role="table" aria-label={`Example growth values for n equals ${growthInputSize}`}>
          <div className="growth-table-heading" role="row"><span>Growth class</span><span>Relative scale · logarithmic bars</span><span>f(n)</span></div>
          {growthSamples.map((sample) => {
            const width = logScaleMaximum === 0 ? 100 : Math.max(3, Math.log10(sample.value) / logScaleMaximum * 100);
            return (
              <div className="growth-row" role="row" key={sample.symbol}>
                <span><strong>{sample.symbol}</strong><small>{sample.name}</small></span>
                <span className="growth-bar-track"><i style={{ width: `${width}%` }} /></span>
                <strong>{formatCount(sample.value)}</strong>
              </div>
            );
          })}
        </div>
        <p className="foundation-footnote">The bars use a logarithmic scale so different growth classes remain visible together. These are mathematical examples, not benchmark measurements.</p>
      </section>

      <section className="foundation-panel recursion-panel">
        <div className="foundation-panel-heading">
          <div>
            <span className="section-eyebrow">RECURSIVE ANALYSIS</span>
            <h2>Merge Sort recursion tree</h2>
            <p>Each level splits the problem in two. The work across each level stays proportional to n.</p>
          </div>
          <label className="foundation-select-label">
            Input size n
            <select value={recursionSize} onChange={(event) => setRecursionSize(Number(event.target.value))}>
              {[8, 16, 32, 64, 128, 256, 512, 1024].map((value) => <option key={value} value={value}>{value.toLocaleString()}</option>)}
            </select>
          </label>
        </div>

        <div className="recurrence-equation"><span>T(n) = 2T(n / 2) + Θ(n)</span><strong>Θ(n log n)</strong></div>
        <div className="recursion-levels" aria-label={`Recursion tree levels for input size ${recursionSize}`}>
          {recursionLevels.map((level) => (
            <div className="recursion-level" key={level.level}>
              <span><strong>Level {level.level}</strong><small>{level.isLeaf ? "Base cases" : `${level.nodeCount} subproblems`}</small></span>
              <span className="recursion-level-detail">{level.nodeCount} × {level.isLeaf ? "constant" : level.subproblemSize} work</span>
              <span className="recursion-cost-track"><i style={{ width: `${level.totalWork / recursionSize * 100}%` }} /></span>
              <strong>Θ({recursionSize})</strong>
            </div>
          ))}
        </div>
        <div className="recursion-summary"><span>Tree height: <strong>log₂ n = {Math.log2(recursionSize)}</strong></span><span>Leaves: <strong>{recursionSize.toLocaleString()}</strong></span><span>Total level work: <strong>{(recursionSize * (Math.log2(recursionSize) + 1)).toLocaleString()} units</strong></span></div>
        <p className="foundation-footnote">This tree counts Θ(n) work at each internal level and Θ(1) per leaf. Therefore the total is Θ(n log n).</p>
      </section>

      <section className="foundation-panel loop-panel">
        <div className="foundation-panel-heading">
          <div>
            <span className="section-eyebrow">ITERATIVE ANALYSIS</span>
            <h2>Count loop operations</h2>
            <p>Change n and count executions of the loop body for three common patterns.</p>
          </div>
          <label className="foundation-select-label">
            Loop pattern
            <select value={loopKind} onChange={(event) => setLoopKind(event.target.value as LoopKind)}>
              <option value="linear">Single loop</option>
              <option value="nested">Nested loops</option>
              <option value="halving">Repeated doubling</option>
            </select>
          </label>
        </div>

        <div className="loop-counter-controls">
          <label htmlFor="loop-input-size">Input size n <strong>{loopInputSize.toLocaleString()}</strong></label>
          <input id="loop-input-size" type="range" min="1" max="1000" step="1" value={loopInputSize} onChange={(event) => setLoopInputSize(Number(event.target.value))} />
        </div>
        <div className="loop-counter-result">
          <div><span>Loop body executions</span><strong>{loopBodyExecutions.toLocaleString()}</strong><small>for n = {loopInputSize.toLocaleString()}</small></div>
          <div><span>Time complexity</span><strong>{selectedLoop.complexity}</strong><small>{selectedLoop.summary}</small></div>
        </div>
        <pre className="loop-pseudocode"><code>{selectedLoop.pseudocode.join("\n")}</code></pre>
        <p className="foundation-footnote">The counter measures body executions, not every comparison, increment, or assignment in the loop control.</p>
      </section>
    </div>
  );
}

export default ComplexityFoundations;
