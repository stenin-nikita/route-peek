import { describe, expect, it } from 'vitest';

import { PathPattern } from '../path-pattern';

describe('PathPattern', () => {
  it('extract last param with same name', () => {
    const pattern = new PathPattern('/{page}/{id}/{id}');

    const result = pattern.match('/users/12/34');

    expect(result).toEqual({ page: 'users', id: '34' });
  });

  it('extract repeatable params', () => {
    const pattern = new PathPattern('/{name}+');

    const result = pattern.match('/12/34');

    expect(result).toEqual({ name: ['12', '34'] });
  });
});
