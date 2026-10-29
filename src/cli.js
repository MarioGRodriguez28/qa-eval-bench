#!/usr/bin/env node
const fs = require('node:fs/promises');
const path = require('node:path');
const { scoreCandidate } = require('./score');
const { leaderboard, prompt } = require('./report');

const ROOT = path.join(__dirname, '..');
const HELP = `Usage:
  qa-bench run [--out file]              Score every candidate in candidates/ against its task
  qa-bench score <task> <test-file>      Score one test file
  qa-bench prompt <task>                 Print the prompt to give a person or a model for this task`;

const names = async (dir) => (await fs.readdir(dir, { withFileTypes: true })).filter((e) => e.isDirectory()).map((e) => e.name).sort();

async function main([command, ...args]) {
  if (command === 'prompt' && args[0]) {
    console.log(prompt(await fs.readFile(path.join(ROOT, 'tasks', args[0], 'spec.md'), 'utf8')));
    return 0;
  }
  if (command === 'score' && args.length === 2) {
    const row = await scoreCandidate({ taskDir: path.join(ROOT, 'tasks', args[0]), candidatePath: args[1] });
    console.log(leaderboard([{ task: args[0], candidate: path.basename(args[1]), ...row }]));
    return row.valid ? 0 : 1;
  }
  if (command === 'run') {
    const rows = [];
    for (const task of await names(path.join(ROOT, 'candidates'))) {
      const dir = path.join(ROOT, 'candidates', task);
      for (const file of (await fs.readdir(dir)).filter((f) => f.endsWith('.test.js')).sort()) {
        rows.push({ task, candidate: file.replace('.test.js', ''), ...(await scoreCandidate({ taskDir: path.join(ROOT, 'tasks', task), candidatePath: path.join(dir, file) })) });
      }
    }
    const markdown = leaderboard(rows);
    const out = args[args.indexOf('--out') + 1];
    if (args.includes('--out') && out) await fs.writeFile(out, markdown);
    else console.log(markdown);
    return rows.every((r) => r.valid) ? 0 : 1;
  }
  console.log(HELP);
  return command ? 1 : 0;
}

main(process.argv.slice(2)).then(
  (code) => process.exit(code),
  (error) => {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  },
);
