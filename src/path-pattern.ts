import { DEFAULT_PATTERN, Parser } from './parser';
import { ElementType, type PathRoot, type Segment, SegmentType } from './types';
import { escapeString, isOptionalModifier, isRepeatableModifier } from './utils';

export enum Score {
  FIXED = 80,
  DYNAMIC = 60,
  CUSTOM_REG_EXP = 10,
  OPTIONAL = -8,
  REPEATABLE = -20,
  CASE_SENSITIVE = 4,
}

export interface PathPatternOptions {
  ignoreCase?: boolean;
}

export class PathPattern {
  #routePath: string;
  #re: RegExp;
  #pathRoot: PathRoot;
  #score = 0;
  #ignoreCase: boolean;

  constructor(routePath: string, options: PathPatternOptions = {}) {
    const parser = new Parser(routePath);

    this.#ignoreCase = options.ignoreCase ?? false;
    this.#pathRoot = parser.parse();
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
    return this.#pathRoot.segments;
  }

  test(path: string) {
    return this.#re.test(path);
  }

  exec(path: string) {
    const capturingGroups = this.#pathRoot.capturingGroups;
    const match = path.match(this.#re);

    if (!match) {
      return null;
    }

    const params: Record<string, string | string[]> = {};

    for (let i = 1, len = match.length; i < len; i++) {
      const value: string = match[i] || '';
      const key = capturingGroups[i - 1];
      const param = params[key.name];

      if (param) {
        const values = key.isRepeatable ? value.split('/') : [value];

        if (Array.isArray(param)) {
          param.push(...values);
        } else {
          params[key.name] = [param, ...values];
        }
      } else {
        params[key.name] = key.isRepeatable ? value.split('/') : value;
      }
    }

    return params;
  }

  #createRegExp() {
    const segments = this.segments;
    let pattern = '';

    for (let i = 0, l = segments.length; i < l; i++) {
      const segmentPatterm = this.#createPattern(segments[i]);

      pattern += segmentPatterm;
    }

    if (!this.#ignoreCase) {
      this.#score += Score.CASE_SENSITIVE;
    }

    const flags = this.#ignoreCase ? 'i' : '';

    if (pattern === '/') {
      pattern = `(?:${pattern}|)`;
    }

    return new RegExp(`^${pattern}$`, flags);
  }

  #createPattern(segment: Segment) {
    const { modifier } = segment;
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

        const len = segment.elements.length;
        const isPossibleUnsafe = len > 1;

        let hasDefaultPattern = false;
        let refPattern = '';

        for (let i = 0; i < len; i++) {
          const element = segment.elements[i];

          switch (element.type) {
            case ElementType.STRING: {
              const value = escapeString(element.value);

              segmentPattern += value;
              refPattern += value;

              break;
            }

            case ElementType.PATTERN: {
              if (element.pattern !== DEFAULT_PATTERN) {
                this.#score += Score.CUSTOM_REG_EXP;
              } else if (!hasDefaultPattern) {
                hasDefaultPattern = true;
              }

              const pattern = isOptional ? `${element.pattern}|` : element.pattern;

              segmentPattern += isRepeatable
                ? `((?:${pattern})(?:/(?:${pattern}))*?)`
                : `(${pattern})`;

              refPattern += `\\${element.index + 1}`;

              break;
            }
          }
        }

        if (isPossibleUnsafe && hasDefaultPattern) {
          segmentPattern = `(?=${segmentPattern})${refPattern}`;
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
