import { SegmentModifier, type Token, type TokenType } from './types';

export function escapeString(str: string) {
  return str.replace(/([.+*?^${}()[\]|/\\])/g, '\\$1');
}

export function isRepeatableModifier(modifier: SegmentModifier) {
  return modifier === SegmentModifier.ZERO_OR_MORE || modifier === SegmentModifier.ONE_OR_MORE;
}

export function isOptionalModifier(modifier: SegmentModifier) {
  return modifier === SegmentModifier.OPTIONAL || modifier === SegmentModifier.ZERO_OR_MORE;
}

export function createToken(type: TokenType, value: string) {
  const token: Token = { type, value };

  return token;
}
