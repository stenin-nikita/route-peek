import { type Token, TokenType } from './types';
import { createToken } from './utils';

export enum LexerState {
  INITIAL,
  STRING,
  NAME,
  PATTERN,
}

const START_TOKEN = createToken(TokenType.START, '');
const RE_ID_START = /[$_\p{ID_Start}]/u;
const RE_ID_PART = /[$_\u200C\u200D\p{ID_Continue}]/u;
const ASCII_RE = /^[\x00-\x7F]*$/;

export class Lexer {
  #input: string;
  #start = 0;
  #end = 0;
  #index = 0;
  #balance = 0;
  #tokens: Token[] = [START_TOKEN];
  #statesStack = [LexerState.INITIAL];

  constructor(input: string) {
    this.#input = input;
  }

  get input() {
    return this.#input;
  }

  hasMore() {
    return this.#end < this.#input.length;
  }

  nextToken() {
    const tokens = this.#tokens;
    const index = this.#index;
    const currentToken = tokens[index];

    if (currentToken.type === TokenType.END) {
      return currentToken;
    }

    const nextToken = tokens[index + 1];

    if (nextToken) {
      this.#index++;

      return nextToken;
    }

    this.#start = this.#end;
    let token: Token | null = null;

    while (token === null) {
      token = this.#nextToken();
    }

    this.#index++;
    tokens.push(token);

    return token;
  }

  peekToken(): Token {
    const index = this.#index;
    const nextToken = this.#tokens[index + 1];

    if (nextToken) {
      return nextToken;
    }

    const token = this.nextToken();

    this.#index = index;

    return token;
  }

  #peekChar() {
    return this.#input[this.#end] ?? '\0';
  }

  #nextToken(): Token | null {
    const stack = this.#statesStack;
    const currentState = stack[stack.length - 1];
    const char = this.#peekChar();

    switch (currentState) {
      case LexerState.INITIAL:
        return this.#readInitialToken(char);

      case LexerState.STRING:
        return this.#readStringToken(char);

      case LexerState.NAME:
        return this.#readNameToken(char);

      case LexerState.PATTERN:
        return this.#readPatternToken(char);
    }
  }

  #readInitialToken(char: string) {
    switch (char) {
      case '{':
        this.#statesStack.push(LexerState.NAME);
        this.#end++;

        return null;

      case '/':
        this.#end++;

        return createToken(TokenType.DELIMETER, char);

      case '?':
        this.#end++;

        return createToken(TokenType.QUESTION, char);

      case '*':
        this.#end++;

        return createToken(TokenType.ASTERISK, char);

      case '+':
        this.#end++;

        return createToken(TokenType.PLUS, char);

      case '\0':
        return createToken(TokenType.END, char);
    }

    this.#statesStack.push(LexerState.STRING);

    return this.#readStringToken(char);
  }

  #readStringToken(char: string) {
    switch (char) {
      case '{':
      case '/':
      case '?':
      case '*':
      case '+':
      case '\0':
        this.#statesStack.pop();

        return createToken(
          TokenType.STRING,
          // TODO: подумать что сделать с escaped chars
          this.#input.slice(this.#start, this.#end).replace(/\\/g, ''),
        );

      case '\\':
        if (this.#end === this.#input.length - 1) {
          throw new SyntaxError(`Trailing escape character at index ${this.#end}`);
        }

        this.#end += 2;

        return null;
    }

    this.#end++;

    return null;
  }

  #readNameToken(char: string) {
    const start = this.#start + 1;
    const end = this.#end;
    const re = start === end ? RE_ID_START : RE_ID_PART;

    if (re.test(char)) {
      this.#end++;

      return null;
    }

    if (char !== ':' && char !== '}') {
      throw new SyntaxError(
        `Invalid char at index ${this.#end}. Expected ':' or '}', got '${char}'`,
      );
    }

    if (end > start) {
      this.#statesStack.pop();

      if (char === ':') {
        this.#statesStack.push(LexerState.PATTERN);
      }

      if (char === '}') {
        this.#end++;
      }

      return createToken(TokenType.NAME, this.#input.slice(start, end));
    }

    throw new SyntaxError(`Empty name`);
  }

  #readPatternToken(char: string) {
    if (this.#start + 1 === this.#end && char === '?') {
      throw new SyntaxError(`Pattern cannot start with "?" at index ${this.#end}`);
    }

    // TODO: Подумать на проверкой символа
    if (!ASCII_RE.test(char)) {
      throw new SyntaxError(`Invalid non-ASCII character ${char} at index ${this.#end}.`);
    }

    switch (char) {
      case '{': {
        this.#balance++;
        break;
      }

      case '}': {
        if (this.#balance === 0) {
          const start = this.#start + 1;
          const end = this.#end++;

          if (start === end) {
            throw new SyntaxError('Empty pattern');
          }

          this.#statesStack.pop();

          return createToken(TokenType.PATTERN, this.#input.slice(start, end));
        }

        this.#balance--;
        break;
      }

      case '(':
        if (this.#input[this.#end + 1] !== '?') {
          throw new SyntaxError(`Capturing groups are not allowed at ${this.#end}`);
        }

        break;

      case '\\': {
        if (this.#end === this.#input.length - 1) {
          throw new SyntaxError(`Trailing escape character at index ${this.#end}`);
        }

        this.#end += 2;

        return null;
      }

      case '\0': {
        throw new SyntaxError('Unbalanced pattern');
      }
    }

    this.#end++;

    return null;
  }
}
