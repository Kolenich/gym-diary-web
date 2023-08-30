import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { ruRU } from '@mui/x-date-pickers/locales';
import { SnackbarProvider } from 'notistack';
import type { FC } from 'react';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import { RootRouter } from './routers/RootRouter';
import { store } from './store';

const App: FC = () => (
  <Provider store={store}>
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
