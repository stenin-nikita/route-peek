import { Parser } from './parser';
import { ElementType, type Segment, SegmentType } from './types';
import { escapeString, isOptionalModifier, isRepeatableModifier } from './utils';

export enum Score {
  FIXED = 80,
  DYNAMIC = 60,
  CUSTOM_REG_EXP = 10,
  OPTIONAL = -8,
  REPEATABLE = -20,
}

export interface CapturingGroup {
  name: string;
  isRepeatable: boolean;
}

export class PathPattern {
  #routePath: string;
  #pattern: RegExp;
  #capturingGroups: CapturingGroup[] = [];
  #segments: Segment[];
  #score = 0;

  constructor(routePath: string) {
    const parser = new Parser(routePath);

    this.#segments = parser.parse();
    this.#routePath = routePath;
    this.#pattern = this.#createRegExp();
  }

  get score() {
    return this.#score;
  }

  get routePath() {
    return this.#routePath;
  }

  get pattern() {
    return this.#pattern;
  }

  get segments() {
    return this.#segments;
  }

  match(path: string) {
    const keys = this.#capturingGroups;
    const match = path.match(this.#pattern);

    if (!match) {
      return null;
    }

    const params: Record<string, string | string[]> = {};

    for (let i = 1, len = match.length; i < len; i++) {
      const value: string = match[i] || '';
      const key = keys[i - 1];

      params[key.name] = value && key.isRepeatable ? value.split('/') : value;
    }

    return params;
  }

  #createRegExp() {
    const segments = this.#segments;
    let pattern = '';

    for (let i = 0, l = segments.length; i < l; i++) {
      const segmentPatterm = this.#createPattern(segments[i]);

      pattern += segmentPatterm;
    }

    return new RegExp(`^${pattern}$`);
  }

  #createPattern(segment: Segment) {
    const { modifier } = segment;
    const capturingGroups = this.#capturingGroups;
    const isRepeatable = isRepeatableModifier(modifier);
    const isOptional = isOptionalModifier(modifier);

    let segmentPattern = '';

    switch (segment.type) {
      case SegmentType.FIXED: {
        this.#score += Score.FIXED;
        segmentPattern += escapeString(segment.element.value);
        break;
      }

      case SegmentType.DYNAMIC: {
        this.#score += Score.DYNAMIC;

        for (let i = 0, len = segment.elements.length; i < len; i++) {
          const element = segment.elements[i];

          switch (element.type) {
            case ElementType.STRING:
              segmentPattern += escapeString(element.value);
              break;

            case ElementType.PATTERN:
              const { pattern } = element;

              if (pattern !== '[^/]+') {
                this.#score += Score.CUSTOM_REG_EXP;
              }

              segmentPattern += isRepeatable
                ? `((?:${pattern})(?:/(?:${pattern}))*)`
                : `(${pattern})`;

              capturingGroups.push({ name: element.name, isRepeatable });
              break;
          }
        }
        break;
      }
    }

    segmentPattern = isOptional ? `(?:/${segmentPattern})?` : `/${segmentPattern}`;

    if (isRepeatable) {
      this.#score += Score.REPEATABLE;
    }

    if (isOptional) {
      this.#score += Score.OPTIONAL;
    }

    return segmentPattern;
  }
}