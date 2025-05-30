import { RouteMatcher, type RouteMatcherOptions } from './route-matcher';
import { RouteRecord } from './route-record';

export class RouteMatcherBuilder<T = void> {
  #counter = 1;
  #records: RouteRecord<T>[] = [];

  #ignoreCase = false;

  setIgnoreCase(value: boolean) {
    this.#ignoreCase = value;

    return this;
  }

  add(routePath: string, payload: T) {
    const record = new RouteRecord(this.#counter++, routePath, payload);

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
