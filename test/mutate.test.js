const { test } = require('node:test');
const assert = require('node:assert/strict');
const { generateMutants } = require('../src/mutate');

const operators = (source) => generateMutants(source).map((m) => m.operator);

test('mutates comparison, logic, arithmetic, boolean and number tokens, one change per mutant', () => {
  const found = operators('function f(a, b) { return a < 3 && b !== 2 || true; }');
  for (const expected of ['< -> <=', '&& -> ||', '!== -> ===', '|| -> &&', 'true -> false', '3 -> 4', '2 -> 3']) assert.ok(found.includes(expected), expected);
  for (const m of generateMutants('const a = 1 + 1;')) assert.notEqual(m.source, 'const a = 1 + 1;');
});

test('ids are sequential and mutants with identical source are dropped', () => {
  const mutants = generateMutants('const a = 1 + 1;');
  assert.deepEqual(mutants.map((m) => m.id), ['M1', 'M2', 'M3']);
  assert.equal(new Set(mutants.map((m) => m.source)).size, 3);
});

test('never touches strings, comments or regex literals', () => {
  const source = ['const s = "a < b"; // x < y', 'const r = /a+b/.test(s);', 'const ok = 1 < 2; /* 9 > 8 */'].join('\n');
  const mutants = generateMutants(source);
  assert.ok(mutants.length > 0);
  assert.deepEqual([...new Set(mutants.map((m) => m.line))], [3]);
  assert.ok(mutants.every((m) => !m.operator.startsWith('9') && !m.operator.startsWith('8')));
});

test('an escaped quote does not end a string early', () => {
  assert.deepEqual(operators("const s = 'it\\'s < ok'; const t = 2;"), ['2 -> 3']);
});

test('arrows, increments and shifts are not comparison or arithmetic operators', () => {
  assert.deepEqual(operators('const f = (a) => a++; const g = a << 1;'), ['1 -> 2']);
});

test('reports the line and the original line text', () => {
  const m = generateMutants('const a = 1;\nconst b = x > y;').find((x) => x.operator === '> -> >=');
  assert.equal(m.line, 2);
  assert.equal(m.snippet, 'const b = x > y;');
});
