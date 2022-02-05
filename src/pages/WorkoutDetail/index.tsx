import { Cancel, Save, Timeline } from '@mui/icons-material';
import { MobileTimePicker, MobileTimePickerProps, StaticTimePicker } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { useAPI } from 'api';
import { ExerciseList, Loading } from 'components';
import { Context } from 'context';
import { Exercise, PartialBy, Workout } from 'context/types';
import { DATE_DISPLAY_FORMAT, DJANGO_DATE_FORMAT, DJANGO_TIME_FORMAT } from 'lib/constants';
import { isAxiosError } from 'lib/utils';
import moment, { Moment } from 'moment';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Props } from './types';

const WorkoutModal = ({ match, history }: Props) => {
  const { isMobile } = useContext(Context);
  const api = useAPI();

  const TimePickerComponent = isMobile ? (props: MobileTimePickerProps) => (
    <MobileTimePicker
      {...props}
      okText="ОК"
      cancelText="Отмена"
      clearable
      clearText="Очистить"
      showTodayButton
      todayText="Сейчас"
      openTo="hours"
      views={['hours', 'minutes']}
    />
  ) : StaticTimePicker;

  const { workoutDay, setCurrentDay } = useContext(Context);

  const [workout, setWorkout] = useState<PartialBy<Workout, 'date'>>({
    start: moment().format(DJANGO_TIME_FORMAT),
    end: moment().add(1, 'hours').add(30, 'minutes').format(DJANGO_TIME_FORMAT),
    exercises: [],
  });
  const [errors, setErrors] = useState({
    start: null,
    end: null,
  });
  const [loading, setLoading] = useState(false);

  /**
   * Value for calculating current workout day
   * @return {string}
   */
  const workoutDate = () => {
    if (workoutDay) {
      return workoutDay.format(DATE_DISPLAY_FORMAT);
    }

    if (workout.date) {
      return moment(workout.date, DJANGO_DATE_FORMAT).format(DATE_DISPLAY_FORMAT);
    }

    return '';
  };

  const modalTitle = match.params.id === 'add' ? 'Добавить тренировку' : 'Редактировать тренировку';

  const editMode = match.params.id !== 'add';

  /**
   * Function for loading current workout
   * @return {Promise<void>}
   */
  const loadWorkout = useCallback(async () => {
    if (match.params.id !== 'add') {
      setLoading(true);
      const response = await api.get<Workout>(`workouts-api/workouts/${match.params.id}/`);

      setWorkout(response.data);
      setLoading(false);
    }
  }, [api, match.params.id]);

  const closeModal = () => {
    setCurrentDay(null);
    history.push({ pathname: '/workouts' });
  };

  const save = async () => {
    setLoading(true);
    try {
      if (!editMode) {
        await api.post<Workout>('workouts-api/workouts/', {
          ...workout,
          date: workoutDay!.format(DJANGO_DATE_FORMAT),
        });
      } else {
        await api.put<Workout>(`workouts-api/workouts/${workout.id}/`, workout);
      }

      setLoading(false);
      closeModal();
    } catch (error) {
      if (isAxiosError(error)) {
        const newErrors = error.response?.data;

        setErrors((oldErrors) => ({ ...oldErrors, ...newErrors }));
        setLoading(false);
      }
    }
  };

  /**
   * Callback for handling TimePicker's input change
   * @param {moment.Moment | null} date - new value
   * @param {keyof Workout} field - field of Workout object
   */
  const handlePickerChange = (date: Moment | null, field: keyof Workout) => (
    setWorkout((oldWorkout) => ({
      ...oldWorkout,
      [field]: date ? moment(date).format(DJANGO_TIME_FORMAT) : null,
    }))
  );

  /**
   * Callback for handling exercise change in child component
   * @type {(exercise: Exercise, action: ("add" | "update" | "delete")) => void}
   */
  const handleExerciseChange = useCallback((exercise: Exercise, action: 'add' | 'update' | 'delete') => {
    switch (action) {
      case 'add':
        setWorkout((oldWorkout) => ({
          ...oldWorkout,
          exercises: oldWorkout.exercises.concat(exercise),
        }));
        break;
      case 'delete':
        setWorkout((oldWorkout) => ({
          ...oldWorkout,
          exercises: oldWorkout.exercises.filter((x) => x.id !== exercise.id),
        }));
        break;
      case 'update':
        setWorkout((oldWorkout) => ({
          ...oldWorkout,
          exercises: oldWorkout.exercises.map((x) => {
            if (x.id === exercise.id) {
              return { ...x, ...exercise };
            }
            return x;
          }),
        }));
        break;
      default:
        break;
    }
  }, []);

  useEffect(() => {
    (async () => {
      await loadWorkout();
    })();
  }, [loadWorkout, match.params.id]);

  useEffect(() => {
    setErrors({ start: null, end: null });
  }, [workout]);

  return (
    <Dialog
      open
      onClose={closeModal}
      fullWidth
      maxWidth="md"
    >
      <Typography
        component="div"
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
          variant="h5"
          color="text.secondary"
          sx={{ px: 3, py: 2, fontWeight: 'bold', textAlign: 'center' }}
        >
          {modalTitle}
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{ px: 3, py: 2, fontWeight: 'bold' }}
        >
          {workoutDate()}
        </Typography>
      </Typography>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Timeline sx={{ mr: 0.5 }}/>
              Интервал
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
            <TimePickerComponent
              onChange={(date) => handlePickerChange(date as Moment, 'start')}
              value={moment(workout.start, DJANGO_TIME_FORMAT)}
              label="Начало тренировки"
              renderInput={(props) => (
                <TextField
                  {...props}
                  fullWidth
                  error={!!errors.start}
                  helperText={errors.start}
                  value={workout.start}
                  onChange={(event) => setWorkout((oldWorkout) => ({
                    ...oldWorkout,
                    start: event.target.value || null,
                  }))}
                  inputProps={{ ...props.inputProps, placeholder: 'чч:мм' }}
                />
              )}
              minutesStep={5}
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
            <TimePickerComponent
              onChange={(date) => handlePickerChange(date as Moment, 'end')}
              value={moment(workout.end, DJANGO_TIME_FORMAT)}
              label="Конец тренировки"
              renderInput={(props) => (
                <TextField
                  {...props}
                  fullWidth
                  error={!!errors.end}
                  helperText={errors.end}
                  value={workout.end}
                  onChange={(event) => setWorkout((oldWorkout) => ({
                    ...oldWorkout,
                    end: event.target.value || null,
                  }))}
                  inputProps={{ ...props.inputProps, placeholder: 'чч:мм' }}
                />
              )}
              minutesStep={5}
            />
          </Grid>
          <Grid item xs={12}>
            <ExerciseList
              exercises={workout.exercises}
              onExerciseChange={handleExerciseChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="success"
          onClick={save}
          startIcon={<Save/>}
        >
          Сохранить
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={closeModal}
          startIcon={<Cancel/>}
        >
          Отмена
        </Button>
      </DialogActions>
      {loading && <Loading/>}
    </Dialog>
  );
};

export default WorkoutModal;