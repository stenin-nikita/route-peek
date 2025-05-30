import { RouteMatcher, type RouteMatcherOptions } from './route-matcher';
import { RouteRecord } from './route-record';
import { normalizeRoutePath } from './utils';

export class RouteMatcherBuilder<T = void> {
  #counter = 1;
  #records: RouteRecord<T>[] = [];
  #ignoreCase = false;
  #trailing = false;

  setIgnoreCase(value: boolean) {
    this.#ignoreCase = value;

    return this;
  }

  setTrailing(value: boolean) {
    this.#trailing = value;

    return this;
  }

  add(routePath: string, payload: T) {
    const normalizedRoutePath = normalizeRoutePath(routePath, this.#trailing);
    const record = new RouteRecord(this.#counter++, normalizedRoutePath, payload);

    this.#records.push(record);

    return this;
  }

  build(): RouteMatcher<T> {
    const options: RouteMatcherOptions = {
      ignoreCase: this.#ignoreCase,
    };

    return new RouteMatcher(this.#records, options);
  }
}
