const { test } = require('node:test');
const assert = require('node:assert/strict');
const { priceOrder } = require('./solution');

test('prices a simple order', () => {
  assert.deepEqual(priceOrder([{ price: 10, qty: 2 }]), { subtotal: 20, discount: 0, shipping: 4.99, total: 24.99 });
});

test('rejects an empty order', () => {
  assert.throws(() => priceOrder([]));
});
