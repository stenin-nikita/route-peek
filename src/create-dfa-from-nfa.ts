import { DFA } from './dfa';
import { HashMap } from './hash-map';
import type { NFA } from './nfa';
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
    const records = Array.from(acceptStateSet, (s) => nfa.getPayload(s)!);

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
        const re = nfa.patterns.get(input);

        if (re) {
          dfa.addPattern(currentDfaState, input, re);
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
            const records = Array.from(acceptStateSet, (s) => nfa.getPayload(s)!);

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
