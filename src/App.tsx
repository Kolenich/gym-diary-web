import { LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterMoment';
import ContextProvider from 'context';
import 'moment/locale/ru';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import RootRouter from 'routers/RootRouter';
import APIProvider from './api';

const App = () => (
  <BrowserRouter>
    <LocalizationProvider dateAdapter={DateAdapter}>
      <SnackbarProvider>
        <APIProvider>
          <ContextProvider>
            <RootRouter/>
          </ContextProvider>
        </APIProvider>
      </SnackbarProvider>
    </LocalizationProvider>
  </BrowserRouter>
);

export default App;
