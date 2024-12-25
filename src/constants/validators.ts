import { type RegisterOptions } from 'react-hook-form';

import { type IWorkout } from 'api/workouts';

export const VALIDATE_WORKOUT_DATE: RegisterOptions<Omit<IWorkout, 'id'>, 'date'> = {
  required: {
    value: true,
    message: 'Укажите дату тренировки',
  },
};

export const VALIDATE_WORKOUT_START_TIME: RegisterOptions<Omit<IWorkout, 'id'>, 'start_time'> = {
  required: {
    value: true,
    message: 'Укажите время тренировки',
  },
};

export const VALIDATE_WORKOUT_DURATION_HOURS: RegisterOptions<Omit<IWorkout, 'id'>, 'duration_hours'> = {
  valueAsNumber: true,
  max: {
    value: 2,
    message: 'Тренировка не должна превышать 2 часа',
  },
  min: {
    value: 1,
    message: 'Тренировка должна быть минимум 1 час',
  },
};

export const VALIDATE_WORKOUT_FOCUS_AREA: RegisterOptions<Omit<IWorkout, 'id'>, 'focus_area'> = {
  setValueAs: value => value || null,
};
