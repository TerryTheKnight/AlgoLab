export type CargoItem = {
  id: string;
  name: string;
  weight: number;
  value: number;
};

export type KnapsackSolution = {
  table: number[][];
  selectedItems: CargoItem[];
  maximumValue: number;
};

export function solveKnapsack(items: CargoItem[], capacity: number): KnapsackSolution {
  if (!Number.isInteger(capacity) || capacity < 0) {
    throw new Error("Capacity must be a non-negative whole number.");
  }
  if (items.some((item) => !Number.isInteger(item.weight) || item.weight <= 0 || !Number.isInteger(item.value) || item.value < 0)) {
    throw new Error("Item weights must be positive integers and values must be non-negative integers.");
  }

  const table = Array.from(
    { length: items.length + 1 },
    () => Array<number>(capacity + 1).fill(0),
  );

  for (let itemIndex = 1; itemIndex <= items.length; itemIndex += 1) {
    const item = items[itemIndex - 1];
    for (let room = 0; room <= capacity; room += 1) {
      table[itemIndex][room] = table[itemIndex - 1][room];
      if (item.weight <= room) {
        table[itemIndex][room] = Math.max(
          table[itemIndex][room],
          item.value + table[itemIndex - 1][room - item.weight],
        );
      }
    }
  }

  const selectedItems: CargoItem[] = [];
  let remainingCapacity = capacity;
  for (let itemIndex = items.length; itemIndex > 0; itemIndex -= 1) {
    if (table[itemIndex][remainingCapacity] !== table[itemIndex - 1][remainingCapacity]) {
      const item = items[itemIndex - 1];
      selectedItems.unshift(item);
      remainingCapacity -= item.weight;
    }
  }

  return {
    table,
    selectedItems,
    maximumValue: table[items.length][capacity],
  };
}
