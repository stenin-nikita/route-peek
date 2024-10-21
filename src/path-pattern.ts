import { DEFAULT_PATTERN, Parser } from './parser';
import { ElementType, type Segment, SegmentType } from './types';
import { escapeString, isOptionalModifier, isRepeatableModifier } from './utils';

export enum Score {
  FIXED = 80,
  DYNAMIC = 60,
  CUSTOM_REG_EXP = 10,
  OPTIONAL = -8,
  REPEATABLE = -20,
  CASE_SENSITIVE = 4,
}

export interface CapturingGroup {
  name: string;
  isRepeatable: boolean;
}

export interface PathPatternOptions {
  ignoreCase?: boolean;
}

export class PathPattern {
  #routePath: string;
  #re: RegExp;
  #capturingGroups: CapturingGroup[] = [];
  #segments: Segment[];
  #score = 0;
  #ignoreCase: boolean;

  constructor(routePath: string, options: PathPatternOptions = {}) {
    const parser = new Parser(routePath);

    this.#ignoreCase = options.ignoreCase ?? false;
    this.#segments = parser.parse();
    this.#routePath = routePath;
    this.#re = this.#createRegExp();
  }

  get score() {
    return this.#score;
  }

  get routePath() {
    return this.#routePath;
  }

  get re() {
    return this.#re;
  }

  get segments() {
    return this.#segments;
  }

  test(path: string) {
    return this.#re.test(path);
  }

  exec(path: string) {
    const keys = this.#capturingGroups;
    const match = path.match(this.#re);

    if (!match) {
      return null;
    }

    const params: Record<string, string | string[]> = {};

    for (let i = 1, len = match.length; i < len; i++) {
      const value: string = match[i] || '';
      const key = keys[i - 1];

      params[key.name] = key.isRepeatable ? value.split('/') : value;
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

    if (!this.#ignoreCase) {
      this.#score += Score.CASE_SENSITIVE;
    }

    const flags = this.#ignoreCase ? 'i' : '';

    return new RegExp(`^${pattern}$`, flags);
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

              if (pattern !== DEFAULT_PATTERN) {
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
