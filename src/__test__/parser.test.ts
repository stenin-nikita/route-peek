import { describe, expect, it } from 'vitest';

import { Parser } from '../parser';
import { ElementType, SegmentModifier, SegmentType } from '../types';

describe('Parser', () => {
  it('cached result', () => {
    const parser = new Parser('/a/b/c');

    expect(parser.parse()).toBe(parser.parse());
  });

  describe('fixed', () => {
    it('empty', () => {
      const parser = new Parser('');

      const result = parser.parse();

      expect(result).toEqual([
        {
          type: SegmentType.FIXED,
          element: { type: ElementType.STRING, value: '' },
          modifier: SegmentModifier.NONE,
        },
      ]);
    });

    it('root', () => {
      const parser = new Parser('/');

      const result = parser.parse();

      expect(result).toEqual([
        {
          type: SegmentType.FIXED,
          element: { type: ElementType.STRING, value: '' },
          modifier: SegmentModifier.NONE,
        },
      ]);
    });

    it('single static', () => {
      const parser = new Parser('/users');

      const result = parser.parse();

      expect(result).toEqual([
        {
          type: SegmentType.FIXED,
          element: { type: ElementType.STRING, value: 'users' },
          modifier: SegmentModifier.NONE,
        },
      ]);
    });

    it('multiple static', () => {
      const parser = new Parser('/path/to/page');

      const result = parser.parse();

      expect(result).toEqual([
        {
          type: SegmentType.FIXED,
          element: { type: ElementType.STRING, value: 'path' },
          modifier: SegmentModifier.NONE,
        },
        {
          type: SegmentType.FIXED,
          element: { type: ElementType.STRING, value: 'to' },
          modifier: SegmentModifier.NONE,
        },
        {
          type: SegmentType.FIXED,
          element: { type: ElementType.STRING, value: 'page' },
          modifier: SegmentModifier.NONE,
        },
      ]);
    });
  });

  describe('dynamic', () => {
    it('single param', () => {
      const parser = new Parser('/{id}');

      const result = parser.parse();

      expect(result).toEqual([
        {
          type: SegmentType.DYNAMIC,
          elements: [{ type: ElementType.PATTERN, name: 'id', pattern: '[^/]+' }],
          modifier: SegmentModifier.NONE,
        },
      ]);
    });

    it('multiple params', () => {
      const parser = new Parser('/{page}/{id}');

      const result = parser.parse();

      expect(result).toEqual([
        {
          type: SegmentType.DYNAMIC,
          elements: [{ type: ElementType.PATTERN, name: 'page', pattern: '[^/]+' }],
          modifier: SegmentModifier.NONE,
        },
        {
          type: SegmentType.DYNAMIC,
          elements: [{ type: ElementType.PATTERN, name: 'id', pattern: '[^/]+' }],
          modifier: SegmentModifier.NONE,
        },
      ]);
    });

    it('param with custom regexp', () => {
      const parser = new Parser('/{id:\\d+}');

      const result = parser.parse();

      expect(result).toEqual([
        {
          type: SegmentType.DYNAMIC,
          elements: [{ type: ElementType.PATTERN, name: 'id', pattern: '\\d+' }],
          modifier: SegmentModifier.NONE,
        },
      ]);
    });

    it('param with static values', () => {
      const parser = new Parser('/posts/{year:\\d{4}}-{month:\\d{2}}-{day:\\d{2}}.html');

      const result = parser.parse();

      expect(result).toEqual([
        {
          type: SegmentType.FIXED,
          element: { type: ElementType.STRING, value: 'posts' },
          modifier: SegmentModifier.NONE,
        },
        {
          type: SegmentType.DYNAMIC,
          elements: [
            { type: ElementType.PATTERN, name: 'year', pattern: '\\d{4}' },
            { type: ElementType.STRING, value: '-' },
            { type: ElementType.PATTERN, name: 'month', pattern: '\\d{2}' },
            { type: ElementType.STRING, value: '-' },
            { type: ElementType.PATTERN, name: 'day', pattern: '\\d{2}' },
            { type: ElementType.STRING, value: '.html' },
          ],
          modifier: SegmentModifier.NONE,
        },
      ]);
    });

    it('param with non-capturing group', () => {
      const parser = new Parser('/{id:(?:\\d+)}');

      const result = parser.parse();

      expect(result).toEqual([
        {
          type: SegmentType.DYNAMIC,
          elements: [{ type: ElementType.PATTERN, name: 'id', pattern: '(?:\\d+)' }],
          modifier: SegmentModifier.NONE,
        },
      ]);
    });
  });

  describe('wildcard', () => {
    it('single wildcard', () => {
      const parser = new Parser('/*');

      const result = parser.parse();

      expect(result).toEqual([
        {
          type: SegmentType.DYNAMIC,
          elements: [{ type: ElementType.PATTERN, name: '0', pattern: '[^/]+' }],
          modifier: SegmentModifier.NONE,
        },
      ]);
    });

    it('multiple wildcards', () => {
      const parser = new Parser('/*/*');

      const result = parser.parse();

      expect(result).toEqual([
        {
          type: SegmentType.DYNAMIC,
          elements: [{ type: ElementType.PATTERN, name: '0', pattern: '[^/]+' }],
          modifier: SegmentModifier.NONE,
        },
        {
          type: SegmentType.DYNAMIC,
          elements: [{ type: ElementType.PATTERN, name: '1', pattern: '[^/]+' }],
          modifier: SegmentModifier.NONE,
        },
      ]);
    });

    it('wildcard with optional modifier', () => {
      const parser = new Parser('/*?');

      const result = parser.parse();

      expect(result).toEqual([
        {
          type: SegmentType.DYNAMIC,
          elements: [{ type: ElementType.PATTERN, name: '0', pattern: '[^/]+' }],
          modifier: SegmentModifier.OPTIONAL,
        },
      ]);
    });

    it('wildcard with zero or more modifier', () => {
      const parser = new Parser('/**');

      const result = parser.parse();

      expect(result).toEqual([
        {
          type: SegmentType.DYNAMIC,
          elements: [{ type: ElementType.PATTERN, name: '0', pattern: '[^/]+' }],
          modifier: SegmentModifier.ZERO_OR_MORE,
        },
      ]);
    });

    it('wildcard with one or more modifier', () => {
      const parser = new Parser('/*+');

      const result = parser.parse();

      expect(result).toEqual([
        {
          type: SegmentType.DYNAMIC,
          elements: [{ type: ElementType.PATTERN, name: '0', pattern: '[^/]+' }],
          modifier: SegmentModifier.ONE_OR_MORE,
        },
      ]);
    });
  });

  describe('errors', () => {
    it('empty name', () => {
      const parser = new Parser('/{}');

      expect(() => {
        parser.parse();
      }).toThrowError('Empty name');
    });

    it('empty pattern', () => {
      const parser = new Parser('/{id:}');

      expect(() => {
        parser.parse();
      }).toThrowError('Empty pattern');
    });

    it('empty name with colon', () => {
      const parser = new Parser('/{:}');

      expect(() => {
        parser.parse();
      }).toThrowError('Empty name');
    });

    it('invalid segment', () => {
      const parser = new Parser('/?');

      expect(() => {
        parser.parse();
      }).toThrowError('Expected END or DELIMETER, got QUESTION');
    });

    it('complex repeating segment', () => {
      const parser = new Parser('/some-{id}+');

      expect(() => {
        parser.parse();
      }).toThrowError('A repeating segment must contain only one parameter');
    });

    it('fixed repeatable segment', () => {
      const parser = new Parser('/foo+');

      expect(() => {
        parser.parse();
      }).toThrowError('Allow only optional modifier for fixed segment');
    });

    it('capturing groups', () => {
      const parser = new Parser('/{id:(\\d+)}');

      expect(() => {
        parser.parse();
      }).toThrowError('Capturing groups are not allowed at 5');
    });

    it('unbalanced pattern', () => {
      const parser = new Parser('/{id:\\d{1}');

      expect(() => {
        parser.parse();
      }).toThrowError('Unbalanced pattern');
    });

    it('invalid start pattern', () => {
      const parser = new Parser('/{id:?}');

      expect(() => {
        parser.parse();
      }).toThrowError('Pattern cannot start with "?" at index 5');
    });

    it('invalid char after name', () => {
      const parser = new Parser('/{id+}');

      expect(() => {
        parser.parse();
      }).toThrowError(`Invalid char at index 4. Expected ':' or '}', got '+'`);
    });
  });
});