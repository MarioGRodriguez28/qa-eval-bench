const round = (n) => Math.round(n * 100) / 100;

function priceOrder(items, coupon) {
  if (!Array.isArray(items) || items.length === 0) throw new Error('empty order');
  let subtotal = 0;
  for (const item of items) {
    if (typeof item.price !== 'number' || !(item.price >= 0)) throw new Error('invalid price');
    if (!Number.isInteger(item.qty) || item.qty < 1) throw new Error('invalid quantity');
    subtotal += item.price * item.qty;
  }
  let rate = 0;
  if (subtotal >= 500) rate = 0.1;
  else if (subtotal >= 100) rate = 0.05;
  let discount = subtotal * rate;
  if (coupon === 'SAVE10' && subtotal >= 50) discount += (subtotal - discount) * 0.1;
  const afterDiscount = subtotal - discount;
  const shipping = afterDiscount >= 75 ? 0 : 4.99;
  return { subtotal: round(subtotal), discount: round(discount), shipping, total: round(afterDiscount + shipping) };
}

module.exports = { priceOrder };
