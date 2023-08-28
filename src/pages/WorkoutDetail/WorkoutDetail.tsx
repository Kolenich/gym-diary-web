import type { FC } from 'react';
import { useEffect, useState } from 'react';

import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { Cancel, Save, Timeline } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Typography,
} from '@mui/material';
import { StaticTimePicker } from '@mui/x-date-pickers';

import type { Moment } from 'moment';
import moment from 'moment';

import type { IExercise, IWorkout } from 'api/workouts';
import { useCreateWorkout, useGetWorkout, useUpdateWorkout } from 'api/workouts';
import { EExercisesAction, ExerciseList } from 'components/ExerciseList';
import { Loading } from 'components/Loading';
import { DATE_DISPLAY_FORMAT, DJANGO_DATE_FORMAT, DJANGO_TIME_FORMAT } from 'constants/datetime';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { selectWorkoutDay, setWorkoutDay } from 'store/week';

import {
  ADD_WORKOUT,
  CANCEL,
  DEFAULT_WORKOUT,
  EDIT_WORKOUT, INTERVAL,
  SAVE, WORKOUT_END, WORKOUT_START,
} from './WorkoutDetail.constants';

const WorkoutModal: FC = () => {
  const { workoutId = '' } = useParams();
  const navigate = useNavigate();

  const isEditMode = workoutId !== 'add';

  const {
    data: workout = DEFAULT_WORKOUT as IWorkout,
    isLoading: isLoadingWorkout,
  } = useGetWorkout(+workoutId, { skip: !isEditMode });
  const [createWorkout, { isLoading: isCreatingWorkout }] = useCreateWorkout();
  const [updateWorkout, { isLoading: isUpdatingWorkout }] = useUpdateWorkout();

  const [localWorkout, setLocalWorkout] = useState(workout);

  const dispatch = useAppDispatch();

  const workoutDay = useAppSelector(selectWorkoutDay);

  const hasWorkoutDay = !!workoutDay;

  useEffect(() => {
    setLocalWorkout(workout);
  }, [workout]);

  if (!hasWorkoutDay && !isEditMode) {
    return <Navigate to='..' />;
  }

  const workoutDate = (): string => {
    if (hasWorkoutDay) {
      return workoutDay.format(DATE_DISPLAY_FORMAT);
    }

    const hasWorkoutDate = !!localWorkout.date;

    if (hasWorkoutDate) {
      return moment(localWorkout.date, DJANGO_DATE_FORMAT).format(DATE_DISPLAY_FORMAT);
    }

    return '';
  };

  const modalTitle = workoutId === 'add' ? ADD_WORKOUT : EDIT_WORKOUT;

  const closeModal = (): void => {
    dispatch(setWorkoutDay(null));
    navigate('..');
  };

  const save = (): void => {
    if (!isEditMode) {
      if (hasWorkoutDay) {
        createWorkout({
          ...localWorkout,
          date: workoutDay.format(DJANGO_DATE_FORMAT),
        });
      }

    } else {
      updateWorkout(localWorkout);
    }

    closeModal();
  };

  /**
   * Callback for handling TimePicker's input change
   * @param {moment.Moment | null} date - new value
   * @param {keyof IWorkout} field - field of Workout object
   */
  const handlePickerChange = (field: keyof IWorkout) => (date: Moment | null): void => {
    setLocalWorkout((oldLocalWorkout) => ({
      ...oldLocalWorkout,
      [field]: date ? moment(date).format(DJANGO_TIME_FORMAT) : null,
    }));
  };

  /**
   * Callback for handling exercise change in child component
   * @type {(exercise: IExercise, action: EExercisesAction) => void}
   */
  const handleExerciseChange = (exercise: IExercise, action: EExercisesAction): void => {
    const { id: targetExerciseId } = exercise;

    switch (action) {
      case EExercisesAction.Add:
        setLocalWorkout((oldLocalWorkout) => ({
          ...oldLocalWorkout,
          exercises: oldLocalWorkout.exercises.concat(exercise),
        }));
        break;
      case EExercisesAction.Delete:
        setLocalWorkout((oldLocalWorkout) => ({
          ...oldLocalWorkout,
          exercises: oldLocalWorkout.exercises.filter(({ id }) => id !== targetExerciseId),
        }));
        break;
      case EExercisesAction.Update:
        setLocalWorkout((oldLocalWorkout) => ({
          ...oldLocalWorkout,
          exercises: oldLocalWorkout.exercises.map((oldExercise) => {
            const { id } = oldExercise;

            const isTargetExercise = id === targetExerciseId;

            if (isTargetExercise) {
              return { ...oldExercise, ...exercise };
            }

            return oldExercise;
          }),
        }));
        break;
      default:
        break;
    }
  };


  const { start, end, exercises } = localWorkout;

  const isLoading = isLoadingWorkout || isCreatingWorkout || isUpdatingWorkout;

  return (
    <Dialog
      open
      onClose={closeModal}
      fullWidth
      maxWidth='md'
    >
      <Typography
        component='div'
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: {
            xl: 'row',
            lg: 'row',
            md: 'row',
            sm: 'row',
            xs: 'column',
          },
        }}
      >
        <Typography
          variant='h5'
          color='text.secondary'
          sx={{ px: 3, py: 2, fontWeight: 'bold', textAlign: 'center' }}
        >
          {modalTitle}
        </Typography>
        <Typography
          variant='h5'
          color='text.secondary'
          sx={{ px: 3, py: 2, fontWeight: 'bold' }}
        >
          {workoutDate()}
        </Typography>
      </Typography>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography
              variant='h6'
              color='text.secondary'
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Timeline sx={{ mr: 0.5 }} />
              {INTERVAL}
            </Typography>
          </Grid>
          <Grid
            item
            xl={6}
            lg={6}
            md={6}
            sm={6}
            xs={12}
          >
            <Typography
              variant='body1'
              sx={{ ml: (theme) => theme.spacing(3) }}
            >
              {WORKOUT_START}
            </Typography>
            <StaticTimePicker
              onChange={handlePickerChange('start')}
              value={moment(start, DJANGO_TIME_FORMAT)}
              minutesStep={5}
              ampm={false}
              views={['hours', 'minutes']}
            />
          </Grid>
          <Grid
            item
            xl={6}
            lg={6}
            md={6}
            sm={6}
            xs={12}
          >
            <Typography
              sx={{ ml: (theme) => theme.spacing(3) }}
              variant='body1'
            >
              {WORKOUT_END}
            </Typography>
            <StaticTimePicker
              onChange={handlePickerChange('end')}
              value={moment(end, DJANGO_TIME_FORMAT)}
              minutesStep={5}
              ampm={false}
              views={['hours', 'minutes']}
            />
          </Grid>
          <Grid item xs={12}>
            <ExerciseList
              exercises={exercises}
              onExerciseChange={handleExerciseChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          variant='contained'
          color='success'
          onClick={save}
          startIcon={<Save />}
        >
          {SAVE}
        </Button>
        <Button
          variant='contained'
          color='error'
          onClick={closeModal}
          startIcon={<Cancel />}
        >
          {CANCEL}
        </Button>
      </DialogActions>
      {isLoading && <Loading />}
    </Dialog>
  );
};

export default WorkoutModal;
