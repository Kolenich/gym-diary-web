import type { FC } from 'react';

import { Navigate, Route, Routes } from 'react-router-dom';

import { WeeksSchedule } from 'pages/WeeksSchedule';
import { WorkoutDetail } from 'pages/WorkoutDetail';

import { ERoutePaths } from './RootRouter.constants';

const RootRouter: FC = () => (
  <Routes>
    <Route path={ERoutePaths.Home}>
      <Route index element={<Navigate to={ERoutePaths.Workouts} />} />
      <Route path={ERoutePaths.Workouts}>
        <Route index element={<WeeksSchedule />} />
        <Route path={ERoutePaths.WorkoutDetail} element={<WorkoutDetail />} />
      </Route>
    </Route>
  </Routes>
);

export default RootRouter;
