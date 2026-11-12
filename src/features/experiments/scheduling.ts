export type Activity = {
  id: string;
  name: string;
  start: number;
  end: number;
  value: number;
};

export type ScheduleStrategy = "weighted" | "greedy";

export type ScheduleResult = {
  activities: Activity[];
  selected: Activity[];
  score: number;
  scoreLabel: string;
  predecessorIndexes: number[];
  dynamicValues: number[];
};

export function scheduleActivities(
  activities: Activity[],
  strategy: ScheduleStrategy,
): ScheduleResult {
  if (activities.some((activity) =>
    !Number.isInteger(activity.start) ||
    !Number.isInteger(activity.end) ||
    !Number.isInteger(activity.value) ||
    activity.start < 0 ||
    activity.end <= activity.start ||
    activity.value < 0
  )) {
    throw new Error("Activities need whole-number times, a finish after start, and a non-negative value.");
  }

  const sorted = [...activities].sort(
    (first, second) => first.end - second.end || first.start - second.start || first.id.localeCompare(second.id),
  );

  if (strategy === "greedy") {
    const selected: Activity[] = [];
    let lastFinish = -1;
    for (const activity of sorted) {
      if (activity.start >= lastFinish) {
        selected.push(activity);
        lastFinish = activity.end;
      }
    }
    return {
      activities: sorted,
      selected,
      score: selected.length,
      scoreLabel: "compatible activities",
      predecessorIndexes: [],
      dynamicValues: [],
    };
  }

  const predecessorIndexes = sorted.map((activity, index) => {
    for (let previous = index - 1; previous >= 0; previous -= 1) {
      if (sorted[previous].end <= activity.start) return previous;
    }
    return -1;
  });
  const dynamicValues = Array<number>(sorted.length + 1).fill(0);

  for (let index = 0; index < sorted.length; index += 1) {
    const take = sorted[index].value + dynamicValues[predecessorIndexes[index] + 1];
    const skip = dynamicValues[index];
    dynamicValues[index + 1] = Math.max(take, skip);
  }

  const selected: Activity[] = [];
  let index = sorted.length;
  while (index > 0) {
    const activity = sorted[index - 1];
    const take = activity.value + dynamicValues[predecessorIndexes[index - 1] + 1];
    if (take > dynamicValues[index - 1]) {
      selected.unshift(activity);
      index = predecessorIndexes[index - 1] + 1;
    } else {
      index -= 1;
    }
  }

  return {
    activities: sorted,
    selected,
    score: dynamicValues[sorted.length],
    scoreLabel: "maximum total reward",
    predecessorIndexes,
    dynamicValues,
  };
}
