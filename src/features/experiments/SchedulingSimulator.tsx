import { useMemo, useState } from "react";
import { scheduleActivities } from "./scheduling";
import type { Activity, ScheduleStrategy } from "./scheduling";

const initialActivities: Activity[] = [
  { id: "plan", name: "Planning", start: 1, end: 3, value: 4 },
  { id: "design", name: "Design", start: 2, end: 5, value: 8 },
  { id: "prototype", name: "Prototype", start: 3, end: 6, value: 7 },
  { id: "review", name: "Review", start: 5, end: 7, value: 6 },
  { id: "build", name: "Build", start: 6, end: 9, value: 12 },
  { id: "test", name: "Testing", start: 8, end: 10, value: 9 },
  { id: "release", name: "Release", start: 10, end: 12, value: 5 },
];

function SchedulingSimulator() {
  const [activities, setActivities] = useState(initialActivities);
  const [strategy, setStrategy] = useState<ScheduleStrategy>("weighted");
  const [name, setName] = useState("");
  const [start, setStart] = useState("1");
  const [end, setEnd] = useState("2");
  const [value, setValue] = useState("1");
  const [error, setError] = useState("");
  const result = useMemo(() => scheduleActivities(activities, strategy), [activities, strategy]);
  const selectedIds = new Set(result.selected.map((activity) => activity.id));
  const maxEnd = Math.max(1, ...activities.map((activity) => activity.end));

  function addActivity() {
    const activityStart = Number(start);
    const activityEnd = Number(end);
    const activityValue = Number(value);
    if (!name.trim() || !Number.isInteger(activityStart) || !Number.isInteger(activityEnd) || activityStart < 0 || activityEnd <= activityStart || !Number.isInteger(activityValue) || activityValue < 0) {
      setError("Enter a name, whole-number times with finish after start, and a non-negative reward.");
      return;
    }
    if (activities.length >= 12) {
      setError("The schedule supports up to 12 activities.");
      return;
    }
    setActivities((current) => [...current, {
      id: `activity-${Date.now()}-${current.length}`,
      name: name.trim(),
      start: activityStart,
      end: activityEnd,
      value: activityValue,
    }]);
    setName("");
    setError("");
  }

  return (
    <div className="scheduling-simulator">
      <header className="scheduling-heading">
        <div>
          <span className="section-eyebrow">REAL-WORLD SIMULATION · GREEDY &amp; DYNAMIC PROGRAMMING</span>
          <h2>Project task scheduling</h2>
          <p>Choose non-overlapping activities, then compare a greedy rule with weighted interval scheduling.</p>
        </div>
        <div className="schedule-score">
          <span>{result.scoreLabel.toUpperCase()}</span>
          <strong>{result.score}</strong>
          <small>{result.selected.length} tasks selected</small>
        </div>
      </header>

      <div className="schedule-strategy-tabs" role="tablist" aria-label="Scheduling strategy">
        <button role="tab" aria-selected={strategy === "weighted"} className={strategy === "weighted" ? "active" : ""} onClick={() => setStrategy("weighted")}>Maximize reward · Dynamic programming</button>
        <button role="tab" aria-selected={strategy === "greedy"} className={strategy === "greedy" ? "active" : ""} onClick={() => setStrategy("greedy")}>Maximize task count · Greedy</button>
      </div>

      <section className="schedule-timeline-panel">
        <div className="knapsack-section-heading">
          <div><h3>Activity timeline</h3><span>Highlighted tasks form the selected compatible schedule.</span></div>
          <span>{strategy === "weighted" ? "Weighted interval scheduling · O(n²)" : "Earliest-finish greedy · O(n log n)"}</span>
        </div>
        <div className="schedule-timeline-scroll">
          <svg className="schedule-timeline" viewBox={`0 0 800 ${Math.max(150, 55 + activities.length * 38)}`} role="img" aria-label="Timeline of scheduled activities">
            {[...Array(Math.min(maxEnd, 16) + 1)].map((_, time) => (
              <g key={time}>
                <line className="schedule-gridline" x1={55 + (time / maxEnd) * 700} y1="30" x2={55 + (time / maxEnd) * 700} y2={Math.max(130, 38 + activities.length * 38)} />
                <text className="schedule-axis-label" x={55 + (time / maxEnd) * 700} y="20" textAnchor="middle">{time}</text>
              </g>
            ))}
            {result.activities.map((activity, index) => {
              const x = 55 + (activity.start / maxEnd) * 700;
              const width = Math.max(12, ((activity.end - activity.start) / maxEnd) * 700);
              const y = 37 + index * 38;
              return (
                <g className={selectedIds.has(activity.id) ? "schedule-activity selected" : "schedule-activity"} key={activity.id}>
                  <rect x={x} y={y} width={width} height="25" rx="6" />
                  <text x={x + 8} y={y + 16}>{activity.name} · {activity.value}</text>
                </g>
              );
            })}
          </svg>
        </div>
        {strategy === "weighted" && (
          <div className="schedule-dp-strip">
            <strong>DP best value by task prefix</strong>
            <div>{result.dynamicValues.map((best, index) => <span key={index}><small>{index}</small>{best}</span>)}</div>
          </div>
        )}
      </section>

      <div className="schedule-edit-layout">
        <section className="schedule-activity-panel">
          <div className="knapsack-section-heading"><div><h3>Activities</h3><span>Start and finish times are integer units.</span></div><span>{activities.length} / 12</span></div>
          <div className="schedule-activity-list">
            {result.activities.map((activity) => (
              <div className={selectedIds.has(activity.id) ? "schedule-activity-row selected" : "schedule-activity-row"} key={activity.id}>
                <div><strong>{activity.name}</strong><span>{activity.start}–{activity.end} · reward {activity.value}</span></div>
                <button aria-label={`Remove ${activity.name}`} onClick={() => setActivities((current) => current.filter((item) => item.id !== activity.id))}>×</button>
              </div>
            ))}
          </div>
          <div className="schedule-add-form">
            <label>Task<input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Documentation" /></label>
            <label>Start<input type="number" min="0" step="1" value={start} onChange={(event) => setStart(event.target.value)} /></label>
            <label>Finish<input type="number" min="1" step="1" value={end} onChange={(event) => setEnd(event.target.value)} /></label>
            <label>Reward<input type="number" min="0" step="1" value={value} onChange={(event) => setValue(event.target.value)} /></label>
            <button className="graph-secondary-button" onClick={addActivity} disabled={activities.length >= 12}>Add task</button>
          </div>
          {error && <p className="benchmark-error" role="alert">{error}</p>}
        </section>
        <aside className="schedule-result-panel">
          <span className="section-eyebrow">SELECTED SCHEDULE</span>
          <h3>{strategy === "weighted" ? "Maximum reward" : "Maximum compatible count"}</h3>
          {result.selected.length === 0 ? <p>No activities selected.</p> : result.selected.map((activity) => (
            <div className="schedule-selected-item" key={activity.id}><strong>{activity.name}</strong><span>{activity.start}–{activity.end} · {activity.value}</span></div>
          ))}
          <div className="schedule-total"><span>{strategy === "weighted" ? "Total reward" : "Tasks selected"}</span><strong>{result.score}</strong></div>
        </aside>
      </div>
    </div>
  );
}

export default SchedulingSimulator;
