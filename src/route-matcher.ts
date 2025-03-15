import { createDFAFromNFA } from './create-dfa-from-nfa';
import type { DFA } from './dfa';
import type { MatchedRoute } from './matched-route';
import { NFA } from './nfa';
import type { RouteRecord } from './route-record';

export interface RouteMatcherOptions {
  ignoreCase?: boolean;
}

export class RouteMatcher<T = void> {
  #dfa: DFA<T>;

  constructor(records: RouteRecord<T>[], options: RouteMatcherOptions = {}) {
    const nfa = new NFA<T>(options);

    for (let i = 0, len = records.length; i < len; i += 1) {
      const record = records[i];

      nfa.addRouteRecord(record);
    }

    this.#dfa = createDFAFromNFA(nfa);
  }

  match(path: string): MatchedRoute<T>[] {
    const matchedRoutes = this.#dfa.match(path);

    return matchedRoutes;
  }
}
