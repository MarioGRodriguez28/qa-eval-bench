const { execFile } = require('node:child_process');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { generateMutants } = require('./mutate');

const tail = (text) => text.split('\n').slice(-12).join('\n');

// The candidate runs as a plain child process with an empty environment and a timeout.
// shortcut: no sandbox, so never score code you do not trust outside a container or CI.
function runIn(dir, timeoutMs) {
  return new Promise((resolve) => {
    execFile(process.execPath, ['candidate.test.js'], { cwd: dir, timeout: timeoutMs, env: { PATH: process.env.PATH }, maxBuffer: 1_000_000 }, (error, stdout, stderr) => {
      if (!error) return resolve({ status: 'pass', output: '' });
      return resolve({ status: error.killed ? 'timeout' : 'fail', output: tail(`${stdout}\n${stderr}`) });
    });
  });
}

async function runVariant(solution, candidate, timeoutMs) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'bench-'));
  try {
    await Promise.all([fs.writeFile(path.join(dir, 'solution.js'), solution), fs.writeFile(path.join(dir, 'candidate.test.js'), candidate)]);
    return await runIn(dir, timeoutMs);
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
}

async function pool(items, size, worker) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(size, items.length) }, async () => {
      while (next < items.length) {
        const index = next++;
        results[index] = await worker(items[index]);
      }
    }),
  );
  return results;
}

async function scoreCandidate({ taskDir, candidatePath, timeoutMs = 4000, concurrency = 4 }) {
  const [solution, candidate] = await Promise.all([fs.readFile(path.join(taskDir, 'solution.js'), 'utf8'), fs.readFile(candidatePath, 'utf8')]);

  // Two runs on the correct code: a test that fails or flips here is invalid, whatever it does to mutants.
  const [first, second] = await Promise.all([runVariant(solution, candidate, timeoutMs), runVariant(solution, candidate, timeoutMs)]);
  if (first.status !== 'pass') return { valid: false, reason: `fails on the correct solution (${first.status})`, output: first.output };
  if (second.status !== 'pass') return { valid: false, reason: 'flaky: passes and fails on the same correct solution', output: second.output };

  const mutants = generateMutants(solution);
  const results = await pool(mutants, concurrency, async ({ source, ...info }) => ({ ...info, status: (await runVariant(source, candidate, timeoutMs)).status }));
  const survivors = results.filter((r) => r.status === 'pass');
  const killed = results.length - survivors.length;
  return {
    valid: true,
    total: results.length,
    killed,
    timeouts: results.filter((r) => r.status === 'timeout').length,
    killRate: results.length ? killed / results.length : 0,
    survivors: survivors.map(({ id, line, operator, snippet }) => ({ id, line, operator, snippet })),
  };
}

module.exports = { scoreCandidate };
