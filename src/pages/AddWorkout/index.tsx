import { Cancel, Save } from '@mui/icons-material';
import { TimePicker } from '@mui/lab';
import { TimeValidationError } from '@mui/lab/internal/pickers/hooks/useValidation';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from '@mui/material';
import { Context } from 'context';
import { Workout } from 'context/types';
import api from 'lib/api';
import { DATE_DISPLAY_FORMAT, DJANGO_DATE_FORMAT, DJANGO_TIME_FORMAT } from 'lib/constants';
import { isAxiosError } from 'lib/utils';
import { isEqual } from 'lodash';
import moment from 'moment';
import React, { ContextType, PureComponent } from 'react';
import { FormErrors, State } from './types';

class AddWorkout extends PureComponent<Record<string, never>, State> {
  static contextType = Context

  context!: ContextType<typeof Context>

  state: State = {
    workout: {
      date: '',
      start: null,
      end: null,
      exercises: [],
    },
    errors: {
      date: null,
      start: null,
      end: null,
    },
  }

  componentDidUpdate(prevProps: Readonly<Record<string, never>>, prevState: Readonly<State>) {
    const { workout } = this.state;

    if (!isEqual(prevState.workout, workout)) {
      this.resetErrors();
    }
  }

  /**
   * Parser for preparing value for TimePicker
   * @param {string | null} time - time value
   * @return {null | Date}
   */
  getDateFromTime = (time: string | null) => {
    if (time) {
      const momentTime = moment(time, DJANGO_TIME_FORMAT);
      return new Date(0, 0, 0, momentTime.hours(), momentTime.minutes());
    }
    return null;
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
      start: null,
      end: null,
      exercises: [],
    },
  }))

  closeModal = () => {
    const { editWorkout } = this.context;

    editWorkout(null);
    this.resetErrors();
    this.resetWorkout();
  }

  /**
   * Callback for picker error handling
   * @param {TimeValidationError} reason - error reason
   * @param {keyof FormErrors} field - TimePicker field
   */
  handlePickerError = (reason: TimeValidationError, field: keyof FormErrors) => {
    switch (reason) {
      case 'maxTime':
        this.setState((state) => ({
          ...state,
          errors: {
            ...state.errors,
            [field]: 'Превышено максимальное время тренировки (2 часа).',
          },
        }));
        break;
      case 'minTime':
        this.setState((state) => ({
          ...state,
          errors: {
            ...state.errors,
            [field]: 'Конец тренировки не может быть раньше начала.',
          },
        }));
        break;
      default:
        break;
    }
  }

  save = async () => {
    const { addWorkout, workoutDay } = this.context;
    const { workout } = this.state;

    try {
      const response = await api.post<Workout>('workout-api/workouts/', {
        ...workout,
        date: workoutDay?.format(DJANGO_DATE_FORMAT),
      });

      addWorkout(response.data);
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
    }
  }

  render() {
    const { workoutDay } = this.context;
    const { errors, workout } = this.state;

    return (
      <Dialog
        open={Boolean(workoutDay)}
        onClose={this.closeModal}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Добавить тренировку
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                value={workoutDay?.format(DATE_DISPLAY_FORMAT) || ''}
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
            <Grid item xs={6}>
              <TimePicker
                onChange={(date) => this.setState((state) => ({
                  ...state,
                  workout: {
                    ...state.workout,
                    start: moment(date).format(DJANGO_TIME_FORMAT),
                  },
                }))}
                value={this.getDateFromTime(workout.start)}
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
                onError={(reason) => this.handlePickerError(reason, 'start')}
                minutesStep={5}
              />
            </Grid>
            <Grid item xs={6}>
              <TimePicker
                onChange={(date) => this.setState((state) => ({
                  ...state,
                  workout: {
                    ...state.workout,
                    end: moment(date).format(DJANGO_TIME_FORMAT),
                  },
                }))}
                value={this.getDateFromTime(workout.end)}
                label="Конец тренировки"
                minTime={moment(workout.start, DJANGO_TIME_FORMAT).add(5, 'minutes')}
                maxTime={moment(workout.start, DJANGO_TIME_FORMAT).add(2, 'hours')}
                renderInput={(props) => (
                  <TextField
                    {...props}
                    fullWidth
                    error={!!errors.end}
                    helperText={errors.end}
                    inputProps={{ ...props.inputProps, placeholder: 'чч:мм' }}
                  />
                )}
                onError={(reason) => this.handlePickerError(reason, 'end')}
                minutesStep={5}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="success"
            onClick={this.save}
            disabled={Object.values(errors).some(Boolean)}
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
      </Dialog>
    );
  }
}

export default AddWorkout;
