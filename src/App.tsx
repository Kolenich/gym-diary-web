import { type FC } from 'react';

import { RouterProvider } from 'react-router-dom';

import { Provider } from 'react-redux';

import { GlobalStyles } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { ruRU } from '@mui/x-date-pickers/locales';

import { SnackbarProvider } from 'notistack';

import { RootRouter } from './routers/RootRouter';
import store from './store/store';

const App: FC = () => (
  <Provider store={store}>
    <GlobalStyles styles={{ body: { margin: 0 } }} />
    <LocalizationProvider
      dateAdapter={AdapterMoment}
      localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}
    >
      <SnackbarProvider>
        <RouterProvider router={RootRouter} />
      </SnackbarProvider>
    </LocalizationProvider>
  </Provider>
);

export default App;
