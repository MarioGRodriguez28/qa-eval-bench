const COMMON = ['password', '123456', 'qwerty'];

function checkPassword(password, username) {
  if (typeof password !== 'string') throw new TypeError('password must be a string');
  const problems = [];
  if (password.length < 10) problems.push('too-short');
  if (password.length > 64) problems.push('too-long');
  if (!/[0-9]/.test(password)) problems.push('no-digit');
  if (!/[A-Z]/.test(password)) problems.push('no-uppercase');
  if (!/[a-z]/.test(password)) problems.push('no-lowercase');
  if (/\s/.test(password)) problems.push('has-space');
  if (typeof username === 'string' && username.length > 0 && password.toLowerCase().includes(username.toLowerCase())) problems.push('has-username');
  if (COMMON.includes(password.toLowerCase())) problems.push('too-common');
  return problems;
}

module.exports = { checkPassword };
