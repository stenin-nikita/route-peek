import { splitPath } from './utils';
import { FiniteAutomaton } from './finite-automaton';
import { StateSet } from './state-set';
import type { State } from './types';
import type { RouteRecord } from './route-record';
import { MatchedRoute } from './matched-route';

export class DFA<TPayload = void> extends FiniteAutomaton<RouteRecord<TPayload>[]> {
  #transitions: Record<State, Record<string, State> | undefined> = {};
  #patterns: Map<State, Map<string, RegExp>> = new Map();

  get transitions() {
    return this.#transitions;
  }

  addPattern(state: State, input: string, re: RegExp) {
    if (!this.#patterns.has(state)) {
      this.#patterns.set(state, new Map());
    }

    this.#patterns.get(state)?.set(input, re);
  }

  addTransition(from: State, input: string, to: State) {
    this.#transitions[from] ??= Object.create(null);
    this.#transitions[from]![input] = to;
  }

  match(path: string) {
    const p = this.ignoreCase ? path.toLowerCase() : path;
    const parts = splitPath(p || '/');
    const numParts = parts.length;
    const currentStates = new StateSet(this.numStates);
    const nextStates = new StateSet(this.numStates);
    const matchedMap = new Map<State, string[]>();

    currentStates.add(this.initialState);

    for (let index = 0; index < numParts; index++) {
      const part = parts[index];

      while (currentStates.containsElements()) {
        const currentState = currentStates.shift();
        const currentMatched = matchedMap.get(currentState) ?? [];
        const transitions = this.#transitions[currentState] ?? {};

        if (numParts === 1 && part === '' && this.isAcceptState(currentState)) {
          nextStates.add(currentState);
        }

        const nextState = transitions[`/${part}`];

        if (typeof nextState !== 'undefined') {
          nextStates.add(nextState);
          matchedMap.set(nextState, currentMatched);
        }

        const patterns = this.#patterns.get(currentState);

        if (patterns) {
          for (const [key, re] of patterns) {
            const match = part.match(re);

            if (match) {
              const nextState = transitions[key];
              const nextMatched = currentMatched.concat(match.slice(1));

              nextStates.add(nextState);
              matchedMap.set(nextState, nextMatched);
            }
          }
        }
      }

      if (nextStates.containsElements()) {
        currentStates.addSet(nextStates);
        nextStates.clear();
      } else {
        break;
      }
    }

    const result: MatchedRoute<TPayload>[] = [];

    while (currentStates.containsElements()) {
      const state = currentStates.shift();

      if (!this.isAcceptState(state)) {
        continue;
      }

      const matchedGroups = matchedMap.get(state) ?? [];
      const records = this.getPayload(state) ?? [];

      for (const record of records) {
        const matchedRoute = new MatchedRoute(path, record, matchedGroups);

        result.push(matchedRoute);
      }
    }

    result.sort((a, b) => b.score - a.score);

    return result;
  }
}
