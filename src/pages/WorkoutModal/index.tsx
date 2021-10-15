import { Cancel, DirectionsRun, Save, Timeline } from '@mui/icons-material';
import { TimePicker } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import { withContext } from 'context';
import { Workout } from 'context/types';
import api from 'lib/api';
import { DATE_DISPLAY_FORMAT, DJANGO_DATE_FORMAT, DJANGO_TIME_FORMAT } from 'lib/constants';
import { isAxiosError } from 'lib/utils';
import { isEqual } from 'lodash';
import moment from 'moment';
import React, { PureComponent } from 'react';
import Loading from '../../components/Loading';
import { FormErrors, Props, State } from './types';

class WorkoutModal extends PureComponent<Props, State> {
  state: State = {
    workout: {
      date: '',
      start: '',
      end: '',
      exercises: [],
    },
    errors: {
      date: null,
      start: null,
      end: null,
    },
    loading: false,
  }

  /**
   * Getter for calculating current workout day
   * @return {string}
   */
  get workoutDate() {
    const { context } = this.props;
    const { workout } = this.state;

    if (workout.date) {
      return moment(workout.date, DJANGO_DATE_FORMAT).format(DATE_DISPLAY_FORMAT);
    }

    if (context!.workoutDay) {
      return context!.workoutDay.format(DATE_DISPLAY_FORMAT);
    }

    return '';
  }

  get modalTitle() {
    const { context } = this.props;

    if (context!.selectedWorkout) {
      return 'Редактировать тренировку';
    }
    return 'Добавить тренировку';
  }

  get editMode() {
    const { context } = this.props;

    return Boolean(context!.selectedWorkout);
  }

  /**
   * Getter that calculates properties, that were changed from original object of
   * context.selectedWorkout
   * @return {Partial<Workout>}
   */
  get workoutDiff() {
    const { context } = this.props;
    const { workout } = this.state;

    return Object.keys(workout).reduce((prev, curr) => {
      if (!isEqual(
        workout[curr as keyof Workout],
        (context!.selectedWorkout as Workout)[curr as keyof Workout],
      )) {
        return { ...prev, [curr]: workout[curr as keyof Workout] };
      }
      return prev;
    }, {});
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
    const { context } = this.props;
    const { workout } = this.state;

    if (!isEqual(prevState.workout, workout)) {
      this.resetErrors();
    }

    if (prevProps.context!.selectedWorkout !== context!.selectedWorkout) {
      if (context!.selectedWorkout) {
        this.setState((state) => ({
          ...state,
          workout: context!.selectedWorkout as Workout,
        }));
      }
    }
  }

  resetErrors = () => this.setState((state) => ({
    ...state,
    errors: {
      date: null,
      start: null,
      end: null,
    },
  }))

  resetWorkout = () => this.setState((state) => ({
    ...state,
    workout: {
      date: '',
      start: '',
      end: '',
      exercises: [],
    },
  }))

  closeModal = () => {
    const { context } = this.props;

    context!.setCurrentDay(null);
    context!.setCurrentWorkout(null);
    this.resetErrors();
    this.resetWorkout();
  }

  save = async () => {
    const { context } = this.props;
    const { workout } = this.state;

    this.setState({ loading: true });

    try {
      if (!this.editMode) {
        const response = await api.post<Workout>('workout-api/workouts/', {
          ...workout,
          date: context!.workoutDay?.format(DJANGO_DATE_FORMAT),
        });

        context!.addWorkout(response.data);
      } else {
        const response = await api.patch<Workout>(`workout-api/workouts/${workout.id}/`, this.workoutDiff);

        context!.updateWorkout(response.data);
      }

      this.closeModal();
    } catch (error) {
      if (isAxiosError<FormErrors>(error)) {
        const newErrors = error.response?.data;

        this.setState((state) => ({
          ...state,
          errors: {
            ...state.errors,
            ...newErrors,
          },
        }));
      }
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    const { context } = this.props;
    const { errors, workout, loading } = this.state;

    return (
      <Dialog
        open={Boolean(context!.workoutDay || context!.selectedWorkout)}
        onClose={this.closeModal}
        fullWidth
        maxWidth="md"
      >
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{ px: 3, py: 2, fontWeight: 'bold' }}
        >
          {this.modalTitle}
        </Typography>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                value={this.workoutDate}
                label="Дата тренировки"
                error={!!errors.date}
                helperText={errors.date}
                InputProps={{
                  readOnly: true,
                }}
                margin="dense"
                fullWidth
              />
            </Grid>
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
            <Grid item xs={6}>
              <TimePicker
                onChange={(date) => this.setState((state) => ({
                  ...state,
                  workout: {
                    ...state.workout,
                    start: date ? moment(date).format(DJANGO_TIME_FORMAT) : '',
                  },
                }))}
                value={moment(workout.start, DJANGO_TIME_FORMAT)}
                label="Начало тренировки"
                renderInput={(props) => (
                  <TextField
                    {...props}
                    fullWidth
                    error={!!errors.start}
                    helperText={errors.start}
                    inputProps={{ ...props.inputProps, placeholder: 'чч:мм' }}
                  />
                )}
                minutesStep={5}
              />
            </Grid>
            <Grid item xs={6}>
              <TimePicker
                onChange={(date) => this.setState((state) => ({
                  ...state,
                  workout: {
                    ...state.workout,
                    end: date ? moment(date).format(DJANGO_TIME_FORMAT) : '',
                  },
                }))}
                value={moment(workout.end, DJANGO_TIME_FORMAT)}
                label="Конец тренировки"
                renderInput={(props) => (
                  <TextField
                    {...props}
                    fullWidth
                    error={!!errors.end}
                    helperText={errors.end}
                    inputProps={{ ...props.inputProps, placeholder: 'чч:мм' }}
                  />
                )}
                minutesStep={5}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <DirectionsRun sx={{ mr: 0.5 }}/>
                Упражнения
              </Typography>
              {workout.exercises.length ? (
                <List>
                  {workout.exercises.map((exercise) => (
                    <ListItemButton key={exercise.id}>
                      <ListItemText>
                        <Typography variant="body2">
                          {exercise.name}
                        </Typography>
                      </ListItemText>
                    </ListItemButton>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Упражнения не указаны
                </Typography>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="success"
            onClick={this.save}
            startIcon={<Save/>}
          >
            Сохранить
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={this.closeModal}
            startIcon={<Cancel/>}
          >
            Отмена
          </Button>
        </DialogActions>
        {loading && <Loading/>}
      </Dialog>
    );
  }
}

export default withContext(WorkoutModal);
