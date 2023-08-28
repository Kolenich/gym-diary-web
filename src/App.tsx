import type { FC } from 'react';

import { BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { ruRU } from '@mui/x-date-pickers/locales';

import { SnackbarProvider } from 'notistack';

import { RootRouter } from './routers/RootRouter';
import { store } from './store';

const App: FC = () => (
  <BrowserRouter>
    <Provider store={store}>
      <LocalizationProvider
        dateAdapter={AdapterMoment}
        localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}
      >
        <SnackbarProvider>
          <RootRouter />
        </SnackbarProvider>
      </LocalizationProvider>
    </Provider>
  </BrowserRouter>
);

export default App;
