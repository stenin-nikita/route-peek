import type { RouteRecord } from './route-record';
import type { MatchedParams } from './types';

export interface MatchedRouteData<T = void> {
  path: string;
  route: string;
  params: MatchedParams;
  payload: T;
  score: number;
}

export class MatchedRoute<TPayload = void> {
  #path: string;
  #record: RouteRecord<TPayload>;
  #matchedGroups: string[];
  #params?: MatchedParams;

  constructor(path: string, record: RouteRecord<TPayload>, matchedGroups: string[]) {
    this.#path = path;
    this.#record = record;
    this.#matchedGroups = matchedGroups;
  }

  get path() {
    return this.#path;
  }

  get route() {
    return this.#record.routePath;
  }

  get params() {
    this.#params ??= this.#record.createParams(this.#matchedGroups);

    return this.#params;
  }

  get payload() {
    return this.#record.payload;
  }

  get score() {
    return this.#record.ast.score;
  }

  toJSON(): MatchedRouteData<TPayload> {
    const { path, route, params, payload, score } = this;

    return {
      path,
      route,
      params,
      payload,
      score,
    };
  }
}
