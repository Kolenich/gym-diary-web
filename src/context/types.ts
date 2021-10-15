import { Moment } from 'moment';

export interface ContextState {
  workouts: Workout[];
  workoutDay: Moment | null;
  selectedWorkout: Workout | null;
}

export interface ContextActions {
  loadWorkouts: () => void;
  setCurrentDay: (day: Moment | null) => void;
  addWorkout: (workout: Workout) => void;
  setCurrentWorkout: (workout: Workout | null) => void;
  updateWorkout: (workout: Workout) => void;
}

export type ContextValue = ContextState & ContextActions;

export interface Workout {
  readonly id?: number;
  date: string;
  start: string | null;
  end: string | null;
  exercises: Exercise[];
}

export interface Exercise {
  readonly id?: number;
  name: string;
  sets: Set[];
}

export interface Set {
  readonly id?: number;
  weight: number;
  repeats: number;
}
