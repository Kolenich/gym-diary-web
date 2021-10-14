import ContextProvider from 'context';
import 'moment/locale/ru';
import React from 'react';
import RootRouter from 'routes/RootRouter';

const App = () => (
  <ContextProvider>
    <RootRouter/>
  </ContextProvider>
);

export default App;
