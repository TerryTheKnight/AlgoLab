# Contributing to AlgoLab

Thanks for helping improve AlgoLab. Contributions should keep algorithm behavior correct, explain what the measurements count, and preserve keyboard and small-screen usability.

## Development setup

Use Node.js 22.12 or newer and npm 10 or newer.

```sh
npm ci
npm run dev
```

Before opening a pull request, run:

```sh
npm test
npm run lint
npm run build
```

## Algorithm changes

- Keep pure algorithm logic separate from UI components where practical.
- Add regression tests for normal cases, empty inputs, duplicates, invalid inputs, and disconnected or boundary cases that apply.
- Keep execution traces and timing benchmarks separate. Do not include animation or dataset generation in benchmark timings.
- Document the exact meaning of comparisons, operations, and writes.
- State implementation complexity accurately; different implementations of the same algorithm can have different complexity.

## Interface changes

- Use the existing dark visual system and responsive layout patterns.
- Keep controls labeled and usable by keyboard.
- Include clear validation messages and empty states.
- Avoid adding dependencies unless the feature needs them.

## Pull requests

Describe the learning outcome, important algorithm decisions, and how you tested the change. Include screenshots for visible interface changes when available.
