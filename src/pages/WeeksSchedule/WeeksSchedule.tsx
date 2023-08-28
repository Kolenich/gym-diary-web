import type { FC } from 'react';
import { useEffect, useState } from 'react';

import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import type { Theme } from '@mui/material';
import { AppBar, Fab, Grid, Toolbar, Tooltip, Typography, Zoom } from '@mui/material';

import { useSnackbar } from 'notistack';

import { useGetWorkouts } from 'api/workouts';
import { DayCard } from 'components/DayCard';
import { Loading } from 'components/Loading';
import { DATE_DISPLAY_FORMAT, TODAY_DATE } from 'constants/datetime';
import { TODAY } from 'constants/texts';
import { getErrorSentence } from 'utils/get-error-sentence';

import {
  EWeekTypes,
  NEXT_WEEK,
  PREVIOUS_WEEK,
  PUMPER_DIARY,
  WORKOUT_DAYS,
} from './WeekSchedule.constants';
import type { IWeeks } from './WeeksSchedule.types';
import { getWeek } from './WeeksSchedule.utils';

const WeeksSchedule: FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [weeks, setWeeks] = useState<IWeeks>({
    previous: [],
    current: [],
    next: [],
  });

  const { error, isLoading } = useGetWorkouts();

  /** Effect for calculating weeks */
  useEffect(() => {
    setWeeks((oldWeeks) => getWeek(oldWeeks, EWeekTypes.Current));
  }, []);

  useEffect(() => {
    const hasError = !!error;

    if (hasError) {
      enqueueSnackbar(getErrorSentence((error as any).message), { variant: 'error' });
    }
  }, [error, enqueueSnackbar]);

  const goToPreviousWeek = (): void => {
    setWeeks((oldWeeks) => getWeek(oldWeeks, EWeekTypes.Previous));
  };

  const goToCurrentWeek = (): void => {
    setWeeks((oldWeeks) => getWeek(oldWeeks, EWeekTypes.Current));
  };

  const goToNextWeek = (): void => {
    setWeeks((oldWeeks) => getWeek(oldWeeks, EWeekTypes.Next));
  };

  const currentYear = (weeks.current.filter((day) => day.day() === TODAY_DATE.day())[0] || TODAY_DATE).year();
  const displayedDays = weeks.current.slice(0, WORKOUT_DAYS);
  const isToday = !weeks.current.some((day) => (
    day.format(DATE_DISPLAY_FORMAT) === TODAY_DATE.format(DATE_DISPLAY_FORMAT)
  ));

  return (
    <>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            {PUMPER_DIARY}
          </Typography>
          <Typography variant='h6' component='div'>
            {`${currentYear} г.`}
          </Typography>
        </Toolbar>
      </AppBar>
      <Grid
        container
        spacing={2}
        sx={{ p: 2 }}
      >
        {displayedDays.map((day) => (
          <Grid
            key={day.format('dddd')}
            item
            xs={12}
            sm={6}
            lg={4}
            xl={2}
          >
            <DayCard day={day} />
          </Grid>
        ))}
      </Grid>
      <Grid
        container
        sx={{
          position: {
            xs: 'sticky',
            sm: 'absolute',
            md: 'absolute',
            lg: 'absolute',
            xl: 'absolute',
          },
          bottom: (theme: Theme) => theme.spacing(2),
          px: 2,
          mt: 1,
        }}
        alignItems='center'
      >
        <Grid
          item
          xs={4}
        >
          <Tooltip title={PREVIOUS_WEEK}>
            <Fab
              color='primary'
              onClick={goToPreviousWeek}
            >
              <ChevronLeft />
            </Fab>
          </Tooltip>
        </Grid>
        <Grid
          item
          xs={4}
          sx={{ textAlign: 'center' }}
        >
          <Zoom in={isToday}>
            <Fab
              color='primary'
              variant='extended'
              onClick={goToCurrentWeek}
            >
              {TODAY}
            </Fab>
          </Zoom>
        </Grid>
        <Grid
          item
          xs={4}
          sx={{ textAlign: 'end' }}
        >
          <Tooltip title={NEXT_WEEK}>
            <Fab
              color='primary'
              onClick={goToNextWeek}
            >
              <ChevronRight />
            </Fab>
          </Tooltip>
        </Grid>
      </Grid>
      {isLoading && <Loading />}
    </>
  );
};

export default WeeksSchedule;
