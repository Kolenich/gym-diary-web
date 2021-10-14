import {
  AppBar,
  Card,
  CardActionArea,
  CardContent,
  Paper,
  Toolbar,
  Typography,
} from '@mui/material';
import { title } from 'lib/utils';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Weeks } from './types';

const MainPage = () => {
  const [weeks, setWeeks] = useState<Weeks>({
    previous: [],
    current: [],
    next: [],
  });

  /** Effect for calculating weeks */
  useEffect(() => {
    const currentWeek = [];
    const previousWeek = [];
    const nextWeek = [];

    for (let i = 1; i <= 7; i += 1) {
      const dayOfCurrWeek = moment().set('day', i);
      const dayOfPreviousWeek = moment().add(-7, 'days').set('day', i);
      const dayOfNextWeek = moment().add(7, 'days').set('day', i);

      currentWeek.push(dayOfCurrWeek);
      previousWeek.push(dayOfPreviousWeek);
      nextWeek.push(dayOfNextWeek);
    }

    setWeeks({
      previous: previousWeek,
      current: currentWeek,
      next: nextWeek,
    });
  }, []);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Дневник кочки
          </Typography>
          <Typography variant="h6" component="div">
            {moment().year()} г.
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper sx={{ m: 2, display: 'flex', alignItems: 'center' }}>
        {weeks.current.map((day) => (
          <Card key={day.format('dddd')} sx={{ m: 2 }}>
            <CardActionArea>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {title(day.locale('ru').format('dddd'))} ({day?.format('DD.MM.yyyy')})
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lizards are a widespread group of squamate reptiles, with over 6,000
                  species, ranging across all continents except Antarctica
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Paper>
    </>
  );
};

export default MainPage;
