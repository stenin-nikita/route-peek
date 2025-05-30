import { Lexer } from './lexer';
import {
  type CapturingGroup,
  type DynamicSegment,
  ElementType,
  type FixedSegment,
  type PathRoot,
  type PatternElement,
  Score,
  type Segment,
  SegmentModifier,
  SegmentType,
  type StringElement,
  type Token,
  TokenType,
} from './types';
import { isOptionalModifier, isRepeatableModifier } from './utils';

const ELEMENT_TOKENS = {
  [TokenType.STRING]: true,
  [TokenType.NAME]: true,
} as Record<TokenType, boolean | undefined>;

const SEGMENT_TOKENS = {
  ...ELEMENT_TOKENS,
  [TokenType.ASTERISK]: true,
  [TokenType.QUESTION]: true,
  [TokenType.DELIMETER]: true,
} as Record<TokenType, boolean | undefined>;

export const DEFAULT_PATTERN = `[^\\/]+`;

export const WILDCARD_PATTERN = `(?:[^\\/]+|)`;

export class Parser {
  #lexer: Lexer;
  #nameIndex = 0;
  #parsed: PathRoot | null = null;
  #capturinGroups: CapturingGroup[] = [];
  #score = 0;

  constructor(input: string, ignoreCase?: boolean) {
    this.#lexer = new Lexer(input);

    if (!ignoreCase) {
      this.#score += Score.CASE_SENSITIVE;
    }
  }

  parse() {
    if (this.#parsed) {
      return this.#parsed;
    }

    this.#nameIndex = 0;

    const segments: Segment[] = [];
    const lexer = this.#lexer;

    let token: Token = lexer.peekToken();

    while (SEGMENT_TOKENS[token.type]) {
      if (token.type === TokenType.DELIMETER) {
        lexer.nextToken();
      }

      const segment = this.#parseSegment(segments.length);

      segments.push(segment);

      token = lexer.peekToken();

      if (token.type !== TokenType.DELIMETER && token.type !== TokenType.END) {
        throw new SyntaxError(
          `Expected ${TokenType[TokenType.END]} or ${TokenType[TokenType.DELIMETER]}, got ${TokenType[token.type]}`,
        );
      }
    }

    if (segments.length === 0) {
      segments.push(this.#createFixedSegment(this.#createStringElement('')));
    }

    this.#parsed = {
      input: lexer.input,
      segments,
      capturingGroups: this.#capturinGroups,
      score: this.#score,
    };

    return this.#parsed;
  }

  #parseSegment(index: number): Segment {
    const lexer = this.#lexer;
    const elements: Array<StringElement | PatternElement> = [];

    let token = lexer.peekToken();

    if (ELEMENT_TOKENS[token.type]) {
      while (ELEMENT_TOKENS[token.type]) {
        const element = this.#parseElement();

        elements.push(element);
        token = lexer.peekToken();
      }
    } else if (token.type === TokenType.ASTERISK) {
      const element = this.#createPatternElement(String(this.#nameIndex++), WILDCARD_PATTERN);

      lexer.nextToken();
      elements.push(element);
    } else if (token.type === TokenType.QUESTION) {
      const element = this.#createStringElement('');

      elements.push(element);
    }

    return this.#createSegment(elements, index);
  }

  #parseElement(): StringElement | PatternElement {
    const lexer = this.#lexer;
    const token = lexer.peekToken();

    switch (token.type) {
      case TokenType.STRING: {
        lexer.nextToken();

        return this.#createStringElement(token.value);
      }

      case TokenType.NAME: {
        lexer.nextToken();

        const pattern = this.#parsePattern();

        return this.#createPatternElement(token.value, pattern);
      }
    }

    const expected = [TokenType.STRING, TokenType.NAME].map((type) => TokenType[type]);

    throw new SyntaxError(`Expected ${expected.join(', ')}, got ${TokenType[token.type]}`);
  }

  #parsePattern() {
    const lexer = this.#lexer;
    const token = lexer.peekToken();

    if (token.type === TokenType.PATTERN) {
      lexer.nextToken();

      this.#score += Score.CUSTOM_REG_EXP;

      return token.value;
    }

    return DEFAULT_PATTERN;
  }

  #parseModifier() {
    const lexer = this.#lexer;
    const token = lexer.peekToken();

    let modifier = SegmentModifier.NONE;

    switch (token.type) {
      case TokenType.QUESTION:
        modifier = SegmentModifier.OPTIONAL;
        break;

      case TokenType.ASTERISK:
        modifier = SegmentModifier.ZERO_OR_MORE;
        break;

      case TokenType.PLUS:
        modifier = SegmentModifier.ONE_OR_MORE;
        break;
    }

    if (modifier !== SegmentModifier.NONE) {
      lexer.nextToken();
    }

    return modifier;
  }

  #createSegment(elements: Array<StringElement | PatternElement>, index: number) {
    const hasElements = elements.length > 0;
    const modifier = hasElements ? this.#parseModifier() : SegmentModifier.NONE;
    const isRepeatable = isRepeatableModifier(modifier);
    const isOptional = isOptionalModifier(modifier);

    if (isRepeatable) {
      this.#score += Score.REPEATABLE;
    }

    if (isOptional) {
      this.#score += Score.OPTIONAL;
    }

    if (!hasElements) {
      elements.push(this.#createStringElement(''));
    }

    if (elements.length === 1 && elements[0].type === ElementType.STRING) {
      if (isRepeatable) {
        throw new SyntaxError('Allow only optional modifier for fixed segment');
      }

      if (
        isOptional &&
        elements[0].value === '' &&
        (this.#lexer.peekToken().type !== TokenType.END || index === 0)
      ) {
        throw new SyntaxError(
          'Optional slash (/?) is allowed only at the end and cannot be the first segment',
        );
      }

      return this.#createFixedSegment(elements[0], modifier);
    }

    if (elements.length > 1 && isRepeatable) {
      throw new SyntaxError(`A repeating segment must contain only one parameter`);
    }

    return this.#createDynamicSegment(elements, modifier);
  }

  #createFixedSegment(element: StringElement, modifier = SegmentModifier.NONE): FixedSegment {
    const isTrailing = element.value === '' && modifier === SegmentModifier.OPTIONAL;

    this.#score += isTrailing ? Score.TRAILING_SLASH : Score.FIXED;

    return { type: SegmentType.FIXED, element, modifier };
  }

  #createDynamicSegment(
    elements: Array<StringElement | PatternElement>,
    modifier = SegmentModifier.NONE,
  ): DynamicSegment {
    this.#score += Score.DYNAMIC;

    if (isRepeatableModifier(modifier)) {
      this.#capturinGroups[this.#capturinGroups.length - 1].isRepeatable = true;
    }

    return { type: SegmentType.DYNAMIC, elements, modifier };
  }

  #createStringElement(value: string): StringElement {
    return { type: ElementType.STRING, value };
  }

  #createPatternElement(name: string, pattern: string): PatternElement {
    const index = this.#capturinGroups.length;

    this.#capturinGroups.push({
      name,
      index,
      isRepeatable: false,
    });

    return { type: ElementType.PATTERN, name, pattern, index };
  }
}
