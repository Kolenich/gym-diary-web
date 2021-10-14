import AddWorkout from 'pages/AddWorkout';
import MainPage from 'pages/MainPage';
import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

const RootRouter = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/workouts/add" exact component={AddWorkout}/>
      <Route path="/workouts" exact component={MainPage}/>
      <Route path="/">
        <Redirect to="/workouts"/>
      </Route>
    </Switch>
  </BrowserRouter>
);

export default RootRouter;
