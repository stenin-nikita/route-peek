const BITS = 5;

const MASK = (1 << BITS) - 1;

function sizeToBits(size: number) {
  return (size >> BITS) + 1;
}

function bitsToSize(length: number) {
  return (length - 1) << BITS;
}

export class StateSet implements Iterable<number> {
  static of(set: StateSet) {
    const newSet = new StateSet(bitsToSize(set.#bits.length));

    newSet.#bits.set(set.#bits);

    return newSet;
  }

  #bits: Uint32Array;

  constructor(size = 128) {
    this.#bits = new Uint32Array(sizeToBits(size));
  }

  add(value: number) {
    const index = value >> BITS;

    if (index >= this.#bits.length) {
      this.#resize(value);
    }

    this.#bits[index] |= 1 << (value & MASK);
  }

  has(value: number) {
    const index = value >> BITS;
    const bits = this.#bits;

    if (index >= bits.length) {
      return false;
    }

    return (bits[index] & (1 << (value & MASK))) !== 0;
  }

  remove(value: number) {
    const index = value >> BITS;
    const bits = this.#bits;

    if (index >= bits.length) {
      return;
    }

    bits[index] &= ~(1 << (value & MASK));
  }

  clear() {
    this.#bits.fill(0);
  }

  intersection(set: StateSet) {
    const bits1 = this.#bits;
    const bits2 = set.#bits;
    const len = Math.min(bits1.length, bits2.length);
    const result = new StateSet(bitsToSize(len));

    for (let i = 0; i < len; i++) {
      result.#bits[i] = bits1[i] & bits2[i];
    }

    return result;
  }

  complement(univ: StateSet): StateSet {
    const bits = this.#bits;
    const univBits = univ.#bits;

    const result = new StateSet(bitsToSize(univBits.length));
    const len = Math.min(bits.length, univBits.length);

    for (let i = 0; i < len; i++) {
      result.#bits[i] = ~bits[i] & univBits[i];
    }

    if (bits.length < univBits.length) {
      result.#bits.set(univBits.slice(len), len);
    }

    return result;
  }

  containsElements() {
    const bits = this.#bits;

    for (let i = 0, len = bits.length; i < len; i++) {
      if (bits[i] !== 0) {
        return true;
      }
    }

    return false;
  }

  addSet(set: StateSet) {
    const newBits = set.#bits;
    const len = newBits.length;
    let bits = this.#bits;

    if (bits.length < len) {
      bits = new Uint32Array(len);
      bits.set(this.#bits);
    }

    for (let i = 0; i < len; i++) {
      bits[i] |= newBits[i];
    }

    this.#bits = bits;
  }

  shift() {
    const bits = this.#bits;
    let index = 0;
    let offset = 0;
    let m = 1;

    while (bits[index] === 0) {
      index++;
    }

    while ((bits[index] & m) === 0) {
      m <<= 1;
      offset++;
    }

    bits[index] &= ~m;

    return (index << BITS) + offset;
  }

  equals(set: StateSet): boolean {
    const bits1 = this.#bits;
    const bits2 = set.#bits;
    const l1 = bits1.length;
    const l2 = bits2.length;
    let i = 0;

    if (l1 <= l2) {
      while (i < l1) {
        if (bits1[i] !== bits2[i]) {
          return false;
        }
        i++;
      }

      while (i < l2) {
        if (bits2[i++] !== 0) {
          return false;
        }
      }
    } else {
      while (i < l2) {
        if (bits1[i] !== bits2[i]) {
          return false;
        }

        i++;
      }

      while (i < l1) {
        if (bits1[i++] !== 0) {
          return false;
        }
      }
    }

    return true;
  }

  [Symbol.iterator]() {
    return this.values();
  }

  *values(): Iterator<number> {
    const bits = this.#bits;

    for (let i = 0, len = bits.length; i < len; i++) {
      const bit = bits[i];

      for (let j = 0; j < 32; j++) {
        if (i * 32 + j >= (1 << BITS) * len) {
          break;
        }

        if ((bit & (1 << j)) !== 0) {
          const value = i * 32 + j;

          yield value;
        }
      }
    }
  }

  #resize(value: number) {
    const bits = this.#bits;
    const needed = sizeToBits(value);
    const newBits = new Uint32Array(Math.max(bits.length * 2, needed));

    newBits.set(bits);

    this.#bits = newBits;
  }
}
