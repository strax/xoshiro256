import * as wasm from "./xoshiro256.wasm"

let seeded = false

export function seed(n) {
    wasm.seed(n)
    seeded = true
}

export function next() {
    if (!seeded) {
        throw new Error("generator needs to be seeded before first use")
    }
    return BigInt.asUintN(64, wasm.next())
}