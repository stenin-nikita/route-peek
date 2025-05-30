import { describe, expect, it } from 'vitest';

import { type RouteMatcherOptions } from '../route-matcher';
import { RouteMatcherBuilder } from '../route-matcher-builder';

function createMatcher(
  routes: string | string[],
  options: RouteMatcherOptions & { trailing?: boolean } = {},
) {
  const builder = new RouteMatcherBuilder();

  if (options.ignoreCase) {
    builder.setIgnoreCase(options.ignoreCase);
  }

  if (options.trailing) {
    builder.setTrailing(options.trailing);
  }

  if (typeof routes === 'string') {
    builder.add(routes);
  } else {
    for (const route of routes) {
      builder.add(route);
    }
  }

  return builder.build();
}

describe('RouteMatcherBuilder', () => {
  describe('match', () => {
    describe('empty', () => {
      const matcher = createMatcher('');

      it(`should match with input ''`, () => {
        const result = matcher.match('');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', {});
      });

      it(`should match with input '/'`, () => {
        const result = matcher.match('/');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', {});
      });
    });

    describe('/', () => {
      const matcher = createMatcher('/');

      it(`should match with input ''`, () => {
        const result = matcher.match('');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', {});
      });

      it(`should match with input '/'`, () => {
        const result = matcher.match('/');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', {});
      });

      it(`should not match with input '/home'`, () => {
        const result = matcher.match('/home');

        expect(result).toHaveLength(0);
      });
    });

    describe('/home', () => {
      const matcher = createMatcher('/home');

      it(`should not match with input '/'`, () => {
        const result = matcher.match('/');

        expect(result).toHaveLength(0);
      });

      it(`should match with input '/home'`, () => {
        const result = matcher.match('/home');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', {});
      });

      it(`should not match with input '/index'`, () => {
        const result = matcher.match('/index');

        expect(result).toHaveLength(0);
      });

      it(`should not match with input '/home/page'`, () => {
        const result = matcher.match('/home/page');

        expect(result).toHaveLength(0);
      });

      it(`should not match with input '/home/'`, () => {
        const result = matcher.match('/home/');

        expect(result).toHaveLength(0);
      });

      it(`should not match with input '/Home'`, () => {
        const result = matcher.match('/Home');

        expect(result).toHaveLength(0);
      });

      it(`should match with ignoreCase and input '/Home'`, () => {
        const matcher = createMatcher('/home', { ignoreCase: true });

        const result = matcher.match('/Home');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', {});
      });
    });

    describe('/home/', () => {
      const matcher = createMatcher('/home/');

      it(`should not match with input '/home'`, () => {
        const result = matcher.match('/home');

        expect(result).toHaveLength(0);
      });

      it(`should match with input '/home/'`, () => {
        const result = matcher.match('/home/');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', {});
      });
    });

    describe('/home?', () => {
      const matcher = createMatcher('/home?');

      it(`should match with input '/'`, () => {
        const result = matcher.match('/');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', {});
      });

      it(`should match with input '/home'`, () => {
        const result = matcher.match('/home');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', {});
      });
    });

    describe('/{param}', () => {
      const matcher = createMatcher('/{param}');

      it(`should not match with input '/'`, () => {
        const result = matcher.match('/');

        expect(result).toHaveLength(0);
      });

      it(`should match with input '/about'`, () => {
        const result = matcher.match('/about');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', { param: 'about' });
      });

      it(`should not match with input '/about/'`, () => {
        const result = matcher.match('/about/');

        expect(result).toHaveLength(0);
      });
    });

    describe('/{param}?', () => {
      const matcher = createMatcher('/{param}?');

      it(`should match with input ''`, () => {
        const result = matcher.match('');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', {});
      });

      it(`should match with input '/'`, () => {
        const result = matcher.match('/');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', {});
      });

      it(`should match with input '/users'`, () => {
        const result = matcher.match('/users');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', { param: 'users' });
      });

      it(`should not match with input '/users/123'`, () => {
        const result = matcher.match('/users/123');

        expect(result).toHaveLength(0);
      });
    });

    describe('/users/{id}?', () => {
      const matcher = createMatcher('/users/{id}?');

      it(`should not match with input '/users/123/'`, () => {
        const result = matcher.match('/users/123/');

        expect(result).toHaveLength(0);
      });

      it(`should match with input '/users/123'`, () => {
        const result = matcher.match('/users/123');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', { id: '123' });
      });

      it(`should not match with input '/users//'`, () => {
        const result = matcher.match('/users//');

        expect(result).toHaveLength(0);
      });

      it(`should not match with input '/users/'`, () => {
        const result = matcher.match('/users/');

        expect(result).toHaveLength(0);
      });

      it(`should match with input '/users'`, () => {
        const result = matcher.match('/users');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', {});
      });
    });

    describe('/users/{id}?/', () => {
      const matcher = createMatcher('/users/{id}?/');

      it(`should match with input '/users/123/'`, () => {
        const result = matcher.match('/users/123/');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', { id: '123' });
      });

      it(`should not match with input '/users/123'`, () => {
        const result = matcher.match('/users/123');

        expect(result).toHaveLength(0);
      });

      it(`should not match with input '/users//'`, () => {
        const result = matcher.match('/users//');

        expect(result).toHaveLength(0);
      });

      it(`should match with input '/users/'`, () => {
        const result = matcher.match('/users/');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', {});
      });

      it(`should not match with input '/users'`, () => {
        const result = matcher.match('/users');

        expect(result).toHaveLength(0);
      });
    });

    describe('/{locale}?/users', () => {
      const matcher = createMatcher('/{locale}?/users');

      it(`should match with input '/users'`, () => {
        const result = matcher.match('/users');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', {});
      });

      it(`should match with input '/en/users'`, () => {
        const result = matcher.match('/en/users');

        expect(result[0]).toHaveProperty('params', { locale: 'en' });
      });
    });

    describe('/file/{path}*', () => {
      const matcher = createMatcher('/file/{path}*');

      it(`should match with input '/file'`, () => {
        const result = matcher.match('/file');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', { path: [] });
      });

      it(`should not match with input '/file/'`, () => {
        const result = matcher.match('/file/');

        expect(result).toHaveLength(0);
      });

      it(`should match with input '/file/a'`, () => {
        const result = matcher.match('/file/a');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', { path: ['a'] });
      });

      it(`should not match with input '/file/a/b/'`, () => {
        const result = matcher.match('/file/a/b/');

        expect(result).toHaveLength(0);
      });

      it(`should match with input '/file/a/b/c'`, () => {
        const result = matcher.match('/file/a/b/c');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', { path: ['a', 'b', 'c'] });
      });
    });

    describe('/{path}+', () => {
      const matcher = createMatcher('/{path}+');

      it(`should match with input '/a'`, () => {
        const result = matcher.match('/a');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', { path: ['a'] });
      });

      it(`should match with input '/a/b'`, () => {
        const result = matcher.match('/a/b');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', { path: ['a', 'b'] });
      });

      it(`should match with input '/a/b/c'`, () => {
        const result = matcher.match('/a/b/c');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', { path: ['a', 'b', 'c'] });
      });

      it(`should not match with input '/a/b/'`, () => {
        const matcher = createMatcher('/{path}+');

        const result = matcher.match('/a/b/');

        expect(result).toHaveLength(0);
      });
    });

    describe('/{path}+/', () => {
      const matcher = createMatcher('/{path}+/');

      it(`should match with input '/a/b/'`, () => {
        const result = matcher.match('/a/b/');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', { path: ['a', 'b'] });
      });

      it(`should not match with input '/a/b'`, () => {
        const result = matcher.match('/a/b');

        expect(result).toHaveLength(0);
      });
    });

    describe('/{filename}.{ext}', () => {
      const matcher = createMatcher('/{filename}.{ext}');

      it(`should match with input '/main.css'`, () => {
        const result = matcher.match('/main.css');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', { filename: 'main', ext: 'css' });
      });

      it(`should match with input '/main.abc.css'`, () => {
        const result = matcher.match('/main.abc.css');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', { filename: 'main.abc', ext: 'css' });
      });

      it(`should not match with input '/.css'`, () => {
        const result = matcher.match('/.css');

        expect(result).toHaveLength(0);
      });

      it(`should not match with input '/main.'`, () => {
        const result = matcher.match('/main.');

        expect(result).toHaveLength(0);
      });
    });

    describe('/{filename:[a-z]+}.{ext:css|js}', () => {
      const matcher = createMatcher('/{filename:[a-z]+}.{ext:css|js}');

      it(`should match with input '/main.css'`, () => {
        const result = matcher.match('/main.css');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', { filename: 'main', ext: 'css' });
      });

      it(`should match with input '/main.css'`, () => {
        const result = matcher.match('/main.css');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', { filename: 'main', ext: 'css' });
      });

      it(`should not match with input '/main.ts'`, () => {
        const result = matcher.match('/main.ts');

        expect(result).toHaveLength(0);
      });

      it(`should not match with input '/main-chunk.css'`, () => {
        const result = matcher.match('/main-chunk.css');

        expect(result).toHaveLength(0);
      });
    });

    describe('/{year:\\d{4}}-{month:\\d{2}}-{day:\\d{2}}', () => {
      const matcher = createMatcher('/{year:\\d{4}}-{month:\\d{2}}-{day:\\d{2}}');

      it(`should match with input '/2024-09-13'`, () => {
        const result = matcher.match('/2024-09-13');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', { year: '2024', month: '09', day: '13' });
      });

      it(`should not match with input '/24-09-13'`, () => {
        const result = matcher.match('/24-09-13');

        expect(result).toHaveLength(0);
      });
    });

    describe('/*', () => {
      const matcher = createMatcher('/*');

      it(`should match with input '/about'`, () => {
        const result = matcher.match('/about');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', { 0: 'about' });
      });

      it(`should match with input '/'`, () => {
        const result = matcher.match('/');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', { 0: '' });
      });

      it(`should not match with input '/users/123'`, () => {
        const result = matcher.match('/users/123');

        expect(result).toHaveLength(0);
      });
    });

    describe('/*/*', () => {
      const matcher = createMatcher('/*/*');

      it(`should not match with input '/about'`, () => {
        const result = matcher.match('/about');

        expect(result).toHaveLength(0);
      });

      it(`should not match with input '/'`, () => {
        const result = matcher.match('/');

        expect(result).toHaveLength(0);
      });

      it(`should match with input '/users/123'`, () => {
        const result = matcher.match('/users/123');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', { 0: 'users', 1: '123' });
      });
    });

    describe('/*?', () => {
      const matcher = createMatcher('/*?');

      it(`should match with input '/'`, () => {
        const result = matcher.match('/');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', { 0: '' });
      });

      it(`should match with input '/about'`, () => {
        const result = matcher.match('/about');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', { 0: 'about' });
      });

      it(`should not match with input '/users/123'`, () => {
        const result = matcher.match('/users/123');

        expect(result).toHaveLength(0);
      });
    });

    describe('/**', () => {
      const matcher = createMatcher('/**');

      it(`should match with input '/'`, () => {
        const result = matcher.match('/');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', { 0: [''] });
      });

      it(`should match with input '/about'`, () => {
        const result = matcher.match('/about');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', { 0: ['about'] });
      });

      it(`should match with input '/about/'`, () => {
        const result = matcher.match('/about/');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', { 0: ['about', ''] });
      });

      it(`should match with input '/users/123'`, () => {
        const result = matcher.match('/users/123');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', { 0: ['users', '123'] });
      });
    });

    describe('/*+', () => {
      const matcher = createMatcher('/*+');

      it(`should match with input '/'`, () => {
        const result = matcher.match('/');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', { 0: [''] });
      });

      it(`should match with input '/about'`, () => {
        const result = matcher.match('/about');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', { 0: ['about'] });
      });

      it(`should match with input '/about/'`, () => {
        const result = matcher.match('/about/');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', { 0: ['about', ''] });
      });

      it(`should match with input '/users/123'`, () => {
        const result = matcher.match('/users/123');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', { 0: ['users', '123'] });
      });
    });

    describe('/**/**', () => {
      const matcher = createMatcher('/**/**');

      it(`should match with input '/'`, () => {
        const result = matcher.match('/');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', { 0: [''], 1: [] });
      });

      it(`should match with input '/about'`, () => {
        const result = matcher.match('/about');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', { 0: ['about'], 1: [] });
      });

      it(`should match with input '/users/123'`, () => {
        const result = matcher.match('/users/123');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', { 0: ['users'], 1: ['123'] });
      });

      it(`should match with input '/users/12/comments/34'`, () => {
        const result = matcher.match('/users/12/comments/34');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', { 0: ['users', '12', 'comments'], 1: ['34'] });
      });
    });

    describe('/blog-{id}?', () => {
      const matcher = createMatcher('/blog-{id}?');

      it(`should match with input '/'`, () => {
        const result = matcher.match('/');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', {});
      });

      it(`should match with input '/blog-123'`, () => {
        const result = matcher.match('/blog-123');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', { id: '123' });
      });
    });

    describe('/page/blog-{id}?', () => {
      const matcher = createMatcher('/page/blog-{id}?');

      it(`should match with input '/page'`, () => {
        const result = matcher.match('/page');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', {});
      });

      it(`should match with input '/page/'`, () => {
        const result = matcher.match('/page/');

        expect(result).toHaveLength(0);
      });

      it(`should match with input '/page/blog-123'`, () => {
        const result = matcher.match('/page/blog-123');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', { id: '123' });
      });
    });

    it('should extract param with same name', () => {
      const matcher = createMatcher('/users/{id}/comments/{id}');

      const result = matcher.match('/users/12/comments/34');

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('params', { id: ['12', '34'] });
    });

    describe('/entities/{entity}/{locale}?/{version}?', () => {
      const matcher = createMatcher('/entities/{entity}/{locale}?/{version}?');

      it(`should match with input '/entities/user'`, () => {
        const result = matcher.match('/entities/user');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', { entity: 'user' });
      });

      it(`should match with input '/entities/user/en'`, () => {
        const result = matcher.match('/entities/user/en');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', { entity: 'user', locale: 'en' });
      });

      it(`should match with input '/entities/user/en/123'`, () => {
        const result = matcher.match('/entities/user/en/123');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', {
          entity: 'user',
          locale: 'en',
          version: '123',
        });
      });

      it(`should match with input '/entities/user/123'`, () => {
        const result = matcher.match('/entities/user/123');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', { entity: 'user', locale: '123' });
      });
    });

    describe('/entities/{entity}/{locale:ru|en}?/{version}?', () => {
      const matcher = createMatcher('/entities/{entity}/{locale:ru|en}?/{version}?');

      it(`should match with input '/entities/user'`, () => {
        const result = matcher.match('/entities/user');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', { entity: 'user' });
      });

      it(`should match with input '/entities/user/en'`, () => {
        const result = matcher.match('/entities/user/en');

        expect(result).toHaveLength(2);
        expect(result[0]).toHaveProperty('params', { entity: 'user', version: 'en' });
        expect(result[1]).toHaveProperty('params', { entity: 'user', locale: 'en' });
      });

      it(`should match with input '/entities/user/en/123'`, () => {
        const result = matcher.match('/entities/user/en/123');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', {
          entity: 'user',
          locale: 'en',
          version: '123',
        });
      });

      it(`should match with input '/entities/user/123'`, () => {
        const result = matcher.match('/entities/user/123');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', { entity: 'user', version: '123' });
      });
    });

    describe('/entities/{entity}/{locale:ru|en}?/{version:\\d+}?', () => {
      const matcher = createMatcher('/entities/{entity}/{locale:ru|en}?/{version:\\d+}?');

      it(`should match with input '/entities/user'`, () => {
        const result = matcher.match('/entities/user');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', { entity: 'user' });
      });

      it(`should match with input '/entities/user/en'`, () => {
        const result = matcher.match('/entities/user/en');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', { entity: 'user', locale: 'en' });
      });

      it(`should match with input '/entities/user/en/123'`, () => {
        const result = matcher.match('/entities/user/en/123');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', {
          entity: 'user',
          locale: 'en',
          version: '123',
        });
      });

      it(`should match with input '/entities/user/123'`, () => {
        const result = matcher.match('/entities/user/123');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('params', { entity: 'user', version: '123' });
      });
    });

    describe(`['/', '/*?']`, () => {
      const matcher = createMatcher(['/', '/*?']);

      it(`should match with input '/'`, () => {
        const result = matcher.match('/');

        expect(result).toHaveLength(2);
        expect(result[0]).toHaveProperty('params', {});
        expect(result[1]).toHaveProperty('params', { '0': '' });
      });
    });

    describe('/users/?', () => {
      const matcher = createMatcher('/users/?');

      it(`should match with input '/users'`, () => {
        const result = matcher.match('/users');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('route', '/users/?');
      });

      it(`should match with input '/users/'`, () => {
        const result = matcher.match('/users/');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('route', '/users/?');
      });
    });

    describe(`['/users', '/users/', '/users/?']`, () => {
      const matcher = createMatcher(['/users', '/users/', '/users/?']);

      it(`should match with input '/users'`, () => {
        const result = matcher.match('/users');

        expect(result).toHaveLength(2);
        expect(result[0]).toHaveProperty('route', '/users');
        expect(result[1]).toHaveProperty('route', '/users/?');
      });

      it(`should match with input '/users/'`, () => {
        const result = matcher.match('/users/');

        expect(result).toHaveLength(2);
        expect(result[0]).toHaveProperty('route', '/users/');
        expect(result[1]).toHaveProperty('route', '/users/?');
      });
    });

    describe(`/users with trailing`, () => {
      const matcher = createMatcher('/users', { trailing: true });

      it(`should match with input '/users'`, () => {
        const result = matcher.match('/users');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('route', '/users/?');
      });

      it(`should match with input '/users/'`, () => {
        const result = matcher.match('/users/');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('route', '/users/?');
      });
    });

    describe(`['/', '/users', '/users/{id}'] with trailing`, () => {
      const matcher = createMatcher(['/', '/users', '/users/{id}'], { trailing: true });

      it(`should match with input '/'`, () => {
        const result = matcher.match('/');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('route', '/');
      });

      it(`should match with input '/users/'`, () => {
        const result = matcher.match('/users/');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('route', '/users/?');
      });

      it(`should match with input '/users/123/'`, () => {
        const result = matcher.match('/users/123/');

        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('route', '/users/{id}/?');
      });
    });
  });
});
