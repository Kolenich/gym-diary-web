import { type EffectCallback, useLayoutEffect } from 'react';

export const useUnmountEffect = (effect: ReturnType<EffectCallback>): void => {
  useLayoutEffect(() => effect, []);
};
