import { describe, expect, it } from 'vitest';

import { PathPattern } from '../path-pattern';

describe('PathPattern', () => {
  describe('match', () => {
    it(`should match '' with input '/'`, () => {
      const pattern = new PathPattern('');

      const result = pattern.exec('/');

      expect(result).toEqual({});
    });

    it(`should match '/' with input '/'`, () => {
      const pattern = new PathPattern('/');

      const result = pattern.exec('/');

      expect(result).toEqual({});
    });

    it(`should not match '' with input ''`, () => {
      const pattern = new PathPattern('');

      const result = pattern.exec('');

      expect(result).toEqual(null);
    });

    it(`should not match '/' with input ''`, () => {
      const pattern = new PathPattern('/');

      const result = pattern.exec('');

      expect(result).toEqual(null);
    });

    it(`should not match '/' with input '/home'`, () => {
      const pattern = new PathPattern('/');

      const result = pattern.exec('/home');

      expect(result).toEqual(null);
    });

    it(`should not match '/home' with input '/'`, () => {
      const pattern = new PathPattern('/home');

      const result = pattern.exec('/');

      expect(result).toEqual(null);
    });

    it(`should match '/home' with input '/home'`, () => {
      const pattern = new PathPattern('/home');

      const result = pattern.exec('/home');

      expect(result).toEqual({});
    });

    it(`should not match '/home' with input '/index'`, () => {
      const pattern = new PathPattern('/home');

      const result = pattern.exec('/index');

      expect(result).toEqual(null);
    });

    it(`should not match '/home' with input '/home/page'`, () => {
      const pattern = new PathPattern('/home');

      const result = pattern.exec('/home/page');

      expect(result).toEqual(null);
    });

    it(`should not match '/home' with input '/home/'`, () => {
      const pattern = new PathPattern('/home');

      const result = pattern.exec('/home/');

      expect(result).toEqual(null);
    });

    it(`should not match '/home' with input '/Home'`, () => {
      const pattern = new PathPattern('/home');

      const result = pattern.exec('/Home');

      expect(result).toEqual(null);
    });

    it(`should match '/home' with ignoreCase and input '/Home'`, () => {
      const pattern = new PathPattern('/home', { ignoreCase: true });

      const result = pattern.exec('/Home');

      expect(result).toEqual({});
    });

    it(`should not match '/home/' with input '/home'`, () => {
      const pattern = new PathPattern('/home/');

      const result = pattern.exec('/home');

      expect(result).toEqual(null);
    });

    it(`should match '/home/' with input '/home/'`, () => {
      const pattern = new PathPattern('/home/');

      const result = pattern.exec('/home/');

      expect(result).toEqual({});
    });

    it(`should not match '/{param}' with input '/'`, () => {
      const pattern = new PathPattern('/{param}');

      const result = pattern.exec('/');

      expect(result).toEqual(null);
    });

    it(`should match '/{param}' with input '/about'`, () => {
      const pattern = new PathPattern('/{param}');

      const result = pattern.exec('/about');

      expect(result).toEqual({ param: 'about' });
    });

    it(`should not match '/{param}' with input '/about/'`, () => {
      const pattern = new PathPattern('/{param}');

      const result = pattern.exec('/about/');

      expect(result).toEqual(null);
    });

    it(`should match '/{param}?' with input ''`, () => {
      const pattern = new PathPattern('/{param}?');

      const result = pattern.exec('');

      expect(result).toEqual({ param: '' });
    });

    it.skip(`should match '/{param}?' with input '/'`, () => {
      const pattern = new PathPattern('/{param}?');

      const result = pattern.exec('/');

      expect(result).toEqual({ param: '' });
    });

    it(`should match '/{param}?' with input '/users'`, () => {
      const pattern = new PathPattern('/{param}?');

      const result = pattern.exec('/users');

      expect(result).toEqual({ param: 'users' });
    });

    it(`should not match '/{param}?' with input '/users/123'`, () => {
      const pattern = new PathPattern('/{param}?');

      const result = pattern.exec('/users/123');

      expect(result).toEqual(null);
    });

    it.skip(`should match '/users/{id}?' with input '/users/'`, () => {
      const pattern = new PathPattern('/users/{id}?');

      const result = pattern.exec('/users/');

      expect(result).toEqual({ id: '' });
    });

    it(`should match '/users/{id}?' with input '/users'`, () => {
      const pattern = new PathPattern('/users/{id}?');

      const result = pattern.exec('/users');

      expect(result).toEqual({ id: '' });
    });

    it(`should match '/users/{id}?' with input '/users/123'`, () => {
      const pattern = new PathPattern('/users/{id}?');

      const result = pattern.exec('/users/123');

      expect(result).toEqual({ id: '123' });
    });

    it(`should match '/{locale}?/users' with input '/users'`, () => {
      const pattern = new PathPattern('/{locale}?/users');

      const result = pattern.exec('/users');

      expect(result).toEqual({ locale: '' });
    });

    it(`should match '/{locale}?/users' with input '/en/users'`, () => {
      const pattern = new PathPattern('/{locale}?/users');

      const result = pattern.exec('/en/users');

      expect(result).toEqual({ locale: 'en' });
    });

    it(`should match '/file/{path}*' with input '/file'`, () => {
      const pattern = new PathPattern('/file/{path}*');

      const result = pattern.exec('/file');

      expect(result).toEqual({ path: [''] });
    });

    it(`should match '/file/{path}*' with input '/file/a'`, () => {
      const pattern = new PathPattern('/file/{path}*');

      const result = pattern.exec('/file/a');

      expect(result).toEqual({ path: ['a'] });
    });

    it.skip(`should match '/{path}*' with input '/a/b/'`, () => {
      const pattern = new PathPattern('/{path}*');

      const result = pattern.exec('/a/b/');

      expect(result).toEqual({ path: ['a', 'b', ''] });
    });

    it(`should match '/file/{path}*' with input '/file/a/b/c'`, () => {
      const pattern = new PathPattern('/file/{path}*');

      const result = pattern.exec('/file/a/b/c');

      expect(result).toEqual({ path: ['a', 'b', 'c'] });
    });

    it(`should match '/{path}+' with input '/a'`, () => {
      const pattern = new PathPattern('/{path}+');

      const result = pattern.exec('/a');

      expect(result).toEqual({ path: ['a'] });
    });

    it(`should match '/{path}+' with input '/a/b'`, () => {
      const pattern = new PathPattern('/{path}+');

      const result = pattern.exec('/a/b');

      expect(result).toEqual({ path: ['a', 'b'] });
    });

    it(`should match '/{path}+' with input '/a/b/c'`, () => {
      const pattern = new PathPattern('/{path}+');

      const result = pattern.exec('/a/b/c');

      expect(result).toEqual({ path: ['a', 'b', 'c'] });
    });

    it.skip(`should match '/{path}+' with input '/a/b/'`, () => {
      const pattern = new PathPattern('/{path}+');

      const result = pattern.exec('/a/b/');

      expect(result).toEqual({ path: ['a', 'b', ''] });
    });

    it(`should match '/{filename}.{ext}' with input '/main.css'`, () => {
      const pattern = new PathPattern('/{filename}.{ext}');

      const result = pattern.exec('/main.css');

      expect(result).toEqual({ filename: 'main', ext: 'css' });
    });

    it(`should match '/{filename}.{ext}' with input '/main.abc.css'`, () => {
      const pattern = new PathPattern('/{filename}.{ext}');

      const result = pattern.exec('/main.abc.css');

      expect(result).toEqual({ filename: 'main.abc', ext: 'css' });
    });

    it(`should not match '/{filename}.{ext}' with input '/.css'`, () => {
      const pattern = new PathPattern('/{filename}.{ext}');

      const result = pattern.exec('/.css');

      expect(result).toEqual(null);
    });

    it(`should not match '/{filename}.{ext}' with input '/main.'`, () => {
      const pattern = new PathPattern('/{filename}.{ext}');

      const result = pattern.exec('/main.');

      expect(result).toEqual(null);
    });

    it(`should match '/{filename:[a-z]+}.{ext:css|js}' with input '/main.css'`, () => {
      const pattern = new PathPattern('/{filename:[a-z]+}.{ext:css|js}');

      const result = pattern.exec('/main.css');

      expect(result).toEqual({ filename: 'main', ext: 'css' });
    });

    it(`should not match '/{filename:[a-z]+}.{ext:css|js}' with input '/main.ts'`, () => {
      const pattern = new PathPattern('/{filename:[a-z]+}.{ext:css|js}');

      const result = pattern.exec('/main.ts');

      expect(result).toEqual(null);
    });

    it(`should not match '/{filename:[a-z]+}.{ext:css|js}' with input '/main-chunk.css'`, () => {
      const pattern = new PathPattern('/{filename:[a-z]+}.{ext:css|js}');

      const result = pattern.exec('/main-chunk.css');

      expect(result).toEqual(null);
    });

    it(`should match '/{year:\\d{4}}-{month:\\d{2}}-{day:\\d{2}}' with input '/2024-09-13'`, () => {
      const pattern = new PathPattern('/{year:\\d{4}}-{month:\\d{2}}-{day:\\d{2}}');

      const result = pattern.exec('/2024-09-13');

      expect(result).toEqual({ year: '2024', month: '09', day: '13' });
    });

    it(`should not match '/{year:\\d{4}}-{month:\\d{2}}-{day:\\d{2}}' with input '/24-09-13'`, () => {
      const pattern = new PathPattern('/{year:\\d{4}}-{month:\\d{2}}-{day:\\d{2}}');

      const result = pattern.exec('/24-09-13');

      expect(result).toEqual(null);
    });

    it('should extract param with same name', () => {
      const pattern = new PathPattern('/users/{id}/comments/{id}');

      const result = pattern.exec('/users/12/comments/34');

      expect(result).toEqual({ id: ['12', '34'] });
    });
  });
});
