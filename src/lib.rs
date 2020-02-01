#![cfg_attr(all(not(test), target_arch = "wasm32"), no_std)]

mod splitmix64;
mod xoshiro256;
pub use crate::xoshiro256::Xoshiro256;

// Singleton instance is used on wasm target to eliminate the need for allocating
#[cfg(target_arch = "wasm32")]
static mut INSTANCE: Xoshiro256 = Xoshiro256 {
    state: [1, 2, 3, 4],
};

#[cfg(target_arch = "wasm32")]
#[no_mangle]
pub unsafe extern "C" fn seed(s: u64) {
    INSTANCE = Xoshiro256::new(s);
}

#[cfg(target_arch = "wasm32")]
#[no_mangle]
pub unsafe extern "C" fn next() -> u64 {
    INSTANCE.next()
}

#[cfg(target_arch = "wasm32")]
#[panic_handler]
fn on_panic(_info: &core::panic::PanicInfo) -> ! {
    unreachable!()
}
