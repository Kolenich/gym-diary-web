import { type FC } from 'react';

import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { Delete } from '@mui/icons-material';
import { Button, TextField, Stack, IconButton } from '@mui/material';

import { useForm } from 'react-hook-form';

import { type IWorkout, useDeleteWorkout, useGetWorkout, useUpdateWorkout } from 'api/workouts';
import { ERoutePaths } from 'constants/routes';
import { VALIDATE_WORKOUT_DURATION_HOURS, VALIDATE_WORKOUT_FOCUS_AREA } from 'constants/validators';

import { BACK, SAVE } from './WorkoutDetail.constants';

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
      <Stack spacing={2}>
        <Stack direction='row' spacing={2} alignItems='flex-start'>
          <TextField
            {...register('date')}
            type='date'
            label='Дата тренировки'
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            {...register('start_time')}
            type='time'
            label='Начало'
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            type='number'
            {...register('duration_hours', VALIDATE_WORKOUT_DURATION_HOURS)}
            label='Длительность'
            error={!!durationHoursError}
            helperText={durationHoursError?.message}
          />
          <TextField {...register('focus_area', VALIDATE_WORKOUT_FOCUS_AREA)} label='Группа мышц' />
        </Stack>
        <Stack direction='row' spacing={2}>
          <Button variant='contained' disabled={isUpdatingWorkout || !isDirty} type='submit'>
            {SAVE}
          </Button>
          <Button variant='outlined' disabled={isDeletingWorkout} onClick={goToSchedule}>
            {BACK}
          </Button>
          <IconButton color='error' onClick={submitDelete}>
            <Delete />
          </IconButton>
        </Stack>
      </Stack>
    </form>
  );
};

export default WorkoutModal;
