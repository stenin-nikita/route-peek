import { Lexer } from './lexer';
import {
  type DynamicSegment,
  ElementType,
  type FixedSegment,
  type PatternElement,
  type Segment,
  SegmentModifier,
  SegmentType,
  type StringElement,
  type Token,
  TokenType,
} from './types';
import { isRepeatableModifier } from './utils';

const ELEMENT_TOKENS = {
  [TokenType.STRING]: true,
  [TokenType.NAME]: true,
} as Record<TokenType, boolean | undefined>;

const SEGMENT_TOKENS = {
  ...ELEMENT_TOKENS,
  [TokenType.ASTERISK]: true,
  [TokenType.DELIMETER]: true,
} as Record<TokenType, boolean | undefined>;

export const DEFAULT_PATTERN = '[^/]+';

export class Parser {
  #lexer: Lexer;
  #nameIndex = 0;
  #parsed: Segment[] | null = null;

  constructor(input: string) {
    this.#lexer = new Lexer(input);
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

      const segment = this.#parseSegment();

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

    this.#parsed = segments;

    return segments;
  }

  #parseSegment(): Segment {
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
      const element = this.#createPatternElement(String(this.#nameIndex++), DEFAULT_PATTERN);

      lexer.nextToken();
      elements.push(element);
    }

    return this.#createSegment(elements);
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

  #createSegment(elements: Array<StringElement | PatternElement>) {
    const hasElements = elements.length > 0;
    const modifier = hasElements ? this.#parseModifier() : SegmentModifier.NONE;
    const isRepeatable = isRepeatableModifier(modifier);

    if (!hasElements) {
      elements.push(this.#createStringElement(''));
    }

    if (elements.length === 1 && elements[0].type === ElementType.STRING) {
      if (isRepeatable) {
        throw new SyntaxError('Allow only optional modifier for fixed segment');
      }

      return this.#createFixedSegment(elements[0], modifier);
    }

    if (elements.length > 1 && isRepeatable) {
      throw new SyntaxError(`A repeating segment must contain only one parameter`);
    }

    return this.#createDynamicSegment(elements, modifier);
  }

  #createFixedSegment(element: StringElement, modifier = SegmentModifier.NONE): FixedSegment {
    return { type: SegmentType.FIXED, element, modifier };
  }

  #createDynamicSegment(
    elements: Array<StringElement | PatternElement>,
    modifier = SegmentModifier.NONE,
  ): DynamicSegment {
    return { type: SegmentType.DYNAMIC, elements, modifier };
  }

  #createStringElement(value: string): StringElement {
    return { type: ElementType.STRING, value };
  }

  #createPatternElement(name: string, pattern: string): PatternElement {
    return { type: ElementType.PATTERN, name, pattern };
  }
}
