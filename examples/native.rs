use xoshiro256::Xoshiro256;

pub fn main() {
    let mut rng = Xoshiro256 {
        state: [1, 2, 3, 4],
    };
    for _ in 0..10 {
        println!("{}", rng.next());
    }
}
