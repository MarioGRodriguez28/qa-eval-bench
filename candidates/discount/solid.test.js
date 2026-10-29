const { test } = require('node:test');
const assert = require('node:assert/strict');
const { priceOrder } = require('./solution');

const one = (price, coupon) => priceOrder([{ price, qty: 1 }], coupon);

test('sums price times quantity over several items', () => {
  assert.deepEqual(priceOrder([{ price: 10, qty: 3 }, { price: 5.5, qty: 2 }]), { subtotal: 41, discount: 0, shipping: 4.99, total: 45.99 });
});

test('volume discount starts at exactly 100 and is 5%', () => {
  assert.deepEqual(one(99.99), { subtotal: 99.99, discount: 0, shipping: 0, total: 99.99 });
  assert.deepEqual(one(100), { subtotal: 100, discount: 5, shipping: 0, total: 95 });
});

test('volume discount becomes 10% at exactly 500', () => {
  assert.deepEqual(one(500), { subtotal: 500, discount: 50, shipping: 0, total: 450 });
  assert.ok(Math.abs(one(499.99).discount - 25) < 0.01);
});

test('coupon needs a subtotal of at least 50', () => {
  assert.deepEqual(one(49.99, 'SAVE10'), { subtotal: 49.99, discount: 0, shipping: 4.99, total: 54.98 });
  assert.deepEqual(one(50, 'SAVE10'), { subtotal: 50, discount: 5, shipping: 4.99, total: 49.99 });
});

test('only the exact coupon code counts', () => {
  assert.equal(one(80, 'save10').discount, 0);
  assert.equal(one(80, 'OTHER').discount, 0);
  assert.equal(one(80).discount, 0);
});

test('coupon applies on top of the volume discount', () => {
  assert.deepEqual(one(200, 'SAVE10'), { subtotal: 200, discount: 29, shipping: 0, total: 171 });
});

test('free shipping depends on the amount after discounts', () => {
  assert.equal(one(74.99).shipping, 4.99);
  assert.equal(one(75).shipping, 0);
  assert.deepEqual(one(80, 'SAVE10'), { subtotal: 80, discount: 8, shipping: 4.99, total: 76.99 });
});

test('a free item still pays shipping', () => {
  assert.deepEqual(one(0), { subtotal: 0, discount: 0, shipping: 4.99, total: 4.99 });
});

test('rejects invalid orders', () => {
  assert.throws(() => priceOrder([]));
  assert.throws(() => priceOrder('x'));
  assert.throws(() => priceOrder(null));
  assert.throws(() => one(-1));
  assert.throws(() => one('5'));
  assert.throws(() => one(NaN));
  for (const qty of [0, -1, 1.5, '2']) assert.throws(() => priceOrder([{ price: 1, qty }]));
});
