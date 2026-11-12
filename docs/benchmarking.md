# Benchmark methodology

## Sorting benchmark

The Complexity Lab generates one dataset and passes that same input to Bubble Sort and Merge Sort. Each implementation warms up once, then runs three timed trials; the UI reports the median duration. Each trial receives the same original values, and sorting is timed independently of input generation and animation.

The benchmark counts comparisons and writes from the implementations. A Bubble Sort swap counts two writes to array positions. Merge Sort counts each append to a merge buffer as one write. Total operations are comparisons plus writes. Initial working-array copies are included in timing but excluded from the comparison/write counters.

## Scaling experiments

The Experiments page uses four increasing input sizes and reports measured medians and operation counts. The two algorithms at each size receive identical values. Random, already-sorted, and reverse-sorted inputs are available.

## Limitations

Browser timing is sensitive to device load, thermal state, browser optimizations, and background work. The numbers demonstrate behavior for the selected input and environment; they are not universal performance claims. Memory use is not measured. Repeat experiments and compare growth over several input sizes before drawing conclusions.
