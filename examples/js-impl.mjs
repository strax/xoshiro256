function asUint64(n) {
    return BigInt.asUintN(64, n)
}

class SplitMix64 {
    constructor(seed) {
        this.state = seed
    }

    next() {
        this.state = asUint64(this.state + 0x9e3779b97f4a7c15n);
        let z = this.state;
        z = asUint64((z ^ (z >> 30n)) * 0xbf58476d1ce4e5b9n);
        z = asUint64((z ^ (z >> 27n)) * 0x94d049bb133111ebn);
        return asUint64(z ^ (z >> 31n))
    }
}

function rol64(x, k) {
    return asUint64((x << k) | (x >> (64n - k)))
}


export class X256 {
    constructor(seed) {
        this.state = new BigUint64Array(4)
        const sm64 = new SplitMix64(seed)
        this.state[0] = sm64.next()
        this.state[1] = sm64.next()
        this.state[2] = sm64.next()
        this.state[3] = sm64.next()
    }

    next() {
        const s = this.state
        const result = asUint64(rol64(asUint64(s[1] * 5n), 7n) * 9n)
        const t = asUint64(s[1] << 17n)

        s[2] ^= s[0];
        s[3] ^= s[1];
        s[1] ^= s[2];
        s[0] ^= s[3];
        s[2] ^= t;
        s[3] = rol64(s[3], 45n)

        return result
    }
}
