import { DECLENSION_DICTIONARY } from './get-declension-text.constants';

export const getDeclensionText = (number: number, noun: keyof typeof DECLENSION_DICTIONARY = 'months'): string => {
  const cases = [2, 0, 1, 1, 1, 2];
  const index = number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5];
  return DECLENSION_DICTIONARY[noun][index as number] as string;
};
