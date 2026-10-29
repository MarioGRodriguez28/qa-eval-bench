# password-policy

`require('./solution')` exports `checkPassword(password, username)`. It returns an array of problem codes, in this order, and an empty array when the password is acceptable.

- `'too-short'` when the password has fewer than 10 characters.
- `'too-long'` when it has more than 64 characters.
- `'no-digit'` when it has no digit.
- `'no-uppercase'` when it has no uppercase letter A-Z.
- `'no-lowercase'` when it has no lowercase letter a-z.
- `'has-space'` when it contains a space, tab or newline.
- `'has-username'` when `username` is a non-empty string and the password contains it, ignoring case.
- `'too-common'` when the password, ignoring case, is exactly one of: `password`, `123456`, `qwerty`.
- A password that is not a string throws a `TypeError`.
