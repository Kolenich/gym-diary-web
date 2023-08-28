export const capitalize = (value: string): string => {
  const [firstChar, ...restChars] = value;

  return `${firstChar.toUpperCase()}${restChars.join('')}`;
};
