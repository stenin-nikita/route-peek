import { describe, expect, it } from 'vitest';

import { PathPattern } from '../path-pattern';

describe('PathPattern', () => {
  describe('match', () => {
    describe('empty', () => {
      const pattern = new PathPattern('');

      it(`should match with input ''`, () => {
        const result = pattern.exec('');

        expect(result).toEqual({});
      });

      it(`should match with input '/'`, () => {
        const result = pattern.exec('/');

        expect(result).toEqual({});
      });
    });

    describe('/', () => {
      const pattern = new PathPattern('/');

      it(`should match with input ''`, () => {
        const result = pattern.exec('');

        expect(result).toEqual({});
      });

      it(`should match with input '/'`, () => {
        const result = pattern.exec('/');

        expect(result).toEqual({});
      });

      it(`should not match with input '/home'`, () => {
        const result = pattern.exec('/home');

        expect(result).toEqual(null);
      });
    });

    describe('/home', () => {
      const pattern = new PathPattern('/home');

      it(`should not match with input '/'`, () => {
        const result = pattern.exec('/');

        expect(result).toEqual(null);
      });

      it(`should match with input '/home'`, () => {
        const result = pattern.exec('/home');

        expect(result).toEqual({});
      });

      it(`should not match with input '/index'`, () => {
        const result = pattern.exec('/index');

        expect(result).toEqual(null);
      });

      it(`should not match with input '/home/page'`, () => {
        const result = pattern.exec('/home/page');

        expect(result).toEqual(null);
      });

      it(`should not match with input '/home/'`, () => {
        const result = pattern.exec('/home/');

        expect(result).toEqual(null);
      });

      it(`should not match with input '/Home'`, () => {
        const result = pattern.exec('/Home');

        expect(result).toEqual(null);
      });

      it(`should match with ignoreCase and input '/Home'`, () => {
        const pattern = new PathPattern('/home', { ignoreCase: true });

        const result = pattern.exec('/Home');

        expect(result).toEqual({});
      });
    });

    describe('/home/', () => {
      const pattern = new PathPattern('/home/');

      it(`should not match with input '/home'`, () => {
        const result = pattern.exec('/home');

        expect(result).toEqual(null);
      });

      it(`should match with input '/home/'`, () => {
        const result = pattern.exec('/home/');

        expect(result).toEqual({});
      });
    });

    describe('/{param}', () => {
      const pattern = new PathPattern('/{param}');

      it(`should not match with input '/'`, () => {
        const result = pattern.exec('/');

        expect(result).toEqual(null);
      });

      it(`should match with input '/about'`, () => {
        const result = pattern.exec('/about');

        expect(result).toEqual({ param: 'about' });
      });

      it(`should not match with input '/about/'`, () => {
        const result = pattern.exec('/about/');

        expect(result).toEqual(null);
      });
    });

    describe('/{param}?', () => {
      const pattern = new PathPattern('/{param}?');

      it(`should match with input ''`, () => {
        const result = pattern.exec('');

        expect(result).toEqual({ param: '' });
      });

      it(`should match with input '/'`, () => {
        const result = pattern.exec('/');

        expect(result).toEqual({ param: '' });
      });

      it(`should match with input '/users'`, () => {
        const result = pattern.exec('/users');

        expect(result).toEqual({ param: 'users' });
      });

      it(`should not match with input '/users/123'`, () => {
        const result = pattern.exec('/users/123');

        expect(result).toEqual(null);
      });
    });

    describe('/users/{id}?', () => {
      const pattern = new PathPattern('/users/{id}?');

      it(`should not match with input '/users/123/'`, () => {
        const result = pattern.exec('/users/123/');

        expect(result).toEqual(null);
      });

      it(`should match with input '/users/123'`, () => {
        const result = pattern.exec('/users/123');

        expect(result).toEqual({ id: '123' });
      });

      it(`should not match with input '/users//'`, () => {
        const result = pattern.exec('/users//');

        expect(result).toEqual(null);
      });

      it(`should match with input '/users/'`, () => {
        const result = pattern.exec('/users/');

        expect(result).toEqual({ id: '' });
      });

      it(`should match with input '/users'`, () => {
        const result = pattern.exec('/users');

        expect(result).toEqual({ id: '' });
      });
    });

    describe('/users/{id}?/', () => {
      const pattern = new PathPattern('/users/{id}?/');

      it(`should match with input '/users/123/'`, () => {
        const result = pattern.exec('/users/123/');

        expect(result).toEqual({ id: '123' });
      });

      it(`should not match with input '/users/123'`, () => {
        const result = pattern.exec('/users/123');

        expect(result).toEqual(null);
      });

      it(`should match with input '/users//'`, () => {
        const result = pattern.exec('/users//');

        expect(result).toEqual({ id: '' });
      });

      it(`should match with input '/users/'`, () => {
        const result = pattern.exec('/users/');

        expect(result).toEqual({ id: '' });
      });

      it(`should not match with input '/users'`, () => {
        const result = pattern.exec('/users');

        expect(result).toEqual(null);
      });
    });

    describe('/{locale}?/users', () => {
      const pattern = new PathPattern('/{locale}?/users');

      it(`should match with input '/users'`, () => {
        const result = pattern.exec('/users');

        expect(result).toEqual({ locale: '' });
      });

      it(`should match with input '/en/users'`, () => {
        const result = pattern.exec('/en/users');

        expect(result).toEqual({ locale: 'en' });
      });
    });

    describe('/file/{path}*', () => {
      const pattern = new PathPattern('/file/{path}*');

      it(`should match with input '/file'`, () => {
        const result = pattern.exec('/file');

        expect(result).toEqual({ path: [''] });
      });

      it(`should match with input '/file/'`, () => {
        const result = pattern.exec('/file/');

        expect(result).toEqual({ path: [''] });
      });

      it(`should match with input '/file/a'`, () => {
        const result = pattern.exec('/file/a');

        expect(result).toEqual({ path: ['a'] });
      });

      it(`should match with input '/file/a/b/'`, () => {
        const result = pattern.exec('/file/a/b/');

        expect(result).toEqual({ path: ['a', 'b', ''] });
      });

      it(`should match with input '/file/a/b/c'`, () => {
        const result = pattern.exec('/file/a/b/c');

        expect(result).toEqual({ path: ['a', 'b', 'c'] });
      });
    });

    describe('/{path}+', () => {
      const pattern = new PathPattern('/{path}+');

      it(`should match with input '/a'`, () => {
        const result = pattern.exec('/a');

        expect(result).toEqual({ path: ['a'] });
      });

      it(`should match with input '/a/b'`, () => {
        const result = pattern.exec('/a/b');

        expect(result).toEqual({ path: ['a', 'b'] });
      });

      it(`should match with input '/a/b/c'`, () => {
        const result = pattern.exec('/a/b/c');

        expect(result).toEqual({ path: ['a', 'b', 'c'] });
      });

      it(`should not match with input '/a/b/'`, () => {
        const pattern = new PathPattern('/{path}+');

        const result = pattern.exec('/a/b/');

        expect(result).toEqual(null);
      });
    });

    describe('/{path}+/', () => {
      const pattern = new PathPattern('/{path}+/');

      it(`should match with input '/a/b/'`, () => {
        const result = pattern.exec('/a/b/');

        expect(result).toEqual({ path: ['a', 'b'] });
      });

      it(`should not match with input '/a/b'`, () => {
        const result = pattern.exec('/a/b');

        expect(result).toEqual(null);
      });
    });

    describe('/{filename}.{ext}', () => {
      const pattern = new PathPattern('/{filename}.{ext}');

      it(`should match with input '/main.css'`, () => {
        const result = pattern.exec('/main.css');

        expect(result).toEqual({ filename: 'main', ext: 'css' });
      });

      it(`should match with input '/main.abc.css'`, () => {
        const result = pattern.exec('/main.abc.css');

        expect(result).toEqual({ filename: 'main.abc', ext: 'css' });
      });

      it(`should not match with input '/.css'`, () => {
        const result = pattern.exec('/.css');

        expect(result).toEqual(null);
      });

      it(`should not match with input '/main.'`, () => {
        const result = pattern.exec('/main.');

        expect(result).toEqual(null);
      });
    });

    describe('/{filename:[a-z]+}.{ext:css|js}', () => {
      const pattern = new PathPattern('/{filename:[a-z]+}.{ext:css|js}');

      it(`should match with input '/main.css'`, () => {
        const result = pattern.exec('/main.css');

        expect(result).toEqual({ filename: 'main', ext: 'css' });
      });

      it(`should match with input '/main.css'`, () => {
        const result = pattern.exec('/main.css');

        expect(result).toEqual({ filename: 'main', ext: 'css' });
      });

      it(`should not match with input '/main.ts'`, () => {
        const result = pattern.exec('/main.ts');

        expect(result).toEqual(null);
      });

      it(`should not match with input '/main-chunk.css'`, () => {
        const result = pattern.exec('/main-chunk.css');

        expect(result).toEqual(null);
      });
    });

    describe('/{year:\\d{4}}-{month:\\d{2}}-{day:\\d{2}}', () => {
      const pattern = new PathPattern('/{year:\\d{4}}-{month:\\d{2}}-{day:\\d{2}}');

      it(`should match with input '/2024-09-13'`, () => {
        const result = pattern.exec('/2024-09-13');

        expect(result).toEqual({ year: '2024', month: '09', day: '13' });
      });

      it(`should not match with input '/24-09-13'`, () => {
        const result = pattern.exec('/24-09-13');

        expect(result).toEqual(null);
      });
    });

    it('should extract param with same name', () => {
      const pattern = new PathPattern('/users/{id}/comments/{id}');

      const result = pattern.exec('/users/12/comments/34');

      expect(result).toEqual({ id: ['12', '34'] });
    });
  });
});
