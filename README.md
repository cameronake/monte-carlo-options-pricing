# Monte Carlo Options Pricing

Prices European call and put options via Monte Carlo, compared against Black-Scholes. With ~1,000 paths, the MC estimate is usually within a few cents of the analytical price, but gaining another decimal place requires 100× the samples (1/√N).

Monte Carlo methods have been interesting to me since I first learned about them. I wanted to try it out using a simulation with several moving parts for a problem with a closed-form answer so that I could create an interesting simulation while also watching it converge to something I can verify.

**[Live demo](https://cameronake.github.io/mcop-demo.html)**

---

## How it works

Terminal prices are sampled from the exact GBM distribution, `S_T = S · exp((r − σ²/2)T + σ√T·Z)`, discounted, and averaged. Convergence is tracked at ~30 log-spaced sample counts. The core library (`mcop.js`) is dependency-free and runs in a Web Worker so the UI stays responsive during large simulations.

Analytical pricing uses the Black-Scholes formula with an Abramowitz & Stegun rational approximation for Φ(x) (±7.5×10⁻⁸). Random normals come from Box-Muller. The path visualization tab plots 50 full multi-step GBM paths alongside the simulation.
