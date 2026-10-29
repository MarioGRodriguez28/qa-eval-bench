const { test } = require('node:test');
const assert = require('node:assert/strict');
const { mergeRanges } = require('./solution');

test('merges overlapping ranges', () => {
  assert.deepEqual(mergeRanges([[1, 3], [2, 6]]), [[1, 6]]);
});

test('empty input gives empty output', () => {
  assert.deepEqual(mergeRanges([]), []);
});
