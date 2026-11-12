import { useState } from "react";
import type { CargoItem } from "./knapsack";
import { solveKnapsack } from "./knapsack";

const startingItems: CargoItem[] = [
  { id: "oxygen", name: "Oxygen kit", weight: 3, value: 8 },
  { id: "water", name: "Water supply", weight: 4, value: 10 },
  { id: "food", name: "Food packs", weight: 5, value: 12 },
  { id: "tools", name: "Repair tools", weight: 2, value: 6 },
  { id: "battery", name: "Battery", weight: 4, value: 7 },
];

function KnapsackSimulator() {
  const [items, setItems] = useState(startingItems);
  const [capacity, setCapacity] = useState(10);
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("1");
  const [value, setValue] = useState("1");
  const [error, setError] = useState("");
  const solution = solveKnapsack(items, capacity);
  const selectedIds = new Set(solution.selectedItems.map((item) => item.id));
  const loadedWeight = solution.selectedItems.reduce((sum, item) => sum + item.weight, 0);

  function addItem() {
    const itemWeight = Number(weight);
    const itemValue = Number(value);
    if (!name.trim() || !Number.isInteger(itemWeight) || itemWeight < 1 || !Number.isInteger(itemValue) || itemValue < 0) {
      setError("Enter a name, a positive whole-number weight, and a non-negative whole-number value.");
      return;
    }
    if (items.length >= 8) {
      setError("The simulator supports up to eight items to keep the table readable.");
      return;
    }

    setItems((current) => [...current, {
      id: `cargo-${Date.now()}-${current.length}`,
      name: name.trim(),
      weight: itemWeight,
      value: itemValue,
    }]);
    setName("");
    setError("");
  }

  return (
    <div className="knapsack-simulator">
      <div className="knapsack-heading">
        <div>
          <span className="section-eyebrow">REAL-WORLD SIMULATION · DYNAMIC PROGRAMMING</span>
          <h2>Space cargo optimization</h2>
          <p>Select cargo with the greatest total value without exceeding the ship’s weight capacity.</p>
        </div>
        <div className="knapsack-optimum">
          <span>MAXIMUM CARGO VALUE</span>
          <strong>{solution.maximumValue}</strong>
        </div>
      </div>

      <section className="knapsack-controls">
        <label>
          Cargo capacity
          <div className="benchmark-size-control">
            <input type="range" min="1" max="20" value={capacity} onChange={(event) => setCapacity(Number(event.target.value))} aria-label="Cargo weight capacity" />
            <strong>{capacity} kg</strong>
          </div>
        </label>
        <div className="knapsack-load-summary">
          <span>Selected load</span>
          <strong>{loadedWeight} / {capacity} kg</strong>
          <span>{solution.selectedItems.length} items · value {solution.maximumValue}</span>
        </div>
      </section>

      <div className="knapsack-body">
        <section className="cargo-items-panel">
          <div className="knapsack-section-heading">
            <div><h3>Available cargo</h3><span>Chosen items are highlighted.</span></div>
            <span>{items.length} / 8 items</span>
          </div>
          <div className="cargo-item-list">
            {items.map((item) => (
              <div className={`cargo-item ${selectedIds.has(item.id) ? "included" : ""}`} key={item.id}>
                <div><strong>{item.name}</strong><span>{item.weight} kg · value {item.value}</span></div>
                <button aria-label={`Remove ${item.name}`} onClick={() => setItems((current) => current.filter((candidate) => candidate.id !== item.id))}>×</button>
              </div>
            ))}
          </div>
          <div className="cargo-add-form">
            <label>Item name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Medical kit" /></label>
            <label>Weight (kg)<input type="number" min="1" step="1" value={weight} onChange={(event) => setWeight(event.target.value)} /></label>
            <label>Value<input type="number" min="0" step="1" value={value} onChange={(event) => setValue(event.target.value)} /></label>
            <button className="graph-secondary-button" onClick={addItem} disabled={items.length >= 8}>Add item</button>
          </div>
          {error && <p className="benchmark-error" role="alert">{error}</p>}
        </section>

        <section className="knapsack-table-panel">
          <div className="knapsack-section-heading">
            <div><h3>Dynamic programming table</h3><span>Rows add items; columns add available capacity.</span></div>
            <span>O(nW) time · O(nW) space</span>
          </div>
          <div className="knapsack-table-wrap">
            <table className="knapsack-table">
              <thead>
                <tr>
                  <th>Items \ Capacity</th>
                  {Array.from({ length: capacity + 1 }, (_, room) => <th key={room}>{room}</th>)}
                </tr>
              </thead>
              <tbody>
                {solution.table.map((row, itemIndex) => (
                  <tr key={itemIndex}>
                    <th>{itemIndex === 0 ? "None" : items[itemIndex - 1].name}</th>
                    {row.map((cell, room) => (
                      <td className={itemIndex === items.length && room === capacity ? "knapsack-best-cell" : ""} key={room}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="knapsack-explanation">Each cell stores the best value using the items seen so far and the capacity shown above it. The final cell gives the optimal value.</p>
        </section>
      </div>
    </div>
  );
}

export default KnapsackSimulator;
