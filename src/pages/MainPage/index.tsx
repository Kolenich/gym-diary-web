import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { AppBar, Box, Fab, Theme, Toolbar, Typography } from '@mui/material';
import DayCard from 'components/DayCard';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Weeks } from './types';
import getWeek from './utils';

const MainPage = () => {
  const [weeks, setWeeks] = useState<Weeks>({
    previous: [],
    current: [],
    next: [],
  });

  /** Effect for calculating weeks */
  useEffect(() => {
    setWeeks((oldWeeks) => getWeek(oldWeeks, 'current'));
  }, []);

  return (
    <Box sx={{ position: 'relative', height: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Дневник кочки
          </Typography>
          <Typography variant="h6" component="div">
            {(weeks.current.filter((day) => day.day() === moment().day())[0] || moment()).year()} г.
          </Typography>
        </Toolbar>
      </AppBar>
      <Typography component="div" sx={{ m: 2, display: 'flex', flexWrap: 'wrap' }}>
        {weeks.current.map((day) => (
          <DayCard key={day.format('dddd')} day={day}/>
        ))}
      </Typography>
      <Fab
        sx={{
          position: 'absolute',
          bottom: (theme: Theme) => theme.spacing(2),
          left: (theme: Theme) => theme.spacing(2),
        }}
        color="primary"
        variant="extended"
        onClick={() => setWeeks(getWeek(weeks, 'previous'))}
      >
        <ChevronLeft/>
        Предыдущая неделя
      </Fab>
      <Fab
        sx={{
          position: 'absolute',
          bottom: (theme: Theme) => theme.spacing(2),
          left: '50%',
        }}
        color="primary"
        variant="extended"
        onClick={() => setWeeks(getWeek(weeks, 'current'))}
      >
        Текущая неделя
      </Fab>
      <Fab
        sx={{
          position: 'absolute',
          bottom: (theme: Theme) => theme.spacing(2),
          right: (theme: Theme) => theme.spacing(2),
        }}
        color="primary"
        variant="extended"
        onClick={() => setWeeks(getWeek(weeks, 'next'))}
      >
        Следующая неделя
        <ChevronRight/>
      </Fab>
    </Box>
  );
};

export default MainPage;
