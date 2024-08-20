import { useMemo, type FC } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { Delete, Edit, FitnessCenter } from '@mui/icons-material';
import { type Theme } from '@mui/material';
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
  DATE_DISPLAY_FORMAT,
  DJANGO_DATE_FORMAT,
  DJANGO_TIME_FORMAT,
  TIME_DISPLAY_FORMAT,
  TODAY_DATE,
} from 'constants/datetime';
import { TODAY } from 'constants/texts';
import { useAppDispatch, useAppSelector } from 'store/store.hooks';
import { selectWeekWorkoutsParams, setWorkoutDay } from 'store/week';
import { capitalize } from 'utils/capitalize';

import { DELETE_WORKOUT, EDIT_WORKOUT, NO_WORKOUTS, NO_WORKOUT_TIME, WORKOUT } from './DayCard.constants';
import { type IDayCardProps } from './DayCard.types';

const DayCard: FC<IDayCardProps> = ({ day }) => {
  const weekWorkoutsParams = useAppSelector(selectWeekWorkoutsParams);
  const { data: workouts = [] } = useGetWorkouts(weekWorkoutsParams);
  const [deleteWorkout] = useDeleteWorkout();

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const currentWorkout = useMemo(
    () => workouts.find(({ date }) => date === day.format(DJANGO_DATE_FORMAT)) || null,
    [day, workouts],
  );
  const hasCurrentWorkout = !!currentWorkout;

  const handleCardDoubleClick = (): void => {
    if (hasCurrentWorkout) {
      const { id = 0 } = currentWorkout;

      navigate(id.toString());
      return;
    }

    dispatch(setWorkoutDay(day.toISOString()));
    navigate('add');
  };

  const handleWorkoutDelete = (): void => {
    if (hasCurrentWorkout) {
      deleteWorkout(currentWorkout.id);
    }
  };

  const cardTitle = capitalize(day.locale('ru').format('dddd'));
  const formattedDay = day.format(DATE_DISPLAY_FORMAT);
  const isToday = day.format(DATE_DISPLAY_FORMAT) === TODAY_DATE.format(DATE_DISPLAY_FORMAT);
  const hasBothStartAndEnd = !!currentWorkout?.start && !!currentWorkout?.end;

  const secondaryTitle = hasBothStartAndEnd
    ? `${moment(currentWorkout.start, DJANGO_TIME_FORMAT).format(TIME_DISPLAY_FORMAT)} - ${moment(
        currentWorkout.end,
        DJANGO_TIME_FORMAT,
      ).format(TIME_DISPLAY_FORMAT)}`
    : NO_WORKOUT_TIME;

  return (
    <Card sx={{ position: 'relative' }}>
      <CardActionArea component='div' sx={{ minHeight: 200 }} onDoubleClick={handleCardDoubleClick}>
        <CardContent color='inherit' sx={{ mb: 2 }}>
          <List
            subheader={
              <Typography gutterBottom variant='h6' component='div' color='text.secondary'>
                {cardTitle} ({formattedDay})
              </Typography>
            }
          >
            {hasCurrentWorkout ? (
              <ListItem
                secondaryAction={
                  <>
                    <Tooltip title={EDIT_WORKOUT}>
                      <IconButton color='inherit' component={Link} to={(currentWorkout.id as number).toString()}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={DELETE_WORKOUT}>
                      <IconButton color='inherit' onClick={handleWorkoutDelete}>
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
                  secondary={<Typography variant='body2'>{secondaryTitle}</Typography>}
                />
              </ListItem>
            ) : (
              <Typography variant='body2'>{NO_WORKOUTS}</Typography>
            )}
          </List>
        </CardContent>
      </CardActionArea>
      <Zoom in={isToday}>
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
