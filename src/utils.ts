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

export function splitPath(path: string): string[] {
  const segments = path.split('/');

  if (segments[0] === '') {
    segments.shift();
  }

  return segments;
}

export function withLeadingSlash(routePath: string) {
  if (routePath.charCodeAt(0) !== 47) {
    return '/' + routePath;
  }

  return routePath;
}

export function withTrailingSlash(routePath: string) {
  const len = routePath.length;

  if (
    routePath === '/' ||
    (len >= 2 && routePath.charCodeAt(len - 2) === 47 && routePath.charCodeAt(len - 1) === 63)
  ) {
    return routePath;
  }

  if (len >= 1 && routePath.charCodeAt(len - 1) === 47) {
    return routePath + '?';
  }

  return routePath + '/?';
}

export function normalizeRoutePath(routePath: string, trailing = false) {
  const normalized = withLeadingSlash(routePath);

  return trailing ? withTrailingSlash(normalized) : normalized;
}
