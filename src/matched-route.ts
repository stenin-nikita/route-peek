import type { PatternMatch } from './pattern';
import type { RouteRecord } from './route-record';
import type { MatchedParams } from './types';

export interface MatchedRouteData<T = void> {
  id: number;
  path: string;
  route: string;
  params: MatchedParams;
  payload: T;
  score: number;
}

export class MatchedRoute<TPayload = void> {
  #path: string;
  #record: RouteRecord<TPayload>;
  #matched: PatternMatch[];
  #params?: MatchedParams;

  constructor(path: string, record: RouteRecord<TPayload>, matched: PatternMatch[]) {
    this.#path = path;
    this.#record = record;
    this.#matched = matched;
  }

  get id() {
    return this.#record.id;
  }

  get path() {
    return this.#path;
  }

  get route() {
    return this.#record.routePath;
  }

  get params() {
    this.#params ??= this.#record.createParams(this.#matched);

    return this.#params;
  }

  get payload() {
    return this.#record.payload;
  }

  get score() {
    return this.#record.ast.score;
  }

  toJSON(): MatchedRouteData<TPayload> {
    const { id, path, route, params, payload, score } = this;

    return {
      id,
      path,
      route,
      params,
      payload,
      score,
    };
  }
}
