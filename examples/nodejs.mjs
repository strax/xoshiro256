import * as Xoshiro256 from "../index.mjs";
import * as Crypto from "crypto"
import { X256 } from "./js-impl.mjs"
import Benchmark from "benchmark"

const seed = Crypto.randomBytes(8).readBigUInt64LE()
console.debug("Seed: %i", seed)

const xoshiro256a = Xoshiro256
xoshiro256a.seed(seed)
const xoshiro256b = new X256(seed)


function summary(benches) {
    let counter = 1
    for (const bench of benches) {
        console.info("[%i] %s", counter, bench.name)
        console.info("      %s op/s ±%s%", (bench.hz.toFixed(bench.hz < 100 ? 2 : 0)), bench.stats.rme.toFixed(2))
        console.info("      SSD: %s", bench.stats.deviation.toFixed(12))
        console.info("      SEM: %s", bench.stats.sem.toFixed(12))
        console.info("      MOE: %s", bench.stats.moe.toFixed(12))
        counter++
    }
}

const suite = new Benchmark.Suite()
suite.add("xoshiro256** WASM implementation", function xoshiro256ss_rust_wasm32() {
    return xoshiro256a.next()
})
suite.add("Math.random", function Math_random() {
    return Math.random()
})
suite.add("Crypto.randomBytes", function Crypto_randomBytes() {
    return Crypto.randomBytes(8).readBigUInt64LE()
})
suite.add("xoshiro256** JS implementation", function xoshiro256ss_js_bigint() {
    return xoshiro256b.next()
})

suite.on("complete", function print() {
    const benches = []
    for (let i = 0; i < this.length; i++) {
        benches.push(this[i])
    }
    summary(benches)
})
suite.run()

// function min(a, b) {
//     return a < b ? a : b
// }
// function max(a, b) {
//     return a > b ? a : b
// }

// function benchmark(fn) {
//     // Warm-up
//     for (let i = 0; i < 1_000_000; i++) {
//         fn()
//     }

//     const ITERATIONS = 10_000_000
//     const results = []
//     for (let i = 0; i < ITERATIONS; i++) {
//         const before = process.hrtime.bigint()
//         fn()
//         const after = process.hrtime.bigint()
//         results.push(after - before)
//     }

//     const avg = Number(results.reduce((a, b) => a + b, 0n)) / ITERATIONS
//     const nmin = results.reduce(min)
//     const nmax = results.reduce(max)

//     console.info("* %s", fn.name)
//     console.info("  %s iterations, avg %s ns, min %s ns, max %s ns", ITERATIONS, Math.round(avg), nmin.toString(10), nmax.toString(10))
// }

// benchmark(function xoshiro256ss_rust_wasm32() {
//     return xoshiro256a.next()
// })
// benchmark(function Math_random() {
//     return Math.random()
// })
// benchmark(function xoshiro256ss_js_bigint() {
//     return xoshiro256b.next()
// })