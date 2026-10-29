# parse-duration

`require('./solution')` exports `parseDuration(text)`. It converts a duration string to a whole number of seconds.

- The string is one or more parts of the form `<integer><unit>`, with units `d` (86400 seconds), `h` (3600), `m` (60) and `s` (1). Examples: `'90s'` is 90, `'1h30m'` is 5400, `'2d'` is 172800.
- Parts may appear in any order, and spaces between parts are allowed: `'30m 1h'` is 5400. Leading and trailing spaces are ignored.
- Each unit may appear at most once. `'1h1h'` throws an `Error`.
- Anything else throws an `Error`: an empty or blank string, a part without a unit, a part without a number, an unknown unit such as `'5x'`, a decimal such as `'1.5h'`, or a negative number.
- A value that is not a string throws a `TypeError`.
- `'0s'` is valid and returns 0.
