import { type ChangeEvent, type FC } from 'react';

import { useNavigate } from 'react-router-dom';

import { Button, Grid, TextField, Typography } from '@mui/material';

import { useGetWorkouts } from 'api/workouts';
import { TODAY } from 'constants/date';
import { ERoutePaths } from 'constants/routes';
import { useAppDispatch, useAppSelector } from 'store/store.hooks';
import { selectWorkoutDay, setWorkoutDate } from 'store/workouts';
import { toIsoString } from 'utils/iso-to-datetime-local';

import { CHOOSE_DATE, CREATE_WORKOUT, SCHEDULE_TITLE, WORKOUTS_TITLE } from './WorkoutSchedule.constants';

const WorkoutSchedule: FC = () => {
  const workoutDate = useAppSelector(selectWorkoutDay);

  const dispatch = useAppDispatch();

  const { data: workouts = [] } = useGetWorkouts({ date: workoutDate });

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
            label={CHOOSE_DATE}
            slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: toIsoString(TODAY).split('T')[0] } }}
          />
        </Grid>
      </Grid>
      <Typography variant='body1'>{WORKOUTS_TITLE}</Typography>
      {workouts.map(workout => {
        const { id: workoutId } = workout;

        const goToWorkoutDetail = (): void => {
          navigate(workoutId.toString());
        };

        return (
          <Typography variant='caption' onClick={goToWorkoutDetail} key={workoutId}>
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
