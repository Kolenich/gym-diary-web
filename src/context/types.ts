import { Moment } from 'moment';
import { ReactText } from 'react';

export interface ContextState {
  workouts: Omit<Workout, 'exercises'>[];
  workoutDay: Moment | null;
}

export interface ContextActions {
  loadWorkouts: () => void;
  setCurrentDay: (day: Moment | null) => void;
  deleteWorkout: (id: number) => void;
}

export type ContextValue = ContextState & ContextActions;

export interface Workout {
  readonly id?: number;
  date: string | null;
  start: string | null;
  end: string | null;
  exercises: Exercise[];
}

export interface Exercise {
  id: ReactText;
  name: string;
  sets: Set[];
}

export interface Set {
  id: ReactText;
  weight: number;
  repeats: number;
}

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
