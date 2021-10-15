import { LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterMoment';
import ContextProvider from 'context';
import 'moment/locale/ru';
import WorkoutModal from 'pages/WorkoutModal';
import MainPage from 'pages/MainPage';
import React from 'react';

const App = () => (
  <LocalizationProvider dateAdapter={DateAdapter}>
    <ContextProvider>
      <MainPage/>
      <WorkoutModal/>
    </ContextProvider>
  </LocalizationProvider>
);

export default App;
