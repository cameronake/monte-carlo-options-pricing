# Monte Carlo Options Pricing

A Monte Carlo simulation for pricing European options, with a Black-Scholes analytical solution as a real-time benchmark. Implements Geometric Brownian Motion path simulation and tracks convergence as sample count grows.

**[Live demo →](https://cameronake.github.io/mcop-demo.html)**
Price options instantly in your browser — pure JS, no server, no load delay.

---

## What's in `mcop.js`

- **Black-Scholes** closed-form pricing for calls and puts, with Abramowitz & Stegun normal CDF approximation (±7.5×10⁻⁸ accuracy)
- **Monte Carlo** via single-step GBM: `S_T = S · exp((r − σ²/2)T + σ√T·Z)`
- **Box-Muller** transform for normal sampling
- **GBM path generation** for multi-step path visualization
- **Convergence tracking** at ~30 log-spaced checkpoints from N=1 to N_max

## Stack

- Vanilla JS (no dependencies, runs in a Web Worker for non-blocking simulation)
- Chart.js for visualization
