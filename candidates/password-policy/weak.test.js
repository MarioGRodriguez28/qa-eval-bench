const { test } = require('node:test');
const assert = require('node:assert/strict');
const { checkPassword } = require('./solution');

test('accepts a good password', () => {
  assert.deepEqual(checkPassword('Abcdefghi1', 'bob'), []);
});

test('flags a short password', () => {
  assert.ok(checkPassword('Ab1', 'bob').includes('too-short'));
});
