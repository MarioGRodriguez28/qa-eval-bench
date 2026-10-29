const vm = require('node:vm');

// shortcut: string-level operators, not an AST; fine for small modules, move to an AST (acorn) for real code.
const OPERATORS = [
  ['===', /===/g, '!=='],
  ['!==', /!==/g, '==='],
  ['<=', /<=/g, '<'],
  ['>=', />=/g, '>'],
  ['<', /(?<![<=])<(?![<=])/g, '<='],
  ['>', /(?<![=>-])>(?![>=])/g, '>='],
  ['&&', /&&/g, '||'],
  ['||', /\|\|/g, '&&'],
  ['+', /(?<!\+)\+(?![+=])/g, '-'],
  ['-', /(?<!-)-(?![-=])/g, '+'],
  ['*', /(?<!\*)\*(?![*=])/g, '/'],
  ['true', /\btrue\b/g, 'false'],
  ['false', /\bfalse\b/g, 'true'],
  ['number', /(?<![\w.$])\d+(?![\w.])/g, (digits) => String(Number(digits) + 1)],
];

// Blank out strings, comments and regex literals (same length) so operators inside them are never mutated.
function mask(source) {
  const out = source.split('');
  const blank = (from, to) => {
    for (let k = from; k < to; k += 1) if (out[k] !== '\n') out[k] = ' ';
  };
  let i = 0;
  while (i < source.length) {
    const c = source[i];
    const next = source[i + 1];
    if (c === '/' && next === '/') {
      const end = source.indexOf('\n', i);
      const stop = end < 0 ? source.length : end;
      blank(i, stop);
      i = stop;
    } else if (c === '/' && next === '*') {
      const end = source.indexOf('*/', i + 2);
      const stop = end < 0 ? source.length : end + 2;
      blank(i, stop);
      i = stop;
    } else if (c === '"' || c === "'" || c === '`') {
      let j = i + 1;
      while (j < source.length && source[j] !== c) j += source[j] === '\\' ? 2 : 1;
      blank(i + 1, j);
      i = j + 1;
    } else if (c === '/' && /(?:^|[=(,:!&|?{};[]|\breturn|\btypeof)\s*$/.test(source.slice(0, i))) {
      let j = i + 1;
      let inClass = false;
      while (j < source.length) {
        if (source[j] === '\\') j += 2;
        else if (source[j] === '[') { inClass = true; j += 1; }
        else if (source[j] === ']') { inClass = false; j += 1; }
        else if (source[j] === '/' && !inClass) break;
        else j += 1;
      }
      blank(i + 1, j);
      i = j + 1;
    } else {
      i += 1;
    }
  }
  return out.join('');
}

const compiles = (source) => {
  try {
    new vm.Script(source);
    return true;
  } catch {
    return false;
  }
};

function generateMutants(source) {
  const masked = mask(source);
  const lines = source.split('\n');
  const seen = new Set([source]);
  const mutants = [];
  for (const [name, regex, replacement] of OPERATORS) {
    for (const match of masked.matchAll(regex)) {
      const to = typeof replacement === 'function' ? replacement(match[0]) : replacement;
      const mutated = source.slice(0, match.index) + to + source.slice(match.index + match[0].length);
      if (seen.has(mutated) || !compiles(mutated)) continue;
      seen.add(mutated);
      const line = source.slice(0, match.index).split('\n').length;
      mutants.push({ line, operator: `${match[0]} -> ${to}`, family: name, snippet: lines[line - 1].trim(), source: mutated });
    }
  }
  return mutants
    .sort((a, b) => a.line - b.line)
    .map((m, index) => ({ id: `M${index + 1}`, ...m }));
}

module.exports = { generateMutants, mask };
