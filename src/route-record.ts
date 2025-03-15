import { Parser } from './parser';
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

  createParams(matchedGroups: string[]) {
    const params: MatchedParams = Object.create(null);
    const capturingGroups = this.#ast.capturingGroups;

    let groupIndex = 0;

    for (let index = 0, len = capturingGroups.length; index < len; index += 1) {
      const { name, isRepeatable } = capturingGroups[index];

      if (isRepeatable) {
        const start = groupIndex;
        const left = len - (index + 1);

        groupIndex = Math.max(matchedGroups.length - left, start + 1);

        const value = matchedGroups.slice(start, groupIndex);

        if (params[name]) {
          if (Array.isArray(params[name])) {
            params[name].push(...value);
          } else {
            params[name] = [params[name], ...value];
          }
        } else {
          params[name] = value;
        }
      } else {
        const value = matchedGroups[groupIndex++] ?? '';

        if (params[name]) {
          if (Array.isArray(params[name])) {
            params[name].push(value);
          } else {
            params[name] = [params[name], value];
          }
        } else {
          params[name] = value;
        }
      }
    }

    return params;
  }
}
