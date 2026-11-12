
function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];

  let i = 0;
  let j = 0;

  // Compare elements from both arrays
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  // Add remaining elements
  while (i < left.length) {
    result.push(left[i]);
    i++;
  }

  while (j < right.length) {
    result.push(right[j]);
    j++;
  }

  return result;
}

export function mergeSort(values: number[]): number[] {
  // Base case: arrays with 0 or 1 element are already sorted
  if (values.length <= 1) {
    return values;
  }

  // Find the middle
  const middle = Math.floor(values.length / 2);

  // Divide the array
  const left = values.slice(0, middle);
  const right = values.slice(middle);

  // Recursively sort both halves
  const sortedLeft = mergeSort(left);
  const sortedRight = mergeSort(right);

  // Merge the sorted halves
  return merge(sortedLeft, sortedRight);
}
