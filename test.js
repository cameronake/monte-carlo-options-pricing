const assert = require('assert');
const { normalCdf, bsPrice, logCheckpoints, runSimulation } = require('./mcop.js');

function near(a, b, tol = 1e-9) {
  return Math.abs(a - b) <= tol;
}

// --- normalCdf ---

assert.ok(near(normalCdf(0), 0.5), 'normalCdf(0) = 0.5');
assert.ok(near(normalCdf(1.96), 0.97500, 1e-4), 'normalCdf(1.96) ≈ 0.975');
assert.ok(normalCdf(10) > 1 - 1e-6, 'normalCdf(10) ≈ 1');
assert.ok(normalCdf(-10) < 1e-6,    'normalCdf(-10) ≈ 0');

// Symmetry: Φ(x) + Φ(-x) = 1 for all x
for (const x of [-3, -1, 0, 1, 3]) {
  assert.ok(near(normalCdf(x) + normalCdf(-x), 1), `normalCdf symmetry at x = ${x}`);
}

// --- bsPrice ---

const S = 100, K = 100, T = 1, sigma = 0.2, r = 0.05;
const { price: callPrice } = bsPrice(S, K, T, sigma, r, 'call');
const { price: putPrice }  = bsPrice(S, K, T, sigma, r, 'put');

// Put-call parity: C - P = S - K·exp(-rT) (holds exactly under BS)
assert.ok(
  near(callPrice - putPrice, S - K * Math.exp(-r * T), 1e-10),
  'put-call parity'
);

// Known ATM value
assert.ok(near(callPrice, 10.4506, 1e-3), 'ATM call price ≈ 10.4506');

// At expiry: price collapses to intrinsic value
assert.ok(near(bsPrice(100,  90, 0, 0.2, 0.05, 'call').price, 10), 'ITM call at expiry = intrinsic');
assert.ok(near(bsPrice(100, 110, 0, 0.2, 0.05, 'put').price,  10), 'ITM put at expiry = intrinsic');
assert.ok(near(bsPrice(100, 110, 0, 0.2, 0.05, 'call').price,  0), 'OTM call at expiry = 0');

// Prices are always non-negative
assert.ok(callPrice >= 0, 'call price >= 0');
assert.ok(putPrice  >= 0, 'put price >= 0');

// --- logCheckpoints ---

const pts = logCheckpoints(1000, 30);

assert.strictEqual(pts[0],              1,    'checkpoints start at 1');
assert.strictEqual(pts[pts.length - 1], 1000, 'checkpoints end at N');
assert.ok(pts.every(n => n >= 1 && n <= 1000),          'all checkpoints in [1, N]');
assert.ok(pts.every((n, i) => i === 0 || n > pts[i-1]), 'checkpoints are strictly ascending');

// --- runSimulation (statistical) ---

// With N = 100,000 the MC estimate should land within 4 standard errors of BS.
// A 4σ band has a ~0.006% false-failure rate, acceptable for a portfolio test.
const result = runSimulation({ S, K, T, sigma, r, N: 100_000, type: 'call' });

assert.ok(result.std_error > 0,                      'std_error is positive');
assert.ok(result.terminal_prices.length === 100_000, 'terminal_prices has N entries');
assert.ok(result.running_means.length > 0,           'running_means is non-empty');
assert.ok(
  Math.abs(result.mc_price - result.bs_price) < 4 * result.std_error,
  `MC within 4σ of BS — mc: ${result.mc_price.toFixed(4)}, bs: ${result.bs_price.toFixed(4)}, se: ${result.std_error.toFixed(4)}`
);

console.log('All tests passed.');
