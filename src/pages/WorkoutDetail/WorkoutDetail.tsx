import { type FC } from 'react';

import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { Delete } from '@mui/icons-material';
import { Button, TextField, Stack, IconButton } from '@mui/material';

import { useForm } from 'react-hook-form';

import { type IWorkout, useDeleteWorkout, useGetWorkout, useUpdateWorkout } from 'api/workouts';
import { ERoutePaths } from 'constants/routes';

import { getFieldRegisterOptions } from './WorkoutDetail.utils';

const WorkoutModal: FC = () => {
  const { workoutId = '' } = useParams();

  const navigate = useNavigate();

  const { data: workout } = useGetWorkout(+workoutId, {
    skip: isNaN(+workoutId),
  });

  const [updateWorkout, { isLoading: isUpdatingWorkout }] = useUpdateWorkout();
  const [deleteWorkout, { isLoading: isDeletingWorkout }] = useDeleteWorkout();

  const {
    register,
    handleSubmit,
    formState: {
      isDirty,
      dirtyFields,
      errors: { duration_hours: durationHoursError },
    },
  } = useForm<Omit<IWorkout, 'id'>>({
    values: workout,
  });

  if (isNaN(+workoutId)) {
    return <Navigate to='..' />;
  }

  if (!workout) {
    return null;
  }

  const submitForm = (data: Omit<IWorkout, 'id'>): void => {
    const updatedFields = Object.keys(dirtyFields).reduce(
      (prev, field) => {
        const isDirtyField = dirtyFields[field as keyof Omit<IWorkout, 'id'>];

        if (isDirtyField) {
          return { ...prev, [field]: data[field as keyof Omit<IWorkout, 'id'>] };
        }

        return prev;
      },
      {} as Omit<IWorkout, 'id'>,
    );

    updateWorkout({ id: +workoutId, ...updatedFields });
  };

  const submitDelete = (): void => {
    deleteWorkout({ id: +workoutId, date: workout.date }).unwrap().then(goToSchedule);
  };

  const goToSchedule = (): void => {
    navigate(`/${ERoutePaths.WorkoutsSchedule}`);
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <Stack direction='row' spacing={2} alignItems='flex-start'>
        <TextField {...register('date')} type='date' label='Дата тренировки' />
        <TextField {...register('start_time')} type='time' label='Начало' />
        <TextField
          type='number'
          {...register('duration_hours', getFieldRegisterOptions('duration_hours'))}
          label='Длительность'
          error={!!durationHoursError}
          helperText={durationHoursError?.message}
        />
        <TextField {...register('focus_area', getFieldRegisterOptions('focus_area'))} label='Группа мышц' />
        <Button variant='contained' disabled={isUpdatingWorkout || !isDirty} type='submit'>
          Сохранить
        </Button>
        <IconButton onClick={submitDelete}>
          <Delete />
        </IconButton>
        <Button variant='outlined' disabled={isDeletingWorkout} onClick={goToSchedule}>
          Назад
        </Button>
      </Stack>
    </form>
  );
};

export default WorkoutModal;
