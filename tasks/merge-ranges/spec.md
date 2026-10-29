# merge-ranges

`require('./solution')` exports `mergeRanges(ranges)`.

- `ranges` is an array of `[start, end]` pairs of integers. It may be empty and may be unsorted.
- Returns a new array of merged ranges, sorted by start. The input array and its pairs are never modified.
- Two ranges merge when they overlap or are adjacent, that is, when the next start is at most the current end plus 1. So `[1,3]` and `[3,6]` merge into `[1,6]`, `[1,3]` and `[4,6]` also merge into `[1,6]`, and `[1,3]` and `[5,6]` stay separate. A range inside another one is absorbed.
- A pair with `start > end` throws an `Error`. A pair that is not an array of exactly two integers throws a `TypeError`. A non-array `ranges` throws a `TypeError`.
