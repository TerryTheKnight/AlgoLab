import { useEffect, useState } from "react";
import { parseNumberArray } from "../sorting/sortingInput";
import { binarySearch, linearSearch } from "./searchAlgorithms";
import type { ArraySearchTrace } from "./searchAlgorithms";
import { generateRabinKarpTrace } from "./rabinKarp";
import type { RabinKarpTrace } from "./rabinKarp";

type SearchMode = "array" | "string";
type SearchAlgorithm = "linear" | "binary";

function SearchLab() {
  const [mode, setMode] = useState<SearchMode>("array");
  const [algorithm, setAlgorithm] = useState<SearchAlgorithm>("binary");
  const [arrayInput, setArrayInput] = useState("1, 3, 5, 7, 9, 11, 13");
  const [targetInput, setTargetInput] = useState("7");
  const [arrayValues, setArrayValues] = useState<number[]>([]);
  const [arrayTrace, setArrayTrace] = useState<ArraySearchTrace | null>(null);
  const [text, setText] = useState("ABABABA");
  const [pattern, setPattern] = useState("ABA");
  const [stringTrace, setStringTrace] = useState<RabinKarpTrace | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(850);
  const [error, setError] = useState("");
  const steps = mode === "array" ? arrayTrace?.steps ?? [] : stringTrace?.steps ?? [];
  const activeArrayStep = mode === "array" ? arrayTrace?.steps[currentStep] : undefined;
  const activeStringStep = mode === "string" ? stringTrace?.steps[currentStep] : undefined;

  useEffect(() => {
    if (!isPlaying || currentStep >= steps.length - 1) return;
    const timer = setTimeout(() => {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (nextStep >= steps.length - 1) setIsPlaying(false);
    }, speed);
    return () => clearTimeout(timer);
  }, [currentStep, isPlaying, speed, steps.length]);

  function clearTrace() {
    setIsPlaying(false);
    setArrayTrace(null);
    setStringTrace(null);
    setCurrentStep(0);
    setError("");
  }

  function runArraySearch() {
    clearTrace();
    let values: number[];
    const target = Number(targetInput);
    try {
      values = parseNumberArray(arrayInput);
      if (!Number.isFinite(target)) throw new Error("Enter a finite target value.");
      const result = algorithm === "binary"
        ? binarySearch(values, target)
        : linearSearch(values, target);
      setArrayValues(values);
      setArrayTrace(result);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to run the search.");
    }
  }

  function runStringSearch() {
    clearTrace();
    try {
      setStringTrace(generateRabinKarpTrace(text, pattern));
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to run Rabin–Karp.");
    }
  }

  function togglePlayback() {
    if (steps.length === 0) return;
    if (currentStep >= steps.length - 1) setCurrentStep(0);
    setIsPlaying((playing) => !playing);
  }

  return (
    <div className="search-lab">
      <header className="search-heading">
        <span className="section-eyebrow">SEARCHING &amp; STRING MATCHING</span>
        <h1>Search Laboratory</h1>
        <p>Compare array search strategies and watch Rabin–Karp slide a rolling hash across text.</p>
      </header>

      <div className="search-mode-tabs" role="tablist" aria-label="Search type">
        <button role="tab" aria-selected={mode === "array"} className={mode === "array" ? "active" : ""} onClick={() => { setMode("array"); clearTrace(); }}>Array search</button>
        <button role="tab" aria-selected={mode === "string"} className={mode === "string" ? "active" : ""} onClick={() => { setMode("string"); clearTrace(); }}>Rabin–Karp</button>
      </div>

      {mode === "array" ? (
        <section className="search-workspace">
          <div className="search-input-grid">
            <label>
              Array values
              <input value={arrayInput} onChange={(event) => setArrayInput(event.target.value)} placeholder="1, 3, 5, 7" />
            </label>
            <label>
              Target
              <input type="number" value={targetInput} onChange={(event) => setTargetInput(event.target.value)} />
            </label>
            <label>
              Algorithm
              <select value={algorithm} onChange={(event) => { setAlgorithm(event.target.value as SearchAlgorithm); clearTrace(); }}>
                <option value="linear">Linear Search</option>
                <option value="binary">Binary Search</option>
              </select>
            </label>
            <button className="primary-button search-run-button" onClick={runArraySearch}>Run search</button>
          </div>
          {algorithm === "binary" && <p className="search-hint">Binary Search requires values in ascending order. Linear Search works with any order.</p>}
          {error && <p className="benchmark-error" role="alert">{error}</p>}

          {arrayTrace && (
            <div className="search-results">
              <div className="search-result-summary">
                <strong>{arrayTrace.resultIndex < 0 ? "Target not found" : `Found at index ${arrayTrace.resultIndex}`}</strong>
                <span>{arrayTrace.comparisons} comparisons · {sortingSearchComplexity(algorithm)}</span>
              </div>
              <div className="search-array-visual">
                {arrayValues.map((value, index) => {
                  const inRange = activeArrayStep !== undefined && index >= activeArrayStep.low && index <= activeArrayStep.high;
                  const current = activeArrayStep?.index === index;
                  const found = arrayTrace.resultIndex === index;
                  return (
                    <div className={`search-array-cell ${inRange ? "in-range" : "discarded"} ${current ? "current" : ""} ${found ? "found" : ""}`} key={`${index}-${value}`}>
                      <strong>{value}</strong><span>{index}</span>
                    </div>
                  );
                })}
              </div>
              {activeArrayStep && (
                <>
                  <p className="search-step-message" aria-live="polite">{activeArrayStep.message}</p>
                  <PlaybackControls currentStep={currentStep} totalSteps={steps.length} isPlaying={isPlaying} speed={speed} onPlay={togglePlayback} onReset={() => { setIsPlaying(false); setCurrentStep(0); }} onPrevious={() => { setIsPlaying(false); setCurrentStep((step) => Math.max(0, step - 1)); }} onNext={() => { setIsPlaying(false); setCurrentStep((step) => Math.min(steps.length - 1, step + 1)); }} onSpeedChange={setSpeed} />
                </>
              )}
            </div>
          )}
        </section>
      ) : (
        <section className="search-workspace">
          <div className="search-input-grid string-input-grid">
            <label>
              Text
              <input value={text} onChange={(event) => setText(event.target.value)} />
            </label>
            <label>
              Pattern
              <input value={pattern} onChange={(event) => setPattern(event.target.value)} />
            </label>
            <button className="primary-button search-run-button" onClick={runStringSearch}>Find pattern</button>
          </div>
          <p className="search-hint">Rabin–Karp compares rolling hashes, then verifies characters to rule out hash collisions.</p>
          {error && <p className="benchmark-error" role="alert">{error}</p>}

          {stringTrace && (
            <div className="search-results">
              <div className="search-result-summary">
                <strong>{stringTrace.matches.length ? `Matches at ${stringTrace.matches.join(", ")}` : "No matches found"}</strong>
                <span>{stringTrace.steps.length} windows · {stringTrace.collisions} hash collisions</span>
              </div>
              <div className="string-window-visual" aria-label="Text characters and active Rabin-Karp window">
                {[...text].map((character, index) => {
                  const active = activeStringStep && index >= activeStringStep.index && index < activeStringStep.index + [...pattern].length;
                  const matched = stringTrace.matches.some((start) => index >= start && index < start + [...pattern].length);
                  return <span className={`${active ? "active" : ""} ${matched ? "matched" : ""}`} key={`${index}-${character}`}>{character}</span>;
                })}
              </div>
              <div className="rabin-hash-pair">
                <span>Current window hash <strong>{activeStringStep?.windowHash ?? "—"}</strong></span>
                <span>Pattern hash <strong>{activeStringStep?.patternHash ?? "—"}</strong></span>
              </div>
              {activeStringStep && (
                <>
                  <p className="search-step-message" aria-live="polite">{activeStringStep.message}</p>
                  <PlaybackControls currentStep={currentStep} totalSteps={steps.length} isPlaying={isPlaying} speed={speed} onPlay={togglePlayback} onReset={() => { setIsPlaying(false); setCurrentStep(0); }} onPrevious={() => { setIsPlaying(false); setCurrentStep((step) => Math.max(0, step - 1)); }} onNext={() => { setIsPlaying(false); setCurrentStep((step) => Math.min(steps.length - 1, step + 1)); }} onSpeedChange={setSpeed} />
                </>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function sortingSearchComplexity(algorithm: SearchAlgorithm) {
  return algorithm === "binary" ? "O(log n) time · O(1) space" : "O(n) time · O(1) space";
}

function PlaybackControls({
  currentStep,
  totalSteps,
  isPlaying,
  speed,
  onPlay,
  onReset,
  onPrevious,
  onNext,
  onSpeedChange,
}: {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  onPlay: () => void;
  onReset: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSpeedChange: (speed: number) => void;
}) {
  return (
    <div className="search-playback-row">
      <div className="graph-playback-controls">
        <button onClick={onPlay}>{isPlaying ? "Pause" : "Play"}</button>
        <button onClick={onReset}>Reset</button>
        <button disabled={currentStep === 0} onClick={onPrevious}>Previous</button>
        <button disabled={currentStep >= totalSteps - 1} onClick={onNext}>Next</button>
      </div>
      <label className="graph-speed-control">
        Playback speed
        <select value={speed} onChange={(event) => onSpeedChange(Number(event.target.value))}>
          <option value={1600}>Slow</option>
          <option value={850}>Normal</option>
          <option value={400}>Fast</option>
        </select>
      </label>
    </div>
  );
}

export default SearchLab;
