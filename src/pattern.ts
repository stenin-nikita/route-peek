import type { StateSet } from './state-set';

export interface PatternMatch {
  value: string;
  pattern: Pattern;
}

export class Pattern {
  #re: RegExp;
  #groupsInfo = new Map<string, StateSet>();

  constructor(re: RegExp) {
    this.#re = re;
  }

  get key() {
    return this.#re.toString();
  }

  get re() {
    return this.#re;
  }

  match(path: string): PatternMatch[] | null {
    const match = path.match(this.#re);

    if (match) {
      const values: PatternMatch[] = [];

      for (let i = 1, len = match.length; i < len; i += 1) {
        values.push({ value: match[i], pattern: this });
      }

      return values;
    }

    return null;
  }

  appendCapturingGroups(routePath: string, groupsSet: StateSet) {
    if (this.#groupsInfo.has(routePath)) {
      this.#groupsInfo.get(routePath)?.addSet(groupsSet);
    } else {
      this.#groupsInfo.set(routePath, groupsSet);
    }
  }

  hasCapturingGroup(routePath: string, index: number) {
    return this.#groupsInfo.get(routePath)?.has(index) ?? false;
  }
}
