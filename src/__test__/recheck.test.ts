import { checkSync } from 'recheck';
import { describe, it, expect } from 'vitest';
import { NFA } from '../nfa';
import { RouteRecord } from '../route-record';

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
    const nfa = new NFA();
    const record = new RouteRecord(routePath, undefined);

    nfa.addRouteRecord(record);

    for (const pattern of nfa.patterns.values()) {
      const result = checkSync(pattern.source, pattern.flags);

      expect(result.status).toBe('safe');
    }
  });
});
