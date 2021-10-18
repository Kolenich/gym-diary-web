import { Delete, Edit, FitnessCenter } from '@mui/icons-material';
import {
  Card,
  CardActionArea,
  CardContent,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Theme,
  Tooltip,
  Typography,
  Zoom,
} from '@mui/material';
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
import { Link, useHistory } from 'react-router-dom';
import { Props } from './types';

const DayCard = ({ day }: Props) => {
  const { workouts, setCurrentDay, deleteWorkout } = useContext(Context);

  const history = useHistory();

  const currentWorkouts = workouts.filter((workout) => (
    workout.date === day.format(DJANGO_DATE_FORMAT)
  ));

  return (
    <Card sx={{ position: 'relative' }}>
      <CardActionArea
        sx={{ minHeight: 200 }}
        onDoubleClick={() => {
          setCurrentDay(day);
          history.push({ pathname: '/workouts/add' });
        }}
      >
        <CardContent
          color="inherit"
          sx={{ mb: 2 }}
        >
          <List
            subheader={
              <Typography gutterBottom variant="h6" component="div" color="text.secondary">
                {title(day.locale('ru').format('dddd'))} ({day?.format(DATE_DISPLAY_FORMAT)})
              </Typography>
            }
          >
            {currentWorkouts.length ? currentWorkouts.map((workout) => (
              <ListItem
                key={workout.id}
                secondaryAction={
                  <>
                    <Tooltip title="Редактировать тренировку">
                      <IconButton
                        color="inherit"
                        component={Link}
                        to={`/workouts/${workout.id}`}
                      >
                        <Edit/>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Удалить тренировку">
                      <IconButton
                        color="inherit"
                        onClick={() => deleteWorkout(workout.id!)}
                      >
                        <Delete/>
                      </IconButton>
                    </Tooltip>
                  </>
                }
                //                sx={{
                //                  cursor: 'pointer',
                //                  borderRadius: 1,
                //                  transition: (theme: Theme) => theme.transitions.create('all', {
                //                    easing: theme.transitions.easing.sharp,
                //                    duration: theme.transitions.duration.short,
                //                  }),
                //                  ':hover': {
                //                    bgcolor: 'primary.light',
                //                    color: 'common.white',
                //                  },
                //                }}
              >
                <FitnessCenter sx={{ mr: 1 }}/>
                <ListItemText
                  primary={
                    <Typography variant="h6" component="div">
                      Тренировка
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2">
                      {workout.start && workout.end ? (
                        `${moment(workout.start, DJANGO_TIME_FORMAT).format(TIME_DISPLAY_FORMAT)} - ${moment(workout.end, DJANGO_TIME_FORMAT).format(TIME_DISPLAY_FORMAT)}`
                      ) : 'Время не указано'}
                    </Typography>
                  }
                />
              </ListItem>
            )) : (
              <Typography variant="body2">
                Тренировок нет
              </Typography>
            )}
          </List>
        </CardContent>
      </CardActionArea>
      <Zoom in={day.format(DATE_DISPLAY_FORMAT) === TODAY.format(DATE_DISPLAY_FORMAT)}>
        <Chip
          label="Сегодня"
          color="info"
          sx={{
            position: 'absolute',
            bottom: (theme: Theme) => theme.spacing(1),
            left: (theme: Theme) => theme.spacing(1),
          }}
        />
      </Zoom>
    </Card>
  );
};

export default DayCard;
