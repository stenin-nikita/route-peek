import { splitPath } from './utils';
import { FiniteAutomaton } from './finite-automaton';
import { StateSet } from './state-set';
import type { State } from './types';
import type { RouteRecord } from './route-record';
import { MatchedRoute } from './matched-route';
import type { Pattern, PatternMatch } from './pattern';

export class DFA<TPayload = void> extends FiniteAutomaton<Set<RouteRecord<TPayload>>> {
  #transitions: Record<State, Record<string, State> | undefined> = {};
  #patterns: Map<State, Map<string, Pattern>> = new Map();

  get transitions() {
    return this.#transitions;
  }

  addPattern(state: State, input: string, pattern: Pattern) {
    if (!this.#patterns.has(state)) {
      this.#patterns.set(state, new Map());
    }

    this.#patterns.get(state)?.set(input, pattern);
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
    const matchedMap = new Map<State, PatternMatch[]>();

    currentStates.add(this.initialState);

    for (let index = 0; index < numParts; index++) {
      const part = parts[index];

      while (currentStates.containsElements()) {
        const currentState = currentStates.shift();
        const currentMatched = matchedMap.get(currentState) ?? [];
        const transitions = this.#transitions[currentState] ?? {};
        const isAcceptedInitialState =
          numParts === 1 && part === '' && this.isAcceptState(currentState);

        if (isAcceptedInitialState) {
          nextStates.add(currentState);
          matchedMap.set(currentState, currentMatched);
        }

        const nextState = transitions[`/${part}`];

        if (typeof nextState !== 'undefined') {
          nextStates.add(nextState);
          matchedMap.set(nextState, currentMatched);
        }

        const patterns = this.#patterns.get(currentState);

        if (patterns) {
          for (const [key, pattern] of patterns) {
            const match = pattern.match(part);

            if (match) {
              const nextState = transitions[key];
              const nextMatched = currentMatched.concat(match);

              if (isAcceptedInitialState) {
                matchedMap.set(currentState, nextMatched);
              } else {
                nextStates.add(nextState);
                matchedMap.set(nextState, nextMatched);
              }
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

    return this.#getMatchedRoutes(path, currentStates, matchedMap);
  }

  #getMatchedRoutes(path: string, states: StateSet, matchedMap: Map<State, PatternMatch[]>) {
    const result: MatchedRoute<TPayload>[] = [];
    const seen: Record<number, Set<PatternMatch[]>> = {};

    while (states.containsElements()) {
      const state = states.shift();

      if (!this.isAcceptState(state)) {
        continue;
      }

      const matchedGroups = matchedMap.get(state);
      const records = this.getPayload(state);

      if (!records || !matchedGroups) {
        continue;
      }

      for (const record of records) {
        seen[record.id] ??= new Set();

        if (seen[record.id].has(matchedGroups)) {
          continue;
        }

        seen[record.id].add(matchedGroups);

        const matchedRoute = new MatchedRoute(path, record, matchedGroups);

        result.push(matchedRoute);
      }
    }

    if (result.length > 1) {
      result.sort((a, b) => b.score - a.score);
    }

    return result;
  }
}
