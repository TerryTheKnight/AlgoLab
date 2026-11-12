
import type { MergeSortTrace } from "./mergeSortTrace";
import { useState, useEffect } from "react";
import { generateSortingTrace, sortingAlgorithmDetails } from "./sortingEngine";
import type { SortingAlgorithm } from "./sortingEngine";
import { parseNumberArray } from "./sortingInput";


function SortingLab() {
  const [originalValues, setOriginalValues] = useState<number[]>([]);
  const [input, setInput] = useState("8, 3, 5, 1");
  const [algorithm, setAlgorithm] = useState<SortingAlgorithm>("merge");
  const [sortedValues, setSortedValues] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [trace, setTrace] = useState<MergeSortTrace | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const steps = trace?.steps ?? [];
  const algorithmDetails = sortingAlgorithmDetails[algorithm];

  useEffect(() => {
    if (!isPlaying || currentStep >= steps.length - 1) return;

    const timer = setTimeout(() => {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);

      if (nextStep >= steps.length - 1) {
        setIsPlaying(false);
      }
    }, speed);

    return () => clearTimeout(timer);

  }, [isPlaying, currentStep, steps.length, speed]);

  function handleSort() {
    setIsPlaying(false);

    let values: number[];
    try {
      values = parseNumberArray(input);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Enter valid numbers separated by commas.");
      return;
    }

    setError("");
    setOriginalValues(values);
    const executionTrace = generateSortingTrace(algorithm, values);
    setSortedValues(executionTrace.sortedValues);
    setTrace(executionTrace);
    setCurrentStep(0);
  }

  function handleRandomDataset() {
    const values = Array.from(
      { length: 8 },
      () => Math.floor(Math.random() * 99) + 1,
    );
    setInput(values.join(", "));
    setError("");
  }
    function getBarHeight(value: number, values: number[]) {
    const min = Math.min(...values);
    const max = Math.max(...values);

    const range = max - min || 1;

    return 35 + ((value - min) / range) * 125;
    }

    function nextStep() {
        setCurrentStep((previous) =>
            Math.min(previous + 1, steps.length - 1)
        );
    }

    function previousStep() {
        setCurrentStep((previous) =>
            Math.max(previous - 1, 0)
        );
    }

    function resetSteps() {
      setIsPlaying(false);
      setCurrentStep(0);
    }


    function renderBars(values: number[], variant: string) {
      const maxValue = Math.max(1, ...values.map((v) => Math.abs(v)));

      return (
        <div className="trace-bars">
          {values.map((value, index) => (
            <div className="trace-bar-column" key={`${variant}-${index}`}>
              <div
                className={`trace-bar ${variant}`}
                style={{
                  height: `${35 + (Math.abs(value) / maxValue) * 85}px`,
                }}
              />
              <span>{value}</span>
            </div>
          ))}
        </div>
      );
    }

    const activeStep = steps[currentStep];

    function togglePlayback() {
      if (steps.length === 0) return;

      if (currentStep >= steps.length - 1) {
        setCurrentStep(0);
      }

      setIsPlaying((previous) => !previous);
    }
  return (
    <div className="sorting-lab">
      <h1>Sorting Laboratory</h1>

      <p>
        Explore how sorting algorithms organize data,
        one operation at a time.
      </p>

      <div className="sorting-workspace">
        <h2>{algorithmDetails.name}</h2>

        <p>Choose a sorting method, enter up to 32 values, or generate a random array.</p>

        <label className="sorting-algorithm-select">
          Sorting algorithm
          <select value={algorithm} onChange={(event) => {
            setAlgorithm(event.target.value as SortingAlgorithm);
            setIsPlaying(false);
            setTrace(null);
            setCurrentStep(0);
            setSortedValues([]);
          }}>
            {Object.entries(sortingAlgorithmDetails).map(([id, details]) => (
              <option key={id} value={id}>{details.name}</option>
            ))}
          </select>
        </label>

        <div className="sorting-input-row">
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Example: 8, 3, 5, 1"
            aria-label="Numbers to sort"
          />
          <button className="random-dataset-button" onClick={handleRandomDataset}>
            Generate random array
          </button>
          <button className="primary-button sort-button" onClick={handleSort}>
            Run {algorithmDetails.name}
          </button>
        </div>

        {error && <p className="sorting-error" role="alert">{error}</p>}

        
{sortedValues.length > 0 && (
  <div className="visualization-section">

    {trace && (
      <>
        <div className="sorting-summary">
          <div>
            <span>COMPARISONS</span>
            <strong>{trace.comparisons}</strong>
          </div>
          <div>
            <span>ARRAY WRITES</span>
            <strong>{trace.writes}</strong>
          </div>
          <div>
            <span>TOTAL OPERATIONS</span>
            <strong>{trace.operations}</strong>
          </div>
        </div>
        <p className="metrics-note">
          Operations count comparisons and writes into merge buffers.
        </p>
        <div className="complexity-summary">
          <strong>{algorithmDetails.name} complexity</strong>
          <span>Best: {algorithmDetails.best}</span>
          <span>Average: {algorithmDetails.average}</span>
          <span>Worst: {algorithmDetails.worst}</span>
          <span>Auxiliary space: {algorithmDetails.space}</span>
        </div>
      </>
    )}

    <h3>Original Array</h3>

    <div className="array-bars">
      {originalValues.map((value, index) => (
        <div className="bar-column" key={index}>
          <div
            className="array-bar original-bar"
            style={{
              height: `${getBarHeight(value, originalValues)}px`,
            }}
          />
          <span>{value}</span>
        </div>
      ))}
    </div>

    <h3>Sorted Array</h3>

    <div className="array-bars">
      {sortedValues.map((value, index) => (
        <div className="bar-column" key={index}>
          <div
            className="array-bar sorted-bar"
            style={{
              height: `${getBarHeight(value, sortedValues)}px`,
            }}
          />
          <span>{value}</span>
        </div>
      ))}
    </div>

    {steps.length > 0 && (
        <div className="execution-panel">
            <h2>Execution Trace</h2>

            <p>
                Step {currentStep + 1} of {steps.length}
            </p>

            <h3>
            {steps[currentStep].type.toUpperCase()}
            </h3>

            <p>{steps[currentStep].message}</p>

            {activeStep && (
              <div className="step-counters" aria-live="polite">
                <span>Comparisons so far: <strong>{activeStep.comparisons}</strong></span>
                <span>Operations so far: <strong>{activeStep.operations}</strong></span>
              </div>
            )}

            {activeStep && (
              <div className="live-trace-visual">

                {activeStep.type === "divide" && (
                  <>
                    <h4>Original Array</h4>
                    {renderBars(activeStep.result, "original")}

                    <h4>Divided Arrays</h4>

                    <div className="trace-groups">
                      <div>
                        <span>Left Half</span>
                        {renderBars(activeStep.left, "left")}
                      </div>

                      <div>
                        <span>Right Half</span>
                        {renderBars(activeStep.right, "right")}
                      </div>
                    </div>
                  </>
                )}

                {activeStep.type === "compare" && (
                  <>
                    <h4>Compared Elements</h4>

                    <div className="compared-values">
                      {activeStep.compared?.map((value, index) => (
                        <span key={`${value}-${index}`}>{value}</span>
                      ))}
                      {activeStep.selected !== undefined && (
                        <strong>Selected: {activeStep.selected}</strong>
                      )}
                    </div>

                    {algorithm === "merge" ? (
                      <>
                        <h4>Partially Merged Result</h4>
                        {renderBars(activeStep.result, "merged")}
                        <div className="trace-groups">
                          <div>
                            <span>Remaining Left</span>
                            {renderBars(activeStep.left, "left")}
                          </div>
                          <div>
                            <span>Remaining Right</span>
                            {renderBars(activeStep.right, "right")}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <h4>Array State</h4>
                        {renderBars(activeStep.result, "original")}
                      </>
                    )}
                  </>
                )}

                {activeStep.type === "swap" && (
                  <>
                    <h4>After swapping</h4>
                    {renderBars(activeStep.result, "merged")}
                  </>
                )}

                {activeStep.type === "partition" && (
                  <>
                    <h4>Pivot placed: {activeStep.pivot}</h4>
                    {renderBars(activeStep.result, "merged")}
                  </>
                )}

                {activeStep.type === "complete" && (
                  <>
                    <h4>Sorted result</h4>
                    {renderBars(activeStep.result, "merged")}
                  </>
                )}

                {activeStep.type === "merge" && (
                  <>
                    <h4>Left Sorted Half</h4>
                    {renderBars(activeStep.left, "left")}

                    <h4>Right Sorted Half</h4>
                    {renderBars(activeStep.right, "right")}

                    <h4>Completed Merge</h4>
                    {renderBars(activeStep.result, "merged")}
                  </>
                )}

              </div>
            )}

            <div className="playback-controls">

            <button
              onClick={togglePlayback}
              disabled={steps.length === 0}
            >
              {isPlaying ? "Pause" : "Play"}
            </button>

            <button
                onClick={resetSteps}
                disabled={currentStep === 0}
            >
                Reset
            </button>

            <button
                onClick={previousStep}
                disabled={currentStep === 0}
            >
                Previous
            </button>

            <button
                onClick={nextStep}
                disabled={currentStep === steps.length - 1}
            >
                Next
            </button>
        </div>

        <div className="speed-control">
          <label htmlFor="playback-speed">
            Playback Speed
          </label>

          <select
            id="playback-speed"
            value={speed}
            onChange={(event) => setSpeed(Number(event.target.value))}
          >
            <option value={2000}>Slow</option>
            <option value={1000}>Normal</option>
            <option value={500}>Fast</option>
            <option value={200}>Very Fast</option>
          </select>
        </div>

    </div>
)}

  </div>
)}

      </div>
    </div>
  );
}

export default SortingLab;
