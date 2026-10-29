# qa-eval-bench

[![CI](https://github.com/MarioGRodriguez28/qa-eval-bench/actions/workflows/test.yml/badge.svg)](https://github.com/MarioGRodriguez28/qa-eval-bench/actions/workflows/test.yml)

A test that passes proves little. What matters is whether it **fails when the code is wrong**. This tool measures that: it plants small bugs in correct code, one at a time, and counts how many of them a test suite catches. The result is a score you can use to compare tests written by people, or tests written by AI models.

This is mutation testing, applied to a fixed set of small tasks so scores are comparable.

## How it works

1. Each task in `tasks/` has a written specification (`spec.md`) and a correct reference implementation (`solution.js`).
2. A candidate is a test file in Node's built-in test runner that does `require('./solution')`.
3. The bench runs the candidate against the correct code twice. If it fails, or changes result between runs, it is marked **invalid** and not scored.
4. It then generates mutants of the reference code by changing one operator or literal at a time (`<` to `<=`, `&&` to `||`, `500` to `501`, `true` to `false`, and so on) and runs the candidate against each one.
5. A mutant is **caught** when the candidate fails or hangs on it. The score is caught divided by total. The report lists the bugs that were missed, with the line and the change.

## Quick start

```bash
npm test                    # tests of the bench itself
npm run bench               # score every candidate in candidates/
node src/cli.js score discount path/to/my.test.js
node src/cli.js prompt discount    # the exact prompt to give a person or a model
```

No dependencies. Needs Node 22 or later.

## Results with the included candidates

Each task has a `weak` candidate (only the happy path) and a `solid` one (boundaries, errors and every rule in the specification).

| Task | Candidate | Bugs caught | Score |
|---|---|---|---|
| discount | weak | 12/32 | 38% |
| discount | solid | 32/32 | 100% |
| merge-ranges | weak | 10/22 | 45% |
| merge-ranges | solid | 21/22 | 95% |
| parse-duration | weak | 7/10 | 70% |
| parse-duration | solid | 10/10 | 100% |
| password-policy | weak | 5/10 | 50% |
| password-policy | solid | 9/10 | 90% |

Full output, including every missed bug: [results/leaderboard.md](results/leaderboard.md). The weak and solid files are hand-written examples, not model output.

## Comparing AI models

1. `node src/cli.js prompt <task>` prints the same instructions and specification for every model.
2. Save each model's answer as `candidates/<task>/<model-name>.test.js`.
3. `npm run bench` scores them all on the same bugs.

The scoring does not use a model, so a model cannot talk its way to a better score: its tests either catch the bug or they do not. The same file gives the same number on every run, except on a very slow machine where a timeout can tip a result.

## What the score does and does not tell you

- It measures whether tests notice changes in behaviour. It does not measure whether the tests are readable, fast or well organised.
- 100% is not always reachable. Some mutants are harmless changes that no test can detect (an equivalent mutant). The `solid` candidates miss a few for that reason or because of a real gap, and the report shows which.
- Mutants are made by changing text, not by parsing the code. That is enough for small modules, but it can miss or duplicate cases in larger code. Moving to a syntax tree is the obvious next step.
- A test file is only as good as the task is hard. Four small tasks show the idea; a real comparison needs more of them.

## Safety

A candidate is code and it runs on your machine. The bench runs each one in a separate process, in a temporary folder, with a timeout and a minimal environment (only `PATH`, so API keys and tokens are not visible to it). That is not a sandbox. Do not score code you do not trust outside a container or CI.

## Roadmap

- Syntax-tree mutation, so more kinds of bugs and no text-level false matches
- More tasks, including ones with asynchronous code and state
- A command that asks a model for the tests directly, behind a provider interface
- Score per test, to see which single test did the catching

## License

MIT

---

Part of my [QA automation portfolio](https://github.com/MarioGRodriguez28/qa-portfolio-docs). More about my work at [mariogrodriguez.com](https://mariogrodriguez.com).
