import { type FC, useEffect } from 'react';

import { type FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { AppBar, Fab, Grid, type Theme, Toolbar, Tooltip, Typography, Zoom } from '@mui/material';

import { useSnackbar } from 'notistack';

import { useGetWorkouts } from 'api/workouts';
import { DayCard } from 'components/DayCard';
import { Loading } from 'components/Loading';
import { DATE_DISPLAY_FORMAT, TODAY_DATE } from 'constants/datetime';
import { TODAY } from 'constants/texts';
import { useAppDispatch, useAppSelector } from 'store/store.hooks';
import { EWeekTypes, goToWeek, selectCurrentWeek, selectWeekWorkoutsParams } from 'store/week';
import { getErrorSentence } from 'utils/get-error-sentence';

import { NEXT_WEEK, PREVIOUS_WEEK, PUMPER_DIARY, WORKOUT_DAYS } from './WeekSchedule.constants';

const WeeksSchedule: FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useAppDispatch();

  const currentWeek = useAppSelector(selectCurrentWeek);

  const weekWorkoutsParams = useAppSelector(selectWeekWorkoutsParams);

  const { error, isLoading, isError } = useGetWorkouts(weekWorkoutsParams);

  useEffect(() => {
    if (isError) {
      const { data } = error as FetchBaseQueryError;

      const isPlainText = typeof data === 'string';

      if (isPlainText) {
        enqueueSnackbar(getErrorSentence(data), { variant: 'error' });
      }
    }
  }, [error, enqueueSnackbar]);

  const goPreviousWeek = (): void => {
    dispatch(goToWeek(EWeekTypes.Previous));
  };

  const goCurrentWeek = (): void => {
    dispatch(goToWeek(EWeekTypes.Current));
  };

  const goNextWeek = (): void => {
    dispatch(goToWeek(EWeekTypes.Next));
  };

  const currentYear = (currentWeek.filter(day => day.day() === TODAY_DATE.day())[0] || TODAY_DATE).year();
  const displayedDays = currentWeek.slice(0, WORKOUT_DAYS);
  const isToday = !currentWeek.some(day => day.format(DATE_DISPLAY_FORMAT) === TODAY_DATE.format(DATE_DISPLAY_FORMAT));

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
      <Grid container spacing={2} sx={{ p: 2 }}>
        {displayedDays.map(day => (
          <Grid key={day.format('dddd')} item xs={12} sm={6} lg={4} xl={2}>
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
        <Grid item xs={4}>
          <Tooltip title={PREVIOUS_WEEK}>
            <Fab color='primary' onClick={goPreviousWeek}>
              <ChevronLeft />
            </Fab>
          </Tooltip>
        </Grid>
        <Grid item xs={4} sx={{ textAlign: 'center' }}>
          <Zoom in={isToday}>
            <Fab color='primary' variant='extended' onClick={goCurrentWeek}>
              {TODAY}
            </Fab>
          </Zoom>
        </Grid>
        <Grid item xs={4} sx={{ textAlign: 'end' }}>
          <Tooltip title={NEXT_WEEK}>
            <Fab color='primary' onClick={goNextWeek}>
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
