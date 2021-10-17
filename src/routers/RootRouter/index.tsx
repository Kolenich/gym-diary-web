import MainPage from 'components/MainPage';
import WorkoutModal from 'components/WorkoutModal';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const RootRouter = () => (
  <Switch>
    <Route path="/workouts/:id" component={WorkoutModal}/>
    <Route path="/workouts" component={MainPage}/>
    <Route path="/">
      <Redirect to="/workouts"/>
    </Route>
    <Route/>
  </Switch>
);

export default RootRouter;
