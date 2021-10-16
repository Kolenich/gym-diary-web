import { LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterMoment';
import ContextProvider from 'context';
import 'moment/locale/ru';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import RootRouter from 'routers/RootRouter';

const App = () => (
  <BrowserRouter>
    <LocalizationProvider dateAdapter={DateAdapter}>
      <ContextProvider>
        <RootRouter/>
      </ContextProvider>
    </LocalizationProvider>
  </BrowserRouter>
);

export default App;
