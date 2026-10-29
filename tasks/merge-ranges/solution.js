function mergeRanges(ranges) {
  if (!Array.isArray(ranges)) throw new TypeError('ranges must be an array');
  for (const pair of ranges) {
    if (!Array.isArray(pair) || pair.length !== 2 || !Number.isInteger(pair[0]) || !Number.isInteger(pair[1])) {
      throw new TypeError('each range must be a pair of integers');
    }
    if (pair[0] > pair[1]) throw new Error('start is greater than end');
  }
  const sorted = ranges.map(([start, end]) => [start, end]).sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const [start, end] of sorted) {
    const last = merged[merged.length - 1];
    if (last && start <= last[1] + 1) last[1] = Math.max(last[1], end);
    else merged.push([start, end]);
  }
  return merged;
}

module.exports = { mergeRanges };
