import { type FC } from 'react';

import { Form, Navigate, useNavigate, useParams } from 'react-router-dom';

import { Button, TextField, Grid2 as Grid } from '@mui/material';

import { useForm } from 'react-hook-form';

import { type IWorkout, useGetWorkout, useUpdateWorkout } from 'api/workouts';
import { ERoutePaths } from 'constants/routes';

const WorkoutModal: FC = () => {
  const { workoutId = '' } = useParams();

  const navigate = useNavigate();

  const { data: workout } = useGetWorkout(+workoutId, {
    skip: isNaN(+workoutId),
  });

  const [updateWorkout, { isLoading }] = useUpdateWorkout();

  const { register, handleSubmit } = useForm<Omit<IWorkout, 'id'>>({
    values: workout,
  });

  if (isNaN(+workoutId)) {
    return <Navigate to='..' />;
  }

  if (!workout) {
    return null;
  }

  const submitForm = (data: Omit<IWorkout, 'id'>): void => {
    updateWorkout({ id: +workoutId, ...data });
  };

  const goToSchedule = (): void => {
    navigate(`/${ERoutePaths.WorkoutsSchedule}`);
  };

  return (
    <Form onSubmit={handleSubmit(submitForm)}>
      <Grid container spacing={2}>
        <TextField type='date' {...register('date')} label='Дата тренировки' />
        <Grid size='auto'>
          <TextField fullWidth type='time' {...register('start_time')} label='Начало' />
        </Grid>
        <Grid size='auto'>
          <TextField fullWidth type='number' {...register('duration_hours')} label='Длительность' />
        </Grid>
        <Button variant='contained' disabled={isLoading} type='submit'>
          Сохранить
        </Button>
        <Button variant='outlined' disabled={isLoading} onClick={goToSchedule}>
          Назад
        </Button>
      </Grid>
    </Form>
  );
};

export default WorkoutModal;
