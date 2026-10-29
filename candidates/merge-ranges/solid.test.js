const { test } = require('node:test');
const assert = require('node:assert/strict');
const { mergeRanges } = require('./solution');

test('sorts and merges unsorted input', () => {
  assert.deepEqual(mergeRanges([[8, 10], [1, 3], [2, 6], [15, 18]]), [[1, 6], [8, 10], [15, 18]]);
});

test('ranges that touch or are adjacent merge; a gap of one number does not', () => {
  assert.deepEqual(mergeRanges([[1, 3], [3, 6]]), [[1, 6]]);
  assert.deepEqual(mergeRanges([[1, 3], [4, 6]]), [[1, 6]]);
  assert.deepEqual(mergeRanges([[1, 3], [5, 6]]), [[1, 3], [5, 6]]);
});

test('a contained range does not shrink the merged end', () => {
  assert.deepEqual(mergeRanges([[1, 10], [2, 3]]), [[1, 10]]);
  assert.deepEqual(mergeRanges([[1, 10], [2, 3], [4, 12]]), [[1, 12]]);
});

test('handles single points, negatives and a single range', () => {
  assert.deepEqual(mergeRanges([[5, 5]]), [[5, 5]]);
  assert.deepEqual(mergeRanges([[-5, -1], [0, 2]]), [[-5, 2]]);
  assert.deepEqual(mergeRanges([[-9, -7], [-5, -1]]), [[-9, -7], [-5, -1]]);
});

test('same start keeps the larger end', () => {
  assert.deepEqual(mergeRanges([[2, 3], [2, 9]]), [[2, 9]]);
});

test('never modifies its input and returns new arrays', () => {
  const input = [[8, 10], [1, 3], [2, 6]];
  const copy = JSON.parse(JSON.stringify(input));
  const result = mergeRanges(input);
  assert.deepEqual(input, copy);
  assert.notEqual(result, input);
  const single = [[1, 2]];
  assert.notEqual(mergeRanges(single)[0], single[0]);
});

test('rejects a reversed range', () => {
  assert.throws(() => mergeRanges([[3, 1]]), Error);
  assert.deepEqual(mergeRanges([[3, 3]]), [[3, 3]]);
});

test('rejects malformed pairs and non-arrays', () => {
  for (const bad of [[[1]], [[1, 2, 3]], [[1.5, 2]], [['a', 'b']], [null], [5]]) assert.throws(() => mergeRanges(bad), TypeError);
  for (const bad of ['x', null, undefined, {}]) assert.throws(() => mergeRanges(bad), TypeError);
});
