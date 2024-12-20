export interface IWorkout {
  id: number;
  date: string;
  start_time: string;
  duration_hours: number;
  focus_area: string | null;
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

export type TStringFilterLookups = 'icontains';

export type TGetWorkoutsParams = Pick<IWorkout, 'date'> & {
  [Key in keyof Pick<IWorkout, 'focus_area'> as `${Key}__${TStringFilterLookups}`]?: string;
};

export type TGetExercisesParams = Pick<IExercise, 'workout_id'>;

export type TGetSetsParams = Pick<ISet, 'exercise_id'>;
