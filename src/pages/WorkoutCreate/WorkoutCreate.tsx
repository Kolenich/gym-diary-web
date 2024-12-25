import { type FC } from 'react';

import { useNavigate } from 'react-router-dom';

import { Button, Stack, TextField } from '@mui/material';

import { useForm } from 'react-hook-form';

import { type IWorkout, useCreateWorkout } from 'api/workouts';
import { ERoutePaths } from 'constants/routes';
import {
  VALIDATE_WORKOUT_DATE,
  VALIDATE_WORKOUT_DURATION_HOURS,
  VALIDATE_WORKOUT_FOCUS_AREA,
  VALIDATE_WORKOUT_START_TIME,
} from 'constants/validators';
import { useAppSelector } from 'store/store.hooks';
import { selectWorkoutDay } from 'store/workouts';

import { BACK, CREATE, DEFAULT_WORKOUT } from './WorkoutCreate.constants';

const WorkoutCreate: FC = () => {
  const workoutDate = useAppSelector(selectWorkoutDay);

  const {
    register,
    handleSubmit,
    formState: {
      errors: { duration_hours: durationHoursError, start_time: startTimeError, date: dateError },
    },
  } = useForm<Omit<IWorkout, 'id'>>({ defaultValues: { ...DEFAULT_WORKOUT, date: workoutDate } });

  const [createWorkout, { isLoading: isCreatingWorkout }] = useCreateWorkout();

  const navigate = useNavigate();

  const submitWorkout = (data: Omit<IWorkout, 'id'>): void => {
    createWorkout(data).unwrap().then(goToSchedule);
  };

  const goToSchedule = (): void => {
    navigate(`/${ERoutePaths.WorkoutsSchedule}`);
  };

  console.log(startTimeError);

  return (
    <form onSubmit={handleSubmit(submitWorkout)}>
      <Stack direction='row' spacing={2} alignItems='flex-start'>
        <TextField
          {...register('date', VALIDATE_WORKOUT_DATE)}
          type='date'
          label='Дата тренировки'
          slotProps={{ inputLabel: { shrink: true } }}
          error={!!dateError}
          helperText={dateError?.message}
        />
        <TextField
          {...register('start_time', VALIDATE_WORKOUT_START_TIME)}
          type='time'
          label='Начало'
          slotProps={{ inputLabel: { shrink: true } }}
          error={!!startTimeError}
          helperText={startTimeError?.message}
        />
        <TextField
          type='number'
          {...register('duration_hours', VALIDATE_WORKOUT_DURATION_HOURS)}
          label='Длительность'
          error={!!durationHoursError}
          helperText={durationHoursError?.message}
        />
        <TextField {...register('focus_area', VALIDATE_WORKOUT_FOCUS_AREA)} label='Группа мышц' />
        <Button variant='contained' disabled={isCreatingWorkout} type='submit'>
          {CREATE}
        </Button>
        <Button variant='outlined' disabled={isCreatingWorkout} onClick={goToSchedule}>
          {BACK}
        </Button>
      </Stack>
    </form>
  );
};

export default WorkoutCreate;
