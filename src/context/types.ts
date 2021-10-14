export interface ContextState {
  workouts: Workout[];
}

export interface Workout {
  readonly id?: number;
  date: Date | string;
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
