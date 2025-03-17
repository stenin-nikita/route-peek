import { Parser } from './parser';
import type { PatternMatch } from './pattern';
import type { MatchedParams, PathRoot } from './types';

export class RouteRecord<T = void> {
  #ast: PathRoot;

  #payload: T;

  constructor(routePath: string, payload: T) {
    const parser = new Parser(routePath);

    this.#ast = parser.parse();
    this.#payload = payload;
  }

  get routePath() {
    return this.#ast.input;
  }

  get payload() {
    return this.#payload;
  }

  get ast() {
    return this.#ast;
  }

  createParams(matched: PatternMatch[]) {
    const params: MatchedParams = Object.create(null);
    const capturingGroups = this.#ast.capturingGroups;
    const groupsCount = capturingGroups.length;

    let index = 0;

    for (let groupIndex = 0; groupIndex < groupsCount; groupIndex += 1) {
      const { name, isRepeatable } = capturingGroups[groupIndex];
      const match = matched[index];

      if (match && match.pattern.hasCapturingGroup(this.routePath, groupIndex)) {
        if (isRepeatable) {
          const remaining = groupsCount - (groupIndex + 1);
          const end = Math.max(matched.length - remaining, index + 1);
          const values = matched.slice(index, end).map((m) => m.value);

          index = end;

          this.#setValue(params, name, values);
        } else {
          this.#setValue(params, name, match.value);

          index++;
        }
      } else {
        this.#setValue(params, name, isRepeatable ? [] : '');
      }
    }

    return params;
  }

  #setValue(params: MatchedParams, name: string, value: string | string[]) {
    if (params[name]) {
      const values: string[] = [];

      params[name] = values.concat(params[name], value);
    } else {
      params[name] = value;
    }
  }
}
