import { WeeksSchedule, WorkoutDetail } from 'pages';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const RootRouter = () => (
  <Switch>
    <Route path="/workouts/:id" component={WorkoutDetail}/>
    <Route path="/workouts" component={WeeksSchedule}/>
    <Route path="/">
      <Redirect to="/workouts"/>
    </Route>
    <Route/>
  </Switch>
);

export default RootRouter;
