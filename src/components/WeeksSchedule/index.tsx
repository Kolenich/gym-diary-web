import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { AppBar, Box, Fab, Theme, Toolbar, Tooltip, Typography, Zoom } from '@mui/material';
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
    <Box sx={{ position: 'relative', height: '100vh' }}>
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
      <Typography component="div" sx={{ m: 2, display: 'flex', flexWrap: 'wrap' }}>
        {weeks.current.slice(0, WORKOUT_DAYS).map((day) => (
          <DayCard key={day.format('dddd')} day={day}/>
        ))}
      </Typography>
      <Tooltip title="Предыдущая неделя">
        <Fab
          sx={{
            position: 'absolute',
            bottom: (theme: Theme) => theme.spacing(2),
            left: (theme: Theme) => theme.spacing(2),
          }}
          color="primary"
          onClick={() => setWeeks((oldWeeks) => getWeek(oldWeeks, 'previous'))}
        >
          <ChevronLeft/>
        </Fab>
      </Tooltip>
      <Zoom
        in={!weeks.current.some((day) => (
          day.format(DATE_DISPLAY_FORMAT) === TODAY.format(DATE_DISPLAY_FORMAT)
        ))}
      >
        <Fab
          sx={{
            position: 'absolute',
            bottom: (theme: Theme) => theme.spacing(2),
            left: '50%',
          }}
          color="primary"
          variant="extended"
          onClick={() => setWeeks((oldWeeks) => getWeek(oldWeeks, 'current'))}
        >
          Текущая неделя
        </Fab>
      </Zoom>
      <Tooltip title="Следующая неделя">
        <Fab
          sx={{
            position: 'absolute',
            bottom: (theme: Theme) => theme.spacing(2),
            right: (theme: Theme) => theme.spacing(2),
          }}
          color="primary"
          onClick={() => setWeeks((oldWeeks) => getWeek(oldWeeks, 'next'))}
        >
          <ChevronRight/>
        </Fab>
      </Tooltip>
    </Box>
  );
};

export default WeeksSchedule;
