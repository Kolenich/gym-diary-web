import { type IWorkout } from 'api/workouts';

export const DEFAULT_WORKOUT: Omit<IWorkout, 'id' | 'date'> = {
  start_time: '',
  duration_hours: 1,
  focus_area: null,
};

export const SAVE = 'Сохранить';
export const BACK = 'Назад';
export const WORKOUT_CREATE_ID = 'create';
