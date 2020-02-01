build-wasm:
    cargo build --target wasm32-unknown-unknown
    cargo build --target wasm32-unknown-unknown --release
    cp -R target/wasm32-unknown-unknown/release/xoshiro256.wasm .
    wasm-opt -Oz --strip-debug -o xoshiro256.wasm xoshiro256.wasm

build-native:
    cargo build
    cargo build --examples

test:
    cargo test