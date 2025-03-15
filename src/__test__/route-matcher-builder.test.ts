import { describe, expect, it } from 'vitest';

import { type RouteMatcher, type RouteMatcherOptions } from '../route-matcher';
import { RouteMatcherBuilder } from '../route-matcher-builder';

class SimpleMatcher {
  #matcher: RouteMatcher;

  constructor(routePath: string, options: RouteMatcherOptions = {}) {
    const builder = new RouteMatcherBuilder();

    if (options.ignoreCase) {
      builder.setIgnoreCase(options.ignoreCase);
    }

    builder.add(routePath);

    this.#matcher = builder.build();
  }

  match(path: string) {
    const [matched] = this.#matcher.match(path);

    return matched ? matched : null;
  }
}

describe('RouteMatcherBuilder', () => {
  describe('match', () => {
    describe('empty', () => {
      const matcher = new SimpleMatcher('');

      it(`should match with input ''`, () => {
        const result = matcher.match('');

        expect(result?.params).toEqual({});
      });

      it(`should match with input '/'`, () => {
        const result = matcher.match('/');

        expect(result?.params).toEqual({});
      });
    });

    describe('/', () => {
      const matcher = new SimpleMatcher('/');

      it(`should match with input ''`, () => {
        const result = matcher.match('');

        expect(result?.params).toEqual({});
      });

      it(`should match with input '/'`, () => {
        const result = matcher.match('/');

        expect(result?.params).toEqual({});
      });

      it(`should not match with input '/home'`, () => {
        const result = matcher.match('/home');

        expect(result).toEqual(null);
      });
    });

    describe('/home', () => {
      const matcher = new SimpleMatcher('/home');

      it(`should not match with input '/'`, () => {
        const result = matcher.match('/');

        expect(result).toEqual(null);
      });

      it(`should match with input '/home'`, () => {
        const result = matcher.match('/home');

        expect(result?.params).toEqual({});
      });

      it(`should not match with input '/index'`, () => {
        const result = matcher.match('/index');

        expect(result).toEqual(null);
      });

      it(`should not match with input '/home/page'`, () => {
        const result = matcher.match('/home/page');

        expect(result).toEqual(null);
      });

      it(`should not match with input '/home/'`, () => {
        const result = matcher.match('/home/');

        expect(result).toEqual(null);
      });

      it(`should not match with input '/Home'`, () => {
        const result = matcher.match('/Home');

        expect(result).toEqual(null);
      });

      it(`should match with ignoreCase and input '/Home'`, () => {
        const matcher = new SimpleMatcher('/home', { ignoreCase: true });

        const result = matcher.match('/Home');

        expect(result?.params).toEqual({});
      });
    });

    describe('/home/', () => {
      const matcher = new SimpleMatcher('/home/');

      it(`should not match with input '/home'`, () => {
        const result = matcher.match('/home');

        expect(result).toEqual(null);
      });

      it(`should match with input '/home/'`, () => {
        const result = matcher.match('/home/');

        expect(result?.params).toEqual({});
      });
    });

    describe('/home?', () => {
      const matcher = new SimpleMatcher('/home?');

      it(`should match with input '/'`, () => {
        const result = matcher.match('/');

        expect(result?.params).toEqual({});
      });

      it(`should match with input '/home'`, () => {
        const result = matcher.match('/home');

        expect(result?.params).toEqual({});
      });
    });

    describe('/{param}', () => {
      const matcher = new SimpleMatcher('/{param}');

      it(`should not match with input '/'`, () => {
        const result = matcher.match('/');

        expect(result).toEqual(null);
      });

      it(`should match with input '/about'`, () => {
        const result = matcher.match('/about');

        expect(result?.params).toEqual({ param: 'about' });
      });

      it(`should not match with input '/about/'`, () => {
        const result = matcher.match('/about/');

        expect(result).toEqual(null);
      });
    });

    describe('/{param}?', () => {
      const matcher = new SimpleMatcher('/{param}?');

      it(`should match with input ''`, () => {
        const result = matcher.match('');

        expect(result?.params).toEqual({ param: '' });
      });

      it(`should match with input '/'`, () => {
        const result = matcher.match('/');

        expect(result?.params).toEqual({ param: '' });
      });

      it(`should match with input '/users'`, () => {
        const result = matcher.match('/users');

        expect(result?.params).toEqual({ param: 'users' });
      });

      it(`should not match with input '/users/123'`, () => {
        const result = matcher.match('/users/123');

        expect(result).toEqual(null);
      });
    });

    describe('/users/{id}?', () => {
      const matcher = new SimpleMatcher('/users/{id}?');

      it(`should not match with input '/users/123/'`, () => {
        const result = matcher.match('/users/123/');

        expect(result).toEqual(null);
      });

      it(`should match with input '/users/123'`, () => {
        const result = matcher.match('/users/123');

        expect(result?.params).toEqual({ id: '123' });
      });

      it(`should not match with input '/users//'`, () => {
        const result = matcher.match('/users//');

        expect(result).toEqual(null);
      });

      it(`should not match with input '/users/'`, () => {
        const result = matcher.match('/users/');

        expect(result).toEqual(null);
      });

      it(`should match with input '/users'`, () => {
        const result = matcher.match('/users');

        expect(result?.params).toEqual({ id: '' });
      });
    });

    describe('/users/{id}?/', () => {
      const matcher = new SimpleMatcher('/users/{id}?/');

      it(`should match with input '/users/123/'`, () => {
        const result = matcher.match('/users/123/');

        expect(result?.params).toEqual({ id: '123' });
      });

      it(`should not match with input '/users/123'`, () => {
        const result = matcher.match('/users/123');

        expect(result).toEqual(null);
      });

      it(`should not match with input '/users//'`, () => {
        const result = matcher.match('/users//');

        expect(result).toEqual(null);
      });

      it(`should match with input '/users/'`, () => {
        const result = matcher.match('/users/');

        expect(result?.params).toEqual({ id: '' });
      });

      it(`should not match with input '/users'`, () => {
        const result = matcher.match('/users');

        expect(result).toEqual(null);
      });
    });

    describe('/{locale}?/users', () => {
      const matcher = new SimpleMatcher('/{locale}?/users');

      it(`should match with input '/users'`, () => {
        const result = matcher.match('/users');

        expect(result?.params).toEqual({ locale: '' });
      });

      it(`should match with input '/en/users'`, () => {
        const result = matcher.match('/en/users');

        expect(result?.params).toEqual({ locale: 'en' });
      });
    });

    describe('/file/{path}*', () => {
      const matcher = new SimpleMatcher('/file/{path}*');

      it(`should match with input '/file'`, () => {
        const result = matcher.match('/file');

        expect(result?.params).toEqual({ path: [] });
      });

      it(`should not match with input '/file/'`, () => {
        const result = matcher.match('/file/');

        expect(result).toEqual(null);
      });

      it(`should match with input '/file/a'`, () => {
        const result = matcher.match('/file/a');

        expect(result?.params).toEqual({ path: ['a'] });
      });

      it(`should not match with input '/file/a/b/'`, () => {
        const result = matcher.match('/file/a/b/');

        expect(result).toEqual(null);
      });

      it(`should match with input '/file/a/b/c'`, () => {
        const result = matcher.match('/file/a/b/c');

        expect(result?.params).toEqual({ path: ['a', 'b', 'c'] });
      });
    });

    describe('/{path}+', () => {
      const matcher = new SimpleMatcher('/{path}+');

      it(`should match with input '/a'`, () => {
        const result = matcher.match('/a');

        expect(result?.params).toEqual({ path: ['a'] });
      });

      it(`should match with input '/a/b'`, () => {
        const result = matcher.match('/a/b');

        expect(result?.params).toEqual({ path: ['a', 'b'] });
      });

      it(`should match with input '/a/b/c'`, () => {
        const result = matcher.match('/a/b/c');

        expect(result?.params).toEqual({ path: ['a', 'b', 'c'] });
      });

      it(`should not match with input '/a/b/'`, () => {
        const matcher = new SimpleMatcher('/{path}+');

        const result = matcher.match('/a/b/');

        expect(result).toEqual(null);
      });
    });

    describe('/{path}+/', () => {
      const matcher = new SimpleMatcher('/{path}+/');

      it(`should match with input '/a/b/'`, () => {
        const result = matcher.match('/a/b/');

        expect(result?.params).toEqual({ path: ['a', 'b'] });
      });

      it(`should not match with input '/a/b'`, () => {
        const result = matcher.match('/a/b');

        expect(result).toEqual(null);
      });
    });

    describe('/{filename}.{ext}', () => {
      const matcher = new SimpleMatcher('/{filename}.{ext}');

      it(`should match with input '/main.css'`, () => {
        const result = matcher.match('/main.css');

        expect(result?.params).toEqual({ filename: 'main', ext: 'css' });
      });

      it(`should match with input '/main.abc.css'`, () => {
        const result = matcher.match('/main.abc.css');

        expect(result?.params).toEqual({ filename: 'main.abc', ext: 'css' });
      });

      it(`should not match with input '/.css'`, () => {
        const result = matcher.match('/.css');

        expect(result).toEqual(null);
      });

      it(`should not match with input '/main.'`, () => {
        const result = matcher.match('/main.');

        expect(result).toEqual(null);
      });
    });

    describe('/{filename:[a-z]+}.{ext:css|js}', () => {
      const matcher = new SimpleMatcher('/{filename:[a-z]+}.{ext:css|js}');

      it(`should match with input '/main.css'`, () => {
        const result = matcher.match('/main.css');

        expect(result?.params).toEqual({ filename: 'main', ext: 'css' });
      });

      it(`should match with input '/main.css'`, () => {
        const result = matcher.match('/main.css');

        expect(result?.params).toEqual({ filename: 'main', ext: 'css' });
      });

      it(`should not match with input '/main.ts'`, () => {
        const result = matcher.match('/main.ts');

        expect(result).toEqual(null);
      });

      it(`should not match with input '/main-chunk.css'`, () => {
        const result = matcher.match('/main-chunk.css');

        expect(result).toEqual(null);
      });
    });

    describe('/{year:\\d{4}}-{month:\\d{2}}-{day:\\d{2}}', () => {
      const matcher = new SimpleMatcher('/{year:\\d{4}}-{month:\\d{2}}-{day:\\d{2}}');

      it(`should match with input '/2024-09-13'`, () => {
        const result = matcher.match('/2024-09-13');

        expect(result?.params).toEqual({ year: '2024', month: '09', day: '13' });
      });

      it(`should not match with input '/24-09-13'`, () => {
        const result = matcher.match('/24-09-13');

        expect(result).toEqual(null);
      });
    });

    describe('/*', () => {
      const matcher = new SimpleMatcher('/*');

      it(`should match with input '/about'`, () => {
        const result = matcher.match('/about');

        expect(result?.params).toEqual({ 0: 'about' });
      });

      it(`should match with input '/'`, () => {
        const result = matcher.match('/');

        expect(result?.params).toEqual({ 0: '' });
      });

      it(`should not match with input '/users/123'`, () => {
        const result = matcher.match('/users/123');

        expect(result).toEqual(null);
      });
    });

    describe('/*/*', () => {
      const matcher = new SimpleMatcher('/*/*');

      it(`should not match with input '/about'`, () => {
        const result = matcher.match('/about');

        expect(result).toEqual(null);
      });

      it(`should not match with input '/'`, () => {
        const result = matcher.match('/');

        expect(result).toEqual(null);
      });

      it(`should match with input '/users/123'`, () => {
        const result = matcher.match('/users/123');

        expect(result?.params).toEqual({ 0: 'users', 1: '123' });
      });
    });

    describe('/*?', () => {
      const matcher = new SimpleMatcher('/*?');

      it(`should match with input '/'`, () => {
        const result = matcher.match('/');

        expect(result?.params).toEqual({ 0: '' });
      });

      it(`should match with input '/about'`, () => {
        const result = matcher.match('/about');

        expect(result?.params).toEqual({ 0: 'about' });
      });

      it(`should not match with input '/users/123'`, () => {
        const result = matcher.match('/users/123');

        expect(result).toEqual(null);
      });
    });

    describe('/**', () => {
      const matcher = new SimpleMatcher('/**');

      it(`should match with input '/'`, () => {
        const result = matcher.match('/');

        expect(result?.params).toEqual({ 0: [] });
      });

      it(`should match with input '/about'`, () => {
        const result = matcher.match('/about');

        expect(result?.params).toEqual({ 0: ['about'] });
      });

      it(`should match with input '/about/'`, () => {
        const result = matcher.match('/about/');

        expect(result?.params).toEqual({ 0: ['about', ''] });
      });

      it(`should match with input '/users/123'`, () => {
        const result = matcher.match('/users/123');

        expect(result?.params).toEqual({ 0: ['users', '123'] });
      });
    });

    describe('/*+', () => {
      const matcher = new SimpleMatcher('/*+');

      it(`should match with input '/'`, () => {
        const result = matcher.match('/');

        expect(result?.params).toEqual({ 0: [''] });
      });

      it(`should match with input '/about'`, () => {
        const result = matcher.match('/about');

        expect(result?.params).toEqual({ 0: ['about'] });
      });

      it(`should match with input '/about/'`, () => {
        const result = matcher.match('/about/');

        expect(result?.params).toEqual({ 0: ['about', ''] });
      });

      it(`should match with input '/users/123'`, () => {
        const result = matcher.match('/users/123');

        expect(result?.params).toEqual({ 0: ['users', '123'] });
      });
    });

    describe('/**/**', () => {
      const matcher = new SimpleMatcher('/**/**');

      it(`should match with input '/'`, () => {
        const result = matcher.match('/');

        expect(result?.params).toEqual({ 0: [], 1: [] });
      });

      it(`should match with input '/about'`, () => {
        const result = matcher.match('/about');

        expect(result?.params).toEqual({ 0: ['about'], 1: [] });
      });

      it(`should match with input '/users/123'`, () => {
        const result = matcher.match('/users/123');

        expect(result?.params).toEqual({ 0: ['users'], 1: ['123'] });
      });

      it(`should match with input '/users/12/comments/34'`, () => {
        const result = matcher.match('/users/12/comments/34');

        expect(result?.params).toEqual({ 0: ['users', '12', 'comments'], 1: ['34'] });
      });
    });

    describe('/blog-{id}?', () => {
      const matcher = new SimpleMatcher('/blog-{id}?');

      it(`should match with input '/'`, () => {
        const result = matcher.match('/');

        expect(result?.params).toEqual({ id: '' });
      });

      it(`should match with input '/blog-123'`, () => {
        const result = matcher.match('/blog-123');

        expect(result?.params).toEqual({ id: '123' });
      });
    });

    describe('/page/blog-{id}?', () => {
      const matcher = new SimpleMatcher('/page/blog-{id}?');

      it(`should match with input '/page'`, () => {
        const result = matcher.match('/page');

        expect(result?.params).toEqual({ id: '' });
      });

      it(`should match with input '/page/'`, () => {
        const result = matcher.match('/page/');

        expect(result).toEqual(null);
      });

      it(`should match with input '/page/blog-123'`, () => {
        const result = matcher.match('/page/blog-123');

        expect(result?.params).toEqual({ id: '123' });
      });
    });

    it('should extract param with same name', () => {
      const matcher = new SimpleMatcher('/users/{id}/comments/{id}');

      const result = matcher.match('/users/12/comments/34');

      expect(result?.params).toEqual({ id: ['12', '34'] });
    });
  });
});
