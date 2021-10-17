import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { AppBar, Fab, Grid, Theme, Toolbar, Tooltip, Typography, Zoom } from '@mui/material';
import DayCard from 'components/DayCard';
import { Context } from 'context';
import { DATE_DISPLAY_FORMAT, TODAY, WORKOUT_DAYS } from 'lib/constants';
import React, { useContext, useEffect, useState } from 'react';
import { Weeks } from './types';
import getWeek from './utils';

const WeeksSchedule = () => {
  const { loadWorkouts } = useContext(Context);

  const [weeks, setWeeks] = useState<Weeks>({
    previous: [],
    current: [],
    next: [],
  });

  /** Effect for calculating weeks and loading workouts */
  useEffect(() => {
    (async () => {
      setWeeks((oldWeeks) => getWeek(oldWeeks, 'current'));
      await loadWorkouts();
    })();
  }, [loadWorkouts]);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Дневник кочки
          </Typography>
          <Typography variant="h6" component="div">
            {(weeks.current.filter((day) => day.day() === TODAY.day())[0] || TODAY).year()} г.
          </Typography>
        </Toolbar>
      </AppBar>
      <Grid
        container
        spacing={2}
        sx={{ p: 2 }}
      >
        {weeks.current.slice(0, WORKOUT_DAYS).map((day) => (
          <Grid
            key={day.format('dddd')}
            item
            xs={12}
            sm={6}
            lg={4}
            xl={2}
          >
            <DayCard day={day}/>
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
          zIndex: 'snackbar',
        }}
        alignItems="center"
      >
        <Grid
          item
          xs={4}
        >
          <Tooltip title="Предыдущая неделя">
            <Fab

              color="primary"
              onClick={() => setWeeks((oldWeeks) => getWeek(oldWeeks, 'previous'))}
            >
              <ChevronLeft/>
            </Fab>
          </Tooltip>
        </Grid>
        <Grid
          item
          xs={4}
          sx={{ textAlign: 'center' }}
        >
          <Zoom
            in={!weeks.current.some((day) => (
              day.format(DATE_DISPLAY_FORMAT) === TODAY.format(DATE_DISPLAY_FORMAT)
            ))}
          >
            <Fab
              color="primary"
              variant="extended"
              onClick={() => setWeeks((oldWeeks) => getWeek(oldWeeks, 'current'))}
            >
              Текущая неделя
            </Fab>
          </Zoom>
        </Grid>
        <Grid
          item
          xs={4}
          sx={{ textAlign: 'end' }}
        >
          <Tooltip title="Следующая неделя">
            <Fab
              color="primary"
              onClick={() => setWeeks((oldWeeks) => getWeek(oldWeeks, 'next'))}
            >
              <ChevronRight/>
            </Fab>
          </Tooltip>
        </Grid>
      </Grid>
    </>
  );
};

export default WeeksSchedule;
