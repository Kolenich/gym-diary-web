import type { Key } from 'react';

export interface IWorkout {
  readonly id?: number;
  date: string | null;
  start: string | null;
  end: string | null;
  exercises: IExercise[];
}

export interface IExercise {
  id: Key;
  name: string;
  sets: ISet[];
}

export interface ISet {
  id: Key;
  weight: number;
  repeats: number;
}

export type TGetWorkoutsParams = {
  [Key in keyof Pick<IWorkout, 'date'> as `${Key}__${'gte' | 'lte'}`]: string;
}
