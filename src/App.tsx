import { type FC } from 'react';

import { RouterProvider } from 'react-router-dom';

import { Provider } from 'react-redux';

import { RootRouter } from './routers/RootRouter';
import store from './store/store';

const App: FC = () => (
  <Provider store={store}>
    <RouterProvider router={RootRouter} />
  </Provider>
);

export default App;
