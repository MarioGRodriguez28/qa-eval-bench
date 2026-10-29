const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { scoreCandidate } = require('../src/score');

const ROOT = path.join(__dirname, '..');
const task = (name) => path.join(ROOT, 'tasks', name);
const candidate = (name, file) => path.join(ROOT, 'candidates', name, file);

test('a thorough test suite catches clearly more bugs than a happy-path one', async () => {
  const weak = await scoreCandidate({ taskDir: task('discount'), candidatePath: candidate('discount', 'weak.test.js') });
  const solid = await scoreCandidate({ taskDir: task('discount'), candidatePath: candidate('discount', 'solid.test.js') });
  assert.ok(weak.valid && solid.valid);
  assert.ok(weak.killRate < 0.5, `weak ${weak.killRate}`);
  assert.ok(solid.killRate > 0.9, `solid ${solid.killRate}`);
  assert.equal(weak.killed + weak.survivors.length, weak.total);
  assert.deepEqual(Object.keys(weak.survivors[0]), ['id', 'line', 'operator', 'snippet']);
});

test('a test that fails on the correct solution is invalid, not scored', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'cand-'));
  const file = path.join(dir, 'wrong.test.js');
  await fs.writeFile(file, "const { test } = require('node:test'); const assert = require('node:assert/strict'); const { parseDuration } = require('./solution'); test('x', () => assert.equal(parseDuration('1m'), 61));");
  const result = await scoreCandidate({ taskDir: task('parse-duration'), candidatePath: file });
  assert.equal(result.valid, false);
  assert.match(result.reason, /fails on the correct solution/);
  assert.equal(result.killRate, undefined);
});

test('a test whose result changes between runs is invalid', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'cand-'));
  const counter = path.join(dir, 'count');
  const file = path.join(dir, 'flaky.test.js');
  await fs.writeFile(file, `const fs = require('node:fs'); const { test } = require('node:test'); const assert = require('node:assert/strict'); test('x', () => { fs.appendFileSync(${JSON.stringify(counter)}, 'x'); assert.equal(fs.readFileSync(${JSON.stringify(counter)}, 'utf8').length, 1); });`);
  const result = await scoreCandidate({ taskDir: task('parse-duration'), candidatePath: file });
  assert.equal(result.valid, false);
});

test('a bug that makes the code hang counts as caught', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'hang-'));
  await fs.writeFile(path.join(dir, 'solution.js'), "function countdown(n) { let x = n; while (x !== 0) { x = x - 1; } return 'done'; }\nmodule.exports = { countdown };\n");
  const file = path.join(dir, 'c.test.js');
  await fs.writeFile(file, "const { test } = require('node:test'); const assert = require('node:assert/strict'); const { countdown } = require('./solution'); test('x', () => assert.equal(countdown(3), 'done'));");
  const result = await scoreCandidate({ taskDir: dir, candidatePath: file, timeoutMs: 1500 });
  assert.equal(result.valid, true);
  assert.equal(result.total, 4);
  assert.equal(result.timeouts, 2);
  assert.equal(result.killed, 2);
  assert.deepEqual(result.survivors.map((s) => s.operator).sort(), ['!== -> ===', '0 -> 1']);
});

test('the candidate does not see the environment of the harness', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'env-'));
  const file = path.join(dir, 'env.test.js');
  await fs.writeFile(file, "const { test } = require('node:test'); const assert = require('node:assert/strict'); require('./solution'); test('x', () => assert.equal(process.env.SECRET_FOR_TEST, undefined));");
  process.env.SECRET_FOR_TEST = 'visible';
  const result = await scoreCandidate({ taskDir: task('parse-duration'), candidatePath: file });
  delete process.env.SECRET_FOR_TEST;
  assert.equal(result.valid, true);
});
