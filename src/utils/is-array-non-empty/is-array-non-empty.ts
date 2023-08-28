import type { TNonEmptyArray } from './is-array-non-empty.types';

export const isArrayNonEmpty = <GArrayElement>(arr: GArrayElement[]): arr is TNonEmptyArray<GArrayElement> =>
  arr.length > 0;
