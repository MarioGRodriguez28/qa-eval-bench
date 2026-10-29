const { test } = require('node:test');
const assert = require('node:assert/strict');
const { parseDuration } = require('./solution');

test('each unit has its own value', () => {
  assert.equal(parseDuration('1d'), 86400);
  assert.equal(parseDuration('1h'), 3600);
  assert.equal(parseDuration('1m'), 60);
  assert.equal(parseDuration('1s'), 1);
});

test('amounts multiply and parts add up', () => {
  assert.equal(parseDuration('2d'), 172800);
  assert.equal(parseDuration('100s'), 100);
  assert.equal(parseDuration('1h30m'), 5400);
  assert.equal(parseDuration('1d2h3m4s'), 93784);
});

test('parts may come in any order and spaces are allowed between them', () => {
  assert.equal(parseDuration('30m1h'), 5400);
  assert.equal(parseDuration('30m 1h'), 5400);
  assert.equal(parseDuration('  1h  '), 3600);
  assert.equal(parseDuration('1h   30m'), 5400);
});

test('zero and leading zeros are valid', () => {
  assert.equal(parseDuration('0s'), 0);
  assert.equal(parseDuration('01h'), 3600);
});

test('a repeated unit is an error', () => {
  assert.throws(() => parseDuration('1h1h'), Error);
  assert.throws(() => parseDuration('1h 30m 2h'), Error);
});

test('malformed input is an error', () => {
  for (const bad of ['', '   ', 'h', '5', '1.5h', '-5s', '5x', 'abc', '1hm', '1h-']) assert.throws(() => parseDuration(bad), Error);
});

test('a value that is not a string is a TypeError', () => {
  for (const bad of [5, null, undefined, ['1h']]) assert.throws(() => parseDuration(bad), TypeError);
});
