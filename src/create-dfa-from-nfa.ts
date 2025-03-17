import { DFA } from './dfa';
import { HashMap } from './hash-map';
import type { NFA } from './nfa';
import type { RouteRecord } from './route-record';
import { StateSet } from './state-set';
import type { State } from './types';

export function createDFAFromNFA<T = void>(nfa: NFA<T>): DFA<T> {
  const dfaStates = new HashMap<StateSet, State>();
  const stateSets: StateSet[] = [];

  const dfa = new DFA<T>({ ignoreCase: nfa.ignoreCase });
  let currentDfaState = dfa.initialState;

  const initialStateSet = nfa.getClosureStates(nfa.initialState);

  dfaStates.set(initialStateSet, currentDfaState);
  stateSets.push(initialStateSet);

  const acceptStateSet = nfa.getAcceptStates(initialStateSet);

  if (acceptStateSet.containsElements()) {
    const records = createRouteRecordSet(nfa, acceptStateSet);

    dfa.addAcceptState(currentDfaState, records);
  }

  const tempStateSet = new StateSet();

  let newState = new StateSet(nfa.numStates);

  while (currentDfaState < dfa.numStates) {
    const currentState = stateSets[currentDfaState];

    for (const input of nfa.inputs) {
      tempStateSet.clear();

      for (const state of currentState) {
        const reachableSet = nfa.getReachableStates(state, input);

        if (reachableSet) {
          tempStateSet.addSet(reachableSet);
        }
      }

      newState = StateSet.of(tempStateSet);

      for (const state of tempStateSet) {
        const stateSet = nfa.getClosureStates(state);

        newState.addSet(stateSet);
      }

      if (newState.containsElements()) {
        const pattern = nfa.patterns.get(input);

        if (pattern) {
          dfa.addPattern(currentDfaState, input, pattern);
        }

        const nextDFAState = dfaStates.get(newState);

        if (nextDFAState !== undefined) {
          dfa.addTransition(currentDfaState, input, nextDFAState);
        } else {
          const nextState = dfa.createState();
          const storeState = StateSet.of(newState);

          dfaStates.set(storeState, nextState);
          stateSets.push(storeState);

          const acceptStateSet = nfa.getAcceptStates(storeState);

          if (acceptStateSet.containsElements()) {
            const records = createRouteRecordSet(nfa, acceptStateSet);

            dfa.addAcceptState(nextState, records);
          }

          dfa.addTransition(currentDfaState, input, nextState);
        }
      }
    }

    currentDfaState++;
  }

  return dfa;
}

function createRouteRecordSet<T>(nfa: NFA<T>, acceptStateSet: StateSet) {
  const recordSet = new Set<RouteRecord<T>>();

  for (const acceptState of acceptStateSet) {
    const payload = nfa.getPayload(acceptState);

    if (payload) {
      recordSet.add(payload);
    }
  }

  return recordSet;
}
