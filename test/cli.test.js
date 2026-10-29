const { test } = require('node:test');
const assert = require('node:assert/strict');
const { execFile } = require('node:child_process');
const path = require('node:path');

const CLI = path.join(__dirname, '..', 'src', 'cli.js');
const cli = (...args) =>
  new Promise((resolve) => execFile(process.execPath, [CLI, ...args], (error, stdout, stderr) => resolve({ code: error ? error.code : 0, stdout, stderr })));

test('prompt prints the specification inside the standard instructions', async () => {
  const { code, stdout } = await cli('prompt', 'discount');
  assert.equal(code, 0);
  assert.match(stdout, /node:test/);
  assert.match(stdout, /priceOrder\(items, coupon\)/);
});

test('score prints the table and the missed bugs for one file', async () => {
  const { code, stdout } = await cli('score', 'merge-ranges', path.join(__dirname, '..', 'candidates', 'merge-ranges', 'weak.test.js'));
  assert.equal(code, 0);
  assert.match(stdout, /\| merge-ranges \| weak\.test\.js \| yes \| \d+\/\d+ \| \d+% \|/);
  assert.match(stdout, /Bugs missed by merge-ranges/);
});

test('an unknown task is an error and no arguments prints the usage', async () => {
  assert.equal((await cli('prompt', 'nope')).code, 1);
  const { code, stdout } = await cli();
  assert.equal(code, 0);
  assert.match(stdout, /Usage:/);
});
