import { FiniteAutomaton, type FiniteAutomatonOptions } from './finite-automaton';
import { DEFAULT_PATTERN } from './parser';
import type { RouteRecord } from './route-record';
import { StateSet } from './state-set';
import {
  ElementType,
  SegmentModifier,
  SegmentType,
  type DynamicSegment,
  type Fragment,
  type Segment,
  type State,
} from './types';
import { escapeString } from './utils';

export class NFA<TPayload = void> extends FiniteAutomaton<RouteRecord<TPayload>> {
  #inputs: Set<string>;
  #transitions: Map<State, Map<string, StateSet>>;
  #patterns: Map<string, RegExp>;
  #epsilonTransitions: Map<State, StateSet>;

  constructor(options: FiniteAutomatonOptions = {}) {
    super(options);

    this.#inputs = new Set();
    this.#transitions = new Map();
    this.#patterns = new Map();
    this.#epsilonTransitions = new Map();
  }

  get inputs() {
    return this.#inputs;
  }

  get patterns() {
    return this.#patterns;
  }

  get transitions() {
    return this.#transitions;
  }

  get epsilonTransitions() {
    return this.#epsilonTransitions;
  }

  addRouteRecord(record: RouteRecord<TPayload>) {
    const { segments } = record.ast;
    const initialFragment = this.#createFragment(this.initialState, this.createState());

    this.addEpsilonTransition(initialFragment.in, initialFragment.out);

    const fragment = segments.reduce((prevFragment, segment) => {
      const nextFragment = this.#createFragmentForSegment(segment);

      return this.#createConcatFragment(prevFragment, nextFragment);
    }, initialFragment);

    this.addAcceptState(fragment.out, record);

    return fragment.out;
  }

  addTransition(from: State, input: string, to: State) {
    this.#inputs.add(input);

    if (!this.#transitions.has(from)) {
      this.#transitions.set(from, new Map());
    }

    const map = this.#transitions.get(from)!;
    const states = map.get(input);

    if (states) {
      states.add(to);
    } else {
      const set = new StateSet();

      set.add(to);
      map.set(input, set);
    }
  }

  addEpsilonTransition(from: State, to: State) {
    if (this.#epsilonTransitions.has(from)) {
      this.#epsilonTransitions.get(from)!.add(to);
    } else {
      const set = new StateSet();

      set.add(to);
      this.#epsilonTransitions.set(from, set);
    }
  }

  getClosureStates(startState: State) {
    const stack = new StateSet();
    const closure = new StateSet();

    stack.add(startState);
    closure.add(startState);

    while (stack.containsElements()) {
      const state = stack.shift();
      const nextStates = this.#epsilonTransitions.get(state);

      if (nextStates) {
        stack.addSet(closure.complement(nextStates));
        closure.addSet(nextStates);
      }
    }

    return closure;
  }

  getReachableStates(state: State, input: string) {
    return this.#transitions.get(state)?.get(input);
  }

  #createFragmentForSegment(segment: Segment) {
    const input = this.#createSegmentInput(segment);

    const fragment =
      typeof input === 'string'
        ? this.#createValueFragment(input)
        : this.#createRegExpFragment(input);

    switch (segment.modifier) {
      case SegmentModifier.ZERO_OR_MORE:
        return this.#createZeroOrMoreFragment(fragment);

      case SegmentModifier.ONE_OR_MORE:
        return this.#createOneOrMoreFragment(fragment);

      case SegmentModifier.OPTIONAL:
        return this.#createOptionalFragment(fragment);
    }

    return fragment;
  }

  #createSegmentInput(segment: Segment) {
    switch (segment.type) {
      case SegmentType.FIXED: {
        const value = this.ignoreCase ? segment.element.value.toLowerCase() : segment.element.value;

        return `/${value}`;
      }

      case SegmentType.DYNAMIC: {
        return this.#createSegmentRegExp(segment);
      }
    }
  }

  #createSegmentRegExp(segment: DynamicSegment) {
    let pattern = '';
    let ref = '';
    let hasDefaultPattern = false;

    const len = segment.elements.length;
    const isPossibleUnsafe = len > 1;

    for (let i = 0; i < len; i++) {
      const element = segment.elements[i];

      switch (element.type) {
        case ElementType.STRING: {
          const value = escapeString(element.value);

          pattern += value;

          if (isPossibleUnsafe) {
            ref += value;
          }

          break;
        }

        case ElementType.PATTERN: {
          if (!hasDefaultPattern && element.pattern === DEFAULT_PATTERN) {
            hasDefaultPattern = true;
          }

          pattern += `(${element.pattern})`;

          if (isPossibleUnsafe) {
            ref += `\\${element.index + 1}`;
          }

          break;
        }
      }
    }

    if (isPossibleUnsafe && hasDefaultPattern) {
      pattern = `(?=${pattern})(?:${ref})`;
    }

    return new RegExp(`^${pattern}$`, this.ignoreCase ? 'i' : '');
  }

  #createFragment(inState: State, outState: State) {
    const fragment: Fragment = {
      in: inState,
      out: outState,
    };

    return fragment;
  }

  #createValueFragment(value: string) {
    const inState = this.createState();
    const outState = this.createState();

    this.addTransition(inState, value, outState);

    return this.#createFragment(inState, outState);
  }

  #createRegExpFragment(re: RegExp) {
    const input = re.toString();
    const fragment = this.#createValueFragment(input);

    if (!this.#patterns.has(input)) {
      this.#patterns.set(input, re);
    }

    return fragment;
  }

  #createZeroOrMoreFragment(fragment: Fragment) {
    const inState = this.createState();
    const outState = this.createState();

    this.addEpsilonTransition(inState, fragment.in);
    this.addEpsilonTransition(fragment.out, outState);
    this.addEpsilonTransition(inState, outState);
    this.addEpsilonTransition(fragment.out, fragment.in);

    return this.#createFragment(inState, outState);
  }

  #createOneOrMoreFragment(fragment: Fragment) {
    const inState = this.createState();
    const outState = this.createState();

    this.addEpsilonTransition(inState, fragment.in);
    this.addEpsilonTransition(fragment.out, outState);
    this.addEpsilonTransition(fragment.out, fragment.in);

    return this.#createFragment(inState, outState);
  }

  #createOptionalFragment(fragment: Fragment) {
    this.addEpsilonTransition(fragment.in, fragment.out);

    return fragment;
  }

  #createConcatFragment(first: Fragment, second: Fragment) {
    this.addEpsilonTransition(first.out, second.in);

    return this.#createFragment(first.in, second.out);
  }
}
