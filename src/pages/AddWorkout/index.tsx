import { Cancel, Save } from '@mui/icons-material';
import { StaticTimePicker } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { Context } from 'context';
import { Workout } from 'context/types';
import api from 'lib/api';
import moment from 'moment';
import React, { useContext, useState } from 'react';
import { isAxiosError } from '../../lib/utils';
import { FormErrors } from './types';

const AddWorkout = () => {
  const { workoutDay, editWorkout, addWorkout } = useContext(Context);

  const [workout, setWorkout] = useState<Workout>({
    date: '',
    start: null,
    end: null,
    exercises: [],
  });

  const [errors, setErrors] = useState<FormErrors>({
    date: null,
    start: null,
    end: null,
  });

  const getDateFromTime = (time: string | null) => {
    if (time) {
      const momentTime = moment(time, 'HH:mm:ss.SSS');
      return new Date(0, 0, 0, momentTime.hours(), momentTime.minutes());
    }
    return time;
  };

  const closeModal = () => {
    editWorkout(null);
    setWorkout({
      date: '',
      start: null,
      end: null,
      exercises: [],
    });
    setErrors({
      date: null,
      start: null,
      end: null,
    });
  };

  const save = async () => {
    try {
      const response = await api.post<Workout>('workout-api/workouts/', {
        ...workout,
        date: workoutDay?.format('yyyy-MM-DD'),
      });

      addWorkout(response.data);
      closeModal();
    } catch (error) {
      if (isAxiosError<FormErrors>(error)) {
        const newErrors = error.response?.data;

        setErrors((oldErrors) => ({
          ...oldErrors,
          ...newErrors,
        }));
      }
    }
  };

  return (
    <Dialog
      open={Boolean(workoutDay)}
      onClose={closeModal}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        <Typography gutterBottom variant="body2" color="text.secondary">
          Добавить тренировку
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              value={workoutDay?.format('DD.MM.yyyy') || ''}
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
            <StaticTimePicker
              onChange={(date) => setWorkout((oldWorkout) => ({
                ...oldWorkout,
                start: moment(date).format('HH:mm'),
              }))}
              value={getDateFromTime(workout.start)}
              label="Начало тренировки"
              renderInput={(props) => (
                <TextField
                  {...props}
                  fullWidth
                  error={!!errors.start}
                  helperText={errors.start}
                  value={workout.start || ''}
                  onChange={(event) => {
                    if (!event.target.value) {
                      setWorkout((oldWorkout) => ({
                        ...oldWorkout,
                        start: null,
                      }));
                    }
                  }}
                  inputProps={{ placeholder: 'ЧЧ:ММ' }}
                />
              )}
              minutesStep={5}
            />
          </Grid>
          <Grid item xs={6}>
            <StaticTimePicker
              onChange={(date) => setWorkout((oldWorkout) => ({
                ...oldWorkout,
                end: moment(date).format('HH:mm'),
              }))}
              value={getDateFromTime(workout.end)}
              label="Конец тренировки"
              minTime={moment(workout.start, 'HH:mm').add(5, 'minutes')}
              maxTime={moment(workout.start, 'HH:mm').add(2, 'hours')}
              renderInput={(props) => (
                <TextField
                  {...props}
                  fullWidth
                  error={!!errors.end}
                  helperText={errors.end}
                  value={workout.end || ''}
                  onChange={(event) => {
                    if (!event.target.value) {
                      setWorkout((oldWorkout) => ({
                        ...oldWorkout,
                        end: null,
                      }));
                    }
                  }}
                  inputProps={{ placeholder: 'ЧЧ:ММ' }}
                />
              )}
              onError={(reason) => {
                switch (reason) {
                  case 'maxTime':
                    setErrors((oldErrors) => ({
                      ...oldErrors,
                      end: 'Превышено максимальное время тренировки (2 часа)',
                    }));
                    break;
                  case 'minTime':
                    setErrors((oldErrors) => ({
                      ...oldErrors,
                      end: 'Конец тренировки не может быть раньше начала',
                    }));
                    break;
                  default:
                    setErrors((oldErrors) => ({ ...oldErrors, end: null }));
                    break;
                }
              }}
              minutesStep={5}
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
    </Dialog>
  );
};

export default AddWorkout;
