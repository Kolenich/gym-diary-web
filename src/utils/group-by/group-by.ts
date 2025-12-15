export const groupBy = <GObj extends object, GKey extends keyof GObj>(arr: GObj[], key: GKey): Record<GKey, GObj> =>
  arr.reduce(
    (prevObject, currElement) => ({
      ...prevObject,
      [currElement[key] as string | number | symbol]: currElement,
    }),
    {} as Record<GKey, GObj>,
  );
