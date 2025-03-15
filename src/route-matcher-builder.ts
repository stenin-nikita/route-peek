import { RouteMatcher, type RouteMatcherOptions } from './route-matcher';
import { RouteRecord } from './route-record';

export class RouteMatcherBuilder<T = void> {
  #records: RouteRecord<T>[] = [];

  #ignoreCase = false;

  setIgnoreCase(value: boolean) {
    this.#ignoreCase = value;

    return this;
  }

  add(routePath: string, payload: T) {
    const record = new RouteRecord(routePath, payload);

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
