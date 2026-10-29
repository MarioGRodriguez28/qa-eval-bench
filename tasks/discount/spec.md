# discount

`require('./solution')` exports `priceOrder(items, coupon)`.

- `items` is a non-empty array of `{ price, qty }`. `price` is a number >= 0. `qty` is an integer >= 1.
- Anything else throws an `Error`: an empty or non-array `items`, a price that is negative or not a number, a quantity that is below 1 or not an integer.
- `subtotal` is the sum of `price * qty`.
- Volume discount on the subtotal: 10% when the subtotal is 500 or more, otherwise 5% when it is 100 or more, otherwise none.
- The coupon `'SAVE10'` takes a further 10% off the amount left after the volume discount, but only when the subtotal is 50 or more. Any other coupon is ignored.
- `shipping` is 0 when the amount after discounts is 75 or more, otherwise 4.99.
- Returns `{ subtotal, discount, shipping, total }`. `discount` is the total amount taken off. `total` is the amount after discounts plus shipping. `subtotal`, `discount` and `total` are rounded to 2 decimals.
