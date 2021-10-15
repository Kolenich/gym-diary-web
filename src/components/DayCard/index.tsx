import { Add, ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  Chip,
  Fab,
  Theme,
  Tooltip,
  Typography,
  Zoom,
} from '@mui/material';
import ExerciseAccordion from 'components/ExerciseAccordion';
import { Context } from 'context';
import {
  DATE_DISPLAY_FORMAT,
  DJANGO_DATE_FORMAT,
  DJANGO_TIME_FORMAT,
  TIME_DISPLAY_FORMAT,
  TODAY,
} from 'lib/constants';
import { title } from 'lib/utils';
import moment from 'moment';
import React, { useContext } from 'react';
import { Props } from './types';

const DayCard = ({ day }: Props) => {
  const { workouts, editWorkout } = useContext(Context);

  const currentWorkouts = workouts.filter((workout) => (
    workout.date === day.format(DJANGO_DATE_FORMAT)
  ));

  return (
    <Card
      sx={{
        m: 1,
        pb: 6,
        flex: '1 0 18%',
        position: 'relative',
      }}
    >
      <CardContent color="inherit">
        <Typography gutterBottom variant="body1" component="div" color="text.primary">
          {title(day.locale('ru').format('dddd'))} ({day?.format(DATE_DISPLAY_FORMAT)})
        </Typography>
        {currentWorkouts.length ? currentWorkouts.map((workout) => (
          <Accordion key={workout.id}>
            <AccordionSummary
              expandIcon={<ExpandMore/>}
            >
              <Typography variant="h6" component="div" color="text.primary" sx={{ flexGrow: 1 }}>
                Тренировка
                <Typography color="text.secondary">
                  {workout.start && workout.end ? (
                    `${moment(workout.start, DJANGO_TIME_FORMAT).format(TIME_DISPLAY_FORMAT)} - ${moment(workout.end, DJANGO_TIME_FORMAT).format(TIME_DISPLAY_FORMAT)}`
                  ) : 'Время не указано'}
                </Typography>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {workout.exercises.length ? (
                <>
                  <Typography gutterBottom variant="body2" color="text.secondary">
                    Упражнения
                  </Typography>
                  <Typography variant="body2" color="text.secondary" component="div">
                    {workout.exercises.map((exercise) => (
                      <ExerciseAccordion key={exercise.id} exercise={exercise}/>
                    ))}
                  </Typography>
                </>
              ) : (
                <Typography gutterBottom variant="body2" color="text.secondary">
                  Упражнения не указаны
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        )) : (
          <Typography variant="body2" color="text.secondary">
            Тренировок нет
          </Typography>
        )}
      </CardContent>
      <Zoom in={day.format(DATE_DISPLAY_FORMAT) === TODAY.format(DATE_DISPLAY_FORMAT)}>
        <Chip
          label="Сегодня"
          color="info"
          sx={{
            position: 'absolute',
            bottom: (theme: Theme) => theme.spacing(1),
            left: (theme: Theme) => theme.spacing(1),
          }}
          onClick={() => editWorkout(day)}
        />
      </Zoom>
      <Tooltip title="Добавить тренировку">
        <Fab
          sx={{
            position: 'absolute',
            bottom: (theme: Theme) => theme.spacing(1),
            right: (theme: Theme) => theme.spacing(1),
          }}
          size="small"
          color="primary"
          onClick={() => editWorkout(day)}
        >
          <Add/>
        </Fab>
      </Tooltip>
    </Card>
  );
};

export default DayCard;
