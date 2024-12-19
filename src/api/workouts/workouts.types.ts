export interface IWorkout {
  id: number;
  start: string;
  end: string;
}

export interface IExercise {
  id: number;
  name: string;
  workout_id: IWorkout['id'];
}

export interface ISet {
  id: number;
  weight: number;
  repeats: number;
  exercise_id: IExercise['id'];
}

export type TFilterLookups = 'gte' | 'lte' | 'lt' | 'gt';

export type TGetWorkoutsParams<GWorkoutKey extends keyof Omit<IWorkout, 'id'>, GFieldLookups extends TFilterLookups> = {
  [Key in GWorkoutKey as `${Key}__${GFieldLookups}`]?: string;
};

export type TGetExercisesParams = Pick<IExercise, 'workout_id'>;

export type TGetSetsParams = Pick<ISet, 'exercise_id'>;
