import { Add, ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  Fab,
  Theme,
  Tooltip,
  Typography,
} from '@mui/material';
import ExerciseAccordion from 'components/ExerciseAccordion';
import { Context } from 'context';
import { title } from 'lib/utils';
import React, { useContext } from 'react';
import { Props } from './types';

const DayCard = ({ day }: Props) => {
  const { workouts } = useContext(Context);

  return (
    <Card sx={{ m: 1, pb: 6, flex: '1 0 18%', position: 'relative' }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title(day.locale('ru').format('dddd'))} ({day?.format('DD.MM.yyyy')})
        </Typography>
        {workouts.filter((workout) => workout.date === day.format('YYYY-MM-DD')).map((workout) => (
          <Accordion key={workout.id}>
            <AccordionSummary
              expandIcon={<ExpandMore/>}
            >
              <Typography variant="body2" color="text.primary">Тренировка</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary">
                {workout.exercises.map((exercise) => (
                  <ExerciseAccordion key={exercise.id} exercise={exercise}/>
                ))}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </CardContent>
      <Tooltip title="Добавить тренировку">
        <Fab
          sx={{
            position: 'absolute',
            bottom: (theme: Theme) => theme.spacing(1),
            right: (theme: Theme) => theme.spacing(1),
          }}
          size="small"
          color="primary"
        >
          <Add/>
        </Fab>
      </Tooltip>
    </Card>
  );
};

export default DayCard;
