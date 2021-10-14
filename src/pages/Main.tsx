import { AppBar, Toolbar } from '@mui/material';
import { Context } from 'context';
import React, { useContext } from 'react';

const MainPage = () => {
  const { workouts } = useContext(Context);

  console.log(workouts);

  return (
    <AppBar>
      <Toolbar>
        Дневник кочки
      </Toolbar>
    </AppBar>
  );
};

export default MainPage;
