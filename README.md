# xoshiro256

This package implements the [`xoshiro256**`][xoshiro256] pseudo-random number generator as a [WebAssembly][wasm] module, implemented in Rust with a minimal JavaScript wrapper.

The optimized wasm module weighs just 610 bytes and performs favourably compared to a JavaScript implementation.

## NOTE!

This package depends on the following **experimental** WebAssembly features:

* [JavaScript BigInt to WebAssembly i64 integration][wasm-i64-feature]
* [ECMAScript module integration][wasm-esm-feature]

Therefore, it is advised not to use this package in production until the features are stabilized.
In Node.js, one must pass the `--experimental-wasm-modules --experimental-wasm-bigint` flags to the `node` command.

Browser support is not tested yet and probably does not work.

## Use cases

The built-in `Math.random` function is fast and widely supported, but it cannot be seeded by the user. This package provides a seedable alternative that generates random unsigned 64-bit (`bigint`) numbers without major performance or size overhead.

## Usage

### `seed(n: bigint): void`

Initializes the PRNG's state from an unsigned 64-bit `bigint` with the `SplitMix64` algorithm.
This function MUST be called before `next` or an exception will be thrown.

### `next(): bigint`

Returns a pseudo-random 64-bit unsigned integer as a `bigint`.
Calling this function will modify the internal state of the PRNG.

## Benchmarks

Each algorithm was ran for 10 000 000 iterations.
Test environment: Intel i7-8700K, Windows 10 (build 18363.628), Node.js 13.7.0

| RNG | Performance | Deviation | 
| --- | ----------- | --------- |
| `Math.random` | 170 570 909 ops/sec | ±0.45% |
| `xoshiro256**` (WASM) | 66 302 932 ops/sec | ±0.57% |
| `xoshiro256**` (JS) | 1 408 397 ops/sec | ±0.70% |
| [`crypto.randomBytes`][node1] | 277 764 ops/sec | ±1.48% |

[xoshiro256]: http://prng.di.unimi.it/
[wasm]: https://webassembly.org/
[node1]: https://nodejs.org/api/crypto.html#crypto_crypto_randombytes_size_callback
[wasm-i64-feature]: https://github.com/WebAssembly/proposals/issues/7
[wasm-esm-feature]: https://github.com/WebAssembly/proposals/issues/12