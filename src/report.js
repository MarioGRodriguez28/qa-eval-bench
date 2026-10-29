const pct = (rate) => `${(rate * 100).toFixed(0)}%`;

function leaderboard(rows) {
  const out = ['# Mutation score by task and candidate', '', '| Task | Candidate | Valid | Bugs caught | Score |', '|---|---|---|---|---|'];
  for (const r of rows) {
    out.push(r.valid ? `| ${r.task} | ${r.candidate} | yes | ${r.killed}/${r.total} | ${pct(r.killRate)} |` : `| ${r.task} | ${r.candidate} | no: ${r.reason} | - | - |`);
  }
  for (const r of rows.filter((x) => x.valid && x.survivors.length)) {
    out.push('', `## Bugs missed by ${r.task} / ${r.candidate}`, '');
    for (const s of r.survivors.slice(0, 8)) out.push(`- line ${s.line}, \`${s.operator}\` in \`${s.snippet}\``);
    if (r.survivors.length > 8) out.push(`- and ${r.survivors.length - 8} more`);
  }
  return `${out.join('\n')}\n`;
}

function prompt(spec) {
  return `You are a QA engineer. Write an automated test file for the module described below.

Rules:
- Use Node's built-in test runner: const { test } = require('node:test'); const assert = require('node:assert/strict');
- Import the module with require('./solution').
- Output only the contents of the test file, as JavaScript.
- Your tests are scored by how many deliberately introduced bugs they detect, so cover boundaries, error cases and every rule in the specification. Do not test anything the specification does not state.

--- SPECIFICATION ---
${spec}`;
}

module.exports = { leaderboard, prompt, pct };
