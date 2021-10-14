import ContextProvider from 'context';
import 'moment/locale/ru';
import MainPage from 'pages/MainPage';
import React from 'react';

const App = () => (
  <ContextProvider>
    <MainPage/>
  </ContextProvider>
);

export default App;
