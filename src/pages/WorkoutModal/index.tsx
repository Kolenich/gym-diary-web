import { Cancel, Save, Timeline } from '@mui/icons-material';
import { TimePicker } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import ExerciseList from 'components/ExerciseList';
import Loading from 'components/Loading';
import { Context } from 'context';
import { Workout } from 'context/types';
import api from 'lib/api';
import { DATE_DISPLAY_FORMAT, DJANGO_DATE_FORMAT, DJANGO_TIME_FORMAT } from 'lib/constants';
import { isAxiosError } from 'lib/utils';
import { isEqual } from 'lodash';
import moment, { Moment } from 'moment';
import React, { ContextType, PureComponent } from 'react';
import { FormErrors, Props, State } from './types';

class WorkoutModal extends PureComponent<Props, State> {
  static contextType = Context

  context!: ContextType<typeof Context>

  state: State = {
    workout: {
      start: null,
      end: null,
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
    const { workoutDay } = this.context;
    const { workout } = this.state;

    if (workoutDay) {
      return workoutDay.format(DATE_DISPLAY_FORMAT);
    }

    if (workout.date) {
      return moment(workout.date, DJANGO_DATE_FORMAT).format(DATE_DISPLAY_FORMAT);
    }

    return '';
  }

  get modalTitle() {
    const { match } = this.props;

    switch (match.params.id) {
      case 'add':
        return 'Добавить тренировку';
      default:
        return 'Редактировать тренировку';
    }
  }

  get editMode() {
    const { match } = this.props;

    return Boolean(match.params.id);
  }

  async componentDidMount() {
    await this.loadWorkout();
  }

  async componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
    const { match } = this.props;
    const { workout } = this.state;

    if (!isEqual(prevState.workout, workout)) {
      this.resetErrors();
    }

    if (prevProps.match.params.id !== match.params.id) {
      await this.loadWorkout();
    }
  }

  /**
   * Function for loading current workout
   * @return {Promise<void>}
   */
  loadWorkout = async () => {
    const { match } = this.props;

    if (match.params.id !== 'add') {
      this.setState({ loading: true });
      const response = await api.get<Workout>(`workout-api/workouts/${match.params.id}`);

      this.setState((state) => ({ ...state, workout: response.data, loading: false }));
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

  closeModal = () => {
    const { setCurrentDay } = this.context;
    const { history } = this.props;

    setCurrentDay(null);
    history.push({ pathname: '/workouts' });
  }

  save = async () => {
    const { workoutDay, addWorkout, updateWorkout } = this.context;
    const { workout } = this.state;

    this.setState({ loading: true });

    try {
      if (!this.editMode) {
        const response = await api.post<Workout>('workout-api/workouts/', {
          ...workout,
          date: workoutDay!.format(DJANGO_DATE_FORMAT),
        });

        addWorkout(response.data);
      } else {
        const response = await api.patch<Workout>(`workout-api/workouts/${workout.id}/`, workout);

        updateWorkout(response.data);
      }

      this.setState({ loading: false });
      this.closeModal();
    } catch (error) {
      if (isAxiosError<FormErrors>(error)) {
        const newErrors = error.response?.data;

        this.setState((state) => ({
          ...state,
          loading: false,
          errors: {
            ...state.errors,
            ...newErrors,
          },
        }));
      }
    }
  }

  /**
   * Callback for handling TimePicker's input change
   * @param {moment.Moment | null} date - new value
   * @param {keyof Workout} field - field of Workout object
   */
  handlePickerChange = (date: Moment | null, field: keyof Workout) => this.setState((state) => ({
    ...state,
    workout: {
      ...state.workout,
      [field]: date ? moment(date).format(DJANGO_TIME_FORMAT) : null,
    },
  }))

  render() {
    const { errors, workout, loading } = this.state;

    return (
      <Dialog
        open
        onClose={this.closeModal}
        fullWidth
        maxWidth="md"
      >
        <Typography
          component="div"
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ px: 3, py: 2, fontWeight: 'bold' }}
          >
            {this.modalTitle}
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ px: 3, py: 2, fontWeight: 'bold' }}
          >
            {this.workoutDate}
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
            <Grid item xs={6}>
              <TimePicker
                onChange={(date) => this.handlePickerChange(date, 'start')}
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
                onChange={(date) => this.handlePickerChange(date, 'end')}
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
              <ExerciseList exercises={workout.exercises}/>
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

export default WorkoutModal;
