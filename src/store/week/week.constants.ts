export enum EWeekTypes {
  Previous = 'previous',
  Current = 'current',
  Next = 'next',
}

export const DEFAULT_WEEKS: Record<EWeekTypes, string[]> = {
  [EWeekTypes.Previous]: [],
  [EWeekTypes.Current]: [],
  [EWeekTypes.Next]: [],
};

