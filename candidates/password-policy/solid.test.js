const { test } = require('node:test');
const assert = require('node:assert/strict');
const { checkPassword } = require('./solution');

test('length limits are 10 to 64 inclusive', () => {
  assert.deepEqual(checkPassword('Abcdefgh1', 'bob'), ['too-short']);
  assert.deepEqual(checkPassword('Abcdefghi1', 'bob'), []);
  assert.deepEqual(checkPassword(`Aa1${'x'.repeat(61)}`, 'bob'), []);
  assert.deepEqual(checkPassword(`Aa1${'x'.repeat(62)}`, 'bob'), ['too-long']);
});

test('each missing character class is reported on its own', () => {
  assert.deepEqual(checkPassword('abcdefghij', 'bob'), ['no-digit', 'no-uppercase']);
  assert.deepEqual(checkPassword('ABCDEFGHI1', 'bob'), ['no-lowercase']);
  assert.deepEqual(checkPassword('Abcdefghij', 'bob'), ['no-digit']);
  assert.deepEqual(checkPassword('abcdefghi1', 'bob'), ['no-uppercase']);
});

test('digits, uppercase and lowercase at the edges of their ranges count', () => {
  assert.deepEqual(checkPassword('A0aaaaaaaa', 'bob'), []);
  assert.deepEqual(checkPassword('Z9zzzzzzzz', 'bob'), []);
  assert.deepEqual(checkPassword('a0Aaaaaaaa', 'bob'), []);
});

test('space, tab and newline are not allowed', () => {
  assert.deepEqual(checkPassword('Abcdefgh 12', 'bob'), ['has-space']);
  assert.deepEqual(checkPassword('Abcdefg\t12', 'bob'), ['has-space']);
  assert.deepEqual(checkPassword('Abcdefg\n12', 'bob'), ['has-space']);
});

test('username check ignores case and needs a real username', () => {
  assert.deepEqual(checkPassword('XmarioPass12', 'MARIO'), ['has-username']);
  assert.deepEqual(checkPassword('XmarioPass12', ''), []);
  assert.deepEqual(checkPassword('XmarioPass12', undefined), []);
  assert.deepEqual(checkPassword('XmarioPass12', 42), []);
  assert.deepEqual(checkPassword('XmarioPass12', 'luis'), []);
});

test('common passwords are flagged only when the whole password matches, ignoring case', () => {
  assert.deepEqual(checkPassword('password', 'bob'), ['too-short', 'no-digit', 'no-uppercase', 'too-common']);
  assert.deepEqual(checkPassword('PASSWORD', 'bob'), ['too-short', 'no-digit', 'no-lowercase', 'too-common']);
  assert.deepEqual(checkPassword('123456', 'bob'), ['too-short', 'no-uppercase', 'no-lowercase', 'too-common']);
  assert.deepEqual(checkPassword('QWERTY', 'bob'), ['too-short', 'no-digit', 'no-lowercase', 'too-common']);
  assert.deepEqual(checkPassword('Password123', 'bob'), []);
});

test('problems come in the documented order', () => {
  assert.deepEqual(checkPassword('', 'bob'), ['too-short', 'no-digit', 'no-uppercase', 'no-lowercase']);
});

test('rejects a password that is not a string', () => {
  for (const value of [123, null, undefined, ['abc']]) assert.throws(() => checkPassword(value, 'bob'), TypeError);
});
