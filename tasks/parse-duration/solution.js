const UNITS = { d: 86400, h: 3600, m: 60, s: 1 };

function parseDuration(text) {
  if (typeof text !== 'string') throw new TypeError('text must be a string');
  const trimmed = text.trim();
  if (trimmed === '') throw new Error('empty duration');
  const seen = new Set();
  let seconds = 0;
  let rest = trimmed;
  while (rest.length > 0) {
    const part = /^(\d+)([a-z])\s*/.exec(rest);
    if (!part) throw new Error(`invalid duration: ${text}`);
    const [whole, amount, unit] = part;
    if (!(unit in UNITS)) throw new Error(`unknown unit: ${unit}`);
    if (seen.has(unit)) throw new Error(`repeated unit: ${unit}`);
    seen.add(unit);
    seconds += Number(amount) * UNITS[unit];
    rest = rest.slice(whole.length);
  }
  return seconds;
}

module.exports = { parseDuration };
