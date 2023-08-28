import type { FC } from 'react';
import { useMemo } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { Delete, Edit, FitnessCenter } from '@mui/icons-material';
import type {
  Theme,
} from '@mui/material';
import {
  Card,
  CardActionArea,
  CardContent,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Typography,
  Zoom,
} from '@mui/material';

import moment from 'moment';

import { useDeleteWorkout, useGetWorkouts } from 'api/workouts';
import {
  DELETE_WORKOUT,
  EDIT_WORKOUT,
  NO_WORKOUT_TIME, NO_WORKOUTS, WORKOUT,
} from 'components/DayCard/DayCard.constants';
import {
  DATE_DISPLAY_FORMAT,
  DJANGO_DATE_FORMAT,
  DJANGO_TIME_FORMAT,
  TIME_DISPLAY_FORMAT,
  TODAY_DATE,
} from 'constants/datetime';
import { TODAY } from 'constants/texts';
import { useAppDispatch } from 'store/hooks';
import { setWorkoutDay } from 'store/week';
import { capitalize } from 'utils/capitalize';
import { isArrayNonEmpty } from 'utils/is-array-non-empty';

import type { IDayCardProps } from './DayCard.types';

const DayCard: FC<IDayCardProps> = ({ day }) => {
  const { data: workouts = [] } = useGetWorkouts();
  const [deleteWorkout] = useDeleteWorkout();

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const currentWorkouts = useMemo(() => workouts.filter((workout) => (
    workout.date === day.format(DJANGO_DATE_FORMAT)
  )), [day, workouts]);

  const handleCardDoubleClick = (): void => {
    dispatch(setWorkoutDay(day.toISOString()));
    navigate('add');
  };

  const cardTitle = capitalize(day.locale('ru').format('dddd'));
  const formattedDay = day.format(DATE_DISPLAY_FORMAT);
  const hasCurrentWorkouts = isArrayNonEmpty(currentWorkouts);
  const hasTodayLabel = day.format(DATE_DISPLAY_FORMAT) === TODAY_DATE.format(DATE_DISPLAY_FORMAT);

  return (
    <Card sx={{ position: 'relative' }}>
      <CardActionArea
        component='div'
        sx={{ minHeight: 200 }}
        onDoubleClick={handleCardDoubleClick}
      >
        <CardContent
          color='inherit'
          sx={{ mb: 2 }}
        >
          <List
            subheader={
              <Typography gutterBottom variant='h6' component='div' color='text.secondary'>
                {cardTitle} ({formattedDay})
              </Typography>
            }
          >
            {hasCurrentWorkouts ? currentWorkouts.map(({ id = 0, start, end }) => {
              const handleWorkoutDelete = (): void => {
                deleteWorkout(id);
              };

              const hasBothStartAndEnd = !!start && !!end;

              const secondaryTitle = hasBothStartAndEnd ? (
                `${moment(start, DJANGO_TIME_FORMAT)
                  .format(TIME_DISPLAY_FORMAT)} - ${moment(end, DJANGO_TIME_FORMAT)
                  .format(TIME_DISPLAY_FORMAT)}`
              ) : NO_WORKOUT_TIME;

              return (
                <ListItem
                  key={id}
                  secondaryAction={
                    <>
                      <Tooltip title={EDIT_WORKOUT}>
                        <IconButton
                          color='inherit'
                          component={Link}
                          to={id.toString()}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={DELETE_WORKOUT}>
                        <IconButton
                          color='inherit'
                          onClick={handleWorkoutDelete}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </>
                  }
                >
                  <FitnessCenter sx={{ mr: 1 }} />
                  <ListItemText
                    primary={
                      <Typography variant='h6' component='div'>
                        {WORKOUT}
                      </Typography>
                    }
                    secondary={
                      <Typography variant='body2'>
                        {secondaryTitle}
                      </Typography>
                    }
                  />
                </ListItem>
              );
            }) : (
              <Typography variant='body2'>
                {NO_WORKOUTS}
              </Typography>
            )}
          </List>
        </CardContent>
      </CardActionArea>
      <Zoom in={hasTodayLabel}>
        <Chip
          label={TODAY}
          color='info'
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
