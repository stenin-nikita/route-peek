export interface Hashable<T> {
  equals(value: T): boolean;
}

export class HashMap<K extends Hashable<K>, V> {
  #map = new Map<K, V>();

  set(key: K, value: V) {
    return this.#map.set(key, value);
  }

  get(key: K) {
    const map = this.#map;

    if (map.has(key)) {
      return map.get(key);
    }

    for (const [item, value] of map) {
      if (key.equals(item)) {
        return value;
      }
    }
  }

  has(key: K) {
    const map = this.#map;

    if (map.has(key)) {
      return true;
    }

    for (const item of map.keys()) {
      if (key.equals(item)) {
        return true;
      }
    }

    return false;
  }

  remove(key: K) {
    const map = this.#map;

    if (map.has(key)) {
      return map.delete(key);
    }

    for (const item of map.keys()) {
      if (key.equals(item)) {
        return map.delete(item);
      }
    }
  }
}
