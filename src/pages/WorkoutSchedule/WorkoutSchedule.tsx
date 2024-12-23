import { type ChangeEvent, type FC } from 'react';

import { useNavigate } from 'react-router-dom';

import { Grid2 as Grid, TextField, Typography } from '@mui/material';

import { useGetWorkouts } from 'api/workouts';
import { useAppDispatch, useAppSelector } from 'store/store.hooks';
import { selectWorkoutDay, setWorkoutDate } from 'store/workouts';

const WorkoutSchedule: FC = () => {
  const workoutDate = useAppSelector(selectWorkoutDay);

  const dispatch = useAppDispatch();

  const { data: workouts = [] } = useGetWorkouts({ date: workoutDate }, { skip: !workoutDate });

  const navigate = useNavigate();

  const updateWorkoutDate = (event: ChangeEvent<HTMLInputElement>): void => {
    dispatch(setWorkoutDate(event.target.value));
  };

  return (
    <>
      <Grid container spacing={2} alignItems='center'>
        <Grid size={12}>
          <Typography variant='h1' color='primary' textAlign='center'>
            План тренировок
          </Typography>
        </Grid>
        <Grid size='auto'>
          <TextField
            value={workoutDate}
            onChange={updateWorkoutDate}
            type='date'
            label='Выбрать дату'
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>
      </Grid>
      <Typography variant='body1'>Тренировки</Typography>
      {workouts.map(workout => {
        const goToWorkout = (): void => {
          navigate(`${workout.id}`);
        };

        return (
          <Typography variant='caption' onClick={goToWorkout} key={workout.id}>
            <pre>{JSON.stringify(workout, null, 2)}</pre>
          </Typography>
        );
      })}
    </>
  );
};

export default WorkoutSchedule;
