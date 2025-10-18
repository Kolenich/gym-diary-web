import { type RegisterOptions } from 'react-hook-form';

import { type TFormValues } from './WorkoutDetail.types';

export const DEFAULT_WORKOUT: Omit<TFormValues, 'date'> = {
  start_time: '',
  duration_hours: 1,
  focus_area: null,
};

export const SAVE = 'Сохранить';
export const BACK = 'Назад';

export const VALIDATE_WORKOUT_DATE: RegisterOptions<TFormValues, 'date'> = {
  required: {
    value: true,
    message: 'Укажите дату тренировки',
  },
};

export const VALIDATE_WORKOUT_START_TIME: RegisterOptions<TFormValues, 'start_time'> = {
  required: {
    value: true,
    message: 'Укажите время тренировки',
  },
};

export const VALIDATE_WORKOUT_DURATION_HOURS: RegisterOptions<TFormValues, 'duration_hours'> = {
  valueAsNumber: true,
  required: {
    value: true,
    message: 'Укажите длительность тренировки',
  },
  max: {
    value: 2,
    message: 'Тренировка не должна превышать 2 часа',
  },
  min: {
    value: 1,
    message: 'Тренировка должна быть минимум 1 час',
  },
};

export const VALIDATE_WORKOUT_FOCUS_AREA: RegisterOptions<TFormValues, 'focus_area'> = {
  setValueAs: value => value || null,
};
