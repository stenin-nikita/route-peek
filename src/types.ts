export enum TokenType {
  START,
  END,
  DELIMETER,
  STRING,
  NAME,
  PATTERN,
  ASTERISK,
  QUESTION,
  PLUS,
}

export interface Token {
  type: TokenType;
  value: string;
}

export enum SegmentType {
  FIXED,
  DYNAMIC,
}

export enum SegmentModifier {
  NONE,
  OPTIONAL,
  ZERO_OR_MORE,
  ONE_OR_MORE,
}

export enum ElementType {
  STRING,
  PATTERN,
}

export enum Score {
  FIXED = 80,
  DYNAMIC = 60,
  CUSTOM_REG_EXP = 10,
  OPTIONAL = -8,
  REPEATABLE = -20,
  CASE_SENSITIVE = 4,
  TRAILING_SLASH = 7.3,
}

export interface StringElement {
  type: ElementType.STRING;
  value: string;
}

export interface PatternElement {
  type: ElementType.PATTERN;
  name: string;
  pattern: string;
  index: number;
}

export interface FixedSegment {
  type: SegmentType.FIXED;
  element: StringElement;
  modifier: SegmentModifier;
}

export interface DynamicSegment {
  type: SegmentType.DYNAMIC;
  elements: Array<StringElement | PatternElement>;
  modifier: SegmentModifier;
}

export type Segment = FixedSegment | DynamicSegment;

export interface CapturingGroup {
  name: string;
  index: number;
  isRepeatable: boolean;
}

export interface PathRoot {
  input: string;
  segments: Segment[];
  capturingGroups: CapturingGroup[];
  score: number;
}

export type State = number;

export interface Fragment {
  in: State;
  out: State;
}

export type MatchedParams = Record<string, string | string[] | undefined>;
