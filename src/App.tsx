import { LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterMoment';
import ContextProvider from 'context';
import 'moment/locale/ru';
import React from 'react';
import AddWorkout from './pages/AddWorkout';
import MainPage from './pages/MainPage';

const App = () => (
  <LocalizationProvider dateAdapter={DateAdapter}>
    <ContextProvider>
      <MainPage/>
      <AddWorkout/>
    </ContextProvider>
  </LocalizationProvider>
);

export default App;
