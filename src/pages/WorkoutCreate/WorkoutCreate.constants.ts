import { type IWorkout } from 'api/workouts';

export const DEFAULT_WORKOUT: Omit<IWorkout, 'id' | 'date'> = {
  start_time: '',
  duration_hours: 1,
  focus_area: null,
};

export const CREATE = 'Создать';
export const BACK = 'Назад';
