import { type RegisterOptions } from 'react-hook-form';

import { type IWorkout } from 'api/workouts';

export const getFieldRegisterOptions = <GField extends keyof Omit<IWorkout, 'id'>>(
  field: GField,
): RegisterOptions<Omit<IWorkout, 'id'>, GField> => {
  const fieldRegisterOptions = {
    duration_hours: {
      valueAsNumber: true,
      max: {
        value: 2,
        message: 'Тренировка не должна превышать 2 часа',
      },
    },
    focus_area: {
      setValueAs: value => value || null,
    },
  } as Record<keyof Omit<IWorkout, 'id'>, RegisterOptions<Omit<IWorkout, 'id'>, keyof Omit<IWorkout, 'id'>>>;

  return fieldRegisterOptions[field] as RegisterOptions<Omit<IWorkout, 'id'>, GField>;
};
