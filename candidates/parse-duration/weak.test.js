const { test } = require('node:test');
const assert = require('node:assert/strict');
const { parseDuration } = require('./solution');

test('parses seconds and hours', () => {
  assert.equal(parseDuration('90s'), 90);
  assert.equal(parseDuration('1h'), 3600);
});

test('rejects an empty string', () => {
  assert.throws(() => parseDuration(''));
});
