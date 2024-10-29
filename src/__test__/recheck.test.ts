import { checkSync } from 'recheck';
import { describe, it, expect } from 'vitest';
import { PathPattern } from '../path-pattern';

const TEST_CASES = [
  { routePath: '' },
  { routePath: '/' },
  { routePath: '/home' },
  { routePath: '/home/' },
  { routePath: '/{param}' },
  { routePath: '/{param}?' },
  { routePath: '/users/{id}?' },
  { routePath: '/users/{id}?/' },
  { routePath: '/{locale}?/users' },
  { routePath: '/file/{path}*' },
  { routePath: '/{path}+' },
  { routePath: '/{path}+/' },
  { routePath: '/{filename}.{ext}' },
  { routePath: '/{filename:[a-z]+}.{ext:css|js}' },
  { routePath: '/{year:\\d{4}}-{month:\\d{2}}-{day:\\d{2}}' },
  { routePath: '/*' },
  { routePath: '/*/*' },
  { routePath: '/*?' },
  { routePath: '/**' },
  { routePath: '/*+' },
  { routePath: '/**/**' },
];

describe('recheck', () => {
  it.each(TEST_CASES)('$routePath should be safe', ({ routePath }) => {
    const pattern = new PathPattern(routePath);

    const result = checkSync(pattern.re.source, pattern.re.flags);

    expect(result.status).toBe('safe');
  });
});
