import { type FC, useMemo } from 'react';

import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { Delete } from '@mui/icons-material';
import { Button, Grid2 as Grid, IconButton, TextField } from '@mui/material';

import { useForm } from 'react-hook-form';

import { type IWorkout, useCreateWorkout, useDeleteWorkout, useGetWorkout, useUpdateWorkout } from 'api/workouts';
import { ERoutePaths } from 'constants/routes';
import {
  VALIDATE_WORKOUT_DATE,
  VALIDATE_WORKOUT_DURATION_HOURS,
  VALIDATE_WORKOUT_FOCUS_AREA,
  VALIDATE_WORKOUT_START_TIME,
} from 'constants/validators';
import { useAppSelector } from 'store/store.hooks';
import { selectWorkoutDay } from 'store/workouts';

import { BACK, DEFAULT_WORKOUT, SAVE } from './WorkoutDetail.constants';

const WorkoutDetail: FC = () => {
  const { workoutId = '' } = useParams();

  const workoutDate = useAppSelector(selectWorkoutDay);

  const { data: workout } = useGetWorkout(+workoutId, {
    skip: isNaN(+workoutId),
  });

  const isEditMode = !isNaN(+workoutId);
  const isCreationMode = workoutId === ERoutePaths.WorkoutCreate;

  const {
    register,
    handleSubmit,
    formState: {
      isDirty,
      dirtyFields,
      errors: { duration_hours: durationHoursError, start_time: startTimeError, date: dateError },
    },
  } = useForm<Omit<IWorkout, 'id'>>({
    defaultValues: isCreationMode
      ? {
          ...DEFAULT_WORKOUT,
          date: workoutDate,
        }
      : undefined,
    values: isEditMode ? workout : undefined,
  });

  const [createWorkout, { isLoading: isCreatingWorkout }] = useCreateWorkout();
  const [updateWorkout, { isLoading: isUpdatingWorkout }] = useUpdateWorkout();
  const [deleteWorkout, { isLoading: isDeletingWorkout }] = useDeleteWorkout();

  const navigate = useNavigate();

  const isValidWorkoutId = isEditMode || isCreationMode;

  const isSaveButtonDisabled = useMemo(() => {
    if (isCreationMode) {
      return isCreatingWorkout;
    }

    if (isEditMode) {
      return isUpdatingWorkout || !isDirty;
    }
  }, [isCreationMode, isCreatingWorkout, isUpdatingWorkout, isDirty]);

  if (!isValidWorkoutId) {
    return <Navigate to='..' />;
  }

  const submitDelete = (): void => {
    deleteWorkout({ id: +workoutId, date: workout?.date as string })
      .unwrap()
      .then(goToSchedule);
  };

  const submitWorkout = (data: Omit<IWorkout, 'id'>): void => {
    if (isCreationMode) {
      createWorkout(data).unwrap().then(goToSchedule);

      return;
    }

    if (isEditMode) {
      const updatedFields = Object.keys(dirtyFields).reduce(
        (prevUpdatedFields, currDirtyField) => {
          const typedCurrDirtyField = currDirtyField as keyof Omit<IWorkout, 'id'>;

          const isDirtyField = dirtyFields[typedCurrDirtyField];

          if (isDirtyField) {
            return { ...prevUpdatedFields, [typedCurrDirtyField]: data[typedCurrDirtyField] };
          }

          return prevUpdatedFields;
        },
        {} as Partial<Omit<IWorkout, 'id'>>,
      );

      updateWorkout({ id: +workoutId, ...updatedFields });

      return;
    }
  };

  const goToSchedule = (): void => {
    navigate('..');
  };

  return (
    <form onSubmit={handleSubmit(submitWorkout)}>
      <Grid container spacing={2}>
        <Grid size={2}>
          <TextField
            fullWidth
            {...register('date', VALIDATE_WORKOUT_DATE)}
            type='date'
            label='Дата тренировки'
            slotProps={{ inputLabel: { shrink: true } }}
            error={!!dateError}
            helperText={dateError?.message}
          />
        </Grid>
        <Grid size={2}>
          <TextField
            fullWidth
            {...register('start_time', VALIDATE_WORKOUT_START_TIME)}
            type='time'
            label='Начало'
            slotProps={{ inputLabel: { shrink: true } }}
            error={!!startTimeError}
            helperText={startTimeError?.message}
          />
        </Grid>
        <Grid size={2}>
          <TextField
            fullWidth
            type='number'
            {...register('duration_hours', VALIDATE_WORKOUT_DURATION_HOURS)}
            label='Длительность (часов)'
            slotProps={{ inputLabel: { shrink: true } }}
            error={!!durationHoursError}
            helperText={durationHoursError?.message}
          />
        </Grid>
        <Grid size={2}>
          <TextField
            {...register('focus_area', VALIDATE_WORKOUT_FOCUS_AREA)}
            label='Группа мышц'
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid size='auto'>
          <Button variant='contained' disabled={isSaveButtonDisabled} type='submit'>
            {SAVE}
          </Button>
        </Grid>
        <Grid size='auto'>
          <Button variant='outlined' onClick={goToSchedule}>
            {BACK}
          </Button>
        </Grid>
        {isEditMode && (
          <Grid size='auto'>
            <IconButton disabled={isDeletingWorkout} color='error' onClick={submitDelete}>
              <Delete />
            </IconButton>
          </Grid>
        )}
      </Grid>
    </form>
  );
};

export default WorkoutDetail;
