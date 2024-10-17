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

export interface StringElement {
  type: ElementType.STRING;
  value: string;
}

export interface PatternElement {
  type: ElementType.PATTERN;
  name: string;
  pattern: string;
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
