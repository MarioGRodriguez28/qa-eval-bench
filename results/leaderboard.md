# Mutation score by task and candidate

| Task | Candidate | Valid | Bugs caught | Score |
|---|---|---|---|---|
| discount | solid | yes | 32/32 | 100% |
| discount | weak | yes | 12/32 | 38% |
| merge-ranges | solid | yes | 21/22 | 95% |
| merge-ranges | weak | yes | 10/22 | 45% |
| parse-duration | solid | yes | 10/10 | 100% |
| parse-duration | weak | yes | 7/10 | 70% |
| password-policy | solid | yes | 9/10 | 90% |
| password-policy | weak | yes | 5/10 | 50% |

## Bugs missed by discount / weak

- line 7, `>= -> >` in `if (typeof item.price !== 'number' || !(item.price >= 0)) throw new Error('invalid price');`
- line 7, `|| -> &&` in `if (typeof item.price !== 'number' || !(item.price >= 0)) throw new Error('invalid price');`
- line 7, `0 -> 1` in `if (typeof item.price !== 'number' || !(item.price >= 0)) throw new Error('invalid price');`
- line 8, `< -> <=` in `if (!Number.isInteger(item.qty) || item.qty < 1) throw new Error('invalid quantity');`
- line 8, `|| -> &&` in `if (!Number.isInteger(item.qty) || item.qty < 1) throw new Error('invalid quantity');`
- line 8, `1 -> 2` in `if (!Number.isInteger(item.qty) || item.qty < 1) throw new Error('invalid quantity');`
- line 12, `>= -> >` in `if (subtotal >= 500) rate = 0.1;`
- line 12, `500 -> 501` in `if (subtotal >= 500) rate = 0.1;`
- and 12 more

## Bugs missed by merge-ranges / solid

- line 9, `0 -> 1` in `const sorted = ranges.map(([start, end]) => [start, end]).sort((a, b) => a[0] - b[0]);`

## Bugs missed by merge-ranges / weak

- line 4, `|| -> &&` in `if (!Array.isArray(pair) || pair.length !== 2 || !Number.isInteger(pair[0]) || !Number.isInteger(pair[1])) {`
- line 4, `|| -> &&` in `if (!Array.isArray(pair) || pair.length !== 2 || !Number.isInteger(pair[0]) || !Number.isInteger(pair[1])) {`
- line 4, `|| -> &&` in `if (!Array.isArray(pair) || pair.length !== 2 || !Number.isInteger(pair[0]) || !Number.isInteger(pair[1])) {`
- line 4, `0 -> 1` in `if (!Array.isArray(pair) || pair.length !== 2 || !Number.isInteger(pair[0]) || !Number.isInteger(pair[1])) {`
- line 7, `> -> >=` in `if (pair[0] > pair[1]) throw new Error('start is greater than end');`
- line 7, `0 -> 1` in `if (pair[0] > pair[1]) throw new Error('start is greater than end');`
- line 7, `1 -> 2` in `if (pair[0] > pair[1]) throw new Error('start is greater than end');`
- line 9, `- -> +` in `const sorted = ranges.map(([start, end]) => [start, end]).sort((a, b) => a[0] - b[0]);`
- and 4 more

## Bugs missed by parse-duration / weak

- line 1, `86400 -> 86401` in `const UNITS = { d: 86400, h: 3600, m: 60, s: 1 };`
- line 1, `60 -> 61` in `const UNITS = { d: 86400, h: 3600, m: 60, s: 1 };`
- line 10, `0 -> 1` in `while (rest.length > 0) {`

## Bugs missed by password-policy / solid

- line 12, `0 -> 1` in `if (typeof username === 'string' && username.length > 0 && password.toLowerCase().includes(username.toLowerCase())) problems.push('has-username');`

## Bugs missed by password-policy / weak

- line 7, `> -> >=` in `if (password.length > 64) problems.push('too-long');`
- line 7, `64 -> 65` in `if (password.length > 64) problems.push('too-long');`
- line 12, `=== -> !==` in `if (typeof username === 'string' && username.length > 0 && password.toLowerCase().includes(username.toLowerCase())) problems.push('has-username');`
- line 12, `> -> >=` in `if (typeof username === 'string' && username.length > 0 && password.toLowerCase().includes(username.toLowerCase())) problems.push('has-username');`
- line 12, `0 -> 1` in `if (typeof username === 'string' && username.length > 0 && password.toLowerCase().includes(username.toLowerCase())) problems.push('has-username');`
