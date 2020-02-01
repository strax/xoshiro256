use crate::splitmix64::SplitMix64;

#[derive(Copy, Clone)]
pub struct Xoshiro256 {
    pub state: [u64; 4],
}

#[inline]
fn rol64(x: u64, k: i16) -> u64 {
    (x << k) | (x >> (64 - k))
}

impl Xoshiro256 {
    pub fn new(seed: u64) -> Self {
        let mut state = [0u64; 4];
        let mut gen = SplitMix64::new(seed);
        state[0] = gen.next();
        state[1] = gen.next();
        state[2] = gen.next();
        state[3] = gen.next();
        Xoshiro256 { state }
    }

    pub fn next(&mut self) -> u64 {
        let state = &mut self.state;
        let result = rol64(state[1].wrapping_mul(5), 7).wrapping_mul(9);
        let t = state[1] << 17;

        state[2] ^= state[0];
        state[3] ^= state[1];
        state[1] ^= state[2];
        state[0] ^= state[3];
        state[2] ^= t;
        state[3] = rol64(state[3], 45);

        result
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_compliance() {
        let expected: Vec<u64> = vec![
            11520,
            0,
            1509978240,
            1215971899390074240,
            1216172134540287360,
            607988272756665600,
            16172922978634559625,
            8476171486693032832,
            10595114339597558777,
            2904607092377533576,
        ];
        let mut rng = Xoshiro256 {
            state: [1, 2, 3, 4],
        };
        for value in expected {
            assert_eq!(rng.next(), value)
        }
    }
}
