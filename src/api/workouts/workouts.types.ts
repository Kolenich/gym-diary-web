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

export type TStringFilterLookups = '__icontains' | '';
export type TOrderingPrefixes = '-' | '';

export type TGetWorkoutsFilteringParams = {
  [Key in keyof Pick<IWorkout, 'focus_area' | 'date'> as `${Key}${TStringFilterLookups}`]?: string;
};
export type TGetWorkoutsOrderingParams = {
  ordering?: `${TOrderingPrefixes}${keyof Pick<IWorkout, 'date' | 'start_time'>}`;
};

export type TGetWorkoutsParams = TGetWorkoutsFilteringParams & TGetWorkoutsOrderingParams;

export type TGetExercisesParams = Pick<IExercise, 'workout_id'>;

export type TGetSetsParams = Pick<ISet, 'exercise_id'>;
