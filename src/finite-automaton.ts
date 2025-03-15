import { StateSet } from './state-set';
import type { State } from './types';

export interface FiniteAutomatonOptions {
  ignoreCase?: boolean;
}

export abstract class FiniteAutomaton<TPayload = void> {
  #numStates = 0;
  #initialState: State;
  #acceptStates: Map<State, TPayload>;
  #options: FiniteAutomatonOptions;

  constructor(options: FiniteAutomatonOptions) {
    this.#options = options;
    this.#initialState = this.createState();
    this.#acceptStates = new Map();
  }

  abstract addTransition(from: State, input: string, to: State): void;

  get ignoreCase() {
    return this.#options.ignoreCase ?? false;
  }

  get numStates() {
    return this.#numStates;
  }

  get initialState() {
    return this.#initialState;
  }

  createState(): State {
    return this.#numStates++;
  }

  addAcceptState(state: State, payload: TPayload) {
    this.#acceptStates.set(state, payload);
  }

  isAcceptState(state: State) {
    return this.#acceptStates.has(state);
  }

  getAcceptStates(set: StateSet) {
    const states = new StateSet();

    for (const state of set) {
      if (this.isAcceptState(state)) {
        states.add(state);
      }
    }

    return states;
  }

  getPayload(state: State) {
    return this.#acceptStates.get(state);
  }
}
