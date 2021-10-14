import { Moment } from 'moment';

export interface ContextState {
  workouts: Workout[];
  workoutDay: Moment | null;
}

export interface ContextActions {
  loadWorkouts: () => void;
  editWorkout: (day: Moment | null) => void;
  addWorkout: (workout: Workout) => void;
}

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
