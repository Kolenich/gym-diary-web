import ContextProvider from 'context';
import MainPage from 'pages/Main';
import React from 'react';

const App = () => (
  <ContextProvider>
    <MainPage/>
  </ContextProvider>
);

export default App;
