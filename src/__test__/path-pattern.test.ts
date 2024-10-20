import { describe, expect, it } from 'vitest';

import { PathPattern } from '../path-pattern';

describe('PathPattern', () => {
  describe('match', () => {
    it(`should match '' with input '/'`, () => {
      const pattern = new PathPattern('');

      const result = pattern.match('/');

      expect(result).toEqual({});
    });

    it(`should match '/' with input '/'`, () => {
      const pattern = new PathPattern('/');

      const result = pattern.match('/');

      expect(result).toEqual({});
    });

    it(`should not match '' with input ''`, () => {
      const pattern = new PathPattern('');

      const result = pattern.match('');

      expect(result).toEqual(null);
    });

    it(`should not match '/' with input ''`, () => {
      const pattern = new PathPattern('/');

      const result = pattern.match('');

      expect(result).toEqual(null);
    });

    it(`should not match '/' with input '/home'`, () => {
      const pattern = new PathPattern('/');

      const result = pattern.match('/home');

      expect(result).toEqual(null);
    });

    it(`should not match '/home' with input '/'`, () => {
      const pattern = new PathPattern('/home');

      const result = pattern.match('/');

      expect(result).toEqual(null);
    });

    it(`should match '/home' with input '/home'`, () => {
      const pattern = new PathPattern('/home');

      const result = pattern.match('/home');

      expect(result).toEqual({});
    });

    it(`should not match '/home' with input '/index'`, () => {
      const pattern = new PathPattern('/home');

      const result = pattern.match('/index');

      expect(result).toEqual(null);
    });

    it(`should not match '/home' with input '/home/page'`, () => {
      const pattern = new PathPattern('/home');

      const result = pattern.match('/home/page');

      expect(result).toEqual(null);
    });

    it(`should not match '/home' with input '/home/'`, () => {
      const pattern = new PathPattern('/home');

      const result = pattern.match('/home/');

      expect(result).toEqual(null);
    });

    it(`should not match '/home' with input '/Home'`, () => {
      const pattern = new PathPattern('/home');

      const result = pattern.match('/Home');

      expect(result).toEqual(null);
    });

    it(`should match '/home' with ignoreCase and input '/Home'`, () => {
      const pattern = new PathPattern('/home', { ignoreCase: true });

      const result = pattern.match('/Home');

      expect(result).toEqual({});
    });

    it(`should not match '/home/' with input '/home'`, () => {
      const pattern = new PathPattern('/home/');

      const result = pattern.match('/home');

      expect(result).toEqual(null);
    });

    it(`should match '/home/' with input '/home/'`, () => {
      const pattern = new PathPattern('/home/');

      const result = pattern.match('/home/');

      expect(result).toEqual({});
    });

    it(`should not match '/{param}' with input '/'`, () => {
      const pattern = new PathPattern('/{param}');

      const result = pattern.match('/');

      expect(result).toEqual(null);
    });

    it(`should match '/{param}' with input '/about'`, () => {
      const pattern = new PathPattern('/{param}');

      const result = pattern.match('/about');

      expect(result).toEqual({ param: 'about' });
    });

    it(`should not match '/{param}' with input '/about/'`, () => {
      const pattern = new PathPattern('/{param}');

      const result = pattern.match('/about/');

      expect(result).toEqual(null);
    });

    it('should extract last param with same name', () => {
      const pattern = new PathPattern('/{page}/{id}/{id}');

      const result = pattern.match('/users/12/34');

      expect(result).toEqual({ page: 'users', id: '34' });
    });

    it('should extract repeatable params', () => {
      const pattern = new PathPattern('/{name}+');

      const result = pattern.match('/12/34');

      expect(result).toEqual({ name: ['12', '34'] });
    });
  });
});
