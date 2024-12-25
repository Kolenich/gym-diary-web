import { type ChangeEvent, type FC } from 'react';

import { useNavigate } from 'react-router-dom';

import { Button, Grid2 as Grid, TextField, Typography } from '@mui/material';

import { useGetWorkouts } from 'api/workouts';
import { ERoutePaths } from 'constants/routes';
import { useAppDispatch, useAppSelector } from 'store/store.hooks';
import { selectWorkoutDay, setWorkoutDate } from 'store/workouts';

import { CREATE_WORKOUT, SCHEDULE_TITLE, WORKOUTS_TITLE } from './WorkoutSchedule.constants';

const WorkoutSchedule: FC = () => {
  const workoutDate = useAppSelector(selectWorkoutDay);

  const dispatch = useAppDispatch();

  const { data: workouts = [] } = useGetWorkouts({ date: workoutDate }, { skip: !workoutDate });

  const navigate = useNavigate();

  const updateWorkoutDate = (event: ChangeEvent<HTMLInputElement>): void => {
    dispatch(setWorkoutDate(event.target.value));
  };

  const goToWorkoutCreate = (): void => {
    navigate(ERoutePaths.WorkoutCreate);
  };

  return (
    <>
      <Grid container spacing={2} alignItems='center'>
        <Grid size={12}>
          <Typography variant='h1' fontWeight='bold' color='primary' textAlign='center'>
            {SCHEDULE_TITLE}
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
      <Typography variant='body1'>{WORKOUTS_TITLE}</Typography>
      {workouts.map(workout => {
        const goToWorkout = (): void => {
          navigate(workout.id.toString());
        };

        return (
          <Typography variant='caption' onClick={goToWorkout} key={workout.id}>
            <pre>{JSON.stringify(workout, null, 2)}</pre>
          </Typography>
        );
      })}
      <Button variant='contained' color='primary' onClick={goToWorkoutCreate}>
        {CREATE_WORKOUT}
      </Button>
    </>
  );
};

export default WorkoutSchedule;
